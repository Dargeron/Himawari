#!/usr/bin/env python3
"""Rebuild the self-hosted, subset WOFF2 fonts in assets/fonts/.

All three families are licensed under the SIL Open Font License 1.1 and none
declares a Reserved Font Name, so subsets keep their names. The sources are
the npm packages below; each ships its font as unicode-range chunks, so this
tool subsets every chunk to the characters the game shows and merges the
pieces into one file per face.

  @fontsource/eb-garamond@5.3.0   EB Garamond 400, 400 italic, 500
  @fontsource/caveat@5.3.0        Caveat 500, 600
  lxgw-wenkai-webfont@1.7.0       LXGW WenKai 400

Usage:
  python3 tools/fonts.py --fetch DIR   download the packages into DIR (npm pack),
                                       unpack them, then build
  python3 tools/fonts.py DIR           build from packages already unpacked as
                                       DIR/<package>/ (e.g. DIR/caveat/files/...)

Run it again whenever story text or interface strings gain new characters.
Requires: pip install fonttools brotli
"""
from pathlib import Path
import argparse, io, json, re, subprocess, sys, tarfile, tempfile

from fontTools import subset
from fontTools.merge import Merger
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets/fonts'
PACKAGES = {
    'eb-garamond': '@fontsource/eb-garamond@5.3.0',
    'caveat': '@fontsource/caveat@5.3.0',
    'lxgw-wenkai-webfont': 'lxgw-wenkai-webfont@1.7.0',
}
LICENSES = {
    'eb-garamond': ('LICENSE', 'EB-Garamond-OFL.txt'),
    'caveat': ('LICENSE', 'Caveat-OFL.txt'),
    'lxgw-wenkai-webfont': ('OFL.txt', 'LXGW-WenKai-OFL.txt'),
}
FACES = [
    # output, package, chunk glob, character set
    ('eb-garamond-regular.woff2', 'eb-garamond', 'files/eb-garamond-*-400-normal.woff2', 'latin'),
    ('eb-garamond-italic.woff2', 'eb-garamond', 'files/eb-garamond-*-400-italic.woff2', 'latin'),
    ('eb-garamond-medium.woff2', 'eb-garamond', 'files/eb-garamond-*-500-normal.woff2', 'latin'),
    ('caveat-medium.woff2', 'caveat', 'files/caveat-*-500-normal.woff2', 'latin'),
    ('caveat-semibold.woff2', 'caveat', 'files/caveat-*-600-normal.woff2', 'latin'),
    ('lxgw-wenkai-regular.woff2', 'lxgw-wenkai-webfont', 'files/lxgwwenkai-regular-subset-*.woff2', 'cjk'),
]

ASCII = set(range(0x20, 0x7F))
LATIN_BASE = ASCII | set(range(0xA0, 0x100)) | set(range(0x2010, 0x2028)) | {0x2030, 0x2039, 0x203A, 0x20AC, 0x2122}
CJK_BASE = ASCII | {0x00B7, 0x2014, 0x2018, 0x2019, 0x201C, 0x201D, 0x2026} | set(range(0x3000, 0x3020)) | set(range(0xFF01, 0xFF5F))


def is_wide(cp):
    """CJK ideographs, kana, CJK punctuation and fullwidth forms."""
    return cp >= 0x2E80


def strings(value, key=None, only_text=False):
    if isinstance(value, dict):
        for k, v in value.items():
            if not only_text:
                yield k
            yield from strings(v, k, only_text)
    elif isinstance(value, list):
        for v in value:
            yield from strings(v, key, only_text)
    elif isinstance(value, str) and (not only_text or key == 'text'):
        yield value


def characters(texts):
    return {ord(c) for text in texts for c in text}


def read_json(path):
    return json.loads(path.read_text())


def character_sets():
    ui = [s for p in sorted(ROOT.glob('locales/*/ui*.json')) for s in strings(read_json(p))]
    page = [(ROOT / 'src/index.html').read_text()]
    # Latin faces: every non-CJK character in the story text of both editions,
    # the interface strings and the locale modules, plus Latin-1 and
    # typographic punctuation.
    story = [s for p in sorted(ROOT.glob('locales/*/literals.json')) for s in strings(read_json(p), only_text=True)]
    modules = [p.read_text() for p in sorted(ROOT.glob('src/locales/*.js'))]
    latin = LATIN_BASE | {cp for cp in characters(story + ui + modules + page) if not is_wide(cp) and cp >= 0x20}
    # LXGW WenKai: every wide character the Chinese edition can show (text
    # fields of its language pack, its translations, its locale module, all
    # interface strings, the page), plus ASCII and CJK punctuation.
    chinese = [s for p in sorted(ROOT.glob('locales/zh-CN/*.json')) for s in strings(read_json(p), only_text=True)]
    chinese += list(strings(read_json(ROOT / 'locales/zh-CN/zh-CN.json')))
    chinese += [(ROOT / 'src/locales/zh-CN.js').read_text()]
    cjk = CJK_BASE | {cp for cp in characters(chinese + ui + page) if is_wide(cp)}
    return {'latin': latin, 'cjk': cjk}


def subset_chunk(path, wanted):
    font = TTFont(path, recalcTimestamp=False)
    present = set(font.getBestCmap()) & wanted
    if not present:
        return None
    options = subset.Options()
    options.layout_features = ['*']
    options.name_IDs = [0, 1, 2, 3, 4, 5, 6, 13, 14]  # keep copyright and licence
    options.notdef_outline = True
    options.drop_tables += ['DSIG']
    subsetter = subset.Subsetter(options)
    subsetter.populate(unicodes=present)
    subsetter.subset(font)
    font.flavor = None
    return font, present


def build_face(source, output, pattern, wanted, scratch):
    chunks = sorted((source).glob(pattern), key=lambda p: [int(t) if t.isdigit() else t for t in re.split(r'(\d+)', p.name)])
    if not chunks:
        raise SystemExit(f'No font chunks match {source / pattern}')
    pieces, covered = [], set()
    for chunk in chunks:
        result = subset_chunk(chunk, wanted - covered)
        if result:
            font, present = result
            covered |= present
            piece = scratch / f'{output}.{len(pieces)}.ttf'
            font.save(piece)
            pieces.append(piece)
    merged = TTFont(pieces[0]) if len(pieces) == 1 else Merger().merge([str(p) for p in pieces])
    # Reproducible output: keep the source's dates (Merger stamps the time).
    merged.recalcTimestamp = False
    source_head = TTFont(chunks[0])['head']
    merged['head'].created, merged['head'].modified = source_head.created, source_head.modified
    merged.flavor = 'woff2'
    buffer = io.BytesIO()
    merged.save(buffer)
    (OUT / output).write_bytes(buffer.getvalue())
    return len(buffer.getvalue()), len(covered), merged['name'].getDebugName(0) or ''


def fetch(directory):
    directory.mkdir(parents=True, exist_ok=True)
    for name, spec in PACKAGES.items():
        result = subprocess.run(['npm', 'pack', spec, '--silent'], cwd=directory, capture_output=True, text=True, check=True)
        tarball = directory / result.stdout.strip().splitlines()[-1]
        target = directory / name
        with tempfile.TemporaryDirectory(dir=directory) as temp, tarfile.open(tarball) as archive:
            archive.extractall(temp, filter='data')
            (Path(temp) / 'package').rename(target)
        tarball.unlink()


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('source', type=Path, help='directory holding the unpacked packages')
    parser.add_argument('--fetch', action='store_true', help='download and unpack the packages into SOURCE first')
    args = parser.parse_args()
    if args.fetch:
        fetch(args.source)
    sets = character_sets()
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / 'LICENSES').mkdir(exist_ok=True)
    report = {}
    with tempfile.TemporaryDirectory() as scratch:
        for output, package, pattern, charset in FACES:
            size, glyphs, copyright = build_face(args.source / package, output, pattern, sets[charset], Path(scratch))
            report[output] = {'bytes': size, 'characters': glyphs}
            license_name, target = LICENSES[package]
            text = (args.source / package / license_name).read_text()
            if not text.lstrip().startswith('Copyright') and copyright:
                text = copyright.strip() + '\n\n' + text
            (OUT / 'LICENSES' / target).write_text(text.replace('\r\n', '\n'))
    print(json.dumps(report, indent=2))


if __name__ == '__main__':
    sys.exit(main())
