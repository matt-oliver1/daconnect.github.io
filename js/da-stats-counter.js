document.addEventListener('DOMContentLoaded', function() {
  const statNumbers = document.querySelectorAll('.da-stat-number');
  if (!statNumbers.length) return;

  function animateCounters() {
    statNumbers.forEach(function(el) {
      const target = parseInt(el.dataset.target, 10);
      const duration = 2000;
      const startTime = performance.now();

      function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
      }

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutCubic(progress);
        const current = Math.round(easedProgress * target);
        el.textContent = current.toLocaleString();

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }

      requestAnimationFrame(update);
    });
  }

  function resetCounters() {
    statNumbers.forEach(function(el) {
      el.textContent = '0';
    });
  }

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        animateCounters();
      } else {
        resetCounters();
      }
    });
  }, { threshold: 0.3 });

  var statsSection = document.getElementById('dastats');
  if (statsSection) {
    observer.observe(statsSection);
  }
});
