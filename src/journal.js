import {L, t} from './i18n.js';
import {destinations} from './engine.js';
import {guideDay} from './guide.js';

// An observer, never a second rules engine. Only displayed text and completed
// player actions enter this notebook; its editing methods cannot advance time.
export const endingPages = {
  1: [2466, 2468, 2469],
  2: [2466, 2470],
  3: [2466, 2471, 2472],
  4: [2466, 2473, 2474, 2475],
  5: [2466, 2476, 2477, 2478, 2479],
};
const endingFinal = {1: 2469, 2: 2470, 3: 2472, 4: 2475, 5: 2479};
export const endingName = n => L.endings[n];
export const endingArt = {1: 'Ending_1b', 2: 'Ending_2b', 3: 'Ending_3b', 4: 'ending_4b', 5: 'Ending_5b'};
const journalPeople = () => L.people;
const journalItems = [
  'Strange artifact',
  'Barricade',
  'Chocolate',
  'Crowbar',
  'Flowers',
  'Gun',
  'Poison',
  'Sandwich',
  'School key',
];
const validLiteral = id =>
  Number.isInteger(id) &&
  ((id >= 1838 && id <= 2355) || (id >= 2464 && id <= 2479)) &&
  typeof L.literals[id]?.text === 'string';
const journalDay = n => Number.isSafeInteger(n) && n >= 1;
const journalPhase = p => ['Dawn', 'Morning', 'Noon', 'Afternoon', 'Dusk', 'Night'].includes(p);
const notebookText = (text, max = 500) => (typeof text === 'string' ? text.slice(0, max).trim() : '');
function cleanParts(parts) {
  return (Array.isArray(parts) ? parts : [])
    .slice(0, 40)
    .flatMap(p =>
      validLiteral(p?.id) ? [{id: p.id}] : typeof p?.text === 'string' ? [{text: p.text.slice(0, 120)}] : [],
    );
}
export function journalText(parts) {
  return cleanParts(parts)
    .map(p => (p.id === undefined ? p.text : L.literals[p.id].text))
    .join('');
}
function journalContext(s) {
  return JSON.stringify([s.state.place, s.state.node, cleanParts(s.screen.parts)]);
}
function clipPosition(n, max) {
  return Math.max(0, Math.min(max, Number.isFinite(n) ? n : 0));
}
export function createJournal(saved) {
  const data = {
    version: 1,
    passages: [],
    people: [],
    objects: [],
    places: [],
    cards: [],
    links: [],
    visits: [],
    pins: [],
    choices: [],
    endingSeen: [],
    unread: [],
    ritualDays: [],
    day: 1,
    nextCard: 1,
  };
  if (saved?.version === 1) {
    const passageKeys = new Set();
    for (const p of (Array.isArray(saved.passages) ? saved.passages : []).slice(0, 600)) {
      const parts = cleanParts(p?.parts),
        key = JSON.stringify(parts);
      if (!parts.length || !journalDay(p?.loop) || passageKeys.has(key)) continue;
      passageKeys.add(key);
      data.passages.push({
        parts,
        loop: p.loop,
        phase: journalPhase(p.phase) ? p.phase : 'Dawn',
        place: destinations.some(d => d.id === p.place) ? p.place : 1,
      });
    }
    data.people = [
      ...new Set(
        (Array.isArray(saved.people) ? saved.people : []).filter(key => journalPeople().some(p => p[0] === key)),
      ),
    ];
    data.objects = [
      ...new Set((Array.isArray(saved.objects) ? saved.objects : []).filter(x => journalItems.includes(x))),
    ];
    for (const key of ['places', 'pins'])
      data[key] = [
        ...new Set((Array.isArray(saved[key]) ? saved[key] : []).filter(x => destinations.some(d => d.id === x))),
      ];
    for (const v of (Array.isArray(saved.visits) ? saved.visits : []).slice(-400))
      if (journalDay(v?.day) && journalPhase(v.phase) && destinations.some(d => d.id === v.place))
        data.visits.push({day: v.day, phase: v.phase, place: v.place});
    data.day = journalDay(saved.day) ? saved.day : 1;
    data.ritualDays = [...new Set((Array.isArray(saved.ritualDays) ? saved.ritualDays : []).filter(journalDay))].slice(
      -400,
    );
    data.unread = [
      ...new Set((Array.isArray(saved.unread) ? saved.unread : []).filter(x => typeof x === 'string' && x.length < 80)),
    ].slice(0, 50);
    // The album only uses actual recorded ending passages. No engine flag can
    // unlock an illustration or fill an unheard page with the rest of its text.
    const observed = new Set(data.passages.flatMap(p => p.parts.flatMap(x => (x.id === undefined ? [] : [x.id]))));
    data.endingSeen = [...observed].filter(id => Object.values(endingPages).some(ids => ids.includes(id)));
    for (const c of (Array.isArray(saved.cards) ? saved.cards : []).slice(0, 32)) {
      if (!/^c\d+$/.test(c?.id) || data.cards.some(x => x.id === c.id)) continue;
      if (c.kind === 'theory' && !notebookText(c.text)) continue;
      if (c.kind !== 'theory' && (c.kind !== 'recorded' || typeof c.source !== 'string' || c.source.length > 4000))
        continue;
      data.cards.push({
        id: c.id,
        kind: c.kind,
        source: c.kind === 'recorded' ? c.source : '',
        text: c.kind === 'theory' ? notebookText(c.text) : '',
        x: clipPosition(c.x, 74),
        y: clipPosition(c.y, 72),
        crossed: c.kind === 'theory' && !!c.crossed,
      });
    }
    data.nextCard = Math.max(0, ...data.cards.map(c => Number(c.id.slice(1)))) + 1;
    for (const l of (Array.isArray(saved.links) ? saved.links : []).slice(0, 48))
      if (
        l?.from !== l?.to &&
        data.cards.some(c => c.id === l?.from) &&
        data.cards.some(c => c.id === l?.to) &&
        !data.links.some(x => x.from === l.from && x.to === l.to)
      )
        data.links.push({from: l.from, to: l.to, label: notebookText(l.label, 80)});
    for (const c of (Array.isArray(saved.choices) ? saved.choices : []).slice(-500))
      if (
        typeof c?.key === 'string' &&
        c.key.length < 5000 &&
        Number.isInteger(c.choice) &&
        c.choice >= 1 &&
        c.choice <= 4 &&
        journalDay(c.loop)
      )
        data.choices.push({
          key: c.key,
          choice: c.choice,
          option: cleanParts(c.option),
          loop: c.loop,
          phase: journalPhase(c.phase) ? c.phase : 'Dawn',
          outcome: cleanParts(c.outcome),
          map: !!c.map,
          afterPhase: journalPhase(c.afterPhase) ? c.afterPhase : 'Dawn',
          gained: (Array.isArray(c.gained) ? c.gained : []).filter(x => journalItems.includes(x)),
          lost: (Array.isArray(c.lost) ? c.lost : []).filter(x => journalItems.includes(x)),
        });
  }
  function addPassage(parts, loop, phase, place) {
    const clean = cleanParts(parts),
      key = JSON.stringify(clean);
    if (!clean.length || !journalText(clean).trim()) return;
    if (!data.passages.some(p => JSON.stringify(p.parts) === key) && data.passages.length < 600)
      data.passages.push({parts: clean, loop, phase, place});
    const text = journalText(clean);
    for (const [id, , pattern] of journalPeople())
      if (pattern.test(text) && !data.people.includes(id)) data.people.push(id);
    for (const p of clean)
      if (Object.values(endingPages).some(ids => ids.includes(p.id)) && !data.endingSeen.includes(p.id))
        data.endingSeen.push(p.id);
  }
  // Whether this exact passage has been read before, in any loop.
  function seen(parts) {
    const key = JSON.stringify(cleanParts(parts));
    return key !== '[]' && data.passages.some(p => JSON.stringify(p.parts) === key);
  }
  function observe(s) {
    data.day = guideDay(s);
    const phase = s.screen.kind === 'intro' && data.day < s.state.loop ? 'Night' : s.state.phase;
    if (s.screen.kind !== 'map' && !s.screen.finished) addPassage(s.screen.parts, data.day, phase, s.state.place || 1);
    for (const item of s.inventory)
      if (journalItems.includes(item) && !data.objects.includes(item)) data.objects.push(item);
  }
  function recoverHistory(history) {
    if (saved?.version === 1) return;
    for (const h of (Array.isArray(history) ? history : []).slice(-120)) {
      if (!journalDay(h?.loop) || typeof h?.text !== 'string') continue;
      const text = L.historyLabel ? L.historyLabel(h.text) : h.text;
      const matches = Object.entries(L.literals)
        .filter(([id, l]) => validLiteral(Number(id)) && l.text.trim().length >= 20 && text.includes(l.text))
        .map(([id, l]) => ({id: Number(id), at: text.indexOf(l.text)}))
        .sort((a, b) => a.at - b.at);
      for (const m of matches)
        addPassage(
          [{id: m.id}],
          h.loop,
          journalPhase(h.phase) ? h.phase : 'Dawn',
          destinations.find(d => d.name === h.location || d.englishName === h.location)?.id || 1,
        );
      data.day = Math.max(data.day, h.loop);
    }
  }
  function catalog(facts = []) {
    return [
      ...facts.map(f => ({
        id: 'fact:' + f.id,
        kind: 'Diary entry',
        title: t('journal.finding', {loop: f.loop}),
        text: f.text,
        loop: f.loop,
      })),
      ...data.passages.map((p, i) => ({
        id: 'passage:' + i,
        kind: 'Quotation',
        title: (destinations.find(d => d.id === p.place) || destinations[0]).name + ' · ' + L.phases[p.phase],
        text: journalText(p.parts),
        loop: p.loop,
        parts: p.parts,
      })),
      ...data.people.map(id => ({
        id: 'person:' + id,
        kind: 'Person mentioned',
        title: journalPeople().find(p => p[0] === id)[1],
        text: journalPeople().find(p => p[0] === id)[1],
      })),
      ...data.places.map(id => ({
        id: 'place:' + id,
        kind: 'Place visited',
        title: destinations.find(d => d.id === id).name,
        text: destinations.find(d => d.id === id).name,
      })),
      ...data.objects.map(name => ({id: 'object:' + name, kind: 'Object recorded', title: L.items[name], text: L.items[name]})),
    ];
  }
  function board(facts = []) {
    const sources = catalog(facts),
      cards = data.cards
        .filter(c => c.kind === 'theory' || sources.some(s => s.id === c.source))
        .map(c => ({...c, record: c.kind === 'recorded' ? sources.find(s => s.id === c.source) : null}));
    return {cards, links: data.links.filter(l => cards.some(c => c.id === l.from) && cards.some(c => c.id === l.to))};
  }
  function addCard(kind, value, facts = []) {
    if (kind === 'recorded' && !catalog(facts).some(c => c.id === value)) return null;
    if (kind === 'recorded' && data.cards.some(c => c.source === value))
      return data.cards.find(c => c.source === value).id;
    if (data.cards.length >= 32) return null;
    if (kind !== 'theory' && kind !== 'recorded') return null;
    if (kind === 'theory' && !notebookText(value)) return null;
    const n = data.cards.length,
      id = 'c' + data.nextCard++;
    data.cards.push({
      id,
      kind,
      source: kind === 'recorded' ? value : '',
      text: kind === 'theory' ? notebookText(value) : '',
      x: 4 + (n % 3) * 25,
      y: 5 + (Math.floor(n / 3) % 3) * 25,
      crossed: false,
    });
    return id;
  }
  function moveCard(id, x, y) {
    const c = data.cards.find(c => c.id === id);
    if (c) {
      c.x = clipPosition(x, 74);
      c.y = clipPosition(y, 72);
    }
  }
  function removeCard(id) {
    data.cards = data.cards.filter(c => c.id !== id);
    data.links = data.links.filter(l => l.from !== id && l.to !== id);
  }
  function editTheory(id, text, crossed) {
    const c = data.cards.find(c => c.id === id && c.kind === 'theory');
    if (c && notebookText(text)) {
      c.text = notebookText(text);
      c.crossed = !!crossed;
    }
  }
  function connect(from, to, label) {
    if (
      from === to ||
      !data.cards.some(c => c.id === from) ||
      !data.cards.some(c => c.id === to) ||
      data.links.length >= 48
    )
      return false;
    const found = data.links.find(l => (l.from === from && l.to === to) || (l.from === to && l.to === from));
    if (found) found.label = notebookText(label, 80);
    else data.links.push({from, to, label: notebookText(label, 80)});
    return true;
  }
  function disconnect(from, to) {
    data.links = data.links.filter(l => !(l.from === from && l.to === to));
  }
  function recordAction(before, kind, value, after) {
    if (kind === 'go' && before.screen.kind === 'map' && destinations.some(d => d.id === Number(value))) {
      // Label visits with the phase displayed when the destination was chosen.
      // The original controller owns the actual time advance, including nightfall.
      const place = Number(value);
      data.visits.push({day: guideDay(before), phase: before.state.phase, place});
      data.visits = data.visits.slice(-400);
      if (!data.places.includes(place)) data.places.push(place);
    }
    if (kind === 'choice') {
      const option = before.screen.options.find(o => o.choice === value);
      if (!option) return;
      const entry = {
        key: journalContext(before),
        choice: value,
        option: cleanParts(option.parts),
        loop: guideDay(before),
        phase: before.state.phase,
        outcome: cleanParts(after.screen.parts),
        map: after.screen.kind === 'map',
        afterPhase: after.state.phase,
        gained: after.inventory.filter(i => !before.inventory.includes(i)),
        lost: before.inventory.filter(i => !after.inventory.includes(i)),
      };
      data.choices = data.choices.filter(c => !(c.key === entry.key && c.choice === entry.choice));
      data.choices.push(entry);
      data.choices = data.choices.slice(-500);
    }
  }
  function echo(s, choice) {
    const option = s.screen.options.find(o => o.choice === choice),
      key = journalContext(s);
    return structuredClone(
      data.choices.find(
        c =>
          c.key === key &&
          c.choice === choice &&
          JSON.stringify(c.option) === JSON.stringify(cleanParts(option?.parts)),
      ) || null,
    );
  }
  function map(day = data.day) {
    return {visits: data.visits.filter(v => v.day === day).map(v => ({...v})), pins: [...data.pins]};
  }
  // Starting a day again: its visits never happened.
  function forgetVisits(day) {
    data.visits = data.visits.filter(v => v.day !== day);
  }
  function togglePin(place) {
    if (!destinations.some(d => d.id === place)) return;
    data.pins = data.pins.includes(place) ? data.pins.filter(p => p !== place) : [...data.pins, place];
  }
  function markDiscoveries(ids) {
    for (const id of ids)
      if (typeof id === 'string' && !data.unread.includes(id) && data.unread.length < 50) data.unread.push(id);
  }
  function clearUnread() {
    data.unread = [];
  }
  function ritual(s) {
    if (
      s.screen.finished ||
      s.screen.kind === 'map' ||
      !(s.state.place === 1 || s.screen.kind === 'intro') ||
      guideDay(s) < s.state.loop
    )
      return false;
    const day = guideDay(s);
    if (!data.ritualDays.includes(day)) data.ritualDays.push(day);
    data.ritualDays = data.ritualDays.slice(-400);
    return true;
  }
  function album() {
    return Object.entries(endingFinal)
      .filter(([, id]) => data.endingSeen.includes(id))
      .map(([number]) => ({
        number: Number(number),
        name: endingName(number),
        art: endingArt[number],
        parts: endingPages[number].filter(id => data.endingSeen.includes(id)).map(id => ({id})),
        loop: data.passages.find(p => p.parts.some(x => x.id === endingFinal[number]))?.loop || 1,
      }));
  }
  function cover(facts = []) {
    return {
      day: data.day,
      findings: facts.slice(-3),
      theories: data.cards
        .filter(c => c.kind === 'theory')
        .slice(-2)
        .map(c => ({...c})),
      endings: album().slice(-2),
      unread: data.unread.length,
      ritual: data.ritualDays.includes(data.day),
    };
  }
  return {
    observe,
    seen,
    recoverHistory,
    catalog,
    board,
    addCard,
    moveCard,
    removeCard,
    editTheory,
    connect,
    disconnect,
    recordAction,
    echo,
    map,
    togglePin,
    forgetVisits,
    markDiscoveries,
    clearUnread,
    ritual,
    album,
    cover,
    exportSave: () => structuredClone(data),
  };
}
