# Case Study — Forno Dona Rosa

## Challenge

Build a memorable pizzeria landing page that is not merely attractive: it must remain usable with a keyboard and screen reader, adapt across devices, support real ordering flows, and remain maintainable as the feature set grows.

## Product evolution

The project evolved from a static pizzeria landing page into a small client-side product: an expandable catalog, persistent Bag, half-and-half ordering, beverages, favorites, search, PWA support, business-hour awareness, and Rosa — a local conversational host.

## Key engineering decisions

1. **Static-first architecture.** GitHub Pages remains a valid deployment target.
2. **Accessibility-first controls.** Native elements, focus management, dialogs, reduced motion, and bounded live regions are designed in rather than patched later.
3. **Catalog as source of truth.** Persisted state never controls canonical prices.
4. **Local Rosa.** The public portfolio does not need API keys or a remote AI backend to demonstrate conversational UX.
5. **Security hardening despite static hosting.** CSP, safe DOM construction, input limits, same-origin caching, and schema validation reduce client-side risk.
6. **Release gates.** Audits verify version sync, changelog completeness, data integrity, and critical architectural invariants.

## What an international reviewer should notice

- The customer experience remains localized to Brazil while engineering documentation is internationalized.
- Accessibility, responsive behavior, security, and maintainability are treated as first-class requirements.
- Feature growth is accompanied by migrations, hardening, documentation, and regression checks rather than only visual additions.

## Stack

HTML5, modern CSS, vanilla JavaScript, browser storage APIs, Service Worker/PWA, Python maintenance scripts, Git/GitHub Pages.

## v2.4: reducing WhatsApp handoff friction

The local checkout addresses a common operational gap in WhatsApp ordering: incomplete names and delivery addresses create repeated questions for staff. The solution does not introduce accounts or a backend. Instead, it prepares structured customer/address/order data in the browser, validates CEP-derived city/state against Serra — ES, provides a review screen, and then opens WhatsApp with a customer-approved message. This preserves the low-friction channel while improving information quality and accessibility.
