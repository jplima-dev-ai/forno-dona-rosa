from pathlib import Path
import re

path = Path("js/main.js")
text = path.read_text(encoding="utf-8")

def function_body(name, next_name):
    pattern = (
        rf"function\s+{re.escape(name)}\s*\([^)]*\)\s*\{{"
        rf"(.*?)"
        rf"function\s+{re.escape(next_name)}\s*\("
    )
    match = re.search(pattern, text, re.S)
    return match.group(1) if match else ""

render_cart = function_body("renderCart", "openCart")
open_cart = function_body("openCart", "closeCart")
save_cart = function_body("saveCart", "announceApp")
init_cart = function_body("initCart", "renderFinderResult")

checks = [
    ("main.js exists", path.exists()),
    ("summary renderer exists", "function renderCartSummary()" in text),
    ("summary updates cart count", 'const count = $("#cart-count");' in text),
    ("summary updates mobile bag", 'const mobileBar = $("#mobile-bag-bar");' in text),
    ("full render calls summary", "renderCartSummary();" in render_cart),
    ("openCart still full-renders", "renderCart();" in open_cart),
    ("saveCart still full-renders", "renderCart();" in save_cart),
    ("initCart uses summary-only render", "renderCartSummary();" in init_cart),
]

passed = 0
for label, ok in checks:
    print(("PASS" if ok else "FAIL") + ": " + label)
    passed += int(bool(ok))

print(f"CART STARTUP CHECK: {passed}/{len(checks)}")
raise SystemExit(0 if passed == len(checks) else 1)