import {L} from './i18n.js';
import {createEngine, destinations} from './engine.js';
import {sceneArtPath} from './scenes.js';
import {visibleOptions} from './screens.js';

// Ask the loader for what the player is about to need. The current screen's
// narration comes first; then a private copy of the rules works out every
// screen one action away, so its picture and voice are ready before the tap.
// The real game state is never touched.
export function createPrefetch(boot) {
  if (!boot?.prefetch) return {current() {}, ahead() {}};
  let probe = null,
    queued = 0;
  const idle = globalThis.requestIdleCallback || (fn => setTimeout(() => fn({timeRemaining: () => 8}), 120));

  function narrationFiles(parts) {
    const files = new Set();
    for (const part of parts || []) {
      const clip = L.narration[String(part.id)];
      if (clip) files.add(clip.file);
    }
    return [...files];
  }

  function needs(s) {
    if (s.screen.kind === 'map') return ['assets/art/original/mapa_joc.webp'];
    return [sceneArtPath(s), ...narrationFiles(s.screen.parts)];
  }

  function current(s) {
    boot.prefetch(needs(s), {priority: 'high'});
  }

  function candidates(s) {
    const {screen} = s;
    if (screen.finished || screen.input) return [];
    if (screen.kind === 'map') return destinations.map(d => ['go', d.id]);
    if (screen.kind === 'intro') return [['next']];
    if (screen.needsContinue) return [['continue']];
    return visibleOptions(screen).map(o => ['choice', o.choice]);
  }

  // `save` is the engine export the game just wrote; probing restores from it.
  function ahead(s, save) {
    const mine = ++queued,
      actions = candidates(s);
    const step = () =>
      idle(() => {
        if (mine !== queued || !actions.length) return;
        const action = actions.shift();
        try {
          probe ??= createEngine();
          probe.importSave(save);
          boot.prefetch(needs(probe.action(...action)), {priority: 'low'});
        } catch {}
        step();
      });
    step();
  }

  return {current, ahead};
}
