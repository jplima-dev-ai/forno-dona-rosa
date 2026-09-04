#!/usr/bin/env python3
from pathlib import Path
import json,sys
ROOT=Path(sys.argv[1]).resolve() if len(sys.argv)>1 else Path.cwd()
errors=[]
def need(rel,token):
    p=ROOT/rel
    if not p.exists(): errors.append(f'{rel} ausente'); return ''
    text=p.read_text(encoding='utf-8')
    if token not in text: errors.append(f'{rel} sem {token}')
    return text
pkg=json.loads((ROOT/'package.json').read_text(encoding='utf-8'))
if tuple(map(int,pkg.get('version','0.0.0').split('.'))) < (4,0,6): errors.append('package version < 4.0.6')
admin=need('admin/index.html','id="content-health"')
need('admin/index.html','../js/admin-health-v4.js')
need('admin/index.html','../css/admin-health-v4.css')
js=need('js/admin-health-v4.js','window.ADMIN_HEALTH_V4')
for token in ['critical','warnings','plannedSource','seoTitle','authorized']:
    if token not in js: errors.append(f'admin health sem {token}')
if f"Admin Studio v{pkg.get('version')}" not in admin: errors.append('rodapé Admin não sincronizado com a versão atual')
if errors:
    print('ADMIN STUDIO 4 GATE FAIL'); [print('-',e) for e in errors]; raise SystemExit(1)
print('ADMIN STUDIO 4 GATE PASS')
