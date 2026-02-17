// Smooth scroll for nav and buttons
function smoothScroll(target) {
  const el = document.querySelector(target);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.querySelectorAll('nav a, [data-scroll], .nav-btn').forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const href = a.getAttribute('href') || a.dataset.scroll;
    if (href) smoothScroll(href);
  });
});

// Telegram WebApp API
if (window.Telegram && window.Telegram.WebApp) {
  const tg = window.Telegram.WebApp;
  tg.expand();
}

// Loader hide after animation
const loader = document.getElementById('loader');
if (loader) {
  setTimeout(() => loader.classList.add('hide'), 2000);
  setTimeout(() => loader.remove(), 2500);
}

// Form submission stub (send to bot endpoint placeholder)
const form = document.getElementById('lead-form');
const statusEl = document.getElementById('form-status');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const name = formData.get('name');
    const phone = formData.get('phone');
    statusEl.textContent = 'Отправляем...';
    try {
      // TODO: заменить на реальный бот/сервер
      // await fetch('/lead', { method: 'POST', body: JSON.stringify({name, phone}) });
      console.log('Lead:', { name, phone });
      statusEl.textContent = 'Отправлено! Менеджер свяжется с вами.';
      statusEl.style.color = '#9ae6b4';
    } catch (err) {
      statusEl.textContent = 'Ошибка отправки, попробуйте позже';
      statusEl.style.color = '#fca5a5';
    }
  });
}

// Simple fade-in on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('fade-in');
  });
}, { threshold: 0.15 });

document.querySelectorAll('.card, .section-title, .hero-text, .hero-visual').forEach(el => observer.observe(el));
