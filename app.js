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

// Form submission to Telegram bot (placeholder token)
const BOT_TOKEN = 'REPLACE_TELEGRAM_BOT_TOKEN'; // TODO: подставить реальный токен бота
const CHAT_ID = ''; // TODO: подставить chat_id, куда отправлять заявки
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
      if (BOT_TOKEN && CHAT_ID) {
        const text = `Новая заявка ЖК Шафран\nИмя: ${name}\nТелефон: ${phone}`;
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: CHAT_ID, text })
        });
        statusEl.textContent = 'Отправлено! Менеджер свяжется с вами.';
        statusEl.style.color = '#9ae6b4';
      } else {
        statusEl.textContent = 'Отправка отключена (нужно задать токен и chat_id).';
        statusEl.style.color = '#fca5a5';
      }
    } catch (err) {
      statusEl.textContent = 'Ошибка отправки, попробуйте позже';
      statusEl.style.color = '#fca5a5';
    }
  });
}

// Fade-in on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('fade-in');
  });
}, { threshold: 0.15 });

document.querySelectorAll('.card, .section-title, .hero-text, .hero-visual, .gallery img').forEach(el => observer.observe(el));

// Calculator
const priceEl = document.getElementById('price');
const downEl = document.getElementById('down');
const yearsEl = document.getElementById('years');
const calcBtn = document.getElementById('calc-btn');
const calcResult = document.getElementById('calc-result');
if (calcBtn) {
  calcBtn.addEventListener('click', () => {
    const price = parseFloat(priceEl.value || '0');
    const down = parseFloat(downEl.value || '0');
    const years = parseFloat(yearsEl.value || '0');
    if (!price || !years) { calcResult.textContent = 'Заполните стоимость и срок.'; return; }
    const body = Math.max(0, price - down);
    const months = years * 12;
    const rate = 0.12 / 12; // условная ставка
    const payment = rate ? (body * rate) / (1 - Math.pow(1 + rate, -months)) : body / months;
    calcResult.textContent = `Ориентировочный платёж: ~${Math.round(payment).toLocaleString('ru-RU')} ₽/мес`;
  });
}

// Chips answers
const chips = document.querySelectorAll('.chip');
const chipAnswer = document.getElementById('chip-answer');
chips.forEach(chip => chip.addEventListener('click', () => {
  chipAnswer.textContent = chip.dataset.answer || '';
}));

// Copy contact
const copyBtn = document.getElementById('copy-contact');
const copyStatus = document.getElementById('copy-status');
if (copyBtn) {
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('+7 (000) 000-00-00');
      copyStatus.textContent = 'Номер скопирован';
    } catch (e) {
      copyStatus.textContent = 'Не удалось скопировать';
    }
  });
}

// Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');
document.querySelectorAll('.lightbox').forEach(img => {
  img.addEventListener('click', () => {
    lightbox.classList.add('show');
    lightboxImg.src = img.src;
  });
});
if (lightboxClose) lightboxClose.addEventListener('click', () => lightbox.classList.remove('show'));
lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.remove('show'); });
