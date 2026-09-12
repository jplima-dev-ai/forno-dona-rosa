#!/usr/bin/env python3
from pathlib import Path
import re,sys

ROOT=Path(sys.argv[1]).resolve() if len(sys.argv)>1 else Path.cwd()
errors=[]

def need(path,text):
    p=ROOT/path
    if not p.exists():
        errors.append(f'{path} ausente')
        return ''
    data=p.read_text(encoding='utf-8')
    if text not in data:
        errors.append(f'{path}: esperado {text!r}')
    return data

need('index.html','js/conversion-intelligence-v4.js')
js=need('js/conversion-intelligence-v4.js','window.FORNO_CONVERSION')
for token in ['SAFE_KEYS','sessionStorage','forno:conversion','rosa_recommendation','whatsapp_handoff','search_started']:
    if token not in js:
        errors.append(f'conversion module sem {token}')

safe_block=re.search(r'const SAFE_KEYS = new Set\(\[(.*?)\]\);',js,re.S)
for forbidden in ['"address"','"cep"','"phone"','"message"','"notes"','"conversation"']:
    if safe_block and forbidden in safe_block.group(1):
        errors.append(f'chave proibida na allowlist: {forbidden}')

main=need('js/main.js','FORNO_CONVERSION')
for event in ['product_view','bag_add','checkout_started','whatsapp_handoff']:
    if event not in main:
        errors.append(f'main.js sem instrumentação {event}')

if errors:
    print('CONVERSION GATE FAIL')
    for e in errors:
        print('-',e)
    raise SystemExit(1)
print('CONVERSION GATE PASS')
