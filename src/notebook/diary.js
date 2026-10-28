import {t} from '../i18n.js';
import {el} from '../inkbox.js';
import {tally} from '../hud.js';

// The diary: tonight's forecast as Harry's pencilled note, one optional clue
// per day, what has been prepared today and every finding kept across loops.
// Opening it never spends the clue; only the button does.
export function createDiary(ctx) {
  const {$, api} = ctx;
  const view = ctx.root.querySelector('#nb-diary');

  $('nb-clue-button').addEventListener('click', () => {
    if (!api.isActive()) return;
    api.requestClue();
    ctx.reload();
    render({keepUnread: true});
    $('nb-clue-text').focus({preventScroll: true});
  });

  // Start today again: one button, then a confirmation in place.
  const redo = {
    section: $('nb-redo'),
    ask: $('nb-redo-button'),
    yes: $('nb-redo-confirm'),
    no: $('nb-redo-cancel'),
  };
  function confirming(on) {
    redo.ask.hidden = on;
    redo.yes.hidden = redo.no.hidden = !on;
    (on ? redo.no : redo.ask).focus({preventScroll: true});
  }
  redo.ask.addEventListener('click', () => confirming(true));
  redo.no.addEventListener('click', () => confirming(false));
  redo.yes.addEventListener('click', () => api.restartDay?.());

  let fresh = new Set();

  function render({keepUnread = false} = {}) {
    const g = ctx.game();
    view.querySelector('.nb-from-save').hidden = g.active || !g.has;
    $('nb-diary-none').hidden = g.has;
    $('nb-diary-body').hidden = !g.has;

    if (!keepUnread) {
      fresh = new Set();
      try {
        if (g.journal.cover().unread) {
          fresh = new Set(g.journal.exportSave().unread);
          api.clearUnread();
        }
      } catch {}
    }

    const summary = g.guide.summary(g.s);
    const day = $('nb-diary-day');
    day.replaceChildren(el('span', 'nb-day-label', t('nb.diary.day', {n: summary.day})), tally(summary.day));
    if (!g.has) day.replaceChildren();

    $('nb-forecast').textContent = summary.forecast.text;

    const clue = summary.clue,
      finished = g.s.screen.finished,
      text = $('nb-clue-text'),
      button = $('nb-clue-button');
    text.tabIndex = -1;
    text.classList.toggle('revealed', clue.used);
    text.textContent = clue.used
      ? clue.text
      : !g.active
        ? t('nb.diary.clueWhilePlaying')
        : finished
          ? t('nb.diary.clueOver')
          : clue.available
            ? t('nb.diary.clueReady')
            : t('nb.diary.clueLater');
    button.hidden = !g.active;
    button.disabled = !clue.available;
    button.textContent = clue.used ? t('nb.diary.clueUsed') : t('nb.diary.clueUse');
    $('nb-clue-note').textContent = g.active ? (clue.used ? t('nb.diary.clueReread') : t('nb.diary.clueNote')) : '';
    $('nb-clue-note').hidden = !g.active;

    redo.section.hidden = !api.canRestartDay?.();
    redo.ask.hidden = false;
    redo.yes.hidden = redo.no.hidden = true;

    $('nb-prepared').replaceChildren(...summary.preparations.map(line => el('li', '', line)));
    $('nb-prepared-empty').hidden = summary.preparations.length > 0;

    const facts = g.has ? summary.facts : [];
    $('nb-findings').replaceChildren(
      ...facts.map(fact => {
        const item = el('li', 'nb-finding' + (fresh.has(fact.id) ? ' is-new' : ''));
        const meta = el('p', 'nb-finding-meta', t('nb.diary.firstRecorded', {n: fact.loop}));
        if (fresh.has(fact.id)) meta.append(el('span', 'nb-new', t('nb.diary.new')));
        item.append(meta, el('p', 'nb-finding-text', fact.text));
        return item;
      }),
    );
    $('nb-findings-empty').hidden = facts.length > 0;
    ctx.updateUnread();
  }

  return {render: () => render()};
}
