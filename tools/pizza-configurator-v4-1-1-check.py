#!/usr/bin/env python3
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'index.html').read_text(encoding='utf-8')
js=(ROOT/'js/main.js').read_text(encoding='utf-8')
css=(ROOT/'css/styles.css').read_text(encoding='utf-8')
sw=(ROOT/'service-worker.js').read_text(encoding='utf-8')
checks={
 'four semantic steps': 'aria-label="Etapas para personalizar a pizza"' in html and html.count('configurator-step-label') >= 4,
 'fieldset step 1': '<fieldset class="configurator-panel" id="configurator-step-1">' in html,
 'fieldset step 2': '<fieldset class="configurator-panel" id="configurator-step-2">' in html,
 'review definition list': 'class="configurator-review__list"' in html and '<dl' in html,
 'native submit': 'type="submit">Adicionar esta pizza à sacola</button>' in html,
 'review module wired': 'js/pizza-configurator-v4-1-1.js' in html and 'FORNO_CONFIGURATOR' in js,
 'optional text updates review': '"remove-ingredients", "notes"' in js,
 'responsive configurator': '.configurator-steps' in css and '@container (max-width:34rem)' in css,
 'forced colors': '@media(forced-colors:active)' in css,
 'offline shell includes configurator': './js/pizza-configurator-v4-1-1.js' in sw and './js/variant-commerce-v4-1.js' in sw,
}
failed=[k for k,v in checks.items() if not v]
for k,v in checks.items(): print(('PASS  ' if v else 'FAIL  ')+k)
if failed: raise SystemExit(f'{len(failed)} configurator checks failed')
print(f'{len(checks)}/{len(checks)} pizza-configurator checks passed')
