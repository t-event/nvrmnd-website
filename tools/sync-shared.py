#!/usr/bin/env python3
"""Kopierer de delte blokkene fra index.html til 404.html og privacy.html.

Delte blokker:
  - <footer class="footer"> ... </footer>
  - ikonsymbolene (<svg ...> med id="i-ne" osv.)

Rediger dem KUN i index.html, og kjør deretter:

    python3 tools/sync-shared.py

Uten dette må hver endring gjøres tre steder, og de sklir fra hverandre.
"""
import io, os, re, sys

os.chdir(os.path.join(os.path.dirname(__file__), '..'))
src = io.open('index.html', encoding='utf-8').read()

def block(text, start, end):
    a = text.index(start)
    b = text.index(end, a) + len(end)
    return text[a:b]

footer = block(src, '<footer class="footer">', '</footer>')
icons  = block(src, '<svg width="0" height="0"', '</svg>')

changed = 0
for f in ['404.html', 'privacy.html']:
    t = io.open(f, encoding='utf-8').read()
    new = t
    new = new.replace(block(new, '<footer class="footer">', '</footer>'), footer)
    new = new.replace(block(new, '<svg width="0" height="0"', '</svg>'), icons)
    if new != t:
        io.open(f, 'w', encoding='utf-8').write(new)
        changed += 1
        print('oppdatert:', f)
print('ferdig.', changed, 'fil(er) endret.' if changed else 'alt var allerede likt.')
