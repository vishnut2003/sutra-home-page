/* Sutra — Edition II — interactions */

(function () {
  'use strict';

  // Year
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Sticky nav shadow on scroll
  const nav = document.getElementById('siteNav');
  const onScroll = () => {
    if (!nav) return;
    if (window.scrollY > 20) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  const burger = document.querySelector('.nav-burger');
  const links = document.querySelector('.nav-links');
  if (burger && links) {
    burger.addEventListener('click', () => {
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => links.classList.remove('open'));
    });
  }

  // Product rail nav buttons
  const rail = document.getElementById('productRail');
  const prev = document.getElementById('railPrev');
  const next = document.getElementById('railNext');
  if (rail && prev && next) {
    const scrollBy = () => {
      const card = rail.querySelector('.rail-card');
      if (!card) return 320;
      const styles = getComputedStyle(rail);
      const gap = parseFloat(styles.columnGap || styles.gap || 0) || 24;
      return card.getBoundingClientRect().width + gap;
    };
    prev.addEventListener('click', () => rail.scrollBy({ left: -scrollBy(), behavior: 'smooth' }));
    next.addEventListener('click', () => rail.scrollBy({ left: scrollBy(), behavior: 'smooth' }));
  }

  // Reveal-on-scroll for sections
  const revealTargets = document.querySelectorAll(
    '.hero-words, .m-card, .bento-card, .rail-card, .ss-sticky, .ss-stack figure, .cl-row, .jm-card, .nl-card, .t-item'
  );
  if ('IntersectionObserver' in window) {
    revealTargets.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity .8s cubic-bezier(.4,0,.2,1), transform .8s cubic-bezier(.4,0,.2,1)';
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => {
            e.target.style.opacity = '1';
            e.target.style.transform = 'translateY(0)';
          }, Math.min(i * 60, 220));
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealTargets.forEach(el => io.observe(el));
  }

  // Subtle parallax for hero mosaic on mouse move (desktop)
  const mosaic = document.querySelector('.hero-mosaic');
  if (mosaic && window.matchMedia('(hover:hover)').matches) {
    const cards = mosaic.querySelectorAll('.m-card');
    mosaic.addEventListener('mousemove', (e) => {
      const r = mosaic.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      cards.forEach((c, i) => {
        const depth = (i + 1) * 6;
        c.style.transform = `translate(${x * depth}px, ${y * depth}px) ${c.classList.contains('m-1') ? 'rotate(-1.5deg)' : c.classList.contains('m-3') ? 'rotate(1.8deg)' : ''}`;
      });
    });
    mosaic.addEventListener('mouseleave', () => {
      cards.forEach(c => { c.style.transform = ''; });
    });
  }

  // Wishlist toggle visual
  document.querySelectorAll('.rc-wish').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      btn.textContent = btn.textContent.trim() === '♥' ? '♡' : '♥';
    });
  });
})();
