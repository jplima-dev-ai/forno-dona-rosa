#!/usr/bin/env python3
from pathlib import Path
import json

ROOT=Path(__file__).resolve().parents[1]
errors=[]

def check(label, ok):
    print(('PASS  ' if ok else 'FAIL  ')+label)
    if not ok:
        errors.append(label)

cat=json.loads((ROOT/'data/catalog.json').read_text(encoding='utf-8'))
main=(ROOT/'js/main.js').read_text(encoding='utf-8')
index=(ROOT/'index.html').read_text(encoding='utf-8')

check('catalog schema v4',cat.get('schemaVersion')==4)
pizzas=[p for p in cat.get('products',[]) if p.get('type')=='pizza']
check('pizza catalog present',len(pizzas)>0)
for p in pizzas:
    variants=p.get('variants') or []
    ids=[v.get('id') for v in variants]
    check(f"{p.get('id')} has canonical variants",ids==['media','grande','familia'])
    check(f"{p.get('id')} prices monotonic",len(variants)==3 and variants[0].get('price',0)<=variants[1].get('price',0)<=variants[2].get('price',0))
    check(f"{p.get('id')} variant metadata",all(v.get('diameterCm') and isinstance(v.get('serves'),dict) and isinstance(v.get('available'),bool) for v in variants))

check('variant runtime module',(ROOT/'js/variant-commerce-v4-1.js').exists())
check('main consumes variant engine','FORNO_VARIANTS' in main and 'priceFor' in main and 'commonFor' in main)
check('bag schema v4','-bag-v4' in main and 'LEGACY_BAG_V3_KEY' in main)
check('native size select retained','id="size-select"' in index and '<select' in index)
check('size help associated','aria-describedby="size-help"' in index and 'id="size-help"' in index)
check('release docs',(ROOT/'docs/RELEASE-4.1.0.md').exists() and (ROOT/'docs/VARIANT-COMMERCE-4.1.0.md').exists())

if errors:
    raise SystemExit(f"VARIANT COMMERCE CAPABILITY GATE: FAIL ({len(errors)} failures)")
print(f"VARIANT COMMERCE CAPABILITY GATE: PASS — {len(pizzas)} pizzas with explicit variants")
