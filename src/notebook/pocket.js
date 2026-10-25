import {L} from '../i18n.js';
import {el} from '../inkbox.js';
import {itemIcon} from './icons.js';

const tilts = [-3, 2, -1.5, 3.5, -2.5, 1, -4, 2.5, -1];

// The pocket: what Harry carries now, as paper tags on string, and the things
// he has carried on other days, in fainter pencil.
export function createPocket(ctx) {
  const {$} = ctx;

  function tag(item, i) {
    const li = el('li', 'nb-tag');
    li.style.setProperty('--tilt', tilts[i % tilts.length] + 'deg');
    const card = el('span', 'nb-tag-card');
    card.append(itemIcon(item), el('span', 'nb-tag-name', L.items[item] || item));
    li.append(card);
    return li;
  }

  function render() {
    const g = ctx.game();
    ctx.root.querySelector('#nb-pocket .nb-from-save').hidden = g.active || !g.has;
    const carried = g.has ? [...g.s.inventory] : [];
    $('nb-pocket-items').replaceChildren(...carried.map(tag));
    $('nb-pocket-empty').hidden = carried.length > 0;
    const past = g.has
      ? g.journal
          .catalog()
          .filter(record => record.kind === 'Object recorded')
          .map(record => record.id.slice('object:'.length))
          .filter(item => !carried.includes(item))
      : [];
    $('nb-pocket-past').replaceChildren(...past.map((item, i) => tag(item, i + 3)));
    $('nb-pocket-past-empty').hidden = past.length > 0;
  }

  return {render};
}
