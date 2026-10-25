#!/usr/bin/env python3
"""Draw the Android launcher icons and splash from the author's sunflower.

Same source and colours as tools/make_icons.py (the web app icons):
  mipmap-*/ic_launcher.png, ic_launcher_round.png   legacy launcher icons
  mipmap-*/ic_launcher_foreground.png               adaptive-icon foreground,
                                                    inside the 66dp safe zone
  drawable/splash_icon.png                          the splash screen's flower

Usage: python3 tools/android_resources.py   (requires Pillow; reproducible)
"""
from pathlib import Path

from PIL import Image, ImageDraw

from make_icons import INK, ROOT, flower, render, visible_radius

RES = ROOT / 'android/app/src/main/res'
DENSITIES = {'mdpi': 1, 'hdpi': 1.5, 'xhdpi': 2, 'xxhdpi': 3, 'xxxhdpi': 4}


def transparent(art, size, radius_fraction):
    """The flower alone on a transparent square, its farthest pixel at the
    given fraction of the width from the centre."""
    scale = size * radius_fraction / visible_radius(art)
    width, height = round(art.width * scale), round(art.height * scale)
    small = art.convert('RGBa').resize((width, height), Image.LANCZOS).convert('RGBA')
    layer = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    layer.paste(small, ((size - width) // 2, (size - height) // 2))
    return layer


def main():
    art = flower()
    for name, factor in DENSITIES.items():
        folder = RES / f'mipmap-{name}'
        folder.mkdir(parents=True, exist_ok=True)
        size = round(48 * factor)
        icon = render(art, size, size * 0.8 / max(art.size))
        icon.save(folder / 'ic_launcher.png', optimize=True)
        mask = Image.new('L', (size, size), 0)
        ImageDraw.Draw(mask).ellipse((0, 0, size - 1, size - 1), fill=255)
        round_icon = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        round_icon.paste(render(art, size, size * 0.38 * 2 / max(art.size) * 0.95), (0, 0), mask)
        round_icon.save(folder / 'ic_launcher_round.png', optimize=True)
        # 108dp canvas; launchers may crop to a 66dp circle (radius 33/108).
        transparent(art, round(108 * factor), 0.29).save(folder / 'ic_launcher_foreground.png', optimize=True)
    # Android 12+ splash: the icon sits in a 240dp circle cropped to 160dp.
    transparent(art, 480, 0.30).save(RES / 'drawable/splash_icon.png', optimize=True)
    for path in sorted(RES.glob('*/ic_launcher*.png')) + [RES / 'drawable/splash_icon.png']:
        print(path.relative_to(ROOT), path.stat().st_size)


if __name__ == '__main__':
    main()
