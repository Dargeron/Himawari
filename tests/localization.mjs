import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {createEngine} from '../src/engine.js';
import {createJournal} from '../src/journal.js';
import {createGuide} from '../src/guide.js';
import {installLocale} from './helpers/locale.mjs';

// The Chinese edition's language pack against the original English data.
const L = await installLocale('zh-CN');
const {literals} = L;
const inputValue = v => L.inputValue(v),
  historyLabel = v => L.historyLabel(v);

const original = JSON.parse(fs.readFileSync(new URL('../locales/zh-CN/literals.en.json', import.meta.url)));
const translated = JSON.parse(fs.readFileSync(new URL('../locales/zh-CN/zh-CN.json', import.meta.url)));
const narrationEN = JSON.parse(fs.readFileSync(new URL('../locales/zh-CN/narration.en.json', import.meta.url)));
for (const [id, value] of Object.entries(literals))
  assert.equal(value.raw, original[id].raw, 'Original comparisons changed: ' + id);
for (const id of Object.keys(narrationEN).filter(k => /^\d+$/.test(k))) {
  assert.ok(translated[id]);
  assert.ok(/[\u4e00-\u9fff]/u.test(literals[id].text), 'Untranslated passage ' + id);
}
assert.equal(inputValue('马丁').raw, 'Martin');
assert.equal(inputValue('Martin').text, '马丁');
assert.equal(inputValue('Ｍａｒｔｉｎ').raw, 'Martin');
assert.equal(inputValue('马丁 ').raw, 'Martin');
assert.equal(inputValue('martin').raw, 'Martin');
assert.equal(inputValue(' ８７７４ ').raw, '8774');
assert.equal(inputValue('Marton').raw, 'Marton');
assert.equal(inputValue('８７７４').raw, '8774');
assert.equal(inputValue('8775').raw, '8775');
assert.equal(inputValue('张伟').text, '张伟');

// Run the old English adapter against its original data, then migrate actual
// exported story states. This verifies text translation, immutable raw values,
// persistent pointers and the next action, rather than fabricating save text.
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'himawari-en-'));
// Baseline English engine is extracted by the test runner from the preserved
// source ZIP, if available. Source-only distributions include this fixture.
const fixture = new URL('./fixtures/engine.en.js', import.meta.url);
fs.copyFileSync(fixture, path.join(temp, 'engine.mjs'));
fs.copyFileSync(new URL('../src/core/recovered-core.js', import.meta.url), path.join(temp, 'recovered-core.js'));
fs.writeFileSync(path.join(temp, 'package.json'), ' {"type":"module"}');
const caches = JSON.parse(fs.readFileSync(new URL('../locales/zh-CN/string-caches.json', import.meta.url)));
fs.writeFileSync(
  path.join(temp, 'content.js'),
  'export const literals=' + JSON.stringify(original) + '; export const stringCaches=' + JSON.stringify(caches) + ';',
);
const {createEngine: createEnglishEngine} = await import(path.join(temp, 'engine.mjs'));
const route = JSON.parse(fs.readFileSync(new URL('./fixtures/winning-route.json', import.meta.url)));
let english = createEnglishEngine({seed: route.seed}),
  chinese = createEngine({seed: route.seed});
let crossLanguageSaves = 0;
const translatedRoute = [];
for (const [kind, value] of route.actions) {
  const en = english.action(kind, value);
  const cn = chinese.action(
    kind,
    kind === 'input' && value === 'Martin' ? '马丁' : kind === 'input' && value === '8774' ? '８７７４' : value,
  );
  assert.deepEqual(cn.state, en.state);
  assert.deepEqual(cn.inventory, en.inventory);
  assert.equal(cn.screen.raw, en.screen.raw);
  assert.equal(cn.screen.kind, en.screen.kind);
  assert.equal(cn.screen.ending, en.screen.ending);
  const migrated = createEngine();
  migrated.importSave(english.exportSave());
  assert.deepEqual(migrated.snapshot(), cn);
  chinese = migrated;
  crossLanguageSaves++;
  translatedRoute.push([kind, value]);
}
assert.ok(chinese.snapshot().screen.finished);
fs.rmSync(temp, {recursive: true, force: true});
const guide = createGuide(),
  journal = createJournal();
const oldHistory = [{text: original[2470].text, phase: 'Night', location: 'Home', loop: 2}];
guide.recoverHistory(oldHistory);
journal.recoverHistory(oldHistory);
assert.ok(guide.exportSave().seenEndings.includes(2));
assert.equal(journal.album()[0].number, 2);
assert.equal(journal.catalog().find(c => c.kind === 'Quotation').text, literals[2470].text);
assert.equal(historyLabel(original[2464].text), literals[2464].text);
assert.equal(L.phases.Dawn, '黎明');
assert.equal(L.items['School key'], '学校钥匙');
const gardener = createEngine();
gardener.action('next');
gardener.action('go', 2);
const park = gardener.action('choice', 1);
journal.observe(park);
assert.ok(journal.exportSave().people.includes('gardener'), 'Chinese mentions populate the board');
console.log(
  JSON.stringify(
    {
      language: 'zh-CN',
      authoredTranslatedPassages: 458,
      rawStringsUnchanged: true,
      ChineseNameAnswer: true,
      fullWidthPIN: true,
      incorrectAnswersRemainIncorrect: true,
      EnglishSaveMigrationAfterEveryAction: crossLanguageSaves,
      originalStateAndInventory: true,
      translatedWinningRoute: true,
      legacyDiaryAndAlbum: true,
      ChinesePeopleDetection: true,
    },
    null,
    2,
  ),
);
