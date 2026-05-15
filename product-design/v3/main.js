// Sutra — Product Page (v3) interactivity

document.getElementById('year').textContent = new Date().getFullYear();

// Mobile menu
(function () {
  const btn = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.primary-nav');
  if (!btn || !nav) return;
  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', open);
  });
})();

// Header shadow on scroll
(function () {
  const header = document.querySelector('.site-header');
  let last = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 8 && last <= 8) header.classList.add('is-scrolled');
    else if (y <= 8 && last > 8) header.classList.remove('is-scrolled');
    last = y;
  }, { passive: true });
})();

// Hero quick swatches sync with configurator
const COLOR_NAMES = ['Madder Red', 'Indigo', 'Forest', 'Clay', 'Ivory'];
(function () {
  const qkSw = document.querySelectorAll('.qk-sw');
  qkSw.forEach((sw, idx) => {
    sw.addEventListener('click', () => {
      qkSw.forEach(x => x.classList.remove('is-active'));
      sw.classList.add('is-active');
      const name = COLOR_NAMES[idx];
      // Sync configurator
      const cfSw = document.querySelector(`.cf-sw[data-color="${name}"]`);
      if (cfSw) cfSw.click();
    });
  });
})();

// Hero favorite
(function () {
  const fav = document.getElementById('favBtnHero');
  if (!fav) return;
  fav.addEventListener('click', () => {
    fav.classList.toggle('is-on');
    toast(fav.classList.contains('is-on') ? 'Saved to wishlist' : 'Removed from wishlist');
  });
})();

// Gallery — snap scroll + counter + arrows
(function () {
  const track = document.getElementById('gsTrack');
  const current = document.getElementById('gsCurrent');
  const total = document.getElementById('gsTotal');
  const prev = document.querySelector('.gs-btn.prev');
  const next = document.querySelector('.gs-btn.next');
  if (!track) return;

  const slides = track.querySelectorAll('.gs-slide');
  if (total) total.textContent = String(slides.length).padStart(2, '0');

  function updateCounter() {
    const x = track.scrollLeft + track.clientWidth / 2;
    let activeIdx = 0;
    let minDist = Infinity;
    slides.forEach((s, idx) => {
      const dist = Math.abs((s.offsetLeft + s.offsetWidth / 2) - x);
      if (dist < minDist) { minDist = dist; activeIdx = idx; }
    });
    if (current) current.textContent = String(activeIdx + 1).padStart(2, '0');
  }

  track.addEventListener('scroll', updateCounter, { passive: true });
  updateCounter();

  function scrollBy(dir) {
    const s = slides[0];
    if (!s) return;
    const step = s.offsetWidth + 16;
    track.scrollBy({ left: dir * step, behavior: 'smooth' });
  }
  prev?.addEventListener('click', () => scrollBy(-1));
  next?.addEventListener('click', () => scrollBy(1));

  // Wheel-to-horizontal
  track.addEventListener('wheel', e => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      track.scrollLeft += e.deltaY;
      e.preventDefault();
    }
  }, { passive: false });
})();

// Configurator — colour swatches with image swap
(function () {
  const swatches = document.querySelectorAll('.cf-sw');
  const valEl = document.getElementById('cfColor');
  const imgEl = document.getElementById('cfImg');
  const qkSw = document.querySelectorAll('.qk-sw');
  if (!swatches.length) return;

  swatches.forEach((sw, idx) => {
    sw.addEventListener('click', () => {
      swatches.forEach(x => x.classList.remove('is-active'));
      sw.classList.add('is-active');
      const name = sw.dataset.color;
      if (valEl) valEl.textContent = name;

      // Swap preview image with fade
      if (imgEl && sw.dataset.img) {
        imgEl.classList.add('is-fading');
        setTimeout(() => {
          imgEl.src = sw.dataset.img;
          imgEl.classList.remove('is-fading');
        }, 200);
      }

      // Sync hero quick swatches
      const heroIdx = COLOR_NAMES.indexOf(name);
      qkSw.forEach(x => x.classList.remove('is-active'));
      if (heroIdx >= 0 && qkSw[heroIdx]) qkSw[heroIdx].classList.add('is-active');

      updateSummary();
    });
  });
})();

// Configurator — generic option groups (weave, blouse, gift)
(function () {
  const groups = [
    { sel: '[data-weave]', target: 'cfWeave', key: 'weave' },
    { sel: '[data-blouse]', target: 'cfBlouse', key: 'blouse' },
    { sel: '[data-gift]', target: 'cfGift', key: 'gift' },
  ];
  groups.forEach(g => {
    const opts = document.querySelectorAll(`.cf-opt${g.sel}`);
    const out = document.getElementById(g.target);
    opts.forEach(o => {
      o.addEventListener('click', () => {
        opts.forEach(x => x.classList.remove('is-active'));
        o.classList.add('is-active');
        if (out) out.textContent = o.dataset[g.key];
        updateSummary();
      });
    });
  });
})();

const BASE_PRICE = 7890;
const WEAVE_ADJ = { 'Plain cotton': 0, 'Cotton-silk': 1200, 'Khadi': 800 };

function updateSummary() {
  const color = document.querySelector('.cf-sw.is-active')?.dataset.color || 'Madder Red';
  const weave = document.querySelector('[data-weave].is-active')?.dataset.weave || 'Plain cotton';
  const total = BASE_PRICE + (WEAVE_ADJ[weave] || 0);

  // Summary row updates
  const sumRows = document.querySelectorAll('.cf-summary .sum-row');
  if (sumRows[0]) {
    sumRows[0].querySelector('span:first-child').textContent = `Saree (${color}, ${weave})`;
    sumRows[0].querySelector('span:last-child').textContent = `₹ ${total.toLocaleString('en-IN')}`;
  }
  const totalEl = document.getElementById('cfTotal');
  if (totalEl) totalEl.textContent = `₹ ${total.toLocaleString('en-IN')}`;

  // CTA button
  const cta = document.getElementById('addToCart');
  if (cta) cta.textContent = `Add to bag · ₹ ${total.toLocaleString('en-IN')}`;

  // Sticky bar
  const sbVariant = document.getElementById('sbVariant');
  const sbPrice = document.getElementById('sbPrice');
  if (sbVariant && sbPrice) {
    sbVariant.innerHTML = `${color} &middot; ${weave} &middot; <strong>₹ ${total.toLocaleString('en-IN')}</strong>`;
  }
}

// Add to bag
(function () {
  const btn = document.getElementById('addToCart');
  const counter = document.querySelector('.cart-count');
  if (!btn) return;
  btn.addEventListener('click', () => {
    if (counter) counter.textContent = (parseInt(counter.textContent, 10) || 0) + 1;
    const color = document.querySelector('.cf-sw.is-active')?.dataset.color || '';
    toast(`Added to bag — ${color}. We'll begin making it.`);
  });
})();

// Accordion
(function () {
  const heads = document.querySelectorAll('.acc-head');
  heads.forEach(h => {
    h.addEventListener('click', () => {
      const item = h.parentElement;
      const wasOpen = item.classList.contains('is-open');
      const sib = h.parentElement.parentElement;
      sib.querySelectorAll('.acc-item').forEach(x => x.classList.remove('is-open'));
      if (!wasOpen) item.classList.add('is-open');
    });
  });
})();

// Bundle pricing
(function () {
  const checks = document.querySelectorAll('.ctl-check input');
  const priceEl = document.getElementById('bundlePrice');
  const btn = document.getElementById('addBundle');
  if (!checks.length) return;

  function recalc() {
    let total = BASE_PRICE;
    checks.forEach(c => {
      if (c.checked) {
        const card = c.closest('.ctl-card');
        const txt = card.querySelector('.price').textContent;
        const n = parseInt(txt.replace(/[^\d]/g, ''), 10) || 0;
        total += n;
      }
    });
    if (priceEl) priceEl.textContent = `₹ ${total.toLocaleString('en-IN')}`;
  }
  checks.forEach(c => c.addEventListener('change', recalc));
  recalc();

  btn?.addEventListener('click', () => {
    const count = [...checks].filter(c => c.checked).length;
    toast(`Added bundle to bag — ${count + 1} pieces`);
  });
})();

// Sticky mini-bar — show after hero scrolls past
(function () {
  const sb = document.getElementById('stickyBuy');
  const hero = document.querySelector('.pp-hero');
  if (!sb || !hero || !('IntersectionObserver' in window)) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting || en.boundingClientRect.top > 0) {
        sb.classList.remove('is-visible');
        sb.setAttribute('aria-hidden', 'true');
      } else {
        sb.classList.add('is-visible');
        sb.setAttribute('aria-hidden', 'false');
      }
    });
  }, { threshold: 0 });
  io.observe(hero);
})();

// Toast helper
let toastTimer;
function toast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('is-on'), 2400);
}

// Fade-up on intersection
(function () {
  const els = document.querySelectorAll('.story-row, .gallery-strip, .configurator, .details, .testimonial, .ctl, .recently, .newsletter');
  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('in-view');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.08 });
  els.forEach(el => {
    el.classList.add('reveal');
    io.observe(el);
  });
})();
