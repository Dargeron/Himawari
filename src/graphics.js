import {destinations} from './engine.js';
// The author's recovered sprites, without repainting or cropping them.
export const originalBuildings = {
  home: 'Casa',
  park: 'Parc',
  scrapyard: 'Abocador',
  warehouse: 'Magatzem',
  pizzeria: 'Pizza',
  waterplant: 'Aigua',
  avenue: 'Passeig',
  school: 'Escola',
};
export const cityRegions = {
  1: [14, 37, 19, 30],
  2: [54, 5, 46, 33],
  3: [0, 0, 25, 28],
  4: [59, 73, 34, 23],
  5: [62, 41, 20, 27],
  6: [13, 76, 38, 24],
  7: [43, 43, 14, 14],
  8: [23, 7, 32, 29],
};
export function originalScene(s) {
  if (s.screen.finished) return 'Ending_5b';
  if (s.screen.kind === 'map') return 'mapa_joc';
  if (s.screen.kind === 'intro')
    return s.screen.ending
      ? ['Ending_1b', 'Ending_2b', 'Ending_3b', 'ending_4b', 'Ending_5b'][s.screen.ending - 1]
      : 'hima' + Math.max(1, Math.min(5, s.state.t));
  return originalBuildings[destinations.find(d => d.id === s.state.place)?.key] || 'Casa';
}
