#!/bin/sh
# Setter nytt versjonsnummer på CSS og JS i alle HTML-filer, og dagens dato
# som lastmod i sitemap.xml. Kjør etter hver endring i style.css eller main.js:
#
#   sh tools/bump.sh
#
# GitHub Pages ber nettlesere bufre filer i ti minutter. Uten nytt
# versjonsnummer ser folk gammel stil en stund etter deploy.
set -e
cd "$(dirname "$0")/.."
V="$(date +%Y%m%d)$(printf '%s' "$(date +%H%M)" | tr -d ':')"
TODAY="$(date +%Y-%m-%d)"
for f in index.html 404.html privacy.html; do
  sed -i '' -E "s|style\.css\?v=[^\"]*|style.css?v=$V|; s|main\.js\?v=[^\"]*|main.js?v=$V|" "$f"
done
sed -i '' -E "s|<lastmod>[0-9-]+</lastmod>|<lastmod>$TODAY</lastmod>|g" sitemap.xml
echo "versjon $V satt i index.html, 404.html, privacy.html. sitemap lastmod $TODAY."
