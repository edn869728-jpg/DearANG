(function () {
  'use strict';

  if (window.__DEAR_ANG_V74_STABLE_OPENING__) return;
  window.__DEAR_ANG_V74_STABLE_OPENING__ = true;

  var MINI_VIDEOS = {
    nightRain: 'assets/videos/weather-mini/01-night-rain.mp4',
    deepNightRain: 'assets/videos/weather-mini/02-deep-night-rain.mp4',
    cloudy: 'assets/videos/weather-mini/03-cloudy.mp4',
    overcast: 'assets/videos/weather-mini/04-overcast.mp4',
    sunny: 'assets/videos/weather-mini/05-sunny.mp4',
    fog: 'assets/videos/weather-mini/06-fog.mp4',
    storm: 'assets/videos/weather-mini/07-thunderstorm.mp4',
    thunderstorm: 'assets/videos/weather-mini/07-thunderstorm.mp4',
    nightShower: 'assets/videos/weather-mini/08-night-shower.mp4',
    hot: 'assets/videos/weather-mini/09-hot-sunny.mp4',
    rain: 'assets/videos/weather-mini/10-day-rain.mp4',
    dayRain: 'assets/videos/weather-mini/10-day-rain.mp4',
    night: 'assets/videos/weather-mini/11-clear-night.mp4',
    clearNight: 'assets/videos/weather-mini/11-clear-night.mp4'
  };

  var miniVisible = false;
  var openingCleanup = null;
  var openingFinishing = false;

  function byId(id) {
    return document.getElementById(id);
  }

  function normalizeMiniKey(key) {
    key = String(key || '').trim();
    if (MINI_VIDEOS[key]) return key;
    if (/deep.*night.*rain|深夜.*雨/i.test(key)) return 'deepNightRain';
    if (/night.*rain|夜雨/i.test(key)) return 'nightRain';
    if (/night.*shower|夜.*陣雨/i.test(key)) return 'nightShower';
    if (/thunder|storm|雷|暴|豪|颱/i.test(key)) return 'storm';
    if (/rain|shower|雨/i.test(key)) return 'rain';
    if (/fog|霧/i.test(key)) return 'fog';
    if (/overcast|陰/i.test(key)) return 'overcast';
    if (/cloud|雲/i.test(key)) return 'cloudy';
    if (/hot|熱/i.test(key)) return 'hot';
    if (/night|clear.*night|夜/i.test(key)) return 'night';

    var hour = new Date().getHours();
    return hour < 6 || hour >= 18 ? 'night' : 'sunny';
  }

  function currentMiniKey() {
    try {
      if (typeof memoryWeatherKey !== 'undefined' && memoryWeatherKey) {
        return normalizeMiniKey(memoryWeatherKey);
      }
    } catch (e) {}
    return normalizeMiniKey('');
  }

  function pauseMiniFrame() {
    var video = byId('miniFrameVideo');
    if (!video) return;
    try {
      video.removeAttribute('autoplay');
      video.preload = 'metadata';
      video.pause();
    } catch (e) {}
  }

  function setupMiniFrameVideoV74(forceReload) {
    var video = byId('miniFrameVideo');
    if (!video) return;

    if (!miniVisible) {
      pauseMiniFrame();
      return;
    }

    var key = currentMiniKey();
    var next = MINI_VIDEOS[key] || MINI_VIDEOS.sunny;
    var current = video.getAttribute('src') || '';

    try {
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');
      video.preload = 'auto';

      if (forceReload || current.indexOf(next) === -1) {
        video.src = next;
        video.load();
      }

      var playResult = video.play();
      if (playResult && playResult.catch) playResult.catch(function () {});
    } catch (e) {}
  }

  function showMiniWorldV74() {
    miniVisible = true;
    window.__DEAR_ANG_MINI_VISIBLE__ = true;

    var mini = byId('miniWorld');
    var world = byId('world');
    if (world) world.classList.remove('hidden');
    if (mini) mini.classList.remove('hidden', 'zooming');

    try {
      if (typeof renderMiniWeatherButtons === 'function') renderMiniWeatherButtons();
    } catch (e) {}

    setupMiniFrameVideoV74(false);
  }

  function clearOpeningState() {
    if (openingCleanup) {
      try { openingCleanup(); } catch (e) {}
      openingCleanup = null;
    }
  }

  function finishOpeningV74() {
    if (openingFinishing) return;
    openingFinishing = true;
    clearOpeningState();

    var overlay = byId('openingCountdown');
    var video = byId('openingCountdownVideo');
    var gate = byId('gate');
    var theme = byId('themeAudio');

    if (video) {
      try {
        video.pause();
        video.currentTime = 0;
      } catch (e) {}
    }

    try { openingCountdownActive = false; } catch (e) {}
    try { openingCountdownTimer = null; } catch (e) {}

    try { musicWanted = true; } catch (e) {}
    if (theme) {
      try {
        theme.loop = true;
        theme.volume = 1;
      } catch (e) {}
    }
    try {
      if (typeof startTheme === 'function') startTheme();
    } catch (e) {}

    if (gate) gate.classList.add('out', 'hidden');
    if (overlay) {
      overlay.classList.add('done');
      setTimeout(function () {
        overlay.classList.remove('show', 'done');
      }, 180);
    }

    showMiniWorldV74();

    setTimeout(function () {
      openingFinishing = false;
      window.__DEAR_ANG_OPENING_RUNNING__ = false;
    }, 220);
  }

  function startOpeningV74() {
    if (window.__DEAR_ANG_OPENING_RUNNING__ || openingFinishing) return;
    window.__DEAR_ANG_OPENING_RUNNING__ = true;

    clearOpeningState();
    miniVisible = false;
    window.__DEAR_ANG_MINI_VISIBLE__ = false;
    pauseMiniFrame();

    try { openingCountdownActive = true; } catch (e) {}
    try { if (typeof playUiSound === 'function') playUiSound('open'); } catch (e) {}
    try { if (typeof primeThemeBeforeCountdown === 'function') primeThemeBeforeCountdown(); } catch (e) {}

    var gate = byId('gate');
    var overlay = byId('openingCountdown');
    var mini = byId('miniWorld');
    var world = byId('world');
    var video = byId('openingCountdownVideo');

    if (mini) mini.classList.add('hidden');
    if (world) world.classList.remove('hidden');
    if (gate) gate.classList.add('out');
    if (overlay) {
      overlay.classList.remove('done');
      overlay.classList.add('show');
    }

    if (!video) {
      setTimeout(finishOpeningV74, 600);
      return;
    }

    var finished = false;
    var startTimer = null;
    var stallTimer = null;
    var durationTimer = null;
    var lastTime = -1;

    function cleanup() {
      if (finished) return;
      finished = true;
      clearTimeout(startTimer);
      clearTimeout(stallTimer);
      clearTimeout(durationTimer);
      video.removeEventListener('ended', onEnded);
      video.removeEventListener('error', onError);
      video.removeEventListener('abort', onAbort);
      video.removeEventListener('playing', onPlaying);
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
    }

    function safeFinish() {
      cleanup();
      finishOpeningV74();
    }

    function armStallWatch() {
      clearTimeout(stallTimer);
      stallTimer = setTimeout(function () {
        if (!video.ended) safeFinish();
      }, 12000);
    }

    function onEnded() { safeFinish(); }
    function onError() { safeFinish(); }
    function onAbort() {
      if (window.__DEAR_ANG_OPENING_RUNNING__) safeFinish();
    }
    function onPlaying() {
      clearTimeout(startTimer);
      lastTime = Number(video.currentTime) || 0;
      armStallWatch();
    }
    function onTimeUpdate() {
      var now = Number(video.currentTime) || 0;
      if (now > lastTime + 0.02) {
        lastTime = now;
        armStallWatch();
      }
      if (Number.isFinite(video.duration) && video.duration > 0 && now >= video.duration - 0.12) {
        safeFinish();
      }
    }
    function onLoadedMetadata() {
      clearTimeout(durationTimer);
      if (Number.isFinite(video.duration) && video.duration > 0) {
        durationTimer = setTimeout(safeFinish, Math.min(120000, Math.max(15000, Math.ceil(video.duration * 1000) + 15000)));
      }
    }

    video.addEventListener('ended', onEnded);
    video.addEventListener('error', onError);
    video.addEventListener('abort', onAbort);
    video.addEventListener('playing', onPlaying);
    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('loadedmetadata', onLoadedMetadata);
    openingCleanup = cleanup;

    startTimer = setTimeout(function () {
      if (!finished && (video.paused || video.readyState < 2 || (Number(video.currentTime) || 0) < 0.05)) {
        safeFinish();
      }
    }, 8000);

    try {
      video.preload = 'auto';
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');
      video.muted = false;
      video.volume = 1;
      video.currentTime = 0;
      if (!video.getAttribute('src')) video.src = 'assets/videos/opening-countdown.mp4';
      video.load();

      var playResult = video.play();
      if (playResult && playResult.catch) {
        playResult.catch(function () {
          try {
            video.muted = true;
            var mutedPlay = video.play();
            if (mutedPlay && mutedPlay.catch) {
              mutedPlay.catch(function () { setTimeout(safeFinish, 700); });
            }
          } catch (e) {
            setTimeout(safeFinish, 700);
          }
        });
      }
    } catch (e) {
      setTimeout(safeFinish, 300);
    }
  }

  var previousSetMemoryWeather = window.setMemoryWeather;
  function setMemoryWeatherV74(key, event, source) {
    var result;
    if (typeof previousSetMemoryWeather === 'function') {
      try { result = previousSetMemoryWeather.apply(this, arguments); } catch (e) {}
    }

    if (miniVisible) {
      setTimeout(function () { setupMiniFrameVideoV74(false); }, 0);
    } else {
      pauseMiniFrame();
    }
    return result;
  }

  function setupWeatherV74() {
    try {
      if (typeof setMiniWeatherStatus === 'function') {
        setMiniWeatherStatus('正在讀取長眠地即時天氣…');
      }
    } catch (e) {}

    try {
      if (typeof refreshAutoWeather === 'function') refreshAutoWeather(false);
    } catch (e) {}

    try {
      if (typeof autoWeatherTimer !== 'undefined' && autoWeatherTimer) {
        clearInterval(autoWeatherTimer);
        autoWeatherTimer = null;
      }
    } catch (e) {}
  }

  window.setupMiniFrameVideo = setupMiniFrameVideoV74;
  window.showMiniWorld = showMiniWorldV74;
  window.startOpeningMemoryCountdown = startOpeningV74;
  window.finishOpeningMemoryCountdown = finishOpeningV74;
  window.setMemoryWeather = setMemoryWeatherV74;
  window.setupWeather = setupWeatherV74;

  try { setupMiniFrameVideo = setupMiniFrameVideoV74; } catch (e) {}
  try { showMiniWorld = showMiniWorldV74; } catch (e) {}
  try { startOpeningMemoryCountdown = startOpeningV74; } catch (e) {}
  try { finishOpeningMemoryCountdown = finishOpeningV74; } catch (e) {}
  try { setMemoryWeather = setMemoryWeatherV74; } catch (e) {}
  try { setupWeather = setupWeatherV74; } catch (e) {}

  function boot() {
    var mini = byId('miniWorld');
    miniVisible = !!(mini && !mini.classList.contains('hidden'));
    window.__DEAR_ANG_MINI_VISIBLE__ = miniVisible;

    var theme = byId('themeAudio');
    if (theme) {
      try {
        theme.loop = true;
        theme.preload = 'metadata';
      } catch (e) {}
    }

    if (miniVisible) setupMiniFrameVideoV74(false);
    else pauseMiniFrame();

    try {
      if (typeof autoWeatherTimer !== 'undefined' && autoWeatherTimer) {
        clearInterval(autoWeatherTimer);
        autoWeatherTimer = null;
      }
    } catch (e) {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(boot, 0);
    }, { once: true });
  } else {
    setTimeout(boot, 0);
  }

  window.addEventListener('load', function () {
    setTimeout(boot, 80);
  }, { once: true });
})();
