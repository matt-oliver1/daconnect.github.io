document.addEventListener('DOMContentLoaded', function () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveLink() {
    let current = '';
    const scrollPosition = window.scrollY + 150; // Adjust offset as needed

    if (window.scrollY < 100) {
      navLinks.forEach(link => link.classList.remove('active'));
      const homeLink = document.querySelector('.nav-link[onclick*="scrollTo"]');
      if (homeLink) homeLink.classList.add('active');
      return;
    }

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = '#' + section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === current) {
        link.classList.add('active');
      }
    });
  }

  navLinks.forEach(link => {
    if (link.getAttribute('onclick')) return; // Skip if already has inline onclick
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        window.scrollTo({ top: targetSection.offsetTop - 80, behavior: 'smooth' });
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
      }
    });
  });

  window.addEventListener('scroll', updateActiveLink);
  updateActiveLink();
});
