import {L, t} from './i18n.js';
import {assetURL} from './assets.js';
import {destinations} from './engine.js';
import {cityLabels, cityRegions} from './graphics.js';
import {translatedSigns} from './signs.js';
import {el} from './inkbox.js';

// The author's hand-drawn town, filling the screen. Each place has a numbered
// paper tag pinned on the drawing (the buttons keyboards and screen readers
// use) and its building is a tap target too. Pencil marks on the tags remember
// today's visits; the flag pins a reminder to revisit. The drawing zooms
// (pinch, drag, double tap, mouse wheel) with the tags kept at their size, and
// choosing a place flies into its building before the scene appears.
// Up to 3x, but never far beyond the drawing's own resolution (1280 px).
const maxZoom = width => Math.min(3, Math.max(1.5, 2048 / width));

export function createMap(root, {onGo, onPin, reduced = () => false}) {
  const sheet = root.querySelector('#map-sheet'),
    art = root.querySelector('#map-art'),
    spots = root.querySelector('#map-spots'),
    places = root.querySelector('#map-places');
  let built = false,
    memory = {visits: [], pins: []},
    view = {z: 1, x: 0, y: 0},
    busy = false,
    flew = false,
    departing = false,
    leaveTimer = 0;

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
      spot.addEventListener('click', () => go(d.id));
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
      tag.addEventListener('click', () => go(d.id));
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

  // --- Zoom ------------------------------------------------------------------
  // The sheet is scaled from its top-left corner; view.x and view.y move it.
  // A zoomed drawing never leaves a gap at an edge it could cover, and a
  // dimension smaller than the screen stays centred.

  function base() {
    return {
      left: sheet.offsetLeft,
      top: sheet.offsetTop,
      w: sheet.offsetWidth,
      h: sheet.offsetHeight,
      vw: root.clientWidth,
      vh: root.clientHeight,
    };
  }

  function clamp({z, x, y}) {
    const b = base();
    z = Math.min(maxZoom(b.w), Math.max(1, z));
    const fit = (pos, size, room, offset) =>
      size * z <= room ? (room - size * z) / 2 - offset : Math.min(-offset, Math.max(room - size * z - offset, pos));
    return {z, x: fit(x, b.w, b.vw, b.left), y: fit(y, b.h, b.vh, b.top)};
  }

  function apply(next, {ease = false} = {}) {
    view = clamp(next);
    sheet.style.transition = ease ? 'transform 260ms var(--ease)' : '';
    sheet.style.transform = `translate(${view.x}px, ${view.y}px) scale(${view.z})`;
    sheet.style.setProperty('--z', String(view.z));
    root.classList.toggle('zoomed', view.z > 1.01);
  }

  // Zoom to z keeping the point under (cx, cy) where it is.
  function zoomAt(z, cx, cy, options) {
    const b = base();
    const px = (cx - b.left - view.x) / view.z,
      py = (cy - b.top - view.y) / view.z;
    apply({z, x: cx - b.left - px * z, y: cy - b.top - py * z}, options);
  }

  const pointers = new Map();
  let gesture = null,
    dragged = -Infinity,
    lastTap = {t: 0, x: 0, y: 0};

  function startGesture() {
    gesture = {view: {...view}, points: [...pointers.values()].map(p => ({...p})), moved: false};
  }
  root.addEventListener('pointerdown', event => {
    if (busy || root.hidden || event.button > 0) return;
    pointers.set(event.pointerId, {x: event.clientX, y: event.clientY});
    startGesture();
  });
  window.addEventListener('pointermove', event => {
    if (!pointers.has(event.pointerId) || !gesture) return;
    pointers.set(event.pointerId, {x: event.clientX, y: event.clientY});
    const now = [...pointers.values()],
      start = gesture.points;
    const b = base();
    if (now.length >= 2 && start.length >= 2) {
      const dist = (p, q) => Math.hypot(p.x - q.x, p.y - q.y) || 1;
      const mid = (p, q) => ({x: (p.x + q.x) / 2, y: (p.y + q.y) / 2});
      const z = gesture.view.z * (dist(now[0], now[1]) / dist(start[0], start[1]));
      const m0 = mid(start[0], start[1]),
        m = mid(now[0], now[1]);
      const cx = (m0.x - b.left - gesture.view.x) / gesture.view.z,
        cy = (m0.y - b.top - gesture.view.y) / gesture.view.z;
      const zz = Math.min(maxZoom(b.w), Math.max(1, z));
      apply({z: zz, x: m.x - b.left - cx * zz, y: m.y - b.top - cy * zz});
      gesture.moved = true;
    } else if (now.length === 1 && start.length === 1) {
      const dx = now[0].x - start[0].x,
        dy = now[0].y - start[0].y;
      if (Math.hypot(dx, dy) > 6) gesture.moved = true;
      if (gesture.view.z > 1.01 && gesture.moved) apply({z: gesture.view.z, x: gesture.view.x + dx, y: gesture.view.y + dy});
    }
  });
  const lift = event => {
    if (!pointers.has(event.pointerId)) return;
    const point = pointers.get(event.pointerId);
    pointers.delete(event.pointerId);
    const moved = gesture?.moved;
    if (moved) dragged = performance.now();
    else if (!pointers.size && event.type === 'pointerup') {
      // Double tap on the drawing: zoom in there, or back out.
      const now = performance.now();
      if (now - lastTap.t < 320 && Math.hypot(point.x - lastTap.x, point.y - lastTap.y) < 30) {
        if (view.z > 1.2) apply({z: 1, x: 0, y: 0}, {ease: true});
        else zoomAt(2.2, point.x, point.y, {ease: true});
        lastTap = {t: 0, x: 0, y: 0};
      } else lastTap = {t: now, x: point.x, y: point.y};
    }
    if (pointers.size) startGesture();
    else gesture = null;
  };
  window.addEventListener('pointerup', lift);
  window.addEventListener('pointercancel', lift);
  // A drag or pinch is not a tap on the place under the finger.
  root.addEventListener(
    'click',
    event => {
      if (performance.now() - dragged < 350) {
        event.stopPropagation();
        event.preventDefault();
      }
    },
    true,
  );
  root.addEventListener(
    'wheel',
    event => {
      if (busy || root.hidden) return;
      event.preventDefault();
      zoomAt(view.z * Math.exp(-event.deltaY * 0.0018), event.clientX, event.clientY);
    },
    {passive: false},
  );

  // --- Going somewhere: fly into the building, then the scene takes over. ---

  function go(id) {
    if (busy || !destinations.some(d => d.id === id)) return;
    if (reduced() || !sheet.animate) return onGo(id);
    busy = true;
    const [x, y, w, h] = cityRegions[id];
    const b = base();
    const z = Math.min(3, (0.8 * b.vw) / ((w / 100) * b.w), (0.8 * b.vh) / ((h / 100) * b.h));
    const tx = b.vw / 2 - b.left - ((x + w / 2) / 100) * b.w * z,
      ty = b.vh / 2 - b.top - ((y + h / 2) / 100) * b.h * z;
    sheet.style.transition = '';
    const flight = sheet.animate(
      [
        {transform: `translate(${view.x}px, ${view.y}px) scale(${view.z})`},
        {transform: `translate(${tx}px, ${ty}px) scale(${z})`},
      ],
      {duration: 620, easing: 'cubic-bezier(0.55, 0, 0.3, 1)', fill: 'forwards'},
    );
    places.animate([{opacity: 1}, {opacity: 0}], {duration: 300, fill: 'forwards'});
    flight.finished.then(() => {
      flew = true;
      onGo(id);
      // If the town is still showing (the move was refused), settle back.
      if (!root.hidden && !departing) reset();
    });
  }

  function reset() {
    clearTimeout(leaveTimer);
    departing = false;
    root.classList.remove('leaving');
    for (const a of [...(sheet.getAnimations?.() ?? []), ...(places.getAnimations?.() ?? [])]) a.cancel();
    busy = false;
    flew = false;
    apply({z: 1, x: 0, y: 0});
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
    reset();
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

  // After a flight the zoomed drawing holds while the scene's picture comes in
  // behind it, then dissolves into it.
  function hide() {
    if (!flew) {
      root.hidden = true;
      return;
    }
    flew = false;
    departing = true;
    leaveTimer = setTimeout(() => {
      root.classList.add('leaving');
      leaveTimer = setTimeout(() => {
        root.hidden = true;
        reset();
      }, 480);
    }, 450);
  }

  return {show, hide, go};
}
