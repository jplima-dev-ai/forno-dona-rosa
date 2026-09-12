#!/usr/bin/env python3
from pathlib import Path
import json

ROOT=Path(__file__).resolve().parents[1]
pkg=json.loads((ROOT/'package.json').read_text())
files=['js/pizza-configurator-v4-1-1.js','docs/PIZZA-CONFIGURATOR-4.1.1.md','docs/RELEASE-4.1.1.md','tools/pizza-configurator-v4-1-1-check.py','tools/pizza-configurator-v4-1-1-behavior-check.js','tests/e2e/pizza-configurator.spec.js']
version=str(pkg.get('version',''))
checks={
    'current version semantic':len(version.split('.'))==3 and all(part.isdigit() for part in version.split('.')),
    'all release files':all((ROOT/f).exists() for f in files),
    'quality gate wired':'pizza-configurator-v4-1-1-check.py' in pkg['scripts']['quality'],
    'e2e script':'test:pizza-configurator' in pkg['scripts'],
}
for k,v in checks.items():
    print(('PASS  ' if v else 'FAIL  ')+k)
if not all(checks.values()):
    raise SystemExit('RELEASE 4.1.1 LINEAGE GATE: FAIL')
print('RELEASE 4.1.1 LINEAGE GATE: PASS')
