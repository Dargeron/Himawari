# Himawari

*A sunflower, a town, and another day.*

Every night someone murders Harry's sunflower, and every morning he wakes up to the same day. Himawari is a narrated time-loop mystery: explore the hand-drawn town, listen, remember, and find out who is behind it before nightfall.

**A game by Liam McHara (Guillem) & Albert Casals.** Original game: <https://liammchara.itch.io/himawari>

This repository holds the 2026 edition in two languages, built from one source:

| Edition | Narrator | Route |
| --- | --- | --- |
| English | Harry | `en/` |
| 简体中文 | Julian (朱利安) | `zh-CN/` |

## Playing

Every screen is the scene's illustration, full screen, with the story written into a dark ink box over it: letter by letter, in step with the narrator's voice. Earlier lines roll up inside the box and you can scroll back through them. Choices, typed answers and Continue all live in the box. The town map is Guillem's original drawing.

| | |
| --- | --- |
| Tap / Space / Enter | Finish the writing, then continue |
| 1–4 · 1–8 | Choose · go to a place on the map |
| P · R | Pause or resume the narration · replay it |
| V | Look at the whole picture |
| N · Esc | Notebook · notebook settings |
| S · hold Ctrl | Skip passages you have already read |
| A | Continue automatically after the narration |
| F | Full screen |

The notebook keeps what Harry carries, a diary with one gentle clue per day, a conspiracy board for your own theories, every page read, the endings you have lived through, and the settings (voice, music, text speed, larger text, reduced motion, saves).

Progress saves automatically in the browser. Export a save from the notebook to move it to another device or site.

## Running locally

Python 3.10+ is all the build needs:

```sh
python3 tools/build.py
python3 -m http.server 8000 --directory dist
```

Open <http://localhost:8000/> and choose a language. On the website the game starts as soon as the title and opening are ready, and keeps downloading the rest in the background; later visits and offline play use the cached copy. `python3 tools/build.py --complete` downloads and verifies everything before the title instead; `--app` puts every file inside the package (used for the Android app).

## Android

`.github/workflows/android.yml` builds the Android app on every push (as a downloadable workflow artifact). `tools/release.sh` publishes the current commit as a release on the [Releases](https://github.com/Dargeron/Himawari/releases) page: it pushes the commit to the throwaway branch `release-drop`, and the workflow tags it `v<version>` (from `package.json`), attaches the APK and deletes the branch. Releases published from the GitHub page, or by pushing a `v*` tag, get the APK too. The APK holds both editions and every picture, voice and piece of music, so it plays fully offline; it needs Android 7 or newer.

To build it yourself you need the Android SDK (platform 36), JDK 21 and Node 22:

```sh
npm ci
npm run android:apk        # python3 tools/build.py --app, npx cap sync android, gradle
```

Set `HIMAWARI_KEYSTORE`, `HIMAWARI_KEYSTORE_PASSWORD`, `HIMAWARI_KEY_ALIAS` and `HIMAWARI_KEY_PASSWORD` to sign it. For releases, add the same key as repository secrets (`HIMAWARI_KEYSTORE_BASE64` — the keystore file in base64 — plus the password, alias and key password) so every release installs over the previous one; without them each release is signed with a one-off key. Launcher icons and the splash come from the author's sunflower (`python3 tools/android_resources.py`).

## Publishing

`.github/workflows/pages.yml` tests, builds and deploys both editions to GitHub Pages on every push to `main` (Settings → Pages → Source → GitHub Actions). The site is static: no server, account or API key.

## Working on it

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for how the pieces fit, and the rules that keep the original game intact. In short:

- **Never change the story text or the mechanics.** `src/core/recovered-core.js` is the original game's logic, recovered from its Unity build; the tests compare it action by action with the original WASM in `recovery/`.
- Interface text lives in `locales/<code>/ui*.json`; story text in `locales/<code>/literals.json` (edit only `text`, never `raw`).
- One source serves both editions: `src/` (runtime), `styles/` (numbered stylesheets), `locales/` (language packs), `assets/` (art and music once, narration per language).

```sh
npm ci            # test dependencies (jsdom, prettier)
npm test          # logic for both languages, the game screen, media integrity
```

`npm test` needs Node 22+, Python with Pillow, and FFmpeg's `ffprobe` (for the media check).

## Credits

- Story & original game — Guillem (Liam McHara)
- Game design & programming — Albert Casals
- 2026 interface & ink — Tinta (Claude)
- Narration — Harry (English) and Julian (Mandarin), ElevenLabs voices
- Music — the original soundtrack

The original decisions, puzzles and endings were recovered from the original build; the writing is preserved, with a handful of recorded spelling and punctuation corrections (`locales/*/text-corrections.json`). No open-source licence is granted for the game, its art, music or recordings.
