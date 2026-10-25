import {boot} from './generated/boot.js';
import {data} from './generated/pack.js';
import {useLocale, t} from './i18n.js';
import {createBoot, createInstallPrompt} from './loader.js';

// Entry point of an edition's loader.js: the loading screen, the service
// worker, and window.HIMAWARI_BOOT, which exists before game.js runs.
//
// Website (progressive): the title appears once boot.critical is verified;
// everything else keeps downloading in the background at low priority, and
// the game asks for what it needs next with high priority.
// Packaged apps (complete): every file is downloaded and verified first.
useLocale({strings: data.strings});

const page = document;
const $ = id => page.getElementById(id);
const view = {
  loader: $('loader'),
  fill: $('loader-fill'),
  status: $('loader-status'),
  amount: $('loader-amount'),
  retry: $('loader-retry'),
  app: $('app'),
};
const local = location.protocol === 'file:';
const workers = !local && 'serviceWorker' in navigator && window.isSecureContext !== false;
const supported = typeof fetch === 'function' && typeof Blob === 'function' && !!window.URL?.createObjectURL;

const megabytes = bytes => (bytes / 1e6).toFixed(1);
let latest = null,
  frame = 0;
function paint() {
  frame = 0;
  if (!latest) return;
  const {bytes, total} = latest;
  const ratio = total ? Math.min(1, bytes / total) : 1;
  view.fill.style.width = (ratio * 100).toFixed(2) + '%';
  if (view.loader.dataset.notice) return; // a notice replaces the amount
  view.amount.textContent = total ? t('loader.amount', {done: megabytes(bytes), total: megabytes(total)}) : '';
}

const ui = {
  progress(state) {
    latest = state;
    if (frame) return;
    // Hidden tabs get no animation frames; paint on a timer there instead.
    frame = page.hidden ? setTimeout(paint, 250) : requestAnimationFrame(paint);
  },
  status(key) {
    view.status.textContent = t(key);
  },
  error(key, {retry = true} = {}) {
    if (!key) {
      delete view.loader.dataset.state;
      view.retry.hidden = true;
      return;
    }
    view.loader.dataset.state = 'error';
    view.status.textContent = t(key);
    view.retry.hidden = !retry;
    if (retry) view.retry.focus();
  },
  notice(key) {
    view.loader.dataset.notice = key;
    view.amount.textContent = t(key);
  },
};

function injectScript(url) {
  return new Promise((resolve, reject) => {
    const script = page.createElement('script');
    script.src = url;
    script.onload = () => resolve();
    script.onerror = () => {
      script.remove();
      reject(new Error('The game did not load'));
    };
    page.body.append(script);
  });
}

function revealPage() {
  view.loader.hidden = true;
  view.app.hidden = false;
  view.app.inert = false;
  view.app.removeAttribute('inert');
}

const controller = createBoot(boot, {
  local,
  supported,
  resolve: url => new URL(url, page.baseURI).href,
  controlled: () => !!navigator.serviceWorker?.controller,
  online: () => navigator.onLine !== false,
  ui,
  injectScript,
  revealPage,
  markBooted: () => {
    page.documentElement.dataset.booted = 'true';
  },
  install: createInstallPrompt(window),
  runtimeURLs: {'style.css': $('game-style')?.getAttribute('href')},
  loaderOptions: {
    openCache: async () => (window.caches ? caches.open(boot.cacheName) : null),
    concurrency: {high: 3, low: 2},
  },
});
window.HIMAWARI_BOOT = controller.api;

if (workers) {
  navigator.serviceWorker.addEventListener('controllerchange', () => controller.controllerChanged());
  navigator.serviceWorker.register('sw.js', {scope: './'}).catch(() => {});
}
page.addEventListener('visibilitychange', () => controller.visibility(page.hidden));
if (page.hidden) controller.visibility(true);
window.addEventListener('online', () => controller.online());
view.retry.addEventListener('click', () => controller.start());
controller.start();
