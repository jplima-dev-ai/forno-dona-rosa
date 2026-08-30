#!/usr/bin/env python3
from pathlib import Path
import re, sys, json
ROOT=Path(__file__).resolve().parents[1]
errors=[]; passed=[]
def check(condition,label):
    (passed if condition else errors).append(label)
admin=(ROOT/'admin/index.html').read_text(encoding='utf-8')
js=(ROOT/'js/admin.js').read_text(encoding='utf-8')
core=(ROOT/'js/admin-core.js').read_text(encoding='utf-8')
css=(ROOT/'css/admin.css').read_text(encoding='utf-8')
pkg=json.loads((ROOT/'package.json').read_text(encoding='utf-8'))
ch=(ROOT/'CHANGELOG.md').read_text(encoding='utf-8')
check('name="robots" content="noindex,nofollow"' in admin,'admin excluded from indexing')
check('Pular para o conteúdo principal' in admin,'admin skip link')
check('aria-live="polite"' in admin,'admin status announcement')
check('Exportar alterações' in admin and 'Importar backup' in admin,'import/export controls')
check('sem publicação automática' in admin.lower(),'static publishing limitation disclosed')
check('product-available' in admin and 'product-featured' in admin,'product operations')
check('hours-editor' in admin and 'op-pickup' in admin and 'op-delivery' in admin,'store operations')
check('sauce-list' in admin,'sauce operations')
check('innerHTML' not in js and 'insertAdjacentHTML' not in js and 'outerHTML' not in js,'admin avoids unsafe DOM sinks')
check('beforeunload' in js,'dirty draft navigation guard')
check('localStorage' in js and 'DRAFT_KEY' in js,'local draft persistence')
check('exportEnvelope' in core and 'validate' in core,'admin core validation/export')
check('forced-colors:active' in css,'forced colors support')
check('prefers-reduced-motion:reduce' in css,'reduced motion support')
check('@media(max-width:36rem)' in css and '@media(min-width:64rem)' in css,'adaptive admin layout')
check((ROOT/'tools/apply-admin-bundle.py').exists(),'bundle apply tool')
check('needs_build' in (ROOT/'tools/build-media.py').read_text(encoding='utf-8'),'incremental media build')
check('admin-foundation-check.py' in pkg.get('scripts',{}).get('quality',''),'admin gate in quality command')
for patch in range(10): check(f'## 3.4.{patch} ' in ch,f'changelog 3.4.{patch}')
if errors:
    print('ADMIN FOUNDATION CHECK FAILED')
    for label in errors: print('FAIL ',label)
    sys.exit(1)
for label in passed: print('PASS ',label)
print(f'{len(passed)}/{len(passed)} admin-foundation checks passed')
