# NVRMND — nettside

Prosjektnotater. Denne fila er «hukommelsen» vår: alt vi blir enige om skrives ned her.
Sist oppdatert: 2026-09-06

---

## 1. Kort oppsummert

Én lang, animasjonstung one-pager for hardstyle-artisten **NVRMND**, inspirert av
landonorris.com — spesielt de bevegelige elementene (preloader, egendefinert markør,
scroll-avsløring, tekst-scramble, marquee, parallakse, horisontal scroll).

---

## 2. Bekreftede valg

| Tema | Valg |
|---|---|
| Artistnavn | **NVRMND** (skrives i versaler) |
| Sjanger | Hardstyle — hardt, industrielt, høy kontrast |
| Teknologi | Ren HTML/CSS/JS. Ingen bygg-steg, ingen npm. |
| Struktur | Én lang side (`index.html`) med scroll-navigasjon |
| Språk på siden | Engelsk |
| Seksjoner | Hero/intro, Musikk/releases, Om artisten, Booking/kontakt |
| Bildemateriell | Ingen ekte bilder ennå — abstrakt generert grafikk + plassholdere |
| Innhold | Plassholdertekst (dummy låtnavn, bio, e-post) — byttes ut senere |
| Uttrykk | **Kraftig og aggressivt** — glitch, harde kontraster, rask marquee, stor typografi |
| GitHub | [t-event/nvrmnd-website](https://github.com/t-event/nvrmnd-website) — offentlig |
| Live | **https://t-event.github.io/nvrmnd-website/** (GitHub Pages, `main` / rot) |
| Commit-forfatter | Mathias &lt;mathias@t-event.no&gt; — bekreftet riktig |

## 3. Farger

Svært mørk lilla base med skarp rød aksent. Rødt brukes **sparsomt** — linjer,
hover, knapper, tall — slik at det biter.

| Rolle | Verdi | Bruk |
|---|---|---|
| Bakgrunn | `#0D0410` | Sidebakgrunn, nesten svart-lilla |
| Bakgrunn 2 | `#150720` | Seksjoner som skal løftes litt |
| Lilla dyp | `#2A0B3D` | Flater, kort, kanter |
| Lilla lys | `#7B2CBF` | Glød, gradienter, sekundær aksent |
| **Rød aksent** | `#FF1F3D` | Aksentfarge — hover, linjer, knapper, tall |
| Rød mørk | `#C4001A` | Skygge/dybde under rødt |
| Tekst | `#F2E9F7` | Brødtekst og overskrifter |
| Tekst dempet | `#9E86AE` | Etiketter, metadata |

Alle farger ligger som CSS-variabler øverst i `css/style.css` — endre der, så slår
det gjennom på hele siden.

## 4. Typografi

- **Anton** — display/overskrifter. Bred, tung, condensed. Bærer hardstyle-uttrykket.
- **Space Grotesk** — brødtekst.
- **JetBrains Mono** — små etiketter, tall, tekniske detaljer (`[ 01 ]`, `BPM 150`).

Hentes fra Google Fonts. Fallback-stack er satt, så siden fungerer offline også.

## 5. Bevegelige effekter (alle bekreftet ønsket)

1. **Preloader** — teller 0→100 med scramble-tall, deretter gardin som trekkes opp.
2. **Scroll-avsløring** — elementer glir/fader inn via IntersectionObserver.
3. **Egendefinert markør** — ring som følger med forsinkelse, vokser over lenker og
   viser etikett («PLAY», «OPEN»). Skjules automatisk på touch-enheter.
4. **Magnetiske knapper** — knapper trekkes mot musepekeren.
5. **Tekst-scramble** — bokstaver stokkes før de lander (hero-tittel, e-post ved hover).
6. **Marquee** — store rullende tekstbånd, snur retning ved scroll oppover.
7. **Parallakse** — lag som beveger seg i ulik hastighet i hero og om-seksjonen.
8. **Horisontal scroll** — musikk-seksjonen scroller sidelengs mens du scroller ned.

Alt respekterer `prefers-reduced-motion`: brukere som har slått av animasjoner
i systemet får en rolig, statisk versjon.

### Aggressivitets-runde (valgt 2026-09-06)

Etter første gjennomsyn ble uttrykket skrudd opp:

- **Glitch på hero-tittelen** — rød/lilla kanaldeling som blinker ca. hvert 7. sekund
- **Kick-puls** — rødt glød i booking-seksjonen pumper i takt med 150 BPM (0,4 s)
- **Raskere marquee** — nesten dobbel grunnfart, og båndene skjevstilles med scroll-farten
- **Større typografi** — hero opp til 22,5vw, footer-ordet med rød kontur i stedet for grå
- **Hardere kanter** — 2px røde rammer på marquee og cover, rød glød på hover
- **Skjeve kort** — release-raden lener seg i fartsretningen når den scroller sidelengs

## 6. Filstruktur

```
NVRMND nettside/
├── index.html        # hele siden
├── css/style.css     # all styling, variabler øverst
├── js/main.js        # alle animasjoner, én fil, kommentert seksjonsvis
└── PROSJEKT.md       # denne fila
```

## 7. Hva må byttes ut senere (plassholdere)

Alle er merket med `<!-- PLASSHOLDER -->` i `index.html`:

- Låttitler, årstall og strømmelenker i musikk-seksjonen (6 stk.)
- Bio-teksten i om-seksjonen
- Tallene i statistikk-raden (shows, streams, BPM)
- Booking-e-post: `booking@nvrmnd.com`
- Sosiale lenker: Instagram, TikTok, YouTube, Spotify, Apple Music (alle `href="#"`)
- Coverbilder: erstatt `.release-art` sine CSS-gradienter med `<img>`

## 8. Åpne spørsmål / neste steg

- [ ] Ekte låtnavn og lenker til Spotify/Apple Music
- [ ] Ekte booking-e-post og sosiale handles
- [ ] Bio-tekst på engelsk
- [ ] Pressebilder / cover-artwork
- [ ] Skal det inn en konsert-/turnéseksjon senere? (ikke valgt nå)
- [x] ~~Skal siden publiseres?~~ Live på GitHub Pages siden 2026-09-06
- [ ] Eget domene? (f.eks. nvrmnd.no — settes opp under Settings → Pages → Custom domain)

## Slik publiseres endringer

Alt som pushes til `main` går automatisk live på
https://t-event.github.io/nvrmnd-website/ etter ca. ett minutt.

```bash
git add -A
git commit -m "beskrivelse av endringen"
git push
```

## 9. Samtalelogg

**2026-09-06** — Oppstart. Tom mappe. Avklart alle valgene i tabellen over gjennom
tre spørsmålsrunder. Bygget første versjon av siden med alle åtte effektene.

**2026-09-06** — Mathias ba om GitHub-kobling. `gh` installert via Homebrew,
`git init` kjørt, første commit laget lokalt (branch `main`). Repo opprettet som
offentlig under kontoen **t-event**, pushet, og GitHub Pages slått på fra `main`
(rotmappa). Første bygg gikk grønt — siden er live.

**2026-09-06** — Etter førsteinntrykk: uttrykket skrudd opp til «kraftigere /
mer aggressivt». Se avsnittet over.
