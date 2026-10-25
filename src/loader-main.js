// DEV STUB — replaced by the loader agent's implementation. Not committed.
import {boot} from './generated/boot.js';
window.HIMAWARI_BOOT = {
  mode: boot.mode,
  assetURL: p => boot.assetRoot + p + (boot.files[p] ? '?v=' + boot.files[p].sha256.slice(0, 12) : ''),
  prefetch() {},
  whenReady: async () => true,
  ready: () => true,
  reveal() {
    document.getElementById('loader').hidden = true;
  },
};
const script = document.createElement('script');
script.src = 'game.js';
document.body.append(script);
