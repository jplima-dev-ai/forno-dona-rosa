import json
from pathlib import Path

pkg=json.loads(Path('package.json').read_text(encoding='utf-8'))
meta=Path('js/app-meta.js').read_text(encoding='utf-8')
sw=Path('service-worker.js').read_text(encoding='utf-8')
version=str(pkg.get('version',''))
checks=[
    ('current version semantic',len(version.split('.'))==3 and all(part.isdigit() for part in version.split('.'))),
    ('app meta current version',f'version: "{version}"' in meta),
    ('service worker current version',f'VERSION = "{version}"' in sw),
    ('release docs',Path('docs/RELEASE-4.1.4.md').exists()),
]
for n,o in checks:
    print(('PASS' if o else 'FAIL'),n)
if not all(o for _,o in checks):
    raise SystemExit(1)
print('FORNO DONA ROSA 4.1.4 LINEAGE GATE: PASS')
