# Sikkerhet

## Hva som faktisk står på spill

Vær ærlig om hva dette er: en statisk nettside. Ingen server, ingen database,
ingen innlogging, ingen brukerdata, ingen skjemaer, ingen betaling. HTML, CSS,
JavaScript og noen bilder, servert av GitHub Pages.

Angrepsflaten er derfor liten. Det verste noen kan få til på selve siden er
å endre hvordan den ser ut for én besøkende i deres egen nettleser.

**Det som derimot er verdt å beskytte:**

- GitHub-kontoen som eier repoet. Noen med tilgang kan endre siden for alle
- Artistkontoene på Spotify, Apple Music, SoundCloud og Instagram
- Distributørkontoen som publiserer musikken

Det er der en reell hendelse ville gjort skade, ikke i CSS-en.

## Meld fra om et sikkerhetsproblem

**Ikke opprett et vanlig GitHub-issue.** Issues er offentlige, og da vet alle om
hullet samtidig som oss.

Send heller direktemelding til
[@nvrmnd.hardstyle](https://www.instagram.com/nvrmnd.hardstyle) på Instagram.

Ta med:

- Hva problemet er
- Hvordan det kan utnyttes, steg for steg
- Hva som er verste utfall
- Nettleser og operativsystem hvis det er relevant

Du får bekreftelse innen én uke. Dette er et fritidsprosjekt uten vaktordning,
så vær tålmodig, men gi gjerne en påminnelse hvis det blir stille.

## Hva vi ber deg om

- Gi oss rimelig tid til å fikse det før du forteller det videre
- Ikke tapp data, endre innhold eller ødelegg noe mens du undersøker
- Ikke kjør automatiserte skannere mot GitHub Pages. Det er Microsofts
  infrastruktur, ikke vår, og de har egne regler for det

Vi har ingen belønningsordning. Vi kan tilby en takk, og kreditering hvis du vil.

## Hva som gjelder som sikkerhetsproblem

**Ja:**

- Måter å kjøre fremmed JavaScript på siden (XSS)
- Måter å endre innholdet som besøkende ser
- Lekkasje av noe som ikke skulle ligget i repoet, nøkler, tokens, private filer
- Problemer med hvordan Google Fonts eller andre eksterne ressurser lastes

**Nei:**

- Manglende `Content-Security-Policy` og andre sikkerhetsheadere. Vi kan ikke
  sette headere på GitHub Pages. Vi vet.
- «Nettsiden bruker Google Fonts.» Ja, det er et bevisst valg, og det står
  forklart i personvernerklæringen.
- «Spillerne setter informasjonskapsler.» Ja, og derfor lastes de ikke uten
  samtykke. Finner du en måte å omgå det på, vil vi svært gjerne vite det.
- Rapporter fra automatiske skannere uten at du har vist at det faktisk
  kan utnyttes
- Feil på tredjepartsplattformene (Spotify, YouTube, Amazon). Meld dem til dem.
  Se `PLACEHOLDERS.md` for de vi allerede kjenner til.

## Hva vi selv gjør

- **Ingen avhengigheter.** Null npm-pakker betyr null forsyningskjede-risiko.
  Det er den viktigste sikkerhetsegenskapen denne siden har.
- **Ingen hemmeligheter i repoet.** Ingen API-nøkler, ingen tokens. Det finnes
  ikke noe å lekke.
- **Alle eksterne lenker** bruker `rel="noopener"` så målsiden ikke får tilgang
  til vår `window`.
- **HTTPS er påtvunget** via GitHub Pages.
- **Ingen sporing fra oss.** Ingen analytics, ingen egne informasjonskapsler.
  Ingen persondata samles inn, så det finnes heller ingen å miste.
- **Tredjepartsinnhold er gated.** Spotify- og SoundCloud-spillerne lastes
  ikke før den besøkende har sagt ja. Iframene settes inn av JavaScript, aldri
  fra rå brukerinput, og alle får `referrerpolicy` og en avgrenset `allow`.

## Anbefalinger til kontoeierne

Dette betyr mer for sikkerheten enn noe i koden:

- Slå på tofaktorautentisering på GitHub-kontoen
- Slå på tofaktor på Instagram, Spotify for Artists og distributørkontoen
- Bruk unike passord, ikke det samme på musikkontoene som andre steder
- Ikke gi tredjepartsapper mer tilgang til artistkontoene enn nødvendig
