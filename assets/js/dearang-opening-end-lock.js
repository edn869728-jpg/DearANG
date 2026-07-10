(function () {
  'use strict';

  if (window.__DEARANG_OPENING_END_LOCK_V2__) return;
  window.__DEARANG_OPENING_END_LOCK_V2__ = true;

  var running = false;
  var completed = false;
  var finishing = false;
  var originalStart = null;
  var originalFinish = null;
  var guardTimer = null;
  var safetyTimer = null;

  function byId(id) {
    return document.getElementById(id);
  }

  function stopTimer(timer) {
    if (!timer) return null;
    clearTimeout(timer);
    clearInterval(timer);
    return null;
  }

  function forceMiniFrame() {
    if (!completed) return;

    var gate = byId('gate');
    var overlay = byId('openingCountdown');
    var mini = byId('miniWorld');
    var world = byId('world');
    var video = byId('openingCountdownVideo');

    if (video) {
      try { video.pause(); } catch (_) {}
      video.loop = false;
      video.removeAttribute('loop');
    }

    if (gate) {
      gate.classList.add('out', 'hidden');
      gate.style.pointerEvents = 'none';
      gate.setAttribute('aria-hidden', 'true');
    }

    if (overlay) {
      overlay.classList.remove('show');
      overlay.classList.add('done');
      overlay.style.display = 'none';
      overlay.style.pointerEvents = 'none';
      overlay.setAttribute('aria-hidden', 'true');
    }

    if (world) world.classList.remove('hidden');

    if (mini) {
      mini.classList.remove('hidden', 'zooming');
      mini.style.display = 'block';
      mini.style.opacity = '1';
      mini.style.pointerEvents = 'auto';
      mini.setAttribute('aria-hidden', 'false');
      try { mini.scrollTop = 0; } catch (_) {}
    }

    try { window.openingCountdownActive = false; } catch (_) {}
    try {
      if (window.openingCountdownTimer) {
        clearTimeout(window.openingCountdownTimer);
        clearInterval(window.openingCountdownTimer);
      }
      window.openingCountdownTimer = null;
    } catch (_) {}

    try {
      if (typeof window.setupMiniFrameVideo === 'function') {
        window.setupMiniFrameVideo(false);
      } else {
        var miniVideo = byId('miniFrameVideo');
        if (miniVideo) {
          miniVideo.muted = true;
          miniVideo.loop = true;
          var play = miniVideo.play();
          if (play && play.catch) play.catch(function () {});
        }
      }
    } catch (_) {}

    try {
      window.musicWanted = true;
      var theme = byId('themeAudio');
      if (theme) {
        theme.volume = 1;
        theme.loop = true;
      }
      if (typeof window.startTheme === 'function') window.startTheme();
    } catch (_) {}

    try {
      sessionStorage.setItem('dearangCurrentView', 'miniWorld');
      sessionStorage.setItem('dearangOpeningDone', '1');
    } catch (_) {}
  }

  function startGuard() {
    guardTimer = stopTimer(guardTimer);
    var count = 0;
    guardTimer = setInterval(function () {
      forceMiniFrame();
      count += 1;
      if (count >= 80) guardTimer = stopTimer(guardTimer);
    }, 100);
  }

  function finishOnce(reason) {
    if (finishing) return false;
    if (completed) {
      forceMiniFrame();
      return false;
    }

    finishing = true;
    running = false;
    completed = true;
    safetyTimer = stopTimer(safetyTimer);

    var video = byId('openingCountdownVideo');
    if (video) {
      try { video.pause(); } catch (_) {}
      video.loop = false;
      video.removeAttribute('loop');
    }

    /* 先讓原本結束流程完成音樂與天氣初始化，再強制固定在 mini frame。 */
    try {
      if (typeof originalFinish === 'function') originalFinish.call(window);
    } catch (_) {}

    forceMiniFrame();
    requestAnimationFrame(forceMiniFrame);
    setTimeout(forceMiniFrame, 80);
    setTimeout(forceMiniFrame, 280);
    setTimeout(function () {
      forceMiniFrame();
      finishing = false;
    }, 650);
    startGuard();

    console.log('[DearANG] opening finished -> mini frame', reason || 'ended');
    return false;
  }

  function bindVideo() {
    var video = byId('openingCountdownVideo');
    if (!video || video.dataset.dearAngOpeningLockV2 === '1') return;

    video.dataset.dearAngOpeningLockV2 = '1';
    video.loop = false;
    video.removeAttribute('loop');

    video.addEventListener('ended', function () {
      if (running) finishOnce('ended');
    }, true);

    video.addEventListener('timeupdate', function () {
      if (!running) return;
      var duration = Number(video.duration || 0);
      var current = Number(video.currentTime || 0);
      if (duration > 0 && current >= duration - 0.12) finishOnce('near-end');
    }, true);

    video.addEventListener('error', function () {
      if (running) finishOnce('video-error');
    }, true);
  }

  function install() {
    bindVideo();

    originalStart = typeof window.startOpeningMemoryCountdown === 'function'
      ? window.startOpeningMemoryCountdown
      : null;
    originalFinish = typeof window.finishOpeningMemoryCountdown === 'function'
      ? window.finishOpeningMemoryCountdown
      : null;

    window.finishOpeningMemoryCountdown = function () {
      return finishOnce('original-callback');
    };

    window.startOpeningMemoryCountdown = function () {
      if (running || finishing) return false;

      completed = false;
      running = true;
      guardTimer = stopTimer(guardTimer);
      safetyTimer = stopTimer(safetyTimer);

      var overlay = byId('openingCountdown');
      var mini = byId('miniWorld');
      var video = byId('openingCountdownVideo');

      if (mini) {
        mini.classList.add('hidden');
        mini.classList.remove('zooming');
        mini.style.display = '';
        mini.style.pointerEvents = 'none';
      }
      if (overlay) {
        overlay.style.display = '';
        overlay.classList.remove('done');
        overlay.classList.add('show');
      }
      if (video) {
        video.loop = false;
        video.removeAttribute('loop');
      }

      try {
        if (originalStart) originalStart.apply(window, arguments);
        else finishOnce('missing-original-start');
      } catch (_) {
        finishOnce('start-error');
      }

      bindVideo();
      video = byId('openingCountdownVideo');
      if (video) video.onended = function () { finishOnce('onended'); };

      safetyTimer = setTimeout(function () {
        if (running) finishOnce('safety-timeout');
      }, 120000);

      return false;
    };

    window.enterWorld = function (event) {
      if (event) {
        try { event.preventDefault(); } catch (_) {}
        try { event.stopPropagation(); } catch (_) {}
      }
      return window.startOpeningMemoryCountdown();
    };

    var targets = [byId('gate'), byId('openingCountdown'), byId('miniWorld')].filter(Boolean);
    if (targets.length) {
      var observer = new MutationObserver(function () {
        if (completed) forceMiniFrame();
      });
      targets.forEach(function (target) {
        observer.observe(target, { attributes: true, attributeFilter: ['class', 'style'] });
      });
    }
  }

  /* document.write 載入時，外部 script.js 可能較晚建立函式，所以等 load 後才包裝。 */
  if (document.readyState === 'complete') install();
  else window.addEventListener('load', install, { once: true });
})();
