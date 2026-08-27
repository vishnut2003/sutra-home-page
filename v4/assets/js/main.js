// Sutra home V4 — interactivity (client revision)

document.getElementById('year').textContent = new Date().getFullYear();

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

// Quick shop — add to bag feedback
(function () {
  const count = document.getElementById('cartCount');
  let items = 0;
  document.querySelectorAll('.quick-shop').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.disabled) return;
      items += 1;
      count.textContent = items;
      const label = btn.textContent;
      btn.textContent = 'Added ✓';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = label;
        btn.disabled = false;
      }, 1400);
    });
  });
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
  const els = document.querySelectorAll('.trust, .categories, .products, .jamdani, .crafts, .artisan, .reviews, .instagram, .newsletter');
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
