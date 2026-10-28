#!/usr/bin/env python3
"""Validate an edition's media offline: narration coverage and clip timing,
the author's original artwork, the narrator's identity, and that no
credential has slipped into the repository.

Usage: python3 tests/assets.py [en|zh-CN]   (needs ffprobe and Pillow)
"""
from pathlib import Path
import concurrent.futures, hashlib, json, math, re, subprocess, sys
from PIL import Image, ImageChops

ROOT = Path(__file__).resolve().parents[1]
CODE = sys.argv[1] if len(sys.argv) > 1 else 'en'
assert CODE in ('en', 'zh-CN'), CODE
PACK = ROOT / 'locales' / CODE
read = lambda path: json.loads(path.read_text())
sha = lambda data: hashlib.sha256(data).hexdigest()

manifest = read(PACK / 'narration.json')
gaps = read(PACK / 'narration-gaps.json') if (PACK / 'narration-gaps.json').exists() else {'unspoken': {}, 'numbers': True}
literals = read(PACK / 'literals.json')

# Every authored passage and choice is narrated.
if CODE == 'en':
    missing = []
    for key, value in literals.items():
        i, text = int(key), value['text'].strip()
        if not (1838 <= i <= 2355 or 2464 <= i <= 2479) or not re.search('[A-Za-z]', text) or len(text) < 5:
            continue
        if re.match(r'^(Going to |Option [1-4] - |Default case|Resetting |Text answer:|intro\d*$)', text) or text == '< Continue >':
            continue
        if key not in manifest and key not in gaps['unspoken']:
            missing.append(key)
    assert not missing, ('Missing narration', missing)
else:
    expected = read(PACK / 'narration.en.json')
    authored = [k for k in expected if k.isdigit()]
    assert len(authored) == 458
    for key in authored:
        assert key in manifest or key in gaps['unspoken'], ('Missing Mandarin narration', key)
        assert re.search('[一-鿿]', literals[key]['text']), ('Untranslated story', key)
for i in range(301):
    assert (f'number:{i}' in manifest) == gaps['numbers'], i
assert not set(gaps['unspoken']) & set(manifest), 'An unspoken passage still has a clip'
prefix = f'assets/narration/{CODE}/'
assert all(v['file'].startswith(prefix) for v in manifest.values()), 'Another edition’s voice is referenced'

# Clip boundaries fall inside their recordings.
files = sorted({ROOT / v['file'] for v in manifest.values()} | set(ROOT.glob('assets/music/*.m4a')))


def probe(path):
    result = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'json', str(path)],
                            capture_output=True, text=True, check=True)
    duration = float(json.loads(result.stdout)['format']['duration'])
    assert duration > 0, path
    return str(path.relative_to(ROOT)), duration


with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
    durations = dict(pool.map(probe, files))
for key, clip in manifest.items():
    assert 0 <= clip['start'] < clip['end'] <= durations[clip['file']] + 0.25, (key, clip)
assert len(list(ROOT.glob('assets/music/*.m4a'))) == 13

# Ambient loops: one file per name in the place map, nothing unused, every
# third-party recording credited with its source and licence.
ambience = read(ROOT / 'content/ambience.json')
loops = set(ambience['places'].values()) | {ambience['night']}
assert {p.stem for p in ROOT.glob('assets/ambience/*.m4a')} == loops, 'Ambient loops and the place map differ'
for name in loops:
    stream = json.loads(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'stream=codec_name,channels:format=duration',
                                        '-of', 'json', str(ROOT / f'assets/ambience/{name}.m4a')],
                                       capture_output=True, text=True, check=True).stdout)
    assert stream['streams'][0]['codec_name'] == 'aac' and stream['streams'][0]['channels'] == 1, name
    assert 30 <= float(stream['format']['duration']) <= 90, name
credited = {r['place'] for r in ambience['recordings']}
assert credited == loops - {'scrapyard'}, 'Every recorded loop is credited (the scrapyard wind is synthesised)'
assert all(r['url'].startswith('https://') and r['licenseUrl'].startswith('https://') and r['author'] for r in ambience['recordings'])

# The author's original sprites: untouched PNGs, faithful WebP copies.
original_art = read(ROOT / 'content/original-art.json')
compression = read(ROOT / 'content/art-compression.json')['assets']
assert len(original_art) == 25
for name, entry in original_art.items():
    webp = ROOT / entry['asset']
    png = webp.with_suffix('.png')
    assert sha(png.read_bytes()) == entry['pngSHA256'], name
    with Image.open(png) as author, Image.open(webp) as image:
        original, compressed = author.convert('RGBA'), image.convert('RGBA')
        assert sha(original.tobytes()) == entry['pixelsSHA256'], ('Author PNG pixels changed', name)
        assert list(image.size) == entry['dimensions'], name
        assert compressed.getchannel('A').tobytes() == original.getchannel('A').tobytes(), ('Artwork alpha changed', name)
        record = compression[entry['asset']]
        assert sha(webp.read_bytes()) == record['sha256'], name
        if record['lossless']:
            assert compressed.tobytes() == original.tobytes(), name
        for background in ('white', 'black'):
            a = Image.alpha_composite(Image.new('RGBA', image.size, background), compressed).convert('RGB')
            b = Image.alpha_composite(Image.new('RGBA', image.size, background), original).convert('RGB')
            histogram = ImageChops.difference(a, b).histogram()
            mse = sum((i % 256) ** 2 * n for i, n in enumerate(histogram)) / (image.width * image.height * 3)
            assert mse == 0 or 10 * math.log10(255 ** 2 / mse) >= 40, ('Artwork compression quality', name)

# The narrator is the approved one, with the released recordings unchanged.
config = read(PACK / 'narrator.json')
if CODE == 'en':
    assert config['voice'] == 'Harry' and config['voice_id'] == 'SOYHLrjzK2X1ezoPC6cr'
    opening = ROOT / prefix / 'Harry-opening.m4a'
    assert sha(opening.read_bytes()) == config['opening_sha256'], 'The approved original Harry opening has changed'
else:
    assert config['voice'] == 'Julian' and config['language_code'] == 'zh'
    quality = read(PACK / 'narration-quality.json')
    assert quality['completeSpokenTimingForEveryClip'] and quality['authoredPassages'] == 458
    released = read(PACK / 'released-narration-integrity.json')
    assert sha((PACK / 'narrator.json').read_bytes()) == released['voiceConfigSHA256']
    assert set(released['files']) == {v['file'] for v in manifest.values()}
    for path, expected_audio in released['files'].items():
        audio = (ROOT / path).read_bytes()
        assert len(audio) == expected_audio['bytes'] and sha(audio) == expected_audio['sha256'], ('Released Mandarin audio changed', path)
assert not any('frantic' in p.name.lower() for p in (ROOT / prefix).iterdir())

# No credential anywhere in the source.
skip = {'.git', 'node_modules', 'dist', '.claude'}
for path in ROOT.rglob('*'):
    if path.is_file() and not skip & set(path.relative_to(ROOT).parts) and path.suffix in ('.js', '.mjs', '.json', '.html', '.py', '.md', '.txt', '.css', '.yml'):
        assert not re.search(rb'sk_[a-f0-9]{40,}', path.read_bytes()), 'Credential found in ' + str(path)

print(json.dumps({
    'language': CODE,
    'narratedAuthoredLiterals': len([k for k in manifest if k.isdigit()]),
    'dynamicNumbers': sum(k.startswith('number:') for k in manifest),
    'recordings': len({v['file'] for v in manifest.values()}),
    'narrationMinutes': round(sum(v for k, v in durations.items() if '/narration/' in k) / 60, 1),
    'musicTracks': 13,
    'ambientLoops': len(loops),
    'originalSpritesUnchanged': len(original_art),
    'credentialsExcluded': True,
}))
