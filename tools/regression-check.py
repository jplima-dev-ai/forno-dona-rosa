#!/usr/bin/env python3
"""High-value static regression checks for the Forno Dona Rosa portfolio build."""
from pathlib import Path
import base64, hashlib, json, re, subprocess, sys

ROOT = Path(__file__).resolve().parents[1]
VERSION = json.loads((ROOT / "package.json").read_text(encoding="utf-8"))["version"]
failures = []
passes = []

def check(name, condition, detail=""):
    (passes if condition else failures).append((name, detail))

html = (ROOT / "index.html").read_text(encoding="utf-8")
main = (ROOT / "js/main.js").read_text(encoding="utf-8")
rosa = (ROOT / "js/rosa.js").read_text(encoding="utf-8")
sw = (ROOT / "service-worker.js").read_text(encoding="utf-8")
menu_text = (ROOT / "data/menu.js").read_text(encoding="utf-8")
config_text = (ROOT / "js/app-config.js").read_text(encoding="utf-8")
brand_data = json.loads((ROOT / "data/brand/brand.json").read_text(encoding="utf-8"))
checkout = (ROOT / "js/checkout.js").read_text(encoding="utf-8")
postal = (ROOT / "js/postal-code-service.js").read_text(encoding="utf-8")
delivery = (ROOT / "data/delivery-config.js").read_text(encoding="utf-8")
changelog = (ROOT / "CHANGELOG.md").read_text(encoding="utf-8")

# Security regression: CSP inline JSON-LD hash must remain accurate.
script = re.search(r'<script type="application/ld\+json">(.*?)</script>', html, re.S)
hash_decl = re.search(r"script-src 'self' 'sha256-([^']+)'", html)
if script and hash_decl:
    digest = base64.b64encode(hashlib.sha256(script.group(1).encode()).digest()).decode()
    check("CSP JSON-LD hash", digest == hash_decl.group(1))
else:
    check("CSP JSON-LD hash", False, "JSON-LD or hash declaration missing")

# Bag hardening regressions.
check("Bag cumulative sanitizer", "function sanitizeBag" in main and "MAX_BAG_QTY - totalQty" in main)
check("Half-and-half rejects drinks", 'candidate2?.type === "pizza"' in main)
check("Bag item IDs constrained", "^[A-Za-z0-9_-]{1,80}$" in main)
check("Bag action focus recovery", "restoreCartActionFocus" in main)
check("Failed order add preserves form", "if (!addCart(item))" in main)
check("Global interaction live status", 'id="app-status"' in html and "announceApp" in main)
check("Rosa add operation verifies result", "const added = window.FORNO_APP.addProduct" in rosa and "return false" in main)
check("Rosa tolerant product matching", "function findProducts" in rosa and "productAliases" in rosa)
check("Customer copy grammar", "do seu sacola" not in html.lower())

# PWA/cache regressions.
check("Versioned cache lookup", "async function matchVersioned" in sw)
check("Warm assets resilient", "Promise.allSettled(WARM_ASSETS" in sw)
check("Same-origin fetch gate", "url.origin !== self.location.origin" in sw)

# Performance assets.
for name in ["dona-rosa-hero-pizza", "cheese-pull-pizza", "wood-fired-oven-pizza", "nutella-strawberry-pizza"]:
    check(f"WebP asset {name}", (ROOT / f"assets/images/{name}.webp").exists())
check("Hero fetch priority", 'fetchpriority="high"' in html)
check("Menu uses modern images", '.webp"' in menu_text and '.jpg"' not in menu_text)
check("All catalog products have images", menu_text.count('image:"assets/images/products/') == 31)
derived_suffixes=("-384","-480","-800","-1200","-social")
check("All product image files exist", len([p for p in (ROOT / "assets/images/products").glob("*.webp") if not p.stem.endswith(derived_suffixes)]) == 31)

# Business hours remain canonical in brand source.
for day in range(7):
    expected_open = "16:00" if day in (0, 6) else "18:00"
    item = brand_data.get("hours", {}).get(str(day), {})
    check(f"Business hours day {day}", item.get("open") == expected_open and item.get("close") == "24:00")

# Version and changelog gates.
check("HTML version", f'content="{VERSION}" name="x-project-version"' in html)
check("SW version", f'const VERSION = "{VERSION}"' in sw)
for patch in range(10):
    check(f"Changelog 1.9.{patch}", f"## 1.9.{patch} " in changelog)
for patch in range(1,10):
    check(f"Changelog 2.0.{patch}", f"## 2.0.{patch} " in changelog)
for patch in range(10):
    check(f"Changelog 2.1.{patch}", f"## 2.1.{patch} " in changelog)

# Responsive checkout regressions.
css = (ROOT / "css/styles.css").read_text(encoding="utf-8")
check("Mobile bag review bar", 'id="mobile-bag-bar"' in html and "mobile-bag-bar" in css)
check("Bag bar reflects live totals", 'mobile-bag-total' in main and 'mobile-bag-count' in main)
check("Optional order fields progressive", '<details class="order-extras">' in html)
check("Pizza card personalization path", 'data-customize' in main and 'scrollIntoView' in main)
check("Mobile menu single column", '@media(max-width:48rem)' in css and '.menu-grid{grid-template-columns:1fr}' in css)
check("Mobile bag bottom sheet", '.cart-dialog{width:100%;max-width:none;height:min(92dvh,52rem)' in css)
check("Compact viewport fallback", '@media(max-width:22rem)' in css)
check("Low-height landscape fallback", '@media(max-height:30rem) and (orientation:landscape)' in css)
check("Mobile desire scroller", 'class="desire-scroll"' in html and 'data-desire="queijo"' in html)
check("Desire interaction", "data-desire" in main and "renderMenu(lastMenuFilter)" in main)
check("Bag product thumbnails", 'className: "cart-item__thumb"' in main)
check("Mobile gallery deprioritized", '@media(max-width:48rem)' in css and '.gallery{display:none}' in css)


# Repository hygiene regressions.
for obsolete in ['assets/images/signature-pizza.svg','assets/images/og-cover.png','tools/generate.py']:
    check(f'Obsolete removed {obsolete}', not (ROOT / obsolete).exists())
product_names=[p.name for p in (ROOT/'assets/images/products').glob('*.webp')]
pt_tokens=['agua','gas','lata','suco','laranja','mucarela','calabresa','portuguesa','frango','toscana','forno','casa','trufa','picante','vegana','chocolate-belga','banana-doce-leite','romeu-julieta']
check('English product image filenames', all(not any(t in name.lower() for t in pt_tokens) for name in product_names))
check('Hero primary CTA opens visual menu', 'href="menu/"' in html and '>Pedir agora</a>' in html)

# v2.2 conversion / mobile regressions.
for patch in range(10):
    check(f"Changelog 2.2.{patch}", f"## 2.2.{patch} " in changelog)
check("Sensory decision tags", "sensoryLabels" in main and "sensory-tags" in html)
check("Product detail dialog semantics", '<dialog' in html and 'id="product-dialog"' in html and 'aria-labelledby="product-dialog-title"' in html)
check("Beverage detail hides pizza customization", 'customize.hidden = product.type === "bebida"' in main)
check("Quick add exposes price", 'Adicionar média · ${money(quickPrice)}' in main)
check("Bag confirmation surface", 'id="bag-feedback"' in html and 'showBagFeedback' in main)
handoff_block = main.split("function handoffToWhatsApp",1)[1].split("window.FORNO_APP",1)[0] if "function handoffToWhatsApp" in main else ""
check("Last order only saved at WhatsApp handoff", main.count("saveLastOrder();") == 1 and "saveLastOrder();" in handoff_block and "window.open" in handoff_block and handoff_block.index("saveLastOrder();") < handoff_block.index("window.open"))
check("Last order canonical sanitation", 'const restored = sanitizeBag(stored.items)' in main)
check("Rosa actionable recommendation cards", 'data-rosa-add' in rosa and 'productIds' in rosa)
check("Mobile navigation yields to Bag", '.has-mobile-bag .mobile-nav{display:none}' in css)
check("Offline blocks WhatsApp send", 'send.disabled = true' in main and 'WhatsApp exige conexão' in main)
check("31 small product variants", len(list((ROOT / 'assets/images/products').glob('*-384.webp'))) == 31)
check("Mobile hero source", (ROOT / 'assets/images/dona-rosa-hero-pizza-640.webp').exists() and 'media="(max-width: 48rem)" srcset="assets/images/dona-rosa-hero-pizza-640.webp"' in html)
check("Favorite control available in product detail", 'id="product-dialog-favorite"' in html and 'product-dialog-favorite' in main)
check("Nothing sent automatically disclosure", 'Nada é enviado automaticamente.' in html)


# v2.3 Rosa finalization regressions.
for patch in range(10):
    check(f"Changelog 2.3.{patch}", f"## 2.3.{patch} " in changelog)
check("Rosa session v4", "assistant-session-v4" in rosa and "SESSION_SCHEMA = 4" in rosa)
check("Rosa temporary preference memory", "extractPreferences" in rosa and "state.preferences" in rosa)
check("Rosa ordinal multi-turn references", "resolveOrdinalReference" in rosa and "state.lastProductIds" in rosa)
check("Rosa product comparison", "findComparisonProducts" in rosa and "compareProducts" in rosa)
check("Rosa ambiguous add asks first", "ambiguousChoice" in rosa and 'intent: "disambiguate"' in rosa)
check("Rosa clear Bag requires confirmation", 'state.pendingAction = { type: "clear-bag" }' in rosa and 'Você confirma?' in rosa)
check("Rosa safe clear Bag bridge", "clearBag()" in main and "saveCart();" in main)
check("Rosa actionable details", "data-rosa-details" in rosa and "openProduct" in rosa)
check("Rosa contextual quick actions", "quickActionModel" in rosa and "renderQuickActions" in rosa)
check("Rosa local privacy disclosure", "rosa-privacy-note" in html and "funciona localmente" in html.lower())
check("Rosa input counter", 'id="rosa-input-count"' in html and "updateInputCount" in rosa)
check("Rosa mobile full-screen", '.rosa-dialog{width:100%;height:min(100dvh,100%)' in css)
check("Rosa docs", (ROOT / "docs/ROSA.md").exists())
check("Rosa behavior regression tool", (ROOT / "tools/rosa-behavior-check.js").exists())

behavior_result = subprocess.run(['node', str(ROOT / 'tools/rosa-behavior-check.js')], capture_output=True, text=True, encoding="utf-8", errors="replace")
check('Rosa executable behavior suite', behavior_result.returncode == 0, behavior_result.stdout.strip().splitlines()[-1] if behavior_result.stdout.strip() else behavior_result.stderr.strip())


# v2.4 local checkout regressions.
for patch in range(10):
    check(f"Changelog 2.4.{patch}", f"## 2.4.{patch} " in changelog)
check("Checkout replaces direct Bag WhatsApp", 'id="send-cart"' in html and 'Escolher entrega ou retirada' in html and 'FORNO_CHECKOUT?.open' in main)
check("Checkout dialog semantics", '<dialog' in html and 'id="checkout-dialog"' in html and 'aria-labelledby="checkout-dialog-title"' in html)
check("Explicit Serra delivery copy", 'Entrega disponível somente em Serra — ES' in html)
check("ViaCEP primary lookup", 'https://viacep.com.br/ws/${cep}/json/' in postal)
check("BrasilAPI fallback lookup", 'https://brasilapi.com.br/api/cep/v1/${cep}' in postal)
check("Brand-derived delivery config", 'const delivery = brand.delivery' in delivery and 'serviceAreaLabel' in delivery)
check("Provider city/state service validation", 'isServiceArea' in postal and 'addressMode = "blocked"' in checkout)
check("Manual lookup failure preserves checkout", 'addressMode = "manual"' in checkout and 'atendimento confirmará' in checkout)
check("Session-only default checkout data", 'sessionStorage' in checkout and 'checkout-remember' in html)
check("Remember address is opt-in", 'id="checkout-remember" type="checkbox"' in html)
check("Saved address can be forgotten", 'id="checkout-forget-address"' in html and 'safeRemoveLocal(savedKey)' in checkout)
check("No-number option", 'id="checkout-no-number"' in html and 'S/N' in checkout)
check("Review before WhatsApp", 'id="checkout-review-step"' in html and 'Abrir WhatsApp com meu pedido' in html)
check("WhatsApp address payload", 'CLIENTE' in checkout and 'ENTREGA' in checkout and 'PEDIDO' in checkout)
check("No automatic send disclosure", 'Você ainda revisa e toca em enviar; nada é enviado automaticamente.' in html)
check("Checkout external CSP allowlist", 'https://viacep.com.br https://brasilapi.com.br' in html)
check("Checkout mobile fullscreen", '.checkout-dialog{width:100%;height:100dvh' in css)
check("Checkout touch target sizing", '.checkout-actions .btn,.checkout-review__actions .btn' in css and 'min-height:3.35rem' in css)
check("Rosa guided ordering", 'me ajude passo a passo' in rosa and 'openCheckout' in rosa)
check("Checkout technical docs", (ROOT / 'docs/CHECKOUT.md').exists())
check("Checkout behavior tool", (ROOT / 'tools/checkout-behavior-check.js').exists())
checkout_behavior = subprocess.run(['node', str(ROOT / 'tools/checkout-behavior-check.js')], capture_output=True, text=True, encoding="utf-8", errors="replace")
check('Checkout executable behavior suite', checkout_behavior.returncode == 0, checkout_behavior.stdout.strip().splitlines()[-1] if checkout_behavior.stdout.strip() else checkout_behavior.stderr.strip())

# v2.5 reusable product architecture regressions.
for patch in range(10):
    check(f"Changelog 2.5.{patch}", f"## 2.5.{patch} " in changelog)
check("Canonical brand source", (ROOT/'data/brand/brand.json').exists() and (ROOT/'data/brand/content.json').exists())
check("Premium logo in brand folder", (ROOT/'assets/images/brand/forno-dona-rosa-logo.png').exists() and 'data-brand-logo' in html)
check("Runtime brand adapter", 'BRAND_CONFIG' in (ROOT/'js/app-config.js').read_text(encoding='utf-8'))
check("Brand storage namespace", 'storageNamespace' in main and 'assistant-session-v4' in rosa)
check("Feature capability flags", 'APP_FEATURES' in (ROOT/'js/feature-flags.js').read_text(encoding='utf-8'))
check("Catalog schema", (ROOT/'data/catalog-schema.js').exists())
check("White-label tooling", all((ROOT/p).exists() for p in ['tools/brand-sync.py','tools/config-check.py','tools/brand-leak-check.py']))
check("White-label documentation", all((ROOT/p).exists() for p in ['docs/WHITE-LABEL.md','docs/COMPONENTS.md','docs/BRAND-ASSETS.md']))
config_result=subprocess.run([sys.executable,str(ROOT/'tools/config-check.py')],capture_output=True,text=True,encoding="utf-8",errors="replace")
check("Executable brand config check", config_result.returncode==0, config_result.stdout.strip().splitlines()[0] if config_result.stdout.strip() else config_result.stderr.strip())
leak_result=subprocess.run([sys.executable,str(ROOT/'tools/brand-leak-check.py')],capture_output=True,text=True,encoding="utf-8",errors="replace")
check("Executable brand leak check", leak_result.returncode==0, leak_result.stdout.strip().splitlines()[0] if leak_result.stdout.strip() else leak_result.stderr.strip())


# v2.6 template factory regressions.
for patch in range(10):
    check(f"Changelog 2.6.{patch}", f"## 2.6.{patch} " in changelog)
check("Machine-readable schemas", all((ROOT/p).exists() for p in ["schemas/brand.schema.json","schemas/content.schema.json","schemas/catalog.schema.json"]))
check("Client generator tools", (ROOT/"tools/create-brand.py").exists() and (ROOT/"tools/apply-brand.py").exists())
check("Pizzeria and coffee presets", (ROOT/"presets/pizzeria/preset.json").exists() and (ROOT/"presets/coffee-shop/preset.json").exists())
check("Feature flag presentation isolation", 'data-feature-assistant="off"' in css and 'data-feature-favorites="off"' in css and 'data-feature-product-search="off"' in css)
check("Container query contract", 'container-type:inline-size' in css.replace(' ',''))
check("Project doctor tool", (ROOT/"tools/project-doctor.py").exists())
check("Documentation drift tool", (ROOT/"tools/docs-check.py").exists())
check("Template factory executable test", (ROOT/"tools/template-factory-check.py").exists())
check("One-command quality script", '"quality"' in (ROOT/"package.json").read_text(encoding="utf-8"))
check("GitHub quality workflow", (ROOT/".github/workflows/quality.yml").exists())

# v2.7 fast-purchase and reliability regressions.
for patch in range(10):
    check(f"Changelog 2.7.{patch}", f"## 2.7.{patch} " in changelog)
check("Fast purchase route is first", html.find('id="topo"') < html.find('id="como-pedir"') < html.find('id="cardapio"') < html.find('id="ritual"'))
check("Hero decision hierarchy", 'Pedir agora' in html and 'Preciso de ajuda para escolher' in html and 'hero__actions' in html)
check("Reduced primary navigation", '<a href=" #never">' not in html and '<a href=" #never">' not in html and 'href="menu/">Cardápio</a>' in html and 'href="order/">Pedir</a>' in html)
check("Progressive decision help", '<details class="menu-help"><summary>Quero ajuda para decidir</summary>' in html)
check("Product cards avoid utility overload", 'body.append(actions);' in main and 'body.append(actions, utility);' not in main)
check("Product detail owns favorite and share", 'product-dialog-favorite' in html and 'product-dialog-share' in html and 'dataFavorite' not in main)
check("Bag checkout failure recovers", 'requestAnimationFrame(() => openCart(trigger))' in main)
check("Rosa Bag focus returns visibly", 'const returnTarget = $("#open-cart") || document.activeElement;' in main)
check("Checkout clears stale CEP", '++lookupToken;' in checkout and 'hideDeliveryState();' in checkout)
check("Checkout blocks pending CEP", 'Aguarde a validação do CEP antes de continuar.' in checkout)
check("Checkout review announces context via focus", '(isReview ? field("checkout-dialog-title") : field("checkout-name"))?.focus();' in checkout)
check("Stored checkout data sanitized before render", '"checkout-name": clean(data.name' in checkout)
check("Brand sync logo matcher tolerates attribute order", 'logo_match = re.search' in (ROOT/'tools/brand-sync.py').read_text(encoding='utf-8'))
check("Conversion flow regression tool", (ROOT/'tools/conversion-flow-check.py').exists())
conversion = subprocess.run([sys.executable, str(ROOT/'tools/conversion-flow-check.py')], capture_output=True, text=True, encoding='utf-8', errors='replace')
check("Executable conversion flow suite", conversion.returncode == 0, conversion.stdout.strip().splitlines()[-1] if conversion.stdout.strip() else conversion.stderr.strip())

# Syntax.
for path in ["js/app-meta.js", "data/brand/brand-config.js", "data/brand/content-config.js", "js/app-config.js", "js/feature-flags.js", "data/catalog-schema.js", "js/brand-runtime.js", "data/delivery-config.js", "data/menu.js", "data/rosa-knowledge-base.js", "js/postal-code-service.js", "js/main.js", "js/checkout.js", "js/rosa.js", "service-worker.js"]:
    result = subprocess.run(["node", "--check", str(ROOT / path)], capture_output=True, text=True, encoding="utf-8", errors="replace")
    check(f"Syntax {path}", result.returncode == 0, result.stderr.strip())

print(f"Forno Dona Rosa — Reusable Product Regression Check v{VERSION}")
for name, detail in passes:
    print(f"PASS  {name}" + (f" — {detail}" if detail else ""))
for name, detail in failures:
    print(f"FAIL  {name}" + (f" — {detail}" if detail else ""))
print(f"\n{len(passes)}/{len(passes)+len(failures)} checks passed")
if failures:
    sys.exit(1)
