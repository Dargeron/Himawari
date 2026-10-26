# Start here: instructions for the next AI

You have the complete **Himawari 1.5.0 bilingual game**, prepared for Albert Casals on 25 October 2026. The owner's goal is to upload these files to GitHub and make both editions playable with GitHub Pages. These instructions describe the project, not permission to access an account or overwrite an unrelated repository. Use the owner's current instructions to select and authorize the destination.

## Assemble the delivery

This complete handoff is delivered as two ordinary ZIPs. Download and extract **both** `Himawari-GitHub-part-1.zip` and `Himawari-GitHub-part-2.zip` into the same parent directory, merging their common `Himawari-GitHub-complete/` folder. Part 1 supplies English, workflow, root documentation and the Chinese edition’s original art; Part 2 supplies the remaining Chinese files. The full integrity inventory covers both parts. Do not upload only Part 1.

## Immediate procedure

1. Read the root `README.md` and `deployment/release.json`. This root documentation supersedes stale publication-status text in historical edition reports.
2. Keep both `english/` and `chinese/` intact. All 246 scene pictures, original city art, cached narration, original music and source are already included. There is no remaining art-generation queue or missing voice service to connect.
3. Run `python3 scripts/verify_handoff.py` before editing if this is the original unpacked bundle. It compares files with `HANDOFF-SHA256.json`.
4. Run `python3 scripts/build_site.py`. It rebuilds both languages and stages `dist/` with a root language picker, `en/` and `zh-CN/`. It verifies every preloaded file and all 246 distinct images per edition. No npm install is needed for this build.
5. Optionally serve `dist/` with `python3 -m http.server 8000 --directory dist`; interact through a browser supported by your environment. Do not assume a local preview is available in every agent environment.
6. Confirm the GitHub destination from the owner's request or authenticated account context. Use an empty repository by default. Do not overwrite an existing repository, force-push, invent an account/repository name, or publish source publicly based only on these handoff instructions.
7. Push the **extracted files**, preserving `.github/`, `.gitignore` and `.gitattributes`. Do not push this delivery archive as a repository file and do not commit `dist/` or node_modules. Use Git rather than many browser uploads. Individual source/media files are below GitHub's 100 MiB Git limit for this release.
8. Set repository Settings → Pages → Source to **GitHub Actions**. Run `.github/workflows/pages.yml`. It builds and deploys both editions from `main`; adjust the trigger if the owner chooses a different default branch. GitHub's own temporary token is sufficient.
9. Verify the successful Actions run and its exact deployment URL. Test the selector and both games, preloading, original clickable map, scene-specific art, a full-screen night/typewriter sequence, narration pause/replay and save/reload. A first load is large; wait for completion before deciding it is broken.
10. Report the actual live GitHub Pages links and any checks you could not complete. Preparing a workflow or pushing a commit alone is not evidence of a successful Pages deployment.

## Preserve these design and mechanics decisions

- The original recovered controller determines puzzles, flags, destinations, time advances and all five endings. Do not rewrite it to make a test easier.
- The original city map stays clickable. Story art uses watercolor, uneven brown ink and warm parchment; every scene has its mapped distinct picture. Night sequences fill the screen and reveal text letter by letter, with a Show all text control and reduced-motion support.
- English narrator: **Harry**. Chinese narrator: **Julian**. Keep the existing recordings and original music unchanged unless explicitly asked otherwise.
- Notebook, diary, daily clue, learned-death forecast, conspiracy board, sunflower ritual, discoveries, evolving title, map history/pins, loop reset, ending album and past-choice markers are implemented already. Keep save migration and spoiler gates.
- English and Chinese retain their independent save/settings keys. Moving from Cloudflare to GitHub changes origin, so use Export save → Import save to move progress.
- `content/literals.json` has original `raw` and displayed `text` strings. Editing raw comparisons can break puzzles. `src/recovered-core.js` and `recovery/` preserve the original decisions and test oracle.
- Always rebuild after a runtime/media edit so preload sizes/hashes and `index.html` version agree. Never disable integrity checks to suppress an error.

## Validation and credentials

Full tests use Node 24+, pinned npm dependencies, Python, Pillow and ffprobe. In each edition run `npm ci --no-audit --no-fund` and `npm test`. Preserve the existing 18,000-action original-mechanics comparison and 261-action legal winning-route coverage. Production play/build does not need npm or those test tools.

No Cloudflare, GitHub, ElevenLabs or other secret is embedded here. Do not obtain secrets from logs or inject any into source. Use the platform's secure account authentication. GitHub Pages requires no paid game backend, worker, API key or voice regeneration. Cloudflare configs identify the owner's existing Workers, but no credential is included. Do not modify those Workers just to publish GitHub Pages.

Historical reports inside edition folders include prior browser limitations and unpublished states. Read the root current release record to distinguish earlier notes from the finished release. Do not claim a new GitHub publication until it has actually succeeded. Keep original author credits and do not invent a permissive license for the recovered game or media.

## Acceptance criteria

Both language URLs load their complete assets, Begin works, original map hotspots work, the correct narrator's status appears, and different passages show their mapped art. Night scenes have full-screen imagery and working reveal/continue controls. Save/reload remains stable, all 246 pictures pass integrity validation, the Pages deployment succeeds, and the owner receives working URLs with an honest validation summary.
