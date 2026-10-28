import {L} from './i18n.js';

// Read-only helpers that describe an engine snapshot for the interface.

const NIGHT = /^(endIntro[12]|noLove2?|noGun|noPoison2?|noEvil[23]?|victory[234]?)$/;

export function isNight(s) {
  return s.screen.kind === 'intro' && !s.screen.finished && NIGHT.test(s.state.introNode);
}

// The night belongs to the day that is ending: show that day's loop number.
export function displayLoop(s) {
  return isNight(s) ? s.state.loop - 1 : s.state.loop;
}

export function phaseKey(s) {
  return isNight(s) ? 'Night' : s.state.phase;
}

export function phaseName(s) {
  return L.phases[phaseKey(s)];
}

export function flowerFor(s) {
  return 'assets/art/original/hima' + (isNight(s) ? 5 : Math.max(1, Math.min(5, s.state.t))) + '.webp';
}

export function visibleOptions(screen) {
  return screen.options.filter(o => o.raw.trim());
}

// A lone "> " or "< Continue >" option is a continuation, not a decision.
export function continuation(screen) {
  const options = visibleOptions(screen);
  return options.length === 1 && /^(?:>|<\s*Continue\s*>)$/i.test(options[0].raw.trim()) ? options[0] : null;
}

// The single action that moves the story on without a decision, if any.
export function advanceAction(s) {
  const {screen} = s;
  if (screen.kind === 'map' || screen.input || screen.finished) return null;
  if (screen.kind === 'intro') return ['next'];
  if (screen.needsContinue) return ['continue'];
  const option = continuation(screen);
  return option ? ['choice', option.choice] : null;
}

export function musicFor(s) {
  const {screen, state} = s;
  if (screen.finished || (state.introNode.startsWith('victory') && screen.kind === 'intro')) return 2;
  if (isNight(s) && !state.introNode.startsWith('endIntro')) return 1;
  return screen.music;
}

// The place's ambient sound (content/ambience.json): the town on the map,
// each place's own, and the quiet of the night; none for the opening and
// the endings.
export function ambienceFor(s) {
  const {screen, state} = s,
    sounds = L.ambience;
  if (!sounds || screen.finished) return '';
  if (screen.kind === 'map') return sounds.map ?? '';
  if (screen.kind === 'intro') return isNight(s) && !state.introNode.startsWith('victory') ? (sounds.night ?? '') : '';
  return sounds.places?.[state.place] ?? '';
}

export function paragraphs(text) {
  return String(text).trim().split(/\n+/).filter(Boolean);
}

export function passageKey(s) {
  return JSON.stringify([s.screen.kind, s.screen.text, s.state.loop, s.state.t, s.screen.options.map(o => o.text)]);
}
