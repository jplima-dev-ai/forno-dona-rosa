# Security Policy

## Scope

Forno Dona Rosa is a static front-end portfolio project. It has no authentication layer, payment processor, private database, or server-side order storage. Orders are handed off to WhatsApp for final confirmation.

## Defensive controls

- Content Security Policy in the document head.
- User-controlled content is inserted with safe DOM/text APIs rather than unsafe HTML sinks.
- Persistent Bag data is treated as untrusted and normalized against the canonical catalog.
- Prices are recalculated from current catalog data rather than trusted from storage.
- User input and session history are bounded.
- Rosa runs locally in the browser and does not send chat text to an external AI API.
- Service-worker caching is restricted to same-origin resources and bounded runtime cache behavior.
- External `_blank` links include `noopener noreferrer`.
- WhatsApp URLs use controlled destination numbers and encoded message text.
- Checkout customer data is session-scoped by default; persistent name/address storage is opt-in only.
- Postal lookup sends only the CEP to allowlisted HTTPS providers (ViaCEP, then BrasilAPI fallback).
- Provider-returned city/state data is normalized and validated against Serra — ES before delivery handoff.
- Manual fallback is explicitly marked as requiring staff confirmation; it does not pretend to be provider-verified.

## Reporting

If you find a security issue in this portfolio repository, open a GitHub issue without including sensitive exploit data. For a real production deployment, private disclosure would be preferable.

## Important limitation

Client-side controls cannot turn a static portfolio into a secure backend. Real payments, authentication, private customer data, order persistence, rate limiting, and administrative operations would require an appropriate server-side architecture.

## Checkout data boundary

The static portfolio does not submit customer details to a first-party server. Name and full delivery details remain in browser state until the customer explicitly opens WhatsApp. CEP assistance depends on third-party postal services and therefore should be reviewed before a real production launch, including provider terms, privacy notice and operational fallback policy.

## v2.5 white-label isolation

Client identity and delivery boundaries are sourced from `data/brand/brand.json` and generated runtime configuration. Reusable runtime modules must not hardcode the reference client's phone, email, address or service-area label. `tools/brand-leak-check.py` enforces that boundary, while `brand.storageNamespace` isolates browser state between client deployments.
