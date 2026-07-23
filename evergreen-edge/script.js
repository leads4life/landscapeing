(() => {
  'use strict';
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
  const header = $('#site-header');
  const menuButton = $('.menu-button');
  const mobileMenu = $('#mobile-menu');
  let lastFocus;

  function setMenu(open, returnFocus = false) {
    if (!menuButton || !mobileMenu) return;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    mobileMenu.hidden = !open;
    document.body.classList.toggle('no-scroll', open);
    if (open) $('a', mobileMenu)?.focus();
    if (!open && returnFocus) menuButton.focus();
  }
  menuButton?.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  $$('a', mobileMenu).forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('click', event => {
    if (mobileMenu && !mobileMenu.hidden && !mobileMenu.contains(event.target) && !menuButton.contains(event.target)) setMenu(false);
  });

  const lightbox = $('#lightbox');
  function closeLightbox() {
    if (!lightbox || lightbox.hidden) return;
    lightbox.hidden = true;
    document.body.classList.remove('no-scroll');
    lastFocus?.focus();
  }
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (mobileMenu && !mobileMenu.hidden) setMenu(false, true);
    closeLightbox();
  });

  window.addEventListener('scroll', () => {
    header?.classList.toggle('is-compact', window.scrollY > 25);
    $('.scroll-top')?.classList.toggle('show', window.scrollY > 450);
  }, { passive: true });
  $('.scroll-top')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  $$('.faq-item').forEach((item, index) => {
    const button = $('button', item); const answer = $('.faq-answer', item);
    if (!button || !answer) return;
    const buttonId = `faq-button-${index + 1}`; const answerId = `faq-answer-${index + 1}`;
    button.id = buttonId; button.setAttribute('aria-controls', answerId);
    answer.id = answerId; answer.setAttribute('role', 'region'); answer.setAttribute('aria-labelledby', buttonId);
    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!open)); answer.hidden = open;
      button.lastElementChild.textContent = open ? '+' : '–';
    });
  });

  $$('[data-future-date]').forEach(input => { input.min = new Date().toISOString().slice(0, 10); });
  $$('[data-phone]').forEach(input => input.addEventListener('input', () => {
    const digits = input.value.replace(/\D/g, '').slice(0, 10);
    input.value = digits.length > 6 ? `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}` : digits.length > 3 ? `(${digits.slice(0, 3)}) ${digits.slice(3)}` : digits;
  }));
  $$('.estimate-form').forEach(form => form.addEventListener('submit', event => {
    const status = $('.form-status', form);
    $$('.estimate-form [aria-invalid="true"]', form).forEach(field => field.removeAttribute('aria-invalid'));
    if (!form.checkValidity()) {
      event.preventDefault(); const invalid = $(':invalid', form); invalid?.setAttribute('aria-invalid', 'true');
      status.textContent = 'Please complete the highlighted required field and check your email address.';
      status.className = 'form-status error'; invalid?.focus(); return;
    }
    if (window.location.protocol === 'file:') { event.preventDefault(); status.textContent = 'Demo request received. Configure a hosted form endpoint before publishing.'; status.className = 'form-status'; form.reset(); }
  }));

  $$('.filter-button').forEach(button => button.addEventListener('click', () => {
    $$('.filter-button').forEach(item => item.classList.remove('is-active')); button.classList.add('is-active');
    $$('.filter-item').forEach(item => { item.hidden = button.dataset.filter !== 'all' && item.dataset.category !== button.dataset.filter; });
  }));
  $$('.project-open').forEach(button => button.addEventListener('click', () => {
    if (!lightbox) return; lastFocus = button;
    $('img', lightbox).src = button.dataset.image; $('img', lightbox).alt = button.dataset.alt;
    $('p', lightbox).textContent = button.dataset.alt; lightbox.hidden = false; document.body.classList.add('no-scroll'); $('.lightbox-close', lightbox)?.focus();
  }));
  $('.lightbox-close')?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });

  const slides = $$('.testimonial'); let current = 0;
  const show = index => slides.forEach((slide, i) => slide.classList.toggle('is-active', i === index));
  const controls = $('.slider-controls');
  if (controls && slides.length) {
    const [previousButton, nextButton] = $$('button', controls);
    previousButton?.addEventListener('click', () => { current = (current - 1 + slides.length) % slides.length; show(current); });
    nextButton?.addEventListener('click', () => { current = (current + 1) % slides.length; show(current); });
  }
  $$('a[href^="#"]').forEach(anchor => anchor.addEventListener('click', event => { const target = $(anchor.getAttribute('href')); if (target) { event.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); } }));
  $$('.year').forEach(year => { year.textContent = new Date().getFullYear(); });
})();
