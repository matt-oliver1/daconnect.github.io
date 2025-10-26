document.addEventListener('DOMContentLoaded', function () {
  function initAutoScroller(container, viewport, img) {
    if (!container || !viewport || !img) return;

    let dist = 0;
    let inView = false;
    let rafId = null;
    let startTs = null;
    let durationMs = 10000; // will be recomputed from distance
    const pauseTopMs = 500;    // brief pause at top
    const pauseBottomMs = 2000; // pause at bottom
    let phase = 'scroll'; // 'scroll' | 'pauseTop' | 'pauseBottom'
    let pauseUntilTs = null;

    function updateScrollDistance() {
      const imgHeight = img.offsetHeight || img.getBoundingClientRect().height;
      const viewportHeight = viewport.clientHeight; // inner white card height
      const bottomRevealPx = 12; // nudge to ensure the very bottom is visible
      dist = Math.max(0, imgHeight - viewportHeight + bottomRevealPx);
    }

    function setTranslate(progress) {
      const offset = dist * progress;
      img.style.transform = `translateY(${-offset}px)`;
    }

    function tick(ts) {
      if (!inView || dist <= 0) {
        rafId = null;
        return;
      }
      // Handle pause phases
      if (phase === 'pauseTop') {
        setTranslate(0);
        if (pauseUntilTs == null) pauseUntilTs = ts + pauseTopMs;
        if (ts >= pauseUntilTs) {
          pauseUntilTs = null;
          phase = 'scroll';
          startTs = null; // restart scroll timing
        }
        rafId = requestAnimationFrame(tick);
        return;
      }
      if (phase === 'pauseBottom') {
        setTranslate(1);
        if (pauseUntilTs == null) pauseUntilTs = ts + pauseBottomMs;
        if (ts >= pauseUntilTs) {
          pauseUntilTs = null;
          phase = 'pauseTop'; // jump back to top, then pause briefly
          startTs = null;
        }
        rafId = requestAnimationFrame(tick);
        return;
      }
      // Scrolling phase
      if (startTs == null) startTs = ts;
      const elapsed = ts - startTs;
      const progress = Math.min(1, elapsed / durationMs);
      setTranslate(progress);
      if (progress >= 1) {
        // Reached bottom — enter bottom pause
        phase = 'pauseBottom';
        pauseUntilTs = null;
      }
      rafId = requestAnimationFrame(tick);
    }

    function measureAndUpdate() {
      updateScrollDistance();
      const speedPxPerSec = 40; // tune speed
      durationMs = Math.max(8000, (dist / speedPxPerSec) * 1000);
      if (inView) {
        startTs = null;
        if (!rafId) rafId = requestAnimationFrame(tick);
      }
    }

    if (img.complete) {
      measureAndUpdate();
    } else {
      img.addEventListener('load', measureAndUpdate);
    }
    window.addEventListener('resize', measureAndUpdate);

    // Observe visibility to start/stop the loop
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.05) {
          inView = true;
          startTs = null;
          phase = 'pauseTop'; // show the top first, then begin scrolling
          if (!rafId) rafId = requestAnimationFrame(tick);
        } else {
          inView = false;
          startTs = null;
          pauseUntilTs = null;
        }
      });
    }, { threshold: [0, 0.05, 0.2, 0.6] });

    observer.observe(container);
  }

  // 1) Preserve existing behavior for the Exclusive section if IDs exist
  (function initExclusiveById() {
    const container = document.getElementById('exclusiveImageContainer');
    const viewport = document.getElementById('exclusiveViewport');
    const img = document.getElementById('exclusiveImage');
    if (container && viewport && img) {
      initAutoScroller(container, viewport, img);
    }
  })();

  // 2) Initialize any new class-based auto scroll mockups
  document.querySelectorAll('.auto-scroll-container').forEach(container => {
    const viewport = container.querySelector('.auto-scroll-viewport');
    const img = container.querySelector('.auto-scroll-image');
    if (viewport && img) {
      initAutoScroller(container, viewport, img);
    }
  });
});
