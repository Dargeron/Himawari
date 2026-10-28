import {L, t} from './i18n.js';
import {assetURL} from './assets.js';
import {destinations} from './engine.js';
import {cityLabels, cityRegions} from './graphics.js';
import {translatedSigns} from './signs.js';
import {el} from './inkbox.js';

// The author's hand-drawn town, filling the screen. Each place has a numbered
// paper tag pinned on the drawing (the buttons keyboards and screen readers
// use) and its building is a tap target too. Pencil marks on the tags remember
// today's visits; the flag pins a reminder to revisit.
export function createMap(root, {onGo, onPin}) {
  const sheet = root.querySelector('#map-sheet'),
    art = root.querySelector('#map-art'),
    spots = root.querySelector('#map-spots'),
    places = root.querySelector('#map-places');
  let built = false,
    memory = {visits: [], pins: []};

  function build() {
    if (built) return;
    built = true;
    const url = assetURL('assets/art/original/mapa_joc.webp');
    art.src = url;
    root.style.setProperty('--map-url', `url("${url}")`);
    const signs = translatedSigns('mapa_joc');
    if (signs) sheet.insertBefore(signs, root.querySelector('#map-tint'));
    for (const d of destinations) {
      // The building: a pointer target only; the tag below is the real control.
      const [x, y, w, h] = cityRegions[d.id];
      const spot = el('button', 'map-spot');
      spot.type = 'button';
      spot.tabIndex = -1;
      spot.dataset.destination = d.id;
      Object.assign(spot.style, {left: x + '%', top: y + '%', width: w + '%', height: h + '%'});
      spot.addEventListener('click', () => onGo(d.id));
      hover(spot, d.id);
      spots.append(spot);

      const [lx, ly] = cityLabels[d.id];
      const place = el('div', 'map-place');
      place.dataset.destination = d.id;
      Object.assign(place.style, {left: lx + '%', top: ly + '%'});
      const tag = el('button', 'map-tag');
      tag.type = 'button';
      tag.dataset.destination = d.id;
      const words = el('span', 'tag-words');
      words.append(el('span', 'tag-name', d.name), el('span', 'tag-visits'));
      tag.append(el('span', 'tag-n', String(d.id)), words);
      tag.addEventListener('click', () => onGo(d.id));
      hover(tag, d.id);
      const flag = el('button', 'tag-flag', '⚑');
      flag.type = 'button';
      flag.addEventListener('click', event => {
        event.stopPropagation();
        onPin(d.id);
      });
      place.append(tag, flag);
      places.append(place);
    }
  }

  function hover(node, id) {
    node.addEventListener('pointerenter', () => highlight(id, true));
    node.addEventListener('pointerleave', () => highlight(id, false));
    node.addEventListener('focus', () => highlight(id, true));
    node.addEventListener('blur', () => highlight(id, false));
  }

  function visitsFor(id) {
    return [...new Set(memory.visits.filter(v => v.place === id).map(v => v.phase))].map(p => L.phases[p]);
  }

  function labelFor(d) {
    const visited = visitsFor(d.id),
      pinned = memory.pins.includes(d.id);
    return [
      `${d.id}. ${d.name}`,
      visited.length ? t('map.visited', {phases: visited.join(', ')}) : '',
      pinned ? t('map.pinned') : '',
    ]
      .filter(Boolean)
      .join('. ');
  }

  function highlight(id, on) {
    for (const node of root.querySelectorAll(`[data-destination="${id}"]`)) node.classList.toggle('lit', on);
  }

  function show(s, journalMap) {
    build();
    memory = journalMap;
    root.hidden = false;
    root.dataset.phase = s.state.phase.toLowerCase();
    for (const place of places.children) {
      const d = destinations.find(x => x.id === Number(place.dataset.destination));
      const visited = visitsFor(d.id),
        pinned = memory.pins.includes(d.id);
      place.querySelector('.tag-visits').textContent = visited.join(' · ');
      place.classList.toggle('visited', visited.length > 0);
      place.classList.toggle('pinned', pinned);
      place.querySelector('.map-tag').setAttribute('aria-label', labelFor(d));
      const flag = place.querySelector('.tag-flag');
      flag.setAttribute('aria-pressed', String(pinned));
      flag.setAttribute('aria-label', t(pinned ? 'map.unpin' : 'map.pin', {place: d.name}));
      flag.title = flag.getAttribute('aria-label');
    }
  }

  function hide() {
    root.hidden = true;
  }

  return {show, hide};
}
