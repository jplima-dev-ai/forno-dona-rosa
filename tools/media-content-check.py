#!/usr/bin/env python3
from pathlib import Path
import json,re
ROOT=Path(__file__).resolve().parents[1]
checks=[]
def check(name,cond): checks.append((name,bool(cond))); print(('PASS' if cond else 'FAIL'),name)
pkg=json.loads((ROOT/'package.json').read_text(encoding='utf-8'))
admin=(ROOT/'admin/index.html').read_text(encoding='utf-8')
js=(ROOT/'js/admin-media-content.js').read_text(encoding='utf-8')
core=(ROOT/'js/admin-core.js').read_text(encoding='utf-8')
media=(ROOT/'tools/build-media.py').read_text(encoding='utf-8')
apply=(ROOT/'tools/apply-media-content-package.py').read_text(encoding='utf-8')
store=(ROOT/'js/storefront.js').read_text(encoding='utf-8')
cat=json.loads((ROOT/'data/catalog.json').read_text(encoding='utf-8'))
checks_to_run=[
('current package version',bool(re.fullmatch(r'\d+\.\d+\.\d+',pkg.get('version','')))),('media admin section','id="media"' in admin),('reviews admin section','id="reviews"' in admin),('seo admin section','id="seo"' in admin),('safe image input','accept="image/jpeg,image/png,image/webp"' in admin),('accessible focal sliders','id="media-focal-x"' in admin and 'id="media-focal-y"' in admin),('keyboard focal buttons','data-focal-dx' in admin and 'data-focal-reset' in admin),('media package exporter','forno-media-content-package' in js),('10 MB source limit','MAX_SOURCE_BYTES = 10_000_000' in js),('25 MB package limit','MAX_PACKAGE_BYTES = 25_000_000' in js),('reviews authorization gate','review.active !== false && review.authorized !== true' in core),('review runtime integrity','review.authorized === true' in store),('responsive focal media','focalPoint' in media and 'centering=focal' in media),('safe package apply','MAX_PACKAGE=25_000_000' in apply and 'base64.b64decode' in apply),('safe canonical media path','assets/images/products/' in apply),('rollback backup','backups' in apply and 'shutil.copy2' in apply),('all products focal metadata',all(isinstance(p.get('media',{}).get('focalPoint'),dict) for p in cat['products'])),('content site sections',all(k in json.loads((ROOT/'data/brand/content.json').read_text(encoding='utf-8')).get('site',{}) for k in ['about','experience','location','help'])),('quality integration','media-content-check.py' in pkg['scripts']['quality']),('behavior integration','media-content-behavior-check.js' in pkg['scripts']['quality'])]
for n,c in checks_to_run: check(n,c)
for v in range(10): check(f'changelog 3.8.{v}',f'3.8.{v}' in (ROOT/'CHANGELOG.md').read_text(encoding='utf-8'))
failed=[n for n,c in checks if not c]
print(f'{len(checks)-len(failed)}/{len(checks)} media-content checks passed')
raise SystemExit(1 if failed else 0)
