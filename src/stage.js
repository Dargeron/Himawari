import {assetURL} from './assets.js';

// The picture behind everything. Two layers crossfade so a new scene never
// flashes black; each layer has a blurred fill that continues the picture
// wherever the drawing itself does not reach (phones, the map, look mode).
// Some pictures have a living light (content/scene-light.json): a lamp or
// fire that flickers, or sunlight with dust turning in it.
export function createStage(root, {whenReady = async () => true, reduced = () => false} = {}) {
  const layers = [...root.querySelectorAll('.stage-layer')];
  const motes = createMotes(root.querySelector('.stage-motes'), reduced);
  let front = 0,
    shown = '',
    request = 0;

  function place(layer, {focus, fit, light}) {
    const art = layer.querySelector('.stage-art');
    const x = Math.round((focus?.x ?? 0.5) * 100),
      y = Math.round((focus?.y ?? 0.5) * 100);
    art.style.objectPosition = `${x}% ${y}%`;
    art.style.transformOrigin = `${x}% ${y}%`;
    layer.dataset.fit = fit;
    layer.light = fit === 'fill' ? null : light || null;
    layer.focus = {x: x / 100, y: y / 100};
    layer.dataset.light = layer.light?.kind || '';
    aim(layer);
  }

  // Where the light source is on screen, through object-fit and the focus
  // offset; null until the picture has decoded.
  function lightPoint(layer) {
    const art = layer.querySelector('.stage-art');
    const {light, focus} = layer;
    if (!light || !art.naturalWidth) return null;
    const w = art.offsetWidth,
      h = art.offsetHeight;
    const contain = root.classList.contains('looking') || layer.dataset.fit === 'contain';
    const scale = (contain ? Math.min : Math.max)(w / art.naturalWidth, h / art.naturalHeight);
    const dw = art.naturalWidth * scale,
      dh = art.naturalHeight * scale;
    return {
      x: art.offsetLeft + (w - dw) * focus.x + light.x * dw,
      y: art.offsetTop + (h - dh) * focus.y + light.y * dh,
      size: Math.max(dw, dh),
    };
  }

  function aim(layer) {
    const point = lightPoint(layer);
    layer.classList.toggle('lit', Boolean(point));
    if (point) {
      layer.style.setProperty('--gx', point.x + 'px');
      layer.style.setProperty('--gy', point.y + 'px');
      layer.style.setProperty('--gs', point.size + 'px');
    }
    if (layer === layers[front]) motes.follow(layer.light?.kind === 'dust' ? point : null);
  }

  async function show(path, {focus, fit = 'cover', instant = false, light} = {}) {
    const mine = ++request;
    if (path === shown) {
      place(layers[front], {focus, fit, light});
      return;
    }
    shown = path;
    const next = layers[1 - front],
      art = next.querySelector('.stage-art'),
      fill = next.querySelector('.stage-fill');
    await whenReady(path, 4000);
    if (mine !== request) return;
    const url = assetURL(path);
    art.src = url;
    fill.style.backgroundImage = `url("${url}")`;
    place(next, {focus, fit, light});
    try {
      await Promise.race([art.decode(), new Promise(resolve => setTimeout(resolve, 1500))]);
    } catch {}
    if (mine !== request) return;
    next.classList.toggle('instant', instant);
    layers[front].classList.toggle('instant', instant);
    // Restart the slow drift (and the flame) on the incoming picture only.
    art.style.animation = 'none';
    void art.offsetWidth;
    art.style.animation = '';
    next.classList.add('visible');
    layers[front].classList.remove('visible');
    front = 1 - front;
    aim(next);
  }

  function look(on) {
    root.classList.toggle('looking', on);
    aim(layers[front]);
  }

  addEventListener('resize', () => aim(layers[front]));

  return {
    show,
    look,
    get current() {
      return shown;
    },
  };
}

// Dust in a sunbeam: a few dozen warm specks drifting around the light,
// glinting as they turn. Drawn at about 30 frames a second, only while a
// sunlit picture is showing, the page is visible and motion is allowed.
function createMotes(canvas, reduced) {
  if (!canvas) return {follow() {}};
  const count = 40;
  let ctx = null,
    sprite = null,
    point = null,
    specks = [],
    leaving = null,
    frame = 0,
    last = 0,
    ratio = 1;

  function speck(spread, born = performance.now()) {
    const angle = Math.random() * Math.PI * 2,
      reach = Math.sqrt(Math.random()) * spread;
    return {
      born,
      x: Math.cos(angle) * reach,
      y: Math.sin(angle) * reach * 0.8,
      vx: (Math.random() - 0.5) * 6,
      vy: -2 - Math.random() * 5,
      size: 1 + Math.random() * 2,
      phase: Math.random() * Math.PI * 2,
      spin: 0.6 + Math.random() * 1.6,
    };
  }

  function setup() {
    if (ctx) return true;
    ctx = canvas.getContext?.('2d') ?? null;
    if (!ctx) return false;
    sprite = document.createElement('canvas');
    sprite.width = sprite.height = 32;
    const s = sprite.getContext('2d'),
      g = s.createRadialGradient(16, 16, 0, 16, 16, 16);
    g.addColorStop(0, 'rgba(255, 246, 222, 1)');
    g.addColorStop(0.3, 'rgba(255, 232, 180, 0.7)');
    g.addColorStop(1, 'rgba(255, 210, 140, 0)');
    s.fillStyle = g;
    s.fillRect(0, 0, 32, 32);
    return true;
  }

  function size() {
    ratio = Math.min(1.5, devicePixelRatio || 1);
    canvas.width = Math.round(canvas.clientWidth * ratio);
    canvas.height = Math.round(canvas.clientHeight * ratio);
  }

  function tick(now) {
    frame = 0;
    if (!point || reduced()) return stop();
    frame = requestAnimationFrame(tick);
    if (now - last < 30) return;
    const dt = Math.min(0.1, (now - last) / 1000 || 0),
      t = now / 1000;
    last = now;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // The last picture's dust fades with it during the crossfade.
    if (leaving) {
      const left = 1 - (now - leaving.since) / 900;
      if (left <= 0) leaving = null;
      else draw(leaving.point, leaving.specks, t, dt, left, false);
    }
    draw(point, specks, t, dt, 1, true, now);
  }

  function draw(at, list, t, dt, fade, renew, now) {
    const spread = at.size * 0.22;
    for (let i = 0; i < list.length; i++) {
      const p = list[i];
      // A slow, wandering drift: mostly up and sideways, as warm air carries it.
      p.vx += (Math.sin(t * 0.7 + p.phase * 3) * 4 - p.vx * 0.3) * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      const far = Math.hypot(p.x, p.y / 0.8) / spread;
      if (far > 1) {
        if (renew) {
          // A new speck drifts in from below the light.
          list[i] = speck(spread, now);
          list[i].y = Math.abs(list[i].y) * 0.9;
        }
        continue;
      }
      const glint = 0.35 + 0.65 * Math.max(0, Math.sin(t * p.spin + p.phase)) ** 2;
      const grow = Math.min(1, (t * 1000 - p.born) / 1200);
      ctx.globalAlpha = Math.max(0, glint * (1 - far * far) * fade * grow);
      const r = p.size * ratio * 3;
      ctx.drawImage(sprite, (at.x + p.x) * ratio - r, (at.y + p.y) * ratio - r, r * 2, r * 2);
    }
  }

  function stop() {
    cancelAnimationFrame(frame);
    frame = 0;
    leaving = null;
    canvas.classList.remove('on');
  }

  // Called with the light's place on screen, or null when the picture has none.
  function follow(next) {
    const before = point,
      running = Boolean(frame);
    point = next;
    if (!next || reduced() || !setup()) return stop();
    if (!running) {
      size();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      specks = [];
    }
    // A different picture (or a resized screen): new dust, the old fading out.
    if (
      !specks.length ||
      !before ||
      Math.hypot(next.x - before.x, next.y - before.y) > 2 ||
      next.size !== before.size
    ) {
      if (running && specks.length) leaving = {point: before, specks, since: performance.now()};
      if (running) size();
      specks = Array.from({length: count}, () => speck(next.size * 0.22));
    }
    canvas.classList.add('on');
    if (!frame) {
      last = performance.now();
      frame = requestAnimationFrame(tick);
    }
  }

  return {follow};
}
