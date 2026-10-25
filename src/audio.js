import {L} from './i18n.js';
import {assetURL} from './assets.js';

const clipFor = id => L.narration[id];
const tracks = [
  'opening_6_opening',
  'ending_9_ending',
  'victory_10_victory',
  'mapa_13_mapa',
  'home_1_home',
  'dumpster_7_dumpster',
  'wharehouse_5_wharehouse',
  'park_8_park',
  'waterplant_4_waterplant',
  'school_2_school',
  'pizza_12_pizza',
  'avenue_11_avenue',
];
export function createAudio(settings, onStatus = () => {}) {
  const voice = new Audio(),
    musicA = new Audio(),
    musicB = new Audio(),
    click = new Audio();
  voice.preload = 'metadata';
  musicA.loop = musicB.loop = true;
  musicA.preload = musicB.preload = 'none';
  click.preload = 'none';
  click.volume = 0.13;
  let currentMusic = musicA,
    previousMusic = musicB,
    musicId = -1,
    fadeFrame = 0,
    voiceFrame = 0,
    queue = [],
    index = 0,
    token = 0,
    playAttempt = 0,
    seekCleanup = null,
    prepared = false,
    playing = false,
    paused = false,
    completed = true,
    suspended = false,
    autoResume = false,
    loadedFile = '',
    blocked = false,
    total = 0;
  function emit() {
    const clip = queue[index];
    const before = queue.slice(0, index).reduce((s, c) => s + c.end - c.start, 0);
    const progress = total
      ? Math.min(
          1,
          (before + (clip && prepared ? Math.max(0, Math.min(clip.end, voice.currentTime) - clip.start) : 0)) / total,
        )
      : 0;
    onStatus({
      playing,
      loading: playing && !prepared,
      paused,
      completed,
      blocked,
      progress,
      available: queue.length > 0,
      enabled: settings.narrationEnabled,
    });
  }
  function targetVolume() {
    return suspended || !settings.musicEnabled ? 0 : settings.musicVolume * (playing ? 0.34 : 1);
  }
  function fade() {
    cancelAnimationFrame(fadeFrame);
    const start = performance.now(),
      a = currentMusic.volume,
      b = previousMusic.volume,
      target = targetVolume();
    function tick(now) {
      const q = Math.max(0, Math.min(1, (now - start) / 700));
      currentMusic.volume = Math.max(0, Math.min(1, a + (target - a) * q));
      previousMusic.volume = Math.max(0, b * (1 - q));
      if (q < 1) fadeFrame = requestAnimationFrame(tick);
      else if (previousMusic !== currentMusic) previousMusic.pause();
    }
    fadeFrame = requestAnimationFrame(tick);
  }
  function requestPlay() {
    const myToken = token,
      myAttempt = ++playAttempt;
    const play = voice.play();
    if (play)
      play.catch(error => {
        if (myToken !== token || myAttempt !== playAttempt || error.name === 'AbortError') return;
        voice.pause();
        playing = false;
        paused = true;
        blocked = true;
        fade();
        emit();
      });
  }
  function clearSeek() {
    if (seekCleanup) seekCleanup();
    seekCleanup = null;
  }
  function playClip() {
    // Every clip, including Replay, owns a distinct generation. A delayed load,
    // seek or play() rejection from any earlier clip has no authority over it.
    const myToken = ++token;
    playAttempt++;
    clearSeek();
    cancelAnimationFrame(voiceFrame);
    voice.pause();
    prepared = false;
    const clip = queue[index];
    if (!clip) {
      playing = false;
      paused = false;
      completed = true;
      fade();
      emit();
      return;
    }
    playing = !suspended;
    paused = suspended;
    completed = false;
    blocked = false;
    voice.volume = settings.voiceVolume;
    voice.playbackRate = settings.voiceRate;
    const changedFile = loadedFile !== clip.file;
    const ownsClip = () => myToken === token && queue[index] === clip;
    const ready = () => {
      if (!ownsClip() || voice.readyState < 1 || voice.seeking || Math.abs(voice.currentTime - clip.start) > 0.04)
        return;
      prepared = true;
      clearSeek();
      if (playing && !suspended) {
        if (voice.paused) requestPlay();
        watchBoundary();
      }
      emit();
    };
    const seek = () => {
      if (!ownsClip() || voice.readyState < 1) return;
      voice.removeEventListener('loadedmetadata', seek);
      // Seeking is asynchronous. Do not play, report progress, or inspect the
      // end boundary until seeked confirms this clip's start, even for one file.
      try {
        voice.currentTime = clip.start;
      } catch {
        return;
      }
      ready();
    };
    voice.addEventListener('loadedmetadata', seek);
    voice.addEventListener('seeked', ready);
    voice.addEventListener('canplay', ready);
    seekCleanup = () => {
      voice.removeEventListener('loadedmetadata', seek);
      voice.removeEventListener('seeked', ready);
      voice.removeEventListener('canplay', ready);
    };
    if (changedFile) {
      voice.src = assetURL(clip.file);
      loadedFile = clip.file;
      voice.load();
    }
    if (!prepared && voice.readyState >= 1) seek();
    // Unlock the media element from the Begin gesture. Only zero-offset audio
    // can safely start before metadata; later passages wait for their seek.
    if (!prepared && changedFile && voice.readyState < 1 && clip.start === 0 && playing && voice.paused) requestPlay();
    fade();
    emit();
  }
  function atBoundary() {
    const clip = queue[index];
    return playing && prepared && !voice.seeking && clip && voice.currentTime >= clip.end - 0.018;
  }
  function watchBoundary() {
    cancelAnimationFrame(voiceFrame);
    function tick() {
      if (!playing || !prepared) return;
      if (atBoundary()) {
        next();
        return;
      }
      voiceFrame = requestAnimationFrame(tick);
    }
    voiceFrame = requestAnimationFrame(tick);
  }
  function next() {
    if (!playing || !prepared) return;
    voice.pause();
    index++;
    playClip();
  }
  voice.addEventListener('timeupdate', () => {
    if (atBoundary()) {
      next();
      return;
    }
    emit();
  });
  voice.addEventListener('ended', () => {
    if (atBoundary()) next();
  });
  voice.addEventListener('error', () => {
    if (!queue.length || !voice.error) return;
    playAttempt++;
    voice.pause();
    playing = false;
    paused = !completed;
    blocked = true;
    fade();
    emit();
  });
  function read(parts, {force = false} = {}) {
    token++;
    playAttempt++;
    clearSeek();
    cancelAnimationFrame(voiceFrame);
    voice.pause();
    queue = [];
    index = 0;
    prepared = false;
    playing = false;
    paused = false;
    completed = true;
    blocked = false;
    autoResume = false;
    for (const part of parts || []) {
      if (part.id !== undefined) {
        const clip = clipFor(String(part.id));
        if (clip) queue.push(clip);
      } else queue.push(...dynamicClips((part.text || '').trim()));
    }
    total = queue.reduce((s, c) => s + c.end - c.start, 0);
    if (queue.length && (settings.narrationEnabled || force) && !suspended) playClip();
    else {
      fade();
      emit();
    }
  }
  function dynamicClips(text) {
    const clips = [],
      add = id => {
        if (clipFor(id)) clips.push(clipFor(id));
      };
    function number(n) {
      if (n < 0) {
        add('word:minus');
        number(-n);
        return;
      }
      if (n <= 300) {
        add('number:' + n);
        return;
      }
      for (const [amount, word] of L.numberScale)
        if (n >= amount) {
          number(Math.floor(n / amount));
          add('word:' + word);
          const rest = n % amount;
          if (rest) {
            if (L.numberJoin(amount, rest)) add('word:and');
            number(rest);
          }
          return;
        }
    }
    if (!text) return clips;
    if (L.martin.includes(text)) {
      add(clipFor('word:Martin') ? 'word:Martin' : '2350');
      return clips;
    }
    if (/^-?\d+(\.\d+)?$/.test(text) && Math.abs(Number(text)) <= Number.MAX_SAFE_INTEGER) {
      const [whole, fraction] = text.split('.');
      number(Number(whole));
      if (fraction) {
        add('word:point');
        for (const char of fraction) add('number:' + char);
      }
      return clips;
    }
    // Only player-entered text reaches this path. Spell unfamiliar names using
    // the narrator's cached letters; authored paragraphs are always read verbatim.
    for (const char of text) {
      const id = L.spell(char);
      if (id) add(id);
    }
    return clips;
  }
  function stop() {
    token++;
    playAttempt++;
    clearSeek();
    prepared = false;
    cancelAnimationFrame(voiceFrame);
    voice.pause();
    playing = false;
    paused = false;
    completed = true;
    autoResume = false;
    queue = [];
    total = 0;
    fade();
    emit();
  }
  function toggle() {
    if (!queue.length) return;
    autoResume = false;
    if (playing) {
      playAttempt++;
      voice.pause();
      playing = false;
      paused = true;
      fade();
      emit();
    } else if (completed) {
      index = 0;
      playClip();
    } else {
      playing = true;
      paused = false;
      blocked = false;
      if (prepared) {
        requestPlay();
        watchBoundary();
      }
      fade();
      emit();
    }
  }
  function music(id) {
    if (id === musicId) {
      if (settings.musicEnabled && !suspended && currentMusic.paused) currentMusic.play().catch(() => {});
      fade();
      return;
    }
    musicId = id;
    [currentMusic, previousMusic] = [previousMusic, currentMusic];
    currentMusic.pause();
    currentMusic.src = assetURL('assets/music/' + tracks[id] + '.m4a');
    currentMusic.volume = 0;
    currentMusic.load();
    if (settings.musicEnabled && !suspended) currentMusic.play().catch(() => {});
    fade();
  }
  function update() {
    voice.volume = settings.voiceVolume;
    voice.playbackRate = settings.voiceRate;
    if (!settings.narrationEnabled && playing) {
      playAttempt++;
      autoResume = false;
      voice.pause();
      playing = false;
      paused = true;
    }
    if (settings.musicEnabled && !suspended && musicId >= 0) currentMusic.play().catch(() => {});
    fade();
    emit();
  }
  function suspend(preservePlayback = false) {
    if (preservePlayback) autoResume = autoResume || playing;
    else autoResume = false;
    playAttempt++;
    suspended = true;
    voice.pause();
    playing = false;
    paused = queue.length > 0 && !completed;
    currentMusic.pause();
    previousMusic.pause();
    emit();
  }
  function resume() {
    suspended = false;
    const restart = autoResume;
    autoResume = false;
    if (restart && settings.narrationEnabled && queue.length && !completed) {
      playing = true;
      paused = false;
      blocked = false;
      if (prepared) {
        requestPlay();
        watchBoundary();
      }
      fade();
      emit();
    } else update();
  }
  function sound(volume = 0.13) {
    if (!settings.musicEnabled || suspended) return;
    click.volume = Math.max(0, Math.min(0.13, volume));
    if (!click.src) click.src = assetURL('assets/music/click_3_click.m4a');
    click.currentTime = 0;
    click.play().catch(() => {});
  }
  return {
    read,
    stop,
    toggle,
    replay() {
      if (queue.length) {
        index = 0;
        playClip();
      }
    },
    music,
    update,
    suspend,
    resume,
    sound,
    hasVoice(parts) {
      return parts.some(p => clipFor(String(p.id)));
    },
  };
}
