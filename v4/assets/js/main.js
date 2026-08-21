// Sutra home V4 — interactivity

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
    timer = setInterval(() => go(i + 1), 6500);
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

// Mobile drawer
(function () {
  const btn = document.querySelector('.menu-toggle');
  const drawer = document.getElementById('drawer');
  const scrim = document.getElementById('drawerScrim');
  if (!btn || !drawer) return;

  function setOpen(open) {
    btn.classList.toggle('is-open', open);
    drawer.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', open);
    drawer.setAttribute('aria-hidden', !open);
    scrim.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  }

  btn.addEventListener('click', () => setOpen(!drawer.classList.contains('is-open')));
  scrim.addEventListener('click', () => setOpen(false));
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
})();

// Mega menu — tap support for touch devices (hover handled in CSS)
(function () {
  const item = document.querySelector('.has-mega');
  if (!item) return;
  const link = item.querySelector('.nav-link');
  const mega = item.querySelector('.mega');

  link.addEventListener('click', e => {
    if (window.matchMedia('(hover: none)').matches) {
      e.preventDefault();
      const open = mega.classList.toggle('is-open');
      link.setAttribute('aria-expanded', open);
      mega.setAttribute('aria-hidden', !open);
    }
  });
  document.addEventListener('click', e => {
    if (!item.contains(e.target)) {
      mega.classList.remove('is-open');
      link.setAttribute('aria-expanded', 'false');
    }
  });
})();

// Header shadow on scroll
(function () {
  const header = document.getElementById('siteHeader');
  let last = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 8 && last <= 8) header.classList.add('is-scrolled');
    else if (y <= 8 && last > 8) header.classList.remove('is-scrolled');
    last = y;
  }, { passive: true });
})();

// Newsletter fake submit
(function () {
  const form = document.getElementById('nlForm');
  if (!form) return;
  const msg = document.querySelector('.nf-msg');
  form.addEventListener('submit', () => {
    const email = form.querySelector('input').value.trim();
    if (!email) return;
    msg.textContent = 'Thank you — you are on the list. Use SUTRAFIRST at checkout for 10% off.';
    form.reset();
  });
})();

// Fade-up on intersection
(function () {
  const els = document.querySelectorAll('.campaign-banner, .campaign-split, .craft, .stores, .newsletter');
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
