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

  // Lett modus for svake enheter. Slås på av hint fra nettleseren, eller av
  // målt bildefrekvens de første sekundene. ?lite=1 og ?lite=0 overstyrer,
  // for testing. Hva som skrus av står i CSS under html.lite.
  const params = new URLSearchParams(location.search);
  let lite = params.get('lite') === '1' || (
    params.get('lite') !== '0' && (
      (navigator.deviceMemory && navigator.deviceMemory <= 2) ||
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) ||
      (navigator.connection && navigator.connection.saveData)
    )
  );
  if (lite) document.documentElement.classList.add('lite');

  function enableLite() {
    if (lite) return;
    lite = true;
    document.documentElement.classList.add('lite');
  }

  // Måler hvor lang tid hver frame tar de første tre sekundene, mens
  // preloaderen står på. Ligger mer enn en tredel av framene over 28 ms,
  // altså under ca. 35 fps, går vi lett før gardinen åpner. Da starter
  // siden i riktig modus i stedet for å bytte midt i.
  function watchFrameRate() {
    if (lite || reduced || params.get('lite') === '0') return;
    let frames = 0, slow = 0, last = performance.now();
    const start = last;
    const tick = (now) => {
      const dt = now - last; last = now;
      frames++;
      if (dt > 28) slow++;
      if (now - start < 3000) { requestAnimationFrame(tick); return; }
      if (frames > 30 && slow / frames > 0.35) enableLite();
    };
    requestAnimationFrame(tick);
  }

  // Leses først i init. window.scrollY her ville tvunget fram layout før
  // nettleseren har tegnet noe som helst.
  let scrollY    = 0;
  let lastScroll = 0;
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

    // 2. Dokumentet er parset. Ikke window.load: den venter også på bilder
    //    under folden, som coveret, og ingen ser dem når gardinen åpner.
    //    Å vente på dem utsatte bare LCP.
    tasks.push(document.readyState !== 'loading'
      ? Promise.resolve()
      : new Promise(res => document.addEventListener('DOMContentLoaded', res, { once: true })));

    const total = tasks.length;
    let done = 0;
    tasks.forEach(p => p.then(() => done++, () => done++));

    const MIN_MS = 350;    // så den ikke bare blinker på rask linje
    const MAX_MS = 6000;   // sikkerhetsnett hvis noe henger
    const start  = performance.now();

    let shown = 0;
    let finished = false;

    const frame = (now) => {
      const elapsed = now - start;
      const target = (done / total) * 100;

      // Baren glir mot den reelle verdien i stedet for å hoppe. 0.18 gir
      // rundt et halvt sekund fra 0 til 100; 0.09 tok nesten det dobbelte
      // og var den største enkeltposten i LCP på rask linje.
      shown = lerp(shown, target, 0.18);
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
        // Ferdig betyr dekorativ. Uten dette måler tilgjengelighetsverktøy
        // kontrast på teksten midt i uttoningen, over gjennomsiktig bakgrunn.
        preloader.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('is-locked');
        startHero();
        setTimeout(() => preloader.remove(), 1400);
      }, delay);
    }
  }


  /* ---------- 1b. SAMTYKKE OG INNEBYGDE SPILLERE -------------------------- */

  // Spotify og SoundCloud setter sine egne informasjonskapsler. Derfor lastes
  // spillerne først når den besøkende har sagt ja. Svaret lagres lokalt i
  // nettleseren, så neste besøk laster dem umiddelbart uten å spørre igjen.
  const CONSENT_KEY = 'nvrmnd:embeds';

  // localStorage kaster i privat modus og når nettleseren blokkerer lagring,
  // så all bruk må tåle å feile.
  const consent = {
    get() {
      try { return localStorage.getItem(CONSENT_KEY); } catch { return null; }
    },
    set(v) {
      try { localStorage.setItem(CONSENT_KEY, v); } catch { /* ikke kritisk */ }
    },
    clear() {
      try { localStorage.removeItem(CONSENT_KEY); } catch { /* ikke kritisk */ }
    }
  };

  const banner = $('#consent');

  function loadEmbed(box) {
    if ($('iframe', box)) return;

    const frame = document.createElement('iframe');
    frame.className = 'embed__frame';
    frame.src = box.dataset.embedSrc;
    frame.title = box.dataset.embedTitle || 'Player';
    frame.height = box.dataset.embedHeight || '166';
    frame.loading = 'eager';   // hentes i bakgrunnen, ikke først når den synes
    frame.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
    frame.referrerPolicy = 'strict-origin-when-cross-origin';

    box.replaceChildren(frame);
    box.classList.add('is-loaded');
  }

  // Sagt nei: vi viser en enkel plass med lenke ut i stedet for spilleren
  function blockEmbed(box) {
    const name = box.dataset.embedName || 'the platform';
    box.classList.remove('is-loaded');
    box.innerHTML =
      '<div class="embed__blocked">' +
        '<p class="embed__blocked-text">Player blocked. ' +
          'You chose not to allow cookies from ' + name + '.</p>' +
        '<div class="embed__blocked-actions">' +
          '<button type="button" class="embed__allow" data-consent="granted">Allow players</button>' +
          '<a class="embed__out" href="' + box.dataset.embedFallback + '" ' +
             'target="_blank" rel="noopener">Open on ' + name +
             ' <svg class="ico" aria-hidden="true"><use href="#i-ne"></use></svg></a>' +
        '</div>' +
      '</div>';
  }

  function applyConsent(state) {
    $$('.embed[data-embed-src]').forEach(box => {
      if (state === 'granted') loadEmbed(box);
      else blockEmbed(box);
    });
    if (banner) banner.hidden = true;
  }

  // Ligger utenfor initEmbeds, fordi knappen står i footeren på alle sider,
  // også de som ikke har spillere.
  function initConsentReset() {
    const reset = $('#consentReset');
    if (!reset) return;

    reset.addEventListener('click', () => {
      consent.clear();

      const boxes = $$('.embed[data-embed-src]');
      if (boxes.length && banner) {
        boxes.forEach(blockEmbed);
        banner.hidden = false;
      } else {
        // Ingen spillere på denne siden. Send brukeren dit valget gjelder.
        window.location.href = 'index.html#music';
      }
    });
  }

  function initEmbeds() {
    const boxes = $$('.embed[data-embed-src]');
    if (!boxes.length) return;

    const saved = consent.get();

    if (saved === 'granted') {
      // Settes inn i bakgrunnen, men først når resten av siden er lastet.
      // Ellers venter preloaderen på Spotify og SoundCloud, som er tunge.
      if (banner) banner.hidden = true;
      const go = () => setTimeout(() => applyConsent('granted'), 300);
      if (document.readyState === 'complete') go();
      else window.addEventListener('load', go, { once: true });
    }
    else if (saved === 'denied')  applyConsent('denied');
    else {
      // Ikke bestemt seg: ingenting lastes, og banneret vises
      boxes.forEach(blockEmbed);
      if (banner) banner.hidden = false;
    }

    // Ett klikk-oppsett for både banneret og knappene inne i blokkerte spillere
    document.addEventListener('click', e => {
      const btn = e.target.closest('[data-consent]');
      if (!btn) return;
      const choice = btn.dataset.consent;
      consent.set(choice);
      applyConsent(choice);
    });

    initFrameCursor();
  }

  // En iframe er et eget dokument. Så snart pekeren er inne i den slutter
  // mousemove å nå oss, og ringen ble stående fast midt på spilleren.
  // Vi skjuler den mens pekeren er over, og lar systempekeren overta.
  function initFrameCursor() {
    if (!cursor) return;

    $$('.embed').forEach(box => {
      box.addEventListener('mouseenter', () => {
        cursor.classList.add('is-over-frame');
        cursor.classList.remove('is-hover', 'is-label');
      });
      box.addEventListener('mouseleave', () => {
        cursor.classList.remove('is-over-frame');
      });
    });

    // Sikkerhetsnett: tar spilleren fokus rekker vi ikke alltid å få
    // mouseleave. Da rydder vi opp når vinduet får fokus tilbake.
    window.addEventListener('focus', () => cursor.classList.remove('is-over-frame'));
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

  // Klasse, ikke id: headeren har id="top" som ankerpunkt for "Back to top",
  // og den er lik på alle sider.
  const nav    = $('.nav');
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
        if (entry.target.classList.contains('is-in')) return;
        entry.target.classList.add('is-in');
        if (entry.target.dataset.count !== undefined) countUp(entry.target);
        scrambleLabels(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    // Nullstilling når man scroller opp igjen: elementet mister is-in først
    // når det har forlatt skjermen helt nedenfor. Da spilles avsløringen av
    // på nytt neste gang det ruller inn. Forlater det skjermen oppover
    // (vanlig scroll nedover) står det urørt.
    const exit = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) return;
        if (entry.boundingClientRect.top > 0) entry.target.classList.remove('is-in');
      });
    }, { threshold: 0, rootMargin: '0px' });

    // Elementer med data-wipe starter helt klippet bort med clip-path, og
    // Chrome regner da arealet som null, så observatøren fyrer aldri på dem.
    // De sjekkes i stedet i rAF-løkka, se updateWipes.
    const observed = revealItems.filter(el => !el.hasAttribute('data-wipe'));
    observed.forEach(el => { observer.observe(el); exit.observe(el); });
    $$('[data-count]').forEach(el => { observer.observe(el); exit.observe(el); });
  }

  // Kjøres etter preloader: alt som allerede er i view skal vises med en gang
  function revealVisible() {
    // Les alle posisjoner først, skriv klasser etterpå. Blandet lesing og
    // skriving tvinger fram én layout per element.
    const tops = revealItems.map(el => el.getBoundingClientRect().top);
    revealItems.forEach((el, i) => {
      if (tops[i] < vh * 0.92) {
        el.classList.add('is-in');
        scrambleLabels(el);
      }
    });
  }


  /* ---------- 5b. ORDVIS AVSLØRING PÅ OVERSKRIFTER ------------------------ */

  // Hvert ord i en [data-split]-overskrift pakkes i en span med egen
  // forsinkelse, så ordene lander ett og ett. <em> og <br> beholdes.
  function splitWords() {
    if (reduced) return;

    $$('[data-split]').forEach(heading => {
      let i = 0;
      const wrap = (node) => {
        [...node.childNodes].forEach(child => {
          if (child.nodeType === Node.TEXT_NODE) {
            const frag = document.createDocumentFragment();
            child.textContent.split(/(\s+)/).forEach(part => {
              if (!part) return;
              if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
              const w = document.createElement('span');
              w.className = 'w';
              w.style.setProperty('--d', (i++ * 0.07) + 's');
              w.textContent = part;
              frag.appendChild(w);
            });
            child.replaceWith(frag);
          } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'BR') {
            wrap(child);
          }
        });
      };
      wrap(heading);
    });
  }


  /* ---------- 5b2. BILDE-WIPE ------------------------------------------- */

  // getBoundingClientRect bryr seg ikke om clip-path, i motsetning til
  // IntersectionObserver. Derfor sjekkes disse for hånd hver frame.
  const wipeItems = $$('[data-wipe]').map(el => ({ el, baseTop: 0 }));


  function updateWipes() {
    wipeItems.forEach(({ el, baseTop }) => {
      const top = baseTop - scrollY;
      const isIn = el.classList.contains('is-in');
      if (!isIn && top < vh * 0.88) {
        el.classList.add('is-in');
        scrambleLabels(el);
      } else if (isIn && top > vh) {
        // Helt under skjermen igjen: klipp igjen, så wipen kan gjentas
        el.classList.remove('is-in');
      }
    });
  }


  /* ---------- 5c. ETIKETTER SOM STOKKES PÅ PLASS -------------------------- */

  // Tekstbitene i .label og .hero__eyebrow pakkes i .scr-spans, så scramble
  // kan bytte bokstaver uten å rive med seg streken, skilletegnene og lenkene.
  // Etiketter med data-no-scramble står stille. Utgivelsesdato og spilletid
  // er informasjon folk faktisk skal lese, og en halv seksjonstittel som
  // stokker seg er kul, mens «28 AUG JA%D» bare ser ut som en feil.
  function prepareLabels() {
    if (reduced) return;
    $$('.label:not([data-no-scramble]), .hero__eyebrow').forEach(label => {
      [...label.childNodes].forEach(node => {
        if (node.nodeType !== Node.TEXT_NODE || !node.textContent.trim()) return;
        const span = document.createElement('span');
        span.className = 'scr';
        span.dataset.text = node.textContent;
        span.textContent = node.textContent;
        node.replaceWith(span);
      });
    });
  }

  // Kalles på alt som avsløres. Finner .scr inni, om det finnes noen.
  function scrambleLabels(root) {
    if (reduced) return;
    const targets = root.matches?.('.scr') ? [root] : $$('.scr', root);
    targets.forEach(s => scramble(s, s.dataset.text, 650));
  }


  /* ---------- 5d. TRYKK-EFFEKTER, KUN BERØRINGSSKJERM --------------------- */

  // Bokstavene i NVRMND skjevstilles ved trykk, kun på berøringsskjerm, siden
  // desktop har hover for det samme. Pressebildet glitcher ved trykk og klikk
  // overalt. Coveret er utelatt fordi det er en lenke.
  function initTapEffects() {
    if (reduced) return;

    if (isTouch) {
      $$('.hero__title .l').forEach(l => {
        l.addEventListener('pointerdown', () => {
          l.classList.add('is-hit');
          setTimeout(() => l.classList.remove('is-hit'), 450);
        }, { passive: true });
      });
    }

    const frame = $('.about__frame');
    if (frame) {
      frame.addEventListener('pointerdown', () => {
        frame.classList.remove('is-glitch');
        void frame.offsetWidth;          // start animasjonen på nytt
        frame.classList.add('is-glitch');
      }, { passive: true });
    }
  }


  /* ---------- 5e. COVERET: SCROLL-ZOOM OG GYRO-PARALLAKSE ---------------- */

  const coverImg = $('.featured__art img');
  const cover = { baseTop: 0, height: 0, zoom: 1.12, gx: 0, gy: 0, tgx: 0, tgy: 0 };


  function updateCover() {
    if (!coverImg) return;

    // Zoom: 1.12 når toppen av coveret passerer bunnen av skjermen,
    // 1.0 når det har kommet 60 % opp. Setter seg i takt med scrollen.
    const top = cover.baseTop - scrollY;
    const t = clamp((vh - top) / (vh * 0.6), 0, 1);
    const targetZoom = 1.12 - 0.12 * t;
    cover.zoom = lerp(cover.zoom, targetZoom, 0.12);

    // Gyro, lerpet så det ikke rykker
    cover.gx = lerp(cover.gx, cover.tgx, 0.08);
    cover.gy = lerp(cover.gy, cover.tgy, 0.08);

    coverImg.style.setProperty('--zoom', cover.zoom.toFixed(4));
    coverImg.style.setProperty('--gx', cover.gx.toFixed(1) + 'px');
    coverImg.style.setProperty('--gy', cover.gy.toFixed(1) + 'px');
  }

  // Telefonens helling flytter coveret et lite stykke. Android sender data
  // med en gang. iPhone krever en tillatelsesdialog som må utløses av et
  // trykk, og det steget vil vi ikke ha. Der hoppes effekten over.
  function initGyro() {
    if (reduced || lite || !isTouch || !coverImg || !('DeviceOrientationEvent' in window)) return;
    if (typeof DeviceOrientationEvent.requestPermission === 'function') return;

    const onTilt = (e) => {
      if (e.gamma == null || e.beta == null) return;
      // gamma: venstre/høyre (-90..90). beta: fram/tilbake, ca 45 når man
      // holder telefonen normalt. Begge klippes til et lite utslag.
      cover.tgx = clamp(e.gamma / 45, -1, 1) * 14;
      cover.tgy = clamp((e.beta - 45) / 45, -1, 1) * 10;
    };

    window.addEventListener('deviceorientation', onTilt, { passive: true });
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


  function updateMarquees() {
    // Skjevstilling som følger scroll-farten, gir fart og aggresjon
    const skew = lite ? 0 : clamp(velocity * 0.22, -7, 7);

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


  function updateParallax() {
    parallaxItems.forEach(p => {
      // Hvor langt elementets midtpunkt er fra skjermens midtpunkt
      const offset = (p.baseMid - scrollY) - vh / 2;
      // Begrenset, så elementer langt utenfor skjermen aldri får absurde
      // forskyvninger som kan legge dem oppå naboene når de ruller inn
      p.target  = clamp(offset * p.speed, -90, 90);
      p.current = lerp(p.current, p.target, 0.1);
      p.el.style.transform = `translate3d(0, ${p.current.toFixed(2)}px, 0)`;
    });
  }


  /* ---------- 9. HORISONTAL SCROLL (musikk) ------------------------------ */

  const musicSection = $('.music');
  const rail         = $('[data-rail]');
  const railBar      = $('[data-rail-progress]');
  const railState    = { distance: 0, current: 0, target: 0 };


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
    updateCover();
    updateWipes();
    updateRail();

    requestAnimationFrame(loop);
  }


  /* ---------- OPPSTART --------------------------------------------------- */

  // Hver målefunksjon nullstiller transform, leser og gjenoppretter. Kjørt
  // hver for seg gir det én tvungen layout per element. Her gjøres alle
  // skrivingene først, så alle lesingene, så gjenopprettingen: én layout.
  function measureAll() {
    const els = [
      ...marquees.map(m => m.el),
      ...parallaxItems.map(p => p.el),
      ...wipeItems.map(w => w.el),
      coverImg ? coverImg.closest('.featured__art') : null,
      rail
    ].filter(Boolean);

    const saved = els.map(el => el.style.transform);
    els.forEach(el => el.style.transform = 'none');

    // Kun lesing herfra
    marquees.forEach(m => { m.itemW = m.el.children[0] ? m.el.children[0].getBoundingClientRect().width : 0; });
    parallaxItems.forEach(p => { const r = p.el.getBoundingClientRect(); p.baseMid = r.top + window.scrollY + r.height / 2; });
    wipeItems.forEach(w => { w.baseTop = w.el.getBoundingClientRect().top + window.scrollY; });
    if (coverImg) { const r = coverImg.closest('.featured__art').getBoundingClientRect(); cover.baseTop = r.top + window.scrollY; cover.height = r.height; }
    if (musicSection && rail && !reduced) {
      const pad = parseFloat(getComputedStyle(rail).paddingLeft) || 32;
      railState.distance = Math.max(0, rail.scrollWidth - vw + pad);
    }

    els.forEach((el, i) => el.style.transform = saved[i]);
    if (musicSection && rail && !reduced) musicSection.style.height = (vh + railState.distance * 1.15) + 'px';
  }

  function onResize() {
    vh = window.innerHeight;
    vw = window.innerWidth;
    measureAll();
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(onResize, 150);
  });

  // Årstall i footeren, så det ikke må endres for hånd hver nyttårsaften
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Alt under leser geometri, og den første lesingen tvinger fram hele
  // sidens første layout synkront, midt i skriptet. Med to rAF-kall får
  // nettleseren tegne preloaderen først, og layouten skjer der den hører
  // hjemme, i tegnepipelinen. Preloaderen er ren CSS fram til da.
  function init() {
    scrollY = lastScroll = window.scrollY;
    watchFrameRate();      // først, så målingen går mens preloaderen står på
    splitWords();          // før initReveal, så observatøren ser ordene
    prepareLabels();       // samme grunn
    initTapEffects();
    initGyro();
    initCursor();
    initMagnetic();
    initEmbeds();
    initConsentReset();
    initNav();
    initReveal();
    initScramble();

    // Måles én gang nå, og på nytt når skrifter og bilder er ferdig lastet,
    // siden begge deler kan endre høyder og bredder.
    window.addEventListener('load', measureAll);
    measureAll();

    runPreloader();
    if (!reduced) requestAnimationFrame(loop);
  }

  requestAnimationFrame(() => requestAnimationFrame(init));
})();
