#!/bin/sh
# Bytter den publiserte adressen overalt den er hardkodet. Bruk ved flytting
# til eget domene:
#
#   sh tools/set-domain.sh https://nvrmnd.no
#
# Rører alle publiserte filer som har adressen hardkodet, og dokumentasjonen.
# Husk også: CNAME-fil i rotmappa, og Settings > Pages > Custom domain.
#
# llms.txt er lett å glemme. Den er en publisert fil som språkmodeller leser,
# og en gammel adresse der sender dem til feil sted.
set -e
[ -n "$1" ] || { echo "bruk: sh tools/set-domain.sh https://nytt.domene"; exit 1; }
cd "$(dirname "$0")/.."
NEW="${1%/}/"
OLD="https://t-event.github.io/nvrmnd-website/"

# Publiserte filer. Adressen står i canonical, Open Graph, strukturerte data,
# nettstedskartet og robots.
for f in index.html 404.html privacy.html sitemap.xml robots.txt llms.txt; do
  [ -f "$f" ] && sed -i '' "s|$OLD|$NEW|g" "$f"
done

# Dokumentasjonen. Ellers peker «Live:» i README til den gamle adressen.
for f in README.md SPEC.md PROSJEKT.md PLACEHOLDERS.md VEDLIKEHOLD.md; do
  [ -f "$f" ] && sed -i '' "s|$OLD|$NEW|g" "$f"
done

echo "byttet til $NEW"
echo
echo "Rester av gammel adresse (set-domain.sh skal stå igjen, den holder OLD):"
grep -rn "$OLD" . --include='*.html' --include='*.xml' --include='*.txt' \
  --include='*.md' --include='*.webmanifest' 2>/dev/null \
  | grep -v '^\./\.git/' || echo "  ingen"
echo
echo "Husk: sh tools/bump.sh, CNAME-fil, Pages-innstilling, og skrap"
echo "delingsbildet på nytt hos Facebook."
