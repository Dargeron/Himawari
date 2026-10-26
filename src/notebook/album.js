import {L, t} from '../i18n.js';
import {el} from '../inkbox.js';
import {assetURL} from '../assets.js';
import {paragraphs} from '../screens.js';
import {journalText} from '../journal.js';

const tilts = [-4, 3, -2, 5, -3];
const PLAY = 'M8 5v14l11-7z',
  PAUSE = 'M8 5h3v14H8zm5 0h3v14h-3z';

// The album: only endings actually lived through, each with the author's
// original drawing, its recorded text and a replay of the narration. The replay
// has its own player, so it never touches the paused main narration.
export function createAlbum(ctx) {
  const {$, api} = ctx;
  let selected = 0,
    voice = null,
    voiceSettings = null,
    status = null;

  function player() {
    if (!voice) {
      voiceSettings = {...api.settings, musicEnabled: false, narrationEnabled: true};
      voice = api.createAudio(voiceSettings, onStatus);
    }
    return voice;
  }

  function sync() {
    if (!voice) return;
    Object.assign(voiceSettings, api.settings, {musicEnabled: false, narrationEnabled: true});
    voice.update();
  }

  function onStatus(next) {
    status = next;
    api.mainAudio?.duck?.(next.playing);
    const button = $('nb-album-play'),
      label = next.playing ? t('voice.pause') : next.paused && !next.completed ? t('voice.resume') : t('voice.play');
    button.setAttribute('aria-label', label);
    button.title = label;
    button.querySelector('path').setAttribute('d', next.playing ? PAUSE : PLAY);
    button.classList.toggle('playing', next.playing);
    $('nb-album-status').textContent = next.blocked
      ? t('voice.blocked', {name: L.narrator})
      : next.loading
        ? t('voice.loading', {name: L.narrator})
        : next.playing
          ? t('voice.narrating', {name: L.narrator})
          : next.paused && !next.completed
            ? t('voice.paused', {name: L.narrator})
            : t('nb.album.ready', {name: L.narrator});
    $('nb-album-fill').style.width = (next.completed ? 0 : next.progress * 100) + '%';
  }

  function idle() {
    onStatus({playing: false, paused: false, completed: true, blocked: false, loading: false, progress: 0});
    status = null;
  }

  $('nb-album-play').addEventListener('click', () => {
    const page = pages().find(p => p.number === selected);
    if (!page) return;
    const audio = player();
    if (!status || status.completed) audio.read(page.parts, {force: true});
    else audio.toggle();
  });

  // The ending lived most recently (album pages are ordered by number).
  const latest = list => list.reduce((a, b) => (b.loop >= a.loop ? b : a));

  function pages() {
    return ctx.game().journal.album();
  }

  function stop() {
    if (voice && status) voice.stop();
    idle();
  }

  function render(number) {
    const list = pages();
    const empty = !list.length;
    $('nb-album-empty').hidden = !empty;
    $('nb-album-figure').hidden = empty;
    $('nb-album-page').hidden = empty;
    const strip = $('nb-album-strip');
    strip.replaceChildren();
    strip.hidden = list.length < 2;
    if (empty) return stop();
    const wanted = list.find(p => p.number === Number(number)) || list.find(p => p.number === selected) || latest(list);
    if (wanted.number !== selected) stop();
    selected = wanted.number;
    list.forEach((page, i) => {
      const button = el('button', 'nb-polaroid');
      button.type = 'button';
      button.style.setProperty('--tilt', tilts[i % tilts.length] + 'deg');
      button.setAttribute('aria-pressed', String(page.number === selected));
      const image = el('img');
      image.src = assetURL('assets/art/original/' + page.art + '.webp');
      image.alt = '';
      button.append(image, el('span', 'nb-polaroid-caption', page.name));
      button.addEventListener('click', () => {
        render(page.number);
        strip.querySelector(`[aria-pressed="true"]`)?.focus();
      });
      strip.append(button);
    });
    const art = $('nb-album-art');
    art.src = assetURL('assets/art/original/' + wanted.art + '.webp');
    art.alt = t('nb.album.photo', {name: wanted.name});
    $('nb-album-name').textContent = wanted.name;
    $('nb-album-loop').textContent = t('nb.album.loop', {n: wanted.loop});
    const text = $('nb-album-text');
    text.replaceChildren(...paragraphs(journalText(wanted.parts)).map(line => el('p', '', line)));
    if (!status) idle();
  }

  function suspend() {
    voice?.suspend(true);
  }
  function resume() {
    if (ctx.isOpen() && ctx.current() === 'album') voice?.resume();
  }
  window.addEventListener('pagehide', suspend);
  window.addEventListener('pageshow', resume);
  document.addEventListener('visibilitychange', () => (document.hidden ? suspend() : resume()));

  return {render, leave: stop, sync};
}
