import {assetURL} from './assets.js';

// The picture behind everything. Two layers crossfade so a new scene never
// flashes black; each layer has a blurred fill that continues the picture
// wherever the drawing itself does not reach (phones, the map, look mode).
export function createStage(root, {whenReady = async () => true} = {}) {
  const layers = [...root.querySelectorAll('.stage-layer')];
  let front = 0,
    shown = '',
    request = 0;

  function place(layer, {focus, fit}) {
    const art = layer.querySelector('.stage-art');
    const x = Math.round((focus?.x ?? 0.5) * 100),
      y = Math.round((focus?.y ?? 0.5) * 100);
    art.style.objectPosition = `${x}% ${y}%`;
    art.style.transformOrigin = `${x}% ${y}%`;
    layer.dataset.fit = fit;
  }

  async function show(path, {focus, fit = 'cover', instant = false} = {}) {
    const mine = ++request;
    if (path === shown) {
      place(layers[front], {focus, fit});
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
    place(next, {focus, fit});
    try {
      await Promise.race([art.decode(), new Promise(resolve => setTimeout(resolve, 1500))]);
    } catch {}
    if (mine !== request) return;
    next.classList.toggle('instant', instant);
    layers[front].classList.toggle('instant', instant);
    // Restart the slow drift on the incoming picture only.
    art.style.animation = 'none';
    void art.offsetWidth;
    art.style.animation = '';
    next.classList.add('visible');
    layers[front].classList.remove('visible');
    front = 1 - front;
  }

  function look(on) {
    root.classList.toggle('looking', on);
  }

  return {show, look, get current() {
    return shown;
  }};
}
