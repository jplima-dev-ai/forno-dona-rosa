#!/usr/bin/env python3
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]
source = ROOT / 'data' / 'catalog.json'
target = ROOT / 'data' / 'menu.js'

data = json.loads(source.read_text(encoding='utf-8'))
products = data.get('products', [])
pricing = data.get('pricing', {})

if not isinstance(products, list) or not products:
    raise SystemExit('SYNC RUNTIME MENU FAILED: catalog products missing')
ids = [p.get('id') for p in products if isinstance(p, dict)]
if len(ids) != len(set(ids)):
    raise SystemExit('SYNC RUNTIME MENU FAILED: duplicate product ids')

def js_object(value):
    text = json.dumps(value, ensure_ascii=False, separators=(',', ':'))
    import re
    return re.sub(r'\"([A-Za-z_$][A-Za-z0-9_$]*)\":', r'\1:', text)

payload = (
    'window.FORNO_MENU = Object.freeze(' + js_object(products) + ');\n'
    'window.FORNO_PRICING = Object.freeze(' + js_object(pricing) + ');\n'
)
target.write_text(payload, encoding='utf-8')
print(f'RUNTIME MENU SYNC PASSED ({len(products)} products)')
