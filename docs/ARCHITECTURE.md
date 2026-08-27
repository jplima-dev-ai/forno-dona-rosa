# Architecture

## Goal

Keep a premium static landing page understandable, maintainable, and deployable on GitHub Pages while supporting a rich client-side ordering experience.

## Layers

- `js/app-meta.js` — release/version metadata.
- `js/app-config.js` — business identity, contact information, operating hours, and public URLs.
- `data/menu.js` — canonical product catalog and pricing rules.
- `data/rosa-knowledge-base.js` — Rosa quick actions, local knowledge, and conversational support data.
- `js/main.js` — navigation, menu rendering, search, favorites, Bag state, ordering, sharing, business hours, and PWA registration.
- `js/rosa.js` — Rosa dialog, input normalization, intent detection, session memory, contextual suggestions, and safe local actions.
- `service-worker.js` — same-origin offline/runtime caching.

## State boundaries

The persistent Bag is considered untrusted input when restored from `localStorage`. Product IDs are resolved against the current catalog, quantities are clamped, and prices are recalculated from canonical data. Rosa session history is bounded and stored only in `sessionStorage`. The optional last-order snapshot is stored in `localStorage` only after the customer initiates WhatsApp confirmation, expires after 45 days, and is re-sanitized against the current catalog before reuse.

## Progressive enhancement

The core page remains readable as semantic HTML. JavaScript enhances sensory menu discovery, product-detail dialogs, Bag operations, returning-order recovery, Rosa product actions, sharing, and PWA behavior. Mobile fixed navigation yields to the live Bag bar when the Bag becomes non-empty.

## Local checkout layer (v2.4)

The checkout remains browser-side and is deliberately separated from the Bag engine:

- `data/delivery-config.js` owns the canonical Serra/ES delivery boundary and field limits.
- `js/postal-code-service.js` normalizes CEP input and resolves ViaCEP first, then BrasilAPI CEP v1.
- `js/main.js` exposes a read-only canonical Bag snapshot and the bounded WhatsApp handoff bridge.
- `js/checkout.js` owns customer fields, address validation states, review UI, session privacy and opt-in saved-address behavior.
- `js/rosa.js` may open the checkout but does not receive or persist customer address fields in Rosa's conversational session.

This separation prevents customer delivery data from being mixed into Rosa's chat history or trusted Bag storage.

## v2.5 reusable product boundary

The reference client is now isolated behind `data/brand/brand.json`, generated brand runtime config, `css/brand-theme.css`, `data/catalog-schema.js` and feature flags. Reusable runtime modules consume configuration through compatibility adapters rather than hardcoded client identity. Static SEO/PWA metadata is synchronized with `tools/brand-sync.py` so GitHub Pages remains a zero-backend deployment target.
