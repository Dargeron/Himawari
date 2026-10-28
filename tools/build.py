#!/usr/bin/env python3
"""Build both Himawari editions from one source tree into dist/.

Standard library only. The output is a static site:

  dist/index.html            language picker
  dist/assets/...            art and music shared by both editions, plus each
                             edition's narration and the fonts
  dist/<route>/              index.html, game.js, loader.js, style.css,
                             sw.js, manifest.webmanifest

Usage:
  python3 tools/build.py              progressive loading (the website)
  python3 tools/build.py --complete   download and verify everything before
                                      the title (a hosted, offline-first copy)
  python3 tools/build.py --app        every file ships inside the package
                                      (Android apk): nothing is downloaded
"""
from pathlib import Path
import argparse, hashlib, json, re, shutil

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / 'src'
VERSION = json.loads((ROOT / 'package.json').read_text())['version']
EDITIONS = {
    'en': {'route': 'en', 'narration': 'assets/narration/en', 'lang': 'en'},
    'zh-CN': {'route': 'zh-CN', 'narration': 'assets/narration/zh-CN', 'lang': 'zh-CN'},
}
SCENE_COUNT = 246


def read_json(path):
    return json.loads((ROOT / path).read_text())


def sha256(data):
    return hashlib.sha256(data).hexdigest()


def ui_strings(code):
    """Interface strings: locales/<code>/ui.json plus any ui-*.json beside it."""
    strings = {}
    for path in sorted((ROOT / 'locales' / code).glob('ui*.json')):
        for key, value in json.loads(path.read_text()).items():
            if key in strings:
                raise ValueError(f'Duplicate interface string {key} in {path.name}')
            strings[key] = value
    return strings


# --------------------------------------------------------------------------
# Language packs. tests/helpers/locale.mjs mirrors this assembly for Node.

def pack_data(code):
    data = {
        'literals': read_json(f'locales/{code}/literals.json'),
        'stringCaches': read_json(f'locales/{code}/string-caches.json'),
        'narration': read_json(f'locales/{code}/narration.json'),
        'scenes': read_json('content/scene-illustrations.json'),
        'strings': ui_strings(code),
        'version': VERSION,
    }
    focus = ROOT / 'content/scene-focus.json'
    if focus.exists():
        data['focus'] = json.loads(focus.read_text())
    if code == 'zh-CN':
        data['pronunciations'] = read_json('locales/zh-CN/name-pronunciations.json')
        english = read_json('locales/en/literals.json')
        data['englishHistory'] = {
            k: v['text'] for k, v in english.items()
            if 1838 <= int(k) <= 2355 or 2461 <= int(k) <= 2479
        }
    return data


# --------------------------------------------------------------------------
# A small ES-module bundler for this project's own sources. Each module runs in
# its own function scope, so modules may reuse local names freely. Supported:
#   import {a, b as c} from './x.js';   import x from './x.js';
#   export function / async function / class / const / let;  export default
# The virtual module './generated/pack.js' carries the language pack.

IMPORT = re.compile(
    r"^import\s+(?:(?P<default>[A-Za-z_$][\w$]*)\s*,?\s*)?(?:\{(?P<names>[^}]*)\})?\s*(?:from\s*)?"
    r"['\"](?P<path>[^'\"]+)['\"];?[ \t]*\n?", re.M)
EXPORT_DECL = re.compile(r"^export\s+(?P<kind>async\s+function\*?|function\*?|class|const|let)\s+(?P<name>[A-Za-z_$][\w$]*)", re.M)
EXPORT_DEFAULT = re.compile(r"^export\s+default\s+", re.M)


def bundle(entry, locale, virtual):
    order, seen, active, modules = [], set(), set(), {}

    virtual = {'src/' + key: value for key, value in virtual.items()}

    def resolve(spec, base):
        spec = spec.replace('__LOCALE__', locale)
        target = (base.parent / spec).resolve()
        return str(target.relative_to(ROOT))

    def visit(key):
        if key in seen:
            return
        if key in active:
            raise ValueError('Import cycle at ' + key)
        active.add(key)
        source = virtual[key] if key in virtual else (ROOT / key).read_text()
        base = ROOT / key
        imports = []
        for match in IMPORT.finditer(source):
            dep = resolve(match['path'], base)
            imports.append((match, dep))
            visit(dep)
        modules[key] = (source, imports)
        active.discard(key)
        seen.add(key)
        order.append(key)

    visit(entry)
    names = {key: '__m' + str(i) for i, key in enumerate(order)}
    out = []
    for key in order:
        source, imports = modules[key]
        header = []
        for match, dep in imports:
            if match['default']:
                header.append(f"const {match['default']} = {names[dep]}.default;")
            if match['names'] and match['names'].strip():
                parts = []
                for item in match['names'].split(','):
                    item = item.strip()
                    if not item:
                        continue
                    if ' as ' in item:
                        a, b = [x.strip() for x in item.split(' as ')]
                        parts.append(f'{a}: {b}')
                    else:
                        parts.append(item)
                header.append('const {' + ', '.join(parts) + '} = ' + names[dep] + ';')
        body = IMPORT.sub('', source)
        exported = [m['name'] for m in EXPORT_DECL.finditer(body)]
        body = EXPORT_DECL.sub(lambda m: m['kind'] + ' ' + m['name'], body)
        has_default = bool(EXPORT_DEFAULT.search(body))
        body = EXPORT_DEFAULT.sub('const __default = ', body)
        if re.search(r'^export\s', body, re.M):
            raise ValueError('Unsupported export form in ' + key)
        result = ', '.join(exported + (['default: __default'] if has_default else []))
        out.append(f'// {key}\nconst {names[key]} = (() => {{\n' + '\n'.join(header) + '\n' + body + f'\nreturn {{{result}}};\n}})();\n')
    return "'use strict';\n" + ''.join(out)


def iife(code):
    return '(() => {\n' + code + '})();\n'


# --------------------------------------------------------------------------
# Styles: every styles/NN-name.css, in numeric order. Numbering keeps the
# cascade explicit: tokens, base, then screens, then overrides.

def stylesheet():
    css = []
    for path in sorted((ROOT / 'styles').glob('[0-9][0-9]-*.css')):
        css.append(f'/* {path.name} */\n' + path.read_text())
    return '\n'.join(css)


def include(template):
    """Inline <!--#include name.html--> partials from src/ (one level deep)."""
    return re.sub(r'<!--#include ([\w.-]+\.html)-->', lambda m: (SRC / m.group(1)).read_text() if (SRC / m.group(1)).exists() else '', template)


def fill(template, strings, extra):
    def sub(match):
        key = match.group(1)
        if key in extra:
            return extra[key]
        if key not in strings:
            raise KeyError('Missing interface string ' + key)
        return strings[key]
    return re.sub(r'\{\{([\w.-]+)\}\}', sub, template)


# --------------------------------------------------------------------------

def edition_assets(code, data):
    """Every file the edition can request, as path -> {bytes, sha256}."""
    files = set(ROOT.glob('assets/art/original/*.webp')) | set(ROOT.glob('assets/art/scenes/*.webp'))
    files |= set(ROOT.glob('assets/art/cover/*.webp'))
    files |= set(ROOT.glob('assets/music/*.m4a')) | set(edition_fonts(code))
    files |= set(ROOT.glob('assets/icons/*.png'))
    files |= {ROOT / clip['file'] for clip in data['narration'].values()}
    manifest = {}
    for f in sorted(files):
        raw = f.read_bytes()
        manifest[str(f.relative_to(ROOT))] = {'bytes': len(raw), 'sha256': sha256(raw)}
    return manifest


def build(complete=False, output=ROOT / 'dist', app=False, only=None):
    """Build the editions into `output`. `only` builds a single edition (an
    app per language): its pack has no link to the other language, and the
    root page opens the edition directly instead of the language picker."""
    if output.exists():
        shutil.rmtree(output)
    output.mkdir(parents=True)
    css = stylesheet()
    mode = 'local' if app else 'complete' if complete else 'progressive'
    summary = {'version': VERSION, 'mode': mode}
    shared = {}
    editions = {only: EDITIONS[only]} if only else EDITIONS
    for code, edition in editions.items():
        data = pack_data(code)
        if only:
            data['single'] = True
        target = output / edition['route']
        target.mkdir()
        manifest = edition_assets(code, data)
        shared.update(manifest)
        data['assets'] = {k: v['sha256'][:12] for k, v in manifest.items()}
        virtual = {'generated/pack.js': 'export const data = ' + json.dumps(data, ensure_ascii=False, separators=(',', ':')) + ';\n'}
        game = iife(bundle('src/main.js', code, virtual))
        (target / 'game.js').write_text(game)
        (target / 'style.css').write_text(css)
        boot = {
            'mode': mode,
            'assetRoot': '../',
            'cacheName': 'himawari-assets-v2',
            'files': manifest,
            'critical': critical_assets(code, data),
            'runtime': {
                'game.js': {'bytes': len(game.encode()), 'sha256': sha256(game.encode())},
                'style.css': {'bytes': len(css.encode()), 'sha256': sha256(css.encode())},
            },
        }
        loader = iife(bundle('src/loader-main.js', code, {
            'generated/pack.js': 'export const data = ' + json.dumps({'strings': data['strings']}, ensure_ascii=False) + ';\n',
            'generated/boot.js': 'export const boot = ' + json.dumps(boot, separators=(',', ':')) + ';\n',
        }))
        (target / 'loader.js').write_text(loader)
        sw = (SRC / 'sw.js').read_text().replace('__CACHE__', boot['cacheName'])
        (target / 'sw.js').write_text(sw)
        version = sha256((game + css + loader).encode())[:12]
        html = fill(include((SRC / 'index.html').read_text()), data['strings'], {
            'lang': edition['lang'], 'version': version, 'mode': boot['mode'],
        })
        (target / 'index.html').write_text(html)
        webmanifest = fill((SRC / 'manifest.webmanifest').read_text(), data['strings'], {'lang': edition['lang']})
        (target / 'manifest.webmanifest').write_text(webmanifest)
        summary[code] = {'route': edition['route'], 'files': len(manifest), 'bytes': sum(v['bytes'] for v in manifest.values()),
                         'bundleBytes': len(game.encode())}
    for path, entry in shared.items():
        source = ROOT / path
        raw = source.read_bytes()
        if len(raw) != entry['bytes'] or sha256(raw) != entry['sha256']:
            raise ValueError('Asset changed during build: ' + path)
        destination = output / path
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(source, destination)
    scenes = list((output / 'assets/art/scenes').glob('*.webp'))
    if len(scenes) != SCENE_COUNT or len({sha256(p.read_bytes()) for p in scenes}) != SCENE_COUNT:
        raise ValueError(f'Expected {SCENE_COUNT} distinct scene illustrations')
    if only:
        route = EDITIONS[only]['route']
        (output / 'index.html').write_text(
            f'<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="0;url={route}/index.html">'
            f'<script>location.replace("{route}/index.html")</script>\n')
    else:
        shutil.copyfile(ROOT / 'web/index.html', output / 'index.html')
    (output / '.nojekyll').touch()
    total = sum(p.stat().st_size for p in output.rglob('*') if p.is_file())
    if total >= 1_000_000_000:
        raise ValueError('Published site must stay below the GitHub Pages 1 GB limit')
    summary['publishedBytes'] = total
    print(json.dumps(summary, indent=2))
    return summary


def edition_fonts(code):
    """English: EB Garamond and Caveat. Chinese: LXGW WenKai, plus EB Garamond
    for the Latin wordmark, so the title reads the same in both editions."""
    families = ('eb-garamond', 'caveat') if code == 'en' else ('eb-garamond', 'lxgw-wenkai')
    return sorted(p for p in ROOT.glob('assets/fonts/*.woff2') if p.name.startswith(families))


def critical_assets(code, data):
    """What the title screen and the first minute of play need."""
    opening = data['narration']['2464']['file']
    first_scene = data['scenes']['2464']['asset'] if '2464' in data['scenes'] else None
    names = ['assets/art/cover/title.webp', 'assets/art/original/mapa_joc.webp', 'assets/art/original/continueBtn.webp',
             *[f'assets/art/original/hima{i}.webp' for i in range(1, 6)],
             'assets/music/opening_6_opening.m4a', 'assets/music/click_3_click.m4a', opening]
    if first_scene:
        names.append(first_scene)
    names += [str(p.relative_to(ROOT)) for p in edition_fonts(code)]
    return [n for n in dict.fromkeys(names) if (ROOT / n).exists()]


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--complete', action='store_true', help='download every asset before the title screen')
    parser.add_argument('--app', action='store_true', help='package every asset inside an app; nothing is downloaded')
    parser.add_argument('--out', default=None)
    parser.add_argument('--edition', choices=sorted(EDITIONS), help='build only this edition (one app per language)')
    args = parser.parse_args()
    build(args.complete, Path(args.out) if args.out else ROOT / ('dist-app' if args.app else 'dist'), app=args.app,
          only=args.edition)
