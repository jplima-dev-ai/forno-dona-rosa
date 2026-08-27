#!/usr/bin/env python3
"""Fail when runtime implementation hardcodes current-client identity outside brand/config layers."""
import sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
RUNTIME=[ROOT/'js/main.js',ROOT/'js/checkout.js',ROOT/'js/rosa.js',ROOT/'js/postal-code-service.js']
FORBIDDEN=['Forno Dona Rosa','Pizzaria Forno Dona Rosa','contato.fornodonarosa@gmail.com','5527992820798','fornodonarosa.pizzaria','Serra — ES']
errors=[]
for path in RUNTIME:
    text=path.read_text(encoding='utf-8')
    for token in FORBIDDEN:
        if token in text: errors.append(f'{path.relative_to(ROOT)} hardcodes brand token: {token}')
if errors:
    print('BRAND LEAK CHECK FAILED'); [print('-',e) for e in errors]; sys.exit(1)
print('BRAND LEAK CHECK PASSED')
print(f'- Runtime files checked: {len(RUNTIME)}')
print(f'- Forbidden client tokens found: 0')
