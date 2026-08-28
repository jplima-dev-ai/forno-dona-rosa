#!/usr/bin/env python3
from pathlib import Path
import re, sys

ROOT = Path(__file__).resolve().parents[1]
html = (ROOT / 'index.html').read_text(encoding='utf-8')
main_js = (ROOT / 'js/main.js').read_text(encoding='utf-8')
checkout_js = (ROOT / 'js/checkout.js').read_text(encoding='utf-8')
css = (ROOT / 'css/styles.css').read_text(encoding='utf-8')
changelog = (ROOT / 'CHANGELOG.md').read_text(encoding='utf-8')
brand_sync = (ROOT / 'tools/brand-sync.py').read_text(encoding='utf-8')
checks = []

def check(name, ok, detail=''):
    checks.append((name, bool(ok), detail))

def pos(fragment):
    return html.find(fragment)

check('Fast-path page order', -1 not in [pos('id="topo"'), pos('id="como-pedir"'), pos('id="cardapio"')] and pos('id="topo"') < pos('id="como-pedir"') < pos('id="cardapio"'))
hero_match = re.search(r'<div class="hero__actions">(.*?)</div>', html, re.S)
hero_body = hero_match.group(1) if hero_match else ''
hero_actions = re.findall(r'<(?:a|button)\b', hero_body)
check('Hero has two decisions', len(hero_actions) == 2, str(len(hero_actions)))
check('Hero primary CTA', 'href="menu/"' in hero_body and '>Pedir agora</a>' in hero_body)
nav_match = re.search(r'<nav[^>]*id="main-nav"[^>]*>(.*?)</nav>', html, re.S)
nav_body = nav_match.group(1) if nav_match else ''
nav_links = re.findall(r'<a\b', nav_body)
check('Primary nav reduced', len(nav_links) == 5, str(len(nav_links)))
fast_match = re.search(r'id="como-pedir".*?<ol class="fast-order__steps">(.*?)</ol>', html, re.S)
check('Three-step orientation', len(re.findall(r'<li\b', fast_match.group(1) if fast_match else '')) == 3)
check('Decision help progressive', '<details class="menu-help"><summary>Quero ajuda para decidir</summary>' in html)
check('Card runtime only purchase actions', 'body.append(actions);' in main_js and 'body.append(actions, utility);' not in main_js)
check('Product utilities moved to detail', 'id="product-dialog-favorite"' in html and 'id="product-dialog-share"' in html)
check('Product dialog utility behavior', 'product-dialog-favorite' in main_js and 'product-dialog-share' in main_js)
check('Bag primary continuation copy', 'id="send-cart"' in html and '>Informar endereço e continuar</button>' in html)
check('Checkout reopen recovery', 'requestAnimationFrame(() => openCart(trigger))' in main_js)
check('Rosa visible focus return target', 'const returnTarget = $("#open-cart") || document.activeElement;' in main_js)
check('Checkout review heading focus', '(isReview ? field("checkout-dialog-title") : field("checkout-name"))?.focus();' in checkout_js)
check('Checkout visible-field reduction', re.search(r'<input[^>]*id="checkout-city"[^>]*type="hidden"', html) is not None and re.search(r'<input[^>]*id="checkout-state"[^>]*type="hidden"', html) is not None)
check('Stale CEP state cleared', '++lookupToken;' in checkout_js and 'clearAddress();' in checkout_js and 'hideDeliveryState();' in checkout_js)
check('Pending CEP blocks review', 'Aguarde a validação do CEP antes de continuar.' in checkout_js)
check('Stored checkout data sanitized', '"checkout-name": clean(data.name' in checkout_js and '"checkout-state": clean(data.state, 2).toUpperCase()' in checkout_js)
check('Brand sync semantic logo matching', 'logo_match = re.search' in brand_sync and 'data-brand-logo' in brand_sync)
check('Fast-path responsive contract', '.fast-order__steps' in css and '@media(max-width:48rem)' in css)
for patch in range(10):
    check(f'Changelog 2.7.{patch}', f'## 2.7.{patch} ' in changelog)

passed = sum(1 for _, ok, _ in checks if ok)
for name, ok, detail in checks:
    print(('PASS' if ok else 'FAIL') + f'  {name}' + (f' — {detail}' if detail else ''))
print(f'\n{passed}/{len(checks)} conversion-flow checks passed')
if passed != len(checks):
    sys.exit(1)
