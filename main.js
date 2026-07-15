/* ══════════════════════════════════════════
   SEATON LOGISTICS — main.js
   ══════════════════════════════════════════ */

/* ── Scroll restoration (refresh always goes to top) ── */
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

/* ── Custom cursor ── */
(function () {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  let mX = 0, mY = 0, rX = 0, rY = 0;
  let rafId;

  document.addEventListener('mousemove', (e) => {
    mX = e.clientX; mY = e.clientY;
    dot.style.left = mX + 'px';
    dot.style.top  = mY + 'px';
  });

  function lerp(a, b, t) { return a + (b - a) * t; }
  function animateRing() {
    rX = lerp(rX, mX, 0.22);
    rY = lerp(rY, mY, 0.22);
    ring.style.left = rX + 'px';
    ring.style.top  = rY + 'px';
    rafId = requestAnimationFrame(animateRing);
  }
  animateRing();

  const interactiveEls = 'a, button, [role="button"], label, select, input, textarea, .division-card, .mega-item, .video-card';
  document.querySelectorAll(interactiveEls).forEach(el => {
    el.addEventListener('mouseenter', () => { dot.classList.add('is-hovering'); ring.classList.add('is-hovering'); });
    el.addEventListener('mouseleave', () => { dot.classList.remove('is-hovering'); ring.classList.remove('is-hovering'); });
  });

  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
})();

/* ── Mega menu ── */
(function () {
  const trigger = document.getElementById('divisions-btn');
  const menu    = document.getElementById('mega-divisions');
  if (!trigger || !menu) return;

  let closeTimer;

  function open()  { menu.classList.add('open'); trigger.setAttribute('aria-expanded', 'true'); }
  function close() { menu.classList.remove('open'); trigger.setAttribute('aria-expanded', 'false'); }

  trigger.addEventListener('click', () => {
    menu.classList.contains('open') ? close() : open();
  });

  trigger.closest('.has-mega').addEventListener('mouseleave', () => {
    closeTimer = setTimeout(close, 180);
  });
  trigger.closest('.has-mega').addEventListener('mouseenter', () => {
    clearTimeout(closeTimer);
  });

  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  document.addEventListener('click', (e) => {
    if (!trigger.closest('.has-mega').contains(e.target)) close();
  });
})();

/* ── Mobile sub-menu (Divisions accordion) ── */
(function () {
  const subTrigger = document.querySelector('.mobile-sub-trigger');
  const subList    = document.querySelector('.mobile-sub');
  if (!subTrigger || !subList) return;

  subTrigger.addEventListener('click', () => {
    const open = subList.classList.toggle('open');
    subTrigger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
})();

/* ── Nav "Menu" more dropdown ── */
(function () {
  const btn      = document.getElementById('more-btn');
  const dropdown = document.getElementById('nav-more-dropdown');
  if (!btn || !dropdown) return;

  function open()  { dropdown.classList.add('open');    btn.setAttribute('aria-expanded', 'true'); }
  function close() { dropdown.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }

  const wrap = btn.closest('.nav-more-wrap');
  let closeTimer;
  wrap.addEventListener('mouseenter', () => { clearTimeout(closeTimer); open(); });
  wrap.addEventListener('mouseleave', () => { closeTimer = setTimeout(close, 180); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
})();

/* ── Back to top ── */
(function () {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ── Dark mode toggle ── */
(function () {
  const html = document.documentElement;
  const toggles = [
    document.getElementById('theme-toggle'),
    document.getElementById('theme-toggle-mobile')
  ];

  const saved = localStorage.getItem('seaton-theme') || 'dark';
  html.setAttribute('data-theme', saved);

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('seaton-theme', theme);
  }

  toggles.forEach(btn => {
    if (!btn) return;
    btn.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  });
})();

/* ── Typewriter effect ── */
(function () {
  const el = document.getElementById('typewriter');
  const cursor = document.querySelector('.typewriter-cursor');
  if (!el) return;

  const text = 'Seaton Logistics';
  let i = 0;

  function type() {
    if (i <= text.length) {
      el.textContent = text.slice(0, i);
      i++;
      setTimeout(type, i === 1 ? 900 : 90);
    } else {
      setTimeout(() => cursor.style.display = 'none', 1800);
    }
  }

  setTimeout(type, 1200);
})();

/* ── Navbar scroll state ── */
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  lastScroll = y;
}, { passive: true });

/* ── Mobile hamburger ── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ── Smooth scroll for all anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const id = anchor.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── FAQ accordion ── */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    // Close all open items
    document.querySelectorAll('.faq-item.open').forEach(open => {
      open.classList.remove('open');
      open.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });

    // Open clicked one if it was closed
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

/* ── Scroll reveal ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal-up').forEach(el => revealObserver.observe(el));

/* ── Animated stat counters ── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1600;
  const start = performance.now();

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-number').forEach(animateCounter);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsBar = document.querySelector('.stats-bar');
if (statsBar) statsObserver.observe(statsBar);

/* ── Active nav link on scroll ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${id}`
          ? 'var(--white)'
          : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ── Service card tilt on mouse move ── */
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-6px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ── Contact form ── */
const form = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Sending…';

    const data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      item: form.item.value,
      message: form.message.value.trim(),
    };

    try {
      const res = await fetch('/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (json.success) {
        form.style.display = 'none';
        formSuccess.classList.add('visible');
      } else {
        btn.disabled = false;
        btn.textContent = 'Send Message';
        alert(json.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      btn.disabled = false;
      btn.textContent = 'Send Message';
      alert('Could not connect to the server. Please try again.');
    }
  });
}

/* ── Subtle hero parallax ── */
const hero = document.querySelector('.hero');
const heroGlow = document.querySelector('.hero-bg-glow');

if (hero && heroGlow) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      heroGlow.style.transform = `translateY(${y * 0.25}px)`;
    }
  }, { passive: true });
}

/* ── Step hover highlight ── */
document.querySelectorAll('.step').forEach((step, i) => {
  step.addEventListener('mouseenter', () => {
    document.querySelectorAll('.step').forEach((s, j) => {
      s.style.opacity = i === j ? '1' : '0.4';
    });
  });
  step.addEventListener('mouseleave', () => {
    document.querySelectorAll('.step').forEach(s => {
      s.style.opacity = '';
    });
  });
});

/* ── Initial reveal for hero (no intersection needed) ── */
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.querySelectorAll('.hero .reveal-up').forEach(el => {
      el.classList.add('visible');
    });
  }, 100);
});
