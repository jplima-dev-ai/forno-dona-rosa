from pathlib import Path
import subprocess,sys,json
r=Path(__file__).resolve().parents[1]
pkg=json.loads((r/'package.json').read_text(encoding='utf-8'))
from packaging.version import Version
if Version(str(pkg.get('version','0'))) < Version('4.1.8') and str(pkg.get('version')) != '3.4.0':
    print('FAIL release compatibility with fortress baseline');sys.exit(1)
for tool in ['accessibility-fortress-v4-1-8-check.py','admin-variant-pricing-v4-1-7-check.py']:
    res=subprocess.run([sys.executable,str(r/'tools'/tool)],cwd=r)
    if res.returncode: sys.exit(res.returncode)
res=subprocess.run(['node',str(r/'tools/admin-variant-pricing-behavior-v4-1-7-check.js')],cwd=r)
if res.returncode: sys.exit(res.returncode)
print('FORNO DONA ROSA 4.1.8 COMPATIBILITY GATE: PASS')
