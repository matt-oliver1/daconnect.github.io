document.addEventListener('DOMContentLoaded', function() {
  var animatedElements = document.querySelectorAll('.scroll-animate');
  if (!animatedElements.length) return;

  var isMobile = window.innerWidth <= 767;
  var threshold = isMobile ? 0.7 : 0.15;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        entry.target.classList.remove('visible');
      }
    });
  }, { threshold: threshold });

  animatedElements.forEach(function(el) {
    observer.observe(el);
  });

  // Why Choose Us - industry card animations
  var industryGrid = document.querySelector('#whychooseus .row.g-4');
  var industryCards = document.querySelectorAll('#whychooseus .industry-card');
  if (industryGrid && industryCards.length) {
    if (isMobile) {
      // Mobile: observe the first card of each row pair (0,2,4,6)
      // When it enters view, animate both cards in that row
      var cardsArray = Array.prototype.slice.call(industryCards);
      var pairObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            // Find this card's index and animate it + its row partner
            var idx = cardsArray.indexOf(entry.target);
            cardsArray[idx].classList.add('visible');
            if (cardsArray[idx + 1]) {
              cardsArray[idx + 1].classList.add('visible');
            }
          } else {
            var idx = cardsArray.indexOf(entry.target);
            cardsArray[idx].classList.remove('visible');
            if (cardsArray[idx + 1]) {
              cardsArray[idx + 1].classList.remove('visible');
            }
          }
        });
      }, { threshold: 0.5 });

      // Observe every other card (first of each pair)
      for (var i = 0; i < cardsArray.length; i += 2) {
        pairObserver.observe(cardsArray[i]);
      }
    } else {
      // Desktop: observe the grid, stagger all cards at once
      var gridObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            industryCards.forEach(function(card) {
              card.classList.add('visible');
            });
          } else {
            industryCards.forEach(function(card) {
              card.classList.remove('visible');
            });
          }
        });
      }, { threshold: 0.2 });

      gridObserver.observe(industryGrid);
    }
  }
});
