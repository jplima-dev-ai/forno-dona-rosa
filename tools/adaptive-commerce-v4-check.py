#!/usr/bin/env python3
from pathlib import Path
import sys

root=Path(sys.argv[1]).resolve() if len(sys.argv)>1 else Path.cwd()
errors=[]

def need(rel, token=None):
    p=root/rel
    if not p.exists():
        errors.append(f'ausente: {rel}')
        return ''
    text=p.read_text(encoding='utf-8')
    if token and token not in text:
        errors.append(f'{rel}: token ausente: {token}')
    return text

html=need('index.html','js/adaptive-commerce-v4.js')
bundle=need('css/home-bundle.css')
if 'css/adaptive-commerce-v4.css' not in html and 'source: css/adaptive-commerce-v4.css' not in bundle:
    errors.append('index.html/home bundle: CSS adaptive ausente')

js=need('js/adaptive-commerce-v4.js','FORNO_ADAPTIVE_COMMERCE')
for token in ['active-order','closed','returning','guided-choice','discover-house','new-visitor','MutationObserver','FORNO_APP?.getBagSummary','window.ROSA?.open']:
    if token not in js:
        errors.append(f'adaptive-commerce-v4.js: {token} ausente')

css=need('css/adaptive-commerce-v4.css','prefers-reduced-motion')
for token in ['forced-colors',':focus-visible','grid-template-columns']:
    if token not in css:
        errors.append(f'adaptive-commerce-v4.css: {token} ausente')

need('docs/RELEASE-4.0.4.md','Nenhum endereço')

if errors:
    print('ADAPTIVE COMMERCE GATE: FAIL')
    for e in errors:
        print('-',e)
    raise SystemExit(1)
print('ADAPTIVE COMMERCE GATE: PASS')
