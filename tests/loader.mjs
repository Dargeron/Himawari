// The asset loader, the boot sequence and the service worker, in Node with a
// fake network, Cache Storage and page. No browser needed.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createHash, randomBytes} from 'node:crypto';
import {
  createAssetLoader,
  createBoot,
  createInstallPrompt,
  fetchVerified,
  sha256,
  sha256Portable,
  versionedURL,
} from '../src/loader.js';

const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
// Let pending downloads, hashing and cache writes run to completion.
const settle = async () => {
  for (let i = 0; i < 6; i++) await sleep(2);
};
// Synchronous hashing keeps the queue tests deterministic; crypto.subtle is
// covered on its own above.
const digest = async bytes => sha256Portable(bytes);
async function until(condition, message, ms = 3000) {
  const deadline = Date.now() + ms;
  while (!condition()) {
    if (Date.now() > deadline) throw new Error('Timed out: ' + message);
    await sleep(2);
  }
}
const checks = [];
async function section(name, fn) {
  await fn();
  checks.push(name);
}

const ORIGIN = 'https://himawari-test.invalid';
const PAGE = ORIGIN + '/en/';
const data = new Map([
  ['assets/art/original/mapa_joc.webp', Buffer.from('original town drawing')],
  ['assets/art/original/hima3.webp', Buffer.from('original sunflower drawing')],
  ['assets/narration/en/opening.mp3', Buffer.from('complete opening narration recording')],
  ['assets/music/opening.m4a', Buffer.from('complete original opening music')],
  ['assets/fonts/eb-garamond-regular.woff2', Buffer.from('subset book face')],
  ['assets/art/scenes/1849.webp', Buffer.from('the water plant at noon')],
  ['assets/art/scenes/2467.webp', Buffer.from('a night by the window')],
  ['assets/narration/en/later.mp3', Buffer.from('a later narration line')],
  ['assets/music/park.m4a', Buffer.from('music for the park')],
  ['en/game.js', Buffer.from('window.testRuntimeStarted = true;')],
  ['en/style.css', Buffer.from('body { color: #f3ead6; }')],
]);
const entry = bytes => ({bytes: bytes.length, sha256: hash(bytes)});
const files = Object.fromEntries([...data].filter(([p]) => p.startsWith('assets/')).map(([p, b]) => [p, entry(b)]));
const critical = [
  'assets/art/original/mapa_joc.webp',
  'assets/art/original/hima3.webp',
  'assets/narration/en/opening.mp3',
  'assets/music/opening.m4a',
  'assets/fonts/eb-garamond-regular.woff2',
];
const background = Object.keys(files).filter(p => !critical.includes(p));
const boot = mode => ({
  mode,
  assetRoot: '../',
  cacheName: 'himawari-assets-v2',
  files,
  critical,
  runtime: {'game.js': entry(data.get('en/game.js')), 'style.css': entry(data.get('en/style.css'))},
});
const urlFor = path => new URL(versionedURL(boot('progressive'), path), PAGE).href;
const pathOf = url => new URL(url).pathname.slice(1);

// A network that answers from `data`. `hold` keeps matching requests open
// until released, to observe the queue; `fail` answers 503.
function network({hold = () => false, fail = () => false, body = path => data.get(path)} = {}) {
  const net = {log: [], open: new Map(), peak: 0, openAt: {}};
  net.fetcher = (url, {signal} = {}) => {
    const path = pathOf(url);
    net.log.push(path);
    net.openAt[path] = [...net.open.keys()];
    return new Promise((resolve, reject) => {
      const answer = () => {
        net.open.delete(path);
        if (fail(path)) resolve(new Response('unavailable', {status: 503}));
        else if (!body(path)) resolve(new Response('missing', {status: 404}));
        else resolve(new Response(body(path)));
      };
      signal?.addEventListener('abort', () => {
        net.open.delete(path);
        reject(new DOMException('Aborted', 'AbortError'));
      });
      if (hold(path)) {
        net.open.set(path, answer);
        net.peak = Math.max(net.peak, net.open.size);
      } else setImmediate(answer);
    });
  };
  net.release = path => net.open.get(path)?.();
  net.releaseAll = () => [...net.open.values()].forEach(answer => answer());
  return net;
}

function memoryCache() {
  const store = {values: new Map(), writes: 0};
  const key = request => (typeof request === 'string' ? request : request.url);
  const bare = url => url.split('?')[0];
  store.match = async (request, options) => {
    if (!options?.ignoreSearch) return store.values.get(key(request))?.clone();
    const found = [...store.values.keys()].find(url => bare(url) === bare(key(request)));
    return found && store.values.get(found).clone();
  };
  store.put = async (request, response) => {
    const body = await response.arrayBuffer();
    store.writes++;
    store.values.set(key(request), new Response(body, {status: response.status, headers: response.headers}));
  };
  store.delete = async request => store.values.delete(key(request));
  store.keys = async () => [...store.values.keys()].map(url => ({url}));
  return store;
}

const loaderFor = (net, options = {}) =>
  createAssetLoader({
    files,
    urlFor,
    fetcher: net.fetcher,
    openCache: async () => options.cache ?? null,
    createURL: blob => 'blob:test-' + Math.random(),
    retryDelay: () => 0,
    digest,
    ...options,
  });

// ---------------------------------------------------------------------------
await section('portable SHA-256 matches node:crypto', async () => {
  for (const size of [0, 1, 55, 56, 63, 64, 65, 119, 120, 1000, 100003]) {
    const bytes = randomBytes(size);
    assert.equal(sha256Portable(new Uint8Array(bytes)), hash(bytes), 'length ' + size);
  }
  assert.equal(await sha256(new Uint8Array(Buffer.from('abc'))), hash('abc'));
});

await section('verified downloads are cached under the versioned URL', async () => {
  const net = network(),
    cache = memoryCache();
  const progress = [];
  const loader = loaderFor(net, {cache, onProgress: s => progress.push(s)});
  await Promise.all(Object.keys(files).map(p => loader.ensure(p)));
  assert.equal(net.log.length, Object.keys(files).length);
  for (const [path, e] of Object.entries(files)) {
    const key = urlFor(path);
    assert.match(key, new RegExp(`/${path.replaceAll('.', '\\.')}\\?v=${e.sha256.slice(0, 12)}$`));
    const stored = await cache.match(key);
    assert.ok(stored, 'cached ' + path);
    assert.equal(hash(Buffer.from(await stored.arrayBuffer())), e.sha256);
    assert.equal(stored.headers.get('X-Himawari-SHA256'), e.sha256);
    assert.equal(stored.headers.get('Content-Length'), String(e.bytes));
  }
  assert.equal(
    (await cache.match(urlFor('assets/narration/en/opening.mp3'))).headers.get('Content-Type'),
    'audio/mpeg',
  );
  const last = progress.at(-1);
  assert.equal(last.bytes, last.total);
  assert.equal(last.files, Object.keys(files).length);
  assert.equal(last.complete, true);
  assert.equal(loader.progress().cacheWritable, true);
});

await section('a return visit needs no downloads; corrupt or stale entries are repaired', async () => {
  const cache = memoryCache();
  const filling = loaderFor(network(), {cache});
  await Promise.all(Object.keys(files).map(p => filling.ensure(p)));
  // Full verification (complete mode): every entry is read and hashed.
  let net = network();
  let loader = loaderFor(net, {cache});
  await Promise.all(Object.keys(files).map(p => loader.ensure(p)));
  assert.equal(net.log.length, 0, 'A return visit should require no media downloads');
  assert.equal(loader.progress().fromCache, Object.keys(files).length);
  // Trusted headers (progressive mode) skip re-reading the body.
  net = network();
  loader = loaderFor(net, {cache, trustCacheHeaders: true, retain: () => false});
  await Promise.all(Object.keys(files).map(p => loader.ensure(p)));
  assert.equal(net.log.length, 0);
  // A damaged entry is detected and fetched again.
  cache.values.set(urlFor('assets/art/original/mapa_joc.webp'), new Response('damaged'));
  net = network();
  loader = loaderFor(net, {cache, trustCacheHeaders: true, retain: () => false});
  await Promise.all(Object.keys(files).map(p => loader.ensure(p)));
  assert.deepEqual(net.log, ['assets/art/original/mapa_joc.webp']);
  assert.equal(
    hash(Buffer.from(await (await cache.match(urlFor('assets/art/original/mapa_joc.webp'))).arrayBuffer())),
    files['assets/art/original/mapa_joc.webp'].sha256,
  );
  // A changed file has a new versioned URL; unchanged files are reused.
  const replacement = Buffer.from('updated park music bytes');
  const updatedFiles = {...files, 'assets/music/park.m4a': entry(replacement)};
  const updatedBoot = {...boot('progressive'), files: updatedFiles};
  net = network({body: path => (path === 'assets/music/park.m4a' ? replacement : data.get(path))});
  loader = createAssetLoader({
    files: updatedFiles,
    urlFor: path => new URL(versionedURL(updatedBoot, path), PAGE).href,
    fetcher: net.fetcher,
    openCache: async () => cache,
    retryDelay: () => 0,
    digest,
  });
  await Promise.all(Object.keys(updatedFiles).map(p => loader.ensure(p)));
  assert.deepEqual(net.log, ['assets/music/park.m4a']);
  // Pruning drops the stale version of this edition's file only.
  cache.values.set(ORIGIN + '/assets/narration/zh-CN/other-edition.mp3?v=0123456789ab', new Response('kept'));
  assert.equal(await loader.prune(), 1);
  const keys = [...cache.values.keys()];
  assert.equal(keys.filter(k => k.includes('/assets/music/park.m4a')).length, 1);
  assert.ok(keys.some(k => k.includes('other-edition.mp3')));
});

await section('high priority first, bounded concurrency, de-duplication and promotion', async () => {
  const net = network({hold: () => true});
  const loader = loaderFor(net);
  loader.prefetch(background, {priority: 'low'});
  await settle();
  assert.deepEqual(net.log, background.slice(0, 2), 'background work uses at most two slots');
  // Urgent work does not wait for background downloads already running.
  const first = loader.ensure(critical[0]);
  assert.equal(loader.ensure(critical[0]), first, 'one promise per file');
  for (const path of critical) loader.ensure(path, {priority: 'high'});
  loader.prefetch([critical[1], 'assets/not-in-the-manifest.webp'], {priority: 'high'});
  await settle();
  assert.deepEqual(net.log.slice(2), critical.slice(0, 3), 'three urgent downloads at once, in order');
  // A background file the game now needs is promoted to the urgent queue.
  loader.ensure(background[3], {priority: 'high'});
  net.release(background[0]);
  net.release(background[1]);
  await settle();
  assert.equal(net.log.length, 5, 'no new background download while urgent work runs');
  while (net.open.size) {
    assert.ok([...net.open.keys()].filter(p => critical.includes(p) || p === background[3]).length <= 3);
    net.release(net.open.keys().next().value);
    await settle();
  }
  assert.deepEqual(net.log.slice(5), [critical[3], critical[4], background[3], background[2]]);
  assert.deepEqual(net.openAt[background[2]], [], 'background resumes only once urgent work is done');
  assert.equal(new Set(net.log).size, net.log.length, 'no file is downloaded twice');
  await first;
  assert.equal(loader.progress().complete, true);
});

await section('background work pauses and resumes', async () => {
  const net = network();
  const loader = loaderFor(net);
  loader.pause();
  loader.prefetch(background, {priority: 'low'});
  await loader.ensure(critical[0]);
  await settle();
  assert.deepEqual(net.log, [critical[0]], 'paused: only urgent work runs');
  loader.resume();
  await until(() => background.every(loader.ready), 'background resumes');
});

await section('retry keeps completed files; failures never count as ready', async () => {
  let failing = true;
  const cache = memoryCache();
  const net = network({fail: path => failing && path === 'assets/music/opening.m4a'});
  const loader = loaderFor(net, {cache, retries: 1});
  const results = await Promise.allSettled(Object.keys(files).map(p => loader.ensure(p)));
  assert.equal(results.filter(r => r.status === 'rejected').length, 1);
  assert.equal(net.log.filter(p => p === 'assets/music/opening.m4a').length, 2, 'one automatic retry');
  assert.deepEqual(loader.failures(), [{path: 'assets/music/opening.m4a', message: 'HTTP 503'}]);
  assert.equal(loader.ready('assets/music/opening.m4a'), false);
  assert.equal(loader.progress().failed, 1);
  failing = false;
  net.log.length = 0;
  loader.retryFailed();
  await loader.ensure('assets/music/opening.m4a');
  assert.deepEqual(net.log, ['assets/music/opening.m4a']);
  assert.equal(loader.progress().complete, true);
  assert.equal(loader.progress().failed, 0);
  // Closing the tab mid-download: the next visit reuses every finished file.
  const recovered = loaderFor(
    {
      fetcher: async () => {
        throw new Error('No network expected');
      },
    },
    {cache},
  );
  await Promise.all(Object.keys(files).map(p => recovered.ensure(p)));
  assert.equal(recovered.progress().fromCache, Object.keys(files).length);
  // A wrong or truncated body is rejected and never stored.
  const bad = memoryCache();
  const wrong = loaderFor(
    network({body: path => (path === 'assets/art/scenes/1849.webp' ? Buffer.from('truncated') : data.get(path))}),
    {cache: bad, retries: 0},
  );
  await assert.rejects(wrong.ensure('assets/art/scenes/1849.webp'), /Incomplete or outdated/);
  assert.equal(wrong.ready('assets/art/scenes/1849.webp'), false);
  assert.equal(bad.values.size, 0);
  await assert.rejects(wrong.ensure('assets/unknown.webp'), /Unknown asset/);
  // Same size, different bytes: only the hash can tell.
  const original = data.get('assets/art/scenes/2467.webp');
  const forged = Buffer.from(original.toString().toUpperCase());
  assert.equal(forged.length, original.length);
  const forgery = loaderFor(
    network({body: path => (path === 'assets/art/scenes/2467.webp' ? forged : data.get(path))}),
    {retries: 0},
  );
  await assert.rejects(forgery.ensure('assets/art/scenes/2467.webp'), /Incomplete or outdated/);
});

await section('stalled connections are aborted and retried', async () => {
  // No headers at all, from a fetcher that ignores the abort signal.
  await assert.rejects(
    fetchVerified(ORIGIN + '/x', entry(Buffer.from('x')), {
      fetcher: () => new Promise(() => {}),
      stallMilliseconds: 15,
    }),
    error => error.name === 'StallError' && error.message === 'Connection stalled',
  );
  // Headers, then silence mid-body.
  const source = data.get('assets/narration/en/later.mp3');
  let attempts = 0;
  const loader = loaderFor(
    {
      fetcher: async () => {
        attempts++;
        if (attempts === 1)
          return new Response(
            new ReadableStream({
              start(controller) {
                controller.enqueue(source.subarray(0, 4));
              },
            }),
          );
        return new Response(source);
      },
    },
    {stallMilliseconds: 20, retries: 1},
  );
  await loader.ensure('assets/narration/en/later.mp3');
  assert.equal(attempts, 2, 'the stalled download was retried');
  const dead = loaderFor({fetcher: () => new Promise(() => {})}, {stallMilliseconds: 15, retries: 0});
  await assert.rejects(dead.ensure('assets/narration/en/later.mp3'));
  assert.equal(dead.failures()[0].message, 'Connection stalled');
});

await section('streamed bytes report real progress', async () => {
  const path = 'assets/art/scenes/2467.webp',
    source = data.get(path);
  const seen = [];
  const loader = loaderFor(
    {
      fetcher: async () =>
        new Response(
          new ReadableStream({
            async start(controller) {
              controller.enqueue(source.subarray(0, 8));
              await sleep(5);
              controller.enqueue(source.subarray(8));
              controller.close();
            },
          }),
        ),
    },
    {onProgress: s => seen.push(s.bytes)},
  );
  await loader.ensure(path);
  assert.ok(seen.includes(8));
  assert.equal(loader.progress([path]).bytes, source.length);
});

await section('storage denied or full: downloads still complete from memory', async () => {
  let net = network();
  let loader = loaderFor(net, {
    openCache: async () => {
      throw new Error('Storage denied');
    },
    retain: () => false,
  });
  await Promise.all(Object.keys(files).map(p => loader.ensure(p)));
  assert.equal(loader.progress().complete, true);
  assert.equal(loader.cacheWritable, false);
  assert.ok(loader.objectURL(critical[0]).startsWith('blob:'), 'uncached files stay available as blobs');
  const quota = memoryCache();
  quota.put = async () => {
    throw new DOMException('Quota exceeded', 'QuotaExceededError');
  };
  net = network();
  loader = loaderFor(net, {cache: quota, retain: () => false});
  await Promise.all(Object.keys(files).map(p => loader.ensure(p)));
  assert.equal(loader.progress().complete, true);
  assert.equal(loader.progress().cacheWritable, false);
  assert.equal(net.log.length, Object.keys(files).length);
  assert.ok(Object.keys(files).every(p => loader.objectURL(p)?.startsWith('blob:')));
});

// ---------------------------------------------------------------------------
// Boot: ordering of downloads, game start and the HIMAWARI_BOOT interface.

function page(mode, {net = network(), cache = memoryCache(), controlled = false, ...overrides} = {}) {
  const events = [];
  const state = {controlled, revealed: 0, booted: false, injected: []};
  const ui = {
    progress: s => events.push(['progress', s.bytes, s.total]),
    status: key => events.push(['status', key]),
    error: (key, options) => events.push(['error', key, options?.retry ?? true]),
    notice: key => events.push(['notice', key]),
  };
  let controller;
  const env = {
    resolve: url => new URL(url, PAGE).href,
    controlled: () => state.controlled,
    ui,
    injectScript: async url => {
      state.injected.push({
        url,
        progress: controller.api.progress(),
        critical: critical.every(p => controller.api.ready(p)),
        fetchedBefore: [...net.log],
      });
    },
    revealPage: () => state.revealed++,
    markBooted: () => (state.booted = true),
    revealFallbackMilliseconds: 0,
    loaderOptions: {
      fetcher: net.fetcher,
      openCache: async () => cache,
      createURL: () => 'blob:page-' + Math.random(),
      retryDelay: () => 0,
      digest,
      stallMilliseconds: 500,
    },
    ...overrides,
  };
  controller = createBoot(boot(mode), env);
  return {controller, api: controller.api, events, state, net, cache};
}

await section('progressive: the game starts after the critical set, the rest follows', async () => {
  const net = network({hold: path => background.includes(path)});
  const view = page('progressive', {net});
  await view.controller.start();
  assert.equal(view.state.injected.length, 1);
  const [start] = view.state.injected;
  assert.equal(start.url, 'game.js?v=' + hash(data.get('en/game.js')).slice(0, 12));
  assert.equal(start.critical, true, 'every critical file is verified before game.js');
  assert.ok(start.fetchedBefore.includes('en/game.js') && start.fetchedBefore.includes('en/style.css'));
  assert.equal(start.progress.complete, false, 'the game starts before the background download ends');
  assert.equal(view.state.booted, true);
  assert.equal(view.state.revealed, 0, 'revealing is left to the game');
  assert.deepEqual(
    view.events.filter(e => e[0] === 'status').map(e => e[1]),
    ['loader.critical', 'loader.opening'],
  );
  const bar = view.events.filter(e => e[0] === 'progress').at(-1);
  assert.equal(bar[1], bar[2], 'the bar ends full');
  // Background downloads continue, two at a time, then the game reveals.
  await settle();
  assert.equal(net.open.size, 2);
  view.api.reveal();
  view.api.reveal();
  assert.equal(view.state.revealed, 1);
  while (net.open.size) {
    net.releaseAll();
    await settle();
  }
  await until(() => view.api.progress().complete, 'background completes');
  assert.equal(new Set(net.log).size, net.log.length, 'nothing downloaded twice');
});

await section('progressive: background waits while the page is hidden', async () => {
  const view = page('progressive');
  view.controller.visibility(true);
  await view.controller.start();
  await settle();
  assert.ok(
    background.every(p => !view.net.log.includes(p)),
    'no background download while hidden',
  );
  view.controller.visibility(false);
  await until(() => view.api.progress().complete, 'resumes when visible');
});

await section('progressive: urgent requests from the game jump the queue', async () => {
  const net = network({hold: path => background.includes(path)});
  const view = page('progressive', {net});
  await view.controller.start();
  await settle();
  const running = [...net.open.keys()];
  const wanted = background.find(p => !running.includes(p));
  const ready = view.api.whenReady(wanted);
  await settle();
  assert.equal(net.open.has(wanted), true, 'requested at once, beside the background slots');
  net.release(wanted);
  assert.equal(await ready, true);
  assert.equal(view.api.ready(wanted), true);
  // Unknown paths are ignored; failures and timeouts resolve false.
  view.api.prefetch(['assets/unknown.webp']);
  assert.equal(await view.api.whenReady('assets/unknown.webp'), false);
  const slow = background.find(p => !view.api.ready(p) && !net.open.has(p));
  assert.equal(await view.api.whenReady(slow, 20), false, 'times out without rejecting');
  net.releaseAll();
  await until(() => view.api.ready(slow), 'the download goes on after the timeout');
});

await section('complete: every file is verified before game.js', async () => {
  const view = page('complete');
  await view.controller.start();
  const [start] = view.state.injected;
  assert.equal(start.progress.complete, true);
  assert.equal(start.progress.files, Object.keys(files).length);
  for (const path of Object.keys(files)) assert.ok(start.fetchedBefore.includes(path), path);
  assert.equal(view.events.find(e => e[0] === 'status')[1], 'loader.complete');
});

await section('boot failure shows Retry; Retry fetches only what failed', async () => {
  let failing = true;
  const net = network({fail: path => failing && path === 'assets/narration/en/opening.mp3'});
  const view = page('complete', {net});
  await view.controller.start();
  assert.equal(view.state.injected.length, 0, 'the game never starts with missing files');
  assert.deepEqual(
    view.events.find(e => e[0] === 'error' && e[1]),
    ['error', 'loader.error', true],
  );
  failing = false;
  net.log.length = 0;
  await view.controller.start();
  assert.deepEqual(net.log, ['assets/narration/en/opening.mp3']);
  assert.equal(view.state.injected.length, 1);
  // Offline wording when the browser says it is offline.
  const offline = page('progressive', {net: network({fail: () => true}), online: () => false});
  await offline.controller.start();
  assert.ok(offline.events.some(e => e[0] === 'error' && e[1] === 'loader.offline'));
});

await section('assetURL: versioned URLs under the service worker, blobs without it', async () => {
  const view = page('progressive');
  await view.controller.start();
  const path = 'assets/art/original/hima3.webp';
  assert.ok(view.api.assetURL(path).startsWith('blob:page-'), 'uncontrolled: verified blob');
  view.state.controlled = true;
  view.controller.controllerChanged();
  assert.equal(view.api.assetURL(path), '../assets/art/original/hima3.webp?v=' + files[path].sha256.slice(0, 12));
  assert.equal(view.api.assetURL('assets/elsewhere.png'), '../assets/elsewhere.png');
  const fresh = page('progressive', {controlled: true});
  assert.equal(fresh.api.assetURL(path), '../' + path + '?v=' + files[path].sha256.slice(0, 12), 'not yet downloaded');
  const shape = fresh.api.progress();
  for (const key of ['bytes', 'total', 'files', 'fileCount', 'complete']) assert.ok(key in shape, key);
});

await section('onProgress, the reveal fallback and the install prompt', async () => {
  const view = page('progressive', {revealFallbackMilliseconds: 30});
  const seen = [];
  const stop = view.api.onProgress(s => seen.push(s.files));
  await view.controller.start();
  await until(() => view.api.progress().complete, 'complete');
  await sleep(200);
  assert.ok(seen.length >= 1 && seen.at(-1) === Object.keys(files).length);
  stop();
  const count = seen.length;
  view.api.prefetch(Object.keys(files));
  await sleep(200);
  assert.equal(seen.length, count, 'unsubscribed');
  assert.equal(view.state.revealed, 1, 'revealed once the game forgot to');

  const target = new EventTarget();
  const install = createInstallPrompt(target);
  const changes = [];
  install.onChange(available => changes.push(available));
  assert.equal(install.available, false);
  assert.equal(await install.prompt(), false);
  const event = new Event('beforeinstallprompt', {cancelable: true});
  let prompted = 0;
  event.prompt = async () => prompted++;
  event.userChoice = Promise.resolve({outcome: 'accepted'});
  target.dispatchEvent(event);
  assert.equal(event.defaultPrevented, true);
  assert.equal(install.available, true);
  assert.equal(await install.prompt(), true);
  assert.equal(prompted, 1);
  assert.equal(install.available, false);
  assert.deepEqual(changes, [true, false]);
});

await section('file: pages start the game directly; unsupported browsers say so', async () => {
  const net = network();
  const view = page('progressive', {net, local: true});
  await view.controller.start();
  assert.equal(view.state.injected[0].url, 'game.js');
  assert.equal(net.log.length, 0, 'no fetching from a local folder');
  assert.equal(view.api.assetURL('assets/music/park.m4a'), '../assets/music/park.m4a');
  assert.equal(view.api.ready('assets/music/park.m4a'), true);
  assert.equal(await view.api.whenReady('assets/music/park.m4a'), true);
  const old = page('progressive', {supported: false});
  await old.controller.start();
  assert.deepEqual(old.events.at(-1), ['error', 'loader.unsupported', false]);
  assert.equal(old.state.injected.length, 0);
});

// ---------------------------------------------------------------------------
// The service worker, run in a sandbox with fake caches and network.

function sameOrigin() {
  const original = Object.getOwnPropertyDescriptor(Response.prototype, 'type');
  Object.defineProperty(Response.prototype, 'type', {configurable: true, get: () => 'basic'});
  return () => Object.defineProperty(Response.prototype, 'type', original);
}

async function serviceWorker({network: answer} = {}) {
  const handlers = {};
  const caches = new Map();
  const cacheStorage = {
    open: async name => {
      if (!caches.has(name)) caches.set(name, memoryCache());
      return caches.get(name);
    },
    keys: async () => [...caches.keys()],
    delete: async name => caches.delete(name),
  };
  const requests = [];
  const sandbox = {
    self: {
      registration: {scope: PAGE},
      location: {origin: ORIGIN},
      addEventListener: (type, fn) => (handlers[type] = fn),
      skipWaiting: () => {},
      clients: {claim: async () => (sandbox.claimed = true)},
    },
    caches: cacheStorage,
    fetch: async (request, init) => {
      const url = typeof request === 'string' ? request : request.url;
      requests.push(url);
      return answer(url, typeof request === 'string' ? init : request);
    },
    Response,
    Headers,
    Blob,
    URL,
    console,
  };
  const source = fs
    .readFileSync(new URL('../src/sw.js', import.meta.url), 'utf8')
    .replace('__CACHE__', 'himawari-assets-v2');
  vm.runInNewContext(source, sandbox);
  const dispatch = async (type, extra = {}) => {
    const waits = [];
    let response;
    const event = {...extra, waitUntil: p => waits.push(p), respondWith: p => (response = p)};
    handlers[type](event);
    await Promise.all(waits);
    const result = await response;
    await Promise.all(waits);
    return result;
  };
  const get = (url, {range, mode = 'cors'} = {}) =>
    dispatch('fetch', {request: {method: 'GET', url, mode, headers: new Headers(range ? {range} : {})}});
  return {handlers, caches, cacheStorage, requests, dispatch, get, sandbox};
}

await section('service worker: cached ranges answer 206 for <audio>', async () => {
  const audio = Buffer.from('0123456789abcdefghij');
  const sw = await serviceWorker({network: () => new Response('network')});
  const cache = await sw.cacheStorage.open('himawari-assets-v2');
  const url = ORIGIN + '/assets/narration/en/opening.mp3?v=abc123abc123';
  await cache.put(url, new Response(audio, {headers: {'Content-Type': 'audio/mpeg'}}));
  let response = await sw.get(url, {range: 'bytes=5-9'});
  assert.equal(response.status, 206);
  assert.equal(response.headers.get('Content-Range'), 'bytes 5-9/20');
  assert.equal(response.headers.get('Content-Length'), '5');
  assert.equal(response.headers.get('Content-Type'), 'audio/mpeg');
  assert.equal(Buffer.from(await response.arrayBuffer()).toString(), '56789');
  response = await sw.get(url, {range: 'bytes=0-'});
  assert.equal(response.status, 206);
  assert.equal(response.headers.get('Content-Range'), 'bytes 0-19/20');
  response = await sw.get(url, {range: 'bytes=-4'});
  assert.equal(Buffer.from(await response.arrayBuffer()).toString(), 'ghij');
  response = await sw.get(url, {range: 'bytes=15-99'});
  assert.equal(response.headers.get('Content-Range'), 'bytes 15-19/20');
  response = await sw.get(url, {range: 'bytes=30-'});
  assert.equal(response.status, 416);
  assert.equal(response.headers.get('Content-Range'), 'bytes */20');
  response = await sw.get(url);
  assert.equal(response.status, 200);
  assert.equal((await response.arrayBuffer()).byteLength, 20);
  assert.equal(sw.requests.length, 0, 'all answered from the cache');
});

await section('service worker: misses go to the network; only whole pictures are kept', async () => {
  const sw = await serviceWorker({
    network: (url, request) => {
      if (url.endsWith('.webp?v=1')) return new Response('picture', {headers: {'Content-Type': 'image/webp'}});
      if (url.endsWith('.webp?v=3'))
        return new Response('pic', {
          status: 206,
          headers: {'Content-Type': 'image/webp', 'Content-Range': 'bytes 0-2/7'},
        });
      return new Response('part', {status: 206, headers: {'Content-Type': 'audio/mpeg'}});
    },
  });
  const cache = await sw.cacheStorage.open('himawari-assets-v2');
  const picture = ORIGIN + '/assets/art/scenes/1849.webp?v=1';
  // Node's Response has type 'default'; the worker keeps only same-origin 'basic' answers.
  const restore = sameOrigin();
  try {
    assert.equal(await (await sw.get(picture)).text(), 'picture');
    assert.ok(await cache.match(picture), 'a full picture is cached');
    const clip = ORIGIN + '/assets/narration/en/later.mp3?v=2';
    assert.equal((await sw.get(clip, {range: 'bytes=0-'})).status, 206);
    assert.equal(await cache.match(clip), undefined, 'partial responses are never cached');
    const ranged = ORIGIN + '/assets/art/scenes/2467.webp?v=3';
    assert.equal((await sw.get(ranged, {range: 'bytes=0-2'})).status, 206);
    assert.equal(await cache.match(ranged), undefined, 'not even partial pictures');
  } finally {
    restore();
  }
});

await section('service worker: network first for the page, cache when offline; old caches go', async () => {
  let offline = false;
  const sw = await serviceWorker({
    network: url => {
      if (offline) throw new TypeError('Failed to fetch');
      return new Response('fresh ' + new URL(url).pathname, {headers: {'Content-Type': 'text/html'}});
    },
  });
  const restore = sameOrigin();
  try {
    await sw.cacheStorage.open('himawari-complete-assets-v1');
    await sw.cacheStorage.open('someone-elses-cache');
    await sw.dispatch('install');
    const cache = await sw.cacheStorage.open('himawari-assets-v2');
    for (const path of ['en/', 'en/game.js', 'en/style.css', 'en/loader.js', 'en/manifest.webmanifest'])
      assert.ok(await cache.match(ORIGIN + '/' + path), 'precached ' + path);
    await sw.dispatch('activate');
    assert.deepEqual((await sw.cacheStorage.keys()).sort(), ['himawari-assets-v2', 'someone-elses-cache']);
    assert.equal(sw.sandbox.claimed, true);
    assert.equal(await (await sw.get(ORIGIN + '/en/game.js?v=123')).text(), 'fresh /en/game.js');
    offline = true;
    assert.equal(await (await sw.get(ORIGIN + '/en/game.js?v=456')).text(), 'fresh /en/game.js');
    assert.equal(await (await sw.get(ORIGIN + '/en/?choose=1', {mode: 'navigate'})).text(), 'fresh /en/');
    // Fonts named in style.css: any cached version, offline too.
    await cache.put(ORIGIN + '/assets/fonts/caveat-medium.woff2?v=aaaabbbbcccc', new Response('font'));
    assert.equal(await (await sw.get(ORIGIN + '/assets/fonts/caveat-medium.woff2')).text(), 'font');
  } finally {
    restore();
  }
});

console.log(JSON.stringify({passed: true, checks: checks.length, sections: checks}, null, 1));
