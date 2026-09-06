#!/bin/sh
# Sjekker at alle eksterne lenker på siden fortsatt svarer. Plattformer bytter
# adresser, og SoundCloud-brukernavnet skal snart endres. Kjør av og til:
#
#   sh tools/check-links.sh
cd "$(dirname "$0")/.."
grep -ohE 'href="https?://[^"]+"' index.html 404.html privacy.html \
  | sed 's/href="//; s/"$//; s/&amp;/\&/g' | sort -u | while read -r u; do
  code=$(curl -s -o /dev/null -w "%{http_code}" -L -A "Mozilla/5.0" --max-time 15 "$u")
  case "$code" in 2*|3*) status="ok  ";; *) status="FEIL";; esac
  printf "%s %s %s\n" "$status" "$code" "$u"
done
