#!/usr/bin/env python3
"""Rebuild both editions and stage only public runtime files for GitHub Pages."""
from pathlib import Path
import hashlib, json, shutil, subprocess, sys

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / 'dist'

def main():
    if OUTPUT.exists():
        shutil.rmtree(OUTPUT)
    OUTPUT.mkdir()
    summary = {}
    for edition, route in [('english', 'en'), ('chinese', 'zh-CN')]:
        source = ROOT / edition
        subprocess.run([sys.executable, str(source / 'tools/build.py')], cwd=source, check=True)
        manifest = json.loads((source / 'content/preload-assets.json').read_text())
        target = OUTPUT / route
        for name in ['index.html', 'preload.js', *manifest]:
            relative = Path(name)
            if relative.is_absolute() or '..' in relative.parts:
                raise ValueError('Unsafe asset path: ' + name)
            asset = source / relative
            if name in manifest:
                data = asset.read_bytes()
                expected = manifest[name]
                if len(data) != expected['bytes'] or hashlib.sha256(data).hexdigest() != expected['sha256']:
                    raise ValueError('Asset integrity failure: ' + str(asset))
            destination = target / relative
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(asset, destination)
        scene_files = list((target / 'assets/art/scenes').glob('*.webp'))
        if len(scene_files) != 246 or len({hashlib.sha256(p.read_bytes()).hexdigest() for p in scene_files}) != 246:
            raise ValueError('Expected 246 distinct scene illustrations in ' + edition)
        summary[edition] = {'route': route, 'preloadedFiles': len(manifest), 'sceneIllustrations': len(scene_files)}
    shutil.copyfile(ROOT / 'web/index.html', OUTPUT / 'index.html')
    (OUTPUT / '.nojekyll').touch()
    total = sum(p.stat().st_size for p in OUTPUT.rglob('*') if p.is_file())
    if total >= 1_000_000_000:
        raise ValueError('Published site must stay below GitHub Pages 1 GB limit')
    summary['publishedBytes'] = total
    print(json.dumps(summary, indent=2))

if __name__ == '__main__':
    main()
