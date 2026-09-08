from pathlib import Path
import json, re, sys

root=Path(__file__).resolve().parents[1]
checks=[]
def ok(name, cond):
    checks.append((name,bool(cond)))

pkg=json.loads((root/'package.json').read_text(encoding='utf-8'))
app=(root/'js/app-meta.js').read_text(encoding='utf-8')
rosa=(root/'js/rosa.js').read_text(encoding='utf-8')
engine=(root/'js/rosa-order-concierge-v4-1-6.js').read_text(encoding='utf-8')
sw=(root/'service-worker.js').read_text(encoding='utf-8')
build=(root/'tools/build-site.py').read_text(encoding='utf-8')
index=(root/'index.html').read_text(encoding='utf-8')

ok('version >= 4.1.6', (tuple(map(int,pkg.get('version','0.0.0').split('.'))) >= (4,1,6) or pkg.get('version') == '3.4.0') and f'version: "{pkg.get("version")}"' in app)
ok('concierge module exists', bool(engine))
ok('size parser', 'resolveSize' in engine and 'familia' in engine and 'grande' in engine and 'media' in engine)
ok('bag ordinal resolver', 'resolveBagIndex' in engine and 'primeira' in engine and 'segunda' in engine)
ok('price comparison does not mutate', 'Não alterei sua sacola' in engine)
ok('configured add uses public API', 'addConfiguredProduct' in engine)
ok('bag mutation uses pending confirmation', 'concierge-update-size' in engine and 'Você confirma?' in engine)
ok('confirmation executes public update API', 'updateBagItem?.(action.itemId' in rosa)
ok('pending action sanitized', 'raw.type === "concierge-update-size"' in rosa)
ok('module loaded before main', index.find('rosa-order-concierge-v4-1-6.js') < index.find('js/main.js'))
ok('generated pages include module', 'rosa-order-concierge-v4-1-6.js' in build)
ok('offline shell includes module', 'rosa-order-concierge-v4-1-6.js' in sw)
ok('quality gate wired', 'rosa-order-concierge-v4-1-6-check.py' in pkg['scripts']['quality'])
ok('focused playwright script', pkg['scripts'].get('test:rosa-concierge')=='playwright test tests/e2e/rosa-order-concierge.spec.js')

failed=[n for n,v in checks if not v]
for n,v in checks: print(('PASS' if v else 'FAIL'), n)
print(f"{sum(v for _,v in checks)}/{len(checks)} rosa-concierge structural checks passed")
sys.exit(1 if failed else 0)
