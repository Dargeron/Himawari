import {L} from './i18n.js';

// Player preferences. Settings and progress are stored separately: a damaged
// preference entry must never hide a healthy autosave.
const reduceMotion = () => globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false;

// Letters per second without narration. With narration, slow and normal
// follow the voice and fast writes twice as fast as it speaks.
export const textSpeeds = {slow: 18, normal: 30, fast: 60, instant: Infinity};

export function defaultSettings() {
  return {
    narrationEnabled: true,
    voiceVolume: 0.95,
    voiceRate: 1,
    musicEnabled: true,
    musicVolume: 0.15,
    largeText: false,
    reducedMotion: reduceMotion(),
    textSpeed: 'normal',
    narrateRead: false,
    autoContinue: false,
  };
}

const ranges = {voiceVolume: [0, 1], musicVolume: [0, 0.5], voiceRate: [0.75, 1.5]};

export function loadSettings() {
  const settings = defaultSettings();
  try {
    Object.assign(settings, JSON.parse(localStorage.getItem(L.settingsKey) || '{}'));
  } catch {}
  const defaults = defaultSettings();
  for (const [key, [min, max]] of Object.entries(ranges)) {
    if (!Number.isFinite(settings[key])) settings[key] = defaults[key];
    settings[key] = Math.max(min, Math.min(max, settings[key]));
  }
  if (!Object.hasOwn(textSpeeds, settings.textSpeed)) settings.textSpeed = defaults.textSpeed;
  for (const key of ['narrationEnabled', 'musicEnabled', 'largeText', 'reducedMotion', 'narrateRead', 'autoContinue'])
    settings[key] = !!settings[key];
  return settings;
}

export function storeSettings(settings) {
  try {
    localStorage.setItem(L.settingsKey, JSON.stringify(settings));
  } catch {}
}

export function applySettings(settings) {
  const root = document.documentElement;
  root.classList.toggle('large-text', settings.largeText);
  root.classList.toggle('reduced-motion', settings.reducedMotion);
}
