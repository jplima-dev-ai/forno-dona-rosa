#!/usr/bin/env python3
from pathlib import Path
import json, re
ROOT=Path(__file__).resolve().parents[1]
checks=[]
def check(name,cond): checks.append((name,bool(cond))); print(('PASS' if cond else 'FAIL'),name)
pkg=json.loads((ROOT/'package.json').read_text(encoding='utf-8'))
cat=json.loads((ROOT/'data/catalog.json').read_text(encoding='utf-8'))
html=(ROOT/'index.html').read_text(encoding='utf-8')
store=(ROOT/'js/storefront.js').read_text(encoding='utf-8')
css=(ROOT/'css/visual-desire-v4.css').read_text(encoding='utf-8')
vm=(ROOT/'js/visual-media-v4.js').read_text(encoding='utf-8')
products=cat.get('products',[])
check('version >= 4.0.1',tuple(map(int,pkg.get('version','0.0.0').split('.'))) >= (4,0,1))
check('catalog schema v3+',int(cat.get('schemaVersion',0))>=3)
check('every product media contract',all(all(k in p.get('media',{}) for k in ['catalog','hero','detail','temperature','visualTraits']) for p in products))
check('drink cold contract',all(p.get('media',{}).get('temperature')=='cold' for p in products if p.get('type')=='bebida'))
check('pizza hot contract',all(p.get('media',{}).get('temperature')=='hot' for p in products if p.get('type')=='pizza'))
check('responsive picture sources','image/avif' in vm and 'image/webp' in vm and 'srcset' in vm and 'sizes' in vm)
check('storefront visual renderer','FORNO_VISUAL_MEDIA' in store)
check('visual css wired','css/visual-desire-v4.css' in html)
check('visual js wired','js/visual-media-v4.js' in html)
check('reduced motion','prefers-reduced-motion' in css)
check('forced colors','forced-colors' in css)
check('container query','@container' in css)
failed=[n for n,c in checks if not c]
print(f'{len(checks)-len(failed)}/{len(checks)} visual-desire checks passed')
raise SystemExit(1 if failed else 0)
