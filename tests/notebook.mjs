// The notebook in the built page: node tests/notebook.mjs [en|zh-CN]
// Loads dist/<code>/index.html and game.js in jsdom with simulated media, and
// drives the notebook the way a player would: pointer, keyboard and forms.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {JSDOM, VirtualConsole} from 'jsdom';
import {installLocale, testLocale, uiStrings} from './helpers/locale.mjs';

const code = testLocale();
const L = await installLocale(code);
const {createEngine} = await import('../src/engine.js');
const {createJournal, journalText} = await import('../src/journal.js');
const strings = uiStrings(code);
const t = (key, vars) => (strings[key] ?? key).replace(/\{(\w+)\}/g, (_, name) => String(vars?.[name] ?? ''));

const dist = new URL(`../dist/${code}/`, import.meta.url);
if (!fs.existsSync(new URL('game.js', dist))) throw new Error('Build the site first: python3 tools/build.py');
const html = fs.readFileSync(new URL('index.html', dist), 'utf8');
const bundle = fs.readFileSync(new URL('game.js', dist), 'utf8');
const route = JSON.parse(fs.readFileSync(new URL('./fixtures/winning-route.json', import.meta.url)));
const clone = x => JSON.parse(JSON.stringify(x));
const tick = () => new Promise(resolve => setImmediate(resolve));
const settingsKey = L.settingsKey,
  saveKey = L.saveKey;

// --- A page ------------------------------------------------------------------------

const pages = [];
function boot(initial = {}) {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', error => {
    if (!/Not implemented: (navigation|HTMLMediaElement)/.test(error.message)) errors.push(error);
  });
  const dom = new JSDOM(html, {
    url: `https://himawari-test.invalid/${code}/`,
    runScripts: 'outside-only',
    pretendToBeVisual: true,
    virtualConsole,
  });
  pages.push(dom);
  const w = dom.window,
    d = w.document,
    audios = [];
  for (const [name, value] of Object.entries(initial)) w.localStorage.setItem(name, value);
  w.structuredClone = structuredClone;
  w.scrollTo = () => {};
  w.Element.prototype.scrollTo = function () {};
  w.Element.prototype.scrollIntoView = function () {};
  w.matchMedia = () => ({matches: false, addEventListener() {}, removeEventListener() {}});
  w.URL.createObjectURL = () => 'blob:test';
  w.URL.revokeObjectURL = () => {};
  class TestAudio extends w.EventTarget {
    constructor() {
      super();
      Object.assign(this, {
        currentTime: 0,
        volume: 1,
        playbackRate: 1,
        paused: true,
        readyState: 1,
        src: '',
        plays: [],
      });
      audios.push(this);
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
  // Downloads and the language link would navigate; the page only needs the click.
  w.addEventListener(
    'click',
    event => event.target.closest?.('a[download], a[hreflang]') && event.preventDefault(),
    true,
  );
  w.HIMAWARI_BOOT = {
    whenReady: async () => true,
    ready: () => true,
    prefetch() {},
    reveal: () => (d.getElementById('loader').hidden = true),
  };
  w.eval(bundle);

  const $ = id => d.getElementById(id);
  const visible = node => !!node && !node.closest('[hidden]');
  const click = target => {
    const node = typeof target === 'string' ? d.querySelector(target) : target;
    assert.ok(node, 'Missing ' + target);
    assert.ok(visible(node), 'Hidden ' + (node.id || target));
    assert.ok(!node.disabled, 'Disabled ' + (node.id || target));
    node.click();
  };
  const key = (name, init = {}, target = d.activeElement || d.body) =>
    target.dispatchEvent(new w.KeyboardEvent('keydown', {key: name, bubbles: true, cancelable: true, ...init}));
  const submit = id => $(id).dispatchEvent(new w.Event('submit', {bubbles: true, cancelable: true}));
  const saved = () => JSON.parse(w.localStorage.getItem(saveKey) || 'null');
  const snapshot = () => clone(w.Himawari.snapshot());
  const open = () => !$('notebook').hidden;
  const view = name => visible($('nb-' + name));
  const selectedTab = () => d.querySelector('.nb-tab[aria-selected="true"]')?.dataset.tab;
  const inside = () => $('nb-book').contains(d.activeElement);
  const storage = () => Object.fromEntries(Object.keys(w.localStorage).map(k => [k, w.localStorage.getItem(k)]));
  async function importSave(payload) {
    const input = $('nb-import-file');
    const text = JSON.stringify(payload);
    Object.defineProperty(input, 'files', {configurable: true, value: [{size: text.length, text: async () => text}]});
    input.dispatchEvent(new w.Event('change'));
    await tick();
    await tick();
  }
  // One step of the story with the keyboard, as a player would.
  function act([kind, value]) {
    const target = $('ink-scroll');
    if (kind === 'input') {
      $('answer').value = value;
      $('answer')
        .closest('form')
        .dispatchEvent(new w.Event('submit', {bubbles: true, cancelable: true}));
    } else if (kind === 'go') key(String(value), {}, target);
    else if (kind === 'choice') {
      const option = w.Himawari.snapshot().screen.options.filter(o => o.raw.trim());
      const lone = option.length === 1 && /^(?:>|<\s*Continue\s*>)$/i.test(option[0].raw.trim());
      key(lone ? ' ' : String(value), {}, target);
    } else key(' ', {}, target);
  }
  return {
    dom,
    w,
    d,
    $,
    audios,
    errors,
    click,
    key,
    submit,
    saved,
    snapshot,
    open,
    view,
    selectedTab,
    inside,
    storage,
    importSave,
    act,
    visible,
  };
}

const quiet = {[settingsKey]: JSON.stringify({textSpeed: 'instant', reducedMotion: true})};
const results = {};

// --- From the title: settings, credits, focus, Escape, backdrop -----------------------

{
  const p = boot(quiet);
  const {$, d, click, key, open, view, selectedTab, inside} = p;
  assert.equal(open(), false);
  $('title-settings').focus();
  click('#title-settings');
  assert.ok(open(), 'Settings opens the notebook');
  assert.ok(view('settings'));
  assert.equal(selectedTab(), 'settings');
  const book = $('nb-book');
  assert.equal(book.getAttribute('role'), 'dialog');
  assert.equal(book.getAttribute('aria-modal'), 'true');
  assert.match(book.getAttribute('aria-labelledby'), /nb-title/);
  assert.ok(
    book
      .getAttribute('aria-labelledby')
      .split(' ')
      .every(id => $(id)),
    'The dialog is labelled by real headings',
  );
  assert.ok(inside(), 'Focus moves into the notebook');
  assert.ok($('title').inert, 'The page behind is inert while the notebook is open');

  // Focus stays inside: Tab from the last control wraps to the first, and back.
  const focusables = [...book.querySelectorAll('button, [href], input, select, textarea, [tabindex]')].filter(
    n => n.tabIndex >= 0 && !n.disabled && !n.closest('[hidden]') && !(n.type === 'radio' && !n.checked),
  );
  focusables.at(-1).focus();
  key('Tab');
  assert.equal(d.activeElement, focusables[0], 'Tab wraps to the first control');
  key('Tab', {shiftKey: true});
  assert.equal(d.activeElement, focusables.at(-1), 'Shift+Tab wraps to the last control');

  key('Escape');
  assert.equal(open(), false, 'Escape closes');
  assert.equal($('title').inert, false);
  assert.equal(d.activeElement, $('title-settings'), 'Focus returns to the opener');

  $('title-credits').focus();
  click('#title-credits');
  assert.ok(view('credits'));
  assert.equal(selectedTab(), 'settings', 'Credits live inside Settings');
  const credits = $('nb-credits').textContent;
  for (const name of [
    'Liam McHara',
    'Albert Casals',
    'Guillem (Liam McHara)',
    'Tinta (Claude)',
    'ElevenLabs',
    t('credits.musicName'),
    t('title.credit'),
  ])
    assert.ok(credits.includes(name), 'Credits name ' + name);
  assert.equal($('nb-credits').querySelector('a[href^="https://liammchara.itch.io/himawari"]')?.target, '_blank');
  click('#nb-credits [data-back]');
  assert.ok(view('settings'));
  click('#nb-close');
  assert.equal(open(), false);
  assert.equal(d.activeElement, $('title-credits'));

  click('#title-settings');
  const backdrop = $('nb-backdrop');
  backdrop.click();
  assert.equal(open(), false, 'Clicking the dimmed scene closes');

  // Without a game, the diary and the album say so gently and spoil nothing.
  click('#title-settings');
  click('#nb-tab-diary');
  assert.ok(p.visible($('nb-diary-none')));
  click('#nb-tab-album');
  assert.ok(p.visible($('nb-album-empty')));
  assert.equal(d.querySelectorAll('.nb-polaroid').length, 0);
  click('#nb-tab-board');
  assert.ok(p.visible($('nb-board-none')));
  click('#nb-tab-settings');
  assert.equal($('nb-export').disabled, true, 'Nothing to export before a game');
  assert.equal($('nb-to-title').hidden, true, 'Return to the title only in a game');

  // Settings: real controls, each change stored and applied.
  click('#nb-large-text');
  assert.ok(d.documentElement.classList.contains('large-text'));
  const stored = () => JSON.parse(p.w.localStorage.getItem(settingsKey));
  assert.equal(stored().largeText, true);
  const rate = d.querySelector('input[name="nb-voice-rate"][value="1.3"]');
  rate.checked = true;
  rate.dispatchEvent(new p.w.Event('change', {bubbles: true}));
  assert.equal(stored().voiceRate, 1.3);
  const fast = d.querySelector('input[name="nb-text-speed"][value="fast"]');
  fast.checked = true;
  fast.dispatchEvent(new p.w.Event('change', {bubbles: true}));
  assert.equal(stored().textSpeed, 'fast');
  const volume = $('nb-voice-volume');
  volume.value = '0.4';
  volume.dispatchEvent(new p.w.Event('input', {bubbles: true}));
  assert.equal(stored().voiceVolume, 0.4);
  assert.equal(p.audios[0].volume, 0.4, 'The narrator follows the voice volume');
  click('#nb-music');
  assert.equal(stored().musicEnabled, false);
  click('#nb-auto-continue');
  assert.equal(stored().autoContinue, true);
  assert.equal($('auto-button').getAttribute('aria-pressed'), 'true', 'The ink bar shows auto-continue');
  click('#nb-narrate-read');
  assert.equal(stored().narrateRead, true);
  click('#nb-narration');
  assert.equal(stored().narrationEnabled, false);
  assert.match($('nb-narration-label').textContent, new RegExp(L.narrator));
  click('#nb-language');
  assert.equal(p.w.localStorage.getItem('himawari-language'), t('other.code'));
  assert.equal($('nb-language').getAttribute('href'), '../' + t('other.route') + '/index.html');
  key('Escape');
  // The settings survive a reload and show as stored.
  const again = boot(p.storage());
  again.click('#title-settings');
  assert.equal(again.$('nb-large-text').checked, true);
  assert.equal(again.d.querySelector('input[name="nb-text-speed"]:checked').value, 'fast');
  assert.equal(again.d.querySelector('input[name="nb-voice-rate"]:checked').value, '1.3');
  assert.equal(Number(again.$('nb-voice-volume').value), 0.4);
  assert.equal(again.$('nb-music').checked, false);
  assert.deepEqual([...p.errors, ...again.errors], []);
  results.titleSettingsCreditsFocusEscape = true;
  results.settingsPersist = true;
}

// --- In a game: diary and clue, keyboard, board, pages, pocket, restart ------------------

let boardStorage;
{
  const p = boot(quiet);
  const {$, d, click, key, submit, saved, snapshot, open, view, selectedTab} = p;
  click('#title-begin');
  assert.equal($('game').hidden, false);
  const start = snapshot();
  $('ink-scroll').focus();
  key('n', {}, $('ink-scroll'));
  assert.ok(open(), 'N opens the notebook');
  assert.ok(view('diary'), 'The diary is the default page');
  assert.equal(saved().guide.clue, null, 'Opening the diary does not use the clue');
  assert.equal($('nb-clue-button').disabled, false);
  assert.equal($('nb-clue-text').textContent, t('nb.diary.clueReady'));
  click('#nb-clue-button');
  const clue = $('nb-clue-text').textContent;
  assert.equal(saved().guide.clue.day, 1);
  assert.equal(clue, L.clues[saved().guide.clue.id]);
  assert.equal($('nb-clue-button').disabled, true, 'One clue per day');
  assert.deepEqual(snapshot(), start, 'A clue never changes the story');
  key('n', {}, $('nb-clue-button'));
  assert.equal(open(), false, 'N closes the notebook again');
  assert.equal(d.activeElement, $('ink-scroll'), 'Focus returns to the story');
  key('n', {}, $('ink-scroll'));
  assert.equal($('nb-clue-text').textContent, clue, 'The clue can be reread');
  assert.equal($('nb-clue-button').disabled, true);
  // Keys typed in the notebook never reach the story.
  key(' ', {}, $('nb-tab-diary'));
  key('2', {}, $('nb-tab-diary'));
  assert.deepEqual(snapshot(), start);
  // Arrow keys move between tabs.
  $('nb-tab-diary').focus();
  key('ArrowDown');
  assert.equal(selectedTab(), 'board');
  assert.equal(d.activeElement, $('nb-tab-board'));
  key('ArrowUp');
  assert.equal(selectedTab(), 'diary');

  // Pocket: empty at first.
  click('#nb-tab-pocket');
  assert.ok(p.visible($('nb-pocket-empty')));
  assert.equal($('nb-pocket-items').children.length, 0);

  // Pages: newest first, headed with loop, time and place.
  click('#nb-tab-pages');
  const entries = d.querySelectorAll('#nb-pages-list .nb-entry');
  assert.ok(entries.length >= 1);
  assert.equal(
    entries[0].querySelector('.nb-entry-meta').textContent,
    t('nb.pages.heading', {loop: 1, phase: L.phases[start.state.phase], place: L.destinations[1].name}),
  );
  assert.equal(
    entries[0].querySelector('.nb-prose').textContent.replace(/\s+/g, ''),
    start.screen.text.replace(/\s+/g, ''),
  );
  assert.equal(d.querySelectorAll('#nb-pages-loops .nb-loop').length, 1);

  // Board: pin recorded material, write theories, tie a thread.
  click('#nb-tab-board');
  assert.ok(p.visible($('nb-board-empty')));
  click('#nb-tool-pin');
  assert.equal($('nb-tool-pin').getAttribute('aria-expanded'), 'true');
  const quote = [...d.querySelectorAll('#nb-board-sources input')].find(input => input.value.startsWith('passage:'));
  assert.ok(quote, 'Recorded passages can be pinned');
  quote.checked = true;
  quote.dispatchEvent(new p.w.Event('change', {bubbles: true}));
  assert.ok($('nb-board-preview').textContent.length > 20);
  click('#nb-board-pin');
  assert.equal(d.querySelectorAll('.nb-card').length, 1);
  click('#nb-board-pin');
  assert.equal(d.querySelectorAll('.nb-card').length, 1, 'The same record is pinned once');
  assert.equal($('nb-board-status').textContent, t('nb.board.already'));
  // Search and category narrow the list.
  $('nb-board-search').value = 'zzzz-nothing';
  $('nb-board-search').dispatchEvent(new p.w.Event('input', {bubbles: true}));
  assert.equal(d.querySelectorAll('#nb-board-sources input').length, 0);
  assert.equal($('nb-board-pin').disabled, true);
  $('nb-board-search').value = '';
  $('nb-board-category').value = 'Quotation';
  $('nb-board-category').dispatchEvent(new p.w.Event('change', {bubbles: true}));
  assert.ok([...d.querySelectorAll('#nb-board-sources input')].every(input => input.value.startsWith('passage:')));

  click('#nb-tool-theory');
  assert.equal($('nb-panel-pin').hidden, true, 'One tool at a time');
  $('nb-theory-text').value = 'The clock <img src=x onerror=alert(1)>';
  submit('nb-theory-form');
  $('nb-theory-text').value = 'A second possibility';
  submit('nb-theory-form');
  assert.equal(d.querySelectorAll('.nb-card').length, 3);
  assert.equal(d.querySelectorAll('.nb-card img').length, 0, 'Theories are text, never markup');
  const ids = saved().journal.cards.map(c => c.id);
  click('#nb-tool-thread');
  $('nb-thread-from').value = ids[1];
  $('nb-thread-to').value = ids[2];
  $('nb-thread-label').value = 'Could these be connected?';
  submit('nb-thread-form');
  assert.equal(saved().journal.links.length, 1);
  assert.equal($('nb-board-strings').querySelectorAll('.nb-thread').length, 1);
  assert.equal($('nb-board-labels').textContent, 'Could these be connected?');
  assert.match($('nb-board-links').textContent, /Could these be connected\?/);
  $('nb-thread-from').value = ids[1];
  $('nb-thread-to').value = ids[1];
  submit('nb-thread-form');
  assert.equal($('nb-board-status').textContent, t('nb.board.tieFailed'));

  // Move a card with the keyboard, then drag it with a finger.
  const handle = () => d.querySelector(`[data-card="${ids[1]}"] .nb-card-handle`);
  const card = () => saved().journal.cards.find(c => c.id === ids[1]);
  const x = card().x,
    y = card().y;
  handle().focus();
  key('ArrowRight');
  assert.equal(card().x, x + 2);
  key('ArrowDown', {shiftKey: true});
  assert.equal(card().y, y + 6);
  $('nb-board-canvas').getBoundingClientRect = () => ({
    width: 1000,
    height: 600,
    left: 0,
    top: 0,
    right: 1000,
    bottom: 600,
  });
  handle().setPointerCapture = () => {};
  const pointer = (name, values) => {
    const event = new p.w.Event(name, {bubbles: true, cancelable: true});
    Object.assign(event, {button: 0, pointerId: 7, pointerType: 'touch', ...values});
    handle().dispatchEvent(event);
  };
  pointer('pointerdown', {clientX: 200, clientY: 100});
  pointer('pointermove', {clientX: 250, clientY: 130});
  pointer('pointerup', {clientX: 250, clientY: 130});
  assert.equal(card().x, x + 7);
  assert.equal(card().y, y + 11);
  assert.equal(d.querySelector(`[data-card="${ids[1]}"]`).style.left, card().x + '%');

  // Edit a theory and cross it out.
  click(d.querySelector(`[data-card="${ids[1]}"] .nb-card-action`));
  assert.ok(p.visible($('nb-card-sheet')));
  assert.equal(d.activeElement, $('nb-card-theory'));
  $('nb-card-theory').value = 'An idea I have crossed out';
  $('nb-card-crossed').checked = true;
  submit('nb-card-form');
  assert.equal($('nb-card-sheet').hidden, true);
  assert.ok(d.querySelector(`[data-card="${ids[1]}"]`).classList.contains('crossed'));
  assert.equal(card().text, 'An idea I have crossed out');
  assert.equal(d.activeElement, handle(), 'Focus returns to the card');
  // Escape closes the innermost thing first.
  click(d.querySelector(`[data-card="${ids[0]}"] .nb-card-action`));
  key('Escape');
  assert.equal($('nb-card-sheet').hidden, true);
  assert.ok(open());
  click('#nb-tool-pin');
  key('Escape');
  assert.equal($('nb-panel-pin').hidden, true);
  assert.ok(open());
  assert.deepEqual(snapshot(), start, 'The board never changes the story');
  key('Escape');
  assert.equal(open(), false);
  boardStorage = p.storage();

  // Unpinning removes the card and its threads.
  key('n', {}, $('ink-scroll'));
  click('#nb-tab-board');
  click(d.querySelector(`[data-card="${ids[2]}"] .nb-card-action:last-child`));
  assert.equal(saved().journal.cards.length, 2);
  assert.equal(saved().journal.links.length, 0);
  assert.equal($('nb-board-strings').children.length, 0);
  key('Escape');

  // Restart: confirm first, with a way back.
  key('n', {}, $('ink-scroll'));
  click('#nb-tab-settings');
  // Return to the title appears when the game passes api.toTitle.
  if (!$('nb-to-title').hidden) {
    click('#nb-to-title');
    assert.equal(open(), false);
    assert.equal($('title').hidden, false);
    click('#title-continue');
    key('n', {}, $('ink-scroll'));
    click('#nb-tab-settings');
    results.returnToTitle = true;
  }
  click('#nb-new-game');
  assert.ok(view('restart'));
  assert.equal(selectedTab(), 'settings');
  assert.equal(d.activeElement, $('nb-restart-keep'), 'The safe choice has focus');
  const before = saved();
  click('#nb-restart-keep');
  assert.equal(open(), false);
  assert.deepEqual(saved().engine, before.engine, 'Keep playing keeps the game');
  key('n', {}, $('ink-scroll'));
  click('#nb-tab-settings');
  click('#nb-new-game');
  click('#nb-restart-confirm');
  assert.equal(open(), false);
  assert.equal(saved().journal.cards.length, 0, 'A new game starts a new notebook');
  assert.equal(snapshot().state.loop, 1);
  assert.deepEqual(p.errors, []);
  results.diaryDoesNotUseClue = true;
  results.oneCluePerDay = true;
  results.keyboard = true;
  results.boardPinTheoryThread = true;
  results.boardKeyboardAndTouch = true;
  results.theoryEditAndCrossOut = true;
  results.pages = true;
  results.restartConfirmation = true;
}

// --- Board persistence through a reload, and editing from the title ----------------------

{
  const p = boot(boardStorage);
  const {$, d, click, key, saved, open} = p;
  assert.equal($('title-notebook').hidden, false);
  const engineSave = saved().engine;
  click('#title-notebook');
  assert.ok(open());
  click('#nb-tab-board');
  assert.ok(p.visible(d.querySelector('#nb-board .nb-from-save')));
  assert.equal(d.querySelectorAll('.nb-card').length, 3);
  assert.equal(d.querySelectorAll('.nb-card.crossed').length, 1);
  assert.equal($('nb-board-strings').querySelectorAll('.nb-thread').length, 1);
  click('#nb-tool-theory');
  $('nb-theory-text').value = 'A note made from the title';
  p.submit('nb-theory-form');
  assert.equal(saved().journal.cards.length, 4);
  assert.deepEqual(saved().engine, engineSave, 'Editing from the title never replaces the game');
  // The diary from the title is the saved game's, read only.
  click('#nb-tab-diary');
  assert.ok(p.visible(d.querySelector('#nb-diary .nb-from-save')));
  assert.equal($('nb-clue-button').hidden, true);
  assert.equal($('nb-clue-text').textContent, L.clues[saved().guide.clue.id], 'The saved clue can be reread');
  key('Escape');
  click('#title-continue');
  key('n', {}, $('ink-scroll'));
  click('#nb-tab-board');
  assert.equal(d.querySelectorAll('.nb-card').length, 4);
  assert.deepEqual(p.errors, []);
  results.boardPersistsThroughReload = true;
  results.titleEditingPreservesSave = true;
}

// --- The board's limits: 32 cards and 48 threads -------------------------------------------

{
  const p = boot(quiet);
  const {$, d, click, key, submit, saved} = p;
  click('#title-begin');
  key('n', {}, $('ink-scroll'));
  click('#nb-tab-board');
  click('#nb-tool-theory');
  for (let i = 0; i < 33; i++) {
    $('nb-theory-text').value = 'Idea ' + i;
    submit('nb-theory-form');
  }
  assert.equal(d.querySelectorAll('.nb-card').length, 32);
  assert.equal($('nb-board-status').textContent, t('nb.board.full'));
  assert.equal($('nb-theory-text').value, 'Idea 32', 'A theory that does not fit is kept in the box');
  click('#nb-tool-thread');
  const ids = saved().journal.cards.map(c => c.id);
  const pairs = ids
    .slice(1)
    .map(id => [ids[0], id])
    .concat(ids.slice(2).map(id => [ids[1], id]));
  for (const [from, to] of pairs.slice(0, 49)) {
    $('nb-thread-from').value = from;
    $('nb-thread-to').value = to;
    submit('nb-thread-form');
  }
  assert.equal(saved().journal.links.length, 48);
  assert.equal($('nb-board-status').textContent, t('nb.board.tieFailed'));
  assert.equal($('nb-board-count').textContent, t('nb.board.count', {cards: 32, links: 48}));
  assert.deepEqual(p.errors, []);
  results.boardLimits = '32 cards, 48 threads';
}

// --- Endings: the album shows only what was lived through, with its own narrator ----------

{
  const p = boot(quiet);
  const {$, d, click, key, saved, snapshot, open, audios} = p;
  click('#title-begin');
  const death = createEngine({seed: 12});
  death.debug.core.GameController_TimeTravel(death.debug.GC, 0);
  key('Escape', {}, $('ink-scroll'));
  assert.ok(open(), 'Escape in the game opens the settings');
  await p.importSave({edition: 1, engine: death.exportSave(), history: []});
  assert.equal(open(), false, 'Importing a save returns to the game');
  let final = false;
  for (let n = 0; n < 8 && !final; n++) {
    final = snapshot().screen.parts.some(part => part.id === 2469);
    key('n', {}, $('ink-scroll'));
    click('#nb-tab-album');
    if (!final) {
      assert.ok(p.visible($('nb-album-empty')), 'No page before the ending is complete');
      assert.equal(d.querySelectorAll('.nb-polaroid').length, 0);
    }
    key('Escape');
    if (!final) p.act(['next']);
  }
  assert.ok(final, 'The ending was reached');
  const voice = audios[0];
  assert.equal(voice.paused, false, 'Harry is narrating the ending');
  voice.currentTime += 0.3;
  const position = voice.currentTime;
  key('n', {}, $('ink-scroll'));
  assert.ok(voice.paused, 'The main narration pauses while the notebook is open');
  click('#nb-tab-album');
  assert.equal($('nb-album-empty').hidden, true);
  assert.equal($('nb-album-strip').hidden, true, 'One ending, no strip of photos');
  assert.match($('nb-album-art').src, /Ending_1b\.webp/);
  const page = createJournal(saved().journal).album()[0];
  assert.equal($('nb-album-name').textContent, L.endings[1]);
  assert.equal($('nb-album-text').textContent.replace(/\s+/g, ''), journalText(page.parts).replace(/\s+/g, ''));
  const count = audios.length;
  click('#nb-album-play');
  const albumVoice = audios[count];
  assert.ok(albumVoice && !albumVoice.paused, 'The album has its own player');
  assert.equal(albumVoice.plays[0].start, L.narration['2466'].start);
  assert.ok(voice.paused, 'The main narration stays paused');
  assert.equal($('nb-album-play').getAttribute('aria-label'), t('voice.pause'));
  p.w.dispatchEvent(new p.w.Event('pagehide'));
  assert.ok(albumVoice.paused);
  p.w.dispatchEvent(new p.w.Event('pageshow'));
  assert.equal(albumVoice.paused, false);
  click('#nb-album-play');
  assert.ok(albumVoice.paused, 'Play/pause');
  click('#nb-album-play');
  assert.equal(albumVoice.paused, false);
  click('#nb-tab-diary');
  assert.ok(albumVoice.paused, 'Leaving the album stops its narration');
  click('#nb-tab-album');
  click('#nb-album-play');
  key('Escape');
  assert.ok(albumVoice.paused, 'Closing the notebook stops the album');
  assert.equal(voice.paused, false, 'The main narration resumes');
  assert.equal(voice.currentTime, position, 'at the same place');
  // A deliberate pause of the main narration is respected.
  click('#voice-toggle');
  assert.ok(voice.paused);
  key('n', {}, $('ink-scroll'));
  click('#nb-tab-album');
  click('#nb-album-play');
  key('Escape');
  assert.ok(voice.paused, 'The album respects a paused narrator');
  assert.deepEqual(p.errors, []);
  results.albumSpoilerGate = true;
  results.albumSeparateNarrator = true;
  results.albumStopsOnClose = true;
}

// --- The whole legal route through the interface ----------------------------------------------

{
  const p = boot(quiet);
  const {$, d, click, key, saved, snapshot, open} = p;
  click('#title-begin');
  let found = false;
  for (const action of route.actions) {
    p.act(action);
    if (!found && saved().guide.facts.length) {
      found = true;
      assert.ok(saved().journal.unread.length > 0);
      const unchanged = snapshot();
      key('n', {}, $('ink-scroll'));
      assert.ok(p.view('diary'));
      assert.equal(saved().journal.unread.length, 0, 'Reading the diary clears new findings');
      assert.equal(saved().guide.clue, null, 'and does not use the clue');
      assert.ok(d.querySelector('#nb-findings .nb-finding.is-new'), 'New findings are marked');
      assert.deepEqual(snapshot(), unchanged);
      key('Escape');
      key('n', {}, $('ink-scroll'));
      assert.equal(d.querySelector('#nb-findings .nb-finding.is-new'), null, 'Only once');
      key('Escape');
    }
    if (snapshot().inventory.length >= 3 && !d.querySelector('#nb-pocket-items .nb-tag')) {
      key('n', {}, $('ink-scroll'));
      click('#nb-tab-pocket');
      const names = [...d.querySelectorAll('#nb-pocket-items .nb-tag-name')].map(n => n.textContent);
      assert.deepEqual(
        names,
        snapshot().inventory.map(item => L.items[item]),
      );
      assert.equal($('nb-pocket-empty').hidden, true);
      key('Escape');
    }
  }
  assert.ok(found);
  assert.equal(snapshot().screen.finished, true);
  key('n', {}, $('ink-scroll'));
  click('#nb-tab-album');
  assert.equal(d.querySelectorAll('.nb-polaroid').length, 4, 'Four endings lived through');
  assert.deepEqual(
    [...d.querySelectorAll('.nb-polaroid-caption')].map(n => n.textContent),
    [1, 2, 3, 5].map(n => L.endings[n]),
  );
  click(d.querySelectorAll('.nb-polaroid')[1]);
  assert.match($('nb-album-art').src, /Ending_2b\.webp/);
  click('#nb-tab-diary');
  assert.equal(d.querySelectorAll('#nb-findings .nb-finding').length, saved().guide.facts.length);
  assert.equal($('nb-clue-text').textContent, t('nb.diary.clueOver'));
  key('Escape');
  assert.equal(open(), false);
  // The title's photographs open their ending in the album.
  click('#ink-responses button');
  assert.equal($('title').hidden, false);
  click(d.querySelectorAll('#title-photos .polaroid')[2]);
  assert.ok(p.view('album'));
  assert.equal($('nb-album-name').textContent, L.endings[3]);
  assert.deepEqual(p.errors, []);
  results.legalWinningRoute = route.actions.length;
  results.firstDiscoveryOnly = true;
  results.pocketShowsInventory = true;
  results.albumAllEndings = true;
}

console.log(JSON.stringify({notebook: code, ...results}, null, 2));
for (const dom of pages) dom.window.close();
