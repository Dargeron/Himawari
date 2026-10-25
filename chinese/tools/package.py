#!/usr/bin/env python3
"""Package an itch-ready game and a full editable-source backup."""
from pathlib import Path
import zipfile
ROOT=Path(__file__).resolve().parents[1]
with zipfile.ZipFile(ROOT.parent/'Himawari-zh-CN-itch.zip','w',compression=zipfile.ZIP_DEFLATED,compresslevel=6) as z:
 for p in [ROOT/'index.html',ROOT/'style.css',ROOT/'game.js',ROOT/'preload.js',ROOT/'_headers',*ROOT.glob('assets/art/original/*.webp'),*ROOT.glob('assets/art/scenes/*.webp'),*ROOT.glob('assets/music/*.m4a'),*ROOT.glob('assets/narration-zh/*.mp3')]:z.write(p,p.relative_to(ROOT))
with zipfile.ZipFile(ROOT.parent/'Himawari-zh-CN-source.zip','w',compression=zipfile.ZIP_DEFLATED,compresslevel=6) as z:
 for p in sorted(ROOT.rglob('*')):
  if p.is_file() and not any(part in ('node_modules','__pycache__','.git') for part in p.relative_to(ROOT).parts):z.write(p,Path('Himawari')/p.relative_to(ROOT))
print('Created Himawari-zh-CN-itch.zip and Himawari-zh-CN-source.zip')
