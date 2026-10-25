# Redoing the wrong scene pictures

In October 2026 every scene picture was checked against the text shown with it (audit: content, mood, drawing errors). `plan.json` lists the 127 pictures that need work, `characters.json` is the shared character sheet and style line. Every prompt in `plan.json` already includes the character entries it needs.

| group | pictures | what |
| --- | --- | --- |
| valentine | 25 | Valentine redesign (see below); redo all together |
| voice | 8 | the Voice drawn as a person, or a sunny street instead of the dark alley |
| defects | 8 | bodies through furniture (both sofa scenes 1981/1982, bench 1948…), impossible geometry |
| hobo | 7 | the hobo replaced by Fermat or a cook indoors |
| guard | 4 | the guard drawn as a janitor / a young man |
| wrong | 14 | other wrong people, places or moments |
| minor | 61 | acceptable; redo if budget allows |

## Valentine

She is a manipulator and an actor: in every scene before the reveal she must look like a genuinely sweet, kind girl. Three quiet clues pay off in hindsight and must appear consistently: an eclipsed-sun hair clip (black disc, thin golden ring), unusually bright attentive amber eyes that rest on the one thing that matters, and a sticker-covered child's notebook with a page of real schematics peeking out. Unmasked (2121, 2257, 2474–2478): lab coat, brass goggles, the same clip, a brass machine stamped with the same eclipse emblem.

## Procedure

1. Generate a character reference sheet first (Valentine, Harry, the hobo, Fermat, the guard, the street sweeper, Miss Summers, the neighbour) and get the author's approval of Valentine before any scene.
2. For each scene, generate with an image model that accepts reference images (Gemini image generation on Vertex AI), passing: the approved character sheet(s), one or two existing good scenes from the same place for style and setting, and the prompt. For pure drawing errors (group `defects`), edit the existing picture instead ("fix only the sofa: he sits on the cushion, legs in front of the armrest"), keeping everything else.
3. Look at every result against the scene's full `text` before accepting it; regenerate until it is right.
4. Save as `assets/art/scenes/<key>.webp` at 1024×768 (quality 75, like `tools/compress_art.py`), update size and sha256 in `content/scene-illustrations.json`, check the text-box side in `content/scene-focus.json`, then `npm test`.

Credentials: a Google Cloud service-account key with the "Vertex AI User" role, stored as the environment secret `VERTEX_SA_KEY` (the JSON), with `VERTEX_PROJECT` (project id) and `VERTEX_LOCATION` (e.g. `us-central1`). Never commit it.
