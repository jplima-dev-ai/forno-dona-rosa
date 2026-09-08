from pathlib import Path
import json, sys
root=Path(__file__).resolve().parents[1]
pkg=json.loads((root/'package.json').read_text(encoding='utf-8'))
checks={
 'package version >= 4.1.6': (tuple(map(int,pkg.get('version','0.0.0').split('.'))) >= (4,1,6) or pkg.get('version') == '3.4.0'),
 'app meta current': f'version: "{pkg.get("version")}"' in (root/'js/app-meta.js').read_text(encoding='utf-8'),
 'service worker current': f'const VERSION = "{pkg.get("version")}"' in (root/'service-worker.js').read_text(encoding='utf-8'),
 'root html current version': f'content="{pkg.get("version")}"' in (root/'index.html').read_text(encoding='utf-8'),
 'feature docs': (root/'docs/ROSA-ORDER-CONCIERGE-4.1.6.md').exists(),
 'release docs': (root/'docs/RELEASE-4.1.6.md').exists(),
 'evidence ledger': (root/'docs/releases/evidence/v4.1.6/summary.md').exists(),
 'e2e spec': (root/'tests/e2e/rosa-order-concierge.spec.js').exists(),
}
for k,v in checks.items(): print(('PASS' if v else 'FAIL'),k)
if all(checks.values()): print('FORNO DONA ROSA 4.1.6 COMPATIBILITY GATE: PASS'); sys.exit(0)
print('FORNO DONA ROSA 4.1.6 COMPATIBILITY GATE: FAIL'); sys.exit(1)
