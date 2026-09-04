#!/usr/bin/env python3
from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[1]
checks=[]
def c(n,v): checks.append((n,bool(v))); print(('PASS' if v else 'FAIL'),n)
pkg=json.loads((ROOT/'package.json').read_text(encoding='utf-8')); cat=json.loads((ROOT/'data/catalog.json').read_text(encoding='utf-8')); html=(ROOT/'index.html').read_text(encoding='utf-8'); js=(ROOT/'js/smart-menu-v4.js').read_text(encoding='utf-8')
p=next((x for x in cat['products'] if x.get('id')=='nordestina-dona-rosa'),None)
c('version >= 4.0.2',tuple(map(int,pkg.get('version','0.0.0').split('.'))) >= (4,0,2)); c('nordestina exists',p is not None); c('nordestina regional',p and 'regional' in p.get('traits',[])); c('nordestina meat',p and 'carne' in p.get('traits',[])); c('nordestina creamy',p and 'cremosa' in p.get('traits',[])); c('accessible catalog alt',p and len(p.get('media',{}).get('catalog',{}).get('alt',''))>30); c('final nordestina image',p and p.get('image','').endswith('nordestina-dona-rosa-pizza.webp') and (ROOT/p.get('image','')).exists()); c('nordestina responsive media',p and all((ROOT/p['image']).with_suffix('').with_name((ROOT/p['image']).stem+f'-{w}').with_suffix('.webp').exists() for w in (384,480,800,1200)));  c('smart menu api',all(k in js for k in ['recommend','score','explain'])); c('regional desire chip','data-desire="regional"' in html); c('smart menu loaded','js/smart-menu-v4.js' in html)
failed=[n for n,v in checks if not v]; print(f'{len(checks)-len(failed)}/{len(checks)} smart-menu checks passed'); raise SystemExit(1 if failed else 0)
