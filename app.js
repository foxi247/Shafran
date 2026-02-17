// Smooth scroll for nav and buttons
function smoothScroll(target) {
  const el = document.querySelector(target);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.querySelectorAll('nav a, [data-scroll]').forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const href = a.getAttribute('href') || a.dataset.scroll;
    if (href) smoothScroll(href);
  });
});

// Form submission (dummy)
const form = document.getElementById('lead-form');
const statusEl = document.getElementById('form-status');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const name = formData.get('name');
    const phone = formData.get('phone');
    statusEl.textContent = 'Отправлено! Менеджер свяжется с вами.';
    statusEl.style.color = '#2e5f46';
    console.log('Lead:', { name, phone });
  });
}

// Simple fade-in on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('fade-in');
  });
}, { threshold: 0.15 });

document.querySelectorAll('.card, .section-title, .hero-text, .hero-visual').forEach(el => observer.observe(el));

// Telegram WebApp ready hook (optional)
if (window.Telegram && window.Telegram.WebApp) {
  window.Telegram.WebApp.ready();
}
