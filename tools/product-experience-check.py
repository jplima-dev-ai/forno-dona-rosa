#!/usr/bin/env python3
from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[1]
checks=[]
def check(name,ok):
 checks.append((name,bool(ok))); print(('PASS' if ok else 'FAIL'),name)
bs=(ROOT/'tools/build-site.py').read_text(encoding='utf-8'); css=(ROOT/'css/site-pages.css').read_text(encoding='utf-8'); js=(ROOT/'js/global-search.js').read_text(encoding='utf-8'); ch=(ROOT/'CHANGELOG.md').read_text(encoding='utf-8'); pkg=json.loads((ROOT/'package.json').read_text(encoding='utf-8'))
VERSION=pkg.get('version'); check(f'current version {VERSION}',bool(VERSION))
for patch in range(10): check(f'changelog 3.1.{patch}',f'## 3.1.{patch} ' in ch)
check('global site search dialog','global-search-dialog' in bs and 'global-search.js' in bs)
check('search covers products and static pages','products=()=>' in js and 'const pages=' in js)
check('search keyboard navigation','ArrowDown' in js and 'ArrowUp' in js)
check('featured menu curation','featured-products__grid' in bs and 'featured-products__grid' in css)
check('product pairing recommendation','pairing_id' in bs and 'product-pairing' in css)
check('product confidence copy','product-confidence' in bs and 'product-confidence' in css)
check('responsive search fullscreen','height:100dvh' in css and '.global-search-dialog' in css)
check('featured mobile horizontal scroller','scroll-snap-type:x mandatory' in css)
check('forced colors premium surfaces','@media(forced-colors:active)' in css)
check('reduced motion product media','@media(prefers-reduced-motion:reduce)' in css)
check('new gate in quality command','product-experience-check.py' in pkg['scripts']['quality'])
failed=[n for n,o in checks if not o]; print(f'{len(checks)-len(failed)}/{len(checks)} product-experience checks passed'); raise SystemExit(1 if failed else 0)
