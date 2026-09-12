#!/usr/bin/env python3
from pathlib import Path
import json

ROOT=Path(__file__).resolve().parents[1]
pkg=json.loads((ROOT/'package.json').read_text(encoding='utf-8'))
files=['js/smart-portion-v4-1-2.js','docs/SMART-PORTION-4.1.2.md','docs/RELEASE-4.1.2.md','tools/smart-portion-v4-1-2-check.py','tools/smart-portion-v4-1-2-behavior-check.js','tests/e2e/smart-portion.spec.js']
version=str(pkg.get('version',''))
checks={
    'current version semantic':len(version.split('.'))==3 and all(part.isdigit() for part in version.split('.')),
    'all release files':all((ROOT/f).exists() for f in files),
    'quality gate wired':'smart-portion-v4-1-2-check.py' in pkg['scripts']['quality'],
    'behavior gate wired':'smart-portion-v4-1-2-behavior-check.js' in pkg['scripts']['quality'],
    'e2e script':'test:smart-portion' in pkg['scripts'],
}
for k,v in checks.items():
    print(('PASS  ' if v else 'FAIL  ')+k)
if not all(checks.values()):
    raise SystemExit('RELEASE 4.1.2 LINEAGE GATE: FAIL')
print('RELEASE 4.1.2 LINEAGE GATE: PASS')
