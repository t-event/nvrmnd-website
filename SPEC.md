# Teknisk spesifikasjon

Hva siden er, hvordan den er bygget, og hvorfor valgene er tatt som de er.

---

## 1. Mål

Én nettside som gjør tre ting, i denne rekkefølgen:

1. Får folk til å høre **Need Me**
2. Får dem til å følge NVRMND på minst én plattform
3. Gjør det mulig å ta kontakt om booking

Alt annet er underordnet. Designet skal føles som hardstyle, hardt, mørkt,
høy kontrast, uten at det går ut over de tre punktene over.

## 2. Rammer

| Krav | Valg | Hvorfor |
|---|---|---|
| Ingen bygg-steg | Ren HTML/CSS/JS | `index.html` kan åpnes direkte. Ingen npm, ingen node_modules, ingenting som ruster. |
| Ingen avhengigheter | 0 biblioteker | Ingen GSAP, ingen jQuery. Alt av animasjon er ~350 linjer egen JS. |
| Ingen backend | Statiske filer | Ligger på GitHub Pages. Ingen server å drifte, ingen database å miste. |
| Én side | Scroll-navigasjon | Effektene som ble ønsket forutsetter sammenhengende scroll. |

## 3. Filer

```
index.html        Hele siden. Alle seksjoner, all markup.
css/style.css     All styling. Fargevariabler ligger i :root øverst.
js/main.js        Alle animasjoner. Delt i 11 nummererte seksjoner.
assets/           Coverbilder og pressebilder.
```

Ingen av filene importerer hverandre utover de tre `<link>`/`<script>`-taggene
i `index.html`. Det er med vilje: én fil per bekymring, ingen byggkjede.

## 4. Sideoppbygging

| # | Seksjon | Innhold |
|---|---|---|
| · | Preloader | Teller 0–100, deretter gardin som trekkes opp |
| · | Nav | Logo, tre lenker. Skjules ved scroll ned, kommer tilbake ved scroll opp |
| 1 | Hero | NVRMND i stort, glitch, undertittel, knapp til musikk |
| · | Marquee | Rullende tekstbånd |
| 2 | Music | Need Me som featured release + seks plattformlenker + remix-blokk |
| 3 | About | Bio, to bilder med parallakse, tre nøkkeltall |
| · | Marquee | Rullende tekstbånd, motsatt retning, rød bakgrunn |
| 4 | Contact | Booking-status og lenker til sosiale medier |
| · | Footer | NVRMND i konturskrift, copyright |

### Musikk-seksjonen har to moduser

Katalogen er på én låt, så seksjonen viser nå **én utgivelse i stort format**.
Den horisontale scroll-raden som opprinnelig ble bygget ligger klar, kommentert
ut i `index.html`. Slik slås den på når det er nok låter:

1. Legg klassen `music--rail` på `<section class="music">`
2. Bytt seksjonsinnholdet med den kommenterte blokken
3. Fyll inn kort per låt

All CSS (`.music--rail`, `.music__rail`, `.release`) og all JS
(`measureRail`, `updateRail`) ligger allerede inne og virker.

## 5. Animasjoner

Alle ligger i `js/main.js`, nummerert i samme rekkefølge som her.

| # | Effekt | Teknikk |
|---|---|---|
| 1 | Preloader | `setTimeout`-kjede med tilfeldige intervaller, så CSS-keyframe på gardinen |
| 2 | Egendefinert markør | Prikk følger eksakt, ring lerper etter på `0.24`. Systempekeren skjules via `body.has-cursor` |
| 3 | Magnetiske knapper | `mousemove` regner avstand fra sentrum, ganger med `0.32` |
| 4 | Nav + meny | Klasse-toggling, `clip-path` på mobilmenyen |
| 5 | Scroll-avsløring | `IntersectionObserver`, `unobserve` etter første treff |
| 6 | Tekst-scramble | rAF som bytter ut bokstaver til de "lander" fra venstre |
| 7 | Marquee | `translate3d` per frame, hopper tilbake én elementbredde. Skjevstilles av scroll-farten |
| 8 | Parallakse | Avstand fra skjermsenter × `data-parallax`-verdi, lerpet |
| 9 | Horisontal scroll | Scroll-progresjon i seksjonen → `translateX` på raden |
| 10 | Tellere | rAF med `easeOutCubic`, `data-pad` for ledende null |
| 11 | rAF-løkke | Én `requestAnimationFrame` driver 2, 7, 8 og 9 |

**Én løkke, ikke fem.** Alt som må kjøre hver frame ligger i `loop()`. Det er
forskjellen på jevn 60 fps og en side som hakker.

## 6. Farger

Definert som CSS-variabler i `:root`. Endrer du dem der, endres hele siden.

| Variabel | Verdi | Rolle |
|---|---|---|
| `--bg` | `#0D0410` | Bakgrunn, nesten svart-lilla |
| `--bg-2` | `#150720` | Seksjoner som skal løftes |
| `--purple-deep` | `#2A0B3D` | Flater og kanter |
| `--purple` | `#4A1173` | Mellomtone |
| `--purple-bright` | `#7B2CBF` | Glød og gradienter |
| `--red` | `#FF1F3D` | Aksent: hover, linjer, tall |
| `--red-dark` | `#C4001A` | Dybde under rødt |
| `--cyan` | `#22D6E8` | Tredjefarge fra coveret |
| `--text` | `#F2E9F7` | Tekst |
| `--muted` | `#9E86AE` | Etiketter og metadata |

**Om cyan:** hentet fra Need Me-coveret, som er cyan og magenta på svart. Brukes
tre steder: glitch-kanalen på hero-tittelen, den forskjøvede rammen bak coveret
ved hover, og et svakt skjær i bakgrunnen av musikk-seksjonen. Ikke mer. Fargen
er der for å binde siden til akkurat denne utgivelsen, ikke for å bli en
tredje hovedfarge.

## 7. Typografi

| Skrift | Bruk |
|---|---|
| Anton | Overskrifter, marquee, logo, tall |
| Space Grotesk | Brødtekst |
| JetBrains Mono | Etiketter, metadata, knappetekst |

Lastes fra Google Fonts med `display=swap`. Alle har fallback-stack, så siden
er lesbar før skriftene er nede, og hvis de aldri kommer.

## 8. Tilgjengelighet

- **`prefers-reduced-motion`** slår av alt: grain, markør, parallakse, marquee,
  scroll-avsløring. Den horisontale raden blir en vanlig scrollbar rad.
- **Egendefinert markør** vises kun ved `pointer: fine`. Systempekeren kommer
  tilbake så snart brukeren trykker Tab.
- **Alle bilder** har `alt`-tekst. Dekorative lag har `aria-hidden`.
- **Semantisk markup**: `header`, `nav`, `main`, `section`, `article`, `footer`.
- Kjente svakheter: fokusmarkering er ikke egendesignet, og fargekontrasten på
  `--muted` mot `--bg` ligger rundt 4.6:1, greit for brødtekst, i knappeste
  laget for de minste etikettene.

## 9. Ytelse

- Ingen JS-biblioteker. `main.js` er ~13 kB ukomprimert.
- Coveret lastes i to størrelser: 1400px til featured, 600px som favicon.
- `fetchpriority="high"` på coveret, `loading="lazy"` på bildet i om-seksjonen.
- `will-change` er satt kun på elementer som faktisk animeres hver frame.
- Alt av animasjon bruker `transform` og `opacity`, aldri `top`/`left`/`width`.

## 10. Nettlesere

Testet mot moderne Chrome, Safari og Firefox. Bruker `clamp()`, `aspect-ratio`,
`:has()`-fri CSS, `IntersectionObserver` og `svh`-enheter, alt bredt støttet
siden 2023. Ingen polyfills.

## 11. Publisering

GitHub Pages fra `main`, rotmappa. Push til `main` går live automatisk etter
omtrent ett minutt.

**Live:** https://t-event.github.io/nvrmnd-website/

## 12. Kjente begrensninger

- **Ingen analytics.** Vi vet ikke hvor mange som besøker siden.
- **Ingen nyhetsbrev.** Ingen måte å samle e-postadresser på.
- **Ingen konsertoversikt.** Ikke bygget, legges til når det er datoer.
- **Ingen CMS.** Nytt innhold krever at noen endrer HTML og pusher.
- **Ingen egen domene.** Ligger på `github.io`-adressen.

Alle fem er bevisste valg for å komme raskt ut, ikke forglemmelser.
Se `PLACEHOLDERS.md` for hva som gjenstår av innhold.
