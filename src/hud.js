import {t} from './i18n.js';
import {assetURL} from './assets.js';
import {displayLoop, flowerFor, isNight, phaseName} from './screens.js';

const SVG = 'http://www.w3.org/2000/svg';

// Loops as pencil tally marks: four strokes and a strike through each five.
// The jitter is seeded by position, so a mark never changes once drawn.
export function tally(count, {max = 20} = {}) {
  const svg = document.createElementNS(SVG, 'svg');
  const shown = Math.min(count, max),
    groups = Math.ceil(shown / 5);
  const width = groups * 30 + (count > max ? 24 : 0);
  svg.setAttribute('viewBox', `0 0 ${Math.max(width, 10)} 24`);
  svg.setAttribute('width', String(Math.max(width, 10)));
  svg.setAttribute('height', '24');
  svg.setAttribute('aria-hidden', 'true');
  svg.classList.add('tally');
  const wobble = n => ((Math.sin(n * 12.9898) * 43758.5453) % 1) * 1.6;
  for (let i = 0; i < shown; i++) {
    const group = Math.floor(i / 5),
      within = i % 5,
      x0 = group * 30 + 3;
    const line = document.createElementNS(SVG, 'path');
    if (within < 4) {
      const x = x0 + within * 5.5 + wobble(i);
      line.setAttribute('d', `M${x} ${3 + wobble(i + 7)} L${x + wobble(i + 3) - 0.8} ${21 - wobble(i + 5)}`);
    } else {
      line.setAttribute('d', `M${x0 - 2} ${17 + wobble(i)} L${x0 + 21} ${6 + wobble(i + 2)}`);
    }
    if (i === shown - 1) line.classList.add('newest');
    svg.append(line);
  }
  if (count > max) {
    const more = document.createElementNS(SVG, 'text');
    more.setAttribute('x', String(groups * 30 + 2));
    more.setAttribute('y', '18');
    more.textContent = '+' + (count - max);
    svg.append(more);
  }
  return svg;
}

export function createHud(root, {card, settings}) {
  const flower = root.querySelector('#hud-flower'),
    phase = root.querySelector('#hud-phase'),
    loop = root.querySelector('#hud-loop'),
    time = root.querySelector('#hud-time'),
    note = root.querySelector('#hud-note'),
    badge = root.querySelector('#notebook-badge');
  let noteTimer = 0,
    noteAction = null,
    cardDone = null,
    cardTimer = 0;

  function update(s) {
    const n = displayLoop(s);
    flower.src = assetURL(flowerFor(s));
    phase.textContent = phaseName(s);
    loop.replaceChildren(tally(n));
    time.setAttribute('aria-label', t('hud.time', {loop: n, phase: phaseName(s)}));
    document.documentElement.dataset.phase = isNight(s) ? 'night' : s.state.phase.toLowerCase();
  }

  function notice(text, action) {
    note.textContent = text;
    note.hidden = false;
    noteAction = action;
    note.classList.remove('arrive');
    void note.offsetWidth;
    note.classList.add('arrive');
    clearTimeout(noteTimer);
    noteTimer = setTimeout(() => (note.hidden = true), 6500);
  }
  note.addEventListener('click', () => {
    note.hidden = true;
    noteAction?.();
  });

  function setBadge(count) {
    badge.hidden = !count;
    badge.textContent = count ? String(count) : '';
  }

  // A full-screen beat between times of day. Tapping or any key ends it.
  function showCard({flowerPath, title, sub, rewind = false, duration = 1700}) {
    finishCard();
    if (settings.reducedMotion) return Promise.resolve();
    const image = card.querySelector('#card-flower');
    card.querySelector('#card-title').textContent = title;
    const subtitle = card.querySelector('#card-sub');
    subtitle.replaceChildren();
    if (sub instanceof Node) subtitle.append(sub);
    else subtitle.textContent = sub || '';
    image.src = assetURL(flowerPath);
    card.hidden = false;
    card.classList.remove('leaving');
    card.classList.toggle('rewind', rewind);
    return new Promise(resolve => {
      cardDone = resolve;
      if (rewind) {
        // The flower runs back through the day: wilted to upright.
        let frame = 5;
        image.src = assetURL('assets/art/original/hima5.webp');
        const step = () => {
          if (!cardDone) return;
          frame--;
          if (frame >= 1) {
            image.src = assetURL('assets/art/original/hima' + frame + '.webp');
            cardTimer = setTimeout(step, 190);
          } else cardTimer = setTimeout(finishCard, duration - 700);
        };
        cardTimer = setTimeout(step, 260);
      } else cardTimer = setTimeout(finishCard, duration);
    });
  }

  function finishCard() {
    clearTimeout(cardTimer);
    if (!cardDone) return;
    const done = cardDone;
    cardDone = null;
    card.classList.add('leaving');
    setTimeout(() => {
      if (!cardDone) card.hidden = true;
    }, 380);
    done();
  }
  card.addEventListener('click', finishCard);

  return {
    update,
    notice,
    setBadge,
    showCard,
    finishCard,
    get carding() {
      return !!cardDone;
    },
  };
}
