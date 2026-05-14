/* Sutra — Edition III — interactions */

(function () {
  'use strict';

  // ===== Year =====
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // ===== Sticky nav shadow on scroll =====
  const top = document.getElementById('topNav');
  const onScroll = () => {
    if (!top) return;
    top.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ===== Mobile menu =====
  const burger = document.querySelector('.t-burger');
  const tnav = document.querySelector('.t-nav');
  if (burger && tnav) {
    burger.addEventListener('click', () => tnav.classList.toggle('open'));
    tnav.querySelectorAll('li.has-mega > a').forEach(a => {
      a.addEventListener('click', (e) => {
        if (window.matchMedia('(max-width: 880px)').matches) {
          e.preventDefault();
          a.parentElement.classList.toggle('is-open');
        }
      });
    });
  }

  // ===== Search overlay =====
  const searchBtn = document.querySelector('.t-search-btn');
  const searchOv = document.getElementById('searchOv');
  const searchClose = document.querySelector('.search-close');
  if (searchBtn && searchOv) {
    searchBtn.addEventListener('click', () => {
      searchOv.classList.add('open');
      const input = searchOv.querySelector('input');
      if (input) setTimeout(() => input.focus(), 60);
    });
    if (searchClose) {
      searchClose.addEventListener('click', () => searchOv.classList.remove('open'));
    }
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') searchOv.classList.remove('open');
    });
  }

  // ===== HERO carousel =====
  const slides = document.querySelectorAll('#hero3Slides .h3-slide');
  const thumbs = document.querySelectorAll('#hero3Thumbs button');
  const hPrev = document.querySelector('.h3-nav.prev');
  const hNext = document.querySelector('.h3-nav.next');
  let hIdx = 0;
  let hTimer;

  const goHero = (i) => {
    hIdx = (i + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle('is-active', k === hIdx));
    thumbs.forEach((t, k) => t.classList.toggle('is-active', k === hIdx));
  };
  const autoHero = () => {
    clearInterval(hTimer);
    hTimer = setInterval(() => goHero(hIdx + 1), 6500);
  };
  if (slides.length) {
    if (hPrev) hPrev.addEventListener('click', () => { goHero(hIdx - 1); autoHero(); });
    if (hNext) hNext.addEventListener('click', () => { goHero(hIdx + 1); autoHero(); });
    thumbs.forEach((t, k) => t.addEventListener('click', () => { goHero(k); autoHero(); }));
    autoHero();
  }

  // ===== Saree edit tabs =====
  const seTabs = document.querySelectorAll('.se-tabs button');
  const sePanels = document.querySelectorAll('.se-panel');
  seTabs.forEach(b => {
    b.addEventListener('click', () => {
      const id = b.dataset.tab;
      seTabs.forEach(x => x.classList.toggle('is-active', x === b));
      sePanels.forEach(p => p.classList.toggle('is-active', p.dataset.panel === id));
    });
  });

  // ===== Saree edit / hand-block / reviews — arrow scrolling =====
  const railScroller = (railSelector, prevSelector, nextSelector) => {
    document.querySelectorAll(railSelector).forEach(rail => {
      const wrap = rail.parentElement;
      const prev = wrap.querySelector(prevSelector);
      const next = wrap.querySelector(nextSelector);
      if (!prev || !next) return;
      const step = () => {
        const card = rail.querySelector('.p-card, .rev-card');
        if (!card) return 320;
        const s = getComputedStyle(rail);
        const gap = parseFloat(s.columnGap || s.gap || 0) || 24;
        return card.getBoundingClientRect().width + gap;
      };
      prev.addEventListener('click', () => rail.scrollBy({ left: -step(), behavior: 'smooth' }));
      next.addEventListener('click', () => rail.scrollBy({ left: step(), behavior: 'smooth' }));
    });
  };
  // Hand block rail uses scroll
  railScroller('.hb-rail', '.hb-arrow.prev', '.hb-arrow.next');
  // Reviews rail
  railScroller('.rev-rail', '#revPrev', '#revNext');

  // ===== Saree edit panel arrows — animate grid items =====
  document.querySelectorAll('.se-panel').forEach(panel => {
    const grid = panel.querySelector('.se-rail');
    const prev = panel.querySelector('.se-arrow.prev');
    const next = panel.querySelector('.se-arrow.next');
    if (!grid || !prev || !next) return;
    let offset = 0;
    const total = grid.querySelectorAll('.p-card').length;
    const visible = () => window.matchMedia('(max-width: 880px)').matches ? 2 : 4;
    next.addEventListener('click', () => {
      offset = Math.min(offset + 1, Math.max(0, total - visible()));
      grid.style.transform = `translateX(-${offset * 25}%)`;
      grid.style.transition = 'transform .5s cubic-bezier(.4,0,.2,1)';
    });
    prev.addEventListener('click', () => {
      offset = Math.max(0, offset - 1);
      grid.style.transform = `translateX(-${offset * 25}%)`;
      grid.style.transition = 'transform .5s cubic-bezier(.4,0,.2,1)';
    });
  });

  // ===== SKORD carousel =====
  const skCards = document.querySelectorAll('#skCarousel .sk-card');
  if (skCards.length) {
    let sIdx = 0;
    setInterval(() => {
      sIdx = (sIdx + 1) % skCards.length;
      skCards.forEach((c, i) => c.classList.toggle('is-active', i === sIdx));
    }, 3200);
  }

  // ===== Heritage stats — count up =====
  const stats = document.querySelectorAll('.her-stats strong');
  const countUp = (el) => {
    const target = parseInt(el.dataset.count || el.textContent, 10) || 0;
    const isPercent = el.textContent.includes('%');
    const isPlus = el.textContent.includes('+');
    const duration = 1600;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = Math.round(target * eased);
      el.textContent = v + (isPercent ? '%' : isPlus ? '+' : '');
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window && stats.length) {
    const so = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          countUp(e.target);
          so.unobserve(e.target);
        }
      });
    }, { threshold: .4 });
    stats.forEach(s => so.observe(s));
  }

  // ===== Artisans Impact — region pins / dots =====
  const pins = document.querySelectorAll('.imp-map .pin');
  const cards = document.querySelectorAll('.imp-card');
  const dots = document.querySelectorAll('#impDots button');
  const setRegion = (region) => {
    pins.forEach(p => p.classList.toggle('is-active', p.dataset.region === region));
    cards.forEach(c => c.classList.toggle('is-active', c.dataset.region === region));
    dots.forEach(d => d.classList.toggle('is-active', d.dataset.region === region));
  };
  pins.forEach(p => p.addEventListener('click', () => setRegion(p.dataset.region)));
  dots.forEach(d => d.addEventListener('click', () => setRegion(d.dataset.region)));
  // Initial first pin highlight
  if (pins.length) pins[0].classList.add('is-active');

  // ===== Cookie banner =====
  const cookie = document.getElementById('cookie');
  if (cookie) {
    const stored = localStorage.getItem('sutra_cookie_v3');
    if (!stored) {
      setTimeout(() => cookie.classList.add('show'), 1200);
    } else {
      cookie.classList.add('hide');
    }
    cookie.querySelector('.ck-accept').addEventListener('click', () => {
      localStorage.setItem('sutra_cookie_v3', 'accepted');
      cookie.classList.remove('show');
      setTimeout(() => cookie.classList.add('hide'), 400);
    });
    cookie.querySelector('.ck-decline').addEventListener('click', () => {
      localStorage.setItem('sutra_cookie_v3', 'declined');
      cookie.classList.remove('show');
      setTimeout(() => cookie.classList.add('hide'), 400);
    });
  }

  // ===== Wishlist toggle =====
  document.querySelectorAll('.b-wish').forEach(b => {
    b.addEventListener('click', () => {
      b.textContent = b.textContent.trim() === '♥' ? '♡' : '♥';
    });
  });

  // ===== Reveal on scroll =====
  const reveal = document.querySelectorAll(
    '.s-head, .ns-card, .ik-img, .ik-text, .p-card, .b-card, .sk-text, .her-content, .rev-card, .imp-map, .imp-panel, .blog-card, .lf-block, .nl3-card, .t3-item'
  );
  if ('IntersectionObserver' in window) {
    reveal.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity .7s cubic-bezier(.4,0,.2,1), transform .7s cubic-bezier(.4,0,.2,1)';
    });
    const ro = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => {
            e.target.style.opacity = '1';
            e.target.style.transform = 'translateY(0)';
          }, Math.min(i * 50, 200));
          ro.unobserve(e.target);
        }
      });
    }, { threshold: .12, rootMargin: '0px 0px -60px 0px' });
    reveal.forEach(el => ro.observe(el));
  }
})();
