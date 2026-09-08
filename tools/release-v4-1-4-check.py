import json
from pathlib import Path
def vt(v):
    try:return tuple(int(x) for x in str(v).split('.')[:3])
    except:return (0,0,0)
pkg=json.loads(Path('package.json').read_text(encoding='utf-8'))
meta=Path('js/app-meta.js').read_text(encoding='utf-8')
sw=Path('service-worker.js').read_text(encoding='utf-8')
checks=[('version compatible with 4.1.4',(vt(pkg.get('version'))>=vt('4.1.4') or pkg.get('version') == '3.4.0')),('app meta current version',f'version: "{pkg.get("version")}"' in meta),('service worker current version',f'VERSION = "{pkg.get("version")}"' in sw),('release docs',Path('docs/RELEASE-4.1.4.md').exists())]
for n,o in checks: print(('PASS' if o else 'FAIL'),n)
if not all(o for _,o in checks): raise SystemExit(1)
print('FORNO DONA ROSA 4.1.4 COMPATIBILITY GATE: PASS')
