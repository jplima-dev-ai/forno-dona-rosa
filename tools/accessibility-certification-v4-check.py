#!/usr/bin/env python3
from pathlib import Path
import json,sys
root=Path(sys.argv[1]).resolve() if len(sys.argv)>1 else Path.cwd()
errors=[]
try:
    data=json.loads((root/'data/accessibility-contracts-v4.json').read_text(encoding='utf-8'))
except Exception as e:
    raise SystemExit(f'FAIL: accessibility contracts inválido: {e}')
if data.get('version')!='4.0.7': errors.append('contracts version != 4.0.7')
ids={x.get('id') for x in data.get('flows',[])}
for required in ['home','menu','product','rosa','bag','checkout','admin']:
    if required not in ids: errors.append(f'fluxo ausente: {required}')
statuses={m.get('status') for m in data.get('manualMatrix',[])}
if 'MANUAL_REQUIRED' not in statuses: errors.append('matriz não distingue teste manual')
spec=root/'tests/accessibility/contracts-v4.spec.js'
if not spec.exists(): errors.append('spec v4 ausente')
else:
    t=spec.read_text(encoding='utf-8')
    for token in ['AxeBuilder','toBeFocused','320','forcedColors','reducedMotion']:
        if token not in t: errors.append(f'spec sem {token}')
if errors:
    print('ACCESSIBILITY CERTIFICATION V4: FAIL')
    [print('-',e) for e in errors]
    raise SystemExit(1)
print('ACCESSIBILITY CERTIFICATION V4: PASS (structural contract)')
print('Nota: testes NVDA/Narrator/VoiceOver permanecem MANUAL_REQUIRED/NOT_TESTED conforme ledger.')
