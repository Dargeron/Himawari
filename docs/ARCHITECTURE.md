# How Himawari is built

The 2026 edition is a static web game. One source tree builds two editions (English and Simplified Chinese) that share art and music and differ only in their language pack and narration.

## Ground rules

1. **The story and the rules are the original game's.** `src/core/recovered-core.js` is the original Unity controller, recovered from WASM and translated to JavaScript. `src/engine.js` adapts it (strings, randomness, saves) without changing a decision. `tests/mechanics.mjs` compares 18,000 random legal actions with the original WASM in `recovery/`; `tests/walkthrough.mjs` replays the legal 261-action winning route against it with a save/reload after every action. If either fails, the change is wrong. The deliberate exceptions are changes the authors asked for, kept in `engine.js` and covered by `tests/original-fixes.mjs`: the water plant's control room reached directly had a red button that did nothing (now it stops the water), and four interactions happen at most once a day (the Roller Street warehouse with the gun, the gardener, the street sweeper in the park, the girl on the avenue).
2. **Story text is not edited.** `locales/<code>/literals.json` holds every string as `raw` (what the rules compare; never change it) and `text` (what is shown). The interface never rewrites, shortens or paraphrases `text`.
3. **Everything else is presentation.** The interface only reads snapshots and forwards actions (`next`, `go`, `choice`, `continue`, `input`).

## Layout

```
src/                 runtime (ES modules, bundled by tools/build.py)
  main.js            game entry: installs the language pack, starts the app
  loader-main.js     loader entry: downloads/caches assets, then loads game.js
  core/              the recovered original rules (do not edit)
  engine.js          adapter around the rules; snapshots and saves
  i18n.js            the active language pack (L) and t() for interface strings
  locales/en.js      per-language behaviour: typed-answer aliases, number words,
  locales/zh-CN.js   name spelling, labels, diary/clue texts
  app.js             orchestration: rendering, actions, saves, keyboard, skip/auto
  stage.js           full-screen pictures, crossfade, focal points, look mode
  typewriter.js      letters follow the narrator's voice, or the text speed
  inkbox.js          the rolling story box and its response controls
  map.js             the original town drawing with buttons, tags, visits, pins
  hud.js             time of day, loop tally, notices, phase/loop cards
  title.js           the cover
  notebook/          pocket, diary, board, pages, album, settings, credits
  guide.js           diary findings, forecasts and the daily clue (observer)
  journal.js         read passages, visits, choices, board, album (observer)
  audio.js           narration clips, music crossfades and ducking
  prefetch.js        asks the loader for the next screens' picture and voice
  sw.js              service worker: offline cache, ranged audio
styles/NN-*.css      stylesheets in cascade order (01 tokens … 60 notebook)
locales/<code>/      literals, narration timing, narrator, ui*.json strings
content/             shared data: scene illustrations, focal points, catalogue
assets/              art (shared), music (shared), narration/<code>/, fonts, icons
web/index.html       the language picker at the site root
tests/               logic per language, game screen and notebook DOM, loader, media
tools/build.py       the dependency-free bundler and site builder
tools/retime_narration.py  re-times narration clips against the recordings
docs/history/        notes and reports from the earlier releases
android/             the Capacitor Android project (src/native.js is its bridge)
```

## The screen

Three layers, nothing else:

1. **The stage** (`stage.js`): the scene's illustration fills the screen with a slow drift. `content/scene-focus.json` gives each picture's main subject and the side the text box should take. On portrait screens the picture occupies the top and fades into its own blurred continuation behind the box. The author's original drawings (map, endings) are shown whole on a blurred fill instead of cropped.
2. **The ink box** (`inkbox.js`): a dark, irregular-edged panel (the original game's `CUADRO_DE_TEXTO` idea). Passages roll forward inside it; earlier passages and the player's own choices stay above, dim and fade behind the top edge, and can be scrolled back. Responses (the author's chalk Continue, numbered choices, typed answers, the map's places) appear when the writing is done.
3. **The HUD** (`hud.js`): the author's sunflower for the time of day, the loop as pencil tally marks, two buttons (look, notebook) and pencilled notices.

Full-screen cards mark the turn of the day, nightfall and the loop reset. The notebook is the only overlay.

## Language packs

A pack is `src/locales/<code>.js` (behaviour) plus data assembled by `tools/build.py` (`pack_data`) and mirrored for Node tests by `tests/helpers/locale.mjs`: literals, string caches, narration manifest, scene illustrations and focal points, interface strings (`locales/<code>/ui*.json`, merged; duplicate keys fail the build), and for Chinese the name pronunciations and English history used to migrate old saves. Each edition keeps its own save and settings keys, so existing saves keep working.

## Narration

Each recording holds many passages back to back, and `locales/<code>/narration.json` gives every passage's file, start and end. The timings are measured from the audio itself (`tools/retime_narration.py`: speech-recognition word timestamps, cut at the quietest moment between lines), so a passage starts at its first word and stops before the next line. Choices are never read aloud. Passages whose recording does not say their text are left silent and listed in `locales/<code>/narration-gaps.json`.

## Build

`python3 tools/build.py` bundles `src/main.js` and `src/loader-main.js` per edition with a small ES-module bundler (each module runs in its own scope; supports named/default imports and `export function/const/class/let/default`), concatenates `styles/NN-*.css`, fills `{{key}}` placeholders in `src/index.html` from the interface strings, writes the asset manifest with sizes and SHA-256 hashes, and stages `dist/`. Assets are referenced as `../assets/<path>?v=<hash>`, so a changed file can never be served stale.

## Tests

```sh
npm run test:logic    # rules vs original WASM, winning route, guide, journal, audio, scenes, localisation — both languages
npm run test:ui       # builds, then drives each edition's game screen in jsdom (full winning route)
npm run test:assets   # narration coverage and timing, original art, narrators, credential scan (needs ffprobe, Pillow)
node tests/notebook.mjs en|zh-CN
node tests/loader.mjs
```

Visual checks are done in a real browser (Playwright + Chromium) at phone, tablet and desktop sizes.
