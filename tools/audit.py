#!/usr/bin/env python3
from pathlib import Path
from html.parser import HTMLParser
import json, re, subprocess, sys

ROOT = Path(__file__).resolve().parents[1]
VERSION = "3.0.9"
errors = []

class AuditParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids=[]; self.links=[]; self.refs=[]; self.h1=0; self.lang=None; self.skip=False; self.viewport=False
    def handle_starttag(self, tag, attrs):
        d=dict(attrs)
        if tag=='html': self.lang=d.get('lang')
        if d.get('id'): self.ids.append(d['id'])
        if tag=='h1': self.h1 += 1
        if tag=='meta' and d.get('name')=='viewport': self.viewport=True
        if tag=='a':
            href=d.get('href',''); self.links.append((href,d))
            if 'skip-link' in d.get('class','').split(): self.skip=True
        if tag=='script' and d.get('src'): self.refs.append(d['src'])
        if tag=='link' and d.get('href') and d.get('rel') in ('stylesheet','manifest','icon','apple-touch-icon','preload'): self.refs.append(d['href'])
        if tag=='img' and d.get('src'): self.refs.append(d['src'])

html=(ROOT/'index.html').read_text(encoding='utf-8')
p=AuditParser(); p.feed(html)
if len(p.ids)!=len(set(p.ids)): errors.append('Duplicate HTML IDs found')
if p.h1!=1: errors.append(f'Expected exactly one h1, found {p.h1}')
if p.lang!='pt-BR': errors.append('Customer-facing document language must remain pt-BR')
if not p.viewport: errors.append('Viewport meta tag is missing')
if not p.skip: errors.append('Skip link is missing')
idset=set(p.ids)
for href, attrs in p.links:
    if href=='#': errors.append('Empty href="#" found')
    if href.startswith('#') and href[1:] not in idset: errors.append(f'Broken internal anchor: {href}')
    if attrs.get('target')=='_blank':
        rel=set((attrs.get('rel') or '').split())
        if not {'noopener','noreferrer'}.issubset(rel): errors.append(f'_blank link missing noopener+noreferrer: {href}')
for ref in p.refs:
    if re.match(r'^(?:https?:|data:|#)',ref): continue
    if not (ROOT/ref).exists(): errors.append(f'Missing local resource: {ref}')

runtime_files=['js/main.js','js/checkout.js','js/rosa.js']
runtime_js={name:(ROOT/name).read_text(encoding='utf-8') for name in runtime_files}
for name, js in runtime_js.items():
    for forbidden in ['innerHTML','outerHTML','insertAdjacentHTML','eval(','new Function','document.write']:
        if forbidden in js: errors.append(f'Forbidden dynamic DOM/code API in {name}: {forbidden}')

sw_text=(ROOT/'service-worker.js').read_text(encoding='utf-8')
if 'url.origin !== self.location.origin' not in sw_text: errors.append('Service worker lacks an explicit same-origin restriction')
if 'Content-Security-Policy' not in html: errors.append('Content Security Policy meta tag is missing')

js_files=['js/app-meta.js','data/brand/brand-config.js','data/brand/content-config.js','js/app-config.js','js/feature-flags.js','data/catalog-schema.js','js/brand-runtime.js','data/delivery-config.js','data/menu.js','data/rosa-knowledge-base.js','js/postal-code-service.js','js/main.js','js/checkout.js','js/rosa.js','service-worker.js']
for jsfile in js_files:
    r=subprocess.run(['node','--check',str(ROOT/jsfile)],capture_output=True,text=True,encoding="utf-8",errors="replace")
    if r.returncode: errors.append(f'JavaScript syntax error in {jsfile}: {r.stderr.strip()}')

manifest=json.loads((ROOT/'manifest.webmanifest').read_text(encoding='utf-8'))
if not manifest.get('name') or not manifest.get('icons'): errors.append('Manifest is incomplete')

menu_text=(ROOT/'data/menu.js').read_text(encoding='utf-8')
ids=re.findall(r'id:"([^"]+)"', menu_text)
if len(ids)!=len(set(ids)): errors.append('Duplicate catalog IDs found')
if len(ids)<30: errors.append(f'Catalog unexpectedly shrank to {len(ids)} items')
if menu_text.count('type:"bebida"')<8: errors.append('Drink catalog is incomplete')
if 'carrinho' in html.lower(): errors.append('Legacy customer-facing term "carrinho" is still present in HTML')
if 'id="menu-search"' not in html: errors.append('Menu search control is missing')

main_text=(ROOT/'js/main.js').read_text(encoding='utf-8')
rosa_text=(ROOT/'js/rosa.js').read_text(encoding='utf-8')
meta_text=(ROOT/'js/app-meta.js').read_text(encoding='utf-8')
if not all(x in main_text for x in ['bag-v3','bag-v2','cart','schemaVersion: BAG_SCHEMA_VERSION','storageNamespace']): errors.append('Bag schema/migration coverage is incomplete')
if 'assistant-session-v4' not in rosa_text or 'SESSION_SCHEMA = 4' not in rosa_text or 'classify' not in rosa_text or 'confidence' not in rosa_text: errors.append('Rosa session v4/confidence flow is incomplete')
if 'findProducts' not in rosa_text or 'resolveOrdinalReference' not in rosa_text or 'ambiguousChoice' not in rosa_text: errors.append('Rosa product resolution/disambiguation flow is incomplete')
if 'window.ROSA?.open' not in main_text: errors.append('Delegated dynamic Rosa launcher is missing')
if 'RUNTIME_LIMIT = 24' not in sw_text or 'trimRuntimeCache' not in sw_text: errors.append('Runtime cache limit is missing')


if 'function sanitizeBag' not in main_text or 'MAX_BAG_QTY - totalQty' not in main_text: errors.append('Cumulative Bag sanitation is missing')
if 'candidate2?.type === "pizza"' not in main_text: errors.append('Half-and-half persisted state does not reject non-pizza second items')
if 'restoreCartActionFocus' not in main_text: errors.append('Bag rerender focus recovery is missing')
if 'id="app-status"' not in html or 'announceApp' not in main_text: errors.append('Global accessible interaction status is missing')
if 'if (!addCart(item))' not in main_text: errors.append('Order form can reset after a failed Bag addition')
if 'const added = window.FORNO_APP.addProduct' not in rosa_text: errors.append('Rosa can claim an add action without checking the result')
if 'async function matchVersioned' not in sw_text or 'Promise.allSettled(WARM_ASSETS' not in sw_text: errors.append('PWA v1.8 cache hardening is incomplete')
for asset in ['dona-rosa-hero-pizza.webp','cheese-pull-pizza.webp','wood-fired-oven-pizza.webp','nutella-strawberry-pizza.webp']:
    if not (ROOT/'assets/images'/asset).exists(): errors.append(f'Missing modern image asset: {asset}')

# International portfolio naming gate.
legacy_paths=[
    'js/config.js','data/rosa-knowledge.js','assets/images/hero-dona-rosa.jpg',
    'assets/images/gallery-cheese-pull.jpg','assets/images/gallery-oven-scene.jpg',
    'assets/images/gallery-nutella-morango.jpg','assets/images/pizza-assinatura.svg'
]
for legacy in legacy_paths:
    if (ROOT/legacy).exists(): errors.append(f'Legacy technical filename still exists: {legacy}')
    for source in [html, main_text, rosa_text, sw_text, menu_text]:
        if legacy in source: errors.append(f'Legacy technical reference still exists: {legacy}')

required_paths=[
    'README.md','README-PT.md','docs/CASE-STUDY.md','js/app-config.js',
    'data/rosa-knowledge-base.js','assets/images/dona-rosa-hero-pizza.jpg',
    'assets/images/cheese-pull-pizza.jpg','assets/images/wood-fired-oven-pizza.jpg',
    'assets/images/nutella-strawberry-pizza.jpg'
]
for path in required_paths:
    if not (ROOT/path).exists(): errors.append(f'Required internationalized file missing: {path}')

changelog=(ROOT/'CHANGELOG.md').read_text(encoding='utf-8')

# Release-history continuity gate. Changelog headings may use either the
# historical bracket form (`## [1.2.3]`) or the current professional form
# (`## 1.2.3 — Title`), but every planned microversion must exist.
def changelog_has_version(version):
    return re.search(rf'^##\s+\[?{re.escape(version)}\]?(?:\s|$)', changelog, re.MULTILINE) is not None

for major, max_minor in ((1, 9), (2, 9)):
    for minor in range(max_minor + 1):
        for patch in range(10):
            version=f'{major}.{minor}.{patch}'
            if not changelog_has_version(version):
                errors.append(f'Changelog missing {version}')

version_match=re.search(r'version:\s*"([^"]+)"',meta_text)
source_version=version_match.group(1) if version_match else None
if source_version!=VERSION: errors.append(f'app-meta.js version mismatch: expected {VERSION}, got {source_version}')
if f'content="{VERSION}" name="x-project-version"' not in html and f'name="x-project-version" content="{VERSION}"' not in html: errors.append('HTML version metadata is out of sync')
if f'const VERSION = "{VERSION}"' not in sw_text: errors.append('Service-worker version is out of sync')

for patch in range(1, 10):
    version = f"2.0.{patch}"
    if f"## {version} " not in changelog:
        errors.append(f"Changelog missing {version}")

for patch in range(10):
    version = f"2.1.{patch}"
    if f"## {version} " not in changelog:
        errors.append(f"Changelog missing {version}")

# v2.1 repository hygiene gate.
obsolete_paths=['assets/images/signature-pizza.svg','assets/images/og-cover.png','tools/generate.py']
for obsolete in obsolete_paths:
    if (ROOT/obsolete).exists(): errors.append(f'Obsolete file returned: {obsolete}')
    for source in [html, main_text, rosa_text, sw_text, menu_text]:
        if obsolete in source: errors.append(f'Obsolete runtime reference returned: {obsolete}')

product_paths=re.findall(r'image:"(assets/images/products/[^"]+)"', menu_text)
non_english_tokens=['agua','gas','lata','suco','laranja','mucarela','calabresa','portuguesa','frango','toscana','forno','casa','trufa','picante','vegana','chocolate-belga','banana-doce-leite','romeu-julieta']
for image_path in product_paths:
    filename=Path(image_path).name.lower()
    if any(token in filename for token in non_english_tokens): errors.append(f'Non-English product image filename: {filename}')

for patch in range(10):
    version = f"2.2.{patch}"
    if f"## {version} " not in changelog:
        errors.append(f"Changelog missing {version}")

# v2.2 conversion and mobile experience gates.
responsive_variants=list((ROOT/'assets/images/products').glob('*-384.webp'))
if len(responsive_variants)!=31: errors.append(f'Expected 31 responsive product variants, found {len(responsive_variants)}')
if not (ROOT/'assets/images/dona-rosa-hero-pizza-640.webp').exists(): errors.append('Mobile hero image variant is missing')
for token in ['sensory-tags','product-dialog','returning-order','mobile-nav','bag-feedback','review-cart-with-rosa']:
    if token not in html: errors.append(f'v2.2 UI element missing: {token}')
for token in ['LAST_ORDER_KEY','restoreLastOrder','smallProductImage','openProductDialog']:
    if token not in main_text: errors.append(f'v2.2 main behavior missing: {token}')
if 'rosa-product-cards' not in rosa_text or 'data-rosa-add' not in rosa_text: errors.append('Rosa actionable product cards are missing')
if 'WhatsApp exige conexão' not in main_text or 'send.disabled = true' not in main_text: errors.append('Offline WhatsApp protection is missing')


for patch in range(10):
    version = f"2.3.{patch}"
    if f"## {version} " not in changelog:
        errors.append(f"Changelog missing {version}")

# v2.3 Rosa finalization gates.
for token in ['assistant-session-v4','SESSION_SCHEMA = 4','extractPreferences','applyPreferenceOverrides','resolveOrdinalReference','findComparisonProducts','ambiguousChoice','pendingAction','renderQuickActions','data-rosa-details']:
    if token not in rosa_text: errors.append(f'Rosa v2.3 capability missing: {token}')
if 'clearBag()' not in main_text: errors.append('Rosa destructive-action bridge is missing')
if 'id="rosa-input-count"' not in html or 'rosa-privacy-note' not in html: errors.append('Rosa v2.3 accessible input/disclosure UI is missing')
if not (ROOT/'tools/rosa-behavior-check.js').exists(): errors.append('Rosa behavior regression tool is missing')
if not (ROOT/'docs/ROSA.md').exists(): errors.append('Rosa technical documentation is missing')


for patch in range(10):
    version = f"2.4.{patch}"
    if f"## {version} " not in changelog:
        errors.append(f"Changelog missing {version}")

# v2.4 local checkout and inclusive mobile gates.
checkout_text=(ROOT/'js/checkout.js').read_text(encoding='utf-8')
postal_text=(ROOT/'js/postal-code-service.js').read_text(encoding='utf-8')
delivery_text=(ROOT/'data/delivery-config.js').read_text(encoding='utf-8')
for token in ['checkout-dialog','checkout-form','checkout-review-step','checkout-postal-code','checkout-no-number','checkout-remember','checkout-confirm']:
    if token not in html: errors.append(f'v2.4 checkout UI missing: {token}')
for token in ['viacep.com.br','brasilapi.com.br','function isServiceArea','function lookup']:
    if token not in postal_text: errors.append(f'v2.4 postal service missing: {token}')
if 'brand.delivery' not in delivery_text and 'const delivery = brand.delivery' not in delivery_text: errors.append('v2.4 delivery boundary is not derived from brand config')
for token in ['getCheckoutSnapshot','handoffToWhatsApp','openCheckout']:
    if token not in main_text: errors.append(f'v2.4 application bridge missing: {token}')
for token in ['sessionStorage','savedAddressKey','delivery-validation','messageForWhatsApp','updateSavedAddressControl']:
    if token not in checkout_text: errors.append(f'v2.4 checkout behavior missing: {token}')
if 'https://viacep.com.br' not in html or 'https://brasilapi.com.br' not in html: errors.append('CSP does not allow the two CEP providers')
if not (ROOT/'docs/CHECKOUT.md').exists(): errors.append('Checkout technical documentation is missing')
if not (ROOT/'tools/checkout-behavior-check.js').exists(): errors.append('Checkout behavior regression tool is missing')

for patch in range(10):
    version = f"2.5.{patch}"
    if f"## {version} " not in changelog:
        errors.append(f"Changelog missing {version}")

# v2.5 reusable product architecture gates.
for rel in ['data/brand/brand.json','data/brand/content.json','data/brand/brand-config.js','data/brand/content-config.js','css/brand-theme.css','data/catalog-schema.js','js/feature-flags.js','js/brand-runtime.js','tools/brand-sync.py','tools/config-check.py','tools/brand-leak-check.py','docs/WHITE-LABEL.md','docs/COMPONENTS.md','docs/BRAND-ASSETS.md','assets/images/brand/forno-dona-rosa-logo.png','assets/images/brand/forno-dona-rosa-logo-720.webp']:
    if not (ROOT/rel).exists(): errors.append(f'v2.5 reusable asset missing: {rel}')
brand_json=(ROOT/'data/brand/brand.json').read_text(encoding='utf-8')
if '"storageNamespace": "forno"' not in brand_json: errors.append('v2.5 storage namespace missing')
for token in ['BRAND_CONFIG','storageNamespace','features']:
    if token not in (ROOT/'js/app-config.js').read_text(encoding='utf-8'): errors.append(f'v2.5 app config missing {token}')

for patch in range(10):
    version = f"2.6.{patch}"
    if f"## {version} " not in changelog:
        errors.append(f"Changelog missing {version}")

# v2.6 template-factory production-readiness gates.
for rel in ['schemas/brand.schema.json','schemas/content.schema.json','schemas/catalog.schema.json','presets/pizzeria/preset.json','presets/coffee-shop/preset.json','tools/create-brand.py','tools/apply-brand.py','tools/project-doctor.py','tools/template-factory-check.py','tools/docs-check.py','docs/README.md','docs/getting-started/GETTING-STARTED.md','docs/customization/CREATE-A-CLIENT.md','docs/customization/CONFIGURATION.md','docs/quality/TESTING.md','docs/troubleshooting/TROUBLESHOOTING.md','docs/releases/v2.6.9.md','package.json','.github/workflows/quality.yml']:
    if not (ROOT/rel).exists(): errors.append(f'v2.6 template-factory asset missing: {rel}')
if 'container-type:inline-size' not in (ROOT/'css/styles.css').read_text(encoding='utf-8').replace(' ',''):
    errors.append('v2.6 container-query resilience contract missing')
if '"quality"' not in (ROOT/'package.json').read_text(encoding='utf-8'):
    errors.append('v2.6 npm quality command missing')

for patch in range(10):
    version = f"2.7.{patch}"
    if f"## {version} " not in changelog:
        errors.append(f"Changelog missing {version}")

# v2.7 fast-purchase and reliability gates.
for rel in ['tools/conversion-flow-check.py','docs/releases/v2.7.9.md']:
    if not (ROOT/rel).exists(): errors.append(f'v2.7 conversion asset missing: {rel}')
if not (html.find('id="topo"') < html.find('id="como-pedir"') < html.find('id="cardapio"')):
    errors.append('v2.7 fast purchase page order missing')
if 'requestAnimationFrame(() => openCart(trigger))' not in (ROOT/'js/main.js').read_text(encoding='utf-8'):
    errors.append('v2.7 checkout recovery contract missing')
if 'Aguarde a validação do CEP antes de continuar.' not in (ROOT/'js/checkout.js').read_text(encoding='utf-8'):
    errors.append('v2.7 pending CEP protection missing')


for patch in range(10):
    version = f"2.9.{patch}"
    if f"## {version} " not in changelog:
        errors.append(f"Changelog missing {version}")


for patch in range(10):
    version = f"3.0.{patch}"
    if f"## {version} " not in changelog:
        errors.append(f"Changelog missing {version}")
for rel in ['tools/build-site.py','tools/website-architecture-check.py','tools/repository-naming-check.py','docs/releases/v3.0.9.md','data/catalog.json']:
    if not (ROOT/rel).exists(): errors.append(f'v3 website asset missing: {rel}')

# v2.9 mobile design refinement gates.
for rel in ['tools/responsive-design-check.py','docs/releases/v2.9.9.md']:
    if not (ROOT/rel).exists(): errors.append(f'v2.9 responsive design asset missing: {rel}')
styles=(ROOT/'css/styles.css').read_text(encoding='utf-8')
for token in ['--tap-target:3rem','@media(max-width:23rem)','@media(max-height:32rem) and (orientation:landscape)','grid-template-columns:minmax(7.2rem,34vw) minmax(0,1fr)']:
    if token not in styles: errors.append(f'v2.9 mobile design contract missing: {token}')

if errors:
    print('AUDIT FAILED')
    for e in errors: print('-',e)
    sys.exit(1)
print('AUDIT PASSED')
print(f'- Unique HTML IDs: {len(p.ids)}')
print(f'- Local references checked: {len(p.refs)}')
print('- Internal anchors: OK')
print('- target=_blank safety: OK')
print('- Unsafe DOM sinks in main.js/rosa.js: 0')
print('- CSP: present')
print('- Service worker same-origin + runtime limit: OK')
print('- JavaScript syntax: OK')
print('- Bag schema v3 + migrations: OK')
print('- Rosa hardening + confidence: OK')
print('- International filename migration: OK')
print('- Version sync: OK')
print('- Changelog 1.0.0–3.0.9 continuity: OK')
