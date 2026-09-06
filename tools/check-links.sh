#!/bin/sh
# Sjekker at alle adresser på siden fortsatt svarer. Plattformer bytter
# adresser, og SoundCloud-brukernavnet skal snart endres. Kjør av og til,
# og alltid etter en ny utgivelse:
#
#   sh tools/check-links.sh
#
# Sjekker tre slags adresser, ikke bare lenker:
#   href=                 vanlige lenker
#   data-embed-src        Spotify- og SoundCloud-spillerne. Disse er lette å
#                         glemme, for de står ikke som lenker i markupen, og
#                         SoundCloud-adressen er URL-kodet inni spilleradressen
#   content=              delingsbildet og canonical. Et delingsbilde som gir
#                         404 er en stille feil: kortet blir bare tomt
cd "$(dirname "$0")/.."

grep -ohE '(href|data-embed-src|data-embed-fallback|content)="https?://[^"]+"' \
    index.html 404.html privacy.html \
  | sed 's/^[a-zA-Z-]*="//; s/"$//; s/&amp;/\&/g' | sort -u | while read -r u; do
  code=$(curl -s -o /dev/null -w "%{http_code}" -L -A "Mozilla/5.0" --max-time 15 "$u")
  case "$code" in 2*|3*) status="ok  ";; *) status="FEIL";; esac
  printf "%s %s %s\n" "$status" "$code" "$u"
done
