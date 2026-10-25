#!/usr/bin/env bash
# Publish the current commit as a GitHub release with the Android APK.
#
# Pushes the commit to the throwaway branch `release-drop`. The Android
# workflow (.github/workflows/android.yml) builds the APK there, creates the
# release tagged v<version> (version from package.json) at that commit with
# .github/release-notes.md, and deletes the branch. Nothing extra is
# committed: the APK is built in the workflow, never stored in git.
#
# The commit must already be pushed to a branch, so the tag points at shared
# history. Usage: tools/release.sh
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

VERSION=$(node -p "require('./package.json').version")
SRC=$(git rev-parse HEAD)
[[ -z "$(git status --porcelain --untracked-files=no)" ]] || { echo "release: commit your changes first" >&2; exit 1; }
git fetch -q origin
git branch -r --contains "$SRC" | grep -q . || { echo "release: push $SRC first (the tag points at it)" >&2; exit 1; }
if git ls-remote --exit-code --heads origin release-drop > /dev/null; then
  echo "release: origin/release-drop still exists (a release in progress or a failed run); check the Actions tab" >&2
  exit 1
fi
if git ls-remote --exit-code --tags origin "v$VERSION" > /dev/null; then
  echo "release: v$VERSION already exists; raise the version in package.json first" >&2
  exit 1
fi

git push -q origin "$SRC:refs/heads/release-drop"
echo "release: $VERSION pushed to release-drop; the Android workflow publishes it at"
echo "  https://github.com/Dargeron/Himawari/releases/tag/v$VERSION"
