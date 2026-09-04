#!/usr/bin/env python3
from pathlib import Path
import json,re,sys
ROOT=Path(__file__).resolve().parents[1]
errors=[]; passed=[]
def check(name, cond, detail=''):
    (passed if cond else errors).append((name,detail))
meta=(ROOT/'js/app-meta.js').read_text(encoding='utf-8')
checkout=(ROOT/'js/checkout.js').read_text(encoding='utf-8')
main=(ROOT/'js/main.js').read_text(encoding='utf-8')
changelog=(ROOT/'CHANGELOG.md').read_text(encoding='utf-8')
brand=json.loads((ROOT/'data/brand/brand.json').read_text(encoding='utf-8'))
catalog=json.loads((ROOT/'data/catalog.json').read_text(encoding='utf-8'))
VERSION=json.loads((ROOT/'package.json').read_text(encoding='utf-8'))['version']; check(f'Current version {VERSION}',f'version: "{VERSION}"' in meta)
for patch in range(10): check(f'Changelog 3.0.{patch}',f'## 3.0.{patch} ' in changelog)
for slug in ['menu','order','about','experience','location','help','privacy']:
    check(f'Page {slug}',(ROOT/slug/'index.html').exists())
check('all catalog product pages',all((ROOT/'products'/p['id']/'index.html').exists() for p in catalog['products']),str(len(catalog['products'])))
check('Canonical catalog JSON',(ROOT/'data/catalog.json').exists())
check('Static build tool',(ROOT/'tools/build-site.py').exists())
check('Shared runtime fragments',(ROOT/'templates/runtime-fragments.html').exists())
check('Shared cross-page state','storageNamespace' in main and 'BAG_KEY' in main)
check('Nested asset resolver','siteRoot' in meta and 'assetUrl' in main)
check('Nested PWA registration','FORNO_META?.resolve?.("service-worker.js")' in main)
check('Product URLs', 'products/${product.id}/' in main)
check('Pickup restored-state fix','restoreSavedData();updateConditionalFields();showStep("delivery")' in checkout)
check('Pickup disables delivery controls','control.disabled = hidden' in checkout)
check('Pickup invalidates postal lookup','if (fulfillment === "pickup") { ++lookupToken;' in checkout)
check('Sauce catalog',len(brand.get('commerce',{}).get('orderExtras',{}).get('sauces',[]))>=2)
check('Sauce review','block("Molhos", sauceNames)' in checkout)
check('Sauce WhatsApp payload','"MOLHOS"' in checkout)
check('Repository naming gate',(ROOT/'tools/repository-naming-check.py').exists())
check('ADR static-first',(ROOT/'docs/decisions/001-static-first-multi-page.md').exists())
check('Case study architecture',(ROOT/'docs/case-study/architecture.md').exists())
check('Sitemap product URLs', all(f'products/{p["id"]}/' in (ROOT/'sitemap.xml').read_text(encoding='utf-8') for p in catalog['products']))
if errors:
    print('WEBSITE ARCHITECTURE CHECK FAILED')
    for name,detail in errors: print('FAIL ',name,detail)
    sys.exit(1)
for name,detail in passed: print('PASS ',name,detail)
print(f'{len(passed)}/{len(passed)} website-architecture checks passed')
