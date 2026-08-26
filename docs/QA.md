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
