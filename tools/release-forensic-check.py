#!/usr/bin/env python3
from __future__ import annotations
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse, unquote
import json, re, subprocess, sys
from PIL import Image

ROOT = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path.cwd()
errors=[]; notes=[]

def err(msg): errors.append(msg)

def text(rel): return (ROOT/rel).read_text(encoding='utf-8')

pkg=json.loads(text('package.json'))
version=pkg.get('version')
if version!='4.0.9': err(f'package version inesperada: {version}')

router=text('js/experience-router-v4.js')
if 'window.dispatchEvent(new CustomEvent("forno:experience-intent"' not in router: err('Experience Router não publica intent no window')
if 'detail: { intent: routeId, routeId }' not in router: err('Experience Router payload incompatível com consumidores')

adaptive=text('js/adaptive-commerce-v4.js')
if 'snap.business.open === false' not in adaptive: err('Adaptive Commerce não reconhece business.open')

resilience=text('js/resilience-v4.js')
if 'window.FORNO_META?.version || "4.0.9"' not in resilience: err('Resilience não acompanha versão da release')
if 'STORAGE_PREFIXES' in resilience: err('Resilience ainda usa prefixo amplo para classificar JSON no storage')
if 'getBagProductIds' not in resilience: err('Reconciliação resiliente não usa IDs reais da Sacola')

main=text('js/main.js')
if 'function getBagProductIds()' not in main or 'getBagProductIds,' not in main: err('FORNO_APP não expõe IDs não sensíveis para reconciliação')

rosa=text('js/rosa.js')
if 'forno:rosa-recommendation' not in rosa: err('Rosa não emite evento de recomendação para telemetria')

admin_media=text('js/admin-media-content.js')
if 'version||"3.9.9"' in admin_media: err('Admin media exporter ainda possui fallback 3.9.9')

# Physical budgets: use shipped JS/CSS and product media, not archival master logo.
budgets=json.loads(text('data/performance-budgets-v4.json'))['budgets']
js_kb=sum(p.stat().st_size for p in (ROOT/'js').glob('*.js'))/1024
css_kb=sum(p.stat().st_size for p in (ROOT/'css').glob('*.css'))/1024
product_images=[p for p in (ROOT/'assets/images/products').iterdir() if p.is_file() and p.suffix.lower() in {'.webp','.avif','.jpg','.jpeg','.png'}]
max_product=max((p.stat().st_size for p in product_images), default=0)/1024
if js_kb > budgets['javascriptTotalKb']: err(f'JS total {js_kb:.1f}KB > budget {budgets["javascriptTotalKb"]}KB')
if css_kb > budgets['cssTotalKb']: err(f'CSS total {css_kb:.1f}KB > budget {budgets["cssTotalKb"]}KB')
if max_product > budgets['singleImageKb']: err(f'produto maior {max_product:.1f}KB > budget {budgets["singleImageKb"]}KB')
notes.append(f'JS {js_kb:.1f}KB; CSS {css_kb:.1f}KB; maior mídia de produto {max_product:.1f}KB')

# Every shipped HTML img width/height ratio must match the actual local file.
class Parser(HTMLParser):
    def __init__(self): super().__init__(); self.images=[]
    def handle_starttag(self, tag, attrs):
        if tag=='img': self.images.append(dict(attrs))
ratio_checked=0
for html in ROOT.rglob('*.html'):
    if 'templates' in html.parts: continue
    parser=Parser(); parser.feed(html.read_text(encoding='utf-8',errors='ignore'))
    for attrs in parser.images:
        src=attrs.get('src'); w=attrs.get('width'); h=attrs.get('height')
        if not src or not w or not h or src.startswith(('http:','https:','data:')): continue
        target=(html.parent/unquote(urlparse(src).path)).resolve()
        if not target.exists(): continue
        try:
            with Image.open(target) as im: actual=(im.width,im.height)
            declared=(int(w),int(h)); ratio_checked+=1
        except Exception: continue
        if abs(declared[0]/declared[1] - actual[0]/actual[1]) > .01:
            err(f'intrinsic ratio incorreto: {html.relative_to(ROOT)} -> {src}, HTML {declared}, arquivo {actual}')
notes.append(f'{ratio_checked} imagens HTML verificadas por proporção intrínseca')

# Behavior mini-suite.
behavior=subprocess.run(['node','tools/v4-behavior-forensics-check.js'], cwd=ROOT, capture_output=True, text=True)
if behavior.returncode:
    err('v4 behavior forensics falhou:\n'+behavior.stdout+behavior.stderr)
else:
    notes.append(behavior.stdout.strip().splitlines()[-1])

if errors:
    print('RELEASE FORENSIC GATE: FAIL')
    for item in errors: print('-',item)
    raise SystemExit(1)
print('RELEASE FORENSIC GATE: PASS')
for item in notes: print('-',item)
