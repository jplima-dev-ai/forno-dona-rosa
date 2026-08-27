#!/usr/bin/env python3
"""High-value static regression checks for the Forno Dona Rosa portfolio build."""
from pathlib import Path
import base64, hashlib, json, re, subprocess, sys

ROOT = Path(__file__).resolve().parents[1]
VERSION = "1.9.9"
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
check("Rosa tolerant product matching", "function findProduct" in rosa and "compactName" in rosa)
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

# Business hours remain canonical.
for day in range(7):
    expected_open = "16:00" if day in (0, 6) else "18:00"
    pattern = rf'{day}: Object\.freeze\(\{{ open: "{expected_open}", close: "24:00"'
    check(f"Business hours day {day}", bool(re.search(pattern, config_text)))

# Version and changelog gates.
check("HTML version", f'content="{VERSION}" name="x-project-version"' in html)
check("SW version", f'const VERSION = "{VERSION}"' in sw)
for patch in range(10):
    check(f"Changelog 1.9.{patch}", f"## 1.9.{patch} " in changelog)

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

# Syntax.
for path in ["js/app-meta.js", "js/app-config.js", "data/menu.js", "data/rosa-knowledge-base.js", "js/main.js", "js/rosa.js", "service-worker.js"]:
    result = subprocess.run(["node", "--check", str(ROOT / path)], capture_output=True, text=True)
    check(f"Syntax {path}", result.returncode == 0, result.stderr.strip())

print(f"Forno Dona Rosa — Regression Check v{VERSION}")
for name, detail in passes:
    print(f"PASS  {name}" + (f" — {detail}" if detail else ""))
for name, detail in failures:
    print(f"FAIL  {name}" + (f" — {detail}" if detail else ""))
print(f"\n{len(passes)}/{len(passes)+len(failures)} checks passed")
if failures:
    sys.exit(1)
