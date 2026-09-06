# Bidra til prosjektet

Takk for interessen. Les det første avsnittet før du gjør noe annet.

---

## Først: dette er ikke et åpent prosjekt

Repoet er offentlig fordi GitHub Pages krever det på gratiskonto, ikke fordi
koden er fri. Alt innholdet er beskyttet av opphavsrett, se `LICENSE.md`.

Det betyr i praksis:

- **Pull requests utenfra blir som regel avvist.** Ikke fordi de er dårlige,
  men fordi vi ikke har et rammeverk for å ta imot dem.
- **Har du funnet en feil?** Gjerne opprett et issue. Det setter vi pris på.
- **Vil du bruke koden i ditt eget prosjekt?** Spør. Se `LICENSE.md`.
- **Sikkerhetshull?** Ikke opprett issue. Les `SECURITY.md` først.

Skal dette bli et ordentlig åpent prosjekt en dag, må lisensen endres først.
MIT er da et naturlig valg for koden, med innholdet holdt utenfor.

---

## For deg som jobber på siden

### Kom i gang

Ingen installasjon. Ingen `npm install`. Klon repoet og start en lokal server:

```bash
python3 -m http.server 8765
# → http://localhost:8765
```

Du kan også åpne `index.html` rett i nettleseren, men en server er tryggere.
Noen nettlesere er sære med lokale filer.

### Hvor ting ligger

| Skal du endre… | Åpne |
|---|---|
| Tekst, lenker, seksjoner | `index.html` |
| Feilside eller personvern | `404.html`, `privacy.html` |
| Farger, typografi, layout | `css/style.css` |
| Animasjoner og oppførsel | `js/main.js` |
| Bilder | `assets/` |

`SPEC.md` forklarer hvordan det henger sammen. `PLACEHOLDERS.md` lister hva som
fortsatt er midlertidig.

### Farger

Ikke skriv fargekoder direkte i reglene. Alt ligger som variabler i `:root`
øverst i `css/style.css`:

```css
color: var(--red);        /* ✅ */
color: #FF1F3D;           /* ❌ */
```

Endrer du en variabel, endres hele siden. Det er poenget.

### Animasjoner

Alt som må kjøre hver frame skal inn i den eksisterende `loop()`-funksjonen
nederst i `main.js`. **Ikke start en ny `requestAnimationFrame`-løkke.** Én
løkke som gjør fem ting er raskt. Fem løkker som gjør én ting hver er ikke.

Animer kun `transform` og `opacity`. Rører du `top`, `left`, `width` eller
`height` per frame, hakker det.

### Ny animasjon? Sjekk `prefers-reduced-motion`

Alt av bevegelse må kunne slås av. Enten via CSS-blokka nederst i `style.css`,
eller via `reduced`-variabelen i `main.js`:

```js
if (reduced) return;
```

Dette er ikke valgfritt. Noen får migrene eller kvalme av bevegelse på nett.

### Skrivestil på siden

**Ingen lange tankestreker i teksten.** Bruk hele setninger, punktum eller
skråstrek som skilletegn. Det gjelder også `<title>`, meta-beskrivelser og
alt-tekster.

### Footeren skal være lik overalt

De tre HTML-sidene har identisk footer. Endrer du den ett sted, endre den alle
tre stedene.

### Nytt tredjepartsinnhold må gjennom samtykke

Legger du inn noe som lastes fra en annen tjeneste, en spiller, et kart, en
video, skal det ikke stå som en ferdig `iframe` i HTML-en. Bruk samme mønster
som spillerne: en tom `div` med `data-embed-src`, som JavaScript fyller først
når samtykke finnes. Ellers settes informasjonskapslene før noen har fått
velge, og samtykkebanneret blir meningsløst.

### Stil på koden

- To mellomrom innrykk
- Kommentarer på norsk, innhold på siden på engelsk
- Klassenavn følger BLOCK\_\_element--modifier
- Ingen nye avhengigheter. Trenger du et bibliotek, spør først.
  Svaret er sannsynligvis «skriv det for hånd, det er 30 linjer»

### Før du pusher

Det finnes ingen testsuite. Gå gjennom dette for hånd:

- [ ] Fungerer siden i Chrome, Safari og Firefox?
- [ ] Er footeren fortsatt lik på index, 404 og privacy?
- [ ] Laster spillerne fortsatt ingenting før man har sagt ja?
- [ ] Ser den riktig ut på mobil? (smal skjerm, ingen vannrett scroll)
- [ ] Slå på «Reduser bevegelse» i systeminnstillingene, er siden fortsatt brukbar?
- [ ] Virker alle lenker, og åpnes de eksterne i ny fane?
- [ ] Ingen feil i konsollen?
- [ ] `node --check js/main.js` går rent

### Commits

Skriv på norsk, i imperativ, og forklar *hvorfor* hvis det ikke er åpenbart:

```
Fiks egendefinert markør som viste dobbel peker

Systempekeren ble aldri skjult, så brukeren så både OS-pilen og
ringen vår samtidig. Skjuler den nå via body.has-cursor.
```

### Publisering

Push til `main` går live automatisk etter omtrent ett minutt. Det finnes ingen
staging. Er du usikker, lag en branch og be om gjennomsyn først.

---

## Spørsmål?

Ta kontakt via [@nvrmnd.hardstyle](https://www.instagram.com/nvrmnd.hardstyle).
