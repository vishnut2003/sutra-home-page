// Sutra home — interactivity

document.getElementById('year').textContent = new Date().getFullYear();

// Hero slider
(function () {
  const slides = document.querySelectorAll('#heroSlides .hero-slide');
  const dotsWrap = document.getElementById('heroDots');
  const prev = document.querySelector('.hero-nav.prev');
  const next = document.querySelector('.hero-nav.next');
  if (!slides.length) return;

  let i = 0;
  let timer;

  slides.forEach((_, idx) => {
    const b = document.createElement('button');
    b.setAttribute('aria-label', 'Go to slide ' + (idx + 1));
    if (idx === 0) b.classList.add('is-active');
    b.addEventListener('click', () => go(idx));
    dotsWrap.appendChild(b);
  });
  const dots = dotsWrap.querySelectorAll('button');

  function go(n) {
    slides[i].classList.remove('is-active');
    dots[i].classList.remove('is-active');
    i = (n + slides.length) % slides.length;
    slides[i].classList.add('is-active');
    dots[i].classList.add('is-active');
    restart();
  }
  function restart() {
    clearInterval(timer);
    timer = setInterval(() => go(i + 1), 6000);
  }

  prev.addEventListener('click', () => go(i - 1));
  next.addEventListener('click', () => go(i + 1));

  // pause on hover
  const hero = document.querySelector('.hero');
  hero.addEventListener('mouseenter', () => clearInterval(timer));
  hero.addEventListener('mouseleave', restart);

  // swipe
  let startX = 0;
  hero.addEventListener('touchstart', e => startX = e.touches[0].clientX, { passive: true });
  hero.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1));
  });

  restart();
})();

// Mobile menu toggle (simple expand/collapse)
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

// Fade-up on intersection
(function () {
  const els = document.querySelectorAll('.section, .story-strip, .editorial, .newsletter, .trust-bar');
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
