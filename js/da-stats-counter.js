document.addEventListener('DOMContentLoaded', function() {
  var statNumbers = document.querySelectorAll('.da-stat-number');
  if (!statNumbers.length) return;

  // Fetch live stats from the API, fall back to hardcoded defaults on failure
  fetch('https://app.daconnect.com.au/api/public/stats/development-applications')
    .then(function(res) { return res.json(); })
    .then(function(data) {
      var lastYear = document.getElementById('lastYear');
      var lastMonth = document.getElementById('lastMonth');
      var lastWeek = document.getElementById('lastWeek');

      if (lastYear && data.lastYear != null) lastYear.dataset.target = data.lastYear;
      if (lastMonth && data.lastMonth != null) lastMonth.dataset.target = data.lastMonth;
      if (lastWeek && data.lastWeek != null) lastWeek.dataset.target = data.lastWeek;
    })
    .catch(function() {
      // Keep the default data-target values from the HTML
    })
    .finally(function() {
      initCounterObserver();
    });

  function animateCounters() {
    statNumbers.forEach(function(el) {
      var target = parseInt(el.dataset.target, 10);
      var duration = 2000;
      var startTime = performance.now();

      function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
      }

      function update(currentTime) {
        var elapsed = currentTime - startTime;
        var progress = Math.min(elapsed / duration, 1);
        var easedProgress = easeOutCubic(progress);
        var current = Math.round(easedProgress * target);
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

  function initCounterObserver() {
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
  }
});
