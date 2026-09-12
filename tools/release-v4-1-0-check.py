#!/usr/bin/env python3
from pathlib import Path
import json

ROOT=Path(__file__).resolve().parents[1]
errors=[]

def check(label,ok):
    print(('PASS  ' if ok else 'FAIL  ')+label)
    if not ok:
        errors.append(label)

pkg=json.loads((ROOT/'package.json').read_text(encoding='utf-8'))
meta=(ROOT/'js/app-meta.js').read_text(encoding='utf-8')
sw=(ROOT/'service-worker.js').read_text(encoding='utf-8')
changelog=(ROOT/'CHANGELOG.md').read_text(encoding='utf-8')
current=pkg.get('version')

check('current package version is semantic',isinstance(current,str) and len(current.split('.'))==3 and all(part.isdigit() for part in current.split('.')))
check('app meta matches package',f'version: "{current}"' in meta)
check('bag schema 4','bagSchemaVersion: 4' in meta)
check('catalog schema 4','catalogSchemaVersion: 4' in meta)
check('service worker matches package',f'const VERSION = "{current}"' in sw)
check('changelog preserves 4.1.0','## 4.1.0' in changelog)
check('release notes',(ROOT/'docs/RELEASE-4.1.0.md').exists())
check('roadmap',(ROOT/'docs/ROADMAP-4.1.md').exists())

if errors:
    raise SystemExit(f'FORNO DONA ROSA 4.1.0 LINEAGE GATE: FAIL ({len(errors)})')
print('FORNO DONA ROSA 4.1.0 LINEAGE GATE: PASS (historical capability contract)')
