import {L, t} from './i18n.js';
import {assetURL} from './assets.js';
import {paragraphs} from './screens.js';

const PAST_LIMIT = 24;

export function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// The story box. Text rolls forward inside it: each passage is written below
// the last, earlier lines drift up and fade behind the top edge, and the
// player can scroll back through them. Only the box scrolls, never the page.
export function createInkbox(root, {typewriter, settings}) {
  const scroll = root.querySelector('#ink-scroll'),
    log = root.querySelector('#ink-log'),
    responses = root.querySelector('#ink-responses');
  let follow = true,
    ignoreScrollUntil = 0,
    onWritten = null;

  const reduced = () => settings.reducedMotion;

  scroll.addEventListener(
    'scroll',
    () => {
      root.classList.toggle('scrolled', scroll.scrollTop > 2);
      if (performance.now() < ignoreScrollUntil) return;
      follow = scroll.scrollHeight - scroll.scrollTop - scroll.clientHeight < 14;
    },
    {passive: true},
  );

  function scrollTo(top, smooth = false) {
    const max = Math.max(0, scroll.scrollHeight - scroll.clientHeight);
    const target = Math.max(0, Math.min(max, top));
    if (Math.abs(target - scroll.scrollTop) < 1) return;
    ignoreScrollUntil = performance.now() + (smooth ? 700 : 80);
    scroll.scrollTo({top: target, behavior: smooth && !reduced() ? 'smooth' : 'instant'});
  }

  // Keep the newest written line in view while following the text.
  function keepVisible(node, margin = 18) {
    if (!follow || !node) return;
    const a = node.getBoundingClientRect(),
      b = scroll.getBoundingClientRect();
    if (a.bottom > b.bottom - margin) scrollTo(scroll.scrollTop + (a.bottom - b.bottom) + margin);
  }

  function toBottom(smooth = true) {
    if (follow) requestAnimationFrame(() => scrollTo(scroll.scrollHeight, smooth));
  }

  function clear() {
    typewriter.stop();
    log.replaceChildren();
    responses.replaceChildren();
    root.classList.remove('writing', 'scrolled');
    follow = true;
    scroll.scrollTop = 0;
  }

  function trim() {
    const old = log.querySelectorAll('.passage.past, .chosen');
    for (let i = 0; i < old.length - PAST_LIMIT; i++) old[i].remove();
  }

  // Write a new passage. `instant` shows it at once (already read, reduced
  // motion, or the text speed set to instant).
  function passage(text, {parts = [], instant = false, speed = 30, kind = 'story', read = false} = {}) {
    for (const node of log.querySelectorAll('.passage:not(.past)')) node.classList.add('past');
    trim();
    const article = el('article', 'passage is-' + kind);
    if (read) article.classList.add('read');
    for (const line of paragraphs(text)) article.append(el('p', '', line));
    log.append(article);
    responses.replaceChildren();
    responses.classList.add('waiting');
    root.classList.add('writing');
    follow = true;
    // Bring the start of the new passage into view; earlier text rolls up.
    requestAnimationFrame(() => {
      const top = article.offsetTop - (log.children.length > 1 ? 12 : 0);
      if (top < scroll.scrollTop || article.offsetTop > scroll.scrollTop + scroll.clientHeight * 0.55) scrollTo(top - scroll.clientHeight * 0.18);
    });
    typewriter.start([...article.children], {
      parts,
      instant: instant || reduced(),
      speed,
      onReveal: letter => keepVisible(letter),
      onDone: () => {
        root.classList.remove('writing');
        responses.classList.remove('waiting');
        toBottom();
        const done = onWritten;
        onWritten = null;
        done?.();
      },
    });
    return article;
  }

  // A short line that stays in the log, e.g. the choice the player made.
  function note(text, className = 'chosen') {
    log.append(el('p', className, text));
    toBottom(false);
  }

  function respond(...nodes) {
    responses.replaceChildren(...nodes.flat().filter(Boolean));
    if (!responses.classList.contains('waiting')) toBottom();
  }

  function whenWritten(fn) {
    if (!root.classList.contains('writing')) fn();
    else onWritten = fn;
  }

  return {
    clear,
    passage,
    note,
    respond,
    whenWritten,
    showAll: () => typewriter.showAll(),
    get writing() {
      return typewriter.revealing;
    },
    get log() {
      return log;
    },
    focus() {
      (responses.querySelector('button, input') || scroll).focus({preventScroll: true});
    },
  };
}

// --- Response controls -------------------------------------------------------

// The author's chalk Continue button. The drawing says "Continue" in English,
// so other languages letter their own word in the same chalk style.
export function continueButton(onClick, label = t('ink.continue')) {
  const button = el('button', 'ink-continue');
  button.type = 'button';
  button.setAttribute('aria-label', label);
  if (L.code === 'en' && label === t('ink.continue')) {
    const image = el('img');
    image.src = assetURL('assets/art/original/continueBtn.webp');
    image.alt = '';
    image.width = 414;
    image.height = 122;
    button.append(image);
  } else {
    button.classList.add('chalk');
    button.append(el('span', '', label), el('span', 'chalk-arrow', '⇨'));
  }
  button.addEventListener('click', onClick);
  return button;
}

export function choiceList(options, {onChoose, echo}) {
  const list = el('ol', 'ink-choices');
  for (const option of options) {
    const item = el('li', 'ink-choice');
    const button = el('button', 'choice');
    button.type = 'button';
    button.dataset.choice = option.choice;
    button.setAttribute('aria-label', t('ink.choiceLabel', {n: option.choice, text: option.text}));
    button.append(el('span', 'choice-n', String(option.choice)), el('span', 'choice-text', option.text));
    button.addEventListener('click', () => onChoose(option));
    item.append(button);
    const memory = echo?.(option);
    if (memory) item.append(memoryNote(memory));
    list.append(item);
  }
  return list;
}

// "Tried before": a quiet pencil mark that unfolds what happened last time.
function memoryNote(memory) {
  const wrap = el('div', 'choice-memory');
  const toggle = el('button', 'memory-toggle', t('ink.triedBefore', {loop: memory.loop}));
  toggle.type = 'button';
  toggle.setAttribute('aria-expanded', 'false');
  const detail = el('div', 'memory-detail');
  detail.hidden = true;
  if (memory.outcome) detail.append(el('p', '', memory.outcome));
  if (memory.items) detail.append(el('p', 'memory-items', memory.items));
  toggle.addEventListener('click', event => {
    event.stopPropagation();
    detail.hidden = !detail.hidden;
    toggle.setAttribute('aria-expanded', String(!detail.hidden));
  });
  wrap.append(toggle, detail);
  return wrap;
}

export function answerForm(onSubmit) {
  const form = el('form', 'ink-answer');
  const label = el('label', 'visually-hidden', t('ink.answer'));
  const input = el('input');
  input.id = 'answer';
  input.type = 'text';
  input.autocomplete = 'off';
  input.spellcheck = false;
  input.setAttribute('autocorrect', 'off');
  input.setAttribute('autocapitalize', 'off');
  input.maxLength = 120;
  input.enterKeyHint = 'done';
  input.placeholder = t('ink.answerPlaceholder');
  label.htmlFor = 'answer';
  const submit = el('button', 'answer-submit', '⇨');
  submit.type = 'submit';
  submit.setAttribute('aria-label', t('ink.confirm'));
  let composing = false;
  input.addEventListener('compositionstart', () => (composing = true));
  input.addEventListener('compositionend', () => (composing = false));
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (composing) return;
    onSubmit(input.value);
  });
  form.append(label, input, submit);
  return form;
}
