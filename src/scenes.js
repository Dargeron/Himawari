import {L} from './i18n.js';
import {originalScene} from './graphics.js';
export function illustrationKey(s) {
  if (s.screen.kind === 'map') return null;
  const pinned = s.screen.parts.find(p => p.scene && L.scenes[p.scene]);
  if (pinned) return pinned.scene;
  const ids = s.screen.parts.filter(p => Number.isInteger(p.id)).map(p => p.id);
  if (ids.includes(1890)) return 'diary';
  const key = ids.join('-');
  if (L.scenes[key]) return key;
  for (const id of [...ids].reverse()) if (L.scenes[String(id)]) return String(id);
  return null;
}
export function sceneArtPath(s) {
  const key = illustrationKey(s);
  return key ? L.scenes[key].asset : 'assets/art/original/' + originalScene(s) + '.webp';
}
