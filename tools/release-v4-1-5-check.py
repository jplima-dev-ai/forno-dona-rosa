import json
from pathlib import Path

pkg=json.loads(Path('package.json').read_text(encoding='utf-8'))
version=str(pkg.get('version',''))
checks=[
 ('current version semantic',len(version.split('.'))==3 and all(part.isdigit() for part in version.split('.'))),
 ('app meta current','version: "'+version+'"' in Path('js/app-meta.js').read_text(encoding='utf-8')),
 ('service worker current','VERSION = "'+version+'"' in Path('service-worker.js').read_text(encoding='utf-8')),
 ('release docs',Path('docs/RELEASE-4.1.5.md').exists()),
 ('evidence ledger',Path('docs/releases/evidence/v4.1.5/summary.md').exists()),
]
for n,o in checks:
    print(('PASS' if o else 'FAIL'),n)
if not all(o for _,o in checks):
    raise SystemExit(1)
print('FORNO DONA ROSA 4.1.5 LINEAGE GATE: PASS')
