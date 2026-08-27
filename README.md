# Forno Dona Rosa — Accessible Premium Pizzeria Experience

[Versão em português](README-PT.md)

Forno Dona Rosa is a portfolio-grade front-end project for a Brazilian artisan pizzeria. It combines **premium art direction, accessibility-first engineering, responsive architecture, a local conversational assistant, PWA capabilities, defensive client-side state management, and WhatsApp ordering** without a front-end framework.

> The customer-facing website intentionally remains in Brazilian Portuguese because the fictional business operates in Brazil. The repository engineering, technical naming, and primary documentation are written in English for international reviewers.

## v2.1.9 — Repository Refinement Edition

### 2.0 visual-commerce focus

- Mobile-first hierarchy for a customer base expected to be overwhelmingly mobile.
- Product imagery for every pizza and beverage.
- Compact image-led menu cards and touch-first “choose by desire” discovery.
- Product thumbnails in the Bag with decorative images to avoid screen-reader repetition.
- Performance-aware local WebP assets and lazy loading below the fold.

This release focuses exclusively on responsive resilience, bug fixes and a shorter purchase path: simplified menu actions, progressive optional fields and a mobile bag review bar.

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
- Search, filtering, favorites, recommendations, half-and-half pizzas, drink pairing, and structured WhatsApp checkout.
- Content Security Policy, same-origin service-worker restrictions, safe DOM construction, and bounded user input.
- Automated repository audit and health checks.

## Repository structure

```text
forno-dona-rosa-v2.1.9/
├── assets/
│   ├── icons/
│   └── images/
├── css/
│   └── styles.css
├── data/
│   ├── menu.js
│   └── rosa-knowledge-base.js
├── docs/
│   ├── ACCESSIBILITY.md
│   ├── ARCHITECTURE.md
│   ├── CASE-STUDY.md
│   ├── DESIGN-SYSTEM.md
│   ├── PERFORMANCE.md
│   └── QA.md
├── js/
│   ├── app-config.js
│   ├── app-meta.js
│   ├── main.js
│   └── rosa.js
├── tools/
│   ├── audit.py
│   └── health-check.py
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

Run the broader repository health check:

```bash
python tools/health-check.py
```

These checks cover version synchronization, local asset references, JavaScript syntax, changelog completeness, Bag schema migration, Rosa session safeguards, catalog IDs, CSP presence, and service-worker boundaries. They do **not** replace manual NVDA, browser, visual, or real-device testing.

## Architecture at a glance

```text
app-meta.js       → release metadata
app-config.js     → business configuration
menu.js           → product catalog and pricing rules
rosa-knowledge-base.js → local conversational knowledge
main.js           → navigation, menu, Bag, PWA and ordering
rosa.js           → conversational UI and local intent engine
service-worker.js → offline/runtime cache strategy
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


## v2.1.9 repository refinement
The 1.8.x cycle focused on bug fixing and quality rather than feature expansion: persisted bag data is sanitized cumulatively, half-and-half data cannot reference drinks, Rosa verifies mutations before confirming them, keyboard focus survives bag rerenders, the PWA cache lookup is more deterministic, and core food imagery now has WebP delivery paths. Run `python tools/regression-check.py` together with the existing audit and health checks before release.
