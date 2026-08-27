# Quality Assurance

## Automated checks

Run:

```bash
python tools/audit.py
python tools/health-check.py
```

The checks validate local references, unique IDs, internal anchors, safe `_blank` links, prohibited DOM sinks, CSP presence, JavaScript syntax, service-worker boundaries, version synchronization, changelog completeness, catalog IDs, Bag schema migration, and Rosa session safeguards.

## Manual release matrix

Recommended viewport checks include 320×568, 390×844, 768×1024, 1366×768, and 1920×1080 plus portrait/landscape where relevant.

Manual flows should cover:

- Keyboard-only navigation.
- NVDA headings, landmarks, forms, Bag and Rosa.
- 200% and 400% zoom/reflow.
- Reduced motion and forced colors.
- Menu search/filtering and empty results.
- Bag migration, quantity changes, removal and WhatsApp output.
- Rosa suggestions, ambiguous input, session reset and contextual actions.
- PWA refresh/update behavior.

Never mark a manual check as passed unless it was actually executed.


## v1.8 regression gate
Run `python tools/regression-check.py` after `audit.py`. It covers semantic regressions that syntax checks cannot detect, including persisted bag limits, half-and-half product typing, CSP hash integrity, PWA cache ordering, modern-image availability, business-hours configuration, and full v1.8.x changelog coverage.


## v2.2 release focus

Static gates now cover sensory tags, the product-detail dialog, local last-order boundaries, Rosa product-card actions, 31 responsive product variants, mobile navigation priority, offline WhatsApp blocking, and the complete 2.2.0–2.2.9 changelog series. Manual NVDA, real-device touch, browser rendering, zoom and E2E testing remain required before claiming complete production verification.


## Rosa v2.3 behavior gate

`node tools/rosa-behavior-check.js` executes the actual local Rosa classifier in a controlled environment and validates representative Portuguese prompts for temporary preferences, product comparison, ambiguity, exact product resolution, destructive Bag intent and product-detail intent. It complements static gates; it does not replace manual NVDA, real-device touch, browser rendering, zoom or full E2E testing.

## v2.4 Local checkout verification

Run:

```bash
node tools/checkout-behavior-check.js
```

The suite checks CEP normalization, formatting, Serra/ES service-area matching, ViaCEP primary resolution, BrasilAPI fallback, invalid CEP handling and provider-failure behavior. Static regression gates additionally verify the checkout dialog, mobile reflow, privacy controls, structured WhatsApp handoff and all 2.4.x changelog entries.

Manual QA still required before production includes real NVDA navigation, physical mobile keyboards/autofill, provider outages, real Serra CEP samples, zoom/reflow at 200–400%, and WhatsApp handoff on Android/iOS.
