/**
 * Safran MiniApp v2.0
 * Updated: 2026-02-17
 * Features: Smooth scroll, animations, Telegram WebApp, form handling
 */

// Telegram WebApp initialization
let tg = null;
if (window.Telegram && window.Telegram.WebApp) {
  tg = window.Telegram.WebApp;
  tg.expand();
  tg.ready();
}

// Smooth scroll with offset
function smoothScroll(target) {
  const el = document.querySelector(target);
  if (!el) return;
  
  const headerHeight = document.querySelector('.nav')?.offsetHeight || 60;
  const targetPosition = el.offsetTop - headerHeight - 16;
  
  window.scrollTo({
    top: targetPosition,
    behavior: 'smooth'
  });
  
  // Update URL without jump
  history.pushState(null, '', target);
}

// Initialize navigation
function initNavigation() {
  // Nav links and scroll buttons
  document.querySelectorAll('nav a, [data-scroll], .nav-item').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href') || link.dataset.scroll;
      if (href && href.startsWith('#')) {
        e.preventDefault();
        smoothScroll(href);
        updateActiveNav(href);
      }
    });
  });

  // Active nav on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav nav a, .nav-item');
  
  function updateActiveNav() {
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}` || 
              link.dataset.scroll === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  
  window.addEventListener('scroll', updateActiveNav, { passive: true });
}

// Scroll animations with Intersection Observer
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    '.card, .section-header, .hero-content, .hero-visual, .hero-card, .gallery img'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        entry.target.style.animationDelay = `${index * 0.1}s`;
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  animatedElements.forEach(el => observer.observe(el));
}

// Loader
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  
  setTimeout(() => {
    loader.classList.add('fade-in');
    setTimeout(() => loader.remove(), 400);
  }, 2200);
}

// Form handling
async function initLeadForm() {
  const form = document.getElementById('lead-form');
  if (!form) return;

  const statusEl = document.getElementById('form-status');
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const name = formData.get('name')?.trim();
    const phone = formData.get('phone')?.trim();
    
    if (!name || !phone) {
      statusEl.textContent = 'Заполните все поля';
      statusEl.style.color = 'var(--color-error)';
      return;
    }
    
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправляем...';
    statusEl.textContent = '';
    
    try {
      if (tg && tg.initDataUnsafe?.user?.id) {
        // Send via Telegram Bot API
        const BOT_TOKEN = '8049404339:AAEMUjq99pGGOWI8yFRQKDJyty6A0fyMDIA';
        const chatId = tg.initDataUnsafe.user.id;
        
        const text = `🏠 <b>Лид ЖК Шафран</b>\n\n` +
          `👤 Имя: ${name}\n` +
          `📞 Телефон: ${phone}`;
        
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' })
        });
        
        statusEl.textContent = '✅ Заявка отправлена! Менеджер свяжется с вами.';
        statusEl.style.color = 'var(--color-success)';
        form.reset();
      } else {
        // Fallback - show phone
        statusEl.innerHTML = `📞 <a href="tel:${phone.replace(/\D/g, '')}">${phone}</a>\n` +
          `<small style="color: var(--color-text-muted);">Для отправки откройте через Telegram</small>`;
        statusEl.style.color = 'var(--color-text-secondary)';
      }
    } catch (error) {
      console.error('Form error:', error);
      statusEl.textContent = 'Ошибка отправки. Попробуйте позвонить.';
      statusEl.style.color = 'var(--color-error)';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Отправить заявку';
    }
  });
}

// Calculator
function initCalculator() {
  const calcBtn = document.getElementById('calc-btn');
  if (!calcBtn) return;

  const priceEl = document.getElementById('calc-price');
  const downEl = document.getElementById('calc-down');
  const yearsEl = document.getElementById('calc-years');
  const resultEl = document.getElementById('calc-result');

  calcBtn.addEventListener('click', () => {
    const price = Number(priceEl.value) || 0;
    const down = Number(downEl.value) || 0;
    const years = Number(yearsEl.value) || 1;
    
    if (price <= down) {
      resultEl.textContent = 'Первый взнос не может быть равен или превышать стоимость';
      resultEl.style.color = 'var(--color-error)';
      return;
    }
    
    const amount = price - down;
    const months = years * 12;
    const annualRate = 0.12; // 12% annual
    const monthlyRate = annualRate / 12;
    
    // Monthly payment formula
    const payment = Math.round((amount * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
      (Math.pow(1 + monthlyRate, months) - 1));
    
    resultEl.innerHTML = `
      <span style="color: var(--color-primary);">~${payment.toLocaleString('ru-RU')} ₽</span>
      <span style="display: block; font-size: 14px; color: var(--color-text-muted); margin-top: 4px;">в месяц при 12% годовых</span>
    `;
    resultEl.style.color = 'var(--color-text)';
  });
}

// Chips Q&A
function initChips() {
  const chips = document.querySelectorAll('.chip');
  const answerEl = document.getElementById('chip-answer');
  if (!chips.length || !answerEl) return;

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      answerEl.textContent = chip.dataset.answer || '';
      answerEl.classList.add('fade-in');
    });
  });
}

// Lightbox
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.querySelector('.lightbox-close');
  
  if (!lightbox || !lightboxImg) return;

  const triggers = document.querySelectorAll('.lightbox-trigger');
  triggers.forEach(img => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightbox.classList.add('show');
    });
  });

  const close = () => lightbox.classList.remove('show');
  closeBtn?.addEventListener('click', close);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
}

// Copy contact
function initCopyContact() {
  const copyBtn = document.getElementById('copy-contact');
  if (!copyBtn) return;
  
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('+7 (000) 000-00-00');
      copyBtn.textContent = 'Скопировано!';
      setTimeout(() => copyBtn.textContent = 'Скопировать контакт', 2000);
    } catch (e) {
      copyBtn.textContent = 'Ошибка';
    }
  });
}

// Initialize everything on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initNavigation();
  initScrollAnimations();
  initLeadForm();
  initCalculator();
  initChips();
  initLightbox();
  initCopyContact();
  
  // Debug info in console
  console.log('� saffron MiniApp v2.0 initialized');
  if (tg) {
    console.log('Telegram WebApp:', tg.version);
  }
});

// Expose for debugging
window.safranApp = {
  tg,
  smoothScroll
};
