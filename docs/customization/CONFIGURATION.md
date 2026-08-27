# Configuration reference

The canonical client source is `data/brand/brand.json`. Generated client packages use the same structure under `brands/<slug>/brand.json`.

## Core brand fields
- `brand.name`: customer-facing brand name.
- `brand.legalDisplayName`: organization name used by metadata and structured data.
- `brand.businessType`: supported preset family identifier.
- `brand.locale`: interface locale such as `pt-BR`.
- `brand.currency`: ISO-style three-letter currency code.
- `brand.timezone`: IANA timezone.
- `brand.storageNamespace`: isolated local/session storage prefix. Lowercase ASCII letters, digits and hyphens only.
- `brand.logo.full`: source logo path.
- `brand.logo.header`: optimized header logo path.

## Contacts
`contacts.whatsappNumber` is stored as international digits only. Optional channels should be removed or left empty only if the runtime/documentation for that feature supports absence.

## Feature flags
Supported flags are `favorites`, `reorder`, `assistant`, `checkout`, `postalCodeLookup`, `pwa`, `productSearch`, and `halfAndHalf`.

The UI has capability-aware hiding for favorites, reorder, assistant, product search and half-and-half controls. Runtime code still validates capabilities instead of trusting CSS alone.

## Schemas
Formal machine-readable contracts live in:
- `schemas/brand.schema.json`
- `schemas/content.schema.json`
- `schemas/catalog.schema.json`

The Project Doctor enforces high-value invariants without requiring an external JSON Schema package.
