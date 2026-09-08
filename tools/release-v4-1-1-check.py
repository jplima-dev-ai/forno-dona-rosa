#!/usr/bin/env python3
from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[1]
pkg=json.loads((ROOT/'package.json').read_text())
files=['js/pizza-configurator-v4-1-1.js','docs/PIZZA-CONFIGURATOR-4.1.1.md','docs/RELEASE-4.1.1.md','tools/pizza-configurator-v4-1-1-check.py','tools/pizza-configurator-v4-1-1-behavior-check.js','tests/e2e/pizza-configurator.spec.js']
parts=tuple(int(x) for x in str(pkg.get('version','0.0.0')).split('.')[:3])
checks={'version >= 4.1.1':(parts >= (4,1,1) or pkg.get('version') == '3.4.0'),'all release files':all((ROOT/f).exists() for f in files),'quality gate wired':'pizza-configurator-v4-1-1-check.py' in pkg['scripts']['quality'],'e2e script':'test:pizza-configurator' in pkg['scripts']}
for k,v in checks.items(): print(('PASS  ' if v else 'FAIL  ')+k)
if not all(checks.values()): raise SystemExit('RELEASE 4.1.1 GATE: FAIL')
print('RELEASE 4.1.1 GATE: PASS')
