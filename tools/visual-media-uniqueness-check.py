#!/usr/bin/env python3
from pathlib import Path
import hashlib, json
ROOT=Path(__file__).resolve().parents[1]
products=json.loads((ROOT/'data/catalog.json').read_text(encoding='utf-8'))['products']
pizzas=[p for p in products if p.get('type')=='pizza']
errors=[]; seen={}
for p in pizzas:
    path=ROOT/p['image']
    if not path.exists():
        errors.append(f"{p['id']}: source ausente {p['image']}")
        continue
    h=hashlib.sha256(path.read_bytes()).hexdigest()
    seen.setdefault(h,[]).append(p['id'])
    for width in (384,480,800,1200):
        variant=path.with_suffix('').with_name(path.stem+f'-{width}').with_suffix('.webp')
        if not variant.exists(): errors.append(f"{p['id']}: variante {width} WebP ausente")
    social=path.with_suffix('').with_name(path.stem+'-social').with_suffix('.webp')
    if not social.exists(): errors.append(f"{p['id']}: social WebP ausente")
for ids in seen.values():
    if len(ids)>1: errors.append('imagem-base duplicada: '+', '.join(ids))
if len(seen)!=len(pizzas): errors.append(f'unicidade incompleta: {len(seen)}/{len(pizzas)}')
if errors:
    print('VISUAL MEDIA UNIQUENESS: FAIL')
    for e in errors: print('-',e)
    raise SystemExit(1)
print(f'VISUAL MEDIA UNIQUENESS: PASS — {len(pizzas)} pizzas, {len(seen)} imagens-base únicas')
