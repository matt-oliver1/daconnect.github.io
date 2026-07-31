// Bootstrap's collapse plugin only reacts to the toggler button, so on mobile
// the menu stayed open after tapping a nav link or the page behind it. This
// dismisses it on any of the ways a visitor would expect it to close.
document.addEventListener('DOMContentLoaded', function () {
  const navbar = document.querySelector('.navbar');
  const collapseEl = document.getElementById('navbarNav');
  if (!navbar || !collapseEl || !window.bootstrap) return;

  function closeMenu() {
    if (!collapseEl.classList.contains('show')) return;
    bootstrap.Collapse.getOrCreateInstance(collapseEl, { toggle: false }).hide();
  }

  // Any link in the menu — in-page anchor or another page.
  collapseEl.addEventListener('click', function (e) {
    if (e.target.closest('a')) closeMenu();
  });

  // Tapping anywhere outside the navbar. The toggler lives inside .navbar, so
  // this never fights with its own toggle.
  document.addEventListener('click', function (e) {
    if (!navbar.contains(e.target)) closeMenu();
  });

  // Widening past the lg breakpoint leaves the menu laid out horizontally but
  // still flagged open, which then reads as stale state on the way back down.
  window.addEventListener('resize', function () {
    if (window.innerWidth >= 992) closeMenu();
  });
});
