# NVRMND

Offisiell nettside for hardstyle-artisten **NVRMND** fra Mo i Rana.

**Live:** https://t-event.github.io/nvrmnd-website/

Én lang, animasjonstung side i ren HTML, CSS og JavaScript. Ingen rammeverk,
ingen npm, ingen bygg-steg, null avhengigheter.

---

## Kjør lokalt

```bash
python3 -m http.server 8765
# → http://localhost:8765
```

Du kan også åpne `index.html` rett i nettleseren.

## Struktur

```
index.html          Hele siden
css/style.css       All styling. Fargevariabler i :root øverst
js/main.js          Alle animasjoner, delt i 11 nummererte seksjoner
assets/             Coverbilder
```

## Dokumentasjon

| Fil | Innhold |
|---|---|
| [SPEC.md](SPEC.md) | Teknisk spesifikasjon. Hvordan siden er bygget og hvorfor |
| [PLACEHOLDERS.md](PLACEHOLDERS.md) | Hva som fortsatt er midlertidig og må byttes ut |
| [PROSJEKT.md](PROSJEKT.md) | Prosjektnotater og logg over valg som er tatt |
| [CONTRIBUTING.md](CONTRIBUTING.md) | For deg som skal endre noe på siden |
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
