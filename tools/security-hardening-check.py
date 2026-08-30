#!/usr/bin/env python3
from pathlib import Path
import json,re
ROOT=Path(__file__).resolve().parents[1]
checks=[]
def check(name,cond):
    checks.append((name,bool(cond))); print(('PASS  ' if cond else 'FAIL  ')+name)
pkg=json.loads((ROOT/'package.json').read_text(encoding='utf-8'))
sw=(ROOT/'service-worker.js').read_text(encoding='utf-8')
admin=(ROOT/'js/admin.js').read_text(encoding='utf-8')
persist=(ROOT/'js/admin-persistence.js').read_text(encoding='utf-8')
core=(ROOT/'js/admin-core.js').read_text(encoding='utf-8')
apply=(ROOT/'tools/apply-admin-bundle.py').read_text(encoding='utf-8')
build=(ROOT/'tools/build-site.py').read_text(encoding='utf-8')
brand=json.loads((ROOT/'data/brand/brand.json').read_text(encoding='utf-8'))
html=(ROOT/'admin/index.html').read_text(encoding='utf-8')
check(f"version {pkg.get('version')}", bool(__import__('re').fullmatch(r'\d+\.\d+\.\d+', pkg.get('version',''))))
for i in range(10): check(f'changelog 3.6.{i}', f'## 3.6.{i} ' in (ROOT/'CHANGELOG.md').read_text(encoding='utf-8'))
check('admin excluded from service worker core cache','"./admin/"' not in sw and '"./js/admin.js"' not in sw and 'isSensitiveToolingPath' in sw)
check('dev excluded from service worker interception','/(?:^|\\/)dev' in sw)
check('admin import file size bound','MAX_IMPORT_BYTES = 2_000_000' in admin and 'file.size > MAX_IMPORT_BYTES' in admin)
check('admin import requires json extension','/\\.json$/i.test' in admin)
check('local draft parse recovery','JSON.parse' in persist and 'storage.removeItem(key)' in persist and 'MAX_DRAFT_BYTES' in persist)
check('local draft quota failure returns false','catch { return false; }' in persist)
check('admin asset path allowlist','assets|data' in admin and 'value.includes("..")' in admin)
check('credit external URL requires HTTPS','safeHttpsUrl' in core and 'credits?.url' in core)
check('bundle cli size limit','MAX_BUNDLE_BYTES = 2_000_000' in apply and 'path.stat().st_size' in apply)
check('bundle cli product cap','MAX_PRODUCTS = 250' in apply)
check('bundle cli rejects boolean price','isinstance(price, bool)' in apply)
check('bundle cli credit URL HTTPS validation','credits.url must use HTTPS' in apply)
check('unique backup stamp uses microseconds','%f' in apply)
check('admin CSP blocks objects','object-src \'none\'' in html)
check('admin form action self','form-action \'self\'' in html)
check('creator credit updated',brand.get('credits',{}).get('label')=='Desenvolvido por' and brand.get('credits',{}).get('name')=='KJ Productions')
check('build escapes credit text','escape(CREDIT_LABEL)' in build and 'escape(CREDIT_NAME)' in build)
failed=[n for n,ok in checks if not ok]
print(f'{len(checks)-len(failed)}/{len(checks)} security-hardening checks passed')
raise SystemExit(1 if failed else 0)
