import {L, t} from '../i18n.js';
import {el} from '../inkbox.js';
import {paragraphs} from '../screens.js';
import {destinations} from '../engine.js';

// The pages Harry has read, newest first, with an index of loops on the left.
export function createPages(ctx) {
  const {$} = ctx;
  const view = ctx.root.querySelector('#nb-pages');

  // Entries store the place name as displayed; old saves may hold English
  // names and English text, which the Chinese edition translates on reading.
  const placeName = location => destinations.find(d => d.englishName === location)?.name || location;
  const textOf = text => (L.historyLabel && /[A-Za-z]{3}/.test(text) ? L.historyLabel(text) : text);

  function render() {
    const g = ctx.game();
    view.querySelector('.nb-from-save').hidden = g.active || !g.has;
    const entries = [...g.history].reverse();
    const list = $('nb-pages-list'),
      loops = new Map();
    list.replaceChildren();
    for (const entry of entries) {
      const article = el('article', 'nb-entry');
      if (!loops.has(entry.loop)) {
        loops.set(entry.loop, 0);
        article.id = 'nb-loop-' + entry.loop;
        article.tabIndex = -1;
      }
      loops.set(entry.loop, loops.get(entry.loop) + 1);
      const meta = el(
        'h3',
        'nb-entry-meta',
        t('nb.pages.heading', {
          loop: entry.loop,
          phase: L.phases[entry.phase] || entry.phase,
          place: placeName(entry.location),
        }),
      );
      const body = el('div', 'nb-prose');
      for (const line of paragraphs(textOf(entry.text))) body.append(el('p', '', line));
      article.append(meta, body);
      list.append(article);
    }
    $('nb-pages-empty').hidden = entries.length > 0;
    const index = $('nb-pages-loops');
    index.replaceChildren();
    index.hidden = loops.size < 1;
    for (const [loop, count] of loops) {
      const button = el('button', 'nb-loop');
      button.type = 'button';
      button.append(
        el('span', 'nb-loop-name', t('nb.pages.loop', {n: loop})),
        el('span', 'nb-loop-count', count === 1 ? t('nb.pages.countOne') : t('nb.pages.count', {n: count})),
      );
      button.addEventListener('click', () => {
        const target = $('nb-loop-' + loop);
        if (!target) return;
        const scroller = target.closest('.nb-page'),
          view = target.closest('.nb-view');
        // One of the two is the scrolling element, depending on the layout.
        for (const box of [scroller, view])
          if (box && box.scrollHeight > box.clientHeight)
            box.scrollTop += target.getBoundingClientRect().top - box.getBoundingClientRect().top - 16;
        target.focus({preventScroll: true});
      });
      index.append(button);
    }
  }

  return {render};
}
