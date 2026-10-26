import {L, t} from '../i18n.js';
import {assetURL} from '../assets.js';

// Settings, credits and the new-game confirmation. Every control is a real
// form control; each change goes through api.onSetting, which stores and
// applies it.
export function createSettings(ctx) {
  const {$, api, root} = ctx;
  const view = $('nb-settings');
  const controls = [...view.querySelectorAll('[data-setting]')];

  function fill(range) {
    const min = Number(range.min),
      max = Number(range.max);
    range.style.setProperty('--fill', ((Number(range.value) - min) / (max - min)) * 100 + '%');
  }

  function changed(key, value) {
    api.onSetting(key, value);
    ctx.settingsChanged(key);
  }

  for (const input of controls) {
    const key = input.dataset.setting;
    if (input.type === 'checkbox') input.addEventListener('change', () => changed(key, input.checked));
    else if (input.type === 'range')
      input.addEventListener('input', () => {
        fill(input);
        changed(key, Number(input.value));
      });
    else if (input.type === 'radio')
      input.addEventListener('change', () => {
        if (input.checked) changed(key, key === 'voiceRate' ? Number(input.value) : input.value);
      });
  }

  // --- Buttons ---------------------------------------------------------------

  const fullscreen = $('nb-fullscreen');
  const syncFullscreen = () => {
    fullscreen.hidden = !api.fullscreen?.available;
    fullscreen.textContent = document.fullscreenElement ? t('nb.settings.leaveFullscreen') : t('title.fullscreen');
  };
  fullscreen.addEventListener('click', () => api.fullscreen?.toggle());
  document.addEventListener('fullscreenchange', syncFullscreen);

  const install = $('nb-install');
  const syncInstall = () => (install.hidden = !api.install?.available);
  install.addEventListener('click', async () => {
    await api.install?.prompt?.();
    syncInstall();
  });
  api.install?.onChange?.(syncInstall);

  const language = $('nb-language');
  if (api.language) {
    language.href = api.language.href;
    language.textContent = api.language.label;
    language.lang = language.hreflang = api.language.code;
  }
  language.addEventListener('click', () => {
    try {
      localStorage.setItem('himawari-language', api.language?.code || t('other.code'));
    } catch {}
  });

  $('nb-export').addEventListener('click', () => api.exportSave());
  $('nb-restart-export').addEventListener('click', () => api.exportSave());
  const file = $('nb-import-file');
  $('nb-import').addEventListener('click', () => file.click());
  file.addEventListener('change', async () => {
    const chosen = file.files?.[0];
    if (chosen) await api.importSave(chosen);
    file.value = '';
  });
  $('nb-to-title').addEventListener('click', () => api.toTitle?.());
  $('nb-new-game').addEventListener('click', () => ctx.show('restart', undefined, {focus: true}));
  $('nb-open-credits').addEventListener('click', () => ctx.show('credits', undefined, {focus: true}));
  for (const back of root.querySelectorAll('[data-back]'))
    back.addEventListener('click', () => {
      ctx.show('settings', undefined);
      $('nb-open-credits').focus({preventScroll: true});
    });
  $('nb-restart-confirm').addEventListener('click', () => api.restart());
  $('nb-restart-keep').addEventListener('click', () => ctx.close());

  function render() {
    const s = api.settings;
    for (const input of controls) {
      const value = s[input.dataset.setting];
      if (input.type === 'checkbox') input.checked = !!value;
      else if (input.type === 'range') {
        input.value = String(value);
        fill(input);
      } else if (input.type === 'radio') input.checked = String(value) === input.value || Number(input.value) === value;
    }
    $('nb-narration-label').textContent = t('nb.settings.narration', {name: L.narrator});
    syncFullscreen();
    syncInstall();
    $('nb-to-title').hidden = !(api.isActive() && api.toTitle);
    $('nb-export').disabled = !api.isActive() && !api.hasSave();
  }

  return {
    settings: {render},
    credits: {
      render() {
        const flower = $('nb-credits-flower');
        if (!flower.getAttribute('src')) flower.src = assetURL('assets/art/original/hima3.webp');
      },
      focusTarget: () => root.querySelector('#nb-credits [data-back]'),
    },
    restart: {
      render() {
        $('nb-restart-export').hidden = !api.isActive() && !api.hasSave();
      },
      focusTarget: () => $('nb-restart-keep'),
    },
  };
}
