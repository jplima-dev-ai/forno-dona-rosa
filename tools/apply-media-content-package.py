#!/usr/bin/env python3
from __future__ import annotations
import base64, json, shutil, subprocess, sys, tempfile, re
from io import BytesIO
from pathlib import Path
from datetime import datetime
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
MAX_PACKAGE=25_000_000
MAX_MEDIA=32
MAX_IMAGE=8_000_000
TARGETS=[ROOT/'data/brand/brand.json',ROOT/'data/brand/content.json',ROOT/'data/catalog.json',ROOT/'data/reviews.json',ROOT/'data/articles.json',ROOT/'data/newsletter.json']
def fail(msg): print(f'MEDIA CONTENT APPLY FAILED: {msg}',file=sys.stderr); raise SystemExit(1)
def run(*cmd):
    result=subprocess.run(cmd,cwd=ROOT,capture_output=True,text=True,encoding='utf-8',errors='replace')
    if result.returncode: fail((result.stdout+'\n'+result.stderr).strip())
def main():
    if len(sys.argv)!=2: fail('usage: python tools/apply-media-content-package.py <package.json>')
    source=Path(sys.argv[1]).resolve()
    if not source.exists() or source.suffix.lower()!='.json': fail('package must be an existing JSON file')
    if source.stat().st_size>MAX_PACKAGE: fail('package exceeds 25 MB')
    try: pack=json.loads(source.read_text(encoding='utf-8'))
    except Exception as exc: fail(f'invalid JSON: {exc}')
    if pack.get('format')!='forno-media-content-package' or pack.get('formatVersion')!=1: fail('unsupported package format')
    media=pack.get('media',[])
    if not isinstance(media,list) or len(media)>MAX_MEDIA: fail('media list is invalid or too large')
    config=pack.get('configBundle')
    if not isinstance(config,dict): fail('configBundle is required')
    catalog=config.get('payload',{}).get('catalog',{})
    products={p.get('id'):p for p in catalog.get('products',[]) if isinstance(p,dict)}
    decoded=[]
    for item in media:
        if not isinstance(item,dict): fail('invalid media entry')
        pid=str(item.get('productId',''))
        if pid not in products: fail(f'unknown product id: {pid}')
        try: raw=base64.b64decode(item.get('dataBase64',''),validate=True)
        except Exception: fail(f'invalid base64 for {pid}')
        if not raw or len(raw)>MAX_IMAGE: fail(f'image for {pid} exceeds 8 MB')
        try:
            im=Image.open(BytesIO(raw)); im.verify()
            im=Image.open(BytesIO(raw)).convert('RGB')
        except Exception as exc: fail(f'cannot decode image for {pid}: {exc}')
        if im.width<640 or im.height<480 or im.width>8000 or im.height>8000: fail(f'image dimensions for {pid} are outside safe range')
        point=item.get('focalPoint',{})
        try: x=max(0,min(100,float(point.get('x',50)))); y=max(0,min(100,float(point.get('y',50))))
        except Exception: fail(f'invalid focal point for {pid}')
        products[pid].setdefault('media',{})['focalPoint']={'x':round(x,2),'y':round(y,2)}
        target=ROOT/products[pid]['image']
        if target.suffix.lower()!='.webp' or 'assets/images/products/' not in target.as_posix(): fail(f'unsafe canonical image path for {pid}')
        decoded.append((pid,im,target))
    stamp=datetime.now().strftime('%Y%m%d-%H%M%S-%f'); backup=ROOT/'backups'/f'media-content-{stamp}'; backup.mkdir(parents=True,exist_ok=False)
    for path in TARGETS:
        if path.exists(): shutil.copy2(path,backup/path.name)
    for _,_,target in decoded:
        if target.exists(): shutil.copy2(target,backup/target.name)
    temp_bundle=backup/'admin-bundle.json'; temp_bundle.write_text(json.dumps(config,ensure_ascii=False,indent=2),encoding='utf-8')
    try:
        run(sys.executable,'tools/apply-admin-bundle.py',str(temp_bundle))
        # apply-admin-bundle wrote its catalog; replace with package catalog including focal points
        (ROOT/'data/catalog.json').write_text(json.dumps(catalog,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
        for pid,image,target in decoded:
            target.parent.mkdir(parents=True,exist_ok=True); image.save(target,'WEBP',quality=90,method=6)
        run(sys.executable,'tools/polish-food-media.py')
        run(sys.executable,'tools/build-media.py')
        run(sys.executable,'tools/build-site.py')
        run(sys.executable,'tools/config-check.py')
    except BaseException:
        for path in TARGETS:
            saved=backup/path.name
            if saved.exists(): shutil.copy2(saved,path)
        for _,_,target in decoded:
            saved=backup/target.name
            if saved.exists(): shutil.copy2(saved,target)
        raise
    print('MEDIA CONTENT PACKAGE APPLIED')
    print(f'Media updated: {len(decoded)}')
    print(f'Backup: {backup.relative_to(ROOT)}')
    print('Next: npm.cmd run quality')
if __name__=='__main__': main()
