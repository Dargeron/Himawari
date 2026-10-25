#!/usr/bin/env python3
"""Recompress the scene illustrations in assets/art/scenes/ for the website.

Every scene is re-encoded once with Pillow (WebP, method 6) at QUALITY, keeping
its dimensions, and content/scene-illustrations.json gets the new bytes and
sha256. content/art-recompression.json records, per picture, the hash of the
file it started from and the hash it produced, so the tool never recompresses
its own output: a run skips every file whose current hash is a recorded
output, and only encodes pictures that are new or were replaced since.

The author's originals in assets/art/original/ are never touched.

Usage:
  python3 tools/compress_art.py            recompress what still needs it
  python3 tools/compress_art.py --check    report what would change; exit 1
                                           if anything still needs encoding
Requires Pillow with WebP support.
"""
from pathlib import Path
from concurrent.futures import ProcessPoolExecutor
import argparse, hashlib, io, json, math, sys

from PIL import Image, ImageChops

ROOT = Path(__file__).resolve().parents[1]
SCENES = ROOT / 'content/scene-illustrations.json'
RECORD = ROOT / 'content/art-recompression.json'
QUALITY = 75
METHOD = 6


def sha256(data):
    return hashlib.sha256(data).hexdigest()


def psnr(a, b):
    histogram = ImageChops.difference(a, b).histogram()
    mse = sum((i % 256) ** 2 * n for i, n in enumerate(histogram)) / (a.width * a.height * 3)
    return math.inf if mse == 0 else 10 * math.log10(255 ** 2 / mse)


def encode(source, quality):
    with Image.open(io.BytesIO(source)) as image:
        size = image.size
        pixels = image.convert('RGB')
    buffer = io.BytesIO()
    pixels.save(buffer, 'WEBP', quality=quality, method=METHOD)
    output = buffer.getvalue()
    with Image.open(io.BytesIO(output)) as decoded:
        assert decoded.size == size, 'dimensions changed'
        score = psnr(pixels, decoded.convert('RGB'))
    return output, size, score


def job(args):
    asset, quality = args
    source = (ROOT / asset).read_bytes()
    output, size, score = encode(source, quality)
    return asset, source, output, size, score


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--check', action='store_true', help='only report what would be recompressed')
    args = parser.parse_args()

    scenes = json.loads(SCENES.read_text())
    record = json.loads(RECORD.read_text()) if RECORD.exists() else {
        'tool': 'tools/compress_art.py', 'format': 'webp', 'method': METHOD, 'quality': QUALITY, 'files': {}}
    produced = {entry['sha256'] for entry in record['files'].values()}

    pending = []
    for key, entry in scenes.items():
        current = sha256((ROOT / entry['asset']).read_bytes())
        if current in produced:
            continue  # already this tool's output: never encode it twice
        pending.append(entry['asset'])
    if args.check:
        print(json.dumps({'pending': pending}, indent=2))
        sys.exit(1 if pending else 0)
    if not pending:
        print('Every scene illustration is already recompressed.')
        return

    with ProcessPoolExecutor() as pool:
        results = list(pool.map(job, [(asset, QUALITY) for asset in pending]))

    # Distinct scenes must stay distinct files (tests/scenes.mjs). If two
    # outputs ever coincide, nudge the later one's quality until they differ.
    taken = {sha256((ROOT / e['asset']).read_bytes()) for e in scenes.values() if e['asset'] not in pending}
    final = {}
    for asset, source, output, size, score in results:
        quality = QUALITY
        while sha256(output) in taken:
            quality += 1
            if quality > 100:
                raise SystemExit('Two scene illustrations decode to identical pixels: ' + asset)
            output, size, score = encode(source, quality)
        taken.add(sha256(output))
        final[asset] = (source, output, size, score, quality)

    by_asset = {entry['asset']: entry for entry in scenes.values()}
    for asset, (source, output, size, score, quality) in final.items():
        if len(output) >= len(source):
            output, score, quality = source, math.inf, None  # never grow a file
        (ROOT / asset).write_bytes(output)
        entry = by_asset[asset]
        assert [entry['width'], entry['height']] == list(size), asset
        entry['bytes'] = len(output)
        entry['sha256'] = sha256(output)
        record['files'][asset] = {
            'sourceSha256': sha256(source), 'sourceBytes': len(source),
            'sha256': sha256(output), 'bytes': len(output), 'quality': quality,
            'psnr': None if math.isinf(score) else round(score, 2),
        }

    files = record['files']
    record['files'] = dict(sorted(files.items()))
    record['sourceBytes'] = sum(f['sourceBytes'] for f in files.values())
    record['bytes'] = sum(f['bytes'] for f in files.values())
    scores = [f['psnr'] for f in files.values() if f['psnr'] is not None]
    record['meanPSNR'] = round(sum(scores) / len(scores), 2) if scores else None
    record['minPSNR'] = min(scores) if scores else None
    record = {k: record[k] for k in ['tool', 'format', 'method', 'quality', 'sourceBytes', 'bytes', 'meanPSNR', 'minPSNR', 'files']}

    SCENES.write_text(json.dumps(scenes, indent=2))
    RECORD.write_text(json.dumps(record, indent=2) + '\n')
    print(json.dumps({k: record[k] for k in ['quality', 'sourceBytes', 'bytes', 'meanPSNR', 'minPSNR']}
                     | {'recompressed': len(final)}, indent=2))


if __name__ == '__main__':
    main()
