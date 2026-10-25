import {L, t} from '../i18n.js';
import {el} from '../inkbox.js';
import {paragraphs} from '../screens.js';

const SVG = 'http://www.w3.org/2000/svg';
const CARD_WIDTH = 22; // percent of the board; matches .nb-card in 61-board.css
const PIN_DROP = 1.6; // the pin sits just below the card's top edge
const SHOWN = 80;
const kinds = ['Diary entry', 'Quotation', 'Person mentioned', 'Place visited', 'Object recorded'];

// A stable small tilt for each card, so the board looks pinned by hand.
const tiltOf = id => ((Number(String(id).replace(/\D/g, '')) * 37) % 9) * 0.55 - 2.2;
const short = (text, n) => {
  const chars = Array.from(String(text).replace(/\s+/g, ' ').trim());
  return chars.length > n ? chars.slice(0, n - 1).join('') + '…' : chars.join('');
};

// The conspiracy board: recorded material and the player's own theories on
// paper scraps, pinned to a sheet and tied together with red thread. All edits
// go to the journal and are saved at once; none of them touch the game.
export function createBoard(ctx) {
  const {$, api} = ctx;
  const view = $('nb-board'),
    canvas = $('nb-board-canvas'),
    sheet = $('nb-card-sheet');
  const tools = {pin: $('nb-tool-pin'), theory: $('nb-tool-theory'), thread: $('nb-tool-thread')};
  const panels = {pin: $('nb-panel-pin'), theory: $('nb-panel-theory'), thread: $('nb-panel-thread')};
  let tool = null,
    sheetCard = null,
    selectedSource = '';

  const g = () => ctx.game();
  const j = () => g().journal;
  const facts = () => g().facts;
  const commit = () => api.saveNotebook();
  const state = () => j().board(facts());
  const say = text => ($('nb-board-status').textContent = text);

  const category = $('nb-board-category');
  for (const kind of kinds) {
    const option = el('option', '', L.kinds?.[kind] || kind);
    option.value = kind;
    category.append(option);
  }

  function cardTitle(c) {
    if (c.kind === 'theory') return short(c.text, 48);
    return c.record.kind === 'Quotation' ? c.record.title + ': ' + short(c.record.text, 36) : c.record.title;
  }

  // --- Tools -------------------------------------------------------------------

  function setTool(name, {focus = true} = {}) {
    tool = tool === name ? null : name;
    for (const [key, button] of Object.entries(tools)) {
      button.setAttribute('aria-expanded', String(tool === key));
      panels[key].hidden = tool !== key;
    }
    if (tool === 'pin') sources();
    if (tool === 'thread') threadChoices();
    if (focus && tool) panels[tool].querySelector('input, textarea, select')?.focus({preventScroll: true});
  }
  for (const [name, button] of Object.entries(tools)) button.addEventListener('click', () => setTool(name));

  // Recorded material is a list of radio choices: searchable, keyboard
  // friendly, and showing enough of each record to recognise it.
  function sources() {
    const query = $('nb-board-search').value.trim().toLowerCase(),
      kind = category.value;
    const records = j()
      .catalog(facts())
      .filter(r => (!kind || r.kind === kind) && (!query || (r.title + ' ' + r.text).toLowerCase().includes(query)));
    const box = $('nb-board-sources');
    box.replaceChildren();
    if (!records.some(r => r.id === selectedSource)) selectedSource = records[0]?.id || '';
    for (const record of records.slice(0, SHOWN)) {
      const label = el('label', 'nb-source');
      const input = el('input');
      input.type = 'radio';
      input.name = 'nb-source';
      input.value = record.id;
      input.checked = record.id === selectedSource;
      input.addEventListener('change', () => {
        selectedSource = record.id;
        preview();
      });
      const words = el('span', 'nb-source-words');
      words.append(
        el('span', 'nb-source-kind', L.kinds?.[record.kind] || record.kind),
        el('span', 'nb-source-title', record.title),
        el('span', 'nb-source-text', short(record.text, 140)),
      );
      label.append(input, words);
      box.append(label);
    }
    if (!records.length) box.append(el('p', 'nb-empty small', t('nb.board.noMatch')));
    const more = $('nb-board-more');
    more.hidden = records.length <= SHOWN;
    more.textContent = t('nb.board.more', {shown: SHOWN, total: records.length});
    preview();
  }
  function preview() {
    const record = j()
      .catalog(facts())
      .find(r => r.id === selectedSource);
    const box = $('nb-board-preview');
    box.replaceChildren(...(record ? paragraphs(record.text).map(line => el('p', '', line)) : []));
    box.hidden = !record;
    $('nb-board-pin').disabled = !record;
  }
  category.addEventListener('change', sources);
  $('nb-board-search').addEventListener('input', sources);

  function pin(kind, value) {
    if (kind === 'recorded' && state().cards.some(c => c.source === value)) {
      say(t('nb.board.already'));
      return false;
    }
    const id = j().addCard(kind, value, facts());
    if (!id) {
      say(t('nb.board.full'));
      return false;
    }
    commit();
    draw();
    say(t('nb.board.pinned') + ' ' + count());
    return true;
  }
  $('nb-board-pin').addEventListener('click', () => pin('recorded', selectedSource));
  $('nb-theory-form').addEventListener('submit', event => {
    event.preventDefault();
    const text = $('nb-theory-text');
    if (pin('theory', text.value)) text.value = '';
  });

  function threadChoices() {
    const {cards} = state();
    for (const id of ['nb-thread-from', 'nb-thread-to']) {
      const select = $(id),
        old = select.value;
      select.replaceChildren(
        ...cards.map(c => {
          const option = el('option', '', cardTitle(c));
          option.value = c.id;
          return option;
        }),
      );
      if (cards.some(c => c.id === old)) select.value = old;
    }
    if (cards.length > 1 && $('nb-thread-from').value === $('nb-thread-to').value) $('nb-thread-to').selectedIndex = 1;
    $('nb-thread-submit').disabled = cards.length < 2;
    $('nb-thread-need').hidden = cards.length >= 2;
  }
  $('nb-thread-form').addEventListener('submit', event => {
    event.preventDefault();
    if (j().connect($('nb-thread-from').value, $('nb-thread-to').value, $('nb-thread-label').value)) {
      commit();
      $('nb-thread-label').value = '';
      draw();
      say(t('nb.board.tied'));
    } else say(t('nb.board.tieFailed'));
  });

  // --- The sheet -----------------------------------------------------------------

  const count = () => {
    const {cards, links} = state();
    return t('nb.board.count', {cards: cards.length, links: links.length});
  };

  function place(node, c) {
    node.style.left = c.x + '%';
    node.style.top = c.y + '%';
  }

  function cardNode(c) {
    const node = el('article', 'nb-card is-' + c.kind + (c.crossed ? ' crossed' : ''));
    node.dataset.card = c.id;
    node.style.setProperty('--tilt', tiltOf(c.id) + 'deg');
    place(node, c);
    const handle = el('button', 'nb-card-handle');
    handle.type = 'button';
    handle.append(
      el(
        'span',
        'nb-card-kind',
        c.kind === 'theory' ? t('nb.board.theory') : L.kinds?.[c.record.kind] || c.record.kind,
      ),
    );
    if (
      c.kind !== 'theory' &&
      c.record.kind !== 'Person mentioned' &&
      c.record.kind !== 'Object recorded' &&
      c.record.kind !== 'Place visited'
    )
      handle.append(el('span', 'nb-card-title', c.record.title));
    handle.setAttribute('aria-label', t('nb.board.move', {title: cardTitle(c)}));
    movable(handle, c.id, node);
    const text = el('p', 'nb-card-text', c.kind === 'theory' ? c.text : c.record.text);
    const actions = el('div', 'nb-card-actions');
    const read = el('button', 'nb-card-action', c.kind === 'theory' ? t('nb.board.edit') : t('nb.board.read'));
    read.type = 'button';
    read.addEventListener('click', () => openSheet(c.id));
    const unpin = el('button', 'nb-card-action', t('nb.board.unpin'));
    unpin.type = 'button';
    unpin.addEventListener('click', () => remove(c.id));
    actions.append(read, unpin);
    node.append(handle, text, actions);
    return node;
  }

  function remove(id) {
    j().removeCard(id);
    commit();
    if (sheetCard === id) closeSheet(false);
    draw();
    say(t('nb.board.unpinned') + ' ' + count());
    tools.pin.focus({preventScroll: true});
  }

  // Drag by the heading with any pointer (touch included), or use the arrow
  // keys on the focused heading. Positions are percentages of the board.
  function movable(handle, id, node) {
    let drag = null;
    const latest = () => state().cards.find(c => c.id === id);
    handle.addEventListener('pointerdown', event => {
      if (event.button !== 0 && event.pointerType !== 'touch') return;
      const box = canvas.getBoundingClientRect();
      if (!box.width || !box.height) return;
      const c = latest();
      if (!c) return;
      drag = {
        pointer: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        left: c.x,
        top: c.y,
        width: box.width,
        height: box.height,
        moved: false,
      };
      handle.setPointerCapture?.(event.pointerId);
      node.classList.add('dragging');
    });
    handle.addEventListener('pointermove', event => {
      if (!drag || drag.pointer !== event.pointerId) return;
      event.preventDefault();
      drag.moved = true;
      j().moveCard(
        id,
        drag.left + ((event.clientX - drag.x) / drag.width) * 100,
        drag.top + ((event.clientY - drag.y) / drag.height) * 100,
      );
      place(node, latest());
      strings();
    });
    const stop = event => {
      if (!drag || drag.pointer !== event.pointerId) return;
      const moved = drag.moved;
      drag = null;
      node.classList.remove('dragging');
      if (handle.hasPointerCapture?.(event.pointerId)) handle.releasePointerCapture(event.pointerId);
      if (moved) commit();
    };
    handle.addEventListener('pointerup', stop);
    handle.addEventListener('pointercancel', stop);
    handle.addEventListener('lostpointercapture', stop);
    handle.addEventListener('keydown', event => {
      const step = event.shiftKey ? 6 : 2;
      const delta = {ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step]}[
        event.key
      ];
      if (!delta) return;
      event.preventDefault();
      event.stopPropagation();
      const c = latest();
      j().moveCard(id, c.x + delta[0], c.y + delta[1]);
      place(node, latest());
      strings();
      commit();
    });
  }

  // Red thread hangs a little between two pins. The SVG stretches with the
  // board, so strokes keep a constant width and labels are HTML on top.
  function strings() {
    const {cards, links} = state();
    const svg = $('nb-board-strings'),
      labels = $('nb-board-labels');
    svg.replaceChildren();
    labels.replaceChildren();
    for (const link of links) {
      const a = cards.find(c => c.id === link.from),
        b = cards.find(c => c.id === link.to);
      const x1 = (a.x + CARD_WIDTH / 2) * 10,
        y1 = (a.y + PIN_DROP) * 10,
        x2 = (b.x + CARD_WIDTH / 2) * 10,
        y2 = (b.y + PIN_DROP) * 10;
      const sag = Math.min(70, Math.hypot(x2 - x1, y2 - y1) * 0.14);
      const cx = (x1 + x2) / 2,
        cy = (y1 + y2) / 2 + sag;
      for (const cls of ['nb-thread-shadow', 'nb-thread']) {
        const path = document.createElementNS(SVG, 'path');
        path.setAttribute('d', `M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}`);
        path.setAttribute('class', cls);
        path.setAttribute('vector-effect', 'non-scaling-stroke');
        svg.append(path);
      }
      if (link.label) {
        const tag = el('span', 'nb-thread-label', short(link.label, 28));
        tag.style.left = (x1 + 2 * cx + x2) / 40 + '%';
        tag.style.top = (y1 + 2 * cy + y2) / 40 + '%';
        tag.title = link.label;
        labels.append(tag);
      }
    }
  }

  function draw() {
    const {cards, links} = state();
    $('nb-board-count').textContent = count();
    $('nb-board-cards').replaceChildren(...cards.map(cardNode));
    $('nb-board-empty').hidden = cards.length > 0;
    strings();
    const list = $('nb-board-links');
    list.replaceChildren(
      ...links.map(link => {
        const a = cards.find(c => c.id === link.from),
          b = cards.find(c => c.id === link.to);
        const item = el('li', 'nb-thread-item');
        const words = el('span', 'nb-thread-words');
        words.append(el('span', '', cardTitle(a)), el('span', 'nb-thread-knot', ' ↔ '), el('span', '', cardTitle(b)));
        if (link.label) words.append(el('em', 'nb-thread-note', ' — ' + link.label));
        const cut = el('button', 'nb-link small', t('nb.board.cut'));
        cut.type = 'button';
        cut.setAttribute('aria-label', t('nb.board.cutLabel', {a: cardTitle(a), b: cardTitle(b)}));
        cut.addEventListener('click', () => {
          j().disconnect(link.from, link.to);
          commit();
          draw();
          tools.thread.focus({preventScroll: true});
        });
        item.append(words, cut);
        return item;
      }),
    );
    $('nb-board-links-empty').hidden = links.length > 0;
    if (tool === 'thread') threadChoices();
  }

  // --- Card sheet: read a recorded card in full, or edit a theory ----------------

  function openSheet(id) {
    const c = state().cards.find(c => c.id === id);
    if (!c) return;
    sheetCard = id;
    const theory = c.kind === 'theory';
    $('nb-card-kind').textContent = theory
      ? t('nb.board.written')
      : t('nb.board.recorded', {kind: L.kinds?.[c.record.kind] || c.record.kind});
    $('nb-card-heading').textContent = theory ? t('nb.board.theory') : c.record.title;
    const text = $('nb-card-text');
    text.hidden = theory;
    text.replaceChildren(...(theory ? [] : paragraphs(c.record.text).map(line => el('p', '', line))));
    $('nb-card-form').hidden = !theory;
    if (theory) {
      $('nb-card-theory').value = c.text;
      $('nb-card-crossed').checked = c.crossed;
    }
    sheet.hidden = false;
    $('nb-book').classList.add('nb-sheet-open');
    (theory ? $('nb-card-theory') : $('nb-card-heading')).focus({preventScroll: true});
  }

  function closeSheet(refocus = true) {
    if (sheet.hidden) return;
    const id = sheetCard;
    sheet.hidden = true;
    $('nb-book').classList.remove('nb-sheet-open');
    sheetCard = null;
    if (refocus) $('nb-board-cards').querySelector(`[data-card="${id}"] .nb-card-handle`)?.focus({preventScroll: true});
  }

  $('nb-card-form').addEventListener('submit', event => {
    event.preventDefault();
    j().editTheory(sheetCard, $('nb-card-theory').value, $('nb-card-crossed').checked);
    commit();
    draw();
    say(t('nb.board.savedNote'));
    closeSheet();
  });
  $('nb-card-close').addEventListener('click', () => closeSheet());
  $('nb-card-unpin').addEventListener('click', () => remove(sheetCard));

  function render() {
    const has = g().has;
    $('nb-board-none').hidden = has;
    $('nb-board-body').hidden = !has;
    view.querySelector('.nb-from-save').hidden = g().active || !has;
    for (const button of Object.values(tools)) button.disabled = !has;
    say('');
    draw();
    if (tool === 'pin') sources();
  }

  return {
    render,
    leave() {
      closeSheet(false);
      if (tool) setTool(tool, {focus: false});
    },
    escape() {
      if (!sheet.hidden) {
        closeSheet();
        return true;
      }
      if (tool) {
        const button = tools[tool];
        setTool(tool, {focus: false});
        button.focus({preventScroll: true});
        return true;
      }
      return false;
    },
  };
}
