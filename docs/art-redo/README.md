# Redoing the wrong scene pictures

In October 2026 every scene picture was checked against the text shown with it (audit: content, mood, drawing errors). `plan.json` lists the 127 pictures that need work, `characters.json` holds the character notes (Valentine's entry there is superseded by the design below).

| group | pictures | what |
| --- | --- | --- |
| valentine | 25 | Valentine redesign (see below); redo all together |
| voice | 8 | the Voice drawn as a person, or a sunny street instead of the dark alley |
| defects | 8 | bodies through furniture (both sofa scenes 1981/1982, bench 1948…), impossible geometry |
| hobo | 7 | the hobo replaced by Fermat or a cook indoors |
| guard | 4 | the guard drawn as a janitor / a young man |
| wrong | 14 | other wrong people, places or moments |
| minor | 61 | acceptable; redo if budget allows |

## Style: edit the original paintings

The game's look is its original paintings: watercolour and gouache on rough paper, visible grain, fine sepia ink lines, muted earthy washes, natural proportions and understated faces. A first redraw (October 2026) painted new pictures from text prompts and digital character sheets; the content was right but the style drifted to a smooth, bright, cartoonish digital look, and the authors rejected all of it. The rule since then: **every fix is an edit of the original painting** (the model gets the original as image 1 and changes only what must change), with other original paintings or approved watercolour sheets as the only references. Never paint a scene from text alone, never "repaint" a digital picture, never pass a digital image as a reference. The one exception kept from the first redraw is 2474.

## Valentine

She is a manipulator and an actor: in every scene before the reveal she must look like a genuinely sweet, kind girl. Approved design (`valentine-sheet.png` in the art working files): eight years old, tousled brown bob, small round wire glasses, rosy cheeks, the red dress of the original paintings, white socks, dark shoes, and a child's sticker-covered notebook she always carries, closed. Only in 2087 and 2241 does a tiny corner of a page with technical drawings poke out of it. No hair clip, pencil, lab coat, goggles or machine, ever. Her true nature shows only as a perfectly calm, knowing face behind lenses that glint cold white; in the dark she is a silhouette with shining eyes, still holding the notebook.

## Telling the story through the pictures

The pictures are a sequence, not separate illustrations. Plan each one by what the player knows at that moment, and what they should only notice later.

- **Before the reveal**, Valentine is genuinely sweet; the notebook is always there and never framed as important.
- **The school reveal:** 2257 stops on the open false bottom of her desk; 2121 spreads out its contents (plans and schematics without readable text); 2123 is her diary of calculations; 2125 is Harry at night, alone with her small empty chair.
- **The ending reveal:** 2474 shows a child's black silhouette in the doorway with two points of light for eyes, unidentifiable. 2475 and 2477 bring her closer in the dark, same dress, same notebook. 2478 is the full reveal by moonlight on the roof: the friendly girl from the avenue, with no sweetness left. 2476 is Harry godlike in his certainty; 2479 is the first day after the loop.
- **Throughout**, keep recurring places looking the same (the alley, the school gate, Harry's flat, the sunflower on its sill), so changes in light and framing carry the emotion.

## Procedure

1. For each scene, edit its original painting with an image model that accepts reference images (Gemini image generation on Vertex AI): image 1 is the original, then only original paintings or approved watercolour sheets for characters; the prompt lists the changes and asks to keep everything else, including the brushwork.
2. Look at every result against the scene's full `text`, and at a close-up beside the same crop of the original to check the brushwork, before accepting it; regenerate until it is right, or keep the original.
3. Save as `assets/art/scenes/<key>.webp` at 1024×768 (quality 75, like `tools/compress_art.py`), update size and sha256 in `content/scene-illustrations.json`, check the text-box side in `content/scene-focus.json`, then `npm test`. `generated.json` records the method and prompt of every replaced picture.

Credentials: either sign in with `gcloud auth application-default login --no-launch-browser` (the author opens the link and pastes back the one-time code), or a Google Cloud service-account key with the "Vertex AI User" role, stored as the environment secret `VERTEX_SA_KEY` (the JSON), with `VERTEX_PROJECT` (project id) and `VERTEX_LOCATION` (e.g. `us-central1`). Never commit it.
