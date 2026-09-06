# NVRMND, nettside

Prosjektnotater. Denne fila er «hukommelsen» vår: alt vi blir enige om skrives ned her.
Sist oppdatert: 6. september 2026

---

## 1. Kort oppsummert

Én lang, animasjonstung one-pager for hardstyle-artisten **NVRMND**, inspirert av
landonorris.com, særlig de bevegelige elementene (preloader, egendefinert markør,
scroll-avsløring, tekst-scramble, marquee, parallakse, horisontal scroll).

Bak NVRMND står Marius Hågensen fra Mo i Rana. **Navnet hans står ikke på siden.**
Bioen er bevisst holdt anonym, slik mange hardstyle-artister gjør det.

---

## 2. Bekreftede valg

| Tema | Valg |
|---|---|
| Artistnavn | **NVRMND** (versaler) |
| Sjanger | Hardstyle. Hardt, industrielt, høy kontrast |
| Teknologi | Ren HTML/CSS/JS. Ingen bygg-steg, ingen npm, null avhengigheter |
| Struktur | Én lang side (`index.html`) med scroll-navigasjon |
| Språk på siden | Engelsk. Dokumentasjonen i repoet er på norsk |
| Seksjoner | Hero, Musikk, Om artisten, Kontakt |
| Uttrykk | **Kraftig og aggressivt.** Glitch, harde kontraster, rask marquee |
| Identitet | Anonym. Marius navngis ikke på siden |
| GitHub | [t-event/nvrmnd-website](https://github.com/t-event/nvrmnd-website), offentlig |
| Live | **https://t-event.github.io/nvrmnd-website/** (Pages, `main` / rot) |
| Lisens | Alle rettigheter forbeholdt. Ingen åpen kildekode-lisens |
| Commit-forfatter | Mathias &lt;mathias@t-event.no&gt;, bekreftet riktig |

### Skrivestil på siden

**Ingen lange tankestreker i teksten på nettsiden.** Bruk hele setninger,
punktum, eller skråstrek som skilletegn. Dette gjelder også `<title>`,
meta-beskrivelser og alt-tekster.

## 3. Farger

Svært mørk lilla base med skarp rød aksent. Rødt brukes **sparsomt** (linjer,
hover, knapper, tall) slik at det biter når det først dukker opp.

| Rolle | Verdi | Bruk |
|---|---|---|
| Bakgrunn | `#0D0410` | Sidebakgrunn, nesten svart-lilla |
| Bakgrunn 2 | `#150720` | Seksjoner som skal løftes litt |
| Lilla dyp | `#2A0B3D` | Flater, kort, kanter |
| Lilla lys | `#7B2CBF` | Glød og gradienter |
| **Rød aksent** | `#FF1F3D` | Hover, linjer, knapper, tall |
| Rød mørk | `#C4001A` | Skygge og dybde under rødt |
| **Cyan** | `#22D6E8` | Tredjefarge, hentet fra coveret |
| Tekst | `#F2E9F7` | Brødtekst og overskrifter |
| Tekst dempet | `#9E86AE` | Etiketter og metadata |

Alle ligger som CSS-variabler øverst i `css/style.css`.

**Om cyan:** Need Me-coveret er cyan og magenta på svart, mens siden var lilla og
rød. Cyan ble lagt til 6. september for å binde de to sammen. Den brukes tre
steder og skal ikke brukes flere: glitch-kanalen på hero-tittelen, den forskjøvede
rammen bak coveret ved hover, og et svakt skjær i bakgrunnen av musikk-seksjonen.

## 4. Typografi

- **Anton.** Overskrifter, marquee, logo, tall. Bred og tung, bærer uttrykket.
- **Space Grotesk.** Brødtekst.
- **JetBrains Mono.** Etiketter, metadata, knappetekst.

Fra Google Fonts, med fallback-stack.

## 5. Bevegelige effekter

Alle åtte var ønsket fra start:

1. **Preloader.** Teller 0 til 100, deretter gardin som trekkes opp.
2. **Scroll-avsløring.** IntersectionObserver.
3. **Egendefinert markør.** Prikk følger eksakt, ring henger litt etter.
4. **Magnetiske knapper.** Trekkes mot musepekeren.
5. **Tekst-scramble.** Bokstaver stokkes før de lander.
6. **Marquee.** Rullende tekstbånd som skjevstilles av scroll-farten.
7. **Parallakse.** Lag i ulik hastighet i hero og om-seksjonen.
8. **Horisontal scroll.** Ligger klar, men er slått av. Se punkt 6 under.

Alt respekterer `prefers-reduced-motion`.

### Aggressivitets-runde

Etter første gjennomsyn ble uttrykket skrudd opp:

- **Glitch på hero-tittelen.** Rød og cyan kanaldeling ca. hvert 7. sekund
- **Kick-puls.** Rødt glød i kontaktseksjonen pumper i takt med 150 BPM
- **Raskere marquee.** Nesten dobbel grunnfart, skjevstilles med scroll-farten
- **Større typografi.** Hero opp til 22,5vw, footer-ordet med rød kontur
- **Hardere kanter.** 2px røde rammer, rød glød ved hover

### Markøren ble fikset

Første versjon fungerte dårlig. Årsaken: systemets egen
musepeker ble aldri skjult, så man så to pekere samtidig. Rettet 6. september ved
å skjule den via `body.has-cursor`, stramme inn forsinkelsen fra 0.16 til 0.24,
og fjerne `mix-blend-mode: difference` som ga rare farger over grain-laget.
Markøren vises nå kun ved `pointer: fine`, og systempekeren kommer tilbake så
snart brukeren trykker Tab.

## 6. Musikk-seksjonen har to moduser

Katalogen er på én låt, så seksjonen viser **én utgivelse i stort format**.
Den horisontale scroll-raden ligger klar, kommentert ut i `index.html`.

Slik slås den på når det finnes fire eller flere låter:

1. Legg klassen `music--rail` på `<section class="music">`
2. Bytt seksjonsinnholdet med den kommenterte blokken
3. Fyll inn ett kort per låt

All CSS og JS for raden ligger allerede inne og virker. Se `SPEC.md`.

## 7. Filstruktur

```
NVRMND nettside/
├── index.html            Hele siden
├── css/style.css         All styling, variabler øverst
├── js/main.js            Alle animasjoner, 11 nummererte seksjoner
├── 404.html              Egen feilside
├── assets/               Coverbilder, favicon og delingsbilde
├── favicon.ico           Ikon i fanen
├── robots.txt            Åpner for søkemotorer og språkmodeller
├── sitemap.xml           Nettstedskart for Google
├── PROSJEKT.md           Denne fila
├── SPEC.md               Teknisk spesifikasjon
├── PLACEHOLDERS.md       Hva som gjenstår av innhold
├── README.md             Inngangsport til repoet
├── CONTRIBUTING.md       For den som skal endre noe
├── SECURITY.md           Melde fra om sikkerhetsproblemer
├── CODE_OF_CONDUCT.md    Retningslinjer for oppførsel
└── LICENSE.md            Alle rettigheter forbeholdt
```

## 8. Innhold på siden

### Ekte, bekreftet

| Element | Detaljer |
|---|---|
| **Need Me** | Debutsingel, ute 28. august 2026, 2:24, katalognr. NVR001 |
| Coverbildet | Hentet fra Apple Musics katalog i 1400×1400 |
| **Random Nostalgia (NVRMND Remix)** | Kun på SoundCloud |
| Plattformer | Spotify, Apple Music, Tidal, SoundCloud, YouTube, Amazon |
| Instagram | `@nvrmnd.hardstyle` |
| Sted | Mo i Rana. Studio i leiligheten hans |

### Gjenstår

Se **[PLACEHOLDERS.md](PLACEHOLDERS.md)** for full liste med fremgangsmåte.
Kort oppsummert: booking-e-post, pressebilde, bio i Marius' egen stemme,
nytt SoundCloud-brukernavn, TikTok-profil.

### Feil hos distributøren

To lenker peker til feil kontoer. Vi lenker likevel, etter Mathias' valg, fordi
de tross alt fører til musikken:

- **YouTube.** Need Me er publisert på feil kanal
- **Amazon Music.** Artistprofilen blander inn en annen artist med samme navn

Begge må meldes til distributøren.

## 9. Åpne spørsmål

- [ ] Booking-e-post opprettes, så byttes plassholderen ut
- [ ] Marius døper om SoundCloud til `soundcloud.com/nvrmnd`, så oppdateres lenkene
- [ ] Pressebilde
- [ ] Bio i hans egen stemme
- [ ] TikTok-profil
- [ ] Konsertseksjon når det finnes datoer
- [ ] Eget domene? (Settings → Pages → Custom domain)
- [x] ~~Skal siden publiseres?~~ Live siden 6. september 2026

## 10. Slik publiseres endringer

Alt som pushes til `main` går live etter ca. ett minutt.

```bash
git add -A
git commit -m "beskrivelse av endringen"
git push
```

## 11. Feil funnet i gjennomgangen 6. september

Alle er rettet. Tatt med her fordi flere er feller som lett kommer tilbake.

| Feil | Årsak |
|---|---|
| Coveret ble strukket til 1400 px høyde | `width`/`height`-attributtene i HTML setter også CSS-høyde. Uten `height:auto` låses høyden mens bredden skalerer. |
| Press-bildet krympet til 104 px | `margin-inline:auto` på et grid-element slår av strekkingen, så bredden kollapset til tekstinnholdet. |
| Knappetekst forsvant ved hover | Markørringen ble fylt rød og la seg oppå teksten. Fylles nå bare når den har en etikett. |
| T-Event-lenken var ikke klikkbar | Det store NVRMND-ordet i footeren lå over den. Fikk `pointer-events:none`. |
| Scroll-indikatoren lå over Hear it-knappen | Samme hjørne. Plass holdt av, og indikatoren fanger ikke lenger klikk. |
| Preloaderen avslørte ingenting | Gardinen gled bort, men preloaderens egen bakgrunn lå igjen til elementet ble fjernet. |
| Siden ble usynlig uten JavaScript | Preloader og scroll-avsløring skjulte alt. Nå gated på klassen `.js`. |
| Mobilmenyens lenker lå i tabulator-rekkefølgen | Menyen var klippet bort, men ikke skjult. Fikk `visibility:hidden`. |
| 404 på favicon.ico | Nettlesere ber om den uansett. Ekte ICO-fil lagt i rotmappa. |

## 12. Beslutningslogg

**6. sep 2026.** Oppstart, tom mappe. Alle valgene i tabellen over avklart gjennom
tre avklaringsrunder. Bygget første versjon med alle åtte effektene.

**6. sep 2026.** GitHub-kobling. `gh` installert via Homebrew, repo opprettet som
offentlig under kontoen **t-event**, Pages slått på fra `main`. Siden er live.

**6. sep 2026.** Uttrykket skrudd opp til «kraftigere og mer aggressivt».

**6. sep 2026.** Ekte innhold kom inn: Need Me, remixen, alle plattformlenker,
coverbildet. Musikk-seksjonen bygget om fra seks plassholdere til én featured
release. Statistikk-raden byttet fra oppdiktede tall (shows, streams, BPM) til
verifiserbare fakta. Cyan lagt til i paletten. Dokumentasjonen skrevet.

**6. sep 2026.** Markøren fikset. Alle lange tankestreker fjernet fra siden.

**6. sep 2026.** Full gjennomgang med headless Chrome. Ni feil funnet og rettet,
se avsnitt 12. SEO lagt inn: strukturerte data, robots.txt, sitemap, kanonisk
URL og eget delingsbilde i 1200x630. Egen 404-side laget. Kreditering til
T-Event i footeren. Årstallet i footeren settes nå automatisk.
