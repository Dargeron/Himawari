import {L} from './i18n.js';

// Reveals a passage letter by letter. With narration it follows the voice:
// letters keep pace with the recording, hold when it pauses and restart when it
// is replayed; at the fast text speed they run at twice the voice's pace and
// the voice reads on behind them. Without narration it writes at the chosen
// text speed. Letters
// are laid out from the start (only their opacity changes), so the text never
// reflows while it is being written.
export function createTypewriter({
  settings,
  requestFrame = globalThis.requestAnimationFrame,
  cancelFrame = globalThis.cancelAnimationFrame,
  now = () => globalThis.performance.now(),
  isHidden = () => globalThis.document?.hidden,
}) {
  let frame = 0,
    letters = [],
    shown = 0,
    elapsed = 0,
    stamp = 0,
    duration = 1,
    cps = 30,
    status = null,
    callbacks = {};

  function show(count) {
    const target = Math.min(letters.length, Math.max(shown, Math.floor(count)));
    for (let i = shown; i < target; i++) {
      letters[i].classList.add('on');
      letters[i].parentNode.classList.remove('unwritten');
    }
    if (target > shown) {
      shown = target;
      callbacks.onReveal?.(letters[shown - 1]);
    }
    if (shown === letters.length) finish();
  }

  function finish() {
    if (frame) cancelFrame(frame);
    frame = 0;
    const done = callbacks.onDone;
    callbacks.onDone = null;
    done?.();
  }

  function voiced() {
    return settings.narrationEnabled && status?.available && !status.blocked;
  }

  function tick(time) {
    frame = 0;
    if (shown >= letters.length) return;
    const delta = Math.min(100, Math.max(0, time - stamp));
    stamp = time;
    if (!isHidden()) {
      if (voiced() && settings.textSpeed === 'fast') {
        elapsed = Math.max(elapsed, status.progress * duration);
        elapsed = Math.min(duration, elapsed + (delta / 1000) * 2 * (settings.voiceRate || 1));
        show((elapsed / duration) * letters.length);
      } else if (voiced() && status.playing && !status.loading) {
        elapsed = Math.max(elapsed, status.progress * duration);
        elapsed = Math.min(duration, elapsed + (delta / 1000) * (settings.voiceRate || 1));
        show((elapsed / duration) * letters.length);
        if (status.completed) show(letters.length);
      } else if (!voiced()) {
        elapsed += delta / 1000;
        show(elapsed * cps);
      } else if (status.completed) show(letters.length);
    }
    if (shown < letters.length) frame = requestFrame(tick);
  }

  // Wrap every character of the given paragraphs in a letter span.
  function prepare(paragraphs) {
    const result = [];
    for (const [index, paragraph] of paragraphs.entries()) {
      if (index) paragraph.classList.add('unwritten');
      const fragment = paragraph.ownerDocument.createDocumentFragment();
      for (const char of Array.from(paragraph.textContent)) {
        const span = paragraph.ownerDocument.createElement('span');
        span.className = 'l';
        span.textContent = char;
        fragment.append(span);
        result.push(span);
      }
      paragraph.replaceChildren(fragment);
    }
    return result;
  }

  function start(paragraphs, {parts = [], instant = false, speed = 30, onReveal, onDone} = {}) {
    stop();
    callbacks = {onReveal, onDone};
    if (instant || !Number.isFinite(speed)) {
      finish();
      return;
    }
    letters = prepare(paragraphs);
    cps = speed;
    const clipTime = parts.reduce((sum, p) => {
      const clip = L.narration[p.id ?? 'number:' + p.text];
      return sum + (clip ? clip.end - clip.start : 0);
    }, 0);
    duration = clipTime || Math.max(1, letters.length / cps);
    elapsed = 0;
    stamp = now();
    if (!letters.length) finish();
    else frame = requestFrame(tick);
  }

  function showAll() {
    show(letters.length);
  }

  function stop() {
    if (frame) cancelFrame(frame);
    frame = 0;
    for (const letter of letters) {
      letter.classList.add('on');
      letter.parentNode.classList.remove('unwritten');
    }
    letters = [];
    shown = 0;
    callbacks = {};
  }

  // A replay moves the recording backwards: write the passage again with it.
  function audioStatus(value) {
    if (
      letters.length &&
      shown < letters.length &&
      status?.available &&
      value.available &&
      value.progress + 0.02 < status.progress
    ) {
      for (const letter of letters) letter.classList.remove('on');
      for (const paragraph of [...new Set(letters.map(l => l.parentNode))].slice(1))
        paragraph.classList.add('unwritten');
      shown = 0;
      elapsed = 0;
    }
    status = value;
  }

  globalThis.document?.addEventListener('visibilitychange', () => {
    stamp = now();
  });

  return {
    start,
    showAll,
    stop,
    status: audioStatus,
    get revealing() {
      return letters.length > 0 && shown < letters.length;
    },
  };
}
