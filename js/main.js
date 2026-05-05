const utils = window.SiteUtils || {};
const qs = utils.qs || ((selector, scope = document) => scope.querySelector(selector));
const qsa = utils.qsa || ((selector, scope = document) => Array.from(scope.querySelectorAll(selector)));
const lockBody = utils.lockBody || ((isLocked) => {
  document.body.style.overflow = isLocked ? 'hidden' : '';
});
const getCurrentNavKey = utils.getCurrentNavKey || (() => {
  const page = document.body.dataset.page || 'home';
  if (page === 'home') {
    const hash = window.location.hash.replace('#', '');
    if (['services', 'projects', 'blog'].includes(hash)) return hash;
    return 'home';
  }
  return page;
});
const setActiveNav = utils.setActiveNav || ((key) => {
  qsa('[data-nav]').forEach((link) => {
    link.classList.toggle('active', link.dataset.nav === key);
  });
});

function openEnquiry() {
  const modal = qs('#enquiryModal');
  if (!modal) return;
  modal.classList.add('open');
  lockBody(true);
}

function closeEnquiry() {
  const modal = qs('#enquiryModal');
  if (!modal) return;
  modal.classList.remove('open');
  lockBody(false);
}

function showToast(message, type = 'success') {
  const toast = qs('#toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = `toast ${type}`;
  toast.classList.add('show');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 4200);
}

function updateNavbarState() {
  const nav = qs('#navbar');
  if (nav) {
    nav.classList.toggle('scrolled', window.scrollY > 30);
  }
  setActiveNav(getCurrentNavKey());
}

function closeMobileNav() {
  const nav = qs('#mobileNav');
  const toggle = qs('#mobileToggle');
  if (!nav || !toggle) return;
  nav.classList.remove('open');
  toggle.classList.remove('open');
  lockBody(false);
}

function toggleMobileNav() {
  const nav = qs('#mobileNav');
  const toggle = qs('#mobileToggle');
  if (!nav || !toggle) return;
  const isOpen = nav.classList.toggle('open');
  toggle.classList.toggle('open', isOpen);
  lockBody(isOpen);
}

function submitEnquiry(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const btn = qs('#enquirySubmitBtn', form.closest('.modal-box') || document);
  const phone = form.phone.value.trim();
  const message = form.message.value.trim();
  if (!phone) {
    showToast('Please enter your phone number.', 'error');
    return;
  }
  if (!message) {
    showToast('Please write a message.', 'error');
    return;
  }

  btn.textContent = 'Sending...';
  btn.classList.add('loading');
  btn.disabled = true;

  window.setTimeout(() => {
    btn.textContent = 'Send Message ->';
    btn.classList.remove('loading');
    btn.disabled = false;
    form.reset();
    closeEnquiry();
    showToast("Message received. We'll get back to you within 24 hours.");
  }, 1600);
}

function submitContact(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const btn = qs('#contactSubmitBtn', form.closest('.contact-form-box') || document);
  const phone = form.phone.value.trim();
  const message = form.message.value.trim();
  if (!phone) {
    showToast('Please enter your phone number.', 'error');
    return;
  }
  if (!message) {
    showToast('Please write a message.', 'error');
    return;
  }

  btn.textContent = 'Sending...';
  btn.classList.add('loading');
  btn.disabled = true;

  window.setTimeout(() => {
    btn.textContent = 'Send Message ->';
    btn.classList.remove('loading');
    btn.disabled = false;
    form.reset();
    showToast("Message received. We'll get back to you within 24 hours.");
  }, 1800);
}

function initProjectFilters() {
  const buttons = qsa('[data-filter]');
  const cards = qsa('.proj-all-card');
  
  console.log('Filter buttons found:', buttons.length);
  console.log('Project cards found:', cards.length);
  
  if (!buttons.length) return;

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const category = button.dataset.filter;
      console.log('Filter clicked:', category);
      
      buttons.forEach((item) => item.classList.toggle('active', item === button));
      
      cards.forEach((card) => {
        const cardCategory = card.dataset.cat;
        const matches = category === 'all' || cardCategory === category;
        console.log(`Card ${cardCategory}: ${matches ? 'show' : 'hide'}`);
        card.classList.toggle('hidden', !matches);
      });
    });
  });
}

function initFaq() {
  qsa('.faq-q').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const answer = trigger.nextElementSibling;
      const isOpen = answer.classList.contains('open');
      qsa('.faq-a').forEach((item) => item.classList.remove('open'));
      qsa('.faq-q').forEach((item) => item.classList.remove('open'));
      if (!isOpen) {
        answer.classList.add('open');
        trigger.classList.add('open');
      }
    });
  });
}

function initScrollLinks() {
  qsa('[data-scroll-target]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const target = qs(trigger.dataset.scrollTarget);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

function initForms() {
  const enquiryForm = qs('#enquiryForm');
  if (enquiryForm) enquiryForm.addEventListener('submit', submitEnquiry);
  const contactForm = qs('#contactForm');
  if (contactForm) contactForm.addEventListener('submit', submitContact);
}

function initModal() {
  const modal = qs('#enquiryModal');
  if (modal) {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) closeEnquiry();
    });
  }
}

function initMobileNav() {
  const toggle = qs('#mobileToggle');
  if (toggle) toggle.addEventListener('click', toggleMobileNav);
  qsa('[data-close-mobile]').forEach((link) => {
    link.addEventListener('click', closeMobileNav);
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeEnquiry();
    closeMobileNav();
  }
});

document.addEventListener('click', (event) => {
  const openTrigger = event.target.closest('[data-open-enquiry]');
  if (openTrigger) {
    event.preventDefault();
    openEnquiry();
    return;
  }

  const closeTrigger = event.target.closest('[data-close-enquiry]');
  if (closeTrigger) {
    event.preventDefault();
    closeEnquiry();
  }
});

window.addEventListener('hashchange', updateNavbarState);
window.addEventListener('scroll', updateNavbarState);

function initApp() {
  updateNavbarState();
  initModal();
  initMobileNav();
  initForms();
  initProjectFilters();
  initFaq();
  initScrollLinks();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
