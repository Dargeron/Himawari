/* Download the complete edition before starting its unchanged game runtime. */
export function createAssetLoader({
  manifest,
  baseURL,
  fetcher = fetch,
  openCache,
  createURL = blob => URL.createObjectURL(blob),
  digest = async bytes => {
    const hash = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(hash), b => b.toString(16).padStart(2, '0')).join('');
  },
  onProgress = () => {},
  concurrency = 3,
  stallMilliseconds = 90000,
}) {
  const entries = Object.entries(manifest).sort(
    ([a], [b]) => Number(!a.endsWith('.webp')) - Number(!b.endsWith('.webp')) || a.localeCompare(b),
  );
  const total = entries.reduce((n, [, e]) => n + e.bytes, 0),
    urls = new Map(),
    done = new Set(),
    partial = new Map();
  let cache,
    cacheOpened = false,
    cacheWritable = true,
    running = false,
    fromCache = 0;
  function progress() {
    onProgress({
      bytes: entries.reduce(
        (n, [path, e]) => n + (done.has(path) ? e.bytes : Math.min(e.bytes, partial.get(path) || 0)),
        0,
      ),
      total,
      files: done.size,
      fileCount: entries.length,
      fromCache,
      cacheWritable,
      artworkReady: entries.filter(([p]) => p.endsWith('.webp')).every(([p]) => done.has(p)),
    });
  }
  function key(path, entry) {
    const url = new URL(path, baseURL);
    url.searchParams.set('v', entry.sha256);
    return url.href;
  }
  function mime(path) {
    return path.endsWith('.webp')
      ? 'image/webp'
      : path.endsWith('.mp3')
        ? 'audio/mpeg'
        : path.endsWith('.m4a')
          ? 'audio/mp4'
          : path.endsWith('.css')
            ? 'text/css'
            : 'text/javascript';
  }
  async function read(response, path, entry, controller) {
    if (!response.ok) throw new Error('HTTP ' + response.status);
    let bytes;
    if (response.body?.getReader) {
      const reader = response.body.getReader(),
        chunks = [];
      let count = 0,
        timer;
      function arm() {
        clearTimeout(timer);
        timer = setTimeout(() => controller.abort(), stallMilliseconds);
      }
      try {
        arm();
        while (true) {
          const result = await reader.read();
          if (result.done) break;
          chunks.push(result.value);
          count += result.value.byteLength;
          partial.set(path, count);
          progress();
          arm();
        }
        bytes = new Uint8Array(count);
        let offset = 0;
        for (const chunk of chunks) {
          bytes.set(chunk, offset);
          offset += chunk.byteLength;
        }
      } finally {
        clearTimeout(timer);
        reader.releaseLock();
      }
    } else {
      bytes = new Uint8Array(await response.arrayBuffer());
      partial.set(path, bytes.byteLength);
      progress();
    }
    if (bytes.byteLength !== entry.bytes || (await digest(bytes)) !== entry.sha256)
      throw new Error('Incomplete or outdated download');
    return new Blob([bytes], {type: mime(path)});
  }
  async function load(path, entry) {
    const url = key(path, entry);
    let response,
      blob,
      cached = false;
    if (cache) {
      try {
        response = await cache.match(url);
      } catch {
        cacheWritable = false;
      }
    }
    if (response) {
      try {
        blob = await read(response, path, entry, new AbortController());
        cached = true;
      } catch {
        partial.delete(path);
        try {
          await cache.delete(url);
        } catch {
          cacheWritable = false;
        }
      }
    }
    if (!blob) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), stallMilliseconds);
      try {
        response = await fetcher(url, {signal: controller.signal, cache: 'no-cache'});
        clearTimeout(timer);
        blob = await read(response, path, entry, controller);
      } finally {
        clearTimeout(timer);
      }
      if (cache && cacheWritable) {
        try {
          await cache.put(url, new Response(blob, {headers: {'Content-Type': mime(path)}}));
        } catch {
          cacheWritable = false;
        }
      }
    }
    urls.set(path, createURL(blob));
    done.add(path);
    partial.delete(path);
    if (cached) fromCache++;
    progress();
  }
  async function run() {
    if (running) return;
    running = true;
    try {
      if (!cacheOpened) {
        cacheOpened = true;
        try {
          cache = await openCache?.();
          if (!cache) cacheWritable = false;
        } catch {
          cacheWritable = false;
        }
      }
      let cursor = 0;
      const failures = [];
      progress();
      async function worker() {
        while (cursor < entries.length) {
          const [path, entry] = entries[cursor++];
          if (done.has(path)) continue;
          try {
            await load(path, entry);
          } catch (error) {
            partial.delete(path);
            failures.push({path, message: error.name === 'AbortError' ? 'Connection stalled' : error.message});
            progress();
          }
        }
      }
      await Promise.all(Array.from({length: Math.min(concurrency, entries.length)}, worker));
      return {complete: done.size === entries.length, failures, urls, fromCache, cacheWritable};
    } finally {
      running = false;
    }
  }
  return {run, asset: path => urls.get(path) || path, urls, total};
}

export async function bootPreloader(manifest) {
  const loading = document.getElementById('game-loading'),
    app = document.getElementById('app');
  const stage = document.getElementById('loading-stage'),
    progress = document.getElementById('loading-progress'),
    amount = document.getElementById('loading-amount'),
    retry = document.getElementById('loading-retry');
  const chinese = document.documentElement.lang.startsWith('zh');
  const labels = chinese
    ? {
        art: '正在下载原画……',
        audio: '原画已就绪。正在下载旁白和音乐……',
        ready: '正在打开游戏……',
        error: '有些文件未下载完整。请重试；已下载完成的文件会保留。',
        saved: '此浏览器无法保留完整的下载缓存，下次访问可能需要重新下载。',
        unsupported: '此浏览器无法下载完整游戏。请换用较新的浏览器。',
      }
    : {
        art: 'Downloading the artwork…',
        audio: 'Artwork ready. Downloading narration and music…',
        ready: 'Opening the game…',
        error: 'Some files did not finish downloading. Please retry; completed files are kept.',
        saved: 'This browser could not keep the complete download cache. A future visit may need to download again.',
        unsupported: 'This browser cannot download the complete game. Please use a newer browser.',
      };
  function reveal() {
    loading.hidden = true;
    app.inert = false;
    app.hidden = false;
  }
  function script(url) {
    return new Promise((resolve, reject) => {
      const element = document.createElement('script');
      element.src = url;
      element.onload = resolve;
      element.onerror = () => {
        element.remove();
        reject(new Error('Runtime did not load'));
      };
      document.body.append(element);
    });
  }
  // Local folders already contain the entire game. Browsers block local fetch,
  // so they use disk paths; the portable edition bypasses this loader too.
  if (location.protocol === 'file:') {
    try {
      await script('game.js');
      reveal();
    } catch {
      stage.textContent = labels.error;
      retry.hidden = false;
    }
    return;
  }
  if (!window.fetch || !window.Blob || !window.URL?.createObjectURL || !window.crypto?.subtle) {
    stage.textContent = labels.unsupported;
    retry.hidden = false;
    return;
  }
  let lastPercentage = -1,
    lastStage = '',
    previewShown = false;
  const loader = createAssetLoader({
    manifest,
    baseURL: document.baseURI,
    openCache: () => window.caches?.open('himawari-complete-assets-v1'),
    onProgress: state => {
      const percent = Math.floor((state.bytes / state.total) * 100);
      progress.value = percent;
      amount.textContent =
        (state.bytes / 1e6).toFixed(1) + ' / ' + (state.total / 1e6).toFixed(1) + ' MB · ' + percent + '%';
      const text = state.artworkReady ? labels.audio : labels.art;
      if (text !== lastStage) {
        stage.textContent = text;
        lastStage = text;
      }
      if (percent !== lastPercentage) {
        progress.setAttribute('aria-valuetext', percent + '%');
        lastPercentage = percent;
      }
      if (!previewShown && loader?.urls.has('assets/art/original/mapa_joc.webp')) {
        previewShown = true;
        const preview = document.getElementById('loading-preview');
        preview.src = loader.asset('assets/art/original/mapa_joc.webp');
        preview.hidden = false;
      }
    },
  });
  async function start() {
    retry.hidden = true;
    loading.removeAttribute('data-error');
    try {
      const result = await loader.run();
      if (!result) return;
      if (!result.complete) {
        loading.dataset.error = 'true';
        stage.textContent = labels.error;
        retry.hidden = false;
        retry.focus();
        return;
      }
      stage.textContent = labels.ready;
      progress.value = 100;
      window.HIMAWARI_ASSET = path => loader.asset(path);
      await new Promise((resolve, reject) => {
        const style = document.getElementById('game-style');
        style.onload = resolve;
        style.onerror = () => reject(new Error('Styles did not load'));
        style.href = loader.asset('style.css');
      });
      await script(loader.asset('game.js'));
      reveal();
      if (!result.cacheWritable) {
        const note = document.createElement('p');
        note.className = 'cover-note';
        note.textContent = labels.saved;
        document.querySelector('.cover-content').append(note);
      }
    } catch {
      loading.dataset.error = 'true';
      stage.textContent = labels.error;
      retry.hidden = false;
      retry.focus();
    }
  }
  retry.onclick = start;
  await start();
}
