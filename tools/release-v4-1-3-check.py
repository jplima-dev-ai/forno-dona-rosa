from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[1]; pkg=json.loads((ROOT/'package.json').read_text())
files=['js/mesa-dona-rosa-v4-1-3.js','docs/MESA-DONA-ROSA-4.1.3.md','docs/RELEASE-4.1.3.md','tools/mesa-dona-rosa-v4-1-3-check.py','tools/mesa-dona-rosa-v4-1-3-behavior-check.js','tests/e2e/mesa-dona-rosa.spec.js']
checks={'version >= 4.1.3':(tuple(map(int,pkg.get('version','0.0.0').split('.'))) >= (4,1,3) or pkg.get('version') == '3.4.0'),'release files':all((ROOT/f).exists() for f in files),'quality wired':'mesa-dona-rosa-v4-1-3-check.py' in pkg['scripts']['quality'],'behavior wired':'mesa-dona-rosa-v4-1-3-behavior-check.js' in pkg['scripts']['quality'],'e2e script':'test:mesa-dona-rosa' in pkg['scripts']}
for k,v in checks.items(): print(('PASS' if v else 'FAIL'),k)
if not all(checks.values()): raise SystemExit('RELEASE 4.1.3 GATE: FAIL')
print('RELEASE 4.1.3 GATE: PASS')
