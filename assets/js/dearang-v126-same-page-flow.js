(function () {
  'use strict';

  if (window.__DEARANG_V126_SAME_PAGE_FLOW__) return;
  window.__DEARANG_V126_SAME_PAGE_FLOW__ = true;

  var openingRunning = false;
  var openingFinished = false;
  var touchUnlockTimer = null;

  function byId(id) {
    return document.getElementById(id);
  }

  function lockMiniTouchBriefly() {
    var mini = byId('miniWorld');
    if (!mini) return;

    mini.style.setProperty('pointer-events', 'none', 'important');
    clearTimeout(touchUnlockTimer);
    touchUnlockTimer = setTimeout(function () {
      mini.style.setProperty('pointer-events', 'auto', 'important');
    }, 900);
  }

  function showMiniWorldSamePage() {
    var gate = byId('gate');
    var overlay = byId('openingCountdown');
    var openingVideo = byId('openingCountdownVideo');
    var mini = byId('miniWorld');
    var world = byId('world');
    var miniVideo = byId('miniFrameVideo');

    openingRunning = false;
    openingFinished = true;

    try {
      if (window.openingCountdownTimer) {
        clearTimeout(window.openingCountdownTimer);
        clearInterval(window.openingCountdownTimer);
      }
      window.openingCountdownTimer = null;
      window.openingCountdownActive = false;
    } catch (_) {}

    if (openingVideo) {
      try { openingVideo.pause(); } catch (_) {}
      openingVideo.loop = false;
      openingVideo.removeAttribute('loop');
      openingVideo.onended = null;
    }

    if (gate) {
      gate.classList.add('out', 'hidden');
      gate.style.setProperty('display', 'none', 'important');
      gate.style.setProperty('pointer-events', 'none', 'important');
      gate.setAttribute('aria-hidden', 'true');
    }

    if (overlay) {
      overlay.classList.remove('show');
      overlay.classList.add('done');
      overlay.style.setProperty('display', 'none', 'important');
      overlay.style.setProperty('opacity', '0', 'important');
      overlay.style.setProperty('pointer-events', 'none', 'important');
      overlay.setAttribute('aria-hidden', 'true');
    }

    if (world) world.classList.remove('hidden');

    if (mini) {
      mini.classList.remove('hidden', 'zooming');
      mini.style.setProperty('display', 'block', 'important');
      mini.style.setProperty('visibility', 'visible', 'important');
      mini.style.setProperty('opacity', '1', 'important');
      mini.setAttribute('aria-hidden', 'false');
      try { mini.scrollTop = 0; } catch (_) {}
      lockMiniTouchBriefly();
    }

    if (miniVideo) {
      try {
        miniVideo.muted = true;
        miniVideo.loop = true;
        var result = miniVideo.play();
        if (result && result.catch) result.catch(function () {});
      } catch (_) {}
    }

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

    return false;
  }

  function startOpeningSamePage(event) {
    if (event) {
      try { event.preventDefault(); } catch (_) {}
      try { event.stopPropagation(); } catch (_) {}
    }
    if (openingRunning) return false;

    openingRunning = true;
    openingFinished = false;

    var gate = byId('gate');
    var overlay = byId('openingCountdown');
    var video = byId('openingCountdownVideo');
    var mini = byId('miniWorld');

    if (gate) {
      gate.style.removeProperty('display');
      gate.classList.remove('hidden');
      gate.classList.add('out');
      gate.style.pointerEvents = 'none';
    }

    if (mini) {
      mini.classList.add('hidden');
      mini.classList.remove('zooming');
      mini.style.removeProperty('display');
      mini.style.removeProperty('visibility');
      mini.style.removeProperty('opacity');
      mini.style.pointerEvents = 'none';
    }

    if (overlay) {
      overlay.style.removeProperty('display');
      overlay.style.removeProperty('opacity');
      overlay.style.removeProperty('pointer-events');
      overlay.classList.remove('done');
      overlay.classList.add('show');
      overlay.setAttribute('aria-hidden', 'false');
    }

    if (!video || !video.getAttribute('src')) {
      return showMiniWorldSamePage();
    }

    try {
      video.pause();
      video.currentTime = 0;
      video.loop = false;
      video.removeAttribute('loop');
      video.muted = false;
      video.volume = 1;
    } catch (_) {}

    video.onended = showMiniWorldSamePage;
    video.addEventListener('timeupdate', function nearEnd() {
      if (!openingRunning) {
        video.removeEventListener('timeupdate', nearEnd);
        return;
      }
      var duration = Number(video.duration || 0);
      var current = Number(video.currentTime || 0);
      if (duration > 0 && current >= duration - 0.1) {
        video.removeEventListener('timeupdate', nearEnd);
        showMiniWorldSamePage();
      }
    });

    try {
      var playResult = video.play();
      if (playResult && playResult.catch) {
        playResult.catch(function () {
          try {
            video.muted = true;
            var mutedResult = video.play();
            if (mutedResult && mutedResult.catch) mutedResult.catch(showMiniWorldSamePage);
          } catch (_) {
            showMiniWorldSamePage();
          }
        });
      }
    } catch (_) {
      showMiniWorldSamePage();
    }

    return false;
  }

  function install() {
    window.finishOpeningMemoryCountdown = showMiniWorldSamePage;
    window.startOpeningMemoryCountdown = startOpeningSamePage;
    window.enterWorld = startOpeningSamePage;

    var gate = byId('gate');
    if (gate) {
      var button = gate.querySelector('button');
      if (button && button.dataset.dearangSamePageBound !== '1') {
        button.dataset.dearangSamePageBound = '1';
        button.removeAttribute('onclick');
        button.addEventListener('click', startOpeningSamePage, true);
      }
    }

    var video = byId('openingCountdownVideo');
    if (video) {
      video.loop = false;
      video.removeAttribute('loop');
      video.addEventListener('ended', showMiniWorldSamePage, true);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', install, { once: true });
  } else {
    install();
  }
})();