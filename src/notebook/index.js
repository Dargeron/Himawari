import {L, t} from '../i18n.js';
import {createEngine} from '../engine.js';
import {createPocket} from './pocket.js';
import {createDiary} from './diary.js';
import {createBoard} from './board.js';
import {createPages} from './pages.js';
import {createAlbum} from './album.js';
import {createSettings} from './settings.js';

// Harry's notebook: one paper overlay with six tabs. It only reads snapshots
// and journals, and edits the notebook's own memory; it never advances time.
// Credits and the new-game confirmation are views inside the Settings tab.
const tabOf = view => (view === 'credits' || view === 'restart' ? 'settings' : view);
const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]';

export function createNotebook(root, api) {
  const $ = id => root.querySelector('#' + id);
  const book = $('nb-book'),
    backdrop = $('nb-backdrop'),
    tabs = [...root.querySelectorAll('.nb-tab')],
    views = Object.fromEntries([...root.querySelectorAll('.nb-view')].map(v => [v.dataset.view, v]));
  let open = false,
    current = 'diary',
    opener = null,
    cache = null,
    inerted = [],
    downTarget = null;

  // What the notebook shows: the running game, or the saved game when it is
  // opened from the title (read once per opening).
  function game() {
    if (cache) return cache;
    const journal = api.getJournal(),
      guide = api.getGuide();
    let s = api.getCurrent(),
      history = api.getHistory() || [];
    const active = api.isActive(),
      has = active || api.hasSave();
    if (!active && has) {
      const saved = readSave();
      if (saved) {
        try {
          const engine = createEngine();
          engine.importSave(saved.engine);
          s = engine.snapshot();
        } catch {}
        if (Array.isArray(saved.history)) history = saved.history.filter(validEntry).slice(-120);
      }
    }
    let facts = [];
    try {
      facts = guide.summary(s).facts;
    } catch {}
    cache = {active, has, s, guide, journal, history, facts};
    return cache;
  }

  function readSave() {
    try {
      return JSON.parse(localStorage.getItem(L.saveKey) || 'null');
    } catch {
      return null;
    }
  }

  const ctx = {
    api,
    root,
    $,
    game,
    reload: () => (cache = null),
    show,
    close,
    isOpen: () => open,
    current: () => current,
    settingsChanged: key => album.sync(key),
    updateUnread,
  };
  const album = createAlbum(ctx);
  const parts = {
    pocket: createPocket(ctx),
    diary: createDiary(ctx),
    board: createBoard(ctx),
    pages: createPages(ctx),
    album,
    ...createSettings(ctx),
  };

  function updateUnread() {
    const badge = $('nb-unread');
    let unread = 0;
    try {
      unread = api.getJournal().cover().unread;
    } catch {}
    badge.hidden = !unread;
    badge.textContent = unread ? String(unread) : '';
    const tab = $('nb-tab-diary');
    if (unread) tab.setAttribute('aria-label', t('nb.tab.diary') + ', ' + t('nb.unread', {n: unread}));
    else tab.removeAttribute('aria-label');
  }

  // --- Views -----------------------------------------------------------------

  function show(view, arg, {focus = false} = {}) {
    if (!views[view]) view = 'diary';
    const previous = current,
      changed = previous !== view;
    if (changed) parts[previous]?.leave?.();
    current = view;
    // Fill the view before it is shown, so switches and sliders appear in
    // place instead of sliding there.
    parts[view].render(arg);
    for (const [name, node] of Object.entries(views)) node.hidden = name !== view;
    const tab = tabOf(view);
    for (const button of tabs) {
      const selected = button.dataset.tab === tab;
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
    }
    revealTab(tabs.find(b => b.dataset.tab === tab));
    book.dataset.view = view;
    const heading = views[view].querySelector('h2[id]');
    book.setAttribute('aria-labelledby', 'nb-title' + (heading ? ' ' + heading.id : ''));
    if (changed) {
      for (const node of [views[view], ...views[view].querySelectorAll('.nb-page')]) node.scrollTop = 0;
      views[view].classList.remove('nb-turn');
      void views[view].offsetWidth;
      views[view].classList.add('nb-turn');
    }
    updateUnread();
    if (focus) (parts[view].focusTarget?.() || tabs.find(b => b.dataset.tab === tab)).focus({preventScroll: true});
  }

  // On phones the tabs are a scrolling row: keep the open one in sight.
  function revealTab(button) {
    const row = $('nb-tabs');
    if (!button || row.scrollWidth <= row.clientWidth) return;
    const left = button.offsetLeft,
      right = left + button.offsetWidth;
    if (left < row.scrollLeft) row.scrollLeft = left - 12;
    else if (right > row.scrollLeft + row.clientWidth) row.scrollLeft = right - row.clientWidth + 12;
  }

  function setInert(on) {
    if (on) {
      inerted = [...(root.parentElement?.children || [])]
        .filter(node => node !== root && !['toast', 'sr-story'].includes(node.id) && !node.inert)
        .map(node => ((node.inert = true), node));
    } else {
      for (const node of inerted) node.inert = false;
      inerted = [];
    }
  }

  function openNotebook(tab, arg) {
    const view = views[tab] ? tab : 'diary';
    cache = null;
    if (!open) {
      const active = document.activeElement;
      opener = active && active !== document.body && !root.contains(active) ? active : null;
      open = true;
      root.hidden = false;
      setInert(true);
      root.classList.remove('nb-opening');
      void root.offsetWidth;
      root.classList.add('nb-opening');
      api.onOpen?.();
    }
    show(view, arg, {focus: true});
  }

  function close() {
    if (!open) return;
    parts[current]?.leave?.();
    open = false;
    root.hidden = true;
    setInert(false);
    api.onClose?.();
    const back = opener;
    opener = null;
    if (back?.isConnected && !back.closest('[hidden]') && !back.disabled) back.focus({preventScroll: true});
    else
      document
        .querySelector('#title:not([hidden]) .title-option:not([hidden]), #game:not([hidden]) #ink-scroll')
        ?.focus({preventScroll: true});
  }

  // --- Input -------------------------------------------------------------------

  for (const button of tabs) button.addEventListener('click', () => show(button.dataset.tab, undefined));
  $('nb-tabs').addEventListener('keydown', event => {
    const index = tabs.indexOf(event.target);
    if (index < 0) return;
    const step = {ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1}[event.key];
    let next = step
      ? (index + step + tabs.length) % tabs.length
      : event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? tabs.length - 1
          : -1;
    if (next < 0) return;
    event.preventDefault();
    show(tabs[next].dataset.tab, undefined);
    tabs[next].focus();
  });
  $('nb-close').addEventListener('click', close);
  backdrop.addEventListener('pointerdown', event => (downTarget = event.target));
  book.addEventListener('pointerdown', event => (downTarget = event.target));
  backdrop.addEventListener('click', event => {
    event.stopPropagation();
    const pressed = downTarget;
    downTarget = null;
    if (pressed && pressed !== backdrop) return;
    close();
  });

  function focusables() {
    // Unchecked radios are skipped by Tab when their group has a choice.
    const skipped = node =>
      node.type === 'radio' &&
      !node.checked &&
      !!book.querySelector(`input[type="radio"][name="${node.name}"]:checked`);
    return [...book.querySelectorAll(FOCUSABLE)].filter(
      node => node.tabIndex >= 0 && !node.disabled && !node.closest('[hidden]') && !skipped(node),
    );
  }

  // Captured before the game's own shortcuts: while the notebook is open the
  // keyboard belongs to it, and Escape closes the innermost thing first.
  document.addEventListener(
    'keydown',
    event => {
      if (!open) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        if (parts[current].escape?.()) return;
        close();
        return;
      }
      if (event.key === 'Tab') {
        const list = focusables();
        if (!list.length) return;
        const first = list[0],
          last = list[list.length - 1],
          active = document.activeElement;
        if (!book.contains(active)) {
          event.preventDefault();
          first.focus();
        } else if (event.shiftKey && active === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && active === last) {
          event.preventDefault();
          first.focus();
        }
        return;
      }
      const typing = /INPUT|TEXTAREA|SELECT/.test(event.target?.tagName || '') || event.target?.isContentEditable;
      if (!typing && !event.ctrlKey && !event.metaKey && !event.altKey && (event.key === 'n' || event.key === 'N')) {
        event.preventDefault();
        event.stopPropagation();
        close();
      }
    },
    true,
  );
  document.addEventListener('focusin', event => {
    if (open && !root.contains(event.target)) (focusables()[0] || book).focus?.({preventScroll: true});
  });

  return {
    open: openNotebook,
    close,
    isOpen: () => open,
    refresh() {
      cache = null;
      if (open) show(current, undefined);
      else updateUnread();
    },
  };
}

function validEntry(h) {
  return (
    typeof h?.text === 'string' &&
    typeof h?.location === 'string' &&
    typeof h?.phase === 'string' &&
    Number.isInteger(h?.loop)
  );
}
