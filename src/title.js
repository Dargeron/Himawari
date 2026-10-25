import {t} from './i18n.js';
import {assetURL} from './assets.js';
import {el} from './inkbox.js';

// The cover: the room with the sunflower behind, the menu in an ink box, and
// polaroids of the endings the player has lived through.
export function createTitle(root, actions) {
  const $ = id => root.querySelector('#' + id);
  $('title-flower').src = assetURL('assets/art/original/hima3.webp');
  $('title-continue').addEventListener('click', actions.onContinue);
  $('title-begin').addEventListener('click', actions.onBegin);
  $('title-notebook').addEventListener('click', () => actions.onNotebook());
  $('title-settings').addEventListener('click', () => actions.onNotebook('settings'));
  $('title-credits').addEventListener('click', () => actions.onNotebook('credits'));
  $('title-language').addEventListener('click', () => actions.onLanguage?.());

  const fullscreen = $('title-fullscreen');
  fullscreen.hidden = !document.fullscreenEnabled;
  fullscreen.addEventListener('click', () => actions.onFullscreen());

  const install = $('title-install');
  const syncInstall = () => (install.hidden = !actions.install?.available);
  install.addEventListener('click', async () => {
    await actions.install?.prompt();
    syncInstall();
  });
  actions.install?.onChange?.(syncInstall);
  syncInstall();

  function update({hasSave, hasNotebook, photos = []}) {
    $('title-continue').hidden = !hasSave;
    $('title-begin').textContent = hasSave ? t('title.newGame') : t('title.begin');
    $('title-begin').classList.toggle('primary', !hasSave);
    $('title-notebook').hidden = !hasNotebook;
    const shelf = $('title-photos');
    shelf.replaceChildren();
    shelf.hidden = !photos.length;
    photos.forEach((photo, i) => {
      const button = el('button', 'polaroid');
      button.type = 'button';
      button.style.setProperty('--tilt', [-5, 3, -2, 6, -4][i % 5] + 'deg');
      const image = el('img');
      image.src = assetURL('assets/art/original/' + photo.art + '.webp');
      image.alt = '';
      button.append(image, el('span', 'polaroid-caption', photo.name));
      button.setAttribute('aria-label', t('title.photo', {name: photo.name}));
      button.addEventListener('click', () => actions.onNotebook('album', photo.number));
      shelf.append(button);
    });
  }

  function show() {
    root.hidden = false;
    ($('title-continue').hidden ? $('title-begin') : $('title-continue')).focus({preventScroll: true});
  }

  function hide() {
    root.hidden = true;
  }

  return {update, show, hide};
}
