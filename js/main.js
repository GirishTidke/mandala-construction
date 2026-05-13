const utils = window.SiteUtils || {};
const qs = utils.qs || ((selector, scope = document) => scope.querySelector(selector));
const qsa = utils.qsa || ((selector, scope = document) => Array.from(scope.querySelectorAll(selector)));
const lockBody = utils.lockBody || ((isLocked) => {
  document.body.style.overflow = isLocked ? 'hidden' : '';
  document.body.style.position = isLocked ? 'fixed' : '';
  document.body.style.width = isLocked ? '100%' : '';
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

// ─── Telegram Config ────────────────────────────────────────────────────────
const TELEGRAM_BOT_ID = '8704884272:AAGagkO7hq-_qJRF6yn0BZX-7gTiZMx8XJA';
const TELEGRAM_CHAT_ID = 5211441236;

function sendToTelegram(text) {
  return fetch('https://api.telegram.org/bot' + TELEGRAM_BOT_ID + '/sendMessage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: text })
  });
}

function buildTelegramMessage(source, data) {
  return (
    '📩 New Enquiry from The Mandala Website\n' +
    '━━━━━━━━━━━━━━━━━━━━━━\n' +
    '📋 Form: ' + source + '\n\n' +
    '👤 Name: ' + data.name + '\n' +
    '📞 Phone: ' + data.phone + '\n' +
    '📧 Email: ' + (data.email || 'Not provided') + '\n' +
    '🔧 Service: ' + (data.service || 'Not selected') + '\n' +
    '💰 Budget: ' + (data.budget || 'Not specified') + '\n\n' +
    '💬 Message:\n' + data.message
  );
}
// ────────────────────────────────────────────────────────────────────────────

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
  const nav = document.getElementById('mobileNav');
  const toggle = document.getElementById('mobileToggle');
  if (!nav || !toggle) return;
  nav.classList.remove('open');
  toggle.classList.remove('open');
  lockBody(false);
}

function toggleMobileNav() {
  const nav = document.getElementById('mobileNav');
  const toggle = document.getElementById('mobileToggle');
  if (!nav || !toggle) return;
  const isOpen = nav.classList.contains('open');
  if (isOpen) {
    nav.classList.remove('open');
    toggle.classList.remove('open');
    lockBody(false);
  } else {
    nav.classList.add('open');
    toggle.classList.add('open');
    lockBody(true);
  }
}

function submitEnquiry(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const btn = qs('#enquirySubmitBtn', form.closest('.modal-box') || document);

  const phone = form.phone.value.trim();
  const message = form.message.value.trim();
  if (!phone) { showToast('Please enter your phone number.', 'error'); return; }
  if (!message) { showToast('Please write a message.', 'error'); return; }

  btn.textContent = 'Sending...';
  btn.classList.add('loading');
  btn.disabled = true;

  const data = {
    name: ((form.fname ? form.fname.value.trim() : '') + ' ' + (form.lname ? form.lname.value.trim() : '')).trim(),
    phone: phone,
    email: form.email ? form.email.value.trim() : '',
    service: form.service ? form.service.value : '',
    budget: form.budget ? form.budget.value : '',
    message: message
  };

  sendToTelegram(buildTelegramMessage('Enquiry Modal', data))
    .then(function(res) {
      if (!res.ok) throw new Error('API error');
      btn.textContent = 'Send Message ->';
      btn.classList.remove('loading');
      btn.disabled = false;
      form.reset();
      closeEnquiry();
      showToast("Message received. We'll get back to you within 24 hours.");
    })
    .catch(function() {
      btn.textContent = 'Send Message ->';
      btn.classList.remove('loading');
      btn.disabled = false;
      showToast('Failed to send. Please call us directly.', 'error');
    });
}

function submitContact(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const btn = qs('#contactSubmitBtn', form.closest('.contact-form-box') || document);

  const phone = form.phone.value.trim();
  const message = form.message.value.trim();
  if (!phone) { showToast('Please enter your phone number.', 'error'); return; }
  if (!message) { showToast('Please write a message.', 'error'); return; }

  btn.textContent = 'Sending...';
  btn.classList.add('loading');
  btn.disabled = true;

  const data = {
    name: ((form.fname ? form.fname.value.trim() : '') + ' ' + (form.lname ? form.lname.value.trim() : '')).trim(),
    phone: phone,
    email: form.email ? form.email.value.trim() : '',
    service: form.service ? form.service.value : '',
    budget: form.budget ? form.budget.value : '',
    message: message
  };

  sendToTelegram(buildTelegramMessage('Contact Page Form', data))
    .then(function(res) {
      if (!res.ok) throw new Error('API error');
      btn.textContent = 'Send Message ->';
      btn.classList.remove('loading');
      btn.disabled = false;
      form.reset();
      showToast("Message received. We'll get back to you within 24 hours.");
    })
    .catch(function() {
      btn.textContent = 'Send Message ->';
      btn.classList.remove('loading');
      btn.disabled = false;
      showToast('Failed to send. Please call us directly.', 'error');
    });
}

function initProjectFilters() {
  const filterBar = document.getElementById('filterBar');
  const projectsGrid = document.getElementById('projectsGrid');
  if (!filterBar || !projectsGrid) return;

  const buttons = filterBar.querySelectorAll('[data-filter]');
  const cards = projectsGrid.querySelectorAll('.proj-all-card');

  buttons.forEach((button) => {
    button.addEventListener('click', function() {
      const category = this.getAttribute('data-filter');
      buttons.forEach((btn) => btn.classList.remove('active'));
      this.classList.add('active');
      cards.forEach((card) => {
        const cardCategory = card.getAttribute('data-cat');
        if (category === 'all' || cardCategory === category) {
          card.classList.remove('hidden');
          card.style.display = '';
        } else {
          card.classList.add('hidden');
          card.style.display = 'none';
        }
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
  const toggle = document.getElementById('mobileToggle');
  const mobileLinks = document.querySelectorAll('[data-close-mobile]');

  if (toggle) {
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      toggleMobileNav();
    });
  }

  mobileLinks.forEach((link) => {
    link.addEventListener('click', function() {
      closeMobileNav();
    });
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