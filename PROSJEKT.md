# NVRMND, nettside

Prosjektnotater. Denne fila er «hukommelsen» vår: alt vi blir enige om skrives ned her.
Sist oppdatert: 6. september 2026, ved dagens slutt

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

### Effekter lagt til for mobil (6. september)

Nesten alt som manglet på mobil var hover-effekter, som ikke kan finnes uten
musepeker. Disse seks virker på begge, og alle ble valgt av Mathias:

1. **Bilde-wipe.** Coveret og pressebildet avsløres ovenfra med skarp kant.
   NB: Chrome lar `clip-path` telle med i IntersectionObserver, så et element
   klippet til null areal fyrer aldri. Wipe-elementene sjekkes derfor i
   rAF-løkka med `getBoundingClientRect`, som ignorerer clip-path.
2. **Scramble på etikettene.** «01 / Music» osv. stokkes på plass ved scroll.
3. **Trykk-effekter**, kun berøringsskjerm. Bokstavene i NVRMND skjevstilles,
   pressebildet glitcher. Coveret er utelatt fordi det er en lenke.
4. **Gyro-parallakse på coveret.** Android rett ut av boksen. iPhone ber om
   tillatelse ved første berøring, og gjør ingenting hvis det nektes.
5. **Scroll-drevet zoom på coveret**, fra 1.12 til 1.0 idet det ruller inn.
6. **Kick-puls på de røde strekene**, samme 150 BPM som gløden i kontakt.

Coverets transform styres av CSS-variabler (`--gx`, `--gy`, `--zoom`), slik
at JS og hover ikke overskriver hverandre.

Samtidig: glødkulene i hero og kick-gløden i kontakt var satt i `vw` og
forsvant på smal skjerm. Skalert opp under 720px. Spillerne hentes nå i
bakgrunnen (`loading="eager"`) straks samtykke finnes, ikke først når de
ruller inn. «Back to top» pekte på headeren, som er `position:fixed` og
derfor ikke kan scrolles til; ankeret ligger nå på `<main>`.

### Justeringer etter første test av effektene

- **Effektene går begge veier.** Et element mister `is-in` når det har
  forlatt skjermen helt nedenfor, og spilles av på nytt neste gang det ruller
  inn. Forlater det skjermen oppover står det urørt, så ingenting blinker
  vekk når man rusler litt opp. Gjelder blokkavsløring, ordvis avsløring,
  etikett-scramble, tellere og bilde-wipe.
- **Gyro er borte på iPhone.** Tillatelsesdialogen var et ekstra steg
  besøkende ville synes var rart. Android får effekten uten spørsmål.
- **Alle piler er SVG-ikoner.** Unicode-tegnene ↗ ↑ ↓ tegnes som emoji på
  iPhone, og så uprofesjonelt ut i hamburgermenyen. Tre symboler ligger
  øverst i hver HTML-fil, brukt med `<use href="#i-ne">`. Fargen arves fra
  teksten, så hover-reglene virker som før. Ikke bruk Unicode-piler.

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
├── privacy.html          Personvernerklæring
├── robots.txt            Åpner for søkemotorer og språkmodeller
├── sitemap.xml           Nettstedskart
├── favicon.ico           Ikon i fanen
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

## 9. Samtykke og personvern

Google Fonts beholdes, med personvernerklæring som forklarer at IP-adressen
sendes til Google. Selvhosting ble vurdert og valgt bort.

Spotify- og SoundCloud-spillerne setter tredjeparts informasjonskapsler, og
lastes derfor ikke før den besøkende har sagt ja i banneret. Svaret lagres
lokalt under nøkkelen `nvrmnd:embeds` og sendes ingen steder. Sier man ja,
lastes spillerne umiddelbart ved alle senere besøk. Sier man nei, vises en
lenke ut til plattformen i stedet. Valget kan endres via «Cookie choice»
nederst på forsiden.

**Dette er hele poenget med banneret:** et banner som ikke faktisk stopper
lastingen er bare pynt, siden informasjonskapslene da allerede er satt.

## 9b. Plan: bildemosaikk i om-seksjonen

Besluttet 6. september etter ekstern vurdering, venter på materiale.

**Hva:** 2 til 4 bilder eller korte klipp som bygger universet. Ikke flere.
Typisk: ett artistfoto, ett studiofoto, ett live-bilde til, eventuelt ett
klipp på 10 til 15 sekunder uten lyd.

**Hvor:** Om-seksjonen. Det eksisterende pressebildet blir ett av dem.

**Hvordan:** Et stramt rutenett under bioen, samme rammer og skannelinjer
som pressebildet har i dag, samme fargelag hvis bildene trenger det. Klipp
spilles av stumt i loop, uten kontroller. Ingen bildekarusell, ingen
lightbox, ingen bildetekster utover en liten etikett som «Studio» eller
«Live, 2026».

**Hva det ikke skal bli:** Et galleri. Vurderingen advarte mot å gjøre siden
til «enda en DJ-side», og fire bilder er grensen.

**Filer:** Legg dem i `assets/` som `photo-1.jpg` og så videre, helst
1600px på lengste side. Klipp som `.mp4`, H.264, under 3 MB.

## 10. Status ved dagens slutt

Siden er **ferdig og live**. Alt av struktur, design, animasjon, SEO,
personvern og dokumentasjon er på plass. Det som gjenstår er innhold som
bare Marius kan levere, og to ting distributøren må rette.

**Verifisert:**

- Null konsollfeil på forsiden, 404-siden og personvernsiden
- Ingen vannrett scroll på 1440px og 390px
- Ingen kall til Spotify eller SoundCloud før samtykke er gitt
- Alle lenker klikkbare, testet med treffpunkt-måling
- Alle filer svarer 200 på den publiserte adressen

**Neste gang, i prioritert rekkefølge:**

1. Booking-e-post opprettes og legges inn
2. 2 til 4 bilder eller korte klipp, se avsnitt 9b. Venter på Marius.
3. Bioen er skrevet om med fakta fra Mathias. Gjenstår: historien bak
   navnet, når Marius selv vil fortelle den.
4. SoundCloud-brukernavnet endres til `nvrmnd`
5. Meld fra til distributøren om YouTube-kanalen og Amazon-profilen
6. Vurder eget domene

## 11. Åpne spørsmål

- [ ] Booking-e-post opprettes, så byttes plassholderen ut
- [ ] Marius døper om SoundCloud til `soundcloud.com/nvrmnd`, så oppdateres lenkene
- [ ] Pressebilde
- [ ] Bio i hans egen stemme
- [ ] TikTok-profil
- [ ] Konsertseksjon når det finnes datoer
- [ ] Eget domene? (Settings → Pages → Custom domain)
- [x] ~~Skal siden publiseres?~~ Live siden 6. september 2026

## 12. Slik publiseres endringer

Alt som pushes til `main` går live etter ca. ett minutt.

```bash
git add -A
git commit -m "beskrivelse av endringen"
git push
```

## 13. Feil funnet i gjennomgangen 6. september

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
| Pressebildet ble en tynn stripe på mobil | 16:10 er for flatt på smal skjerm. Nå 4:3 under 900px og kvadratisk under 520px. |
| Markøren frøs over spillerne | En iframe er et eget dokument og sender ingen musebevegelser til oss. Ringen skjules mens pekeren er over. |
| SoundCloud-spilleren var hvit | Den vanlige widgeten har ingen mørk modus. Byttet til visual=true, som bruker coveret som mørk bakgrunn. |
| SoundCloud-spilleren tok for mye plass | Flyttet til egen kolonne, 480x278. Widgetens hvite bunnstripe beskjæres ved at iframen får 300px og beholderen 278px. |
| Footeren var ulik på de tre sidene | 404 og personvern manglet NVRMND-ordet, og lenkene varierte. Nå identisk overalt. |
| Cookie choice virket bare på forsiden | Håndteringen lå inne i initEmbeds. Flyttet ut, og sender nå brukeren til musikkseksjonen fra sider uten spillere. |
| Samtykkebanneret på mobil | Manglet env(safe-area-inset-bottom), lå under korn-laget, og la seg oppå mobilmenyen. |
| Statistikkraden brakk på mobil | Etikettene («Release out now») var bredere enn tallene. Kortere etiketter, og raden er nå et rutenett med tre like kolonner. |
| Parallakse kunne flytte elementer oppå naboer | Elementer langt utenfor skjermen fikk store forskyvninger. Nå begrenset til ±90px. |

## 14. Beslutningslogg

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

**6. sep 2026.** Finpuss og SEO etter ny titt på landonorris.com. Hentet:
ordvis avsløring på seksjonsoverskriftene, en fast «Listen»-lenke i menyen
(hans har butikken der), og eyebrow-teksten «NVR001 out now» som lenke til
musikken. Bildetekster med sted og år kommer med mosaikken. SEO: manifest,
alternateName «Nevermind» i strukturerte data, MusicAlbum for singelen,
rel="me" på Instagram, aria-label på h1. Tilgjengelighet: hopp-lenke og
synlig tastaturfokus. Versjonsnummer på CSS og JS, fordi Pages bufrer i ti
minutter og Mathias så gammel stil. «Norway» tatt ut av footeren, alt annet
der er lenker. Ikke hentet fra Lando: nyhetsbrev, butikk, partnerlogoer,
scroll-låsing og lys/mørk-bytte per seksjon. Alt det ville gjort siden til
det vurderingen advarte mot.

**6. sep 2026.** Follow og Contact byttet plass. Rekkefølgen er nå Music,
About, Follow, Contact, nummerert 01 til 04, og menyen følger.

**6. sep 2026.** Bioen skrevet om med fakta fra Mathias: NVRMND er en holdning
(lang historie bak, ikke fortalt ennå), musikk i flere år uten utgivelse før
Need Me, mange DJ-jobber via T-Event men aldri spilt egen musikk live, lytter
til Project One og Vertile, nye låter er påbegynt uten navn. T-Event er ikke
nevnt i bioen. Follow-seksjonen bygget om til rutenett av rader med Instagram
i full bredde øverst, og pila på den røde knappen fikset (rød på rødt).

**6. sep 2026.** Follow-seksjon lagt til (04 / Follow) med de sosiale lenkene,
slik at Instagram fortsatt har et hjem når booking-e-posten erstatter
Instagram-lenken i kontaktboksen. Overskriften «Next one drops here» i stedet
for «Follow me», for å holde stemmen. Bildemosaikk planlagt, se 9b.
Beskjed om SoundCloud-brukernavn er gitt. Mo i Rana skal ikke inn i hero
eller tekstbånd, det er bekreftet på nytt.

**6. sep 2026.** Ekstern vurdering mottatt: 8,5/10. Sterk identitet og
språk, men for «under construction» på booking, Instagram burde stikke ut,
og siden trenger 2 til 4 bilder til. Booking-boksen lenker nå direkte til
Instagram-DM og Instagram-knappen er fylt rød. Bilder og e-post venter på
Marius. Vurderingen advarte samtidig mot å overdesigne, og mot å gjøre den
til «enda en DJ-side» med Upcoming events, Follow me og lignende.

**6. sep 2026.** Ny gjennomgang med designforbedringer: større hero-tittel som
fyller bredden, plattformlenker som rutenett (3x2 desktop, 2x3 mobil),
statistikk som rutenett, pressebildet i 3:2 med mer plass, kortere hero på
mobil, footer i kolonne på mobil. To feil rettet, se tabellen.

**6. sep 2026.** Footeren ensrettet på alle tre sider. Samtykkebanneret rettet
for mobil. Alle .md-filer oppdatert. Dagen avsluttet med siden live og verifisert.

**6. sep 2026.** Innebygde spillere fra Spotify og SoundCloud lagt inn, styrt av
et samtykkebanner. Verifisert at ingenting kontakter dem før samtykke er gitt.
Personvernerklæring skrevet. Pressebilde lagt inn midlertidig. REMEMBER tatt ut
av tekstbåndene. Geografien i hero rettet.

**6. sep 2026.** Full gjennomgang med headless Chrome. Ni feil funnet og rettet,
se avsnitt 12. SEO lagt inn: strukturerte data, robots.txt, sitemap, kanonisk
URL og eget delingsbilde i 1200x630. Egen 404-side laget. Kreditering til
T-Event i footeren. Årstallet i footeren settes nå automatisk.
