// Sutra — Product Page (v2) interactivity

document.getElementById('year').textContent = new Date().getFullYear();

// Mobile menu toggle
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

// Gallery — click cell to open lightbox
(function () {
  const cells = document.querySelectorAll('.grid-cell');
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  if (!cells.length || !lb || !lbImg) return;

  cells.forEach(c => {
    c.addEventListener('click', e => {
      if (e.target.closest('.cell-cta')) return;
      const src = c.dataset.img || c.querySelector('img').src;
      lbImg.src = src;
      lb.classList.add('is-open');
      lb.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  const close = () => {
    lb.classList.remove('is-open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };
  lb.querySelector('.lb-close').addEventListener('click', close);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lb.classList.contains('is-open')) close();
  });
})();

// Colour swatches
(function () {
  const swatches = document.querySelectorAll('.colour-grid .cg');
  const valEl = document.getElementById('colorVal');
  if (!swatches.length) return;
  swatches.forEach(sw => {
    sw.addEventListener('click', () => {
      swatches.forEach(x => x.classList.remove('is-active'));
      sw.classList.add('is-active');
      if (valEl) valEl.textContent = sw.dataset.color;
    });
  });
})();

// Size selector
(function () {
  const sizes = document.querySelectorAll('.sizes .sz');
  sizes.forEach(s => {
    s.addEventListener('click', () => {
      sizes.forEach(x => x.classList.remove('is-active'));
      s.classList.add('is-active');
    });
  });
})();

// Wishlist toggle
(function () {
  const fav = document.getElementById('favBtn');
  if (!fav) return;
  fav.addEventListener('click', () => {
    fav.classList.toggle('is-on');
    toast(fav.classList.contains('is-on') ? 'Added to wishlist' : 'Removed from wishlist');
  });
})();

// Add to bag
(function () {
  const btn = document.getElementById('addToCart');
  const counter = document.querySelector('.cart-count');
  if (!btn) return;
  btn.addEventListener('click', () => {
    if (counter) counter.textContent = (parseInt(counter.textContent, 10) || 0) + 1;
    const color = document.querySelector('.colour-grid .cg.is-active')?.dataset.color || '';
    const size = document.querySelector('.sizes .sz.is-active')?.dataset.size || '';
    toast(`Added to bag — ${color}, size ${size}`);
  });
})();

// PIN code delivery checker (mock)
(function () {
  const form = document.querySelector('.pin-form');
  const input = document.getElementById('pinInput');
  const note = document.getElementById('deliveryNote');
  if (!form || !input || !note) return;

  const defaultText = note.innerHTML;

  function check() {
    const pin = input.value.trim();
    if (!/^\d{6}$/.test(pin)) {
      note.innerHTML = `
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16v.01"/></svg>
        Please enter a valid 6-digit PIN code.`;
      note.classList.remove('is-ok');
      return;
    }
    // Mocked logic: any pin starting with 1, 4, 5 = express; else standard
    const first = pin[0];
    const express = ['1','4','5'].includes(first);
    const d = new Date();
    d.setDate(d.getDate() + (express ? 2 : 5));
    const dateStr = d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });
    note.innerHTML = `
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m5 12 4 4 10-10"/></svg>
      ${express ? 'Express' : 'Standard'} delivery to ${pin} by <strong>${dateStr}</strong>.`;
    note.classList.add('is-ok');
  }

  form.querySelector('.pin-btn').addEventListener('click', check);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); check(); }});
  input.addEventListener('input', () => {
    input.value = input.value.replace(/\D/g, '').slice(0, 6);
  });
})();

// Accordion
(function () {
  const heads = document.querySelectorAll('.acc-head');
  heads.forEach(h => {
    h.addEventListener('click', () => {
      const item = h.parentElement;
      const wasOpen = item.classList.contains('is-open');
      document.querySelectorAll('.acc-item').forEach(x => x.classList.remove('is-open'));
      if (!wasOpen) item.classList.add('is-open');
    });
  });
})();

// Tabs
(function () {
  const tabs = document.querySelectorAll('.info-tabs .tab');
  const panes = document.querySelectorAll('.info-tabs .tab-pane');
  tabs.forEach(t => {
    t.addEventListener('click', () => {
      tabs.forEach(x => x.classList.remove('is-active'));
      panes.forEach(p => p.classList.remove('is-active'));
      t.classList.add('is-active');
      const target = document.querySelector(`.tab-pane[data-pane="${t.dataset.tab}"]`);
      if (target) target.classList.add('is-active');
    });
  });
})();

// Help — chat button
(function () {
  const chat = document.querySelector('.help-chat');
  if (!chat) return;
  chat.addEventListener('click', () => toast('Chat opening soon — please call or email for now.'));
})();

// Horizontal scroll wheel-to-x for collection + categories
(function () {
  const scrollers = document.querySelectorAll('.collection-scroll, .cats-scroll');
  scrollers.forEach(el => {
    el.addEventListener('wheel', e => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        el.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    }, { passive: false });
  });
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
  const els = document.querySelectorAll('.more-collection, .recently, .store-cta, .popular-cats, .newsletter-strip, .trust-bar');
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
