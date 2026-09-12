from pathlib import Path
import json,re,sys

root=Path(__file__).resolve().parents[1]
checks=[]
def check(name, condition):
    checks.append((name,bool(condition)))

pkg=json.loads((root/'package.json').read_text(encoding='utf-8'))
contract=json.loads((root/'data/accessibility-ordering-contract-v4-1-8.json').read_text(encoding='utf-8'))
css=(root/'css/accessibility-fortress-v4-1-8.css').read_text(encoding='utf-8')
index=(root/'index.html').read_text(encoding='utf-8')
bundle=(root/'css/home-bundle.css').read_text(encoding='utf-8') if (root/'css/home-bundle.css').exists() else ''
admin=(root/'admin/index.html').read_text(encoding='utf-8')
sw=(root/'service-worker.js').read_text(encoding='utf-8')
version=str(pkg.get('version',''))

check('current version semantic', bool(re.fullmatch(r'\d+\.\d+\.\d+',version)))
check('contract version', contract.get('version')=='4.1.8')
check('eight critical ordering flows', len(contract.get('criticalFlows',[]))==8)
check('reader statuses are honest', all(x.get('reader')=='MANUAL_REQUIRED' for x in contract['criticalFlows']))
check('320 viewport covered', any(v.get('width')==320 for v in contract.get('testViewports',[])))
check('desktop viewport covered', any(v.get('width',0)>=1366 for v in contract.get('testViewports',[])))
check('reduced motion contract', '@media (prefers-reduced-motion:reduce)' in css)
check('forced colors contract', '@media (forced-colors:active)' in css)
check('landscape low-height contract', 'max-height:32rem' in css and 'orientation:landscape' in css)
check('focus-visible contract', ':focus-visible' in css)
check('dialog dvh containment', '100dvh' in css)
check('fortress css wired home', 'css/accessibility-fortress-v4-1-8.css' in index or 'source: css/accessibility-fortress-v4-1-8.css' in bundle)
check('fortress css wired admin', '../css/accessibility-fortress-v4-1-8.css' in admin)
check('fortress css offline shell', 'accessibility-fortress-v4-1-8.css' in sw)
check('E2E fortress spec exists', (root/'tests/e2e/accessibility-fortress-v4-1-8.spec.js').exists())
for name,ok in checks:
    print(('PASS  ' if ok else 'FAIL  ')+name)
failed=[n for n,o in checks if not o]
print(f"{len(checks)-len(failed)}/{len(checks)} accessibility-fortress checks passed")
if failed:
    sys.exit(1)
