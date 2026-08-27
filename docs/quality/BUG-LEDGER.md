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
