document.addEventListener('DOMContentLoaded', function() {
  var animatedElements = document.querySelectorAll('.scroll-animate');
  if (!animatedElements.length) return;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        entry.target.classList.remove('visible');
      }
    });
  }, { threshold: 0.15 });

  animatedElements.forEach(function(el) {
    observer.observe(el);
  });
});
