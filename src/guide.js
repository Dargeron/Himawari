import {L} from './i18n.js';

// This observer only reads snapshots. Assistance never changes the controller.
const diaryFlags = {
  infoGorra: 1891,
  infoWarehouse: 1892,
  infoHoboSandwich: 1893,
  infoCrash: 1894,
  infoVistNena: 1895,
  infoFermat: 1896,
  infoEvilGirl: 1897,
  infoNeighbour: 1898,
  infoLoop: 1899,
  infoAllergy: 1900,
  infoSniper: 1901,
  infoWeapon: 1903,
  infoSchoolNeighbour: 1905,
  infoGirlParents: 1906,
};
// Completed actions recorded in the diary, keyed to the passage that shows them.
const diaryEvents = {
  wood: 1960,
  barricade: 2318,
  love: 1958,
  gun: 2286,
  herbicide: 2221,
  neighbourStopped: 2470,
  substitute: 2325,
  schoolEntry: 2351,
};
const endingDiary = {1: 1898, 2: 1901, 3: 1902, 4: 1904};
const endingReveals = {1: [2468, 2469], 2: [2470], 3: [2472], 4: [2474, 2475], 5: [2477, 2478, 2479]};
const clueIds = [
  'first',
  'connections',
  'neighbour',
  'feelings',
  'sniper',
  'weapon',
  'poison',
  'fermat',
  'gardener',
  'bribe',
  'destroyer',
  'school',
  'inside',
  'preparations',
];
function guideNight(s) {
  return (
    s.screen.kind === 'intro' &&
    !s.screen.finished &&
    /^(endIntro[12]|noLove2?|noGun|noPoison2?|noEvil[23]?|victory[234]?)$/.test(s.state.introNode)
  );
}
export function guideDay(s) {
  return Math.max(1, s.state.loop - (guideNight(s) ? 1 : 0));
}
function validDay(n) {
  return Number.isSafeInteger(n) && n >= 1;
}
function nativeText(id) {
  return L.literals[id].text.trim().replace(/^[-–]\s*/, '');
}
function factText(id) {
  if (id.startsWith('flag:')) return nativeText(diaryFlags[id.slice(5)]);
  if (id.startsWith('ending:')) return nativeText(endingDiary[id.slice(7)]);
  return L.diaryEvents[id.slice(6)];
}
const validFacts = new Set([
  ...Object.keys(diaryFlags).map(k => 'flag:' + k),
  ...Object.keys(diaryEvents).map(k => 'event:' + k),
  'ending:3',
  'ending:4',
]);

export function createGuide(saved) {
  const memory = {version: 1, facts: [], seenEndings: [], clue: null};
  if (saved?.version === 1) {
    for (const fact of Array.isArray(saved.facts) ? saved.facts : []) {
      if (validFacts.has(fact?.id) && validDay(fact.loop) && !memory.facts.some(f => f.id === fact.id))
        memory.facts.push({id: fact.id, loop: fact.loop});
    }
    memory.seenEndings = [
      ...new Set(
        (Array.isArray(saved.seenEndings) ? saved.seenEndings : []).filter(
          n => Number.isInteger(n) && n >= 1 && n <= 5,
        ),
      ),
    ];
    if (validDay(saved.clue?.day) && clueIds.includes(saved.clue.id))
      memory.clue = {day: saved.clue.day, id: saved.clue.id};
  }
  function add(id, day) {
    if (!memory.facts.some(f => f.id === id)) memory.facts.push({id, loop: day});
  }
  function observe(s) {
    const day = guideDay(s),
      ids = new Set(s.screen.parts.map(p => p.id));
    for (const [flag] of Object.entries(diaryFlags)) if (s.state[flag]) add('flag:' + flag, day);
    for (const [flag, n] of [
      ['infoNeighbour', 1],
      ['infoSniper', 2],
    ])
      if (s.state[flag] && !memory.seenEndings.includes(n)) memory.seenEndings.push(n);
    for (const [event, entry] of Object.entries(diaryEvents)) if (ids.has(entry)) add('event:' + event, day);
    for (const [ending, reveals] of Object.entries(endingReveals))
      if (s.screen.kind === 'intro' && s.screen.ending === Number(ending) && reveals.some(id => ids.has(id))) {
        const n = Number(ending);
        if (!memory.seenEndings.includes(n)) memory.seenEndings.push(n);
        if (n === 3 || n === 4) add('ending:' + n, day);
      }
  }
  // Old saves lack observer memory. Only text actually in their reading history
  // can recover an experienced ending; infoFinalboss is set too early in Unity.
  function recoverHistory(history) {
    for (const h of Array.isArray(history) ? history : []) {
      if (typeof h?.text !== 'string' || !validDay(h.loop)) continue;
      for (const [ending, ids] of Object.entries(endingReveals)) {
        const text = L.historyLabel ? L.historyLabel(h.text) : h.text;
        if (ids.some(id => text.includes(L.literals[id].text))) {
          const n = Number(ending);
          if (!memory.seenEndings.includes(n)) memory.seenEndings.push(n);
          if (n === 3 || n === 4) add('ending:' + n, h.loop);
        }
      }
    }
  }
  function forecast(s) {
    if (s.screen.finished) return {known: true, ending: 0, text: L.forecast.survived};
    const st = s.state,
      next = !st.itemLove ? 1 : !st.itemGun ? 2 : !st.itemPoison ? 3 : !st.infoEvilGirl ? 4 : 0;
    if (next === 0) return {known: true, ending: 0, text: L.forecast.handled};
    if (!memory.seenEndings.includes(next)) return {known: false, ending: 0, text: L.forecast.unknown};
    return {known: true, ending: next, text: L.forecast.known[next]};
  }
  function chooseClue(s) {
    const st = s.state;
    if (memory.seenEndings.includes(1) && !st.itemLove)
      return st.infoAllergy ? 'feelings' : st.infoGorra && !st.infoWarehouse ? 'connections' : 'neighbour';
    if (memory.seenEndings.includes(2) && !st.itemGun) return st.infoWeapon ? 'weapon' : 'sniper';
    if (memory.seenEndings.includes(3) && !st.itemPoison)
      return st.itemSandWich ? 'bribe' : st.itemWater ? 'gardener' : st.infoFermat ? 'fermat' : 'poison';
    if (memory.seenEndings.includes(4) && !st.infoEvilGirl)
      return memory.facts.some(f => f.id === 'event:schoolEntry')
        ? 'inside'
        : st.infoGirlParents || st.infoSchoolNeighbour
          ? 'school'
          : 'destroyer';
    if (st.infoEvilGirl || memory.seenEndings.length) return 'preparations';
    return st.infoGorra ? 'connections' : 'first';
  }
  function clue(s) {
    const day = guideDay(s),
      used = memory.clue?.day === day;
    return {
      day,
      used,
      available: !used && !guideNight(s) && !s.screen.finished,
      text: used ? L.clues[memory.clue.id] : '',
    };
  }
  function requestClue(s) {
    const status = clue(s);
    if (status.available) memory.clue = {day: status.day, id: chooseClue(s)};
    return clue(s);
  }
  function summary(s) {
    return {
      day: guideDay(s),
      facts: memory.facts.map(f => ({...f, text: factText(f.id)})),
      forecast: forecast(s),
      clue: clue(s),
      preparations: [
        s.state.itemLove ? L.preparations.love : '',
        s.state.itemGun ? L.preparations.gun : '',
        s.state.itemPoison ? L.preparations.poison : '',
      ].filter(Boolean),
    };
  }
  return {observe, recoverHistory, forecast, clue, requestClue, summary, exportSave: () => structuredClone(memory)};
}
