#!/usr/bin/env python3
from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[1]; errors=[]
def check(label, ok):
    print(('PASS  ' if ok else 'FAIL  ')+label)
    if not ok: errors.append(label)
html=(ROOT/'index.html').read_text(encoding='utf-8');
import re
portion_match=re.search(r'<form[^>]*id="portion-form".*?</form>', html, re.S)
portion_form=portion_match.group(0) if portion_match else ''
js=(ROOT/'js/smart-portion-v4-1-2.js').read_text(encoding='utf-8'); css=(ROOT/'css/styles.css').read_text(encoding='utf-8'); sw=(ROOT/'service-worker.js').read_text(encoding='utf-8')
checks={
 'portion planner section':'id="porcoes"' in html and 'id="portion-form"' in html,
 'adult and child inputs':'id="portion-adults"' in html and 'id="portion-children"' in html,
 'native appetite radio group':'name="appetite"' in portion_form and portion_form.count('name="appetite"')==3,
 'explicit estimate disclosure':'referência, não uma promessa exata' in html,
 'accessible result focus':'id="portion-result-title" tabindex="-1"' in html,
 'polite status':'id="portion-status" role="status"' in html,
 'smart portion module wired':'js/smart-portion-v4-1-2.js' in html,
 'local calculation api':'FORNO_PORTIONS' in js and 'recommend' in js and 'effectivePeople' in js,
 'configurator handoff':'portion-apply-size' in js and 'size-select' in js,
 'responsive styles':'portion-planner__grid' in css and '@media(max-width:38rem)' in css,
 'forced colors preserved':'@media(forced-colors:active)' in css,
 'offline shell includes smart portion':'./js/smart-portion-v4-1-2.js' in sw,
}
for k,v in checks.items(): check(k,v)
if errors: raise SystemExit(f'SMART PORTION 4.1.2 GATE: FAIL ({len(errors)})')
print(f'{len(checks)}/{len(checks)} smart-portion checks passed')
