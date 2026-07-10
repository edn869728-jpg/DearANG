(function () {
  'use strict';

  if (window.__DEARANG_OPENING_DIRECT_FLOW_V4__) return;
  window.__DEARANG_OPENING_DIRECT_FLOW_V4__ = true;

  var running = false;
  var completed = false;
  var guardTimer = null;
  var safetyTimer = null;
  var miniUnlockTimer = null;
  var miniInteractiveAt = 0;

  function byId(id) {
    return document.getElementById(id);
  }

  function clearTimer(timer) {
    if (timer) {
      clearTimeout(timer);
      clearInterval(timer);
    }
    return null;
  }

  function stopEvent(event) {
    if (!event) return;
    try { event.preventDefault(); } catch (_) {}
    try { event.stopPropagation(); } catch (_) {}
    try { event.stopImmediatePropagation(); } catch (_) {}
  }

  function hideGateAndOpening() {
    var gate = byId('gate');
    var overlay = byId('openingCountdown');
    var openingVideo = byId('openingCountdownVideo');

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
  }

  function lockMiniInteraction() {
    var mini = byId('miniWorld');
    if (!mini) return;

    miniInteractiveAt = Date.now() + 1400;
    mini.style.setProperty('pointer-events', 'none', 'important');
    mini.dataset.dearAngInputLocked = '1';

    miniUnlockTimer = clearTimer(miniUnlockTimer);
    miniUnlockTimer = setTimeout(function () {
      var currentMini = byId('miniWorld');
      if (!currentMini || !completed) return;
      currentMini.style.setProperty('pointer-events', 'auto', 'important');
      currentMini.dataset.dearAngInputLocked = '0';
    }, 1400);
  }

  function showMiniFrame(keepLock) {
    var world = byId('world');
    var mini = byId('miniWorld');
    var miniVideo = byId('miniFrameVideo');

    if (world) world.classList.remove('hidden');

    if (mini) {
      mini.classList.remove('hidden', 'zooming');
      mini.style.setProperty('display', 'block', 'important');
      mini.style.setProperty('visibility', 'visible', 'important');
      mini.style.setProperty('opacity', '1', 'important');
      if (!keepLock && Date.now() >= miniInteractiveAt) {
        mini.style.setProperty('pointer-events', 'auto', 'important');
      }
      mini.setAttribute('aria-hidden', 'false');
      try { mini.scrollTop = 0; } catch (_) {}
    }

    if (miniVideo) {
      try {
        miniVideo.muted = true;
        miniVideo.loop = true;
        var playResult = miniVideo.play();
        if (playResult && playResult.catch) playResult.catch(function () {});
      } catch (_) {}
    }
  }

  function enforceMiniFrame() {
    if (!completed) return;
    hideGateAndOpening();
    showMiniFrame(Date.now() < miniInteractiveAt);
  }

  function startGuard() {
    guardTimer = clearTimer(guardTimer);
    var count = 0;
    guardTimer = setInterval(function () {
      enforceMiniFrame();
      count += 1;
      if (count >= 150) guardTimer = clearTimer(guardTimer);
    }, 100);
  }

  function finishDirect(reason) {
    if (completed) {
      enforceMiniFrame();
      return false;
    }

    running = false;
    completed = true;
    safetyTimer = clearTimer(safetyTimer);

    hideGateAndOpening();
    lockMiniInteraction();
    showMiniFrame(true);

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

    requestAnimationFrame(enforceMiniFrame);
    setTimeout(enforceMiniFrame, 60);
    setTimeout(enforceMiniFrame, 260);
    setTimeout(enforceMiniFrame, 700);
    startGuard();

    console.log('[DearANG] opening -> mini frame, input unlock delayed', reason || 'ended');
    return false;
  }

  function startDirect(event) {
    stopEvent(event);
    if (running) return false;

    running = true;
    completed = false;
    guardTimer = clearTimer(guardTimer);
    safetyTimer = clearTimer(safetyTimer);
    miniUnlockTimer = clearTimer(miniUnlockTimer);
    miniInteractiveAt = 0;

    var gate = byId('gate');
    var overlay = byId('openingCountdown');
    var mini = byId('miniWorld');
    var video = byId('openingCountdownVideo');

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
      mini.style.setProperty('pointer-events', 'none', 'important');
    }

    if (overlay) {
      overlay.style.removeProperty('display');
      overlay.style.removeProperty('opacity');
      overlay.style.removeProperty('pointer-events');
      overlay.classList.remove('done');
      overlay.classList.add('show');
      overlay.setAttribute('aria-hidden', 'false');
    }

    if (!video || !video.getAttribute('src')) return finishDirect('no-video');

    try {
      video.pause();
      video.currentTime = 0;
      video.loop = false;
      video.removeAttribute('loop');
      video.muted = false;
      video.volume = 1;
    } catch (_) {}

    video.onended = function () { finishDirect('ended'); };

    video.addEventListener('timeupdate', function nearEnd() {
      if (!running) {
        video.removeEventListener('timeupdate', nearEnd);
        return;
      }
      var duration = Number(video.duration || 0);
      var current = Number(video.currentTime || 0);
      if (duration > 0 && current >= duration - 0.12) {
        video.removeEventListener('timeupdate', nearEnd);
        finishDirect('near-end');
      }
    });

    try {
      var playResult = video.play();
      if (playResult && playResult.catch) {
        playResult.catch(function () {
          try {
            video.muted = true;
            var mutedPlay = video.play();
            if (mutedPlay && mutedPlay.catch) mutedPlay.catch(function () { finishDirect('play-blocked'); });
          } catch (_) {
            finishDirect('play-blocked');
          }
        });
      }
    } catch (_) {
      finishDirect('play-error');
    }

    safetyTimer = setTimeout(function () {
      if (running) finishDirect('safety-timeout');
    }, 120000);

    return false;
  }

  function blockGhostInput(event) {
    if (!completed || Date.now() >= miniInteractiveAt) return;
    var mini = byId('miniWorld');
    if (!mini) return;
    var target = event.target;
    if (target === mini || (target && mini.contains(target))) stopEvent(event);
  }

  function install() {
    window.startOpeningMemoryCountdown = startDirect;
    window.finishOpeningMemoryCountdown = finishDirect;
    window.enterWorld = startDirect;

    ['click', 'touchend', 'pointerup'].forEach(function (type) {
      document.addEventListener(type, blockGhostInput, true);
    });

    var gate = byId('gate');
    if (gate && gate.dataset.dearAngDirectBound !== '1') {
      gate.dataset.dearAngDirectBound = '1';
      var button = gate.querySelector('button');
      if (button) {
        button.removeAttribute('onclick');
        button.addEventListener('click', startDirect, true);
      }
    }

    var targets = [gate, byId('openingCountdown'), byId('miniWorld')].filter(Boolean);
    if (targets.length) {
      var observer = new MutationObserver(function () {
        if (completed) enforceMiniFrame();
      });
      targets.forEach(function (target) {
        observer.observe(target, { attributes: true, attributeFilter: ['class', 'style'] });
      });
    }
  }

  if (document.readyState === 'complete') install();
  else window.addEventListener('load', install, { once: true });
})();