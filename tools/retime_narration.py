#!/usr/bin/env python3
"""Re-time an edition's narration clips against the recordings themselves.

Each recording holds many passages back to back; locales/<code>/narration.json
says where each passage starts and ends. Those timings originally came from the
voice service's alignment, which drifts by seconds, so passages started
mid-sentence and ran on into the next line. This tool:

1. transcribes every recording with word timestamps (faster-whisper; cached in
   .cache/narration-words/<code>/),
2. finds each passage's words in the transcript (English: in order, against the
   generation record next to the recording; Chinese: anywhere in the file,
   compared by pinyin, because the old timings are not reliably in order and the
   recogniser picks homophones),
3. cuts at the quietest moment between the passage and its neighbours,
4. leaves out passages the narrator never said (or said differently), and lists
   them in locales/<code>/narration-gaps.json so the tests know.

Lists of short utterances (spelled letters) are cut at the silences instead.

Usage: python3 tools/retime_narration.py en|zh-CN [--model small.en|small]
Needs: pip install faster-whisper pypinyin opencc-python-reimplemented, ffmpeg.
"""
import argparse, difflib, json, os, re, subprocess, sys
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[1]
SR, HOP = 16000, 0.01


def pcm(path, rate=SR):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(path), '-f', 's16le', '-ac', '1', '-ar', str(rate), '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float32) / 32768


def transcribe(code, files, model_name):
    from faster_whisper import WhisperModel
    cache = ROOT / '.cache/narration-words' / code
    cache.mkdir(parents=True, exist_ok=True)
    model = None
    for f in files:
        dest = cache / (Path(f).stem + '.json')
        if dest.exists():
            continue
        model = model or WhisperModel(model_name, device='cpu', compute_type='int8')
        segments, _ = model.transcribe(pcm(ROOT / f), language='en' if code == 'en' else 'zh', word_timestamps=True,
                                       beam_size=5, condition_on_previous_text=False)
        words = [{'w': w.word, 's': w.start, 'e': w.end} for s in segments for w in s.words]
        dest.write_text(json.dumps(words, ensure_ascii=False))
        print('transcribed', f, len(words), flush=True)
    return cache


class Edition:
    def __init__(self, code):
        self.code = code
        self.en = code == 'en'
        self.manifest = json.loads((ROOT / f'locales/{code}/narration.json').read_text())
        self.literals = json.loads((ROOT / f'locales/{code}/literals.json').read_text())
        if not self.en:
            from opencc import OpenCC
            from pypinyin import lazy_pinyin
            self.simplify, self.pinyin = OpenCC('t2s').convert, lazy_pinyin

    def tokens(self, text):
        """Spoken tokens with character spans: words (English) or syllables as pinyin (Chinese)."""
        text = re.sub(r'\[[^\]]*\]', lambda m: ' ' * len(m.group()), text)  # audio tags are not spoken
        if self.en:
            return [(m.group().lower().replace('’', "'").strip("'"), m.start(), m.end())
                    for m in re.finditer(r"[\w’']+", text)]
        found = [(m.group().lower(), m.start(), m.end()) for m in re.finditer(r'[一-鿿]|[a-zA-Z]+|\d', text)]
        sounds = self.pinyin([t for t, _, _ in found], errors='default')
        return [(p, s, e) for p, (_, s, e) in zip(sounds, found)] if len(sounds) == len(found) else found

    def heard(self, words):
        """Transcript tokens with times; a multi-character Chinese token's time is shared out."""
        out = []
        for w in words:
            text = w['w'] if self.en else self.simplify(w['w'])
            ts = [t for t, _, _ in self.tokens(text)]
            for k, t in enumerate(ts):
                out.append((t, w['s'] + (w['e'] - w['s']) * k / len(ts), w['s'] + (w['e'] - w['s']) * (k + 1) / len(ts)))
        return out

    def record(self, f):
        """What was read into a recording: the generation record next to it (English), or
        the passages in their current order with the edition's text (Chinese)."""
        meta = ROOT / (f[:-4] + '.json')
        if meta.exists():
            return json.loads(meta.read_text())
        clips = sorted((v['start'], k) for k, v in self.manifest.items() if v['file'] == f and k in self.literals)
        src, items = '', []
        for _, k in clips:
            t = self.literals[k]['text']
            items.append({'id': k, 'start': len(src), 'end': len(src) + len(t)})
            src += t + '\n'
        return {'source_text': src, 'items': items}


def envelope(path):
    a = pcm(path)
    h = int(SR * HOP)
    n = len(a) // h
    e = np.sqrt((a[:n * h].reshape(n, h) ** 2).mean(1))
    return np.convolve(e, np.ones(3) / 3, 'same'), len(a) / SR


def quiet_cut(env, lo, hi):
    """Middle of the longest quiet run inside [lo, hi], and its length (s)."""
    i, j = max(0, int(lo / HOP)), min(len(env), int(hi / HOP) + 1)
    if j - i < 2:
        return (lo + hi) / 2, 0
    seg = env[i:j]
    thr = max(0.006, np.percentile(seg, 10) * 1.8)
    best, run = (0, None), 0
    for k, v in enumerate(seg):
        run = run + 1 if v <= thr else 0
        if run > best[0]:
            best = (run, k - run + 1)
    if best[1] is None:
        return (i + int(np.argmin(seg))) * HOP, 0
    return (i + best[1] + best[0] / 2) * HOP, best[0] * HOP


def speech_edges(env, t0, t1):
    i, j = int(t0 / HOP), int(t1 / HOP)
    seg = env[i:j]
    loud = np.where(seg > max(0.012, seg.max() * 0.05))[0] if len(seg) else []
    return ((i + loud[0]) * HOP, (i + loud[-1] + 1) * HOP) if len(loud) else (t0, t1)


def settle(env, t, direction, quiet=0.02, need=0.08, limit=0.8):
    """If a cut lands in speech (the recogniser's timestamps lag), slide it back (or forward)
    to the nearest stretch of silence, so a clip never starts or ends mid-word."""
    k, run, step = int(t / HOP), 0, int(need / HOP)
    if env[max(0, k - 2):k + 3].max() <= quiet:
        return t
    for n in range(int(limit / HOP)):
        i = k + direction * n
        if not 0 <= i < len(env):
            break
        run = run + 1 if env[i] <= quiet else 0
        if run >= step:
            return round((i - direction * (step // 2)) * HOP, 3)  # inside the silence, near the speech
    return t


def best_window(want, heard, candidates, near=None):
    """Best-matching transcript window starting near the candidates; among equally good
    windows (a line said twice) the one nearest the old timing."""
    words = [t for t, _, _ in heard]
    found = []
    for o in candidates:
        for a in range(max(0, o - 4), min(len(heard), o + 5)):
            for n in range(max(1, int(len(want) * 0.7)), int(len(want) * 1.3) + 3):
                b = min(len(heard), a + n)
                found.append((difflib.SequenceMatcher(None, want, words[a:b], autojunk=False).ratio(), (a, b - 1)))
    if not found:
        return 0, None
    top = max(q for q, _ in found)
    good = [x for x in found if x[0] >= top - 0.04]
    good.sort(key=lambda x: (abs(heard[x[1][0]][1] - near), -x[0]) if near is not None else -x[0])
    return good[0]


def locate(want, heard, near):
    """Anywhere in the file: n-gram votes pick starting points, then the best window."""
    gram = 2 if len(want) >= 2 else 1
    index = {}
    for k in range(len(heard) - gram + 1):
        index.setdefault(tuple(t for t, _, _ in heard[k:k + gram]), []).append(k)
    votes = {}
    for j in range(len(want) - gram + 1):
        for k in index.get(tuple(want[j:j + gram]), []):
            votes[k - j] = votes.get(k - j, 0) + 1
    cands = sorted(votes, key=lambda o: -sum(votes.get(o + d, 0) for d in range(-3, 4)))[:4]
    return best_window(want, heard, cands, near)


def retime_file(ed, f, words, out, gaps):
    rec = ed.record(f)
    src = rec['source_text']
    items = [it for it in rec['items'] if it['id'] in ed.manifest and ed.manifest[it['id']]['file'] == f
             and it['id'].split(':')[0] not in ('number', 'letter', 'word', 'syllable')]
    if not items:
        return
    st, heard = ed.tokens(src), ed.heard(words)
    match = {}
    if ed.en:
        sm = difflib.SequenceMatcher(None, [t for t, _, _ in st], [t for t, _, _ in heard], autojunk=False)
        for a, b, size in sm.get_matching_blocks():
            match.update({a + k: b + k for k in range(size)})
    env, dur = envelope(ROOT / f)
    for it in items:
        idx = [k for k, (_, s, e) in enumerate(st) if s >= it['start'] and e <= it['end']]
        want = [st[k][0] for k in idx]
        old = ed.manifest[it['id']]
        if not want:
            continue
        if ed.en:
            m = [match[k] for k in idx if k in match]
            q = len(m) / len(want)
            if q < 0.6:
                # repeated phrases confuse the in-order alignment: look near the old timing
                near = [k for k, (_, s, _) in enumerate(heard) if old['start'] - 8 <= s <= old['end'] + 8]
                q, span = best_window(want, heard, near)
                if not span or q < (0.6 if len(want) >= 5 else 0.75):
                    gaps[it['id']] = 'not found in the recording'
                    continue
                a, b = span
                while a > 0 and b - a + 1 < len(want) and heard[a][1] - heard[a - 1][2] < 0.12:
                    a -= 1  # misheard words at the edge belong to the line if no pause separates them
                m = list(range(a, b + 1))
        else:
            q, span = locate(want, heard, old['start'])
            if not span or q < (0.6 if len(want) >= 6 else 0.75):
                gaps[it['id']] = 'not found in the recording'
                continue
            m = list(range(span[0], span[1] + 1))
        clip = cut(ed, f, env, dur, heard, m, q, want)
        if isinstance(clip, str):
            gaps[it['id']] = clip
        else:
            out[it['id']] = clip


def cut(ed, f, env, dur, heard, m, q, want):
    """The clip for transcript words m: from the quiet before the first to the quiet after the last."""
    first, last = heard[m[0]], heard[m[-1]]
    lo = heard[m[0] - 1][2] - 0.05 if m[0] > 0 else max(0, first[1] - 1.5)
    start, quiet_before = quiet_cut(env, min(lo, first[1] + 0.1), first[1] + 0.15)
    hi = heard[m[-1] + 1][1] + 0.05 if m[-1] + 1 < len(heard) else min(dur, last[2] + 1.5)
    end, quiet_after = quiet_cut(env, last[2] - 0.15, max(hi, last[2] - 0.1))
    if not ed.en and len(want) < 6 and q < 0.95 and min(quiet_before, quiet_after) < 0.08:
        return 'only found inside another sentence'
    s2, e2 = speech_edges(env, start, end)
    start, end = settle(env, max(start, s2 - 0.08), -1), settle(env, min(end, e2 + 0.12), 1)
    return {'file': f, 'start': round(max(0, start), 3), 'end': round(min(dur, end), 3)}


def search_elsewhere(ed, key, transcripts, out):
    """Chinese repairs re-recorded some passages in other files: look for a missing
    passage in every transcribed recording."""
    want = [t for t, _, _ in ed.tokens(ed.literals[key]['text'])]
    if not want:
        return False
    best = (0, None, None)
    for f, heard in transcripts.items():
        q, span = locate(want, heard, None)
        if span and q > best[0]:
            best = (q, f, span)
    q, f, span = best
    if not span or q < (0.75 if len(want) >= 6 else 0.9):
        return False
    env, dur = envelope(ROOT / f)
    clip = cut(ed, f, env, dur, transcripts[f], list(range(span[0], span[1] + 1)), q, want)
    if isinstance(clip, str):
        return False
    out[key] = clip
    return True


def retime_list(ed, f, out):
    """A recording of short utterances: one speech run per item, in order."""
    rec = ed.record(f)
    items = [it['id'] for it in rec['items'] if it['id'].split(':')[0] in ('letter', 'word')]
    if not items:
        return
    env, dur = envelope(ROOT / f)
    t0 = max([out[i['id']]['end'] for i in rec['items'] if i['id'] in out and i['id'] not in items] or [0]) + 0.05
    loud = env[int(t0 / HOP):] > 0.02
    runs, start, last = [], None, None
    for k, v in enumerate(loud):
        t = t0 + k * HOP
        if v:
            if start is None:
                start = t
            elif t - last > 0.18:
                runs.append((start, last + HOP))
                start = t
            last = t
    if start is not None:
        runs.append((start, last + HOP))
    runs = [r for r in runs if r[1] - r[0] > 0.06]
    if len(runs) != len(items):
        print(f'{f}: {len(runs)} utterances for {len(items)} items; list left as it was', file=sys.stderr)
        return
    for key, (s, e) in zip(items, runs):
        out[key] = {'file': f, 'start': round(max(t0, s - 0.06), 3), 'end': round(min(dur, e + 0.1), 3)}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('code', choices=['en', 'zh-CN'])
    ap.add_argument('--model', default=None)
    args = ap.parse_args()
    ed = Edition(args.code)
    gaps_path = ROOT / f'locales/{args.code}/narration-gaps.json'
    gaps_doc = json.loads(gaps_path.read_text()) if gaps_path.exists() else {'unspoken': {}, 'numbers': True}
    story_files = sorted({v['file'] for k, v in ed.manifest.items()
                          if k.split(':')[0] not in ('number', 'syllable')})
    cache = transcribe(args.code, story_files, args.model or ('small.en' if ed.en else 'small'))
    out, gaps = dict(ed.manifest), {}
    for f in story_files:
        words = json.loads((cache / (Path(f).stem + '.json')).read_text())
        retime_file(ed, f, words, out, gaps)
        retime_list(ed, f, out)
    if not ed.en:
        transcripts = {}
        for path in sorted(cache.glob('*.json')):
            f = f'assets/narration/{args.code}/{path.stem}.m4a'
            if (ROOT / f).exists():
                transcripts[f] = ed.heard(json.loads(path.read_text()))
        for key in list(gaps):
            if search_elsewhere(ed, key, transcripts, out):
                del gaps[key]
    for key in gaps:
        out.pop(key, None)
    if args.code == 'en' and not gaps_doc.get('numbers', True):
        out = {k: v for k, v in out.items() if not k.startswith('number:')}
    (ROOT / f'locales/{args.code}/narration.json').write_text(json.dumps(out, ensure_ascii=False, indent=2) + '\n')
    gaps_doc['unspoken'] = dict(sorted({**gaps, **gaps_doc.get('unspoken', {})}.items()))
    gaps_path.write_text(json.dumps(gaps_doc, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'clips': len(out), 'unspoken': sorted(gaps)}, ensure_ascii=False))


if __name__ == '__main__':
    main()
