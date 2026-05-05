const qs = (selector, scope = document) => scope.querySelector(selector);
const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

function lockBody(isLocked) {
  document.body.style.overflow = isLocked ? 'hidden' : '';
}

function getCurrentNavKey() {
  const page = document.body.dataset.page || 'home';
  if (page === 'home') {
    const hash = window.location.hash.replace('#', '');
    if (['services', 'projects', 'blog'].includes(hash)) return hash;
    return 'home';
  }
  return page;
}

function setActiveNav(key) {
  qsa('[data-nav]').forEach((link) => {
    link.classList.toggle('active', link.dataset.nav === key);
  });
}

window.SiteUtils = {
  qs,
  qsa,
  lockBody,
  getCurrentNavKey,
  setActiveNav,
};
