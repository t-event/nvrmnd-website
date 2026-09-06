/* ==========================================================================
   NVRMND / main.js
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

    // Telleren følger faktisk innlasting. Hver oppgave er en reell ressurs
    // siden trenger før den ser ferdig ut.
    const tasks = [];

    // 1. Skriftene. Uten dem hopper all typografi når de lander.
    tasks.push(document.fonts ? document.fonts.ready : Promise.resolve());

    // 2. Coveret, det tyngste bildet på siden.
    const cover = $('.featured__art img');
    if (cover) {
      tasks.push(cover.complete && cover.naturalWidth
        ? Promise.resolve()
        : new Promise(res => {
            cover.addEventListener('load',  res, { once: true });
            cover.addEventListener('error', res, { once: true });
          }));
    }

    // 3. Alt annet: stilark, resten av bildene.
    tasks.push(document.readyState === 'complete'
      ? Promise.resolve()
      : new Promise(res => window.addEventListener('load', res, { once: true })));

    const total = tasks.length;
    let done = 0;
    tasks.forEach(p => p.then(() => done++, () => done++));

    const MIN_MS = 450;    // så den ikke bare blinker på rask linje
    const MAX_MS = 6000;   // sikkerhetsnett hvis noe henger
    const start  = performance.now();

    let shown = 0;
    let finished = false;

    const frame = (now) => {
      const elapsed = now - start;
      const target = (done / total) * 100;

      // Baren glir mot den reelle verdien i stedet for å hoppe
      shown = lerp(shown, target, 0.09);
      if (target - shown < 0.4) shown = target;

      fill.style.width = shown + '%';
      count.textContent = String(Math.floor(shown)).padStart(3, '0');
      if (shown > 45 && shown < 99) status.textContent = 'LOADING KICKS';

      const ready = done === total && elapsed >= MIN_MS && shown > 99;
      if (!finished && (ready || elapsed > MAX_MS)) {
        finished = true;
        fill.style.width = '100%';
        count.textContent = '100';
        status.textContent = 'READY';
        finish(320);
        return;
      }
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);

    function finish(delay) {
      setTimeout(() => {
        preloader.classList.add('is-done');
        document.body.classList.remove('is-locked');
        startHero();
        setTimeout(() => preloader.remove(), 1400);
      }, delay);
    }
  }


  /* ---------- 1b. INNEBYGDE SPILLERE, LASTES VED KLIKK ------------------- */

  // Ingenting hentes fra Spotify eller SoundCloud før den besøkende trykker.
  // Det holder siden rask og unngår tredjeparts informasjonskapsler for alle
  // som bare leser.
  function initEmbeds() {
    $$('.embed[data-embed-src]').forEach(box => {
      const btn = $('.embed__load', box);
      if (!btn) return;

      btn.addEventListener('click', () => {
        const frame = document.createElement('iframe');
        frame.src = box.dataset.embedSrc;
        frame.title = box.dataset.embedTitle || 'Player';
        frame.height = box.dataset.embedHeight || '166';
        frame.loading = 'lazy';
        frame.allow = 'autoplay; clipboard-write; encrypted-media; picture-in-picture';
        frame.referrerPolicy = 'strict-origin-when-cross-origin';

        box.replaceChildren(frame);
      }, { once: true });
    });
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

  // Bare presise pekere (mus/styrepute), aldri touch, aldri penn uten hover
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  let cursorOn = false;
  let cursorDown = false;

  function initCursor() {
    if (!cursor) return;

    if (reduced || isTouch || !finePointer) { cursor.remove(); return; }

    cursorOn = true;
    document.body.classList.add('has-cursor');

    window.addEventListener('mousemove', e => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      // Prikken følger eksakt, ringen henger litt etter (settes i rAF-løkka)
      cDot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    }, { passive: true });

    // Hover via delegering, fungerer også for elementer som legges til senere.
    // data-cursor="hover" vokser bare ringen, andre verdier vises som etikett.
    document.addEventListener('mouseover', e => {
      const t = e.target.closest?.('[data-cursor]');
      if (!t) return;
      const label = t.dataset.cursor === 'hover' ? '' : t.dataset.cursor;
      cLabel.textContent = label;
      cursor.classList.add('is-hover');
      // Ringen fylles kun når den har en etikett. Ellers ville flaten
      // lagt seg oppå teksten på det man hovrer over.
      cursor.classList.toggle('is-label', label !== '');
    });

    document.addEventListener('mouseout', e => {
      const t = e.target.closest?.('[data-cursor]');
      if (!t) return;
      // Ikke slipp hover-tilstanden når pekeren bare flytter seg internt i elementet
      if (e.relatedTarget?.closest?.('[data-cursor]') === t) return;
      cursor.classList.remove('is-hover', 'is-label');
      cLabel.textContent = '';
    });

    // Liten respons på klikk
    document.addEventListener('mousedown', () => cursorDown = true);
    document.addEventListener('mouseup',   () => cursorDown = false);

    // Skjul når pekeren forlater vinduet, vis igjen når den kommer tilbake
    document.addEventListener('mouseleave', () => cursor.style.opacity = '0');
    document.addEventListener('mouseenter', () => cursor.style.opacity = '1');

    // Fysisk tastaturbruk skal ikke være verre enn før: viser systempekeren
    // igjen så snart brukeren tabber seg gjennom siden
    window.addEventListener('keydown', e => {
      if (e.key !== 'Tab') return;
      document.body.classList.remove('has-cursor');
      cursorOn = false;
    }, { once: true });
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
      if (nav && !menu?.classList.contains('is-open')) {
        nav.classList.toggle('is-hidden', y > last && y > 240);
      }
      last = y;

      const max = document.documentElement.scrollHeight - vh;
      if (bar) bar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    }, { passive: true });

    // Undersider som 404 har ingen mobilmeny. Da er vi ferdige her.
    if (!toggle || !menu) return;

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
      if (!m.el.children[0]) { m.itemW = 0; return; }
      // Nullstill transformasjonen før måling. Med skjevstillingen på ga
      // getBoundingClientRect en for bred verdi, og båndet fikk et hopp.
      const t = m.el.style.transform;
      m.el.style.transform = 'none';
      m.itemW = m.el.children[0].getBoundingClientRect().width;
      m.el.style.transform = t;
    });
  }

  function updateMarquees() {
    // Skjevstilling som følger scroll-farten, gir fart og aggresjon
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
    baseMid: 0,   // elementets midtpunkt i dokumentet, uten forskyvning
    current: 0,
    target: 0
  }));

  // Måles med transformasjonen av. Leste vi posisjonen mens elementet allerede
  // var forskjøvet, gikk verdien inn i sin egen utregning og ga en annen
  // effektiv hastighet enn den som står i data-parallax.
  function measureParallax() {
    parallaxItems.forEach(p => {
      const t = p.el.style.transform;
      p.el.style.transform = 'none';
      const r = p.el.getBoundingClientRect();
      p.baseMid = r.top + window.scrollY + r.height / 2;
      p.el.style.transform = t;
    });
  }

  function updateParallax() {
    parallaxItems.forEach(p => {
      // Hvor langt elementets midtpunkt er fra skjermens midtpunkt
      const offset = (p.baseMid - scrollY) - vh / 2;
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
    const pad    = Number(el.dataset.pad || 0);   // data-pad="2" → "01"

    const show = n => String(n).padStart(pad, '0') + suffix;

    if (reduced) { el.textContent = show(target); return; }

    const dur = 1500;
    const start = performance.now();

    const frame = (now) => {
      const p = clamp((now - start) / dur, 0, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = show(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }


  /* ---------- 11. rAF-LØKKE ---------------------------------------------- */

  function loop() {
    scrollY  = window.scrollY;
    velocity = lerp(velocity, scrollY - lastScroll, 0.25);
    lastScroll = scrollY;

    if (cursorOn) {
      // Strammere enn før, ringen skal føles festet til pekeren, ikke slepe etter
      ring.x = lerp(ring.x, mouse.x, 0.24);
      ring.y = lerp(ring.y, mouse.y, 0.24);
      const s = cursorDown ? 0.82 : 1;
      cRing.style.transform =
        `translate(${ring.x.toFixed(2)}px, ${ring.y.toFixed(2)}px) scale(${s})`;
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
    measureParallax();
    measureRail();
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(onResize, 150);
  });

  // Årstall i footeren, så det ikke må endres for hånd hver nyttårsaften
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  initCursor();
  initMagnetic();
  initEmbeds();
  initNav();
  initReveal();
  initScramble();

  // Måles én gang nå, og på nytt når skrifter og bilder er ferdig lastet,
  // siden begge deler kan endre høyder og bredder.
  window.addEventListener('load', () => {
    measureMarquees();
    measureParallax();
    measureRail();
  });
  measureMarquees();
  measureParallax();
  measureRail();

  runPreloader();
  if (!reduced) requestAnimationFrame(loop);
})();
