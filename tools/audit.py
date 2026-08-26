#!/usr/bin/env python3
from pathlib import Path
from html.parser import HTMLParser
import json, re, subprocess, sys

ROOT = Path(__file__).resolve().parents[1]
errors = []

class AuditParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids=[]; self.links=[]; self.refs=[]; self.h1=0; self.lang=None; self.skip=False; self.viewport=False
    def handle_starttag(self, tag, attrs):
        d=dict(attrs)
        if tag=='html': self.lang=d.get('lang')
        if d.get('id'): self.ids.append(d['id'])
        if tag=='h1': self.h1 += 1
        if tag=='meta' and d.get('name')=='viewport': self.viewport=True
        if tag=='a':
            href=d.get('href',''); self.links.append((href,d))
            if 'skip-link' in d.get('class','').split(): self.skip=True
        if tag=='script' and d.get('src'): self.refs.append(d['src'])
        if tag=='link' and d.get('href') and d.get('rel') in ('stylesheet','manifest','icon','apple-touch-icon'): self.refs.append(d['href'])
        if tag=='img' and d.get('src'): self.refs.append(d['src'])

html=(ROOT/'index.html').read_text(encoding='utf-8')
p=AuditParser(); p.feed(html)
if len(p.ids)!=len(set(p.ids)): errors.append('IDs duplicados')
if p.h1!=1: errors.append(f'Esperado 1 h1, encontrado {p.h1}')
if p.lang!='pt-BR': errors.append('lang não é pt-BR')
if not p.viewport: errors.append('meta viewport ausente')
if not p.skip: errors.append('skip link ausente')
idset=set(p.ids)
for href, attrs in p.links:
    if href=='#': errors.append('href="#" encontrado')
    if href.startswith('#') and href[1:] not in idset: errors.append(f'âncora interna quebrada: {href}')
    if attrs.get('target')=='_blank':
        rel=set((attrs.get('rel') or '').split())
        if not {'noopener','noreferrer'}.issubset(rel): errors.append(f'link _blank sem noopener+noreferrer: {href}')
for ref in p.refs:
    if re.match(r'^(?:https?:|data:|#)',ref): continue
    if not (ROOT/ref).exists(): errors.append(f'recurso local ausente: {ref}')

js=(ROOT/'js/main.js').read_text(encoding='utf-8')
for forbidden in ['innerHTML','outerHTML','insertAdjacentHTML','eval(','new Function','document.write']:
    if forbidden in js: errors.append(f'API dinâmica proibida encontrada em main.js: {forbidden}')
if "url.origin !== self.location.origin" not in (ROOT/'service-worker.js').read_text(encoding='utf-8'):
    errors.append('service worker sem restrição explícita de same-origin')
if 'Content-Security-Policy' not in html: errors.append('CSP meta ausente')

for jsfile in ['js/config.js','data/menu.js','js/main.js','service-worker.js']:
    r=subprocess.run(['node','--check',str(ROOT/jsfile)],capture_output=True,text=True)
    if r.returncode: errors.append(f'erro de sintaxe em {jsfile}: {r.stderr.strip()}')

manifest=json.loads((ROOT/'manifest.webmanifest').read_text(encoding='utf-8'))
if not manifest.get('name') or not manifest.get('icons'): errors.append('manifest incompleto')

if errors:
    print('AUDIT FAILED')
    for e in errors: print('-',e)
    sys.exit(1)
print('AUDIT PASSED')
print(f'- IDs únicos: {len(p.ids)}')
print(f'- Referências locais verificadas: {len(p.refs)}')
print('- Âncoras internas: OK')
print('- target=_blank: noopener+noreferrer OK')
print('- DOM sinks inseguros em main.js: 0')
print('- CSP: presente')
print('- Service worker same-origin: OK')
print('- JavaScript syntax: OK')
