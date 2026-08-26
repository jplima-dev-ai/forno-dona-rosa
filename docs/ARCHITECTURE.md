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

The persistent Bag is considered untrusted input when restored from `localStorage`. Product IDs are resolved against the current catalog, quantities are clamped, and prices are recalculated from canonical data. Rosa session history is bounded and stored only in `sessionStorage`.

## Progressive enhancement

The core page remains readable as semantic HTML. JavaScript enhances menu discovery, Bag operations, Rosa, sharing, and PWA behavior.
