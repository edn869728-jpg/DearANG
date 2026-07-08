(function () {
  'use strict';

  if (window.__DEARANG_OPENING_END_LOCK_V1__) return;
  window.__DEARANG_OPENING_END_LOCK_V1__ = true;

  var originalStart = window.startOpeningMemoryCountdown;
  var finishing = false;
  var completed = false;
  var running = false;
  var rearmTimer = null;

  function byId(id) {
    return document.getElementById(id);
  }

  function stopEvent(event) {
    if (!event) return;
    try { event.preventDefault(); } catch (_) {}
    try { event.stopPropagation(); } catch (_) {}
  }

  function enforceFinishedView() {
    if (!completed) return;

    var gate = byId('gate');
    var overlay = byId('openingCountdown');
    var mini = byId('miniWorld');
    var world = byId('world');

    if (gate) {
      gate.classList.add('out', 'hidden');
      gate.style.pointerEvents = 'none';
      gate.setAttribute('aria-hidden', 'true');
    }

    if (overlay) {
      overlay.classList.remove('show');
      overlay.classList.add('done');
      overlay.style.pointerEvents = 'none';
      overlay.setAttribute('aria-hidden', 'true');
    }

    if (world) world.classList.remove('hidden');

    if (mini) {
      mini.classList.remove('hidden', 'zooming');
      mini.style.pointerEvents = 'auto';
      mini.setAttribute('aria-hidden', 'false');
    }

    try {
      if (typeof window.syncDearAngInteractionState === 'function') {
        window.syncDearAngInteractionState();
      }
    } catch (_) {}
  }

  function finishOpeningOnce() {
    if (finishing || (completed && !running)) {
      enforceFinishedView();
      return false;
    }

    finishing = true;
    running = false;
    completed = true;

    var video = byId('openingCountdownVideo');
    var theme = byId('themeAudio');

    if (video) {
      try { video.pause(); } catch (_) {}
      try { video.removeAttribute('loop'); } catch (_) {}
      try { video.currentTime = 0; } catch (_) {}
    }

    try { window.openingCountdownActive = false; } catch (_) {}
    try {
      if (window.openingCountdownTimer) clearInterval(window.openingCountdownTimer);
      window.openingCountdownTimer = null;
    } catch (_) {}

    try { window.musicWanted = true; } catch (_) {}
    if (theme) {
      try {
        theme.loop = true;
        theme.volume = 1;
      } catch (_) {}
    }

    enforceFinishedView();

    try {
      if (typeof window.setupMiniFrameVideo === 'function') {
        window.setupMiniFrameVideo(false);
      } else {
        var miniVideo = byId('miniFrameVideo');
        if (miniVideo) {
          miniVideo.muted = true;
          miniVideo.loop = true;
          var miniPlay = miniVideo.play();
          if (miniPlay && miniPlay.catch) miniPlay.catch(function () {});
        }
      }
    } catch (_) {}

    try {
      if (typeof window.startTheme === 'function') window.startTheme();
    } catch (_) {}

    clearTimeout(rearmTimer);
    requestAnimationFrame(enforceFinishedView);
    setTimeout(enforceFinishedView, 80);
    setTimeout(enforceFinishedView, 260);
    setTimeout(function () {
      enforceFinishedView();
      finishing = false;
    }, 500);

    return false;
  }

  function bindOpeningVideo() {
    var video = byId('openingCountdownVideo');
    if (!video || video.dataset.dearAngEndLockBound === '1') return;
    video.dataset.dearAngEndLockBound = '1';

    video.removeAttribute('loop');
    video.addEventListener('ended', finishOpeningOnce, true);
    video.addEventListener('error', function () {
      if (running) finishOpeningOnce();
    }, true);
    video.addEventListener('timeupdate', function () {
      if (!running) return;
      var duration = Number(video.duration || 0);
      var current = Number(video.currentTime || 0);
      if (duration > 0 && current >= duration - 0.08) finishOpeningOnce();
    }, true);
  }

  window.finishOpeningMemoryCountdown = finishOpeningOnce;

  window.startOpeningMemoryCountdown = function () {
    if (running || finishing) return false;

    completed = false;
    running = true;

    var gate = byId('gate');
    var overlay = byId('openingCountdown');
    var mini = byId('miniWorld');

    if (gate) {
      gate.classList.remove('hidden');
      gate.classList.add('out');
      gate.style.pointerEvents = 'none';
    }
    if (mini) {
      mini.classList.add('hidden');
      mini.classList.remove('zooming');
      mini.style.pointerEvents = 'none';
    }
    if (overlay) {
      overlay.classList.remove('done');
      overlay.classList.add('show');
      overlay.style.pointerEvents = 'auto';
    }

    bindOpeningVideo();

    try {
      if (typeof originalStart === 'function') {
        originalStart.apply(this, arguments);
      } else {
        var video = byId('openingCountdownVideo');
        if (!video) return finishOpeningOnce();
        video.currentTime = 0;
        video.muted = false;
        video.volume = 1;
        var playResult = video.play();
        if (playResult && playResult.catch) playResult.catch(finishOpeningOnce);
      }
    } catch (_) {
      finishOpeningOnce();
    }

    var activeVideo = byId('openingCountdownVideo');
    if (activeVideo) activeVideo.onended = finishOpeningOnce;

    clearTimeout(rearmTimer);
    rearmTimer = setTimeout(function () {
      if (running) {
        var v = byId('openingCountdownVideo');
        if (!v || v.ended) finishOpeningOnce();
      }
    }, 120000);

    return false;
  };

  window.enterWorld = function (event) {
    stopEvent(event);
    return window.startOpeningMemoryCountdown();
  };

  function boot() {
    bindOpeningVideo();

    var gate = byId('gate');
    var overlay = byId('openingCountdown');
    var mini = byId('miniWorld');
    var targets = [gate, overlay, mini].filter(Boolean);

    if (targets.length) {
      var observer = new MutationObserver(function () {
        if (completed) enforceFinishedView();
      });
      targets.forEach(function (target) {
        observer.observe(target, { attributes: true, attributeFilter: ['class', 'style'] });
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
