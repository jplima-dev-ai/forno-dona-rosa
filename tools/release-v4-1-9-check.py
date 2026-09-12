#!/usr/bin/env python3
from pathlib import Path
import subprocess,sys,json
r=Path(__file__).resolve().parents[1]
pkg=json.loads((r/'package.json').read_text(encoding='utf-8'))
if pkg.get('version')!='3.4.0': print('FAIL release version 3.4.0'); sys.exit(1)
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
    if res.returncode: sys.exit(res.returncode)
print('FORNO DONA ROSA 3.4.0 STABILIZATION RELEASE GATE: PASS')
print('Nota: este gate preserva a cadeia histórica. Na 3.4.0, Playwright Windows está registrado como PASS; NVDA no Windows e TalkBack no Android possuem evidência manual registrada; outros leitores permanecem não testados por falta de acesso; CWV publicado permanece pendente.')
