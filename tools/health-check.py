#!/usr/bin/env python3
from pathlib import Path
import re, subprocess, sys

ROOT=Path(__file__).resolve().parents[1]
VERSION='2.1.9'
checks=[]
def check(name, ok, detail=''):
    checks.append((name,bool(ok),detail))

html=(ROOT/'index.html').read_text(encoding='utf-8')
main=(ROOT/'js/main.js').read_text(encoding='utf-8')
rosa=(ROOT/'js/rosa.js').read_text(encoding='utf-8')
sw=(ROOT/'service-worker.js').read_text(encoding='utf-8')
meta=(ROOT/'js/app-meta.js').read_text(encoding='utf-8')
menu=(ROOT/'data/menu.js').read_text(encoding='utf-8')
changelog=(ROOT/'CHANGELOG.md').read_text(encoding='utf-8')
version_match=re.search(r'version:\s*"([^"]+)"',meta)
version=version_match.group(1) if version_match else None

check('Version source', version==VERSION, version or 'missing')
check('HTML version', f'content="{VERSION}" name="x-project-version"' in html or f'name="x-project-version" content="{VERSION}"' in html)
check('Service worker version', f'const VERSION = "{VERSION}"' in sw)
check('Bag schema v3', 'forno-bag-v3' in main and 'schemaVersion: BAG_SCHEMA_VERSION' in main)
check('Legacy Bag migration', 'forno-bag-v2' in main and 'forno-cart' in main)
check('Rosa session v3', 'forno-rosa-session-v3' in rosa and 'schemaVersion: 3' in rosa)
check('Rosa confidence', 'confidence' in rosa and 'classify' in rosa)
check('Runtime cache limit', 'RUNTIME_LIMIT = 24' in sw and 'trimRuntimeCache' in sw)
ids=re.findall(r'id:"([^"]+)"',menu)
check('Catalog unique IDs', len(ids)==len(set(ids)), f'{len(ids)} items')
check('English README', (ROOT/'README.md').exists())
check('Portuguese README', (ROOT/'README-PT.md').exists())
check('Case study', (ROOT/'docs/CASE-STUDY.md').exists())
check('app-config naming', (ROOT/'js/app-config.js').exists() and not (ROOT/'js/config.js').exists())
check('knowledge-base naming', (ROOT/'data/rosa-knowledge-base.js').exists() and not (ROOT/'data/rosa-knowledge.js').exists())
check('English hero asset', (ROOT/'assets/images/dona-rosa-hero-pizza.jpg').exists())
check('English food assets', all((ROOT/p).exists() for p in [
    'assets/images/cheese-pull-pizza.jpg','assets/images/wood-fired-oven-pizza.jpg',
    'assets/images/nutella-strawberry-pizza.jpg']))
for patch in range(10): check(f'Changelog 1.9.{patch}', f'## 1.9.{patch} ' in changelog)
for patch in range(1,10): check(f'Changelog 2.0.{patch}', f'## 2.0.{patch} ' in changelog)
for patch in range(10): check(f'Changelog 2.1.{patch}', f'## 2.1.{patch} ' in changelog)
check('Cumulative Bag sanitation', 'function sanitizeBag' in main and 'MAX_BAG_QTY - totalQty' in main)
check('Half-and-half type integrity', 'candidate2?.type === "pizza"' in main)
check('Bag focus recovery', 'restoreCartActionFocus' in main)
check('Rosa mutation verification', 'const added = window.FORNO_APP.addProduct' in rosa)
check('Versioned cache lookup', 'async function matchVersioned' in sw and 'Promise.allSettled(WARM_ASSETS' in sw)
check('Mobile bag bar', 'id="mobile-bag-bar"' in html and 'has-mobile-bag' in main)
check('Progressive order extras', '<details class="order-extras">' in html)
check('Simplified card actions', 'data-customize' in main and 'Adicionar média' in main)
check('Responsive bottom-sheet CSS', '.cart-dialog{width:100%;max-width:none;height:min(92dvh,52rem)' in (ROOT/'css/styles.css').read_text(encoding='utf-8'))
check('WebP food assets', all((ROOT/p).exists() for p in [
    'assets/images/dona-rosa-hero-pizza.webp','assets/images/cheese-pull-pizza.webp',
    'assets/images/wood-fired-oven-pizza.webp','assets/images/nutella-strawberry-pizza.webp']))
product_images=list((ROOT/'assets/images/products').glob('*.webp'))
check('31 product images', len(product_images)==31, str(len(product_images)))
check('Every menu item has product image', menu.count('image:"assets/images/products/')==31)
check('Desire discovery', 'data-desire="classica"' in html and 'data-desire="bebida"' in html)
check('Bag thumbnails', 'cart-item__thumb' in main)
check('Obsolete files removed', all(not (ROOT/p).exists() for p in ['assets/images/signature-pizza.svg','assets/images/og-cover.png','tools/generate.py']))
product_names=[p.name for p in (ROOT/'assets/images/products').glob('*.webp')]
pt_tokens=['agua','gas','lata','suco','laranja','mucarela','calabresa','portuguesa','frango','toscana','forno','casa','trufa','picante','vegana','chocolate-belga','banana-doce-leite','romeu-julieta']
check('English product image filenames', all(not any(t in name.lower() for t in pt_tokens) for name in product_names), f'{len(product_names)} files')
check('Hero CTA leads to menu', 'href="#cardapio">Escolher minha pizza</a>' in html)

for f in ['js/app-meta.js','js/app-config.js','data/menu.js','data/rosa-knowledge-base.js','js/main.js','js/rosa.js','service-worker.js']:
    r=subprocess.run(['node','--check',str(ROOT/f)],capture_output=True,text=True)
    check(f'JS syntax {f}',r.returncode==0,r.stderr.strip())

passed=sum(1 for _,ok,_ in checks if ok)
print(f'Forno Dona Rosa — Responsive Checkout Health Check v{VERSION}')
for name,ok,detail in checks:
    print(f'{name:.<38} {"PASS" if ok else "FAIL"}' + (f' ({detail})' if detail else ''))
print(f'\n{passed}/{len(checks)} checks passed')
if passed != len(checks): sys.exit(1)
