# Optional Cloudflare redeployment

The existing Workers are `himawari-english` and `himawari-chinese` in the account identified by the included Wrangler configs. GitHub Pages publishing does not need or run this tooling.

For a separately authorized update to those Workers, first build from the repository root:

```sh
python3 scripts/build_site.py
```

Then from this directory install the pinned Wrangler and deploy the relevant edition:

```sh
npm ci --no-audit --no-fund
python3 cloudflare-session.py english.wrangler.json
python3 cloudflare-session.py chinese.wrangler.json
```

Each command prompts for the owner's Cloudflare API token with hidden input and passes it only to the child process environment. No token is included in this bundle. Do not put credentials into JSON configs, terminal arguments, git history or README files. The configs deploy the newly staged `../../dist/en` and `../../dist/zh-CN` respectively. These commands replace the public Worker versions; do not run them merely to test a GitHub Pages build.

If you need a different Cloudflare account or names, obtain the destination from the owner and edit the nonsecret configs accordingly. The root `deployment/release.json` records the versions published on 25 October 2026.
