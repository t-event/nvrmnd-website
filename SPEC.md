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
index.html        Forsiden. Alle seksjoner, all markup.
404.html          Feilside. GitHub Pages plukker den opp automatisk.
privacy.html      Personvernerklæring.
css/style.css     All styling. Fargevariabler ligger i :root øverst.
js/main.js        Alle animasjoner og samtykkelogikk.
assets/           Cover, pressebilde, delingsbilde, ikoner, skrifter.
favicon.ico       Ikon i fanen. Nettlesere ber om denne uansett.
site.webmanifest  Navn, farger og ikoner for «legg til på hjemskjerm».
robots.txt        Åpner for søkemotorer og språkmodeller.
sitemap.xml       Nettstedskart.
```

De tre HTML-sidene deler `style.css` og `main.js`. Footeren er identisk på
alle tre. `main.js` tåler at elementer mangler, slik at undersidene uten
preloader, mobilmeny eller spillere ikke feiler.

Ingen av filene importerer hverandre utover de tre `<link>`/`<script>`-taggene
i `index.html`. Det er med vilje: én fil per bekymring, ingen byggkjede.

## 4. Sideoppbygging

| # | Seksjon | Innhold |
|---|---|---|
| · | Preloader | Teller 0–100, deretter gardin som trekkes opp |
| · | Nav | Logo, tre lenker. Skjules ved scroll ned, kommer tilbake ved scroll opp |
| 1 | Hero | NVRMND i stort, glitch, undertittel, knapp til musikk |
| · | Marquee | Rullende tekstbånd |
| 1 | Music | Need Me som featured release + seks plattformlenker + remix-blokk |
| 2 | About | Bio, to bilder med parallakse, tre nøkkeltall |
| · | Marquee | Rullende tekstbånd, motsatt retning, rød bakgrunn |
| 3 | Follow | Sosiale lenker som rutenett, Instagram øverst i full bredde |
| 4 | Contact | Booking, per nå som Instagram-DM |
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
| 1 | Preloader | Venter på `document.fonts.ready`, coveret og `window.load`. Telleren viser reell framdrift |
| 2 | Egendefinert markør | Prikk følger eksakt, ring lerper etter på `0.24`. Systempekeren skjules via `body.has-cursor` |
| 3 | Magnetiske knapper | `mousemove` regner avstand fra sentrum, ganger med `0.32` |
| 4 | Nav + meny | Klasse-toggling, `clip-path` på mobilmenyen |
| 5 | Scroll-avsløring | `IntersectionObserver`, `unobserve` etter første treff |
| 5b | Ordvis avsløring | Overskrifter med `data-split` deles i ord, hvert med egen forsinkelse |
| 5b2 | Bilde-wipe | `data-wipe` klippes med clip-path og åpnes fra rAF-løkka. Observatøren ser ikke klippede elementer |
| 5c | Etikett-scramble | Tekstbiter i `.label` pakkes i `.scr` og stokkes på plass ved avsløring. `data-no-scramble` holder en etikett stille |
| 5d | Trykk-effekter | Kun `pointer: coarse`. Skjevstilling på bokstaver, glitch på pressebildet |
| 5e | Cover: zoom og gyro | Scroll-drevet zoom 1.12 til 1.0, og `deviceorientation` på mobil. Skriver CSS-variabler |
| 6 | Tekst-scramble | rAF som bytter ut bokstaver til de "lander" fra venstre |
| 7 | Marquee | `translate3d` per frame, hopper tilbake én elementbredde. Skjevstilles av scroll-farten |
| 8 | Parallakse | Avstand fra skjermsenter × `data-parallax`-verdi, lerpet |
| 9 | Horisontal scroll | Scroll-progresjon i seksjonen → `translateX` på raden |
| 10 | Tellere | rAF med `easeOutCubic`, `data-pad` for ledende null |
| 11 | rAF-løkke | Én `requestAnimationFrame` driver 2, 7, 8 og 9 |

**Én løkke, ikke fem.** Alt som må kjøre hver frame ligger i `loop()`. Det er
forskjellen på jevn 60 fps og en side som hakker.

## 5b. Samtykke og innebygde spillere

Spotify- og SoundCloud-spillerne setter tredjeparts informasjonskapsler.
Derfor ligger de ikke i HTML-en som ferdige `iframe`-er, men som tomme
`div`-er med `data-embed-src`. JavaScript setter inn iframen først når
samtykke finnes.

| Tilstand | Hva skjer |
|---|---|
| Ikke svart | Ingenting lastes. Banneret vises. Spillerne står som blokkert |
| Sagt ja | Iframene settes inn med en gang, og ved alle senere besøk |
| Sagt nei | Spillerne står blokkert, med lenke ut til plattformen |

Svaret lagres i `localStorage` under `nvrmnd:embeds`. All bruk av
`localStorage` er pakket i try/catch, siden det kaster i privat modus og når
nettleseren blokkerer lagring.

Verifisert med nettverkslogg: null kall til Spotify og SoundCloud før svar,
to etter.

**Poenget:** et samtykkebanner som ikke faktisk stopper lastingen er bare
pynt, fordi informasjonskapslene da allerede er satt når spørsmålet stilles.

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

| Skrift | Bruk | Fil |
|---|---|---|
| Anton | Overskrifter, marquee, logo, tall | `anton-400-latin.woff2` |
| Space Grotesk | Brødtekst | `space-grotesk-variable-latin.woff2` |
| JetBrains Mono | Etiketter, metadata, knappetekst | `jetbrains-mono-variable-latin.woff2` |

Selvhostet i `assets/fonts/`, 68 KiB totalt, latin-delsett, med OFL-
lisenstekstene ved siden av. `h1` til `h3` har vekt 400 og `html` har
`font-synthesis: none`: Anton finnes bare i én vekt, og uten dette lager
hver nettleser sin egen kunstige fetning, ulikt fra Chrome til Safari.
Selvhostet i `assets/fonts/`, 68 KiB totalt, latin-delsett. `@font-face`
ligger øverst i `style.css` med `font-display: swap`, og filene forhånds-
lastes i `<head>` så de kommer samtidig med stilarket. Ingen kall til
Google. Alle har fallback-stack, så siden er lesbar før skriftene er nede.

## 8. Tilgjengelighet

- **`prefers-reduced-motion`** slår av alt: grain, markør, parallakse, marquee,
  scroll-avsløring. Den horisontale raden blir en vanlig scrollbar rad.
- **Egendefinert markør** vises kun ved `pointer: fine`. Systempekeren kommer
  tilbake så snart brukeren trykker Tab, og over de innebygde spillerne, der
  iframen er et eget dokument som ikke sender musebevegelser til oss.
- **Mobilmenyen** er `visibility:hidden` når den er lukket, så lenkene ikke
  ligger i tabulator-rekkefølgen på store skjermer.
- **Samtykkebanneret** har `env(safe-area-inset-bottom)` slik at knappene
  ikke havner under hjemindikatoren på iPhone.
- **Alle bilder** har `alt`-tekst. Dekorative lag har `aria-hidden`.
- **Semantisk markup**: `header`, `nav`, `main`, `section`, `article`, `footer`.
- Målt kontrast: `--muted` på `--bg` 6.2:1, rød på mørk 5.3:1, mørk tekst
  på rød 5.3:1. Hvit på rød var 3.8:1 og er derfor byttet til mørk tekst på
  alle røde flater. Det røde tekstbåndet har hvit tekst i stor størrelse, der
  kravet er 3:1.

## 9. Ytelse

**Lett modus:** `html.lite` settes av `main.js` på svake enheter, ut fra
hint (`deviceMemory`, `hardwareConcurrency`, `saveData`) eller målt
bildefrekvens de første tre sekundene. CSS under `.lite` skrur av det som
koster mest: korn-laget, blend-modene, de store blurene, glitch og
kick-puls. `?lite=1` og `?lite=0` i adressen overstyrer, for testing.

Regler som holder resten billig: animer kun `transform` og `opacity`, aldri
`box-shadow`. Ingen `getBoundingClientRect` i rAF-løkka; posisjoner måles
én gang og ved resize. Tredjeparts iframes settes inn etter `window.load`.


- Ingen JS-biblioteker. `main.js` er ~13 kB ukomprimert.
- Coveret finnes i tre trinn, 640, 1100 og 1400 px, valgt slik at hver
  skjermtetthet henter riktig fil og ikke mer: 54, 128 eller 171 KiB.
  Originalen på 1400 px brukes til deling og strukturerte data.
- `fetchpriority="high"` på coveret, `loading="lazy"` på bildet i om-seksjonen.
- `will-change` er satt kun på elementer som faktisk animeres hver frame.
- Alt av animasjon bruker `transform` og `opacity`, aldri `top`/`left`/`width`.

### Ikke gjør dette

- **Ikke sett `color-scheme: dark` på siden.** Chrome maler da en
  ugjennomsiktig hvit flate bak kryssdomene-iframes med annen ordning,
  og den stikker fram bak Spotify-spillerens runde hjørner.
- **Ikke la overskrifter arve fet vekt.** Se typografi.
- **Ikke bruk Unicode-piler.** iPhone tegner dem som emoji. Se ikoner
  i `CONTRIBUTING.md`.
- **Ikke la scramble ligge på informasjon folk skal lese.** Effekten er
  fin på seksjonstitler, men utgivelsesdato og spilletid som bytter
  bokstaver ser ut som en feil. Slike etiketter merkes `data-no-scramble`.
- **Ikke gjør én lenkeboks større enn de andre.** Instagram var lenge
  høyere enn resten i Follow-seksjonen. Skal en boks skille seg ut, gjør
  det med farge og bredde, ikke med egen størrelse.

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
