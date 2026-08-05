document.addEventListener('DOMContentLoaded', function() {
  var statNumbers = document.querySelectorAll('.da-stat-number');
  if (!statNumbers.length) return;

  // Fetch live stats from the API, fall back to hardcoded defaults on failure.
  // Response splits by region (council group): top-level southAustralia /
  // southEastQueensland, each { total, lastYear, lastMonth, lastWeek }. Falls
  // back to legacy flat top-level fields (= South Australia) if the region
  // object is absent.
  fetch('https://app.daconnect.com.au/api/public/stats/development-applications')
    .then(function(res) { return res.json(); })
    .then(function(data) {
      // South Australia: prefer the region object, else legacy top-level fields.
      applyRegion('sa', data.southAustralia || {
        lastYear: data.lastYear,
        lastMonth: data.lastMonth,
        lastWeek: data.lastWeek
      });

      // South East Queensland: only if present; otherwise the HTML defaults remain.
      applyRegion('gc', data.southEastQueensland || {});
    })
    .catch(function() {
      // Keep the default data-target values from the HTML
    })
    .finally(function() {
      initCounterObserver();
    });

  // Apply a {lastYear,lastMonth,lastWeek} object to one region's counters.
  // Only overrides data-target when the value is non-null/undefined, so a
  // missing field leaves the HTML default in place.
  function applyRegion(prefix, stats) {
    setTarget(prefix + '-lastYear', stats.lastYear);
    setTarget(prefix + '-lastMonth', stats.lastMonth);
    setTarget(prefix + '-lastWeek', stats.lastWeek);
  }

  function setTarget(id, value) {
    if (value == null) return;
    var el = document.getElementById(id);
    if (el) el.dataset.target = value;
  }

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
