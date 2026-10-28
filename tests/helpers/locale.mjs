import fs from 'node:fs';
import {useLocale} from '../../src/i18n.js';

// Mirrors tools/build.py: a language pack is the locale module plus its story
// data. Tests choose a language with `node tests/<name>.mjs zh-CN`.
const root = new URL('../../', import.meta.url);
const read = path => JSON.parse(fs.readFileSync(new URL(path, root)));
export const languages = ['en', 'zh-CN'];

export function testLocale() {
  const code = process.argv[2] || process.env.HIMAWARI_LOCALE || 'en';
  if (!languages.includes(code)) throw new Error('Unknown language ' + code);
  return code;
}

export function uiStrings(code) {
  const dir = new URL(`locales/${code}/`, root);
  return Object.assign({}, ...fs.readdirSync(dir).filter(f => /^ui.*\.json$/.test(f)).sort().map(f => read(`locales/${code}/${f}`)));
}

export function localeData(code) {
  const data = {
    literals: read(`locales/${code}/literals.json`),
    stringCaches: read(`locales/${code}/string-caches.json`),
    narration: read(`locales/${code}/narration.json`),
    scenes: read('content/scene-illustrations.json'),
    light: read('content/scene-light.json'),
    ambience: read('content/ambience.json'),
    strings: uiStrings(code),
  };
  if (code === 'zh-CN') {
    data.pronunciations = read('locales/zh-CN/name-pronunciations.json');
    const english = read('locales/en/literals.json');
    data.englishHistory = Object.fromEntries(
      Object.entries(english)
        .filter(([id]) => (id >= 1838 && id <= 2355) || (id >= 2461 && id <= 2479))
        .map(([id, value]) => [id, value.text]),
    );
  }
  return data;
}

export async function installLocale(code = testLocale()) {
  const pack = (await import(`../../src/locales/${code}.js`)).default;
  return useLocale({...pack, ...localeData(code)});
}
