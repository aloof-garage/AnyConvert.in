/**
 * AnyConverter Website — script.js
 */
'use strict';

/* ─── Theme ──────────────────────────────────────────────────── */
const getStoredTheme = () => localStorage.getItem('ac-theme') || 'dark';
const setTheme = (t) => {
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('ac-theme', t);
};

// Apply theme immediately (before paint) to avoid flash
setTheme(getStoredTheme());

document.addEventListener('DOMContentLoaded', () => {

  /* ─── Theme toggle ─────────────────────────────────────────── */
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  });

  /* ─── Navbar scroll effect ──────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ─── Mobile nav ────────────────────────────────────────────── */
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.nav-mobile');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => mobileMenu.classList.remove('open'))
    );
    // Close on outside click
    document.addEventListener('click', e => {
      if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target))
        mobileMenu.classList.remove('open');
    });
  }

  /* ─── Scroll-reveal ─────────────────────────────────────────── */
  const revealObserver = new IntersectionObserver(
    (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ─── Animated conversion formats ───────────────────────────── */
  const pairs = [
    ['MP4', 'MP3'], ['PDF', 'PNG'], ['DOCX', 'PDF'],
    ['PNG', 'WEBP'], ['MKV', 'MP4'], ['MD', 'DOCX'],
    ['JPG', 'PDF'], ['MOV', 'GIF'],
  ];
  let currentPair = 0;
  const fromEl = document.getElementById('hero-fmt-from');
  const toEl   = document.getElementById('hero-fmt-to');

  function rotatePair() {
    if (!fromEl || !toEl) return;
    currentPair = (currentPair + 1) % pairs.length;
    const [from, to] = pairs[currentPair];

    // Fade out
    [fromEl, toEl].forEach(el => {
      el.style.transition = 'opacity .2s';
      el.style.opacity = '0';
    });

    setTimeout(() => {
      fromEl.querySelector('.fmt-label').textContent = '.' + from.toLowerCase();
      toEl.querySelector('.fmt-label').textContent   = '.' + to.toLowerCase();
      [fromEl, toEl].forEach(el => el.style.opacity = '1');
    }, 220);
  }

  setInterval(rotatePair, 2200);

  /* ─── Smooth scroll for anchor links ───────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 70;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ─── Hero stats counter animation ──────────────────────────── */
  const statEl = document.querySelector('.stat-number');
  let statAnimated = false;
  if (statEl) {
    const statObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !statAnimated) {
        statAnimated = true;
        animateCount(statEl, 0, 50, 1400);
      }
    });
    statObserver.observe(statEl);
  }

  function animateCount(el, start, end, duration) {
    const startTime = performance.now();
    const update = (now) => {
      const elapsed = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      el.textContent = Math.round(start + (end - start) * eased) + '+';
      if (elapsed < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

});
