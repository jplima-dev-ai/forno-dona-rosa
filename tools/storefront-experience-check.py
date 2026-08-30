#!/usr/bin/env python3
from pathlib import Path
import json,re
ROOT=Path(__file__).resolve().parents[1]
checks=[]
def check(name, cond):
    checks.append((name,bool(cond)))

def read(path): return (ROOT/path).read_text(encoding='utf-8')
brand=json.loads(read('data/brand/brand.json')); catalog=json.loads(read('data/catalog.json'))['products']; reviews=json.loads(read('data/reviews.json'))
commerce=brand.get('commerce',{}); build=read('tools/build-site.py'); home=read('index.html'); css=read('css/site-pages.css'); main=read('js/main.js'); pkg=json.loads(read('package.json')); sw=read('service-worker.js'); status=read('js/business-status.js'); storefront=read('js/storefront.js')
VERSION=pkg.get('version'); check(f'version {VERSION}', bool(re.fullmatch(r'\d+\.\d+\.\d+', VERSION or '')))
for i in range(10): check(f'changelog 3.3.{i}', f'## 3.3.{i} ' in read('CHANGELOG.md'))
check('business status module', 'FORNO_BUSINESS_STATUS' in status and 'America/Sao_Paulo' in status)
check('special hours supported', 'specialHours' in status)
check('status bar accessible live region', 'aria-live' in status and 'role", "status' in status)
check('featured merchandising configured', len(commerce.get('merchandising',{}).get('featuredProductIds',[]))==3)
check('no fake seasonal product configured', commerce.get('merchandising',{}).get('seasonalProductIds')==[])
check('reviews infrastructure starts empty', reviews.get('reviews')==[])
check('reviews hidden when empty', 'root.hidden = true' in storefront)
check('menu unavailable recovery', 'alternativeProducts' in main and 'menu-card__alternatives' in main)
check('product unavailable schema contract', 'https://schema.org/OutOfStock' in build)
check('product alternatives surface', 'product-alternatives' in build)
check('product reasons surface', 'product-reasons' in build)
check('responsive AVIF media', '-480.avif' in build and '-1200.avif' in build)
check('responsive WebP media', '-480.webp' in build and '-1200.webp' in build)
check('social media variant', '-social.webp' in build)
check('media build tool', (ROOT/'tools/build-media.py').exists())
check('all products have 480 AVIF', all((ROOT/p['image'].replace('.webp','-480.avif')).exists() for p in catalog))
check('all products have social image', all((ROOT/p['image'].replace('.webp','-social.webp')).exists() for p in catalog))
check('mobile storefront scroller', 'scroll-snap-type:x mandatory' in css and 'grid-auto-columns' in css)
check('forced colors storefront', '@media(forced-colors:active)' in css and '.storefront-featured-card' in css)
check('reduced motion storefront', '@media(prefers-reduced-motion:reduce)' in css)
check('data-test purchase contract', 'data-test' in main and 'add-product' in main)
check('dev ui preview', (ROOT/'dev/ui-preview.html').exists())
check('design system docs', (ROOT/'docs/design-system/foundations.md').exists() and (ROOT/'docs/design-system/commerce-patterns.md').exists())
check('storefront check in quality', 'storefront-experience-check.py' in pkg['scripts']['quality'])
check('business behavior check in quality', 'business-status-behavior-check.js' in pkg['scripts']['quality'])
check('service worker storefront modules', 'js/business-status.js' in sw and 'js/storefront.js' in sw and 'data/reviews.json' in sw)
check('service worker version', f'const VERSION = "{VERSION}"' in sw)
for name,ok in checks: print(('PASS' if ok else 'FAIL'), name)
failed=[name for name,ok in checks if not ok]
print(f'{len(checks)-len(failed)}/{len(checks)} storefront-experience checks passed')
raise SystemExit(1 if failed else 0)
