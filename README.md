# Forno Dona Rosa — Accessible Premium Pizzeria Experience

[Versão em português](README-PT.md)

Forno Dona Rosa is a portfolio-grade front-end project for a Brazilian artisan pizzeria. It combines **premium art direction, accessibility-first engineering, responsive architecture, a local conversational assistant, PWA capabilities, defensive client-side state management, and WhatsApp ordering** without a front-end framework.

> The customer-facing website intentionally remains in Brazilian Portuguese because the fictional business operates in Brazil. The repository engineering, technical naming, and primary documentation are written in English for international reviewers.

## v2.6.9 — Template Factory & Production Readiness Edition

This release turns the v2.5 white-label foundation into a repeatable client-creation workflow. The repository now includes machine-readable configuration contracts, pizzeria and coffee-shop presets, a guided brand generator, capability-aware component behavior, a Project Doctor, documentation drift checks, and a one-command quality pipeline designed to run locally and in GitHub Actions.

The active reference implementation remains Forno Dona Rosa. Reuse is validated without flattening the brand into a generic template: client identity, theme, content and assets stay replaceable while the core keeps accessibility, responsive, checkout and state contracts. Start with [docs/README.md](docs/README.md) or [Create a new client](docs/customization/CREATE-A-CLIENT.md).

## Why this project exists

The goal is not to showcase a generic restaurant landing page. The repository demonstrates how a marketing experience can evolve into a maintainable web product while preserving accessibility, performance, security, and brand identity across many releases.

## Highlights

- Semantic HTML and keyboard-first interaction.
- WCAG 2.2 AA baseline with explicit NVDA considerations.
- Adaptive mobile-first layout with zoom/reflow support.
- Progressive Web App with controlled service-worker caching.
- Versioned persistent Bag state with migration and defensive normalization.
- **Rosa**, a local browser-based pizzeria host using intent classification, contextual responses, short session memory, and a curated knowledge base — no external AI API required.
- 30+ menu items across pizzas, desserts, and drinks.
- Search, filtering, favorites, recommendations, half-and-half pizzas, drink pairing, and a structured local delivery checkout before WhatsApp handoff.
- Content Security Policy, same-origin service-worker restrictions, safe DOM construction, and bounded user input.
- Automated repository audit and health checks.

## Repository structure

```text
forno-dona-rosa-v2.6.9/
├── assets/
│   ├── icons/
│   └── images/
│       └── brand/
├── css/
│   ├── brand-theme.css
│   └── styles.css
├── data/
│   ├── brand/
│   │   ├── brand.json
│   │   ├── content.json
│   │   ├── brand-config.js
│   │   └── content-config.js
│   ├── catalog-schema.js
│   ├── delivery-config.js
│   ├── menu.js
│   └── rosa-knowledge-base.js
├── docs/
│   ├── ACCESSIBILITY.md
│   ├── ARCHITECTURE.md
│   ├── CASE-STUDY.md
│   ├── CHECKOUT.md
│   ├── DESIGN-SYSTEM.md
│   ├── PERFORMANCE.md
│   ├── QA.md
│   ├── ROSA.md
│   ├── WHITE-LABEL.md
│   ├── COMPONENTS.md
│   └── BRAND-ASSETS.md
├── js/
│   ├── app-config.js
│   ├── app-meta.js
│   ├── brand-runtime.js
│   ├── feature-flags.js
│   ├── checkout.js
│   ├── main.js
│   ├── postal-code-service.js
│   └── rosa.js
├── schemas/
├── presets/
├── tools/
│   ├── create-brand.py
│   ├── project-doctor.py
│   ├── docs-check.py
│   ├── audit.py
│   ├── brand-sync.py
│   ├── config-check.py
│   ├── brand-leak-check.py
│   ├── checkout-behavior-check.js
│   ├── health-check.py
│   ├── regression-check.py
│   └── rosa-behavior-check.js
├── CHANGELOG.md
├── LICENSE
├── README.md
├── README-PT.md
├── SECURITY.md
├── index.html
├── manifest.webmanifest
├── robots.txt
├── service-worker.js
└── sitemap.xml
```

## Run locally

From the repository root:

```bash
python -m http.server 8000
```

Open `http://localhost:8000`.

## Quality gates

Run the static audit:

```bash
python tools/audit.py
```

Run the broader repository health check and high-value regression gate:

```bash
python tools/health-check.py
python tools/regression-check.py
```

These checks cover version synchronization, local asset references, JavaScript syntax, changelog completeness, Bag schema migration, Rosa session safeguards, catalog IDs, CSP presence, and service-worker boundaries. They do **not** replace manual NVDA, browser, visual, or real-device testing.

## Architecture at a glance

```text
app-meta.js       → release metadata
brand.json        → canonical client/brand source
brand-config.js   → generated runtime brand configuration
app-config.js     → compatibility adapter for reusable application code
menu.js             → product catalog and pricing rules
delivery-config.js  → canonical local delivery area and checkout limits
rosa-knowledge-base.js → local conversational knowledge
postal-code-service.js → ViaCEP lookup with BrasilAPI fallback
main.js             → navigation, menu, Bag, PWA and canonical order snapshot
checkout.js         → customer/address/review/WhatsApp handoff
rosa.js             → conversational UI and local intent engine
service-worker.js   → offline/runtime cache strategy
```

## Accessibility

Accessibility is treated as a product requirement rather than a post-processing step. The project uses semantic landmarks, visible focus, native controls, accessible dialogs, bounded live regions, reduced-motion support, forced-colors support, responsive reflow, and keyboard-operable flows. See [docs/ACCESSIBILITY.md](docs/ACCESSIBILITY.md).

## Security model

This is a static client-side project, but it still applies defensive engineering: no unsafe HTML rendering for user-controlled text, normalized persisted state, bounded inputs, same-origin service-worker caching, CSP, safe external links, and canonical price recalculation from the catalog. See [SECURITY.md](SECURITY.md).

## Rosa: local conversational host

Rosa is intentionally **not presented as a cloud LLM**. On GitHub Pages she runs entirely in the browser using deterministic intents, confidence handling, contextual actions, a local menu knowledge base, and short-lived session memory. This keeps the public demo functional without exposing API keys or sending chat text to an AI service.

## Portfolio notes

For a concise engineering narrative, see [docs/CASE-STUDY.md](docs/CASE-STUDY.md). Release history is available in [CHANGELOG.md](CHANGELOG.md).

## License

MIT. See [LICENSE](LICENSE).
