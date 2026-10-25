/* The asset loader: verified downloads into Cache Storage, a two-lane priority
   queue, and the boot sequence that decides when game.js may start.

   Everything the browser provides (fetch, Cache Storage, SHA-256, object URLs,
   timers, the page itself) is injected, so tests run it in Node with fakes.
   src/loader-main.js wires it to the real page. */

const MIME = {
  webp: 'image/webp',
  png: 'image/png',
  mp3: 'audio/mpeg',
  m4a: 'audio/mp4',
  woff2: 'font/woff2',
  js: 'text/javascript',
  css: 'text/css',
  json: 'application/json',
};

export function mimeType(path) {
  const extension = path.split(/[?#]/)[0].split('.').pop().toLowerCase();
  return MIME[extension] || 'application/octet-stream';
}

// --------------------------------------------------------------------------
// SHA-256. Browsers only offer crypto.subtle on secure origins; elsewhere (a
// phone testing over plain http on a LAN) a small JavaScript version keeps
// every download verified.

const K = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98,
  0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786,
  0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8,
  0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
  0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819,
  0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
  0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7,
  0xc67178f2,
]);

export function sha256Portable(bytes) {
  const H = new Uint32Array([
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
  ]);
  const length = bytes.byteLength;
  const padded = new Uint8Array(Math.ceil((length + 9) / 64) * 64);
  padded.set(bytes);
  padded[length] = 0x80;
  const view = new DataView(padded.buffer);
  view.setUint32(padded.length - 8, Math.floor(length / 0x20000000));
  view.setUint32(padded.length - 4, (length * 8) >>> 0);
  const W = new Uint32Array(64);
  for (let offset = 0; offset < padded.length; offset += 64) {
    for (let i = 0; i < 16; i++) W[i] = view.getUint32(offset + i * 4);
    for (let i = 16; i < 64; i++) {
      const x = W[i - 15],
        y = W[i - 2];
      const s0 = ((x >>> 7) | (x << 25)) ^ ((x >>> 18) | (x << 14)) ^ (x >>> 3);
      const s1 = ((y >>> 17) | (y << 15)) ^ ((y >>> 19) | (y << 13)) ^ (y >>> 10);
      W[i] = (W[i - 16] + s0 + W[i - 7] + s1) | 0;
    }
    let a = H[0],
      b = H[1],
      c = H[2],
      d = H[3],
      e = H[4],
      f = H[5],
      g = H[6],
      h = H[7];
    for (let i = 0; i < 64; i++) {
      const S1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
      const t1 = (h + S1 + ((e & f) ^ (~e & g)) + K[i] + W[i]) | 0;
      const S0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
      const t2 = (S0 + ((a & b) ^ (a & c) ^ (b & c))) | 0;
      h = g;
      g = f;
      f = e;
      e = (d + t1) | 0;
      d = c;
      c = b;
      b = a;
      a = (t1 + t2) | 0;
    }
    H[0] += a;
    H[1] += b;
    H[2] += c;
    H[3] += d;
    H[4] += e;
    H[5] += f;
    H[6] += g;
    H[7] += h;
  }
  return Array.from(H, word => word.toString(16).padStart(8, '0')).join('');
}

export async function sha256(bytes) {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) return sha256Portable(bytes);
  const hash = await subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(hash), b => b.toString(16).padStart(2, '0')).join('');
}

// --------------------------------------------------------------------------
// One verified download. A request that delivers no bytes for
// `stallMilliseconds` is aborted; a slow but moving download never is.

export function stalled() {
  const error = new Error('Connection stalled');
  error.name = 'StallError';
  return error;
}

async function readAll(response, {stallMilliseconds, onBytes, abort, setTimer, clearTimer}) {
  if (!response.body?.getReader) {
    const bytes = new Uint8Array(await response.arrayBuffer());
    onBytes(bytes.byteLength);
    return bytes;
  }
  const reader = response.body.getReader(),
    chunks = [];
  let count = 0,
    timer,
    timedOut = false;
  const arm = () => {
    clearTimer(timer);
    timer = setTimer(() => {
      timedOut = true;
      abort();
      reader.cancel().catch(() => {});
    }, stallMilliseconds);
  };
  try {
    arm();
    for (;;) {
      const {done, value} = await reader.read();
      if (timedOut) throw stalled();
      if (done) break;
      chunks.push(value);
      count += value.byteLength;
      onBytes(count);
      arm();
    }
  } catch (error) {
    throw timedOut ? stalled() : error;
  } finally {
    clearTimer(timer);
  }
  const bytes = new Uint8Array(count);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}

async function checked(bytes, entry, digest) {
  if (bytes.byteLength !== entry.bytes || (await digest(bytes)) !== entry.sha256)
    throw new Error('Incomplete or outdated download');
  return bytes;
}

export async function fetchVerified(
  url,
  entry,
  {
    fetcher = (...args) => fetch(...args),
    digest = sha256,
    stallMilliseconds = 30000,
    onBytes = () => {},
    cache = 'default',
    setTimer = setTimeout,
    clearTimer = clearTimeout,
  } = {},
) {
  const controller = typeof AbortController === 'function' ? new AbortController() : null;
  let timedOut = false;
  const abort = () => controller?.abort();
  // Waiting for the response headers counts as silence too.
  const timer = setTimer(() => {
    timedOut = true;
    abort();
  }, stallMilliseconds);
  // Also settle when aborted, even if the fetcher ignores the signal.
  const aborted = new Promise((_, reject) =>
    controller?.signal.addEventListener('abort', () => reject(stalled()), {once: true}),
  );
  aborted.catch(() => {});
  let response;
  try {
    response = await Promise.race([
      fetcher(url, {signal: controller?.signal, cache, credentials: 'same-origin'}),
      aborted,
    ]);
  } catch (error) {
    throw timedOut || error?.name === 'AbortError' ? stalled() : error;
  } finally {
    clearTimer(timer);
  }
  if (!response.ok) throw new Error('HTTP ' + response.status);
  const bytes = await readAll(response, {stallMilliseconds, onBytes, abort, setTimer, clearTimer});
  return checked(bytes, entry, digest);
}

// --------------------------------------------------------------------------
// The queue. Every path has one record, so asking twice never downloads
// twice. High priority runs up to `concurrency.high` at once; background work
// takes up to `concurrency.low` slots, and only while nothing urgent waits.

const HEADER_BYTES = 'X-Himawari-Bytes',
  HEADER_SHA = 'X-Himawari-SHA256';

export function createAssetLoader({
  files,
  urlFor,
  fetcher = (...args) => fetch(...args),
  openCache = async () => null,
  digest = sha256,
  createURL = blob => URL.createObjectURL(blob),
  retain = () => true,
  trustCacheHeaders = false,
  concurrency = {high: 3, low: 2},
  stallMilliseconds = 30000,
  retries = 2,
  retryDelay = attempt => 1500 * attempt,
  setTimer = setTimeout,
  clearTimer = clearTimeout,
  onProgress = () => {},
}) {
  const records = new Map(),
    queues = {high: [], low: []},
    active = {high: 0, low: 0},
    listeners = new Set([onProgress]);
  let total = 0,
    doneBytes = 0,
    partialBytes = 0,
    doneCount = 0,
    failedCount = 0,
    fromCache = 0,
    paused = false,
    cacheWritable = true,
    cachePromise;
  for (const [path, entry] of Object.entries(files)) {
    records.set(path, {path, entry, state: 'idle', priority: 'low', partial: 0, stored: false});
    total += entry.bytes;
  }

  function snapshot() {
    return {
      bytes: doneBytes + partialBytes,
      total,
      files: doneCount,
      fileCount: records.size,
      complete: doneCount === records.size,
      failed: failedCount,
      fromCache,
      cacheWritable,
    };
  }
  function emit() {
    const state = snapshot();
    for (const listener of listeners) {
      try {
        listener(state);
      } catch {}
    }
  }
  function setPartial(record, count) {
    const next = Math.min(count, record.entry.bytes);
    partialBytes += next - record.partial;
    record.partial = next;
  }
  function cache() {
    cachePromise ||= (async () => {
      try {
        const opened = await openCache();
        if (!opened) cacheWritable = false;
        return opened || null;
      } catch {
        cacheWritable = false;
        return null;
      }
    })();
    return cachePromise;
  }

  async function fromStore(store, record, key) {
    let hit;
    try {
      hit = await store.match(key);
    } catch {
      return null;
    }
    if (!hit) return null;
    const {entry} = record;
    // Entries this loader wrote carry their size and hash. Trusting them
    // spares re-reading the whole cache on every visit; entries without them
    // (written by the service worker) are always read and verified.
    if (
      trustCacheHeaders &&
      !retain() &&
      hit.headers?.get(HEADER_SHA) === entry.sha256 &&
      hit.headers?.get(HEADER_BYTES) === String(entry.bytes)
    )
      return {bytes: null};
    try {
      const bytes = await readAll(hit, {
        stallMilliseconds,
        onBytes: () => {},
        abort: () => {},
        setTimer,
        clearTimer,
      });
      return {bytes: await checked(bytes, entry, digest)};
    } catch {
      try {
        await store.delete(key);
      } catch {}
      return null;
    }
  }

  async function load(record) {
    const {path, entry} = record,
      key = urlFor(path),
      store = await cache();
    let bytes = null,
      cached = false,
      stored = false;
    if (store) {
      const hit = await fromStore(store, record, key);
      if (hit) {
        ({bytes} = hit);
        cached = stored = true;
      }
    }
    if (!cached) {
      try {
        bytes = await fetchVerified(key, entry, {
          fetcher,
          digest,
          stallMilliseconds,
          setTimer,
          clearTimer,
          cache: record.attempt > 0 ? 'reload' : 'default',
          onBytes: count => {
            setPartial(record, count);
            emit();
          },
        });
      } finally {
        setPartial(record, 0);
      }
      if (store && cacheWritable) {
        try {
          await store.put(
            key,
            new Response(new Blob([bytes], {type: mimeType(path)}), {
              headers: {
                'Content-Type': mimeType(path),
                'Content-Length': String(entry.bytes),
                [HEADER_BYTES]: String(entry.bytes),
                [HEADER_SHA]: entry.sha256,
              },
            }),
          );
          stored = true;
        } catch {
          cacheWritable = false; // quota or private mode: keep going without it
        }
      }
    }
    record.stored = stored;
    if (bytes && (retain() || !stored)) record.blob = new Blob([bytes], {type: mimeType(path)});
    if (cached) fromCache++;
  }

  async function run(record, lane) {
    active[lane]++;
    record.state = 'loading';
    try {
      for (record.attempt = 0; ; record.attempt++) {
        try {
          await load(record);
          break;
        } catch (error) {
          if (record.attempt >= retries) throw error;
          await new Promise(resolve => setTimer(resolve, retryDelay(record.attempt + 1)));
        }
      }
      record.state = 'ready';
      doneBytes += record.entry.bytes;
      doneCount++;
      record.resolve({path: record.path, fromCache: record.stored});
    } catch (error) {
      record.state = 'failed';
      record.error = error?.name === 'StallError' ? 'Connection stalled' : error?.message || String(error);
      failedCount++;
      record.reject(error);
    } finally {
      active[lane]--;
      emit();
      pump();
    }
  }

  function pump() {
    while (active.high < concurrency.high && queues.high.length) run(queues.high.shift(), 'high');
    while (!paused && !queues.high.length && !active.high && active.low < concurrency.low && queues.low.length)
      run(queues.low.shift(), 'low');
  }

  function ensure(path, {priority = 'high'} = {}) {
    const record = records.get(path);
    if (!record) {
      const unknown = Promise.reject(new Error('Unknown asset ' + path));
      unknown.catch(() => {});
      return unknown;
    }
    if (record.state === 'ready') return Promise.resolve({path, fromCache: record.stored});
    if (record.state === 'queued' || record.state === 'loading') {
      if (record.state === 'queued' && priority === 'high' && record.priority === 'low') {
        queues.low.splice(queues.low.indexOf(record), 1);
        queues.high.push(record);
        record.priority = 'high';
        pump();
      }
      return record.promise;
    }
    if (record.state === 'failed') failedCount--;
    record.state = 'queued';
    record.priority = priority === 'low' ? 'low' : 'high';
    record.promise = new Promise((resolve, reject) => {
      record.resolve = resolve;
      record.reject = reject;
    });
    record.promise.catch(() => {}); // callers that ignore the result stay quiet
    queues[record.priority].push(record);
    pump();
    return record.promise;
  }

  function objectURL(path) {
    const record = records.get(path);
    if (!record || record.state !== 'ready') return undefined;
    if (!record.url && record.blob) record.url = createURL(record.blob);
    return record.url;
  }

  return {
    ensure,
    prefetch(paths, {priority = 'low'} = {}) {
      for (const path of paths) if (records.has(path)) ensure(path, {priority});
    },
    has: path => records.has(path),
    ready: path => records.get(path)?.state === 'ready',
    state: path => records.get(path)?.state,
    stored: path => !!records.get(path)?.stored,
    error: path => records.get(path)?.error,
    objectURL,
    // The page is now controlled by the service worker: verified files it can
    // serve no longer need to stay in memory, unless a URL was handed out.
    releaseBlobs() {
      for (const record of records.values()) if (!record.url && record.stored) record.blob = null;
    },
    failures: () =>
      [...records.values()].filter(r => r.state === 'failed').map(r => ({path: r.path, message: r.error})),
    retryFailed() {
      for (const record of [...records.values()])
        if (record.state === 'failed') ensure(record.path, {priority: record.priority});
    },
    // Drop queued background work (e.g. nowhere to store it).
    cancelLow() {
      for (const record of queues.low.splice(0)) {
        record.state = 'idle';
        record.reject(new Error('Cancelled'));
      }
      emit();
    },
    pause() {
      paused = true;
    },
    resume() {
      paused = false;
      pump();
    },
    get paused() {
      return paused;
    },
    get cacheWritable() {
      return cacheWritable;
    },
    progress(paths) {
      if (!paths) return snapshot();
      let bytes = 0,
        sum = 0,
        count = 0,
        failed = 0;
      for (const path of paths) {
        const record = records.get(path);
        if (!record) continue;
        sum += record.entry.bytes;
        if (record.state === 'ready') {
          bytes += record.entry.bytes;
          count++;
        } else bytes += record.partial;
        if (record.state === 'failed') failed++;
      }
      return {bytes, total: sum, files: count, fileCount: paths.length, complete: count === paths.length, failed};
    },
    onProgress(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    // Remove cached copies of this edition's files whose version is stale.
    // Other paths (the other edition's narration, the page) are left alone.
    async prune() {
      const store = await cache();
      if (!store?.keys) return 0;
      const current = new Map();
      for (const path of records.keys()) {
        const url = new URL(urlFor(path));
        current.set(url.origin + url.pathname, url.href);
      }
      let removed = 0;
      for (const request of await store.keys()) {
        const url = new URL(typeof request === 'string' ? request : request.url);
        const wanted = current.get(url.origin + url.pathname);
        if (wanted && wanted !== url.href) {
          await store.delete(request);
          removed++;
        }
      }
      return removed;
    },
  };
}

// --------------------------------------------------------------------------
// "Install app": browsers that support it fire beforeinstallprompt once the
// page qualifies. Keep the event so the game can offer installation later.

export function createInstallPrompt(target) {
  let deferred = null;
  const listeners = new Set();
  const changed = () => {
    for (const fn of listeners) {
      try {
        fn(install.available);
      } catch {}
    }
  };
  const install = {
    get available() {
      return !!deferred;
    },
    async prompt() {
      if (!deferred) return false;
      const event = deferred;
      deferred = null; // a prompt event can be used only once
      changed();
      try {
        await event.prompt();
        return (await event.userChoice)?.outcome === 'accepted';
      } catch {
        return false;
      }
    },
    onChange(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
  target?.addEventListener?.('beforeinstallprompt', event => {
    event.preventDefault();
    deferred = event;
    changed();
  });
  target?.addEventListener?.('appinstalled', () => {
    deferred = null;
    changed();
  });
  return install;
}

// --------------------------------------------------------------------------
// Boot: what runs before game.js, and the window.HIMAWARI_BOOT interface the
// game uses afterwards. `env` carries the page (see src/loader-main.js).

export function versionedURL(boot, path) {
  return boot.assetRoot + path + '?v=' + boot.files[path].sha256.slice(0, 12);
}

export function runtimeURL(boot, name) {
  return name + '?v=' + boot.runtime[name].sha256.slice(0, 12);
}

export function createBoot(boot, env) {
  const {
    local = false,
    supported = true,
    resolve = url => url,
    controlled = () => false,
    online = () => true,
    ui,
    injectScript,
    revealPage,
    markBooted = () => {},
    install = {available: false, prompt: async () => false, onChange: () => () => {}},
    setTimer = setTimeout,
    clearTimer = clearTimeout,
    revealFallbackMilliseconds = 20000,
    runtimeURLs = {},
    loaderOptions = {},
  } = env;
  const mode = boot.mode === 'complete' ? 'complete' : 'progressive';
  const assets = Object.keys(boot.files);
  const critical = boot.critical.filter(path => boot.files[path]);
  const background = assets.filter(path => !critical.includes(path));
  const runtimeNames = Object.keys(boot.runtime || {});
  const runtimeBytes = runtimeNames.reduce((n, name) => n + boot.runtime[name].bytes, 0);
  const runtimeProgress = Object.fromEntries(runtimeNames.map(name => [name, 0]));
  const runtimeVerified = new Set();
  const listeners = new Set();
  let revealed = false,
    booted = false,
    starting = null,
    notifyTimer = null,
    fallbackTimer = null;

  const loader = local
    ? null
    : createAssetLoader({
        files: boot.files,
        urlFor: path => resolve(versionedURL(boot, path)),
        retain: () => !controlled() || !loader.cacheWritable,
        trustCacheHeaders: mode === 'progressive',
        setTimer,
        clearTimer,
        ...loaderOptions,
      });

  // ---- the interface the game uses -------------------------------------
  function notify() {
    if (notifyTimer !== null) return;
    notifyTimer = setTimer(() => {
      notifyTimer = null;
      const state = api.progress();
      for (const fn of listeners) {
        try {
          fn(state);
        } catch {}
      }
    }, 150);
  }
  function reveal() {
    if (revealed) return;
    revealed = true;
    clearTimer(fallbackTimer);
    revealPage();
  }
  const api = {
    mode,
    assetURL(path) {
      if (local || !loader?.has(path)) return boot.assetRoot + path;
      // The service worker serves cached files by their versioned URL. Without
      // it (first visit, hard reload, no support), or for a file the cache
      // could not keep, use the verified copy in memory when there is one.
      if (controlled() && loader.stored(path)) return versionedURL(boot, path);
      return loader.objectURL(path) || versionedURL(boot, path);
    },
    prefetch(paths, {priority = 'high'} = {}) {
      if (!loader) return;
      for (const path of [].concat(paths || [])) if (loader.has(path)) loader.ensure(path, {priority});
    },
    ready(path) {
      if (local) return true;
      return !!loader?.ready(path);
    },
    whenReady(path, timeoutMs) {
      if (local) return Promise.resolve(true);
      if (!loader?.has(path)) return Promise.resolve(false);
      if (loader.ready(path)) return Promise.resolve(true);
      return new Promise(done => {
        let timer = null;
        const finish = value => {
          clearTimer(timer);
          done(value);
        };
        if (timeoutMs > 0) timer = setTimer(() => done(false), timeoutMs);
        loader.ensure(path, {priority: 'high'}).then(
          () => finish(true),
          () => finish(false),
        );
      });
    },
    progress() {
      if (local) {
        return {
          bytes: 0,
          total: 0,
          files: assets.length,
          fileCount: assets.length,
          complete: true,
          failed: 0,
          cacheWritable: false,
        };
      }
      const {bytes, total, files, fileCount, complete, failed, cacheWritable} = loader.progress();
      return {bytes, total, files, fileCount, complete, failed, cacheWritable};
    },
    onProgress(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    install,
    reveal,
  };
  loader?.onProgress(notify);

  // ---- the loading screen ----------------------------------------------
  function show(paths) {
    const state = loader.progress(paths);
    const runtimeDone = Object.values(runtimeProgress).reduce((n, v) => n + v, 0);
    ui.progress({bytes: state.bytes + runtimeDone, total: state.total + runtimeBytes});
  }

  async function verifyRuntime(name) {
    if (runtimeVerified.has(name)) return;
    // Check the very URL the page loads (style.css is already linked), so the
    // browser's cache answers instead of a second download.
    const entry = boot.runtime[name],
      url = resolve(runtimeURLs[name] || runtimeURL(boot, name));
    const options = {
      ...loaderOptions,
      setTimer,
      clearTimer,
      onBytes: count => {
        runtimeProgress[name] = Math.min(count, entry.bytes);
      },
    };
    try {
      try {
        await fetchVerified(url, entry, options);
      } catch (error) {
        if (error?.name === 'StallError') throw error;
        // A stale copy in the HTTP cache: ask the server again.
        await fetchVerified(url, entry, {...options, cache: 'reload'});
      }
    } catch (error) {
      runtimeProgress[name] = 0;
      throw error;
    }
    runtimeProgress[name] = entry.bytes;
    runtimeVerified.add(name);
  }

  async function startGame(url) {
    ui.status('loader.opening');
    await injectScript(url);
    booted = true;
    markBooted();
    // The game reveals itself with HIMAWARI_BOOT.reveal() once its title is
    // drawn. If it never does, do not leave the player on the loading screen.
    if (!revealed && revealFallbackMilliseconds > 0) fallbackTimer = setTimer(reveal, revealFallbackMilliseconds);
  }

  async function prepare() {
    ui.error(null);
    const wanted = mode === 'complete' ? [...critical, ...background] : critical;
    ui.status(mode === 'complete' ? 'loader.complete' : 'loader.critical');
    const update = () => show(wanted);
    const unsubscribe = loader.onProgress(update);
    update();
    // Queue the urgent files first; background work waits behind them.
    const pending = wanted.map(path => loader.ensure(path, {priority: 'high'}));
    if (mode === 'progressive') loader.prefetch(background, {priority: 'low'});
    const results = await Promise.allSettled([...pending, ...runtimeNames.map(verifyRuntime)]);
    unsubscribe();
    update();
    if (results.some(result => result.status === 'rejected')) {
      ui.error(online() ? 'loader.error' : 'loader.offline');
      return false;
    }
    if (!loader.cacheWritable) ui.notice?.('loader.noCache');
    return true;
  }

  async function begin() {
    if (local) {
      try {
        await startGame('game.js');
      } catch {
        ui.error('loader.error');
      }
      return;
    }
    if (!supported) {
      ui.error('loader.unsupported', {retry: false});
      return;
    }
    if (booted) return;
    if (!(await prepare())) return;
    try {
      await startGame(runtimeURL(boot, 'game.js'));
    } catch {
      ui.error(online() ? 'loader.error' : 'loader.offline');
      return;
    }
    if (mode === 'progressive') {
      // Background work stops when there is nowhere to keep it.
      const watch = () => {
        if (!loader.cacheWritable) loader.cancelLow();
      };
      loader.onProgress(watch);
      watch();
    }
    // Once everything is here, forget stale versions of this edition's files.
    let pruned = false;
    const prune = state => {
      if (pruned || !state.complete) return;
      pruned = true;
      loader.prune().catch(() => {});
    };
    loader.onProgress(prune);
    prune(loader.progress());
  }

  return {
    api,
    loader,
    get booted() {
      return booted;
    },
    // Start (or, after a failure, retry: finished files are kept).
    start() {
      if (starting) return starting;
      if (!local && !booted) loader?.retryFailed();
      starting = begin().finally(() => {
        starting = null;
      });
      return starting;
    },
    // The page is hidden or visible again: background downloads wait.
    visibility(hidden) {
      if (!loader) return;
      if (hidden) loader.pause();
      else loader.resume();
    },
    // Connectivity returned: try failed background files again.
    online() {
      if (booted) loader?.retryFailed();
    },
    controllerChanged() {
      loader?.releaseBlobs();
    },
  };
}
