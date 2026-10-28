import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createEngine} from '../src/engine.js';
import {installLocale, testLocale} from './helpers/locale.mjs';

// The game screen, driven through the DOM of the built edition (run
// `python3 tools/build.py` first). The notebook has its own test.
const code = testLocale();
const L = await installLocale(code);
const {JSDOM} = await import('jsdom');
const dist = new URL(`../dist/${code}/`, import.meta.url);
if (!fs.existsSync(new URL('game.js', dist))) throw new Error('Build first: python3 tools/build.py');
const html = fs.readFileSync(new URL('index.html', dist), 'utf8');
const bundle = fs.readFileSync(new URL('game.js', dist), 'utf8');
const route = JSON.parse(fs.readFileSync(new URL('./fixtures/winning-route.json', import.meta.url)));
const flush = () => new Promise(resolve => setTimeout(resolve, 0));

function open({settings, save, storage = {}} = {}) {
  const dom = new JSDOM(html, {url: `https://himawari.test/${code}/`, runScripts: 'outside-only', pretendToBeVisual: true});
  const w = dom.window,
    d = w.document;
  w.structuredClone = structuredClone;
  w.scrollTo = () => {};
  w.Element.prototype.scrollTo = function ({top}) {
    this.scrollTop = top;
  };
  w.matchMedia = () => ({matches: false, addEventListener() {}});
  const voices = [];
  class TestAudio extends w.EventTarget {
    constructor() {
      super();
      Object.assign(this, {currentTime: 0, volume: 1, playbackRate: 1, paused: true, readyState: 1, src: '', plays: []});
      voices.push(this);
    }
    play() {
      this.paused = false;
      this.plays.push({file: this.src, start: this.currentTime});
      return Promise.resolve();
    }
    pause() {
      this.paused = true;
    }
    load() {
      this.dispatchEvent(new w.Event('loadedmetadata'));
    }
  }
  w.Audio = TestAudio;
  w.URL.createObjectURL = () => 'blob:test';
  w.URL.revokeObjectURL = () => {};
  if (settings) w.localStorage.setItem(L.settingsKey, typeof settings === 'string' ? settings : JSON.stringify(settings));
  if (save) w.localStorage.setItem(L.saveKey, JSON.stringify(save));
  for (const [key, value] of Object.entries(storage)) w.localStorage.setItem(key, value);
  w.eval(bundle);
  const $ = selector => d.querySelector(selector);
  const click = selector => {
    const node = typeof selector === 'string' ? $(selector) : selector;
    assert.ok(node, 'Missing control ' + selector);
    node.click();
  };
  const key = k => d.dispatchEvent(new w.KeyboardEvent('keydown', {key: k, code: k === ' ' ? 'Space' : k, bubbles: true}));
  const passageText = () => [...d.querySelectorAll('.passage:not(.past) p')].map(p => p.textContent).join(' ');
  return {dom, w, d, $, click, key, voices, passageText, snapshot: () => w.Himawari.snapshot()};
}
const clean = text => text.replace(/\s+/g, ' ').trim();

// 1. A first visit: the cover, then the opening written into the ink box.
{
  const g = open();
  await flush();
  assert.equal(g.d.title, 'Himawari');
  assert.equal(g.$('#title').hidden, false);
  assert.equal(g.$('#title-continue').hidden, true);
  assert.equal(g.$('#title-begin').textContent, L.strings['title.begin']);
  assert.match(g.$('.stage-layer.visible .stage-art')?.src || g.$('.stage-art').src, /cover\/title\.webp/);
  g.click('#title-begin');
  assert.equal(g.$('#title').hidden, true);
  assert.equal(g.$('#game').hidden, false);
  const s = g.snapshot();
  assert.equal(clean(g.passageText()), clean(s.screen.text));
  assert.equal(g.$('#hud-phase').textContent, L.phases.Dawn);
  assert.equal(g.$('#hud-time').getAttribute('aria-label'), L.strings['hud.time'].replace('{loop}', 1).replace('{phase}', L.phases.Dawn));
  assert.equal(g.$('#sr-story').textContent, s.screen.text, 'Screen readers get the whole passage at once');
  // Harry or Julian reads the opening.
  const voice = g.voices[0];
  assert.equal(voice.paused, false);
  assert.match(voice.plays[0].file, new RegExp(L.narration['2464'].file.replace(/[.]/g, '\\.')));
  // The author's chalk Continue (English) or the same lettering in Chinese.
  const cont = g.$('#ink-responses .ink-continue');
  assert.ok(cont);
  if (code === 'en') assert.match(cont.querySelector('img').src, /original\/continueBtn\.webp/);
  else assert.equal(cont.querySelector('span').textContent, '继续');
  // Temporary suspension resumes only narration that was playing.
  g.w.dispatchEvent(new g.w.Event('pagehide'));
  assert.equal(voice.paused, true);
  g.w.dispatchEvent(new g.w.Event('pageshow'));
  assert.equal(voice.paused, false);
  g.click('#voice-toggle');
  assert.equal(g.$('#voice-toggle').getAttribute('aria-label'), L.strings['voice.resume']);
  g.w.dispatchEvent(new g.w.Event('pagehide'));
  g.w.dispatchEvent(new g.w.Event('pageshow'));
  assert.equal(voice.paused, true, 'A deliberate pause stays paused');
  // One gesture: the first finishes the writing, the next continues.
  assert.ok(g.$('#inkbox').classList.contains('writing'));
  g.key(' ');
  assert.ok(!g.$('#inkbox').classList.contains('writing'));
  assert.ok(!g.$('#ink-responses').classList.contains('waiting'));
  g.key(' ');
  assert.equal(g.snapshot().screen.kind, 'map');
  // The map: eight buildings on the drawing, each with a numbered tag on it;
  // the ink box rests.
  assert.equal(g.d.querySelectorAll('.map-spot').length, 8);
  const tags = [...g.d.querySelectorAll('#map-places .map-tag')];
  assert.deepEqual(tags.map(tag => tag.querySelector('.tag-n').textContent), ['1', '2', '3', '4', '5', '6', '7', '8']);
  assert.equal(tags[1].querySelector('.tag-name').textContent, L.destinations[2].name);
  assert.equal(g.$('#map-prompt').textContent, L.strings['map.prompt']);
  assert.equal(g.d.querySelectorAll('#ink-responses button').length, 0);
  assert.match(g.$('#map-art').src, /original\/mapa_joc\.webp/);
  assert.equal(g.$('#map').hidden, false);
  assert.equal(g.$('#inkbox').dataset.mode, 'map');
  if (code === 'zh-CN') assert.ok(g.$('#map-sheet .translated-signs'), 'Chinese re-letters the map signs');
  else assert.ok(!g.$('#map-sheet .translated-signs'));
  g.key('2');
  let now = g.snapshot();
  assert.equal(now.state.place, 2);
  assert.equal(g.$('#map').hidden, true);
  g.key(' ');
  const visible = now.screen.options.filter(o => o.raw.trim());
  const buttons = g.d.querySelectorAll('button.choice');
  assert.equal(buttons.length, visible.length);
  assert.equal(buttons[0].getAttribute('aria-label'), L.strings['ink.choiceLabel'].replace('{n}', visible[0].choice).replace('{text}', visible[0].text));
  // The choices are never read aloud, and there is no control to read them.
  assert.ok(![...g.d.querySelectorAll('#inkbox button')].some(b => /read the choices|朗读选项/.test(b.textContent)));
  // Choosing keeps the passage and the choice in the rolling log.
  g.key(String(visible[3].choice));
  now = g.snapshot();
  assert.ok(g.$('.passage.past'), 'The earlier passage stays above, dimmed');
  assert.equal(g.$('.chosen').textContent, visible[3].text);
  assert.equal(clean(g.passageText()), clean(now.screen.text));
  g.dom.window.close();
}

function click(g, node) {
  assert.ok(node);
  node.click();
}

// 1b. Starting a day again from its dawn: the diary offers it once the day
// has moved on, and it returns the town to dawn with today's visits forgotten.
{
  const g = open({settings: {reducedMotion: true, narrationEnabled: false}});
  const now = g.w.Date.now;
  g.w.Date.now = () => route.seed;
  g.click('#title-begin');
  g.w.Date.now = now;
  const play = ([kind, value]) => {
    if (kind === 'go') g.click(`.map-spot[data-destination="${value}"]`);
    else if (kind === 'choice') g.click(g.$(`button.choice[data-choice="${value}"]`) || '#ink-responses .ink-continue');
    else g.click('#ink-responses .ink-continue');
  };
  const diary = () => {
    g.click('#notebook-button');
    g.click('#nb-tab-diary');
    return g.$('#nb-redo');
  };
  play(route.actions[0]);
  const dawn = g.snapshot();
  assert.equal(dawn.screen.kind, 'map');
  assert.equal(dawn.state.phase, 'Dawn');
  assert.equal(diary().hidden, true, 'Nothing to start again at dawn');
  g.click('#nb-close');
  for (const action of route.actions.slice(1, 5)) play(action);
  const later = g.snapshot();
  assert.notEqual(later.state.t, dawn.state.t);
  assert.ok(g.$('.map-place.visited'), 'A place visited today is marked');
  assert.equal(diary().hidden, false);
  g.click('#nb-redo-button');
  g.click('#nb-redo-confirm');
  const again = g.snapshot();
  assert.equal(again.screen.kind, 'map');
  assert.equal(again.state.phase, 'Dawn');
  assert.equal(again.state.loop, dawn.state.loop);
  assert.ok(!g.$('.map-place.visited'), "Today's visits are forgotten");
  g.dom.window.close();
}

// 2. The whole legal winning route through the interface, all six phases,
// read-before passages and the skip control along the way.
let finalSave;
{
  const g = open({settings: {reducedMotion: true, narrationEnabled: false}});
  // The route depends on the night's coin flips (where the hobo sleeps), so the
  // new game uses the route's seed.
  const now = g.w.Date.now;
  g.w.Date.now = () => route.seed;
  g.click('#title-begin');
  g.w.Date.now = now;
  const phases = new Set();
  let readSeen = false,
    skipOffered = false,
    cards = 0;
  for (const [kind, value] of route.actions) {
    if (!g.$('#card').hidden) cards++;
    if (kind === 'go') g.click(`.map-spot[data-destination="${value}"]`);
    else if (kind === 'choice') {
      const choice = g.$(`button.choice[data-choice="${value}"]`);
      g.click(choice || '#ink-responses .ink-continue');
    } else if (kind === 'input') {
      const answer = g.$('#answer');
      answer.value = code === 'zh-CN' && value === 'Martin' ? '马丁' : value;
      answer.form.dispatchEvent(new g.w.Event('submit', {cancelable: true}));
    } else g.click('#ink-responses .ink-continue');
    phases.add(g.$('#hud-phase').textContent);
    if (g.$('.passage.read:not(.past)')) readSeen = true;
    if (!g.$('#skip-button').hidden) skipOffered = true;
    const s = g.snapshot();
    if (s.screen.kind !== 'map' && !s.screen.finished) assert.equal(clean(g.passageText()), clean(s.screen.text));
  }
  assert.deepEqual([...phases].sort(), Object.values(L.phases).sort());
  assert.equal(cards, 0, 'Reduced motion never shows a phase card');
  assert.ok(readSeen, 'Passages read in an earlier loop are marked');
  assert.ok(skipOffered, 'Read passages with a single way forward offer skipping');
  const s = g.snapshot();
  assert.equal(s.screen.finished, true);
  assert.equal(clean(g.passageText()), clean(L.strings['ink.gameOver']));
  await flush();
  assert.match(g.$('.stage-layer.visible .stage-art').src, /scenes\/2461\.webp/);
  finalSave = g.w.localStorage.getItem(L.saveKey);
  assert.ok(finalSave.length < 120000, 'Saves stay compact');
  g.click('#ink-responses .ink-continue');
  assert.equal(g.$('#title').hidden, false);
  assert.equal(g.$('#title-continue').hidden, false);
  assert.equal(g.$('#title-begin').textContent, L.strings['title.newGame']);
  assert.equal(g.d.querySelectorAll('.polaroid').length, 4, 'The four endings this route lives through appear as photographs');
  g.dom.window.close();
}

// 3. Damaged settings never hide a healthy save; resuming restores the state.
{
  const e = createEngine({seed: 5});
  e.action('next');
  e.action('go', 3);
  const save = {edition: 1, engine: e.exportSave(), history: []};
  const g = open({settings: '{damaged', save});
  assert.equal(g.$('#title-continue').hidden, false);
  g.click('#title-continue');
  assert.deepEqual(JSON.parse(JSON.stringify(g.snapshot())), JSON.parse(JSON.stringify(e.snapshot())));
  assert.equal(clean(g.passageText()), clean(e.snapshot().screen.text));
  g.dom.window.close();
}

// 4. Each ending, reached from a prepared state, is written exactly.
for (let ending = 0; ending < 5; ending++) {
  const e = createEngine({seed: 12}),
    u = new Uint8Array(e.debug.memory.buffer),
    gc = e.debug.GC;
  for (const [idx, offset] of [[1, 32], [2, 44], [3, 46], [4, 19]]) u[gc + offset] = Number(ending >= idx);
  e.debug.core.GameController_TimeTravel(gc, 0);
  const g = open({settings: {reducedMotion: true, narrationEnabled: false}, save: {edition: 1, engine: e.exportSave(), history: []}});
  g.click('#title-continue');
  for (let n = 0; n < 8; n++) {
    const s = g.snapshot();
    if (s.screen.finished || s.screen.kind === 'map') break;
    assert.equal(clean(g.passageText()), clean(s.screen.text));
    g.click('#ink-responses button');
  }
  assert.equal(g.snapshot().screen.finished, ending === 4);
  g.dom.window.close();
}

// 5. An unsafe save is refused without touching the title.
{
  const unsafe = createEngine({seed: 17}).exportSave();
  unsafe.alloc = 4100000;
  const g = open({save: {edition: 1, engine: unsafe, history: []}});
  g.click('#title-continue');
  assert.equal(g.$('#title').hidden, false);
  assert.equal(g.$('#toast').textContent, L.strings['save.unreadable']);
  g.dom.window.close();
}

// 6. Skipping races through read passages and stops at the first decision,
// new passage, map or typed answer. It never chooses for the player.
{
  const g = open({settings: {reducedMotion: true, narrationEnabled: false}});
  g.click('#title-begin');
  let index = 0;
  for (; index < route.actions.length && g.$('#skip-button').hidden; index++) {
    const [kind, value] = route.actions[index];
    if (kind === 'go') g.click(`.map-spot[data-destination="${value}"]`);
    else if (kind === 'choice') g.click(g.$(`button.choice[data-choice="${value}"]`) || '#ink-responses .ink-continue');
    else if (kind === 'input') {
      g.$('#answer').value = value;
      g.$('#answer').form.dispatchEvent(new g.w.Event('submit', {cancelable: true}));
    } else g.click('#ink-responses .ink-continue');
  }
  assert.ok(index < route.actions.length, 'Skipping is offered during the route');
  const start = g.snapshot();
  g.key('s');
  for (let n = 0; n < 60 && g.$('#skip-button').getAttribute('aria-pressed') === 'true'; n++) await new Promise(r => setTimeout(r, 60));
  const end = g.snapshot();
  assert.notDeepEqual(JSON.parse(JSON.stringify(end.screen)), JSON.parse(JSON.stringify(start.screen)), 'Skipping moved on');
  const decision = end.screen.kind === 'map' || end.screen.input || end.screen.finished || end.screen.options.filter(o => o.raw.trim()).length > 1 && !/^(>|<\s*Continue\s*>)$/i.test(end.screen.options.filter(o => o.raw.trim())[0].raw.trim());
  assert.ok(decision || !g.$('.passage.read:not(.past)'), 'Skipping stops at a decision or at something new');
  assert.equal(g.$('#skip-button').getAttribute('aria-pressed'), 'false');
  g.dom.window.close();
}
await flush();
console.log(JSON.stringify({ui: 'game screen', language: code, winningRoute: route.actions.length, phases: 6, endings: 5, rollingLog: true, readBefore: true, skip: true, map: 8, saveResume: true, unsafeSaveRefused: true}));
