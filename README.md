# Himawari — complete bilingual GitHub handoff

Release **1.5.0**, prepared 25 October 2026. The complete English (Harry) and Simplified Chinese (Julian) games are included, with editable source, original recovered artwork, all 246 distinct scene illustrations in each edition, cached narration, music, recovery data, and regression tests. No game server, paid API, or media generation is needed to play or build.

**Another AI should read `AI-START-HERE.md` first.** The owner requested this handoff for a future GitHub upload; no GitHub repository has been created by preparing this bundle.

## Unpack the complete handoff

Download **both** `Himawari-GitHub-part-1.zip` and `Himawari-GitHub-part-2.zip`. These are ordinary ZIPs, not numbered fragments. Extract both into the **same parent directory**; their `Himawari-GitHub-complete/` folders merge. Part 1 contains English, all setup files and the Chinese edition’s original art; Part 2 contains the remaining Chinese files. Then open this root directory and read `AI-START-HERE.md`. Do not ask your ZIP app to replace the whole first folder when extracting the second; merge its contents.

```sh
python3 -m zipfile -e Himawari-GitHub-part-1.zip unpacked
python3 -m zipfile -e Himawari-GitHub-part-2.zip unpacked
cd unpacked/Himawari-GitHub-complete
python3 scripts/verify_handoff.py
```

## Run locally

Requires Python 3.10+ (3.12 recommended). From this directory:

```sh
python3 scripts/build_site.py
python3 -m http.server 8000 --directory dist
```

Open `http://localhost:8000/`, then choose English or 简体中文. Use an ordinary browser. The first hosted visit prepares all media before Begin; English downloads about 183 MB and Chinese about 242 MB including code. Completed media is cached when the browser permits it. Begin unlocks audio; headphones are recommended. Saves are local to the browser and origin. Export/import saves to move between Cloudflare, local hosting and GitHub Pages.

## Publish on GitHub Pages

1. Extract this bundle. Open a terminal inside the directory containing this README and `.github/`.
2. Authenticate Git/GitHub CLI with the owner's account. Use a **new empty repository** unless the owner has named an existing destination. Choose repository visibility with the owner; a public repository exposes all source and media. GitHub Free supports Pages for public repositories; private Pages availability depends on the plan.
3. Commit the extracted files, including `.github/workflows/pages.yml`. Upload the files with Git, not this ZIP as a repository file. For an empty repository, replace `OWNER/REPO` below:

```sh
git init -b main
git add .
git commit -m "Add complete bilingual Himawari game"
git remote add origin https://github.com/OWNER/REPO.git
git push -u origin main
```

4. In the repository, open **Settings → Pages → Build and deployment → Source → GitHub Actions**. Ensure Actions is enabled for the repository.
5. Open **Actions → Publish both Himawari editions → Run workflow**, select `main`, and run it. Later pushes to `main` rebuild and deploy automatically.
6. Wait for both build and deploy jobs to succeed. Open the exact URL shown by the deployment. The root offers a language choice; `en/` and `zh-CN/` contain the games. Paths are relative and work beneath a project repository path.

The Pages workflow uses GitHub's temporary `GITHUB_TOKEN`/OIDC permissions. No Cloudflare or ElevenLabs credential belongs in GitHub secrets for this workflow. Do not add secrets to this repository.

Each individual included file is below 100 MiB, so Git LFS is unnecessary for this release. The combined published site is approximately 426 MB, below Pages' 1 GB site limit. GitHub's browser uploader has lower limits and is unsuitable for this many files. Do not commit `dist/`, dependencies, portable HTML exports or archive copies. Large initial clones/downloads are expected because the full voice recordings are included.

## Repository contents

| Path | Contents |
| --- | --- |
| `english/` | Complete editable English project and prebuilt static runtime |
| `chinese/` | Complete editable Chinese project and prebuilt static runtime |
| `scripts/build_site.py` | Rebuilds both projects, checks all media hashes and stages public files |
| `web/index.html` | Language selector |
| `.github/workflows/pages.yml` | GitHub Pages build/deployment |
| `deployment/cloudflare/` | Optional existing Cloudflare deployment tooling, with no token |
| `deployment/release.json` | Publication results and validation scope |
| `HANDOFF-SHA256.json` | Integrity inventory of the handoff files |

The build publishes **only** the language selector and each edition's runtime/media. Source, recovery fixtures, tests, historical reports, author PNGs and narration alignment JSON are retained in the repository but excluded from the website artifact. Each edition has an independent build and its own save/settings keys. Shared artwork and music remain duplicated in the two source folders to keep them independently portable.

`english/README.md` and `chinese/README.md` include the reconstruction history. Older version notes and test reports describe earlier states; use the root release record for current publication status. The Chinese archive deliberately omits redundant unused English recordings/prototypes and historical provider-generation JSON sidecars; its entire Mandarin runtime is included. `content/released-narration-integrity.json` pins all 230 unchanged released Mandarin recordings and the narrator configuration so the full test suite remains usable without fabricated provider metadata. This does not omit any playable Chinese content.

## Edit, build and test

Edit `src/` and `content/` inside the relevant edition. `scripts/build_site.py` rebuilds `game.js`, `preload.js` and all preload checksums. Do not hand-edit generated bundles or checksums. Edit only the displayed `text` fields for prose fixes: original `raw` strings and controller comparisons are puzzle logic. The original recovered WASM in `recovery/` is a verification oracle, not a server dependency.

For the complete regression suite, install Node **24+**, Python 3, **FFmpeg/ffprobe** and the Python **Pillow** package. Then run in each edition directory:

```sh
npm ci --no-audit --no-fund
npm test
```

Use a virtual environment for Pillow if required by your platform. JavaScript DOM tests use the pinned jsdom dependency in each package lock. The production build needs only Python's standard library, and gameplay needs only a browser. Tests include original-mechanics comparisons, the legal 261-action winning route, all five endings, save recovery, audio transitions, notebook features, preload caching/integrity, 246 images and cinematic text. Tests can write validation reports into their edition's content/test folders; inspect those changes before committing.

Do not regenerate narration or artwork. All used recordings and pictures are already local. Optional media-generation tools are historical editing utilities and require separately supplied credentials only if the owner deliberately requests changed media.

## Existing Cloudflare websites

- English: https://himawari-english.bauldejuegos.workers.dev/
- Chinese: https://himawari-chinese.bauldejuegos.workers.dev/

These remain independent of GitHub Pages. Nothing in the Pages workflow modifies Cloudflare. For a separately authorized Cloudflare update, read `deployment/cloudflare/README.md`.

## Troubleshooting

- **404 at the Pages root:** choose GitHub Actions as the Pages source and inspect the deploy job URL. Commit the bundle's contents at the repository root, not an extra enclosing folder. If the default branch is not `main`, update the workflow trigger or rename the branch.
- **Missing artwork/audio or integrity failure:** restore the original bytes or rebuild after intentional changes. Preserve filename case. Never rename assets without rebuilding their references. `_headers` is a Cloudflare feature and is not interpreted by Pages; Pages uses its own headers, while the game's SHA-256 cache still validates media.
- **Long initial load:** this release intentionally downloads all media before starting. Keep the tab open; use Retry if shown. A returning visit can reuse cached media, though browser storage eviction can force another download.
- **No narration:** click Begin/Continue or the voice play button, check voice/music settings and the browser's audio policy. The cached recordings do not need API access.
- **Progress missing on a new URL:** export a save from the old site and import it in the new site. Browsers do not share local storage across origins.
- **Mobile review:** desktop live checks and automated tests do not constitute a full phone/browser compatibility or human listening audit.

## Credits and rights

Original game by **Liam McHara**: https://liammchara.itch.io/himawari . Preserve the existing credits, recovered original artwork/music, English Harry narration and Mandarin Julian narration. This handoff does not assign a new open-source license or grant rights to third-party game/media assets. Follow the owner's established permissions when choosing repository visibility or redistributing the work.

## GitHub references checked 25 October 2026

- Custom Pages workflows: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
- Pages limits and plan availability: https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
- Upload/file limits: https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository
- Python setup action: https://github.com/actions/setup-python
