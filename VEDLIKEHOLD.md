# Vedlikehold

Sjekklister for det som må gjøres flere steder samtidig. Siden har ingen
bygg-steg, så alt som er delt mellom filer er delt for hånd. Dette er
stedene der ting sklir fra hverandre hvis man glemmer ett av dem.

Verktøyene i `tools/` tar det som lar seg automatisere.

---

## Etter hver endring i style.css eller main.js

```bash
sh tools/bump.sh
```

Setter nytt versjonsnummer på CSS og JS i alle tre HTML-filer, og dagens
dato i `sitemap.xml`. Uten dette ser folk gammel stil i ti minutter etter
deploy, fordi GitHub Pages ber nettlesere bufre filene.

## Etter endring i footer eller ikonene

Rediger kun i `index.html`, og kjør:

```bash
python3 tools/sync-shared.py
```

Kopierer `<footer>` og SVG-symbolblokka til `404.html` og `privacy.html`.
Merkeikonene for strømmetjenestene (blokka med `class="brand-defs"`) blir
ikke kopiert. De brukes bare på forsiden.

## Ny utgivelse

Siden er bygget rundt én utgivelse i stort format, og singelen er nevnt
rundt 40 steder. Alt under må vurderes. Rekkefølgen er valgt slik at det
som synes mest kommer først.

**Musikkseksjonen, `index.html`**
- [ ] Coveret: originalen i `assets/` som `<navn>.jpg` (1400 px, til deling
      og strukturerte data), og varianter laget med `tools/images.mjs`:
      640, 1100 og 1400 px i WebP, 640 og 1100 i JPEG. Bruksanvisning står
      øverst i fila. Trinnene er valgt slik at hver skjermtetthet får riktig
      fil: 1x henter 640, telefon på 3x henter 1100, retina-skjerm 1400.
      Endrer du `sizes` i HTML-en, må trinnene vurderes på nytt.
- [ ] `<picture>`-blokka rundt coveret: begge `srcset` og `alt`
- [ ] Lenka rundt coveret (Spotify-sporet)
- [ ] Etiketten med format, dato og spilletid
- [ ] Tittel og beskrivelse
- [ ] Spotify-spillerens `data-embed-src` og `data-embed-fallback`
- [ ] De seks plattformlenkene. Ny tjeneste trenger også et merkeikon,
      se `CONTRIBUTING.md`
- [ ] Remix-blokken, hvis den fortsatt er relevant

**Resten av forsiden**
- [ ] Hero: «NVR001 out now» i eyebrow-teksten
- [ ] Tekstbåndet øverst: «Need Me / Out now»
- [ ] Bioen: setningen om at Need Me var den første
- [ ] Statistikkraden: antall utgivelser
- [ ] `<title>` og `<meta name="description">`
- [ ] Open Graph- og Twitter-beskrivelsene
- [ ] Strukturerte data: `MusicRecording` med navn, dato, spilletid, lenker

**Andre filer**
- [ ] Delingsbildet: rediger `tools/og-card.html`, se under, og lagre som
      `assets/og-image.jpg` i 1200x630
- [ ] `sitemap.xml`: bildet i `<image:image>`
- [ ] `site.webmanifest`: beskrivelsen

**Når katalogen når fire låter:** bytt til den horisontale raden. Slik det
gjøres står i `PROSJEKT.md` avsnitt 6.

## Delingsbildet

Kilden er `tools/og-card.html`. Åpne den i en nettleser i 1200x630, ta
skjermbilde, lagre som `assets/og-image.jpg`. Eller med Chrome fra
kommandolinjen:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --window-size=1200,630 --screenshot=og.png \
  "file://$PWD/tools/og-card.html"
sips -s format jpeg -s formatOptions 88 og.png --out assets/og-image.jpg
```

Facebook bufrer delingsbildet hardt. Etter bytte: lim inn adressen i
Facebooks Sharing Debugger og trykk «Scrape again».

## Eget domene

```bash
sh tools/set-domain.sh https://nvrmnd.no
```

Bytter adressen i alle publiserte filer, `llms.txt` medregnet, og i
dokumentasjonen. Verktøyet skriver ut hva som eventuelt står igjen.
I tillegg, for hånd:
- [ ] `sh tools/bump.sh` etterpå
- [ ] Fil `CNAME` i rotmappa med bare domenenavnet
- [ ] Settings → Pages → Custom domain på GitHub, og «Enforce HTTPS»
- [ ] DNS hos domeneleverandøren, slik GitHub beskriver
- [ ] `tools/og-card.html` har ingen adresse, men delingsbildet må skrapes
      på nytt hos Facebook
- [ ] Google Search Console: legg til det nye domenet

## SoundCloud-brukernavn

Når profilen døpes om fra `marius-hagensen` til `nvrmnd`:

```bash
grep -rn "marius-hagensen" index.html
```

Fem steder: to sosiale lenker, plattformlenka til Need Me, remix-lenka,
SoundCloud-spillerens `data-embed-src` (URL-kodet, `%3A//`), og `sameAs`
i strukturerte data. Gamle lenker slutter å virke idet navnet endres.

## Booking-e-post

Fremgangsmåte i `PLACEHOLDERS.md`. Husk også `privacy.html` under Contact.

## Årstall

Settes av JavaScript. Fallback-verdien `2026` i HTML trenger ikke endres,
den vises bare uten JavaScript.

## Personvernerklæringen

`privacy.html` har «Last updated» nederst. Oppdater datoen hvis innholdet
endres, for eksempel når booking-e-posten kommer eller nye tredjeparter
legges til.

## Lenkesjekk

Plattformer bytter adresser, og SoundCloud-brukernavnet skal endres. Kjør
av og til, og alltid etter en ny utgivelse:

```bash
sh tools/check-links.sh
```

Sjekker 22 adresser på de tre sidene. `FEIL` betyr at noe må rettes.

Tre slags adresser dekkes, ikke bare vanlige lenker:

- `href=`, altså lenkene
- `data-embed-src`, altså Spotify- og SoundCloud-spillerne. Disse er lette å
  glemme, for de står ikke som lenker i markupen, og SoundCloud-adressen
  ligger URL-kodet inni spilleradressen
- `content=`, altså delingsbildet og canonical. Et delingsbilde som gir 404
  er en stille feil, kortet blir bare tomt

## Favicon

Kilden er `tools/favicon.html`, kandidat c. Rendre den ruta i 512x512 og
lag størrelsene:

```bash
sips -Z 192 assets/icon-512.png --out assets/favicon.png
sips -Z 180 assets/icon-512.png --out assets/apple-touch-icon.png
```

`favicon.ico` er en ICO-beholder rundt en 64 px PNG. Oppskriften ligger i
git-historikken, søk etter «favicon.ico skrevet».
