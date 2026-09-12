#!/usr/bin/env python3
from pathlib import Path
import subprocess,sys,json,re

r=Path(__file__).resolve().parents[1]
pkg=json.loads((r/'package.json').read_text(encoding='utf-8'))
version=str(pkg.get('version',''))
if not re.fullmatch(r'\d+\.\d+\.\d+',version):
    print('FAIL current package version is not semantic')
    sys.exit(1)

steps=[
 [sys.executable,str(r/'tools/variant-commerce-v4-1-check.py')],
 [sys.executable,str(r/'tools/pizza-configurator-v4-1-1-check.py')],
 [sys.executable,str(r/'tools/smart-portion-v4-1-2-check.py')],
 [sys.executable,str(r/'tools/mesa-dona-rosa-v4-1-3-check.py')],
 [sys.executable,str(r/'tools/smart-pairing-v4-1-4-check.py')],
 [sys.executable,str(r/'tools/intelligent-bag-v4-1-5-check.py')],
 [sys.executable,str(r/'tools/rosa-order-concierge-v4-1-6-check.py')],
 [sys.executable,str(r/'tools/admin-variant-pricing-v4-1-7-check.py')],
 [sys.executable,str(r/'tools/accessibility-fortress-v4-1-8-check.py')],
 [sys.executable,str(r/'tools/signature-commerce-v4-1-9-check.py')],
 ['node',str(r/'tools/signature-commerce-v4-1-9-behavior-check.js')]
]
for cmd in steps:
    res=subprocess.run(cmd,cwd=r)
    if res.returncode:
        sys.exit(res.returncode)
print(f'FORNO DONA ROSA {version} HISTORICAL CAPABILITY CHAIN: PASS')
print('Nota: este gate preserva a cadeia técnica 4.1.x. Evidência manual de NVDA no Windows e TalkBack no Android continua registrada na release 3.4.0; uma patch release não recebe novo claim manual sem execução humana correspondente.')
