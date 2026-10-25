#!/usr/bin/env python3
"""Draw the app icons in assets/icons/ from the author's sunflower.

The source is the original drawing assets/art/original/hima1.png (read only),
centred on the ink colour of the interface:

  icon-192.png, icon-512.png   the flower fills most of the square
  icon-maskable-512.png        every visible pixel stays inside the central
                               80% circle, the safe zone launchers never crop

Usage: python3 tools/make_icons.py      (requires Pillow; output is reproducible)
"""
from pathlib import Path
import math

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'assets/art/original/hima1.png'
OUT = ROOT / 'assets/icons'
INK = (13, 9, 6)  # --ink, #0d0906
VISIBLE = 24      # alpha above which a pixel counts as part of the drawing


def flower():
    with Image.open(SOURCE) as image:
        art = image.convert('RGBA')
    mask = art.getchannel('A').point(lambda a: 255 if a > VISIBLE else 0)
    return art.crop(mask.getbbox())


def visible_radius(art):
    """Distance from the centre of `art` to its farthest visible pixel."""
    alpha = art.getchannel('A')
    width, height = art.size
    cx, cy = width / 2, height / 2
    data = alpha.load()
    radius = 0.0
    step = max(1, min(width, height) // 400)
    for y in range(0, height, step):
        for x in range(0, width, step):
            if data[x, y] > VISIBLE:
                radius = max(radius, math.hypot(x + 0.5 - cx, y + 0.5 - cy))
    return radius + step


def render(art, size, scale):
    width, height = round(art.width * scale), round(art.height * scale)
    # Resample with premultiplied alpha so the paper fringe does not darken.
    small = art.convert('RGBa').resize((width, height), Image.LANCZOS).convert('RGBA')
    canvas = Image.new('RGBA', (size, size), INK + (255,))
    layer = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    layer.paste(small, ((size - width) // 2, (size - height) // 2))
    return Image.alpha_composite(canvas, layer).convert('RGB')


def main():
    art = flower()
    OUT.mkdir(parents=True, exist_ok=True)
    # Regular icons: the drawing's longer side spans 84% of the square.
    for size in (192, 512):
        scale = size * 0.84 / max(art.size)
        render(art, size, scale).save(OUT / f'icon-{size}.png', optimize=True)
    # Maskable: the farthest visible pixel sits at 38% of the width from the
    # centre, inside the 40% radius safe zone with a little air to spare.
    size = 512
    scale = size * 0.38 / visible_radius(art)
    render(art, size, scale).save(OUT / 'icon-maskable-512.png', optimize=True)
    for path in sorted(OUT.glob('*.png')):
        print(path.relative_to(ROOT), path.stat().st_size)


if __name__ == '__main__':
    main()
