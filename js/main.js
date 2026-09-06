/* ==========================================================================
   NVRMND — main.js
   Alle animasjoner. Ingen biblioteker, ingen bygg-steg.
   Seksjoner: 0 Hjelpere · 1 Preloader · 2 Markør · 3 Magnetisk · 4 Nav
              5 Scroll-avsløring · 6 Scramble · 7 Marquee · 8 Parallakse
              9 Horisontal scroll · 10 Tellere · 11 rAF-løkke
   ========================================================================== */

(() => {
  'use strict';

  /* ---------- 0. HJELPERE ------------------------------------------------ */

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  const lerp  = (a, b, t) => a + (b - a) * t;
  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  let scrollY    = window.scrollY;
  let lastScroll = scrollY;
  let velocity   = 0;   // brukes av marquee for fartsfølelse
  let vh = window.innerHeight;
  let vw = window.innerWidth;


  /* ---------- 1. PRELOADER ----------------------------------------------- */

  const preloader = $('#preloader');

  function runPreloader() {
    if (!preloader) return;

    const fill   = $('.preloader__fill', preloader);
    const count  = $('.preloader__count', preloader);
    const status = $('.preloader__status', preloader);

    if (reduced) { finish(0); return; }

    document.body.classList.add('is-locked');

    let value = 0;
    const tick = () => {
      // Ujevn "ekte" lasting: store hopp tidlig, tregere mot slutten
      value += Math.random() * (value < 70 ? 9 : 3.5);
      value = Math.min(value, 100);

      fill.style.width = value + '%';
      count.textContent = String(Math.floor(value)).padStart(3, '0');
      if (value > 55 && value < 100) status.textContent = 'LOADING KICKS';

      if (value < 100) {
        setTimeout(tick, 60 + Math.random() * 90);
      } else {
        status.textContent = 'READY';
        finish(650);
      }
    };
    setTimeout(tick, 260);

    function finish(delay) {
      setTimeout(() => {
        preloader.classList.add('is-done');
        document.body.classList.remove('is-locked');
        startHero();
        setTimeout(() => preloader.remove(), 1400);
      }, delay);
    }
  }

  function startHero() {
    const title = $('.hero__title');
    if (title) {
      title.classList.add('is-in');
      // Slipp bokstavene fri når inn-animasjonen er ferdig (så hover virker)
      setTimeout(() => title.classList.add('is-done'), 1500);
    }
    // Første avsløringsrunde rett etter at gardinen har gått opp
    revealVisible();
  }


  /* ---------- 2. EGENDEFINERT MARKØR ------------------------------------- */

  const cursor = $('.cursor');
  const cDot   = $('.cursor__dot');
  const cRing  = $('.cursor__ring');
  const cLabel = $('.cursor__label');

  const mouse = { x: vw / 2, y: vh / 2 };
  const ring  = { x: vw / 2, y: vh / 2 };

  function initCursor() {
    if (!cursor || reduced || isTouch) { cursor?.remove(); return; }

    window.addEventListener('mousemove', e => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      cDot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    }, { passive: true });

    // Hover-tilstander: data-cursor="hover" vokser ringen,
    // andre verdier vises som etikett inni ringen ("play" → PLAY)
    $$('[data-cursor]').forEach(el => {
      const mode = el.dataset.cursor;
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('is-hover');
        cLabel.textContent = mode === 'hover' ? '' : mode;
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('is-hover');
        cLabel.textContent = '';
      });
    });

    document.addEventListener('mouseleave', () => cursor.style.opacity = '0');
    document.addEventListener('mouseenter', () => cursor.style.opacity = '1');
  }


  /* ---------- 3. MAGNETISKE KNAPPER -------------------------------------- */

  function initMagnetic() {
    if (reduced || isTouch) return;

    $$('[data-magnetic]').forEach(el => {
      const strength = 0.32;

      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width / 2)) * strength;
        const y = (e.clientY - (r.top + r.height / 2)) * strength;
        el.style.transform = `translate(${x}px, ${y}px)`;
        el.style.transition = 'transform .12s linear';
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0,0)';
        el.style.transition = 'transform .6s cubic-bezier(.16,1,.3,1)';
      });
    });
  }


  /* ---------- 4. NAV + MOBILMENY ----------------------------------------- */

  const nav    = $('#nav');
  const toggle = $('#navToggle');
  const menu   = $('#menu');
  const bar    = $('.progress__bar');

  function initNav() {
    // Skjul nav når man scroller ned, vis når man scroller opp
    let last = 0;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (!menu.classList.contains('is-open')) {
        nav.classList.toggle('is-hidden', y > last && y > 240);
      }
      last = y;

      const max = document.documentElement.scrollHeight - vh;
      if (bar) bar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    }, { passive: true });

    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('is-locked', open);
    });

    $$('.menu__link', menu).forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('is-locked');
      });
    });
  }


  /* ---------- 5. SCROLL-AVSLØRING ---------------------------------------- */

  const revealItems = $$('[data-reveal]');
  let observer;

  function initReveal() {
    if (reduced) { revealItems.forEach(el => el.classList.add('is-in')); return; }

    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
        if (entry.target.dataset.count !== undefined) countUp(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    revealItems.forEach(el => observer.observe(el));
    $$('[data-count]').forEach(el => observer.observe(el));
  }

  // Kjøres etter preloader: alt som allerede er i view skal vises med en gang
  function revealVisible() {
    revealItems.forEach(el => {
      if (el.getBoundingClientRect().top < vh * 0.92) el.classList.add('is-in');
    });
  }


  /* ---------- 6. TEKST-SCRAMBLE ------------------------------------------ */

  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&@*/\\';

  function scramble(el, text, duration = 900) {
    if (reduced) { el.textContent = text; return; }

    const start = performance.now();
    const len   = text.length;

    const frame = (now) => {
      const p = clamp((now - start) / duration, 0, 1);
      // Bokstavene "lander" fra venstre mot høyre
      const landed = Math.floor(p * len * 1.35);
      let out = '';

      for (let i = 0; i < len; i++) {
        if (text[i] === ' ') { out += ' '; continue; }
        out += i < landed
          ? text[i]
          : CHARS[(Math.random() * CHARS.length) | 0];
      }
      el.textContent = out;

      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = text;
    };
    requestAnimationFrame(frame);
  }

  function initScramble() {
    // Ved hover
    $$('[data-scramble-hover]').forEach(el => {
      const text = el.dataset.scrambleHover;
      let busy = false;
      el.addEventListener('mouseenter', () => {
        if (busy) return;
        busy = true;
        scramble(el, text, 700);
        setTimeout(() => busy = false, 720);
      });
    });

    // Ved lasting (preloader-ordet)
    $$('[data-scramble]').forEach(el => scramble(el, el.dataset.scramble, 1100));
  }


  /* ---------- 7. MARQUEE ------------------------------------------------- */

  const marquees = $$('[data-marquee]').map(track => ({
    el: track,
    x: 0,
    itemW: 0,
    dir: Number(track.dataset.direction || 1)
  }));

  function measureMarquees() {
    marquees.forEach(m => {
      m.itemW = m.el.children[0] ? m.el.children[0].getBoundingClientRect().width : 0;
    });
  }

  function updateMarquees() {
    // Skjevstilling som følger scroll-farten — gir fart og aggresjon
    const skew = clamp(velocity * 0.22, -7, 7);

    marquees.forEach(m => {
      if (!m.itemW) return;
      // Grunnfart + ekstra fart fra scroll-hastigheten
      const speed = (1.7 + Math.abs(velocity) * 0.11) * m.dir;
      m.x -= speed;
      if (m.x <= -m.itemW) m.x += m.itemW;
      if (m.x > 0) m.x -= m.itemW;
      m.el.style.transform = `translate3d(${m.x}px,0,0) skewX(${skew.toFixed(2)}deg)`;
    });
  }


  /* ---------- 8. PARALLAKSE ---------------------------------------------- */

  const parallaxItems = $$('[data-parallax]').map(el => ({
    el,
    speed: parseFloat(el.dataset.parallax),
    current: 0,
    target: 0
  }));

  function updateParallax() {
    parallaxItems.forEach(p => {
      const r = p.el.getBoundingClientRect();
      // Hvor langt elementets midtpunkt er fra skjermens midtpunkt
      const offset = (r.top + r.height / 2) - vh / 2;
      p.target  = offset * p.speed;
      p.current = lerp(p.current, p.target, 0.1);
      p.el.style.transform = `translate3d(0, ${p.current.toFixed(2)}px, 0)`;
    });
  }


  /* ---------- 9. HORISONTAL SCROLL (musikk) ------------------------------ */

  const musicSection = $('.music');
  const rail         = $('[data-rail]');
  const railBar      = $('[data-rail-progress]');
  const railState    = { distance: 0, current: 0, target: 0 };

  function measureRail() {
    if (!musicSection || !rail || reduced) return;

    rail.style.transform = 'translate3d(0,0,0)';
    const pad = parseFloat(getComputedStyle(rail).paddingLeft) || 32;

    railState.distance = Math.max(0, rail.scrollWidth - vw + pad);
    // Seksjonshøyden bestemmer hvor lenge den sidelengs bevegelsen varer
    musicSection.style.height = (vh + railState.distance * 1.15) + 'px';
  }

  function updateRail() {
    if (!musicSection || !rail || reduced || !railState.distance) return;

    const r = musicSection.getBoundingClientRect();
    const total = musicSection.offsetHeight - vh;
    const progress = clamp(-r.top / total, 0, 1);

    railState.target = -railState.distance * progress;
    const prev = railState.current;
    railState.current = lerp(railState.current, railState.target, 0.09);

    // Kortene lener seg i fartsretningen mens raden beveger seg
    const skew = clamp((railState.current - prev) * 0.14, -5, 5);
    rail.style.transform =
      `translate3d(${railState.current.toFixed(2)}px,0,0) skewY(${skew.toFixed(2)}deg)`;

    if (railBar) railBar.style.width = (progress * 100).toFixed(1) + '%';
  }


  /* ---------- 10. TELLERE ------------------------------------------------ */

  function countUp(el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    if (reduced) { el.textContent = target + suffix; return; }

    const dur = 1500;
    const start = performance.now();

    const frame = (now) => {
      const p = clamp((now - start) / dur, 0, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }


  /* ---------- 11. rAF-LØKKE ---------------------------------------------- */

  function loop() {
    scrollY  = window.scrollY;
    velocity = lerp(velocity, scrollY - lastScroll, 0.25);
    lastScroll = scrollY;

    if (cursor && !isTouch) {
      ring.x = lerp(ring.x, mouse.x, 0.16);
      ring.y = lerp(ring.y, mouse.y, 0.16);
      cRing.style.transform = `translate(${ring.x.toFixed(2)}px, ${ring.y.toFixed(2)}px)`;
    }

    updateMarquees();
    updateParallax();
    updateRail();

    requestAnimationFrame(loop);
  }


  /* ---------- OPPSTART --------------------------------------------------- */

  function onResize() {
    vh = window.innerHeight;
    vw = window.innerWidth;
    measureMarquees();
    measureRail();
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(onResize, 150);
  });

  initCursor();
  initMagnetic();
  initNav();
  initReveal();
  initScramble();

  window.addEventListener('load', () => {
    measureMarquees();
    measureRail();
  });
  measureMarquees();
  measureRail();

  runPreloader();
  if (!reduced) requestAnimationFrame(loop);
})();
