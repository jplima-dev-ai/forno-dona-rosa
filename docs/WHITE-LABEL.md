# White-label adaptation guide

Forno Dona Rosa remains the reference implementation, but v2.5 separates client identity from reusable application behavior.

## Source of truth

Edit these files first:

- `data/brand/brand.json` — identity, logo, contacts, location, delivery, assistant, feature flags, SEO and opening hours.
- `data/brand/content.json` — client-facing hero and checkout microcopy.
- `css/brand-theme.css` — brand colors and visual tokens.
- `data/menu.js` — catalog data for the current business.
- `assets/images/brand/` — logo assets for the client.

Then run:

```bash
python tools/brand-sync.py
python tools/config-check.py
python tools/brand-leak-check.py
python tools/audit.py
python tools/health-check.py
python tools/regression-check.py
```

`brand-sync.py` regenerates runtime brand configuration and synchronizes static SEO/PWA metadata. The site remains deployable as plain static files on GitHub Pages.

## What belongs to the reusable core

- Bag persistence and canonical price recalculation
- Favorites and last-order flows
- Catalog search/discovery
- Product dialogs
- Checkout orchestration
- Postal-code lookup abstraction
- Local assistant engine
- PWA/service-worker behavior
- Accessibility and responsive interaction contracts

## What belongs to the client brand

- Name and logo
- Contact channels
- Address and delivery boundary
- Business hours
- SEO metadata
- Assistant identity/avatar
- Theme tokens
- Hero/content copy
- Catalog and product imagery

## Storage isolation

`brand.storageNamespace` namespaces Bag, favorites, last order, checkout and assistant session data. Give every deployed client a stable, unique slug. Changing the namespace intentionally creates a clean browser state.

## Feature flags

`brand.json` can enable or disable major capabilities without deleting implementation code. Current supported flags include assistant, favorites, reorder, checkout, postal-code lookup, PWA, product search and half-and-half support.

## Adapting beyond pizza

v2.5 is strongest for local food commerce. `data/catalog-schema.js` documents product groups and modifier capabilities so future presets can introduce burgers, cafés, desserts or other local-commerce catalogs without embedding every rule in the Bag UI. A non-food vertical may still need a dedicated catalog/checkout preset rather than simple copy replacement.

## Accessibility contract

Do not remove visible labels, focus return, keyboard actions, live-region status, native dialog semantics or reduced-motion/forced-colors handling when branding a new client. See `docs/ACCESSIBILITY.md` and `docs/COMPONENTS.md`.
