# Forno Dona Rosa

**Accessible premium local-commerce experience · PWA · local conversational assistant · smart delivery checkout · white-label template factory**

[Português](README-PT.md) · [Documentation](docs/README.md) · [Changelog](CHANGELOG.md) · [Security](SECURITY.md)

Forno Dona Rosa is a portfolio-grade front-end product built around a fictional Brazilian artisan pizzeria. What began as a premium landing page evolved release by release into a reusable local-commerce platform with a data-driven catalog, defensive client-side state, an accessible ordering flow, a deterministic conversational host, PWA support, smart CEP-assisted delivery checkout, and a white-label client-generation workflow.

The public customer experience intentionally remains in **Brazilian Portuguese**. Repository engineering, technical naming and primary documentation are maintained in **English** for international review.

## Current release

**v2.9.9 — Mobile Design Refinement**

The 2.9 line is a focused visual and responsive refinement of the real-commerce experience. It does not add another layer of product complexity; it makes the existing purchase flow faster to scan and easier to operate on narrow touch screens.

On phones, the header is shorter, the Hero is cleaner, the artisan process is compact, catalog cards become horizontal fast-scan rows, search and category filters consume less vertical space, the Bag becomes a full-height task surface, checkout density is improved, and Rosa becomes a secondary circular affordance instead of competing with the purchase action.

The DOM remains semantic and shared between breakpoints: the mobile presentation is achieved through CSS adaptation rather than duplicated desktop/mobile markup. The direct purchase path remains **Menu → Bag → fulfillment/payment → review → customer-controlled WhatsApp handoff**.

## Product experience

The customer journey is intentionally short:

```text
Open the menu
      ↓
Add a product or personalize it
      ↓
Review the Bag
      ↓
Enter the minimum delivery details
      ↓
Review order + address
      ↓
Open WhatsApp with the structured message
```

The primary conversion rule is deliberately simple: exploration features such as Rosa, desire discovery, the recommendation finder and the advanced order builder must never block the direct purchase path.

Core experience highlights:

- Mobile-first visual menu with product imagery, sensory tags, search and filters.
- Pizza sizes, crusts, removals and half-and-half customization where applicable.
- Persistent Bag, favorites and repeat-order support with defensive schema validation.
- **Rosa**, a local deterministic conversational host for recommendations, comparisons, product actions and guided ordering.
- CEP lookup through ViaCEP with BrasilAPI fallback and explicit manual recovery.
- Delivery-area validation for the configured city/state before WhatsApp handoff.
- Address review and customer-controlled WhatsApp opening; nothing is sent automatically.
- PWA shell and bounded offline/runtime caching.

## Engineering principles

### Accessibility first

Accessibility is part of the product contract, not a finishing pass. The implementation favors semantic HTML, native controls, visible focus, keyboard operation, accessible dialogs, bounded live regions, error recovery, reduced motion, forced-colors support, zoom/reflow resilience and screen-reader-oriented naming/state design.

The repository does **not** treat static analysis as proof of complete accessibility. Manual NVDA, JAWS, Narrator, TalkBack, VoiceOver, browser and real-device tests must only be reported as passed when they were actually executed. See [docs/ACCESSIBILITY.md](docs/ACCESSIBILITY.md).

### Responsive by architecture

The UI is designed around available space and content rather than device names. It uses fluid sizing, intrinsic Grid/Flex behavior, responsive images, safe-area handling, mobile dialog patterns, long-content resilience and container-query readiness. Mobile is the primary commerce context, but tablet, desktop, landscape, zoom and large-screen behavior remain part of the quality contract.

### Defensive client-side state

`localStorage` and `sessionStorage` are treated as untrusted input. Product IDs, quantities, modifiers and persisted orders are normalized against canonical catalog data. Prices are recalculated from the active catalog instead of trusting stored totals.

### Static-first deployment

The public site remains deployable to GitHub Pages without a server runtime. Client-generation, synchronization and quality tooling run locally or in CI, while the published experience remains HTML/CSS/JavaScript and static assets.

## Rosa — local conversational host

Rosa is deliberately **not** presented as a remote LLM. She runs in the browser using deterministic intent handling, canonical catalog data, confidence/fallback rules, bounded session context and explicit action bridges.

She can:

- recommend products from expressed preferences;
- compare recognized products;
- resolve exact and ambiguous product references;
- add canonical products to the Bag;
- review the current Bag;
- guide a customer step by step;
- request explicit confirmation before destructive actions.

No external AI API key is required for the public demo, and customer address data is not used as conversational memory. See [docs/ROSA.md](docs/ROSA.md).

## Smart local checkout

The checkout is intentionally lighter than a traditional e-commerce checkout:

```text
Bag → Customer & delivery → Address review → WhatsApp
```

It supports:

- customer name and structured address fields;
- eight-digit CEP normalization;
- ViaCEP lookup with BrasilAPI fallback;
- configured city/state eligibility validation;
- manual-address recovery when lookup services fail;
- optional device-local address remembering only through explicit opt-in;
- final order/address review before leaving the site.

See [docs/CHECKOUT.md](docs/CHECKOUT.md).

## White-label architecture

The project separates reusable behavior from client identity. Canonical client data lives under `data/brand/`, while theme, content, assets and capabilities are independently replaceable.

```text
core behavior
├── catalog / Bag / checkout / Rosa / PWA
│
client layer
├── brand configuration
├── content
├── theme
├── assets
└── feature capabilities
```

A client package can be generated with:

```bash
python tools/create-brand.py --name "Bella Napoli" --slug bella-napoli --preset pizzeria
```

Validate it before activation:

```bash
python tools/project-doctor.py --brand brands/bella-napoli
```

Then apply it:

```bash
python tools/apply-brand.py bella-napoli
```

See [Create a new client](docs/customization/CREATE-A-CLIENT.md) and [Configuration](docs/customization/CONFIGURATION.md).

## Repository map

```text
forno-dona-rosa-v2.9.9/
├── .github/workflows/       CI quality workflow
├── assets/                  icons, product media and brand assets
├── brands/                  generated client packages
├── css/                     core styles and brand theme
├── data/
│   ├── brand/               active client source + generated runtime config
│   ├── catalog-schema.js    catalog capability model
│   ├── delivery-config.js   delivery-area and postal lookup configuration
│   ├── menu.js              canonical catalog and pricing data
│   └── rosa-knowledge-base.js
├── docs/                    architecture, features, QA and onboarding
├── js/                      application runtime
├── presets/                 reusable business presets
├── schemas/                 machine-readable configuration contracts
├── tools/                   generators, audits and release gates
├── index.html
├── service-worker.js
├── manifest.webmanifest
├── CHANGELOG.md
├── SECURITY.md
└── README.md
```

## Run locally

Requirements used by the repository tooling:

- Python 3
- Node.js/npm for the consolidated quality command

From the repository root:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

On Windows PowerShell systems that block `npm.ps1`, use:

```powershell
npm.cmd run quality
```

## Quality gates

Run the consolidated local pipeline:

```bash
npm run quality
```

The pipeline coordinates the repository's executable checks, including configuration validation, brand-leak protection, static audit, health checks, regressions, Rosa behavior, checkout behavior, template-factory checks, documentation drift and Project Doctor diagnostics.

Individual tools can also be run directly:

```bash
python tools/audit.py
python tools/health-check.py
python tools/regression-check.py
node tools/rosa-behavior-check.js
node tools/checkout-behavior-check.js
python tools/template-factory-check.py
python tools/docs-check.py
python tools/project-doctor.py
```

Quality tooling intentionally distinguishes executable evidence from manual validation. See [docs/quality/TESTING.md](docs/quality/TESTING.md).

## Security model

Even as a static client-side application, the project applies defensive boundaries:

- no unsafe runtime HTML rendering for user-controlled content;
- restrictive Content Security Policy;
- same-origin service-worker runtime caching;
- canonical product and price reconstruction;
- bounded persisted state and user input;
- safe external-link handling;
- explicit confirmation for destructive conversational actions;
- address persistence disabled unless the customer explicitly opts in.

See [SECURITY.md](SECURITY.md).

## Release evolution

The repository preserves every microversion in each planned release line. No `x.y.0 → x.y.9` line is intentionally collapsed.

| Release line | Main evolution |
| --- | --- |
| 1.0.x | Stable premium landing-page foundation and local business flow |
| 1.1.x | PWA, persistent commerce state, data-driven menu and recommendations |
| 1.2.x | Security, persistence, accessibility and PWA hardening |
| 1.3.x | Premium editorial art direction, food imagery and sensory copy |
| 1.4.x | Rosa local conversational host |
| 1.5.x | Bag terminology, expanded catalog, search and drinks |
| 1.6.x | State, PWA, Rosa and accessibility hardening |
| 1.7.x | International engineering naming and portfolio documentation |
| 1.8.x | Full-project bug sweep, regression tooling and reliability |
| 1.9.x | Mobile purchase simplification and responsive checkout behavior |
| 2.0.x | Mobile visual commerce and full product-image system |
| 2.1.x | Repository cleanup and English technical asset naming |
| 2.2.x | Product detail, returning customer, Rosa actions and offline UX |
| 2.3.x | Multi-turn Rosa, comparison, ambiguity handling and safe actions |
| 2.4.x | Smart local checkout and CEP-assisted delivery validation |
| 2.5.x | White-label architecture, brand configuration and reusable core |
| 2.6.x | Template Factory, schemas, client generation, Project Doctor and CI |

The detailed release record is in [CHANGELOG.md](CHANGELOG.md).

## Documentation

Start with [docs/README.md](docs/README.md). High-value references include:

- [Getting Started](docs/getting-started/GETTING-STARTED.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Accessibility](docs/ACCESSIBILITY.md)
- [Checkout](docs/CHECKOUT.md)
- [Rosa](docs/ROSA.md)
- [Create a Client](docs/customization/CREATE-A-CLIENT.md)
- [Testing](docs/quality/TESTING.md)
- [Troubleshooting](docs/troubleshooting/TROUBLESHOOTING.md)
- [Case Study](docs/CASE-STUDY.md)

## Portfolio value

The project is intended to demonstrate more than visual execution. It documents the evolution from a single landing page into a maintainable local-commerce system with explicit decisions around accessibility, responsive architecture, security, state integrity, conversational UX, white-label reuse, release engineering and documentation quality.

## License

MIT. See [LICENSE](LICENSE).

## Real commerce operations

The reference implementation now supports **delivery or pickup**, **ASAP or scheduled orders**, and **Pix or cash**. Cash orders may include an optional change amount. Delivery fee and ETA are deliberately configured as “confirm on WhatsApp” until the business provides real numbers. Products can be marked unavailable without removing them from the catalog, persisted Sacola prices are rebuilt from canonical menu data, and analytics remains disabled by default.

The customer still controls the final handoff: the site prepares the message, opens WhatsApp, and **does not send anything automatically**.
