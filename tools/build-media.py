#!/usr/bin/env python3
from __future__ import annotations
from pathlib import Path
from PIL import Image, ImageOps
import argparse, json

ROOT=Path(__file__).resolve().parents[1]
CATALOG=json.loads((ROOT/'data/catalog.json').read_text(encoding='utf-8'))['products']
WIDTHS=(480,800,1200)

def outputs_for(path:Path):
    stem=path.with_suffix('')
    outputs=[]
    for width in WIDTHS:
        outputs.append(stem.with_name(stem.name+f'-{width}').with_suffix('.webp'))
        outputs.append(stem.with_name(stem.name+f'-{width}').with_suffix('.avif'))
    outputs.append(stem.with_name(stem.name+'-social').with_suffix('.webp'))
    return outputs

def needs_build(path:Path, force:bool=False):
    if force: return True
    outputs=outputs_for(path)
    if any(not output.exists() for output in outputs): return True
    source_time=path.stat().st_mtime
    return any(output.stat().st_mtime < source_time for output in outputs)

def save_variants(path:Path, focal=(0.5,0.5)):
    with Image.open(path) as source:
        image=source.convert('RGB')
        for width in WIDTHS:
            ratio=min(1.0, width/image.width)
            size=(max(1,round(image.width*ratio)),max(1,round(image.height*ratio)))
            resized=image.resize(size,Image.Resampling.LANCZOS) if size!=image.size else image.copy()
            stem=path.with_suffix('')
            resized.save(stem.with_name(stem.name+f'-{width}').with_suffix('.webp'),'WEBP',quality=80,method=6)
            resized.save(stem.with_name(stem.name+f'-{width}').with_suffix('.avif'),'AVIF',quality=52)
        social=ImageOps.fit(image,(1200,630),method=Image.Resampling.LANCZOS,centering=focal)
        social.save(path.with_suffix('').with_name(path.stem+'-social').with_suffix('.webp'),'WEBP',quality=82,method=6)

def main():
    parser=argparse.ArgumentParser(description='Build responsive food-media derivatives incrementally.')
    parser.add_argument('--force',action='store_true',help='Regenerate all media derivatives even when current.')
    args=parser.parse_args()
    built=0; skipped=0
    for product in CATALOG:
        path=ROOT/product['image']
        if not path.exists(): raise SystemExit(f'Missing media source: {product["image"]}')
        focal_data=product.get('media',{}).get('focalPoint',{})
        try:
            focal=(max(0,min(100,float(focal_data.get('x',50))))/100,max(0,min(100,float(focal_data.get('y',50))))/100)
        except (TypeError,ValueError): focal=(0.5,0.5)
        if needs_build(path,args.force): save_variants(path,focal); built+=1
        else: skipped+=1
    print(f'MEDIA BUILD PASSED ({built} rebuilt, {skipped} current; {len(CATALOG)} products checked)')

if __name__=='__main__': main()
