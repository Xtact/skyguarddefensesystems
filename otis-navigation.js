(() => {
  const header = document.getElementById('siteHeader');
  const menuToggle = document.getElementById('menuToggle');
  const primaryNav = document.getElementById('primaryNav');
  if (!header || !menuToggle || !primaryNav) return;

  let lastScrollY = window.scrollY;
  const scrollThreshold = 12;

  const closeMenu = () => {
    menuToggle.classList.remove('is-open');
    primaryNav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation menu');
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = primaryNav.classList.toggle('is-open');
    menuToggle.classList.toggle('is-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  });

  primaryNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 760) closeMenu(); });

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    const scrollingDown = currentScrollY > lastScrollY + scrollThreshold;
    const scrollingUp = currentScrollY < lastScrollY - scrollThreshold;
    header.classList.toggle('is-scrolled', currentScrollY > 8);
    if (currentScrollY <= 16) {
      header.classList.remove('is-hidden');
    } else if (scrollingDown) {
      header.classList.add('is-hidden');
      closeMenu();
    } else if (scrollingUp) {
      header.classList.remove('is-hidden');
    }
    lastScrollY = currentScrollY;
  }, { passive: true });
})();
