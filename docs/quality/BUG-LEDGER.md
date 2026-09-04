# Bug ledger

This ledger records high-value defects that changed architecture or regression coverage. It is not a dump of every edit.

## ROSA-001 — Substring comparison false positive
- Found: v2.3.x development.
- Symptom: a phrase containing `recomendou` could be interpreted as comparison because it contains `ou`.
- Root cause: substring matching where token-level intent evidence was required.
- Fix: comparison requires an isolated comparison token plus two recognized products.
- Prevention: `tools/rosa-behavior-check.js`.

## BAG-001 — Persisted quantity exceeded global limit
- Found: v1.8.x audit.
- Symptom: manipulated persisted state could exceed the allowed total Bag quantity during hydration.
- Root cause: per-line normalization without a cumulative invariant.
- Fix: cumulative sanitization and canonical state reconstruction.
- Prevention: regression checks around persisted Bag state.

## TEMPLATE-001 — Feature flags existed without complete presentation isolation
- Found: v2.6.0 forensic audit.
- Symptom: configuration declared optional capabilities, but several UI surfaces could remain visible when disabled.
- Root cause: flags were exposed as document data attributes without a complete capability-aware presentation contract.
- Fix: capability-aware selectors plus runtime guards for critical behavior.
- Prevention: Project Doctor/template-factory checks and documented feature contract.

## CHECKOUT-002 — Stale address after CEP edit
- Found: v2.7.0 forensic audit.
- Symptom: after a successful lookup, partially editing the CEP could leave the previous street/neighborhood visible while the new CEP was incomplete.
- Root cause: the input handler reset lookup state but did not clear derived address fields or invalidate the previous lookup token.
- Fix: invalidate the token, clear derived address fields and hide validation feedback until a new eight-digit CEP is available.
- Prevention: `tools/conversion-flow-check.py` and regression checks.

## FOCUS-001 — Rosa return target inside a closed Bag dialog
- Found: v2.7.0 forensic audit.
- Symptom: opening Rosa from the Bag could preserve the clicked Bag button as the return-focus target even though the Bag dialog was closed.
- Root cause: focus ownership was captured before switching between modal contexts.
- Fix: Rosa now receives the visible header Bag trigger as its return-focus target.
- Prevention: conversion-flow regression check.

## TOOLING-002 — Brand sync depended on header-logo attribute order
- Found: v2.7.x implementation.
- Symptom: semantically valid HTML reserialization caused `brand-sync.py` to fail with “Could not synchronize header logo.”
- Root cause: a rigid regular expression assumed one exact attribute order.
- Fix: locate the image by `data-brand-logo` and replace only its `src` attribute.
- Prevention: conversion-flow regression check.

## A11Y-409-001 — Adaptive Commerce herdava paleta de texto incompatível
- Found: v4.0.9 release validation, 2026-09-03.
- Symptom: quatro violações de contraste WCAG AA na home, repetidas em seis viewports, totalizando 12 failures Playwright.
- Root cause: card com superfície clara herdava a paleta light-on-dark do storefront.
- Fix: foreground explícito escuro para título/copy/kicker e ghost action em `css/adaptive-commerce-v4.css`.
- Prevention: Axe serious/critical + contratos v4 em desktop, 320, 390, 430, tablet e landscape.
- Verification: reexecução real em 2026-09-04 terminou com **249 passed, 3 skipped, 0 failed**.
