// Fixes to the original game's wiring (see the comments in src/engine.js).
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createEngine} from '../src/engine.js';
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
console.log(JSON.stringify({controlRoomButton: true}));
