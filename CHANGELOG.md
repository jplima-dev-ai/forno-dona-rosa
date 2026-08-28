# Changelog

All notable changes to **Forno Dona Rosa** are recorded in this file. The project uses a structured, SemVer-style release history in which every planned release line is documented continuously from `.0` through `.9`.

## Release-history policy

- Every requested release line must contain all ten microversions: `x.y.0` through `x.y.9`; skipped numbers are not allowed.
- Entries are listed newest first and describe observable product, engineering, accessibility, security, documentation or release changes.
- Categories such as **Added**, **Changed**, **Fixed**, **Security**, **Accessibility**, **Privacy**, **Architecture**, **Reviewed** and **Verified** are used when they add useful meaning; they are not added merely for ceremony.
- Historical entries preserve the strongest available repository evidence. Claims are not upgraded beyond what archived artifacts support.
- `2.0.0` is explicitly marked as a historical reconstruction because the preserved 2.0.x changelog started at `2.0.1`.
- Automated checks are not presented as proof of manual assistive-technology, browser or real-device testing unless those tests were actually executed.

---


## 3.0.9 — Production Website Release Gate
### Changed
- Finalized the transition from single-page landing experience to a production-style multi-page website for small and medium pizzerias.
- Synchronized runtime metadata, sitemap, documentation and executable website/naming gates.
### Verified
- Requires every 3.0.x microversion, generated page, product URL, pickup-state correction and sauce-ordering contract to remain present.

## 3.0.8 — SEO, Accessibility & Adaptive Hardening
### Added
- Added canonical URLs and page-specific metadata to generated pages plus Product/Restaurant structured data where applicable.
- Added nested-route asset resolution and service-worker registration so deep pages remain compatible with GitHub Pages project paths.
### Accessibility
- Preserved semantic landmarks, skip links, native controls, visible focus, reduced-motion and forced-colors contracts across generated pages.

## 3.0.7 — Cross-Page State, Search & Rosa Context
### Changed
- Reused the canonical Bag namespace and existing commerce runtime across every page so the order survives navigation.
- Added cross-page product actions and page-aware Rosa entry points without making the assistant mandatory.

## 3.0.6 — Brand Story & Local Presence
### Added
- Added dedicated `about/`, `experience/`, `location/`, `help/` and `privacy/` pages with Portuguese customer-facing copy.
- Moved local-business questions into focused destinations instead of forcing every visitor through one long page.

## 3.0.5 — Dedicated Ordering & Extras
### Added
- Added dedicated `order/` experience and optional sauce selection for Maionese, Ketchup, Mostarda, Molho de alho and Molho picante.
- Sauce choices now appear in review and WhatsApp payload only when selected.
### Fixed
- Fixed restored Pickup sessions showing delivery/CEP controls by reapplying conditional state after restoration, disabling hidden delivery controls and invalidating pending CEP lookup state.

## 3.0.4 — Product Detail System
### Added
- Added generated detail URLs for all 31 catalog products under `products/<id>/`.
- Added canonical product metadata, direct Add-to-Bag actions and pizza customization entry points.

## 3.0.3 — Dedicated Menu Experience
### Added
- Added `menu/` as a focused catalog destination with existing search, categories, favorites, quick add and personalization behavior.
- Product names now expose stable product URLs in addition to modal detail behavior.

## 3.0.2 — Shared Site Shell & Navigation
### Added
- Added shared multipage header/footer/navigation contracts and cross-page runtime fragments for Bag, checkout, product detail and Rosa.
- Added `js/site-pages.js` for page-specific progressive enhancement without duplicating commerce state.

## 3.0.1 — Multi-Page Information Architecture
### Added
- Established dedicated routes for menu, ordering, story, experience, location, help and privacy.
- Added a static-site build pipeline that generates 38 pages and the sitemap from canonical data.

## 3.0.0 — Website Architecture & Bug Forensics
### Reviewed
- Audited the 2.9.9 landing-page architecture for conversion into a complete pizzeria website while preserving validated commerce behavior.
- Defined English-only technical naming as a repository invariant while keeping customer-facing copy and documentation content in Portuguese.
### Architecture
- Added canonical `data/catalog.json`, `templates/runtime-fragments.html` and the static multipage generation strategy.
- Identified restored checkout state as the first divergence behind the Pickup/CEP visibility bug.

## 2.9.9 — Mobile Design Refinement Release Gate
### Changed
- Finalized the 2.9.x visual and responsive system across mobile navigation, hero, catalog, Bag, checkout, Rosa and supporting commerce sections.
- Updated runtime metadata, service-worker cache, documentation and quality tooling for the complete 2.9.x line.
### Verified
- Added `tools/responsive-design-check.py` as a release gate for the new mobile layout contracts and changelog continuity.

## 2.9.8 — Adaptive Resilience & Accessibility Polish
### Changed
- Added explicit small-phone, mobile-landscape, tablet and large-screen rules driven by content needs rather than device names.
- Strengthened safe-area handling, touch targets, text wrapping, forced-colors fallbacks and reduced-motion behavior for the refined interface.
### Accessibility
- Preserved semantic DOM order while changing only visual composition; no duplicate mobile/desktop content was introduced.

## 2.9.7 — Rosa & Secondary Surface Refinement
### Changed
- Reduced the mobile Rosa launcher to a compact circular affordance so it no longer competes with the Bag action or bottom navigation.
- Refined Rosa, operational FAQ, location and footer density for smaller screens while preserving their full functionality.

## 2.9.6 — Mobile Checkout Refinement
### Changed
- Tightened checkout typography, spacing, choice cards and review surfaces for one-handed mobile use.
- Kept the checkout full-height on phones with safe-area padding, scroll containment and clearer visual hierarchy between step, fields and primary action.

## 2.9.5 — Mobile Bag Refinement
### Changed
- Promoted the mobile Bag into a full-height task surface with denser item rows, clearer totals and larger quantity controls.
- Strengthened the floating Bag bar as the dominant mobile continuation action after the first item is added.

## 2.9.4 — Search & Filter Efficiency
### Changed
- Reduced vertical space used by menu search help text on mobile and strengthened the search field as the primary catalog-navigation control.
- Converted category filters into a compact horizontal scroll surface with stable touch targets and hidden decorative scrollbars.

## 2.9.3 — Fast-Scan Product Cards
### Changed
- Reworked phone product cards into horizontal image/content compositions so more products can be evaluated with less scrolling.
- Reduced nonessential visual metadata on narrow screens while preserving name, price, description, availability and purchase actions.
- Kept product-card actions large enough for touch and stacked when horizontal space is insufficient.

## 2.9.2 — Mobile Hero & Header Direction
### Changed
- Reduced sticky-header height and mobile chrome while keeping logo, Bag and navigation immediately reachable.
- Reframed the mobile Hero around copy first, one-column actions and an edge-to-edge food image.
- Removed the duplicate Rosa hero card on phones and compressed the artisan-process strip into three immediately scannable facts.

## 2.9.1 — Mobile Design Foundations
### Added
- Added shared mobile edge, touch-target, elevated-surface and shadow tokens for the 2.9 responsive layer.
### Changed
- Normalized mobile spacing, control sizing, numeric alignment and overscroll behavior across shared components.

## 2.9.0 — Responsive Design Forensics Audit
### Reviewed
- Audited the v2.8.9 page as a 320–430 px purchase experience, prioritizing vertical cost, visual competition, fixed controls, touch comfort and content resilience.
### Findings
- Identified excessive mobile height and simultaneous visual competition between the Hero seal, Rosa hero card, process strip, vertical product cards and fixed commerce controls.
- Chose an intrinsic mobile redesign rather than adding device-specific breakpoint patches or hiding page overflow.

## 2.8.9 — Real Commerce Operations Release Gate
### Changed
- Finalized delivery, pickup, scheduling, Pix/cash payment, availability, operational disclosures, offline recovery and commerce QA as one coherent checkout release.
- Updated runtime metadata, service-worker cache, documentation and quality gates for the complete 2.8.x line.
### Verified
- Added `tools/commerce-operations-check.py` and requires every `2.8.0`–`2.8.9` changelog entry to remain present.

## 2.8.8 — Operational Documentation & Trust
### Added
- Added concise customer FAQ covering delivery area, pickup, payment and manual WhatsApp confirmation.
- Added privacy and order-condition disclosures explaining session storage, optional address persistence and final operational confirmation.
- Added v2.8.9 release documentation and updated README operational guidance.

## 2.8.7 — Offline, Recovery & Multi-Tab Resilience
### Added
- Added branded `offline.html` and `404.html` recovery pages.
- Added cross-tab Sacola synchronization through the browser `storage` event.
### Changed
- Service-worker navigation fallback now prefers the dedicated offline page when the network is unavailable.

## 2.8.6 — Search, Reorder & Context Intelligence
### Added
- Added controlled product aliases and limited one-edit fuzzy matching for common spelling variants such as calabreza, marguerita and muçarela/mussarela.
- Added startup reconciliation notices when a persisted Sacola contains unavailable items or stored prices that differ from the current canonical catalog.
### Changed
- Reorder and persisted Sacola reconstruction continue to use current catalog prices and availability rather than trusting stale browser data.

## 2.8.5 — Product Availability Safety
### Added
- Added configurable unavailable-product IDs with disabled purchase actions and explicit “Indisponível hoje” states.
### Fixed
- Unavailable products and unavailable half-and-half secondary products are rejected during persisted Sacola normalization.

## 2.8.4 — Scheduling & Business-Hour Validation
### Added
- Added “o mais rápido possível” and scheduled-order modes.
- Added civil-time schedule validation against configured Dona Rosa opening hours, lead time and maximum scheduling horizon.
### Accessibility
- Scheduling errors are associated with the datetime field and block review with actionable recovery instructions.

## 2.8.3 — Pix, Cash & Change Handling
### Added
- Added Pix and cash as the only enabled payment methods for the reference implementation.
- Added optional cash-change amount with validation against the current demonstrative subtotal.
### Privacy
- Payment selection is session-local and only enters the WhatsApp message when the customer chooses to continue.

## 2.8.2 — Delivery & Pickup Checkout
### Added
- Added first-class delivery and pickup fulfillment choices.
- Pickup removes delivery-address requirements and shows the configured pizzeria address instead.
### Changed
- Review and WhatsApp copy now adapt to the selected fulfillment method.

## 2.8.1 — Commerce Configuration Foundation
### Added
- Added a canonical `commerce` configuration for fulfillment, payments, scheduling, delivery fee/estimate disclosure, pickup, availability and analytics.
- Added `data/commerce-config.js` and an analytics adapter that remains disabled by default.
### Changed
- Unknown delivery fee and ETA values remain explicit “confirm on WhatsApp” states instead of fabricated numbers.

## 2.8.0 — Real Commerce Forensics Audit
### Reviewed
- Audited the 2.7.9 fast-purchase flow as a real pizzeria operation rather than a portfolio-only experience.
- Defined invariants for fulfillment, payment, scheduling, availability, persisted prices, offline recovery, privacy and operational truth.
### Architecture
- Preserved the short Cardápio → Sacola → checkout → WhatsApp path while adding operational choices through progressive disclosure.

## 2.7.9 — Fast Purchase & Reliability Release Gate
### Changed
- Finalized the 2.7 customer journey around one dominant path: Cardápio → Sacola → endereço → WhatsApp, while keeping discovery and Rosa as optional support.
- Updated version metadata, service-worker cache version, release documentation and quality gates for the complete 2.7.x line.
### Verified
- Added executable conversion-flow checks and required all ten 2.7.x microversions to remain present in the changelog.

## 2.7.8 — Documentation & Conversion QA
### Added
- Added conversion-flow release documentation and executable checks for page order, CTA hierarchy, product decision paths, checkout recovery and documentation/version alignment.
### Changed
- Updated README guidance so the fastest customer path is explicit before advanced/template architecture details.

## 2.7.7 — Responsive & Adversarial Resilience
### Changed
- Added compact responsive rules for the three-step purchase orientation, progressive menu help and product-dialog utilities.
- Strengthened narrow-screen, landscape, forced-colors and reduced-motion behavior for the new conversion surfaces.
### Reviewed
- Rechecked fixed/sticky purchase controls, long labels, safe areas and component container behavior for small viewports.

## 2.7.6 — Accessibility Flow Hardening
### Accessibility
- Changed checkout review-step focus to the updated dialog heading so screen-reader and keyboard users encounter the review context before the final WhatsApp action.
- Fixed Rosa-from-Sacola focus recovery so closing Rosa returns to a visible Sacola trigger rather than a control inside a closed dialog.
- Preserved native controls, explicit labels, keyboard operation, focus visibility and non-automatic WhatsApp disclosure throughout the shortened purchase path.

## 2.7.5 — Checkout Friction Reduction
### Changed
- Removed redundant visible city/state fields from the checkout while keeping canonical hidden values and the explicit Serra — ES delivery notice.
- Simplified checkout guidance around the minimum customer decisions: name, CEP, number, and manual street/bairro only when lookup cannot supply them.
### Fixed
- Clearing or partially editing a CEP now clears stale address data and invalidates an in-flight lookup token instead of leaving the previous address visible.
- Checkout validation now blocks progression while an eight-digit CEP is still pending/loading instead of producing ambiguous area errors.
- Persisted/session address data is sanitized before being written back into form controls.

## 2.7.4 — Sacola Decision Simplification
### Changed
- Gave the Sacola one dominant action: informar endereço e continuar.
- Reduced visual weight of optional Rosa review and destructive “Esvaziar sacola” actions.
### Fixed
- If checkout cannot open after the Sacola closes, the Sacola is reopened with the order intact instead of leaving the customer without the expected next step.

## 2.7.3 — Product Decision Simplification
### Changed
- Reduced product cards to the two decisions that matter most at purchase time: add immediately or personalize.
- Moved favorite/share utilities into the product detail dialog so every catalog card no longer exposes four competing actions.
- Shortened personalization labels while retaining accessible names with product context.

## 2.7.2 — Menu-First Information Architecture
### Changed
- Moved the Cardápio directly below the purchase-orientation section so customers who scroll naturally reach products before brand-story sections.
- Reduced the primary navigation to Cardápio, Como pedir, Rosa and Localização.
- Converted desire-based discovery into progressive disclosure under “Quero ajuda para decidir”.

## 2.7.1 — Fast Purchase Entry
### Changed
- Reworked the hero to one primary CTA, “Pedir agora”, plus one optional assistance CTA.
- Added a compact three-step orientation: escolher, revisar na Sacola and confirmar through WhatsApp.
- Rewrote hero microcopy to explain the customer-controlled handoff before purchase begins.

## 2.7.0 — Conversion & Product Forensics Audit
### Reviewed
- Audited the complete customer path from first screen through catalog, product choice, Sacola, checkout, address validation and WhatsApp handoff using expected-vs-actual and first-divergence principles.
### Fixed
- Identified duplicated/competing purchase routes, fragile brand-sync logo matching, stale CEP state risk and closed-dialog focus-return risk as the primary 2.7.x causes of unnecessary friction or maintenance failure.

## 2.6.9 — Template Factory Release Gate
### Changed
- Finalized the Template Factory and production-readiness workflow after configuration, preset, component-resilience, documentation and CI review.
- Rebuilt the root README as a professional product-and-engineering entry point and synchronized the Portuguese companion README.
- Normalized the complete release history into one consistent heading format from `1.0.0` through `2.6.9`, recovering archived 1.0.x–1.2.x records and explicitly marking the reconstructed `2.0.0` transition.
### Verified
- Required every 2.6.x microversion, template-factory invariant, documentation check and Project Doctor gate to remain executable.

### Fixed

- Updated the changelog audit from legacy bracket-specific matching to semantic release-heading detection and added a continuity gate that requires every microversion from `1.0.0` through `2.6.9`.
- Windows Python 3.13 subprocess decoding: quality tools now capture child-process output explicitly as UTF-8 with safe replacement, preventing CP1252 `UnicodeDecodeError` crashes before result evaluation.
- Internal Python quality-tool invocations now use `sys.executable` where applicable, keeping nested checks on the same interpreter as the parent process.

## 2.6.8 — Reproducible Quality Pipeline
### Added
- Added `package.json` with a one-command `npm run quality` gate and `.github/workflows/quality.yml` for Linux and Windows CI execution.
### Accessibility
- Kept real screen-reader validation outside automated PASS claims unless the assistive technology is actually executed and recorded.

## 2.6.7 — Docs & Brand Drift Prevention
### Added
- Added `tools/docs-check.py` to detect stale file references, obsolete artifacts and version drift in public technical documentation.
- Strengthened capability-aware UI isolation so disabled features do not leave misleading controls behind.

## 2.6.6 — Documentation Architecture
### Added
- Added task-oriented Getting Started, Configuration, Create-a-Client, Testing and Troubleshooting documentation plus a canonical docs map.
- Added a high-value bug ledger and v2.6.9 release notes without duplicating machine truth.

## 2.6.5 — Quality Doctor
### Added
- Added `tools/project-doctor.py` to validate brand, catalog, assets, versioning, responsive contracts, workflow presence and changelog invariants.
- Added `tools/template-factory-check.py` to generate and validate a second business preset without mutating the active Forno Dona Rosa brand.

## 2.6.4 — Template Presets
### Added
- Added `pizzeria` and `coffee-shop` presets with capability models for products, checkout and optional features.
### Architecture
- Presets define reusable behavior boundaries while final art direction and real client content remain explicit customization work.

## 2.6.3 — Component Resilience
### Changed
- Added container-query readiness, long-content wrapping and capability-aware presentation rules for reusable product, Bag and client configurations.
### Fixed
- Closed a reuse bug where disabled features could remain visually discoverable despite existing feature flags.

## 2.6.2 — Client Generator
### Added
- Added `tools/create-brand.py` for guided client-package generation and `tools/apply-brand.py` for controlled activation followed by static brand synchronization.
- Generated brands receive isolated storage namespaces, preset capabilities, theme copy and asset requirements.

## 2.6.1 — Configuration Schema
### Added
- Added machine-readable schemas for brand, content and catalog contracts under `schemas/`.
### Security
- Constrained critical identifiers such as storage namespaces, business types and WhatsApp digits to predictable formats.

## 2.6.0 — Product Forensics Audit
### Reviewed
- Audited white-label configuration, feature flags, component coupling, documentation drift, long-content resilience, runtime assets and release tooling using expected-vs-actual and first-divergence principles.
### Fixed
- Identified incomplete presentation isolation for optional capabilities as the first reusable-template divergence to address in the 2.6.x cycle.

## 2.5.9 — Reusable Product Release Gate
### Changed
- Finalized the reusable product architecture after full regression review, brand isolation, storage namespacing and white-label documentation.
### Verified
- Added configuration, brand-leak and white-label gates and required every 2.5.x changelog entry to remain present.

## 2.5.8 — Documentation & Adaptation Guide
### Added
- Added `docs/WHITE-LABEL.md`, `docs/COMPONENTS.md` and `docs/BRAND-ASSETS.md` with adaptation and accessibility contracts.
- Added `tools/brand-sync.py` as the documented static-brand synchronization path for GitHub Pages.

## 2.5.7 — White-Label Safety
### Added
- Added `tools/config-check.py` and `tools/brand-leak-check.py` to validate required client configuration and prevent current-brand identity from leaking into reusable runtime modules.
### Security
- Client identity, contact and delivery boundaries are now consumed from canonical configuration instead of hardcoded runtime strings.

## 2.5.6 — Feature Flags & Capability Model
### Added
- Added feature flags for assistant, favorites, reorder, checkout, postal lookup, PWA, product search and half-and-half support.
- Added catalog capability metadata separating simple products from pizza modifiers and presentation groups.

## 2.5.5 — Configurable Assistant
### Changed
- Rosa's runtime identity and delivery wording now derive from brand/assistant configuration rather than fixed client strings.
- Assistant session storage now uses the configured brand namespace.

## 2.5.4 — Reusable Bag & Checkout
### Changed
- Bag, favorites and last-order storage use a brand namespace while preserving the Forno Dona Rosa namespace for backward compatibility.
- Checkout delivery boundaries and customer-facing handoff greeting now derive from brand configuration.
### Fixed
- Removed runtime coupling to Serra and Forno Dona Rosa from checkout implementation files.

## 2.5.3 — Catalog Abstraction
### Added
- Added `data/catalog-schema.js` to document product groups, simple product types and configurable modifiers.
### Architecture
- Established a capability boundary for future food/local-commerce presets without rewriting the existing catalog.

## 2.5.2 — Content & Theme Separation
### Added
- Added `data/brand/content.json`, generated content runtime configuration and a dedicated `css/brand-theme.css` layer.
- Hero brand content can now be changed independently from application behavior.

## 2.5.1 — Central Brand Configuration
### Added
- Added canonical `data/brand/brand.json` for identity, logo, contacts, location, delivery, assistant, features, SEO and hours.
- Added a generated runtime brand config and compatibility `app-config.js` adapter.
- Added a premium transparent Forno Dona Rosa logo master plus an optimized header WebP in `assets/images/brand/`.

## 2.5.0 — Full Product Audit
### Reviewed
- Audited brand strings, storage keys, checkout coupling, assistant coupling, PWA assets, product configuration and documentation before modularization.
### Fixed
- Identified hardcoded client identity and storage-collision risks as architectural bugs for white-label reuse and removed them from reusable runtime modules.

## 2.4.9 — Local Checkout Release Gate
### Changed
- Finalized the mobile-first local checkout after focused bug review, address validation, WhatsApp handoff hardening and accessibility refinements.
### Verified
- Added dedicated postal-code behavior checks plus checkout-specific audit, health and regression gates.
- Required every 2.4.x changelog entry, checkout module, delivery rule and CSP endpoint to remain synchronized.

## 2.4.8 — Inclusive Mobile & Accessibility Hardening
### Changed
- Increased operational text and primary-action sizing on mobile, strengthened touch targets and improved low-height/very-narrow reflow.
- Added explicit field-level error messages, predictable focus movement, live status announcements and a visible text close action.
- Added Rosa's “help me step by step” path for customers who prefer guided ordering.
### Accessibility
- CEP lookup announces one concise result instead of every auto-filled field; keyboard focus moves to the next field the customer must complete.

## 2.4.7 — Rosa Checkout Integration
### Added
- Rosa can explain the delivery step, open the checkout from a non-empty Bag and guide customers according to the current order state.
- Added a contextual “Fill delivery details” quick action when the Bag already contains items.
### Changed
- Rosa's order explanation now includes delivery details and final review before WhatsApp.

## 2.4.6 — Privacy & Saved Address
### Added
- Delivery data is stored in session storage by default so form progress survives the current tab session without creating a permanent customer profile.
- Added an explicit opt-in to remember name and address on the device plus an “Forget saved address” action.
### Privacy
- Only the CEP is sent to postal-code lookup providers; customer name, number, complement and reference stay in the browser until the customer chooses WhatsApp handoff.
- Non-opted-in checkout session data is cleared after a successful WhatsApp handoff.

## 2.4.5 — Address Review
### Added
- Added a final review step with customer name, complete address, validation state, grouped Bag contents and demonstrative subtotal.
- Added explicit “Everything is correct — go to WhatsApp” and “I want to correct information” actions.
### Changed
- WhatsApp no longer opens directly from the Bag; the customer always sees the review step first.

## 2.4.4 — Serra Delivery Validation
### Added
- Added canonical delivery configuration limiting delivery to Serra — ES.
- Added three explicit address states: validated in Serra, manual confirmation required, and outside the delivery area.
### Security
- City and state returned by CEP lookup are treated as validation data rather than editable customer assertions.

## 2.4.3 — Postal Provider Fallback
### Added
- Added BrasilAPI CEP v1 as a fallback when the primary ViaCEP lookup is unavailable or does not resolve the postal code.
- Added timeout and failure handling that preserves already-entered customer data.
### Changed
- Failed lookup now falls back to manual street/neighborhood entry while keeping Serra — ES as the only supported city.

## 2.4.2 — Smart CEP Lookup
### Added
- Added automatic ViaCEP lookup after eight CEP digits, with formatting, loading state and accessible result announcement.
- Auto-fills street, neighborhood, city and state when available; generic CEPs can still request only the missing street/neighborhood fields.
### Accessibility
- Uses `autocomplete="postal-code"`, numeric mobile input hints and field-specific help/error text.

## 2.4.1 — Customer Delivery Details
### Added
- Added structured fields for customer name, CEP, street, house/building number, no-number option, neighborhood, city, state, optional complement and optional landmark.
- Added clear mobile copy explaining exactly what each required field is for.
### Changed
- Replaced the Bag's direct WhatsApp CTA with “Continue to address”.

## 2.4.0 — Local Checkout Architecture
### Reviewed
- Audited the complete handoff from Bag to WhatsApp with emphasis on elderly users, low digital familiarity, NVDA, touch ergonomics and mobile cognitive load.
### Decision
- Adopted a three-stage model: Bag → Delivery details → Review → WhatsApp, without account creation, payment forms or hidden automatic submission.
- Kept checkout data client-side and limited the supported delivery city to Serra — ES.

## 2.3.9 — Rosa Final Release Gate
### Changed
- Finalized the Rosa conversational layer after focused bug review, mobile UX refinement, session-schema migration and action safety hardening.
### Verified
- Added a dedicated executable behavior suite for real Portuguese prompts covering preferences, comparison, ambiguity, exact product resolution, destructive actions and product details.
- Extended audit, health and regression gates to require every 2.3.x capability and changelog entry.

## 2.3.8 — Accessibility & Security Hardening
### Changed
- Refined screen-reader announcements so only new Rosa responses are announced while conversation history remains navigable as a log.
- Added an input character counter that stays silent until the user approaches the limit, plus explicit local-processing disclosure.
- Improved mobile dialog behavior for full-height viewports, virtual keyboards, safe areas, forced-colors and low-height landscape.
### Security
- Session state now validates schema, messages, product references, temporary preferences and pending destructive actions before reuse.

## 2.3.7 — Mobile Rosa UX
### Changed
- Reworked the Rosa dialog as a mobile-first full-screen conversational surface with a compact header, persistent composition area and horizontal quick-action scroller.
- Converted recommendation cards into thumb-friendly horizontal cards on small screens while preserving keyboard and screen-reader access.

## 2.3.6 — Bag Assistant
### Added
- Rosa can review the current Bag summary and adapt quick actions when items are already present.
- Added a safe Bag-clear bridge exposed by the application API.
### Security
- “Clear my Bag” is treated as destructive: Rosa always asks for explicit confirmation before executing it.

## 2.3.5 — Actionable Product Cards
### Added
- Recommendation cards now expose both “Add” and “View details” actions using canonical product IDs.
- Added current price and concise product traits to Rosa cards without duplicating the adjacent accessible product name.
### Changed
- Rosa validates product references before actions and checks the result of add-to-Bag operations before claiming success.

## 2.3.4 — Product Comparison
### Added
- Added deterministic comparison between two recognized products using canonical traits, current prices and temporary conversational preferences.
- Added ordinal references such as “the first”, “the second” and short references to recently recommended products.
### Fixed
- Prevented the substring “ou” inside words such as “recomendou” from incorrectly triggering comparison intent.

## 2.3.3 — Conversational Recommendations
### Added
- Recommendations now rank products against temporary preferences such as vegetarian, vegan, cheese-forward, sweet, light, intense and non-spicy.
- Rosa can explain why a product was recommended using only preferences actually expressed in the current session.
### Changed
- Recommendations prioritize a small curated set instead of returning long result lists.

## 2.3.2 — Intent Resolution 2.0
### Added
- Added stronger product resolution with aliases, exact-match priority and ambiguity detection.
- Generic commands such as “Add Coke” now request disambiguation, while “Add Coca-Cola 2 L” resolves directly to the exact catalog item.
### Fixed
- Prevented product-action intents from silently choosing a weaker partial match when a stronger exact match exists.

## 2.3.1 — Context & Preference Memory
### Added
- Migrated Rosa session state to schema v4 with short-lived temporary preferences, last referenced product IDs and pending confirmation state.
- Added multi-turn preference continuity without creating a permanent customer profile.
- Added explicit preference overrides for “no restrictions”, meat, spice, savory choices and returning from beverage-only intent.
### Privacy
- Clearing the conversation now also clears temporary preferences and pending conversational state.

## 2.3.0 — Rosa Architecture Audit
### Reviewed
- Audited the complete Rosa flow: intent resolution, product matching, recommendations, actions, Bag integration, mobile layout, focus, live regions, session storage and privacy boundaries.
### Decision
- Kept Rosa deterministic and local-first: no remote LLM, no invented commercial facts and no hidden automatic order submission.

## 2.2.9 — Conversion Quality Gate
### Changed
- Synchronized release metadata, documentation, PWA cache version, mobile behavior and automated quality gates for the completed 2.2.x cycle.
### Verified
- Added explicit regression coverage for sensory tags, product detail dialog behavior, responsive media variants, returning-order state, Rosa product actions, mobile navigation and offline WhatsApp protection.

## 2.2.8 — Responsive Media & Offline UX
### Added
- Generated 384 px WebP variants for all 31 product images and a 640 px hero variant for lower-cost mobile delivery.
- Added responsive `srcset`/`sizes` behavior to dynamic menu cards and a mobile-specific hero source.
### Changed
- Offline status now clearly explains that the cached menu and Bag remain usable while WhatsApp requires connectivity; the send action is disabled while offline.

## 2.2.7 — Mobile Navigation Refinement
### Added
- Added a four-action mobile navigation bar for Home, Menu, Rosa and Bag when the Bag is empty.
### Changed
- The existing live Bag bar takes priority as soon as products are added, preventing competing fixed controls and preserving thumb-friendly reach.

## 2.2.6 — Returning Customer Flow
### Added
- Added a local “repeat last order” flow stored only after the customer actively opens WhatsApp to confirm an order.
- Added a 45-day local retention boundary and an explicit “Clear history” action.
### Security
- Repeated orders are sanitized and rebuilt against the current catalog so persisted product IDs, quantities and prices are never trusted as canonical.

## 2.2.5 — Rosa Product Actions
### Added
- Rosa recommendations can now include compact product cards with image, name, current price and an accessible Add action.
### Changed
- Recommendation cards remain deterministic and local; their product IDs are validated before being stored in short-lived session history.

## 2.2.4 — Smart Bag Review
### Changed
- Bag review now separates pizzas, beverages and desserts for faster scanning.
- Reframed the final CTA as “Enviar pedido para confirmar” and explicitly states that nothing is sent automatically.
### Added
- Added “Revisar com a Rosa” directly in the Bag before WhatsApp handoff.

## 2.2.3 — Faster Add-to-Bag
### Changed
- Quick-add buttons now expose the actual demonstrative quick-add price in the action label.
### Added
- Added a persistent-enough, dismissible confirmation surface with “Ver sacola” and “Continuar escolhendo” actions while retaining screen-reader announcements.

## 2.2.2 — Product Detail Experience
### Added
- Added an accessible product-detail dialog with product image, sensory characteristics, current demonstrative price, quick add and a path to full pizza customization.
### Changed
- On mobile the dialog behaves as a bottom sheet; beverage details omit pizza-only size and crust customization.

## 2.2.1 — Sensory Product Language
### Added
- Added concise sensory tags such as “Leve”, “Intensa”, “Cremosa”, “Picante”, “Vegana” and “Muito queijo” derived from canonical product traits.
### Changed
- Product cards now emphasize decision-relevant sensory cues before long ingredient descriptions, improving scanning on small screens.

## 2.2.0 — Experience Audit
### Reviewed
- Audited the full discovery-to-WhatsApp journey with priority on mobile reachability, decision load, keyboard/NVDA behavior, repeat-customer friction, offline boundaries and image cost.
### Decision
- Kept the public experience static and privacy-preserving: no login, no cloud AI dependency and no automatic order submission.

## 2.1.9 — Repository Refinement Release Gate
- Completed structural cleanup, version synchronization, regression coverage and obsolete-file validation for the 2.1.x cycle.

## 2.1.8 — Quality Gate Modernization
- Updated audit, health and regression tooling to validate English image filenames, removed assets and 2.1.x changelog completeness.

## 2.1.7 — Customer Flow Review
- Corrected the primary hero action so “Escolher minha pizza” leads to the visual menu before customization, reducing an unnecessary jump into the order form.

## 2.1.6 — PWA Asset Cleanup
- Removed obsolete warm/core cache entries and kept the service worker limited to resources that are actually part of the current experience.

## 2.1.5 — Documentation Cleanup
- Removed documentation references to retired tooling and synchronized repository structure notes with the actual project tree.

## 2.1.4 — Obsolete Asset Removal
- Removed `assets/images/signature-pizza.svg` and `assets/images/og-cover.png` after verifying that neither is used by the customer-facing runtime.

## 2.1.3 — Tooling Cleanup
- Removed the obsolete `tools/generate.py` asset-generation helper after confirming it is no longer part of the build or release workflow.

## 2.1.2 — Beverage Image Naming
- Renamed beverage product files to English descriptive filenames such as `coca-cola-can.webp`, `sparkling-water-bottle.webp` and `orange-juice.webp`.

## 2.1.1 — Pizza Image Naming
- Renamed every pizza product image to descriptive English filenames while preserving Portuguese customer-facing product names and stable catalog IDs.

## 2.1.0 — Repository Review & Cleanup Audit
- Reviewed the full v2.0.9 tree for stale files, mixed-language image filenames, dead references, version drift and repository maintenance debt.

## 2.0.9 — Mobile Visual Commerce Release Gate
- Final mobile-first QA, version synchronization, product-image coverage and release validation.

## 2.0.8 — Accessibility, Reflow & Performance
- Refined keyboard/NVDA semantics, reduced-motion behavior, forced-colors support, lazy product media and compact mobile imagery.

## 2.0.7 — Rosa & Bag Visual Integration
- Added product thumbnails to the Bag and aligned Rosa recommendations with the visual catalog without duplicating accessible names.

## 2.0.6 — Menu 2.0 & Desire Discovery
- Added the “Choose by desire” mobile scroller, tighter product cards and faster image-led discovery.

## 2.0.5 — Beverage Product Imagery
- Added local product illustrations to every beverage so no catalog item depends on emoji-only representation.

## 2.0.4 — Full Pizza Image Coverage
- Added explicit product-image paths for every pizza while retaining optimized local WebP delivery.

## 2.0.3 — Product Photography System
- Standardized square product media, card cropping, lazy loading, fallback states and consistent visual framing.

## 2.0.2 — Hero 2.0
- Reframed the hero around “48 hours / 90 seconds,” simplified mobile CTAs and moved users directly toward menu discovery.

## 2.0.1 — Mobile-First Art Direction
- Introduced the visual-commerce design layer: warmer surfaces, stronger typography, tighter spacing and touch-first hierarchy.

## 2.0.0 — Mobile Visual Commerce Audit
### Historical reconstruction
- Opened the 2.0.x line around a mobile-first visual-commerce review before the documented art-direction, hero, product-media, discovery and release-gate work in 2.0.1–2.0.9.
- This entry is reconstructed from the preserved 2.0.x release sequence; no additional test result or implementation claim is attributed to 2.0.0 beyond that documented line-level transition.

## 1.9.9 — Responsive Checkout Release Gate
- Final responsive, keyboard, purchase-flow and regression review.

## 1.9.8 — Extreme Reflow QA
- Hardened dialogs, cards and controls for very narrow and low-height viewports.

## 1.9.7 — Accessible Purchase Feedback
- Preserved clear bag status, focus behavior and keyboard-operable purchase actions.

## 1.9.6 — Mobile Bag Bar
- Added a compact mobile-only bag summary with item count, total and one-tap review.

## 1.9.5 — Bag Dialog Mobile Layout
- Converted the mobile bag into a bottom-sheet style dialog with safer scrolling and sticky actions.

## 1.9.4 — Simplified Customization
- Moved optional removals and notes behind a native details disclosure to reduce cognitive load.

## 1.9.3 — Fast Purchase Cards
- Reduced menu-card purchase actions to quick add plus personalization for pizzas, and one-step add for drinks.

## 1.9.2 — Responsive Menu Discovery
- Improved single-column mobile cards and horizontally scrollable category filters.

## 1.9.1 — Responsive Layout Hardening
- Strengthened hero, order, local and footer reflow across tablet and compact viewports.

## 1.9.0 — Responsive Purchase Audit
- Started a focused audit of responsive behavior, purchase friction and cross-component layout bugs.

## 1.8.9 — Quality Refinement release gate
- Completed the v1.8.x bug-fix and refinement cycle.
- Added regression checks for bag sanitation, half-and-half integrity, Rosa actions, CSP, PWA cache behavior, modern images, business hours, version sync, and granular changelog history.
- Finalized the Quality Refinement Edition metadata and documentation.

## 1.8.8 — Regression coverage
- Added `tools/regression-check.py` for high-value semantic regressions that syntax-only checks could not detect.
- Added explicit checks for cumulative bag limits, product-type integrity, focus recovery, CSP hash accuracy, and 1.8.x changelog completeness.

## 1.8.7 — Interaction and content resilience
- Corrected the customer-facing “do seu sacola” grammar defect.
- Improved order-form error association and search help relationships.
- Refined customer-facing empty and favorite states to work for both pizzas and drinks.

## 1.8.6 — Performance refinement
- Added WebP variants for the four core food photographs while retaining JPEG fallbacks in static editorial content.
- Prioritized the hero image and moved dynamic menu cards to the lighter WebP assets.

## 1.8.5 — PWA and cache reliability
- Split critical and warm-cache assets so an optional editorial asset cannot block service-worker installation.
- Added explicit runtime-before-core cache matching to prevent a stale core response from permanently shadowing a refreshed runtime resource.
- Preserved the same-origin request restriction and bounded runtime cache.

## 1.8.4 — Responsive and zoom resilience
- Strengthened narrow-screen cart layout, process-strip reflow, footer stacking, landscape dialog behavior, and long-content wrapping.
- Added reduced-motion safeguards for document scrolling and transitions.

## 1.8.3 — Accessibility refinement
- Added more explicit status semantics for business availability and relationships for search/order help.
- Restored logical keyboard focus after bag quantity/removal rerenders.
- Improved minimum interactive target sizing and narrow-dialog usability.

## 1.8.2 — Rosa reliability
- Improved local product matching for punctuation/spacing variations.
- Rosa now checks whether an add-to-bag action actually succeeded before claiming success.
- Preserved local-only conversation architecture and bounded session memory.

## 1.8.1 — Bag integrity hardening
- Added cumulative quantity sanitation when loading persisted state, not only when adding new items.
- Regenerates unsafe or duplicate bag item identifiers.
- Rejects drinks as the second half of a half-and-half pizza loaded from untrusted storage.

## 1.8.0 — Full-project bug sweep
- Audited the v1.7.9 release across bag persistence, Rosa, PWA caching, responsive layout, accessibility semantics, performance assets, copy, and release tooling.
- Prioritized root-cause fixes and regression prevention over new feature expansion.

## 1.7.9 — International portfolio release gate
- Completed the English-first repository review and synchronized documentation, paths, cache references, audits, and version metadata.
- Added release checks that reject legacy technical filenames and missing 1.7.x changelog entries.

## 1.7.8 — International repository review
- Reviewed the repository from the perspective of an international recruiter or engineer.
- Added a concise engineering case study and improved discoverability of architecture, accessibility, security, performance, and QA documentation.

## 1.7.7 — Internal naming consistency
- Standardized technical naming around `app-config`, `app-meta`, knowledge-base terminology, Bag state, and English maintenance language.
- Kept `Rosa` and `Forno Dona Rosa` unchanged because they are brand/persona names rather than technical terms.

## 1.7.6 — English code comments and tooling
- Translated maintenance/tooling comments to English while preserving runtime behavior.
- Updated audit and health-check output for international readability.

## 1.7.5 — Technical documentation in English
- Rewrote accessibility, architecture, design-system, performance, QA, and security documentation in English.
- Added explicit boundaries between automated checks and manual validation.

## 1.7.4 — Portuguese companion README
- Added `README-PT.md` so Brazilian reviewers keep a first-class localized project overview.
- Cross-linked English and Portuguese entry points.

## 1.7.3 — English-first README
- Rebuilt the root `README.md` in English for international portfolio visibility.
- Added repository structure, quality gates, Rosa architecture, accessibility, security, and portfolio notes.

## 1.7.2 — Reference-safe rename migration
- Updated HTML, catalog data, service worker, documentation, audits, and tooling references after technical file/asset renames.
- Added checks to ensure renamed local resources remain resolvable.

## 1.7.1 — Asset naming internationalization
- Renamed food imagery to descriptive English filenames such as `cheese-pull-pizza.jpg`, `wood-fired-oven-pizza.jpg`, and `nutella-strawberry-pizza.jpg`.
- Preserved `rosa-avatar.jpg` because Rosa is the character name.

## 1.7.0 — International portfolio naming foundation
- Established English as the repository engineering language while keeping the customer-facing Brazilian Portuguese experience intact.
- Renamed `js/config.js` to `js/app-config.js` and `data/rosa-knowledge.js` to `data/rosa-knowledge-base.js`.

## 1.6.9 — Release Update
- Final release gate, Self-Audit Mode, version synchronization, and QA/hardening documentation.

## 1.6.8 — Release Update
- Improved empty states, recovery messages, and useful actions for zero-result search states.

## 1.6.7 — Release Update
- Strengthened catalog resilience, normalized search, deep links, and data validation.

## 1.6.6 — Release Update
- Reviewed performance with bounded cache behavior, image loading, and runtime work.

## 1.6.5 — Release Update
- Hardened the PWA with separated caches, obsolete-cache cleanup, per-resource strategies, and runtime cache limits.

## 1.6.4 — Release Update
- Strengthened responsive reflow for narrow viewports, dialogs, high zoom, and the Rosa launcher.

## 1.6.3 — Release Update
- Accessibility pass covering disciplined live regions, Rosa status announcements, forced colors, focus, and search descriptions.

## 1.6.2 — Release Update
- Hardened Rosa with Unicode normalization, control-character filtering, rate limits, session schema validation, intent confidence, and safe fallback behavior.

## 1.6.1 — Release Update
- Hardened the Bag with schema v3, v2/legacy migration, line/quantity/message limits, and canonical price recalculation.

## 1.6.0 — Release Update
- Started the bug hunt and broad security/state/PWA/Rosa/Bag/accessibility/responsive audit.

## 1.5.9 — Release Update
- Final QA across the expanded catalog, Bag, search, Rosa, PWA, security, integrations, documentation, and cache version.

## 1.5.8 — Release Update
- Refined catalog visuals so pizza and drink cards remain coherent without reducing pizza imagery prominence.

## 1.5.7 — Release Update
- Added editorial combinations and the local “Build a night with Rosa” suggestion flow without fake promotions.

## 1.5.6 — Release Update
- Integrated Rosa with drinks and the Bag; updated conversational language from Cart to Bag.

## 1.5.5 — Release Update
- Grouped Bag contents into pizzas/desserts and drinks and added contextual order-completeness feedback.

## 1.5.4 — Release Update
- Added menu search by product, ingredient, category, and trait with keyboard-operable filters and announced result counts.

## 1.5.3 — Release Update
- Added soft drinks, water, and juice with demonstration prices; drinks use fixed pricing without pizza size/crust logic.

## 1.5.2 — Release Update
- Expanded house specials, vegetarian/vegan pizzas, and dessert pizzas.

## 1.5.1 — Release Update
- Expanded traditional pizzas with Mozzarella, Portuguese, Chicken with Catupiry, Neapolitan, and Wood-Fired Pepperoni options.

## 1.5.0 — Release Update
- Renamed the customer experience from Cart to Bag and added migration from the legacy `forno-cart` state.

## 1.4.9 — Release Update
- Final Rosa QA covering conversation UI, session memory, inputs, integrations, documentation, security, and PWA assets.

## 1.4.8 — Release Update
- Polished Rosa panel, launcher, portrait, microinteractions, mobile states, focus, and reduced-motion behavior.

## 1.4.7 — Release Update
- Added bounded short-term session memory in `sessionStorage` with an explicit clear-conversation action.

## 1.4.6 — Release Update
- Made Rosa context-aware across hero, menu, signature pizza, order, location, Bag summary, and business status.

## 1.4.5 — Release Update
- Added local recommendation logic for classic, intense, vegetarian, cheese-forward, and sweet preferences.

## 1.4.4 — Release Update
- Connected menu, ingredients, sizes, crusts, half-and-half behavior, contacts, address, and operating hours to Rosa’s local knowledge.

## 1.4.3 — Release Update
- Added Rosa’s local conversational engine and knowledge data with no external AI API dependency.

## 1.4.2 — Release Update
- Added an accessible conversational `dialog`, conversation log, input field, quick suggestions, focus return, and keyboard flow.

## 1.4.1 — Release Update
- Added Rosa’s original avatar, floating launcher, hero card, and dedicated “Meet Rosa” section.

## 1.4.0 — Release Update
- Established Rosa as the digital host and configured official hours: weekdays 18:00–00:00; weekends 16:00–00:00 in `America/Sao_Paulo`.

## 1.3.9 — Release Update
- Final design/copy/image polish while preserving the security protections introduced in 1.2.x.

## 1.3.8 — Release Update
- Refined final CTA and microcopy around direct ordering, wood-fired preparation, and the Laranjeiras experience without artificial urgency.

## 1.3.7 — Release Update
- Refined gastronomic hover, focus, elevation, and transition states with reduced-motion support.

## 1.3.6 — Release Update
- Strengthened the fire-inspired atmosphere using depth, warm light, surfaces, and controlled gradients.

## 1.3.5 — Release Update
- Added the Dona Rosa signature-pizza section with sensory copy and a dedicated CTA.

## 1.3.4 — Release Update
- Upgraded menu cards with photography, overlays, badges, and stronger editorial hierarchy.

## 1.3.3 — Release Update
- Added original food imagery for pizza, cheese pull, wood-fired oven, and dessert and integrated it into the hero, gallery, and menu.

## 1.3.2 — Release Update
- Rewrote hero, process, menu, recommender, ordering, location, and final CTA copy for a more sensory and product-specific voice.

## 1.3.1 — Release Update
- Promoted food photography to the hero and sharpened the primary CTA and visual-discovery microcopy.

## 1.3.0 — Release Update
- Recalibrated palette, depth, surfaces, hierarchy, and visual rhythm around fire, flour, wood, and tomato.

## 1.2.9 — Stability & Security Release Gate
- Adicionada auditoria reproduzível `tools/audit.py`.
- Documentação e versão visual atualizadas para Stability & Security Edition.
- Verificações de integridade, CSP, links externos, recursos locais e sintaxe consolidadas.

## 1.2.8 — SEO & Deep-Link Resilience
- Metadados de referrer e versão adicionados.
- Deep links agora validam IDs contra o catálogo antes de qualquer ação.
- Compartilhamento ganhou fallback de cópia compatível com contextos sem Clipboard API moderna.

## 1.2.7 — Performance & Runtime Stability
- Renderização dinâmica passou a criar nós DOM diretamente, reduzindo parsing HTML repetido.
- Atualizações de carrinho e favoritos foram centralizadas e normalizadas.
- Service worker evita cache de respostas inválidas.

## 1.2.6 — Persistent State Defense
- `localStorage` passou a ser tratado como entrada não confiável.
- IDs de produtos inválidos são descartados.
- Quantidades são limitadas e preços/totais são recalculados a partir do catálogo canônico.
- Carrinho demonstrativo limitado defensivamente a 50 linhas.

## 1.2.5 — PWA Cache Hardening
- Cache versionado para v1.2.9.
- Service worker limitado a requisições GET same-origin.
- Navegação usa network-first com fallback do shell.
- Assets usam stale-while-revalidate.
- Falha de asset não recebe mais `index.html` como resposta indevida.
- `skipWaiting()` e `clients.claim()` tornam atualizações mais previsíveis.

## 1.2.4 — Responsive Reflow Hardening
- Conteúdo longo do carrinho ganhou quebra resiliente.
- Alvos interativos receberam `touch-action: manipulation`.
- Âncoras ganharam `scroll-margin-top` para não ficarem sob o header sticky.
- Fallback do backdrop-filter adicionado.

## 1.2.3 — Accessibility Hardening
- Menu mobile passou a isolar conteúdo externo quando `inert` é suportado e controlar ciclo de foco.
- Carrinho restaura explicitamente o foco ao acionador ao fechar.
- Botões dinâmicos ganharam nomes acessíveis contextuais.
- Grid de cardápio deixou de ser uma live region redundante; anúncio permanece no status dedicado.
- Reforço para `prefers-contrast` e `forced-colors`.

## 1.2.2 — DOM XSS & Security Hardening
- Removido uso de `innerHTML` em conteúdo dinâmico.
- Corrigido vetor de DOM XSS persistente em observações recuperadas de `localStorage`.
- Adicionada CSP restritiva via meta tag.
- Links `_blank` usam `noopener noreferrer`.
- Criado `SECURITY.md` com modelo de ameaça e limitações do GitHub Pages.

## 1.2.1 — State Integrity
- Pizza meio a meio exige segundo sabor válido e diferente.
- Quantidade é normalizada entre 1 e 10.
- Nomes, tamanhos, bordas e valores exibidos no carrinho derivam das fontes canônicas.
- Estados corrompidos ou obsoletos do navegador deixam de quebrar a interface.

## 1.2.0 — Stability & Security Audit
- Revisão de segurança, persistência, carrinho, favoritos, deep links, menu mobile, compartilhamento e PWA.
- Congelamento de features para priorizar estabilidade e regressões.

## 1.1.9 — Portfolio Engineering Release Gate
- Portfolio Engineering Edition consolidada.

## 1.1.8 — Sharing & Deep Links
- Compartilhamento via Web Share API, fallback de cópia e deep links por `?pizza=`.

## 1.1.7 — Persistent Favorites
- Favoritos persistentes com `localStorage` e `aria-pressed`.

## 1.1.6 — Process Storytelling
- Storytelling “Da farinha ao fogo”, responsivo e compatível com reduced motion.

## 1.1.5 — Business Hours Engine
- Motor de horário comercial configurável. Sem horário oficial fornecido, o site orienta consultar o WhatsApp.

## 1.1.4 — Deterministic Recommender
- Recomendador determinístico “Qual pizza combina comigo?”.

## 1.1.3 — Data-Driven Catalog
- Catálogo e regras de preço movidos para `data/menu.js`.

## 1.1.2 — Product Customization
- Tamanhos, bordas, remoção de ingredientes e pizza meio a meio.

## 1.1.1 — Persistent Cart
- Carrinho persistente com subtotal, alteração de quantidade e envio consolidado ao WhatsApp.

## 1.1.0 — PWA Foundation
- PWA: manifest, ícones, service worker, instalação e experiência offline básica.

## 1.0.9 — Portfolio Edition Release Gate
- Base premium anterior: identidade, cardápio filtrável, pedido simples, localização e QA estrutural.

## 1.0.8 — Local Business Experience
- Nova experiência local “Do forno para Laranjeiras”.
- E-mail, Instagram, WhatsApp e endereço atualizados.
- Link de rota montado a partir da configuração central.

## 1.0.7 — Accessible Order Builder
- Montador acessível de pedido com pizza, tamanho, quantidade e observações.
- Mensagem estruturada gerada para WhatsApp sem checkout intermediário.

## 1.0.6 — Accessible Menu Discovery
- Cardápio explorável por Tradicionais, Especiais, Vegetarianas/Veganas e Doces.
- Filtros com botões reais, `aria-pressed` e status anunciado.

## 1.0.5 — Fire Ritual Storytelling
- Storytelling “O ritual do fogo”.
- Assinatura 48H → 400°C → 90S incorporada à narrativa.

## 1.0.4 — Editorial Hero Redesign
- Hero redesenhado com composição editorial, CTA principal e pizza assinatura.
- Novo momento visual de marca.

## 1.0.3 — Visual System Foundation
- Sistema visual proprietário inspirado em carvão, farinha, terracota, tomate, oliva e calor do forno.
- Nova escala tipográfica, superfícies, raios e motion.

## 1.0.2 — Brand & Business Data Integration
- Dados da Pizzaria Forno Dona Rosa integrados em contato, SEO e configuração.
- Hero atualizado com a proposta de valor fornecida.

## 1.0.1 — Structural Stabilization
- Estrutura física alinhada aos caminhos usados pelo HTML: `css/styles.css`, `js/config.js` e `js/main.js`.
- Criado `js/config.js`, eliminando as referências JavaScript inexistentes a configurações de WhatsApp.
- Corrigidas duplicações acidentais de propriedades no CSS.
- Removido `overflow-x: hidden` global como remendo preventivo; a versão deve expor overflow real durante QA em vez de escondê-lo.
- Navegação mobile passa a usar `100dvh` em vez de altura rígida baseada apenas em `100vh`.
- Mídia ganhou regras resilientes de largura máxima.
- Links vazios de Instagram/Facebook foram removidos da demonstração.
- Depoimentos e dados comerciais passaram a ser identificados explicitamente como fictícios.
- Número de WhatsApp da demo é propositalmente inválido para evitar contato com terceiros reais.
- Imagem Open Graph externa foi substituída por asset local do projeto.
- README reescrito para refletir exatamente a estrutura e as validações realmente executadas.

### Adicionado
- `.gitignore`.
- `LICENSE` MIT.
- `robots.txt`.
- Capa local `assets/images/og-cover.png`.
- Pasta `docs/` para screenshots reais da renderização.
- Pasta `tools/` para separar o gerador Python do runtime da landing page.

### Observações de publicação
- `canonical` e `og:url` usam `SEU-USUARIO` porque a URL final do repositório ainda não foi informada; altere depois de criar o GitHub Pages.
- Para produção, use URL absoluta em `og:image`.
- NVDA e Axe não são declarados como aprovados nesta entrega sem execução específica dessas ferramentas.

## 1.0.0 — Initial Stable Template
Primeira versão estável do template. Testada de ponta a ponta antes do
release — não é "achismo de que funciona", é resultado de auditoria real
(Playwright + axe-core), documentado abaixo.

### Adicionado
- Estrutura completa da landing page: hero, diferenciais, cardápio (6
  itens), depoimentos, localização/horário, CTA final, rodapé.
- Sistema de reuso multi-cliente: paleta centralizada em `css/styles.css`
  (`:root`), WhatsApp centralizado em `js/config.js`.
- Menu mobile acessível: painel deslizante, `aria-expanded` sincronizado,
  fecha com `Esc` (foco retorna ao botão), fecha ao clicar fora, fecha ao
  navegar por um link.
- Links de WhatsApp dinâmicos por item do cardápio, com nome e preço
  pré-preenchidos na mensagem.
- Rastreamento de conversão (`whatsapp_click`, `pizza_selecionada`) em
  `window.dataLayer`, compatível com GA4/GTM.
- Dados estruturados `schema.org/Restaurant` (JSON-LD) para SEO local.
- `robots.txt`, `sitemap.xml`, meta tags Open Graph e `canonical`.
- Ilustrações SVG originais (pizza do hero + 6 pizzas do cardápio),
  geradas por `pizza-art/generate.py`, substituindo fotos de banco
  hotlinkadas — zero dependência de rede, zero risco de link quebrado.
- `LICENSE` (MIT), `.gitignore`, README como case study de portfólio.

### Corrigido durante a auditoria pré-release
- `aria-prohibited-attr`: containers de estrelas dos depoimentos usavam
  `aria-label` num `<div>` sem `role` que suportasse nome acessível.
  Corrigido com `role="img"`.
- `id` duplicado (`id="ps"`) repetido em 7 elementos `<svg>` irmãos no
  mesmo documento (filtro de sombra das ilustrações) — HTML inválido e
  risco de falha em `duplicate-id`. Corrigido com ids únicos por variante
  (`ps-hero`, `ps-margherita`, etc.).
- `width`/`height` ausentes em imagens do cardápio, causando risco de
  layout shift (CLS) — corrigido (hoje sem efeito prático, já que as
  imagens viraram SVG inline, mas o padrão continua documentado para
  quando forem trocadas por fotos reais).

### Auditado e verificado (não apenas assumido)
- **Acessibilidade**: 0 violações WCAG 2.0/2.1 A+AA via axe-core
  (Playwright + Chromium headless). 23 regras verificadas com sucesso.
- **Contraste de cor**: calculado com a fórmula WCAG oficial (luminância
  relativa), incluindo o pior caso dos gradientes decorativos atrás do
  header — todas as combinações usadas passam AA (mínimo 4.5:1 para texto
  normal); a mais apertada fica em 4.65:1.
- **Navegação por teclado**: trilha de foco testada elemento a elemento
  (skip-link → logo → nav → CTAs → cardápio), sem armadilhas de foco.
- **Zero erros de JavaScript** em viewport desktop (1440px) e mobile
  (390px).
- **Links de WhatsApp**: verificado que cada um monta a URL correta,
  inclusive os 6 do cardápio com nome e preço citados na mensagem.

### Limitações conhecidas desta versão
- `og:image` e o campo `image` do JSON-LD ainda apontam para uma imagem
  de placeholder externa — essas duas specs exigem uma URL HTTP real
  (não aceitam SVG inline), então precisam de uma foto real hospedada
  antes de publicar para um cliente.
- Conteúdo (nome da pizzaria, WhatsApp, endereço, depoimentos) é
  fictício, para demonstração. Ver checklist de customização no README.
- Testado com axe-core (automatizado); ainda não testado manualmente com
  NVDA ligado — recomendado antes de entregar a um cliente real.
