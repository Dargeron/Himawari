# Himawari — 2026 rebuild

A complete offline rebuild of Liam McHara’s original sunflower time-loop game.

## Play

Open `index.html` in a desktop browser. All graphics, voices, and music are local.
The separate `Himawari.html` download contains the entire game in one file: save it,
then open it in your browser. Begin or Continue unlocks audio. No account or API key
is needed to play. No API requests are made by the game.

Progress saves automatically on this device. Settings → Export save makes a
portable backup. Import save restores it. Local file storage varies by browser;
exporting a save is the reliable way to move progress between devices or files.

Controls: click or tap choices and destinations; 1–4 selects the matching numbered
choice, Enter continues, Space pauses or resumes Harry, and Esc closes a panel.
The settings include separate music and voice volume, narration speed, larger
text, and reduced motion. Read choices speaks the available responses without
selecting one. Inventory and reading history are available in the header.

## What changed

- Original hand-drawn artwork returns: the clickable city, all eight buildings,
  the five sunflower poses, and all five ending illustrations. Drawings are shown
  whole, using full-resolution WebP copies of the recovered originals. Version 1.4.0 uses quality-95 compression for larger drawings; controls remain lossless, and untouched author PNGs are included in the source.
- Harry narrates all 458 authored passages and choices. The first approved Harry
  opening is reused unchanged. The more frantic audition is not in this build.
- The original soundtrack returns with transitions and lower music during speech.
- A paper-and-ink interface uses the original hand-drawn Continue control,
  warm page colors, pencilled margin notes, and ink borders alongside the art.
  Keyboard controls, inventory, reading history, autosaves, and portable saves
  surround the original rules. The flower sits beside a prominent Time of day
  label: Dawn, Morning, Noon, Afternoon, Dusk, or Night.
- Settings & saves → Diary & daily clue records discoveries across loops, lists
  today’s completed precautions, and offers one gentle clue per in-game day.
  Opening the diary does not spend a clue. Its use persists through save/resume
  and exported saves; another becomes available the next morning.
- A small forecast above the story names tonight’s likely death only when that
  death has already been experienced. It updates as preparations change.
  It does not reveal an unseen death or change the game’s decisions.
- Twenty-four strings have conservative word, spacing, grammar, or punctuation
  corrections. `content/text-corrections.json` records every before/after change.
  The story has not been rewritten.

The full narration uses the same Harry voice and original audition settings with
ElevenLabs’ expressive `eleven_v3_conversational` model. The exact original opening
uses the previously approved recording. Counts and player-entered names use
cached Harry clips too; unfamiliar names are spelled aloud. Everything plays
without a network connection.

## Editable source

This is newly reconstructed source, not the lost original handwritten C# project.
The original Unity WebGL controller was isolated as WASM/WAT and translated to
JavaScript. `src/recovered-core.js` contains those original decisions; `src/engine.js`
adapts strings, inventory, randomness, saves, and screen events for the new UI.
The recovered WASM is retained as a verification oracle in `recovery/`.

- `src/app.js`, `style.css`, `index.html`: interface and controls.
- `src/audio.js`: Harry playback, clip boundaries, music fades, and ducking.
- `content/literals.json`: original comparison strings (`raw`) and displayed text
  (`text`). Edit only `text` for prose fixes; changing `raw` can break puzzles.
- `content/narration.json`: passage-to-recording times.
- `content/narrator.json`: selected Harry voice, model, and performance settings.
- `assets/art/original/`: untouched recovered author PNGs and lighter WebP game assets.
- `content/original-art.json`: original sprite IDs, dimensions, and pixel hashes.
- `src/graphics.js`: original artwork selection and clickable city regions.
- `src/guide.js`: diary observation, learned-death forecasts, and daily clues.
- `src/journal.js`: observed passages, board data, visits, choice memories, and ending album.
- `src/notebook-ui.js`: notebook controls, gestures, transitions, and separate album playback.
- `assets/music/`: recovered original soundtrack.
- `assets/narration/`: cached Harry recordings and their timestamp alignments.

Run `python3 tools/build.py` after editing source or content. It regenerates
`game.js` with no build dependencies. Add `--portable` to produce the one-file
`Himawari.html` in the parent directory. The full source archive contains all media,
so it is a complete backup and can be unpacked without GitHub.

For itch.io, zip `index.html`, `style.css`, `game.js`, and `assets/` at the ZIP root,
then upload it as an HTML game. The source ZIP has a containing project folder;
use the included `python3 tools/package.py` to make an itch-ready ZIP.

## Verification

Node 24+ and Python 3 are used for development; audio validation also uses FFmpeg/ffprobe, and image validation uses Pillow. `npm install` installs the test-only DOM dependency. `npm test` runs:

1. 18,000 legal actions against the original recovered WASM controller, including
   all five time phases, free-text answers, all five endings, and save recovery.
2. A 261-action normal-play route to victory, compared with the original after
   every action and with a save/reload after every action. No flags are injected
   in this route. `tests/winning-route.json` is a spoiler-filled test fixture.
3. Interface integration: Begin, map destinations, choices, inventory, settings,
   history, save/resume, all ending interfaces, the winning route, and rejected
   invalid imports. These are DOM tests, not visual browser screenshots.
4. Voice transport, clip boundaries, long loop counts, typed names, recovery
   when autoplay is blocked, delayed playback failures, and asynchronous loading
   and seeking. A regression test reproduces the skipped opening on v1.1.0 and
   verifies rapid choices, backward jumps, replay, and pause/resume while loading.
5. Diary spoiler gates, all five death fixtures, midnight clue boundaries, one
   clue per day, and observer save/reload through the 261-action legal route.
6. Notebook persistence, all five ending album fixtures, source-only spoiler gates,
   map visit phases and pins, recorded choice context, and no game-state effects.
   DOM integration exercises board keyboard and touch-pointer movement, theory
   editing, title edits, the ritual, discovery feedback, reset skip/reduced motion,
   background suspension, and independent ending playback with pause restoration.
7. Audio duration, clip boundary, narration coverage, original-art PNG hashes, compressed drawing quality and alpha,
   asset references, original Harry checksum, and credential-exclusion checks.

Older save files are supported. Persistent discoveries populate the diary on
resume; the reading history recovers observed deaths where available. Old saves
do not contain a complete event diary, so older actions absent from history
cannot all be recovered. A conservative unknown forecast is used when a death
cannot be established. No unexperienced ending is inferred from the original
controller’s misleading `infoFinalboss` flag.

A compatibility Continue control prevents one original warehouse response from
stranding the reader with empty choices. It uses the existing default continuation.
A midnight overlay adapter correctly preserves ending screens above the map.
Neither changes the original puzzle conditions or ending logic.

Live visual browser testing remains outstanding: the cloud browser blocked local
HTTP and file previews during earlier work, and no permitted live preview was
available for this update. Desktop and phone layouts are implemented. The tests
verify DOM behavior and media-event simulations; they do not substitute for
visual inspection or listening on the player’s actual device.

Version 1.0.1 fixes delayed playback failures interrupting a newer passage or an
intentional pause, and restores the correct clip position after a recording loads.
Pending metadata listeners are replaced rather than accumulated. Home and ending
scene crops keep the sunflower in view on narrow desktop layouts. These fixes
use the existing recordings and leave story text and recovered rules unchanged.
The original Harry opening checksum is pinned in `content/narrator.json`, so
its integrity check also works when the source archive is unpacked by itself.

Version 1.0.2 resumes Harry after a temporary page suspension only when he was
already speaking. A deliberate pause stays paused, and returning from the title
does not restart an old passage. Restoring a page from the browser's back-forward
cache now resumes the same way. The story, rules, and recordings are unchanged.

Version 1.0.3 makes choice narration identify the number used to select every
response. Screen readers now receive the same choice numbers plus current loop,
phase, and inventory counts. Existing cached Harry number clips are reused; no
recording or authored text was changed.

Version 1.0.4 moves keyboard and screen-reader focus to the labelled destination
group when a map appears. This prevents the destination prompt from being lost
on the map's otherwise empty story area. Story text, rules, and audio are unchanged.

Version 1.0.5 enlarges Harry's play and replay touch targets to the same 44-pixel
minimum used by the other controls. Narration behavior, recordings, story text,
and rules are unchanged.

Version 1.0.6 prevents a delayed `ended` event from an obsolete recording from
skipping the first clip of a newly selected passage. Clip-boundary checks now
reject that stale event. Recordings, story text, and rules are unchanged.

Version 1.0.7 ignores an obsolete recording's queued media-error event after a
new passage has begun, while still reporting errors from the current recording.
Recordings, story text, and rules are unchanged.

Version 1.0.8 rejects malformed imported saves whose dynamic allocation boundary
or strings overlap the immutable recovered story-string table. It also verifies
saved story pointers before loading. Normal exports are unchanged, and the story,
rules, recordings, and valid saved games are unaffected.

Version 1.0.9 recovers settings and saved progress independently at startup. A
damaged preferences entry can no longer hide a valid autosave or bypass the
new-game confirmation. Valid settings and saves, story text, rules, and audio are
unchanged.

Version 1.1.0 restores the author’s original artwork and clickable city, keeping
all existing narration, UI, soundtrack, accessibility, and save improvements.
The map has labelled building hotspots and an expandable destination list for
keyboard, touch, and screen-reader use. Whole drawings replace cropped scenes.
The five original ending images follow the actual ending, and the sunflower
indicator changes with the original five time phases. A diary, known-death
forecast, and one optional gentle clue per day are added as observers; they do
not mutate the recovered controller. No story text or recordings changed.
Proposed new artwork and music are not installed in this release.
`prototypes/music.py` and its WAV are a separate 32-second synthesized music
sketch for review. The game continues to use its original soundtrack.

Version 1.2.0 fixes a reproduced narration race: a delayed media event could
consume the first clip of a newly chosen passage before the recording reached
its starting position. Each clip now waits for metadata and a confirmed seek
before playback or boundary checks. Rapid choices and replay invalidate earlier
callbacks; pausing or hiding the page during preparation stays respected.
The interface now follows the original artwork’s paper-and-ink palette, with
notebook margins, ink borders, red annotations, labelled menu controls and the
original drawn Continue button. The full clickable city and all original art
remain intact. A prominent, accessible Time of day readout accompanies the
flower, including Night. No numerical hours are invented: these labels follow
the original discrete phases. Existing saves are compatible. Story text,
recovered rules, diary/clue logic, artwork and recordings are byte-identical
to version 1.1.0. No narration was regenerated.

## Notebook features in version 1.3.0

The eight selected additions are implemented in order: 11, 3, 4, 6, 7, 8, 10, 12.
The original controller still owns every destination visit and time advance.
No travel-cost labels or alternative clock rules were added.

- **Conspiracy board:** open it from Menu or the saved-game title screen. Pin a
  recorded discovery, quotation, mentioned person, visited place, or collected
  object. Search the material you have encountered; no unseen material is listed.
  Write and edit your own theories, cross them out, and label connections between
  any two cards. Recorded material and player theories have different paper.
  Drag a card by its heading or focus the heading and use arrow keys. Touch users
  can scroll the board sideways. Read opens the whole quotation. Limits are 32
  cards and 48 connections; unpinning does not erase the underlying discovery.
- **Sunflower ritual:** at home, Steady the sunflower gives a small animation and
  a quiet existing sound. It is optional and never consumes a phase, inventory,
  clue, or turn, and never interrupts Harry. Reduced motion removes the movement.
- **Discovery feedback:** a brief diary tab announces genuinely new findings.
  The menu keeps an unread mark until the diary is opened. Reloading does not
  repeat the announcement. Opening the diary still does not spend today's clue.
- **Evolving title:** the original town acquires scraps of discovered findings,
  the player's own theories and cross-outs, and encountered ending illustrations.
- **Map memory:** pencil marks show places visited today with the phase displayed
  when the destination was chosen. Separate pin buttons in the destination list
  mark personal revisit reminders without traveling. Visits are filtered to the
  current loop; pins survive loops. This does not change original travel timing.
- **Loop reset:** after the original controller begins another morning, a short
  page-and-sunflower rewind plays once. Continue now or Escape skips it. Reduced
  motion skips the animation. The new day saves before the transition; hiding
  the page defers its narration until return. Victory does not trigger a reset.
- **Ending album:** Menu and the title expose only completed endings the player
  has actually encountered. Original art and recorded text are kept without
  locked silhouettes or unseen ending names. Replay uses cached Harry clips and
  a separate player; closing the album restores the game's prior voice position
  and deliberate pause state. Replaying never changes the game or diary.
- **Past-choice echoes:** a separate Chosen on loop N marker recalls the actual
  immediate response and inventory changes from that visit. It does not select
  the option again or promise that different circumstances give the same result.

The board and all notebook memories travel with autosaves and exported saves.
Starting a new game explicitly clears them along with the existing progress.
Older saves remain compatible: recorded reading history and diary findings are
recovered where available. Missing historical visits and outcomes are not guessed;
new encounters fill them in. An incomplete older ending record never fills in
unrecorded passages. No new narration, story text, artwork, or music was generated.
All source, original art, soundtrack and Harry recordings are included offline.

## Narration regeneration

Cached recordings are included; regeneration is unnecessary to play or build.
If you deliberately change the spoken text, use `tools/generate_narration.py`
with credentials supplied privately through an environment variable or a key file
outside this project. It reuses successful batches, checks included credits,
and does not automatically retry an interrupted paid request. API keys are not
included in any deliverable. Review the affected voice batches before shipping
changed dialogue.

Original: https://liammchara.itch.io/himawari

## Complete loading in version 1.4.0

The hosted game now downloads all 25 drawings, all narration, all 13 music/sound files, and its runtime before exposing the title screen. A paper loading page reports actual bytes and percentage; three requests at a time avoid overwhelming a slow connection. Failed or silent requests can be retried, keeping completed files. Every file is checked for its expected size and SHA-256 hash. The runtime uses local Blob URLs, so visiting scenes and seeking narration no longer require additional media transfers after preparation.

The browser Cache API retains completed downloads when storage is available. Cache keys include each file's content hash: return visits reuse valid recordings, while future updates replace only changed assets. Storage denial or quota exhaustion does not stop play; the complete download remains available for this session. Browser eviction can require another download later. Saves use the existing independent storage keys and are untouched by asset caching. A local extracted folder uses its existing disk files; the portable HTML already contains everything and bypasses the network loader.

Artwork decreased from 7,423,858 to 2,523,312 bytes (66.0%). Original dimensions and alpha are preserved. Large drawings use WebP quality 95; the handwritten Continue control and small UI textures stay lossless. Original recovered PNG files and their hashes remain unchanged in the source. `content/art-compression.json` and `tests/assets.py` check integrity, transparency and a minimum rendered PSNR of 40 dB against those originals. No story text, rules, cached voice recording, or music file changed.

`src/preload.js` implements the loader; `content/preload-assets.json` records the edition's complete download, and `tests/preload.mjs` covers successful loading, byte progress, cache reuse, interrupted downloads, retries, corruption, new versions, denied/full storage, stalled requests, title gating and local-folder compatibility. `tools/optimize-art.py` can reproduce image encoding from the author PNGs. `_headers` keeps the bootstrap fresh while allowing content-versioned media to be cached.

Live desktop verification on the public Cloudflare websites now confirms the complete loading screens, original town, local Blob media sources, narration progress, return loading and save/resume in both languages. This does not claim a mobile visual audit or human listening review.
