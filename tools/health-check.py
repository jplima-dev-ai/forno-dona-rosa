#!/usr/bin/env python3
from pathlib import Path
import re, subprocess, sys

ROOT=Path(__file__).resolve().parents[1]
VERSION='1.8.9'
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
    'assets/images/nutella-strawberry-pizza.jpg','assets/images/signature-pizza.svg']))
for patch in range(10): check(f'Changelog 1.8.{patch}', f'[1.8.{patch}]' in changelog)
check('Cumulative Bag sanitation', 'function sanitizeBag' in main and 'MAX_BAG_QTY - totalQty' in main)
check('Half-and-half type integrity', 'candidate2?.type === "pizza"' in main)
check('Bag focus recovery', 'restoreCartActionFocus' in main)
check('Rosa mutation verification', 'const added = window.FORNO_APP.addProduct' in rosa)
check('Versioned cache lookup', 'async function matchVersioned' in sw and 'Promise.allSettled(WARM_ASSETS' in sw)
check('WebP food assets', all((ROOT/p).exists() for p in [
    'assets/images/dona-rosa-hero-pizza.webp','assets/images/cheese-pull-pizza.webp',
    'assets/images/wood-fired-oven-pizza.webp','assets/images/nutella-strawberry-pizza.webp']))
for f in ['js/app-meta.js','js/app-config.js','data/menu.js','data/rosa-knowledge-base.js','js/main.js','js/rosa.js','service-worker.js']:
    r=subprocess.run(['node','--check',str(ROOT/f)],capture_output=True,text=True)
    check(f'JS syntax {f}',r.returncode==0,r.stderr.strip())

passed=sum(1 for _,ok,_ in checks if ok)
print(f'Forno Dona Rosa — Quality Refinement Health Check v{VERSION}')
for name,ok,detail in checks:
    print(f'{name:.<38} {"PASS" if ok else "FAIL"}' + (f' ({detail})' if detail else ''))
print(f'\n{passed}/{len(checks)} checks passed')
if passed != len(checks): sys.exit(1)
