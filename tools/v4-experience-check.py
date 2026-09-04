#!/usr/bin/env python3
from pathlib import Path
import json, sys
ROOT=Path(__file__).resolve().parents[1]
errors=[]
idx=(ROOT/'index.html').read_text(encoding='utf-8')
for token in ['data-experience-router','quick-order','guided-choice','discover-house','css/experience-v4.css','js/experience-router-v4.js','name="x-project-version"']:
    if token not in idx: errors.append('index missing '+token)
pkg=json.loads((ROOT/'package.json').read_text(encoding='utf-8'))
if tuple(map(int,pkg.get('version','0.0.0').split('.'))) < (4,0,0): errors.append('package version is older than 4.0.0')
config=json.loads((ROOT/'data/experience-v4.json').read_text(encoding='utf-8'))
if config.get('privacy',{}).get('collectConversationText') is not False: errors.append('privacy contract invalid')
css=(ROOT/'css/experience-v4.css').read_text(encoding='utf-8')
for token in ['prefers-reduced-motion','forced-colors',':focus-visible']:
    if token not in css: errors.append('css missing '+token)
if errors:
    print('\n'.join('FAIL: '+e for e in errors)); sys.exit(1)
print('PASS: Forno Dona Rosa 4.0.0 experience gate')
