#!/usr/bin/env python3
from pathlib import Path
import json,re,sys
ROOT=Path(__file__).resolve().parents[1]
checks=[]
def check(name, cond, detail=''):
    checks.append((name,bool(cond),detail))

def text(path): return (ROOT/path).read_text(encoding='utf-8')

pkg=json.loads(text('package.json'))
config=text('playwright.config.js') if (ROOT/'playwright.config.js').exists() else ''
change=text('CHANGELOG.md')
workflow=text('.github/workflows/browser-certification.yml') if (ROOT/'.github/workflows/browser-certification.yml').exists() else ''
mobile=text('tests/e2e/mobile-usability.spec.js') if (ROOT/'tests/e2e/mobile-usability.spec.js').exists() else ''
checkout=text('tests/e2e/checkout.spec.js') if (ROOT/'tests/e2e/checkout.spec.js').exists() else ''
a11y=text('tests/accessibility/axe.spec.js') if (ROOT/'tests/accessibility/axe.spec.js').exists() else ''
admin=text('tests/e2e/admin.spec.js') if (ROOT/'tests/e2e/admin.spec.js').exists() else ''
routes=text('tests/e2e/routes.spec.js') if (ROOT/'tests/e2e/routes.spec.js').exists() else ''
helpers=text('tests/fixtures/helpers.js') if (ROOT/'tests/fixtures/helpers.js').exists() else ''
offline=text('tests/e2e/offline.spec.js') if (ROOT/'tests/e2e/offline.spec.js').exists() else ''
fragments=text('templates/runtime-fragments.html')
css=text('css/styles.css')

check(f"current version {pkg.get('version')}", bool(__import__('re').fullmatch(r'\d+\.\d+\.\d+', str(pkg.get('version','')))))
for patch in range(10): check(f'changelog 3.7.{patch}', re.search(rf'^## 3\.7\.{patch}\b',change,re.M) is not None)
check('Playwright configuration exists', bool(config))
for token in ['chromium-phone-320','chromium-phone-390','chromium-phone-430','chromium-tablet','chromium-landscape','chromium-desktop']:
    check(f'viewport project {token}', token in config)
check('browser script', pkg.get('scripts',{}).get('test:browser')=='playwright test')
check('axe script', 'tests/accessibility' in pkg.get('scripts',{}).get('test:a11y',''))
check('static browser gate in quality', 'browser-certification-check.py' in pkg.get('scripts',{}).get('quality',''))
check('GitHub browser workflow', 'playwright install --with-deps chromium' in workflow and 'npm run test:browser' in workflow)
check('GitHub evidence artifact', 'upload-artifact' in workflow and 'artifacts/test-evidence' in workflow)
check('route E2E', '/products/calabresa/' in routes and 'expectNoHorizontalOverflow' in routes)
check('mobile primary path E2E', 'Pedir agora' in mobile and '#menu-search' in mobile)
check('mobile horizontal overflow E2E', 'expectNoHorizontalOverflow' in mobile)
check('visually clipped accessible content excluded from overflow false positives', 'isInsideVisuallyClippedAccessibleRegion' in helpers)
check('mobile practical tap targets E2E', 'tooSmall' in mobile and '< 40' in mobile)
check('pickup regression E2E', 'fulfillment-pickup' in checkout and 'data-delivery-fields' in checkout and 'toBeDisabled' in checkout)
check('cash validation E2E', 'checkout-change-for-error' in checkout)
check('admin E2E', '#admin-mode' in admin and 'admin-undo' in admin)
check('axe serious/critical gate', '@axe-core/playwright' in a11y and "['serious','critical']" in a11y)
check('dialog keyboard accessibility E2E', "keyboard.press('Escape')" in a11y)
check('offline boundary E2E', 'service-worker.js' in offline and 'offline.html' in offline)
check('stable fulfillment test hooks', 'data-test="fulfillment-pickup"' in fragments and 'data-test="fulfillment-delivery"' in fragments)
check('mobile fixed navigation reserves content space', 'body:not(.has-mobile-bag){padding-bottom:' in css and 'body.has-mobile-bag{padding-bottom:' in css)
check('minimum core tap token', '--tap-target' in css and 'min-height:var(--tap-target)' in css)
check('browser testing docs', (ROOT/'docs/testing/BROWSER-TESTING.md').exists())
check('release evidence manifest', (ROOT/'docs/releases/evidence/v3.7.9/summary.md').exists())
check('mobile usability gate', (ROOT/'tools/mobile-usability-check.py').exists() and 'mobile-usability-check.py' in pkg.get('scripts',{}).get('quality',''))
nested_samples=['menu/index.html','products/calabresa/index.html','articles/wood-fired-pizza-flavor/index.html','categories/ingredients/index.html']
check('nested runtime fragment assets resolve by route depth', all('src="assets/images/rosa-avatar.jpg"' not in text(path) for path in nested_samples))

failed=[c for c in checks if not c[1]]
for name,ok,detail in checks:
    print(('PASS' if ok else 'FAIL').ljust(5), name + (f' — {detail}' if detail else ''))
print(f'{len(checks)-len(failed)}/{len(checks)} browser-certification checks passed')
if failed: sys.exit(1)
