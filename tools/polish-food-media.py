#!/usr/bin/env python3
from __future__ import annotations
from pathlib import Path
from PIL import Image, ImageEnhance, ImageFilter
import hashlib, json
ROOT=Path(__file__).resolve().parents[1]
CATALOG=json.loads((ROOT/'data/catalog.json').read_text(encoding='utf-8'))
STATE_PATH=ROOT/'data/media-polish.json'
state=json.loads(STATE_PATH.read_text(encoding='utf-8')) if STATE_PATH.exists() else {'schemaVersion':1,'files':{}}

def digest(path:Path)->str:
    return hashlib.sha256(path.read_bytes()).hexdigest()

def polish(path:Path)->None:
    image=Image.open(path).convert('RGB')
    # Conservative food-photography polish: lift local presence without clipping highlights.
    image=ImageEnhance.Contrast(image).enhance(1.07)
    image=ImageEnhance.Color(image).enhance(1.09)
    image=ImageEnhance.Brightness(image).enhance(1.015)
    image=image.filter(ImageFilter.UnsharpMask(radius=1.35, percent=115, threshold=3))
    image.save(path,'WEBP',quality=91,method=6)

changed=0; current=0
for product in CATALOG.get('products',[]):
    if product.get('type')!='pizza':
        continue
    path=ROOT/product['image']
    if not path.exists() or path.suffix.lower()!='.webp':
        continue
    key=path.relative_to(ROOT).as_posix(); before=digest(path)
    if state['files'].get(key,{}).get('polishedSha256')==before:
        current+=1; continue
    polish(path); after=digest(path)
    state['files'][key]={'polishedSha256':after,'profile':'food-premium-v1'}
    changed+=1
STATE_PATH.write_text(json.dumps(state,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(f'FOOD MEDIA POLISH PASSED — {changed} polished, {current} already current')
