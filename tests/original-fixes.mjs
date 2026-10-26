// Fixes to the original game's wiring (see the comments in src/engine.js).
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createEngine, flags} from '../src/engine.js';
import {installLocale, testLocale} from './helpers/locale.mjs';
const code = testLocale();
const L = await installLocale(code);
const route = JSON.parse(fs.readFileSync(new URL('./fixtures/winning-route.json', import.meta.url)));
const at = n => {
  const e = createEngine({seed: route.seed});
  for (const a of route.actions.slice(0, n)) e.action(...a);
  return e;
};

// Straight to the water plant's control room, then the red button (either
// way of pushing it): the water stops, so the gardener can be told about it.
for (const choice of [1, 2]) {
  const e = at(82);
  e.action('go', 6);
  e.action('choice', 1);
  e.action('choice', 2);
  e.action('input', '8774');
  e.action('choice', 1);
  e.action('choice', 3);
  assert.deepEqual(e.snapshot().screen.parts.map(p => p.id), [2299]);
  e.action('choice', choice);
  const s = e.snapshot();
  assert.ok(s.screen.text.trim(), 'pushing it shows the alarm, not an empty page');
  assert.equal(s.state.itemWater, true, 'the button stops the water');
}

// Once a day: after talking to the girl on the avenue, she is gone from the
// avenue's menu until the next loop; the choice also survives a save and load.
{
  const girl = L.literals[1884].raw;
  const offers = e => e.snapshot().screen.options.some(o => o.raw === girl);
  const toMap = e => {
    for (let n = 0; n < 12 && e.snapshot().screen.kind !== 'map'; n++) {
      const s = e.snapshot();
      if (s.screen.kind === 'intro') e.action('next');
      else if (s.screen.needsContinue) e.action('continue');
      else e.action('choice', s.screen.options.findIndex(o => o.raw.trim()) + 1);
    }
  };
  let e = at(91);
  e.action('go', 7);
  assert.ok(offers(e), 'the girl is on the avenue in the afternoon');
  e.action('choice', e.snapshot().screen.options.findIndex(o => o.raw === girl) + 1);
  toMap(e);
  const loop = e.snapshot().state.loop;
  const copy = createEngine({seed: route.seed});
  copy.importSave(JSON.parse(JSON.stringify(e.exportSave())));
  for (const x of [e, copy]) {
    x.action('go', 7);
    assert.equal(offers(x), false, 'only once a day');
  }
  // A choice made on an earlier day does not count today.
  const earlier = e.exportSave();
  earlier.doneToday.loop = loop - 1;
  const next = createEngine({seed: route.seed});
  next.importSave(JSON.parse(JSON.stringify(earlier)));
  assert.ok(offers(next), 'available again on another day');
}

// The school gate in the morning: with both clues, Miss Summers can be met
// (the original only allowed dawn).
{
  const e = at(4);
  assert.equal(e.snapshot().state.phase, 'Morning');
  const b = new Uint8Array(e.debug.memory.buffer);
  for (const f of ['infoGirlParents', 'infoSchoolNeighbour']) b[e.debug.GC + 12 + flags.indexOf(f)] = 1;
  e.action('go', 8);
  e.action('choice', e.snapshot().screen.options.findIndex(o => o.raw === L.literals[1869].raw) + 1);
  assert.deepEqual(e.snapshot().screen.parts.map(p => p.id), [2245]);
  assert.equal(e.snapshot().state.phase, 'Morning');
}
// The water plant's public entrance shows the guard and his three answers;
// the original went straight on to the Fought outcome.
for (const [choice, outcome] of [[1, 2059], [2, 2223], [3, 2294]]) {
  const e = at(4);
  e.action('go', 6);
  e.action('choice', 1);
  e.action('choice', 1);
  const s = e.snapshot();
  assert.deepEqual(s.screen.parts.map(p => p.id), [2049]);
  assert.deepEqual(s.screen.options.map(o => o.parts[0].id), [2050, 2051, 2052]);
  e.action('choice', choice);
  assert.deepEqual(e.snapshot().screen.parts.map(p => p.id), [outcome]);
}
console.log(JSON.stringify({controlRoomButton: true, onceADay: true, morningGate: true, publicEntrance: true}));
