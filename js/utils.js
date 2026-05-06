window.SiteUtils = {
  qs: (selector, scope = document) => scope.querySelector(selector),
  qsa: (selector, scope = document) => Array.from(scope.querySelectorAll(selector)),
  lockBody: function(isLocked) {
    document.body.style.overflow = isLocked ? 'hidden' : '';
  },
  getCurrentNavKey: function() {
    const page = document.body.dataset.page || 'home';
    const hash = window.location.hash.replace('#', '');
    if (page === 'home') return hash || 'home';
    return page;
  }
};
