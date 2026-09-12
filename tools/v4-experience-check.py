#!/usr/bin/env python3
from pathlib import Path
import json, sys

ROOT=Path(__file__).resolve().parents[1]
errors=[]
idx=(ROOT/'index.html').read_text(encoding='utf-8')

for token in ['data-experience-router','quick-order','guided-choice','discover-house','js/experience-router-v4.js','name="x-project-version"']:
    if token not in idx:
        errors.append('index missing '+token)

# The experience stylesheet may be loaded directly on generated routes or folded into
# the reproducible home bundle. Validate the actual capability instead of its legacy
# v4 delivery mechanism.
experience_css=ROOT/'css/experience-v4.css'
home_bundle=ROOT/'css/home-bundle.css'
if not experience_css.exists():
    errors.append('experience stylesheet missing')
else:
    bundle_text=home_bundle.read_text(encoding='utf-8') if home_bundle.exists() else ''
    if 'css/experience-v4.css' not in idx and 'source: css/experience-v4.css' not in bundle_text:
        errors.append('experience stylesheet is neither direct nor bundled')

config=json.loads((ROOT/'data/experience-v4.json').read_text(encoding='utf-8'))
if config.get('privacy',{}).get('collectConversationText') is not False:
    errors.append('privacy contract invalid')

css=experience_css.read_text(encoding='utf-8') if experience_css.exists() else ''
for token in ['prefers-reduced-motion','forced-colors',':focus-visible']:
    if token not in css:
        errors.append('css missing '+token)

if errors:
    print('\n'.join('FAIL: '+e for e in errors))
    sys.exit(1)

print('PASS: experience capability gate')
