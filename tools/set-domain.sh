#!/bin/sh
# Bytter den publiserte adressen overalt den er hardkodet. Bruk ved flytting
# til eget domene:
#
#   sh tools/set-domain.sh https://nvrmnd.no
#
# Rører index.html, 404.html, privacy.html, sitemap.xml og robots.txt.
# Husk også: CNAME-fil i rotmappa, og Settings > Pages > Custom domain.
set -e
[ -n "$1" ] || { echo "bruk: sh tools/set-domain.sh https://nytt.domene"; exit 1; }
cd "$(dirname "$0")/.."
NEW="${1%/}/"
OLD="https://t-event.github.io/nvrmnd-website/"
for f in index.html 404.html privacy.html sitemap.xml robots.txt; do
  sed -i '' "s|$OLD|$NEW|g" "$f"
done
grep -rl "$OLD" . --include='*.html' --include='*.xml' --include='*.txt' && echo "NB: fortsatt spor av gammel adresse over" || echo "byttet til $NEW i alle filer"
