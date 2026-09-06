# CLAUDE.md

Kort brief til deg som åpner prosjektet på nytt. Detaljene ligger i de andre
dokumentene, denne fila er bare det du må vite før du rører noe.

## Hva dette er

Ettsides artistnettside for hardstyle-produsenten **NVRMND**. Ren HTML, CSS og
JavaScript. Ingen rammeverk, ingen npm, ingen bygg-steg. Ligger på GitHub Pages
fra `main`, og går live omtrent ett minutt etter push.

**Live:** https://t-event.github.io/nvrmnd-website/

## Regler som ikke er til forhandling

- **Spør heller enn å anta.** Mathias har bedt om dette uttrykkelig. Er noe
  uklart i en oppgave, still spørsmålet i stedet for å gjette deg fram.
- **Ingen tankestreker noe sted.** Verken på siden, i dokumentasjonen eller i
  commit-meldinger. Mathias mener de avslører bruk av AI umiddelbart. Bruk
  punktum eller komma. Sjekk før du pusher, med et søk som ikke selv
  inneholder tegnet:

  ```bash
  grep -rln "$(printf '\xe2\x80\x94')" . --include='*.md' --include='*.html' \
    --include='*.css' --include='*.js' --include='*.txt' | grep -v '\.git/'
  ```
- **Navnet til Marius skal ikke stå på siden.** Han står bak NVRMND, men
  artisten er anonym utad. Navnet finnes i dag bare i SoundCloud-adressen, og
  den skal han døpe om.
- **Ingen emojier i grensesnittet.** Bruk SVG-ikonene, se under.
- Siden er på engelsk. All dokumentasjon er på norsk.

## Etter endringer

| Du endret | Kjør |
|---|---|
| `css/style.css` eller `js/main.js` | `sh tools/bump.sh` |
| Footeren eller pil-ikonene | `python3 tools/sync-shared.py` |
| Et bilde i `assets/` | `node tools/images.mjs "$PWD"` |
| Hva som helst, før avslutning | `sh tools/check-links.sh` |

`bump.sh` er den viktigste. GitHub Pages ber nettlesere bufre CSS og JS i ti
minutter, så uten nytt versjonsnummer ser folk gammel stil etter deploy.

## Feller som har bitt oss før

Disse ser uskyldige ut og knekker noe hver gang. Full liste i `SPEC.md`
under «Ikke gjør dette».

- `<meta name="color-scheme" content="dark">` gir hvit flate bak
  Spotify-spillerens runde hjørner.
- Overskrifter må ikke arve fet vekt. Anton finnes bare i vekt 400, og
  nettleseren lager da en falsk fet variant som ser ulik ut i Chrome og Safari.
- Unicode-piler som ↗ tegnes som emoji på iPhone. Bruk `<svg class="ico">`
  med `<use href="#i-ne">`.
- Scramble-effekten skal ikke ligge på informasjon folk leser. Utgivelsesdato
  og spilletid får `data-no-scramble`.
- `clip-path` teller med i `IntersectionObserver` i Chrome, så bilde-wipe
  håndteres i rAF-løkka i stedet.
- `index.html` har to SVG-blokker. Pilene deles med de andre sidene,
  merkeikonene for strømmetjenestene gjør ikke det. `sync-shared.py` stopper
  hvis noen roter dem sammen.

## Testing

Det finnes ingen testpakke. Slik har vi verifisert endringer:

```bash
python3 -m http.server 8765
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --remote-debugging-port=9333 --user-data-dir=/tmp/nvrmnd-chrome
```

Deretter styres Chrome over DevTools-protokollen fra små Node-skript, for
konsollfeil, skjermbilder, treffområder og hvilken bildevariant som lastes.
Husk `Network.setCacheDisabled`, ellers gjenbruker Chrome en større
bildevariant den allerede har.

To ting kan ikke verifiseres herfra: Spotify-spillerens hjørner, siden
headless Chrome ikke tegner kryssdomene-iframes, og gyro og trykk på ekte
telefon.

## Dokumentene

| Fil | Når du trenger den |
|---|---|
| `PROSJEKT.md` | Hukommelsen. Valg, begrunnelser, status og logg. Start her |
| `SPEC.md` | Hvordan siden er bygget, og hva du ikke skal gjøre |
| `VEDLIKEHOLD.md` | Sjekklister: ny utgivelse, nytt domene, delte blokker |
| `PLACEHOLDERS.md` | Hva som fortsatt er midlertidig |
| `CONTRIBUTING.md` | Konvensjoner i koden |

## Hvor det står nå

Siden er teknisk ferdig og målt. Lighthouse: desktop 100 på alt, mobil
96 / 100 / 100 / 100. Alt som gjenstår handler om innhold, ikke kode, og det
meste venter på Marius. Prioritert liste i `PROSJEKT.md` avsnitt 10.

Det viktigste enkeltpunktet er låt nummer to. Katalogen på én utgivelse er
det som holder siden igjen nå, ikke håndverket.
