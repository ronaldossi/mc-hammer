/* Original video audio is the web song clock. Canvas UI never receives the blur. */
(() => {
  'use strict';
  const video = document.getElementById('background-video');
  const notice = document.getElementById('media-notice');
  const manifest = window.GAME_MEDIA || {};
  let active = false;
  let visible = false;
  let expectedDuration = 0;
  let lastPosition = 0;
  let pausedAt = 0;
  let pendingSeek = 0;
  let volume = 0.44;
  let pauseCallback = null;
  let previewMode = false;
  let previewStart = 0;
  let previewEnd = 0;
  let generation = 0;
  let blockedPreview = false;

  function report(message) {
    notice.textContent = message;
    notice.hidden = false;
    if (pauseCallback && !previewMode) pauseCallback(message);
  }
  function beginPlayback() {
    const attempt = generation;
    const pending = video.play();
    if (pending && typeof pending.catch === 'function') {
      pending.catch(() => {
        if (attempt !== generation) return;
        blockedPreview = previewMode;
        report(previewMode ? '미리듣기를 켜려면 원하는 곡을 한 번 클릭해 주세요.' : '영상 재생을 시작하지 못했습니다. 계속 버튼으로 다시 시작할 수 있습니다.');
      });
    }
  }
  function loadVideo(id, duration, start, preview) {
    if (!/^[a-z0-9_]+$/.test(id) || !Object.prototype.hasOwnProperty.call(manifest, id)) return false;
    const entry = manifest[id];
    if (!entry.src || !entry.src.startsWith('media/')) return false;
    generation++;
    blockedPreview = false;
    video.pause();
    active = true;
    visible = false;
    previewMode = preview;
    expectedDuration = Math.max(0, Number(duration) || Number(entry.duration) || 0);
    lastPosition = pausedAt = pendingSeek = Math.max(0, Number(start) || 0);
    previewStart = pendingSeek;
    previewEnd = Math.min(expectedDuration, previewStart + 20);
    video.src = entry.src;
    video.poster = entry.poster || '';
    video.muted = false;
    video.volume = volume;
    video.playbackRate = 1;
    video.hidden = false;
    notice.hidden = true;
    video.load();
    beginPlayback();
    return true;
  }
  video.addEventListener('loadedmetadata', () => {
    if (active) video.currentTime = Math.min(pendingSeek, Number.isFinite(video.duration) ? video.duration : pendingSeek);
  });
  video.addEventListener('playing', () => {
    blockedPreview = false;
    notice.hidden = true;
    visible = active;
  });
  video.addEventListener('error', () => {
    if (active) report('영상 파일을 재생할 수 없습니다. 음원 선택에서 다른 곡을 선택해 주세요.');
  });
  video.addEventListener('timeupdate', () => {
    if (active && previewMode && video.currentTime >= previewEnd) video.currentTime = previewStart;
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && active && !video.paused) {
      if (pauseCallback) pauseCallback('');
      else video.pause();
    }
  });
  function unlockPreview() {
    if (active && previewMode && blockedPreview && video.paused) {
      blockedPreview = false;
      beginPlayback();
    }
  }
  // Browsers require an actual gesture for sound after the first autoplay denial.
  document.addEventListener('pointerdown', unlockPreview);
  document.addEventListener('keydown', unlockPreview);

  window.ArkesiaMedia = Object.freeze({
    playTrack(id, duration, start) {
      return loadVideo(id,duration,start,false);
    },
    playPreview(id) {
      const entry = manifest[id];
      if (!entry) return false;
      return loadVideo(id,entry.duration,Math.min(30,entry.duration*0.25),true);
    },
    stopPreview() {
      if (!previewMode) return;
      generation++;
      blockedPreview = false;
      video.pause();
      active = visible = previewMode = false;
      video.hidden = true;
      notice.hidden = true;
    },
    getSongTime() {
      if (previewMode) return 0;
      if (!active) return lastPosition;
      const position = video.ended ? Math.max(expectedDuration, Number(video.duration) || 0) : Number(video.currentTime) || 0;
      lastPosition = Math.max(lastPosition, position);
      return lastPosition;
    },
    hasEnded() { return active && !previewMode && video.ended; },
    pauseAt(position) {
      if (!active) return;
      video.pause();
      pausedAt = pendingSeek = lastPosition = Math.max(0, Number(position) || 0);
      if (video.readyState >= 1) video.currentTime = pausedAt;
    },
    resume() {
      if (!active) return;
      lastPosition = pausedAt;
      if (video.readyState >= 1) video.currentTime = pausedAt;
      beginPlayback();
    },
    stop() {
      generation++;
      blockedPreview = false;
      video.pause();
      active = visible = previewMode = false;
      notice.hidden = true;
    },
    hide() { visible = false; video.hidden = true; },
    duration() { return Math.max(expectedDuration, Number(video.duration) || 0); },
    setVolume(value) { volume = Math.min(1, Math.max(0, Number(value) || 0)); video.volume = volume; },
    setBlur(enabled) { video.style.setProperty('--background-blur', enabled ? '4px' : '0px'); },
    isVisible() { return visible && active && video.readyState >= 2; },
    registerPause(callback) { pauseCallback = callback; }
  });
})();
