// Sutra — Product Page (v1) interactivity

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

// Gallery — thumbnails
(function () {
  const thumbs = document.querySelectorAll('#ppThumbs .pp-thumb');
  const stage = document.querySelector('.pp-main-img');
  const img = document.getElementById('ppMainImgEl');
  if (!thumbs.length || !img) return;

  thumbs.forEach(t => {
    t.addEventListener('click', () => {
      const src = t.dataset.src;
      if (!src || img.src.endsWith(src)) return;
      stage.classList.add('is-fading');
      setTimeout(() => {
        img.src = src;
        stage.classList.remove('is-fading');
      }, 220);
      thumbs.forEach(x => x.classList.remove('is-active'));
      t.classList.add('is-active');
    });
  });
})();

// Gallery — hover-pan zoom
(function () {
  const stage = document.querySelector('.pp-main-img');
  const img = document.getElementById('ppMainImgEl');
  const zoomBtn = document.getElementById('ppZoomBtn');
  if (!stage || !img) return;

  let zoomed = false;

  function toggleZoom() {
    zoomed = !zoomed;
    stage.classList.toggle('is-zoomed', zoomed);
    if (!zoomed) img.style.transformOrigin = 'center';
  }

  stage.addEventListener('click', toggleZoom);

  stage.addEventListener('mousemove', e => {
    if (!zoomed) return;
    const r = stage.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    img.style.transformOrigin = `${x}% ${y}%`;
  });

  stage.addEventListener('mouseleave', () => {
    img.style.transformOrigin = 'center';
  });

  // Open lightbox via zoom icon
  if (zoomBtn) {
    zoomBtn.addEventListener('click', e => {
      e.stopPropagation();
      const lb = document.getElementById('lightbox');
      const lbImg = document.getElementById('lbImg');
      if (!lb || !lbImg) return;
      lbImg.src = img.src;
      lb.classList.add('is-open');
      lb.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  }
})();

// Lightbox close
(function () {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
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

// Wishlist toggle on gallery
(function () {
  const fav = document.querySelector('.pp-fav');
  if (!fav) return;
  fav.addEventListener('click', () => {
    fav.classList.toggle('is-on');
    toast(fav.classList.contains('is-on') ? 'Added to wishlist' : 'Removed from wishlist');
  });
})();

// Colour swatches
(function () {
  const swatches = document.querySelectorAll('.swatches .sw');
  const valEl = document.getElementById('colorVal');
  if (!swatches.length) return;
  swatches.forEach(sw => {
    sw.addEventListener('click', () => {
      swatches.forEach(x => x.classList.remove('is-active'));
      sw.classList.add('is-active');
      if (valEl) valEl.textContent = sw.dataset.color;
      updateStickyVariant();
    });
  });
})();

// Size selector
(function () {
  const sizes = document.querySelectorAll('.sizes .sz');
  if (!sizes.length) return;
  sizes.forEach(s => {
    if (s.classList.contains('is-disabled')) return;
    s.addEventListener('click', () => {
      sizes.forEach(x => x.classList.remove('is-active'));
      s.classList.add('is-active');
      updateStickyVariant();
    });
  });
})();

function updateStickyVariant() {
  const color = document.querySelector('.swatches .sw.is-active');
  const size = document.querySelector('.sizes .sz.is-active');
  const out = document.getElementById('sbVariant');
  if (out && color && size) {
    out.textContent = `${color.dataset.color} · ${size.dataset.size}`;
  }
}

// Quantity stepper
(function () {
  const input = document.getElementById('qtyInput');
  const btns = document.querySelectorAll('.qty-btn');
  if (!input) return;

  btns.forEach(b => {
    b.addEventListener('click', () => {
      let val = parseInt(input.value, 10) || 1;
      val = b.dataset.act === '+' ? val + 1 : val - 1;
      if (val < 1) val = 1;
      if (val > 10) val = 10;
      input.value = val;
    });
  });

  input.addEventListener('input', () => {
    const v = input.value.replace(/\D/g, '');
    input.value = v === '' ? '' : Math.min(10, Math.max(1, parseInt(v, 10)));
  });
  input.addEventListener('blur', () => {
    if (!input.value) input.value = 1;
  });
})();

// Add to bag
(function () {
  const btn = document.getElementById('addToCart');
  const sbBtn = document.querySelector('.sb-btn');
  const counter = document.querySelector('.cart-count');
  if (!btn) return;

  const handleAdd = () => {
    const qty = parseInt(document.getElementById('qtyInput').value, 10) || 1;
    if (counter) counter.textContent = (parseInt(counter.textContent, 10) || 0) + qty;
    const color = document.querySelector('.swatches .sw.is-active')?.dataset.color || '';
    const size = document.querySelector('.sizes .sz.is-active')?.dataset.size || '';
    toast(`Added to bag — ${color}, size ${size}`);
  };

  btn.addEventListener('click', handleAdd);
  if (sbBtn) sbBtn.addEventListener('click', handleAdd);
})();

// Accordion
(function () {
  const heads = document.querySelectorAll('.acc-head');
  heads.forEach(h => {
    h.addEventListener('click', () => {
      const item = h.parentElement;
      const wasOpen = item.classList.contains('is-open');
      // Close all
      document.querySelectorAll('.acc-item').forEach(x => x.classList.remove('is-open'));
      if (!wasOpen) item.classList.add('is-open');
    });
  });
})();

// Share — copy link
(function () {
  const c = document.getElementById('copyLink');
  if (!c) return;
  c.addEventListener('click', e => {
    e.preventDefault();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).then(() => toast('Link copied to clipboard'));
    } else {
      toast('Copy link unavailable');
    }
  });
})();

// Toast helper
let toastTimer;
function toast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  // re-add ::before via class toggle (textContent overwrites pseudo? no, ::before is fine)
  t.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('is-on'), 2400);
}

// Sticky add-to-bag — show after main CTA scrolls out
(function () {
  const sb = document.getElementById('stickyBuy');
  const cta = document.querySelector('.pp-cta-row');
  if (!sb || !cta) return;

  if (!('IntersectionObserver' in window)) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        sb.classList.remove('is-visible');
        sb.setAttribute('aria-hidden', 'true');
      } else {
        // only show when scrolled past CTA, not when above it
        if (en.boundingClientRect.top < 0) {
          sb.classList.add('is-visible');
          sb.setAttribute('aria-hidden', 'false');
        }
      }
    });
  }, { threshold: 0 });

  io.observe(cta);
})();

// Fade-up on intersection
(function () {
  const els = document.querySelectorAll('.maker, .specs-section, .reviews, .also-like, .recently, .newsletter');
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

// Animate review bars when visible
(function () {
  const bars = document.querySelectorAll('.rs-bar .bar i');
  if (!bars.length || !('IntersectionObserver' in window)) return;
  bars.forEach(b => { b.dataset.width = b.style.width; b.style.width = '0%'; });
  const section = document.querySelector('.reviews-summary');
  if (!section) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        bars.forEach(b => { b.style.width = b.dataset.width; });
        io.disconnect();
      }
    });
  }, { threshold: 0.3 });
  io.observe(section);
})();
