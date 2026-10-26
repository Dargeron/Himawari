import {L, t} from './i18n.js';
import {createEngine} from './engine.js';
import {createAudio} from './audio.js';
import {createGuide, guideDay} from './guide.js';
import {createJournal, journalText, endingArt} from './journal.js';
import {illustrationKey, sceneArtPath} from './scenes.js';
import {applySettings, loadSettings, storeSettings, textSpeeds} from './settings.js';
import {createStage} from './stage.js';
import {createTypewriter} from './typewriter.js';
import {createInkbox, answerForm, choiceList, continueButton} from './inkbox.js';
import {createHud, tally} from './hud.js';
import {createMap} from './map.js';
import {createTitle} from './title.js';
import {createNotebook} from './notebook/index.js';
import {createPrefetch} from './prefetch.js';
import {isNative, onBack, onLifecycle, shareFile} from './native.js';
import {
  advanceAction,
  continuation,
  displayLoop,
  flowerFor,
  isNight,
  musicFor,
  passageKey,
  phaseName,
  visibleOptions,
} from './screens.js';

const $ = id => document.getElementById(id);
const COVER_ART = 'assets/art/scenes/2464.webp';

// The game: one stage, one ink box, one notebook. Everything here only
// presents snapshots and forwards the player's actions to the recovered rules.
export function startGame(boot = {}) {
  const settings = loadSettings();
  applySettings(settings);

  let engine = createEngine(),
    guide = createGuide(),
    journal = null,
    history = [],
    saved = null,
    active = false,
    current = engine.snapshot(),
    previous = null,
    freshStart = true,
    lastSignature = '',
    lastSave = null,
    read = false,
    pendingNarration = null,
    narrating = false,
    skipping = false,
    holdingSkip = false,
    looking = false,
    autoTimer = 0,
    skipTimer = 0,
    toastTimer = 0;

  try {
    saved = JSON.parse(localStorage.getItem(L.saveKey) || 'null');
  } catch {}
  journal = createJournal(saved?.journal);
  journal.recoverHistory(saved?.history);

  const typewriter = createTypewriter({settings});
  const audio = createAudio(settings, onVoice);
  const stage = createStage($('stage'), {whenReady: (path, ms) => boot.whenReady?.(path, ms) ?? Promise.resolve(true)});
  const inkbox = createInkbox($('inkbox'), {typewriter, settings});
  const hud = createHud($('hud'), {card: $('card'), settings});
  const prefetch = createPrefetch(boot);
  const map = createMap($('map'), {
    onGo: id => act('go', id),
    onPin: id => {
      journal.togglePin(id);
      saveNotebook();
      showMapScreen(current);
    },
  });
  const notebook = createNotebook($('notebook'), {
    getCurrent: () => current,
    getJournal: () => journal,
    getGuide: () => (active ? guide : createGuide(saved?.guide)),
    getHistory: () => history,
    isActive: () => active,
    hasSave: () => !!saved,
    getSaved: () => saved,
    settings,
    onSetting: changeSetting,
    saveNotebook,
    exportSave,
    importSave,
    restart: begin,
    toTitle: () => {
      notebook.close();
      showTitle();
    },
    requestClue: () => {
      guide.requestClue(current);
      save();
    },
    clearUnread: () => {
      journal.clearUnread();
      hud.setBadge(0);
      saveNotebook();
    },
    mainAudio: audio,
    createAudio,
    fullscreen: {available: !!document.fullscreenEnabled && !isNative(), toggle: toggleFullscreen},
    install: boot.install,
    language: {label: t('other.label'), href: '../' + t('other.route') + '/index.html', code: t('other.code')},
    onOpen: () => {
      clearTimeout(autoTimer);
      audio.hold();
    },
    onClose: () => {
      audio.duck(false);
      if (!document.hidden) audio.release();
      hud.setBadge(journal.cover().unread);
      if (active) refreshResponses();
      else updateTitle();
    },
  });
  const title = createTitle($('title'), {
    onContinue: resume,
    onBegin: () => (saved ? confirmRestart() : begin()),
    onNotebook: (tab, arg) => notebook.open(tab || 'diary', arg),
    onFullscreen: toggleFullscreen,
    onLanguage: rememberLanguage,
    install: boot.install,
  });

  // --- Voice ----------------------------------------------------------------

  function onVoice(status) {
    typewriter.status(status);
    const toggle = $('voice-toggle'),
      label = status.playing ? t('voice.pause') : status.completed ? t('voice.play') : t('voice.resume');
    toggle.disabled = !status.available;
    $('voice-replay').disabled = !status.available;
    toggle.setAttribute('aria-label', label);
    toggle.title = label;
    toggle.querySelector('path').setAttribute('d', status.playing ? 'M8 5h3v14H8zm5 0h3v14h-3z' : 'M8 5v14l11-7z');
    $('voice-status').textContent = status.blocked
      ? t('voice.blocked', {name: L.narrator})
      : status.loading
        ? t('voice.loading', {name: L.narrator})
        : status.playing
          ? t('voice.narrating', {name: L.narrator})
          : !status.enabled
            ? t('voice.off')
            : status.paused
              ? t('voice.paused', {name: L.narrator})
              : L.narrator;
    $('voice-fill').style.width = (status.completed && status.available ? 100 : status.progress * 100) + '%';
    if (narrating && status.completed && !status.playing) {
      narrating = false;
      scheduleAuto(900);
    }
  }

  function startNarration(s) {
    pendingNarration = null;
    if (!active || s !== current) return;
    const speak = settings.narrationEnabled && (!read || settings.narrateRead) && !skipping;
    narrating = speak;
    audio.read(s.screen.parts, {autoplay: speak});
    if (!speak) inkbox.whenWritten(() => scheduleAuto(readingTime(s.screen.text)));
  }

  function readingTime(text) {
    const perChar = L.code === 'zh-CN' ? 160 : 55;
    return Math.min(14000, 1400 + Array.from(text || '').length * perChar);
  }

  // --- Rendering --------------------------------------------------------------

  function render(s, {narrate = true, record = true, discoveries = true, transition = null} = {}) {
    clearTimeout(autoTimer);
    clearTimeout(skipTimer);
    narrating = false;
    audio.stop();
    const priorFacts = new Set(guide.summary(s).facts.map(f => f.id));
    read = s.screen.kind !== 'map' && !s.screen.finished && journal.seen(s.screen.parts);
    previous = freshStart ? null : current;
    freshStart = false;
    current = s;
    guide.observe(s);
    journal.observe(s);
    if (discoveries) {
      const fresh = guide
        .summary(s)
        .facts.filter(f => !priorFacts.has(f.id))
        .map(f => f.id);
      if (fresh.length) {
        journal.markDiscoveries(fresh);
        hud.notice(t(fresh.length === 1 ? 'notice.finding' : 'notice.findings'), () => notebook.open('diary'));
      }
    }
    hud.setBadge(journal.cover().unread);
    hud.update(s);
    const signature = passageKey(s);
    if (record && s.screen.text.trim() && signature !== lastSignature) {
      history.push({
        text: s.screen.text,
        location: s.screen.kind === 'intro' ? L.destinations[1].name : placeName(s),
        loop: displayLoop(s),
        phase: isNight(s) ? 'Night' : s.state.phase,
      });
      history = history.slice(-120);
    }
    lastSignature = signature;
    const freshSegment =
      !previous || previous.screen.kind === 'map' || isNight(previous) !== isNight(s) || transition === 'loop';
    if (s.screen.kind === 'map') showMapScreen(s);
    else showStoryScreen(s, freshSegment);
    audio.music(musicFor(s));
    if (active) {
      save();
      prefetch.current(s);
      if (lastSave) prefetch.ahead(s, lastSave.engine);
    }
    const playCard = transition && !skipping && !settings.reducedMotion;
    const proceed = () => {
      if (!narrate) return;
      if (document.hidden) pendingNarration = s;
      else startNarration(s);
      maybeSkip();
    };
    if (playCard) hud.showCard(cardFor(s, transition)).then(proceed);
    else proceed();
  }

  function placeName(s) {
    return L.destinations[s.state.place]?.name || L.destinations[1].name;
  }

  function cardFor(s, transition) {
    if (transition === 'loop')
      return {
        flowerPath: 'assets/art/original/hima1.webp',
        title: t('card.loop', {n: displayLoop(s)}),
        sub: tally(displayLoop(s)),
        rewind: true,
        duration: 2400,
      };
    if (transition === 'night') return {flowerPath: 'assets/art/original/hima5.webp', title: L.phases.Night};
    return {flowerPath: flowerFor(s), title: phaseName(s)};
  }

  function showStoryScreen(s, freshSegment) {
    const {screen} = s;
    map.hide();
    const box = $('inkbox');
    box.dataset.mode = 'story';
    $('game').dataset.screen = 'story';
    const key = illustrationKey(s),
      focus = L.focus?.[key],
      art = sceneArtPath(s);
    box.dataset.side = focus?.box === 'right' ? 'right' : 'left';
    stage.show(art, {focus, fit: art.startsWith('assets/art/original/') ? 'contain' : 'cover'});
    if (freshSegment) inkbox.clear();
    const text = screen.finished ? t('ink.gameOver') : screen.text;
    const speaks = settings.narrationEnabled && (!read || settings.narrateRead) && !skipping;
    inkbox.passage(text, {
      parts: screen.parts,
      instant: skipping || (read && !speaks) || settings.textSpeed === 'instant',
      speed: textSpeeds[settings.textSpeed],
      kind: isNight(s) ? 'night' : screen.kind,
      read,
    });
    $('sr-story').textContent = text;
    refreshResponses();
    $('read-mark').hidden = !read;
    $('ink-scroll').focus({preventScroll: true});
  }

  function refreshResponses() {
    const s = current,
      {screen} = s;
    if (screen.kind === 'map') return showMapScreen(s);
    const nodes = [];
    if (screen.finished) nodes.push(continueButton(showTitle, t('ink.toTitle')));
    else if (screen.kind === 'intro') nodes.push(continueButton(() => act('next')));
    else if (screen.needsContinue) nodes.push(continueButton(() => act('continue')));
    else if (!screen.input && continuation(screen)) {
      const option = continuation(screen);
      nodes.push(continueButton(() => act('choice', option.choice)));
    } else if (screen.input) {
      nodes.push(
        answerForm(value => {
          if (!String(value).trim()) return;
          inkbox.note(value);
          act('input', value);
        }),
      );
    } else {
      nodes.push(choiceList(visibleOptions(screen), {onChoose: choose, echo: option => memoryOf(s, option)}));
    }
    inkbox.respond(nodes);
    $('skip-button').hidden = !(read && advanceAction(s));
    $('key-hint').textContent = screen.finished
      ? ''
      : screen.input
        ? t('hint.type')
        : advanceAction(s)
          ? t('hint.continue')
          : t('hint.choose');
  }

  function showMapScreen(s) {
    const box = $('inkbox');
    box.dataset.mode = 'map';
    $('game').dataset.screen = 'map';
    box.dataset.side = 'right';
    stage.show('assets/art/original/mapa_joc.webp', {fit: 'fill'});
    map.show(s, journal.map(guideDay(s)));
    inkbox.clear();
    inkbox.passage(t('map.prompt'), {instant: true, kind: 'map'});
    inkbox.respond(map.placeList());
    $('read-mark').hidden = true;
    $('skip-button').hidden = true;
    $('key-hint').textContent = t('hint.places');
    $('sr-story').textContent = t('map.prompt');
  }

  function memoryOf(s, option) {
    const memory = journal.echo(s, option.choice);
    if (!memory) return null;
    let outcome = journalText(memory.outcome).trim() || (memory.map ? t('ink.backToMap') : '');
    if (Array.from(outcome).length > 220) outcome = Array.from(outcome).slice(0, 210).join('').trimEnd() + '…';
    const items = [
      memory.gained.length ? t('ink.received', {items: memory.gained.map(i => L.items[i]).join(', ')}) : '',
      memory.lost.length ? t('ink.lost', {items: memory.lost.map(i => L.items[i]).join(', ')}) : '',
    ]
      .filter(Boolean)
      .join(' ');
    return {loop: memory.loop, outcome, items};
  }

  // --- Actions ----------------------------------------------------------------

  function choose(option) {
    inkbox.note(option.text);
    act('choice', option.choice);
  }

  function act(kind, value) {
    if (!active || hud.carding) return;
    try {
      const before = current,
        after = engine.action(kind, value);
      journal.recordAction(before, kind, value, after);
      audio.sound();
      const reset = isNight(before) && !isNight(after) && guideDay(after) > guideDay(before) && !after.screen.finished;
      const nightfall = !isNight(before) && isNight(after);
      const turn = !reset && !nightfall && after.state.t !== before.state.t && after.screen.kind === 'map';
      render(after, {transition: reset ? 'loop' : nightfall ? 'night' : turn ? 'phase' : null});
      for (const item of after.inventory.filter(i => !before.inventory.includes(i)))
        hud.notice(t('notice.item', {item: L.items[item]}), () => notebook.open('pocket'));
    } catch (error) {
      toast(error.message);
    }
  }

  // One gesture moves the story on: finish the writing, then continue.
  function advance() {
    if (hud.carding) return hud.finishCard();
    if (inkbox.writing) return inkbox.showAll();
    if (current.screen.finished) return showTitle();
    const action = advanceAction(current);
    if (action) act(...action);
  }

  function scheduleAuto(delay) {
    clearTimeout(autoTimer);
    if (!settings.autoContinue || skipping || !active) return;
    const s = current;
    if (!advanceAction(s)) return;
    autoTimer = setTimeout(() => {
      if (s !== current || notebook.isOpen() || looking || inkbox.writing || hud.carding) return;
      const action = advanceAction(s);
      if (action) act(...action);
    }, delay);
  }

  // Skipping races through passages already read, stopping at anything new,
  // any decision, the map and typed answers. It never chooses for the player.
  function maybeSkip() {
    clearTimeout(skipTimer);
    if (!skipping && !holdingSkip) return;
    const action = advanceAction(current);
    if (!read || !action) return setSkipping(false);
    skipTimer = setTimeout(() => {
      if ((skipping || holdingSkip) && !notebook.isOpen()) act(...action);
    }, 140);
  }

  function setSkipping(on) {
    skipping = on;
    if (!on) holdingSkip = false;
    $('skip-button').setAttribute('aria-pressed', String(on));
    if (on) {
      if (inkbox.writing) inkbox.showAll();
      audio.stop();
      maybeSkip();
    }
  }

  function setLooking(on) {
    looking = on;
    $('game').classList.toggle('looking', on);
    stage.look(on);
    $('look-button').setAttribute('aria-pressed', String(on));
  }

  // --- Sessions ---------------------------------------------------------------

  function save() {
    const payload = {
      edition: 1,
      engine: engine.exportSave(),
      guide: guide.exportSave(),
      journal: journal.exportSave(),
      history: history.slice(-120),
      savedAt: new Date().toISOString(),
    };
    saved = lastSave = payload;
    try {
      localStorage.setItem(L.saveKey, JSON.stringify(payload));
    } catch {
      toast(t('save.full'));
    }
    return payload;
  }

  function saveNotebook() {
    if (active) return save();
    if (saved) {
      saved = {...saved, journal: journal.exportSave()};
      try {
        localStorage.setItem(L.saveKey, JSON.stringify(saved));
      } catch {
        toast(t('save.notes'));
      }
    }
    updateTitle();
    return saved;
  }

  function enterGame() {
    active = true;
    freshStart = true;
    lastSignature = '';
    setSkipping(false);
    setLooking(false);
    notebook.close();
    title.hide();
    $('game').hidden = false;
    audio.resume();
  }

  function begin() {
    pendingNarration = null;
    engine = createEngine();
    guide = createGuide();
    journal = createJournal();
    history = [];
    enterGame();
    render(engine.snapshot(), {discoveries: false});
  }

  function confirmRestart() {
    notebook.open('restart');
  }

  function resume() {
    if (!saved) return;
    try {
      const next = createEngine();
      next.importSave(saved.engine);
      engine = next;
      history = Array.isArray(saved.history)
        ? saved.history
            .filter(
              h =>
                typeof h?.text === 'string' &&
                typeof h?.location === 'string' &&
                typeof h?.phase === 'string' &&
                Number.isInteger(h?.loop),
            )
            .slice(-120)
        : [];
      guide = createGuide(saved.guide);
      if (saved.guide?.version !== 1) guide.recoverHistory(history);
      journal = createJournal(saved.journal);
      journal.recoverHistory(history);
      enterGame();
      render(engine.snapshot(), {record: false, discoveries: false});
    } catch {
      toast(t('save.unreadable'));
    }
  }

  function showTitle() {
    clearTimeout(autoTimer);
    clearTimeout(skipTimer);
    hud.finishCard();
    pendingNarration = null;
    if (active) save();
    active = false;
    setSkipping(false);
    setLooking(false);
    typewriter.stop();
    audio.stop();
    audio.music(0);
    map.hide();
    $('game').hidden = true;
    stage.show(COVER_ART, {focus: L.focus?.['2464']});
    updateTitle();
    title.show();
  }

  function updateTitle() {
    const photos = journal.album().map(e => ({number: e.number, name: e.name, art: endingArt[e.number]}));
    title.update({hasSave: !!saved, hasNotebook: !!saved, photos});
  }

  function exportSave() {
    if (!saved && !active) return toast(t('save.beginFirst'));
    const data = JSON.stringify(active ? save() : saved);
    const name = L.code === 'en' ? 'Himawari-save.json' : 'Himawari-' + L.code + '-save.json';
    if (isNative()) {
      shareFile(name, data).then(ok => toast(t(ok ? 'save.exported' : 'save.shareFailed')));
      return;
    }
    const url = URL.createObjectURL(new Blob([data], {type: 'application/json'})),
      a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast(t('save.exported'));
  }

  async function importSave(file) {
    try {
      if (!file || file.size > 8000000) throw new Error('Invalid save');
      const payload = JSON.parse(await file.text());
      createEngine().importSave(payload.engine);
      saved = payload;
      try {
        localStorage.setItem(L.saveKey, JSON.stringify(saved));
      } catch {}
      resume();
      toast(t('save.imported'));
    } catch {
      toast(t('save.invalid'));
    }
  }

  function changeSetting(key, value) {
    settings[key] = value;
    applySettings(settings);
    storeSettings(settings);
    audio.update();
    syncBar();
    if (key === 'narrationEnabled' && value && active) startNarration(current);
    if (key === 'reducedMotion' && value) inkbox.showAll();
  }

  // The ink bar's toggles mirror their settings.
  function syncBar() {
    $('auto-button').setAttribute('aria-pressed', String(settings.autoContinue));
    $('voice-button').setAttribute('aria-pressed', String(settings.narrationEnabled));
    $('speed-button').setAttribute('aria-pressed', String(settings.textSpeed === 'fast'));
  }

  function rememberLanguage() {
    try {
      localStorage.setItem('himawari-language', t('other.code'));
    } catch {}
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else document.documentElement.requestFullscreen?.({navigationUI: 'hide'}).catch(() => {});
  }

  function toast(message) {
    const node = $('toast');
    node.textContent = message;
    node.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (node.hidden = true), 4500);
  }

  // --- Input ------------------------------------------------------------------

  $('voice-toggle').addEventListener('click', () => {
    narrating = true;
    audio.toggle();
  });
  $('voice-replay').addEventListener('click', () => {
    narrating = true;
    audio.replay();
  });
  $('skip-button').addEventListener('click', () => setSkipping(!skipping));
  const auto = $('auto-button');
  syncBar();
  auto.addEventListener('click', () => {
    changeSetting('autoContinue', !settings.autoContinue);
    if (settings.autoContinue) scheduleAuto(600);
  });
  $('voice-button').addEventListener('click', () => changeSetting('narrationEnabled', !settings.narrationEnabled));
  $('speed-button').addEventListener('click', () =>
    changeSetting('textSpeed', settings.textSpeed === 'fast' ? 'normal' : 'fast'),
  );
  $('look-button').addEventListener('click', event => {
    event.stopPropagation();
    setLooking(!looking);
  });
  $('notebook-button').addEventListener('click', () => notebook.open(journal.cover().unread ? 'diary' : undefined));

  // Tapping the picture or the text moves the story on; controls keep their
  // own meaning. In look mode any tap returns to the story.
  const interactive = 'button, a, input, textarea, select, label, form, .ink-responses, #notebook, #hud';
  $('app').addEventListener('click', event => {
    if (!active || notebook.isOpen()) return;
    if (looking) return setLooking(false);
    if (event.target.closest(interactive)) return;
    if (getSelection?.().toString()) return;
    advance();
  });

  document.addEventListener('keydown', event => {
    if (event.defaultPrevented || event.metaKey || event.altKey) return;
    if (notebook.isOpen() || !active) return;
    if (event.key === 'Control') {
      if (!event.repeat && read) {
        holdingSkip = true;
        maybeSkip();
      }
      return;
    }
    if (event.ctrlKey || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName)) return;
    if (looking) {
      event.preventDefault();
      return setLooking(false);
    }
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    const {screen} = current;
    if (key === ' ' || key === 'Enter') {
      if (event.target.closest?.('button, a')) return;
      event.preventDefault();
      advance();
    } else if (/^[1-8]$/.test(key)) {
      const n = Number(key);
      if (screen.kind === 'map') act('go', n);
      else if (screen.kind === 'story' && !screen.input && !inkbox.writing) {
        const option = visibleOptions(screen).find(o => o.choice === n);
        if (option && !continuation(screen)) choose(option);
      }
    } else if (key === 'p') {
      narrating = true;
      audio.toggle();
    } else if (key === 'r') {
      narrating = true;
      audio.replay();
    } else if ((key === 'v' || key === 'h') && screen.kind !== 'map') setLooking(true);
    else if (key === 'n' || key === 'Escape') notebook.open(key === 'Escape' ? 'settings' : undefined);
    else if (key === 's' && read) setSkipping(!skipping);
    else if (key === 'a') auto.click();
    else if (key === 'f') toggleFullscreen();
    else return;
  });
  document.addEventListener('keyup', event => {
    if (event.key === 'Control' && holdingSkip) {
      holdingSkip = false;
      if (!skipping) clearTimeout(skipTimer);
    }
  });

  function suspendMedia() {
    audio.suspend(true);
  }
  function resumeMedia() {
    if (document.hidden) return;
    audio.resume();
    if (!notebook.isOpen() && active && pendingNarration === current) startNarration(current);
  }
  window.addEventListener('pagehide', () => {
    if (active) save();
    suspendMedia();
  });
  window.addEventListener('pageshow', resumeMedia);
  onLifecycle(() => {
    if (active) save();
    suspendMedia();
  }, resumeMedia);
  // Android's back button: close what is open, else the notebook is the pause
  // menu; on the cover it closes the app.
  onBack(() => {
    if (notebook.isOpen()) return notebook.close(), true;
    if (looking) return setLooking(false), true;
    if (hud.carding) return hud.finishCard(), true;
    if (active) return notebook.open('settings'), true;
    return false;
  });
  document.addEventListener('visibilitychange', () => (document.hidden ? suspendMedia() : resumeMedia()));

  // --- Start ------------------------------------------------------------------

  stage.show(COVER_ART, {focus: L.focus?.['2464'], instant: true});
  updateTitle();
  boot.reveal?.();
  $('app').hidden = false;
  $('app').inert = false;
  title.show();
  audio.music(0);
  window.Himawari = Object.freeze({
    version: L.version,
    language: L.code,
    narrator: L.narrator,
    snapshot: () => engine.snapshot(),
  });
}
