# NVRMND

Offisiell nettside for hardstyle-artisten **NVRMND**.

**Live:** https://t-event.github.io/nvrmnd-website/

Én lang, animasjonstung side bygget i ren HTML, CSS og JavaScript — ingen
rammeverk, ingen npm, ingen bygg-steg.

## Kjør lokalt

Åpne `index.html` direkte i nettleseren, eller start en enkel lokal server:

```bash
python3 -m http.server 8765
# → http://localhost:8765
```

## Struktur

```
├── index.html      # hele siden
├── css/style.css   # all styling — fargevariabler ligger øverst
├── js/main.js      # alle animasjoner, kommentert seksjonsvis
├── PROSJEKT.md     # prosjektnotater, valg og gjenstående oppgaver
└── README.md
```

## Endre farger

Alt ligger som CSS-variabler i toppen av `css/style.css`:

```css
--bg:    #0D0410;   /* mørk lilla bakgrunn */
--red:   #FF1F3D;   /* rød aksent */
```

## Innhold som skal byttes ut

Alle plassholdere er merket med `<!-- PLASSHOLDER -->` i `index.html`.
Se `PROSJEKT.md` for full liste.

## Publisering

Siden ligger på GitHub Pages. Alt som pushes til `main` går live automatisk
etter ca. ett minutt:

```bash
git add -A
git commit -m "beskrivelse av endringen"
git push
```
