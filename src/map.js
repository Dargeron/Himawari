import {L, t} from './i18n.js';
import {assetURL} from './assets.js';
import {destinations} from './engine.js';
import {cityRegions} from './graphics.js';
import {translatedSigns} from './signs.js';
import {el} from './inkbox.js';

// The author's hand-drawn town. Each building is a button on the drawing; the
// same places are listed in the ink box for keyboards and small screens.
// Pencil marks remember today's visits and the player's own pins.
export function createMap(root, {onGo, onPin}) {
  const sheet = root.querySelector('#map-sheet'),
    art = root.querySelector('#map-art'),
    spots = root.querySelector('#map-spots');
  let built = false,
    memory = {visits: [], pins: []};

  function build() {
    if (built) return;
    built = true;
    art.src = assetURL('assets/art/original/mapa_joc.webp');
    const signs = translatedSigns('mapa_joc');
    if (signs) sheet.insertBefore(signs, root.querySelector('#map-tint'));
    for (const d of destinations) {
      const [x, y, w, h] = cityRegions[d.id];
      const spot = el('button', 'map-spot');
      spot.type = 'button';
      spot.dataset.destination = d.id;
      Object.assign(spot.style, {left: x + '%', top: y + '%', width: w + '%', height: h + '%'});
      const tag = el('span', 'spot-tag');
      tag.append(el('span', 'spot-name', d.name), el('span', 'spot-visits'));
      spot.append(tag, el('span', 'spot-pin', '⚑'));
      spot.addEventListener('click', () => onGo(d.id));
      spot.addEventListener('pointerenter', () => highlight(d.id, true));
      spot.addEventListener('pointerleave', () => highlight(d.id, false));
      spot.addEventListener('focus', () => highlight(d.id, true));
      spot.addEventListener('blur', () => highlight(d.id, false));
      spots.append(spot);
    }
  }

  function visitsFor(id) {
    return [...new Set(memory.visits.filter(v => v.place === id).map(v => v.phase))].map(p => L.phases[p]);
  }

  function labelFor(d) {
    const visited = visitsFor(d.id),
      pinned = memory.pins.includes(d.id);
    return [d.name, visited.length ? t('map.visited', {phases: visited.join(', ')}) : '', pinned ? t('map.pinned') : '']
      .filter(Boolean)
      .join('. ');
  }

  function highlight(id, on) {
    for (const node of document.querySelectorAll(`[data-destination="${id}"]`)) node.classList.toggle('lit', on);
  }

  function show(s, journalMap) {
    build();
    memory = journalMap;
    root.hidden = false;
    root.dataset.phase = s.state.phase.toLowerCase();
    for (const spot of spots.children) {
      const d = destinations.find(x => x.id === Number(spot.dataset.destination));
      const visited = visitsFor(d.id);
      spot.querySelector('.spot-visits').textContent = visited.join(' · ');
      spot.classList.toggle('visited', visited.length > 0);
      spot.classList.toggle('pinned', memory.pins.includes(d.id));
      spot.setAttribute('aria-label', labelFor(d));
    }
  }

  function hide() {
    root.hidden = true;
  }

  // The list of places for the ink box, numbered for the keyboard.
  function placeList() {
    const list = el('ol', 'ink-places');
    for (const d of destinations) {
      const item = el('li', 'ink-place');
      const go = el('button', 'place');
      go.type = 'button';
      go.dataset.destination = d.id;
      go.setAttribute('aria-label', labelFor(d));
      const visited = visitsFor(d.id);
      go.append(el('span', 'choice-n', String(d.id)), el('span', 'place-name', d.name));
      if (visited.length) go.append(el('span', 'place-visits', visited.join(' · ')));
      go.addEventListener('click', () => onGo(d.id));
      go.addEventListener('pointerenter', () => highlight(d.id, true));
      go.addEventListener('pointerleave', () => highlight(d.id, false));
      go.addEventListener('focus', () => highlight(d.id, true));
      go.addEventListener('blur', () => highlight(d.id, false));
      const pinned = memory.pins.includes(d.id);
      const pin = el('button', 'place-pin', '⚑');
      pin.type = 'button';
      pin.setAttribute('aria-pressed', String(pinned));
      pin.setAttribute('aria-label', t(pinned ? 'map.unpin' : 'map.pin', {place: d.name}));
      pin.title = pin.getAttribute('aria-label');
      pin.addEventListener('click', event => {
        event.stopPropagation();
        onPin(d.id);
      });
      item.append(go, pin);
      list.append(item);
    }
    return list;
  }

  return {show, hide, placeList};
}
