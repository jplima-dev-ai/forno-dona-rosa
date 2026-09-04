#!/usr/bin/env python3
from pathlib import Path
import json, sys
root=Path(sys.argv[1]).resolve() if len(sys.argv)>1 else Path.cwd()
errors=[]

def need(cond,msg):
    if not cond: errors.append(msg)

pkg=json.loads((root/'package.json').read_text(encoding='utf-8'))
need(tuple(map(int,pkg.get('version','0.0.0').split('.'))) >= (4,0,3),'package.json deve estar em 4.0.3 ou superior')
need((root/'js/rosa-context-v4.js').exists(),'js/rosa-context-v4.js ausente')
index=(root/'index.html').read_text(encoding='utf-8')
need('js/rosa-context-v4.js' in index,'rosa-context-v4.js não carregado na home')
smart=(root/'js/smart-menu-v4.js').read_text(encoding='utf-8')
need('window.FORNO_MENU' in smart,'Smart Menu precisa aceitar FORNO_MENU')
rosa=(root/'js/rosa.js').read_text(encoding='utf-8')
need('FORNO_ROSA_CONTEXT' in rosa,'Rosa não está delegando ao Context Engine')
need('regional' in rosa and 'meat' in rosa and 'creamy' in rosa,'preferências 4.x ausentes na Rosa')
need('nordestin' in rosa.lower(),'Rosa não reconhece intenção nordestina')
ctx=(root/'js/rosa-context-v4.js').read_text(encoding='utf-8')
for token in ['snapshot','recommend','complementarySuggestion','forno:experience-intent']:
    need(token in ctx,f'Context Engine sem {token}')
if errors:
    print('ROSA CONTEXT GATE: FAIL')
    for item in errors: print('-',item)
    raise SystemExit(1)
print('ROSA CONTEXT GATE: PASS')
