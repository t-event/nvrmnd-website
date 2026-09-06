# NVRMND

Offisiell nettside for hardstyle-artisten **NVRMND**.

**Live:** https://t-event.github.io/nvrmnd-website/

Én lang, animasjonstung side i ren HTML, CSS og JavaScript. Ingen rammeverk,
ingen npm, ingen bygg-steg, null avhengigheter.

---

## Kjør lokalt

```bash
python3 -m http.server 8765
# → http://localhost:8765
```

Du kan også åpne `index.html` rett i nettleseren, men en lokal server er
tryggere. Noen nettlesere er sære med lokale filer.

## Filer

```
index.html          Forsiden, hele innholdet
404.html            Feilside, plukkes opp automatisk av GitHub Pages
privacy.html        Personvernerklæring
css/style.css       All styling. Fargevariabler i :root øverst
js/main.js          Alle animasjoner, delt i nummererte seksjoner
assets/             Cover, pressebilde, delingsbilde, ikoner
favicon.ico         Ikon i nettleserfanen
robots.txt          Åpner for søkemotorer og språkmodeller
sitemap.xml         Nettstedskart
```

## Dokumentasjon

| Fil | Innhold |
|---|---|
| [SPEC.md](SPEC.md) | Teknisk spesifikasjon. Hvordan siden er bygget og hvorfor |
| [PLACEHOLDERS.md](PLACEHOLDERS.md) | Hva som fortsatt er midlertidig |
| [PROSJEKT.md](PROSJEKT.md) | Prosjektnotater, valg og logg |
| [CONTRIBUTING.md](CONTRIBUTING.md) | For deg som skal endre noe |
| [SECURITY.md](SECURITY.md) | Melde fra om sikkerhetsproblemer |
| [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) | Retningslinjer for oppførsel |
| [LICENSE.md](LICENSE.md) | Alle rettigheter forbeholdt |

## Endre farger

Alt ligger som CSS-variabler øverst i `css/style.css`:

```css
--bg:    #0D0410;   /* mørk lilla bakgrunn */
--red:   #FF1F3D;   /* rød aksent */
--cyan:  #22D6E8;   /* tredjefarge, hentet fra coveret */
```

Endrer du en variabel, slår det gjennom på hele siden.

## Musikkspillerne og informasjonskapsler

Spotify- og SoundCloud-spillerne lastes **ikke** før den besøkende har sagt ja
i samtykkebanneret. Svaret lagres lokalt under `nvrmnd:embeds` og sendes ingen
steder. Sier man ja, lastes spillerne umiddelbart ved alle senere besøk.

Dette er ikke pynt. Et banner som ikke stopper lastingen er meningsløst, fordi
informasjonskapslene da allerede er satt når spørsmålet stilles.

## To moduser for musikkseksjonen

Katalogen er på én låt, så seksjonen viser én utgivelse i stort format. Den
horisontale scroll-raden ligger klar, kommentert ut i `index.html`. Slik slår
du den på når det er fire eller flere låter:

1. Legg klassen `music--rail` på `<section class="music">`
2. Bytt seksjonsinnholdet med den kommenterte blokken
3. Fyll inn ett kort per låt

All CSS og JS for raden ligger allerede inne.

## Publisering

Siden ligger på GitHub Pages. Alt som pushes til `main` går live automatisk
etter omtrent ett minutt:

```bash
git add -A
git commit -m "beskrivelse av endringen"
git push
```

Det finnes ingen staging. Er du usikker, lag en branch først.

## Lisens

Alle rettigheter forbeholdt. Repoet er offentlig fordi GitHub Pages krever det,
ikke fordi innholdet er fritt. Se [LICENSE.md](LICENSE.md).
