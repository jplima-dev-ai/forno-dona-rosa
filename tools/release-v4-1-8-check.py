from pathlib import Path
import subprocess,sys,json,re

r=Path(__file__).resolve().parents[1]
pkg=json.loads((r/'package.json').read_text(encoding='utf-8'))
version=str(pkg.get('version',''))
if not re.fullmatch(r'\d+\.\d+\.\d+',version):
    print('FAIL current package version is not semantic')
    sys.exit(1)

for tool in ['accessibility-fortress-v4-1-8-check.py','admin-variant-pricing-v4-1-7-check.py']:
    res=subprocess.run([sys.executable,str(r/'tools'/tool)],cwd=r)
    if res.returncode:
        sys.exit(res.returncode)
res=subprocess.run(['node',str(r/'tools/admin-variant-pricing-behavior-v4-1-7-check.js')],cwd=r)
if res.returncode:
    sys.exit(res.returncode)
print('FORNO DONA ROSA 4.1.8 LINEAGE GATE: PASS')
