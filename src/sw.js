/* Himawari service worker (one per edition, scope ./). The build writes the
   name of the cache the loader fills (boot.cacheName) into CACHE below.

   - Versioned assets (/assets/...?v=<hash>): cache first. The loader stores
     each verified file under exactly this URL. Range requests from <audio>
     are answered from the cached file with 206 Partial Content, which Safari
     requires. A miss goes to the network.
   - The page, game.js, style.css, loader.js and the manifest: network first,
     so a new release arrives at once; the cached copy when offline.
   - Unversioned assets (fonts named in style.css, icons): any cached version
     of the file, else the network. The loader removes stale versions once a
     release is fully downloaded, so this serves the current one. */
const CACHE = '__CACHE__';
const SCOPE = new URL(self.registration.scope);
const SHELL = ['./', 'game.js', 'style.css', 'loader.js', 'manifest.webmanifest'];
const RUNTIME = /\/(?:index\.html|game\.js|style\.css|loader\.js|manifest\.webmanifest)?$/;

// The page and its scripts are stored by path, without ?v=, so the latest
// copy replaces the previous one.
function shellKey(url) {
  const key = new URL(url);
  key.search = '';
  key.hash = '';
  key.pathname = key.pathname.replace(/\/index\.html$/, '/');
  return key.href;
}

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      await Promise.allSettled(
        SHELL.map(async path => {
          const url = new URL(path, SCOPE).href;
          const response = await fetch(url, {cache: 'no-cache'});
          if (response.ok) await cache.put(shellKey(url), response);
        }),
      );
    })(),
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      for (const name of await caches.keys())
        if (name !== CACHE && name.startsWith('himawari')) await caches.delete(name);
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('fetch', event => {
  const {request} = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  const asset = url.pathname.includes('/assets/');
  if (asset && url.searchParams.has('v')) event.respondWith(versioned(event, request));
  else if (request.mode === 'navigate' || (url.href.startsWith(SCOPE.href) && RUNTIME.test(url.pathname)))
    event.respondWith(networkFirst(event, request));
  else if (asset) event.respondWith(anyVersion(request));
});

async function versioned(event, request) {
  const range = request.headers.get('range');
  let cache, cached;
  try {
    cache = await caches.open(CACHE);
    cached = await cache.match(request.url);
  } catch {} // storage unavailable: the network still works
  if (cached) return range ? partial(cached, range) : cached;
  const response = await fetch(request);
  // Keep complete pictures fetched before the loader got to them. Never keep
  // partial (206) answers; the loader writes audio once it is verified.
  const type = response.headers.get('content-type') || '';
  if (cache && !range && response.status === 200 && response.type === 'basic' && type.startsWith('image/'))
    event.waitUntil(cache.put(request.url, response.clone()).catch(() => {}));
  return response;
}

// One byte range of a cached file: "bytes=a-b", "bytes=a-" or "bytes=-n".
async function partial(response, header) {
  const blob = await response.blob();
  const size = blob.size;
  const type = response.headers.get('content-type') || blob.type;
  const match = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
  // Several ranges at once: answering with the whole file is allowed.
  if (!match) return new Response(blob, {status: 200, headers: {'Content-Type': type, 'Accept-Ranges': 'bytes'}});
  let start, end;
  if (match[1] === '') {
    const suffix = Number(match[2]);
    start = Math.max(0, size - suffix);
    end = size - 1;
  } else {
    start = Number(match[1]);
    end = match[2] === '' ? size - 1 : Math.min(Number(match[2]), size - 1);
  }
  if (!(start <= end) || start >= size)
    return new Response(null, {
      status: 416,
      statusText: 'Range Not Satisfiable',
      headers: {'Content-Range': `bytes */${size}`},
    });
  return new Response(blob.slice(start, end + 1, type), {
    status: 206,
    statusText: 'Partial Content',
    headers: {
      'Content-Type': type,
      'Content-Length': String(end - start + 1),
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Accept-Ranges': 'bytes',
    },
  });
}

async function networkFirst(event, request) {
  const cache = await caches.open(CACHE).catch(() => null);
  const key = shellKey(request.url);
  try {
    const response = await fetch(request);
    // A redirected answer cannot be replayed for a navigation; skip those.
    if (cache && response.status === 200 && response.type === 'basic' && !response.redirected)
      event.waitUntil(cache.put(key, response.clone()).catch(() => {}));
    return response;
  } catch (error) {
    const cached =
      cache &&
      ((await cache.match(key)) || (request.mode === 'navigate' ? await cache.match(new URL('./', SCOPE).href) : null));
    if (cached) return cached;
    throw error;
  }
}

async function anyVersion(request) {
  let cached;
  try {
    cached = await (await caches.open(CACHE)).match(request.url, {ignoreSearch: true});
  } catch {}
  return cached || fetch(request);
}
