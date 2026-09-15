from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
checkout = (ROOT / "js" / "checkout.js").read_text(encoding="utf-8")

checks = [
    ("checkout script exists", (ROOT / "js" / "checkout.js").exists()),
    ("checkout exposes public API", "window.FORNO_CHECKOUT=Object.freeze({open,close,lookupPostalCode,readForm,messageForWhatsApp,validateSchedule});" in checkout),
    ("checkout tracks one-time initialization", "let initialized = false;" in checkout),
    ("checkout init is idempotent", "if(initialized)return true;" in checkout),
    ("checkout open initializes on demand", 'function open(trigger) { if(!init())return false;' in checkout),
    ("checkout init no longer runs on DOMContentLoaded", 'document.addEventListener("DOMContentLoaded",init)' not in checkout),
    ("checkout init preserves dialog guard", 'const dialog=field("checkout-dialog");if(!dialog)return false;' in checkout),
    ("checkout init reports readiness", 'field("checkout-confirm").disabled=!navigator.onLine;updateSavedAddressControl();\n    return true;' in checkout),
]

failed = 0
for label, ok in checks:
    print(f"{'PASS' if ok else 'FAIL'}: {label}")
    failed += 0 if ok else 1

print(f"\ncheckout startup: {len(checks)-failed}/{len(checks)} PASS")
raise SystemExit(1 if failed else 0)
