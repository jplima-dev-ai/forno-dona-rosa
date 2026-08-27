# Changelog

## 2.6.9 — Template Factory Release Gate
### Changed
- Finalized the Template Factory and production-readiness workflow after configuration, preset, component-resilience, documentation and CI review.
### Verified
- Required every 2.6.x microversion, template-factory invariant, documentation check and Project Doctor gate to remain executable.

### Fixed

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

## [1.8.9] - 2026-08-26
### Quality Refinement release gate
- Completed the v1.8.x bug-fix and refinement cycle.
- Added regression checks for bag sanitation, half-and-half integrity, Rosa actions, CSP, PWA cache behavior, modern images, business hours, version sync, and granular changelog history.
- Finalized the Quality Refinement Edition metadata and documentation.

## [1.8.8] - 2026-08-26
### Regression coverage
- Added `tools/regression-check.py` for high-value semantic regressions that syntax-only checks could not detect.
- Added explicit checks for cumulative bag limits, product-type integrity, focus recovery, CSP hash accuracy, and 1.8.x changelog completeness.

## [1.8.7] - 2026-08-26
### Interaction and content resilience
- Corrected the customer-facing “do seu sacola” grammar defect.
- Improved order-form error association and search help relationships.
- Refined customer-facing empty and favorite states to work for both pizzas and drinks.

## [1.8.6] - 2026-08-26
### Performance refinement
- Added WebP variants for the four core food photographs while retaining JPEG fallbacks in static editorial content.
- Prioritized the hero image and moved dynamic menu cards to the lighter WebP assets.

## [1.8.5] - 2026-08-26
### PWA and cache reliability
- Split critical and warm-cache assets so an optional editorial asset cannot block service-worker installation.
- Added explicit runtime-before-core cache matching to prevent a stale core response from permanently shadowing a refreshed runtime resource.
- Preserved the same-origin request restriction and bounded runtime cache.

## [1.8.4] - 2026-08-26
### Responsive and zoom resilience
- Strengthened narrow-screen cart layout, process-strip reflow, footer stacking, landscape dialog behavior, and long-content wrapping.
- Added reduced-motion safeguards for document scrolling and transitions.

## [1.8.3] - 2026-08-26
### Accessibility refinement
- Added more explicit status semantics for business availability and relationships for search/order help.
- Restored logical keyboard focus after bag quantity/removal rerenders.
- Improved minimum interactive target sizing and narrow-dialog usability.

## [1.8.2] - 2026-08-26
### Rosa reliability
- Improved local product matching for punctuation/spacing variations.
- Rosa now checks whether an add-to-bag action actually succeeded before claiming success.
- Preserved local-only conversation architecture and bounded session memory.

## [1.8.1] - 2026-08-26
### Bag integrity hardening
- Added cumulative quantity sanitation when loading persisted state, not only when adding new items.
- Regenerates unsafe or duplicate bag item identifiers.
- Rejects drinks as the second half of a half-and-half pizza loaded from untrusted storage.

## [1.8.0] - 2026-08-26
### Full-project bug sweep
- Audited the v1.7.9 release across bag persistence, Rosa, PWA caching, responsive layout, accessibility semantics, performance assets, copy, and release tooling.
- Prioritized root-cause fixes and regression prevention over new feature expansion.

## [1.7.9] — 2026-08-26
### International portfolio release gate
- Completed the English-first repository review and synchronized documentation, paths, cache references, audits, and version metadata.
- Added release checks that reject legacy technical filenames and missing 1.7.x changelog entries.

## [1.7.8] — 2026-08-26
### International repository review
- Reviewed the repository from the perspective of an international recruiter or engineer.
- Added a concise engineering case study and improved discoverability of architecture, accessibility, security, performance, and QA documentation.

## [1.7.7] — 2026-08-26
### Internal naming consistency
- Standardized technical naming around `app-config`, `app-meta`, knowledge-base terminology, Bag state, and English maintenance language.
- Kept `Rosa` and `Forno Dona Rosa` unchanged because they are brand/persona names rather than technical terms.

## [1.7.6] — 2026-08-26
### English code comments and tooling
- Translated maintenance/tooling comments to English while preserving runtime behavior.
- Updated audit and health-check output for international readability.

## [1.7.5] — 2026-08-26
### Technical documentation in English
- Rewrote accessibility, architecture, design-system, performance, QA, and security documentation in English.
- Added explicit boundaries between automated checks and manual validation.

## [1.7.4] — 2026-08-26
### Portuguese companion README
- Added `README-PT.md` so Brazilian reviewers keep a first-class localized project overview.
- Cross-linked English and Portuguese entry points.

## [1.7.3] — 2026-08-26
### English-first README
- Rebuilt the root `README.md` in English for international portfolio visibility.
- Added repository structure, quality gates, Rosa architecture, accessibility, security, and portfolio notes.

## [1.7.2] — 2026-08-26
### Reference-safe rename migration
- Updated HTML, catalog data, service worker, documentation, audits, and tooling references after technical file/asset renames.
- Added checks to ensure renamed local resources remain resolvable.

## [1.7.1] — 2026-08-26
### Asset naming internationalization
- Renamed food imagery to descriptive English filenames such as `cheese-pull-pizza.jpg`, `wood-fired-oven-pizza.jpg`, and `nutella-strawberry-pizza.jpg`.
- Preserved `rosa-avatar.jpg` because Rosa is the character name.

## [1.7.0] — 2026-08-26
### International portfolio naming foundation
- Established English as the repository engineering language while keeping the customer-facing Brazilian Portuguese experience intact.
- Renamed `js/config.js` to `js/app-config.js` and `data/rosa-knowledge.js` to `data/rosa-knowledge-base.js`.

## [1.6.9] — 2026-08-26
- Final release gate, Self-Audit Mode, version synchronization, and QA/hardening documentation.

## [1.6.8] — 2026-08-26
- Improved empty states, recovery messages, and useful actions for zero-result search states.

## [1.6.7] — 2026-08-26
- Strengthened catalog resilience, normalized search, deep links, and data validation.

## [1.6.6] — 2026-08-26
- Reviewed performance with bounded cache behavior, image loading, and runtime work.

## [1.6.5] — 2026-08-26
- Hardened the PWA with separated caches, obsolete-cache cleanup, per-resource strategies, and runtime cache limits.

## [1.6.4] — 2026-08-26
- Strengthened responsive reflow for narrow viewports, dialogs, high zoom, and the Rosa launcher.

## [1.6.3] — 2026-08-26
- Accessibility pass covering disciplined live regions, Rosa status announcements, forced colors, focus, and search descriptions.

## [1.6.2] — 2026-08-26
- Hardened Rosa with Unicode normalization, control-character filtering, rate limits, session schema validation, intent confidence, and safe fallback behavior.

## [1.6.1] — 2026-08-26
- Hardened the Bag with schema v3, v2/legacy migration, line/quantity/message limits, and canonical price recalculation.

## [1.6.0] — 2026-08-26
- Started the bug hunt and broad security/state/PWA/Rosa/Bag/accessibility/responsive audit.

## [1.5.9] — 2026-08-26
- Final QA across the expanded catalog, Bag, search, Rosa, PWA, security, integrations, documentation, and cache version.

## [1.5.8] — 2026-08-26
- Refined catalog visuals so pizza and drink cards remain coherent without reducing pizza imagery prominence.

## [1.5.7] — 2026-08-26
- Added editorial combinations and the local “Build a night with Rosa” suggestion flow without fake promotions.

## [1.5.6] — 2026-08-26
- Integrated Rosa with drinks and the Bag; updated conversational language from Cart to Bag.

## [1.5.5] — 2026-08-26
- Grouped Bag contents into pizzas/desserts and drinks and added contextual order-completeness feedback.

## [1.5.4] — 2026-08-26
- Added menu search by product, ingredient, category, and trait with keyboard-operable filters and announced result counts.

## [1.5.3] — 2026-08-26
- Added soft drinks, water, and juice with demonstration prices; drinks use fixed pricing without pizza size/crust logic.

## [1.5.2] — 2026-08-26
- Expanded house specials, vegetarian/vegan pizzas, and dessert pizzas.

## [1.5.1] — 2026-08-26
- Expanded traditional pizzas with Mozzarella, Portuguese, Chicken with Catupiry, Neapolitan, and Wood-Fired Pepperoni options.

## [1.5.0] — 2026-08-26
- Renamed the customer experience from Cart to Bag and added migration from the legacy `forno-cart` state.

## [1.4.9] — 2026-08-26
- Final Rosa QA covering conversation UI, session memory, inputs, integrations, documentation, security, and PWA assets.

## [1.4.8] — 2026-08-26
- Polished Rosa panel, launcher, portrait, microinteractions, mobile states, focus, and reduced-motion behavior.

## [1.4.7] — 2026-08-26
- Added bounded short-term session memory in `sessionStorage` with an explicit clear-conversation action.

## [1.4.6] — 2026-08-26
- Made Rosa context-aware across hero, menu, signature pizza, order, location, Bag summary, and business status.

## [1.4.5] — 2026-08-26
- Added local recommendation logic for classic, intense, vegetarian, cheese-forward, and sweet preferences.

## [1.4.4] — 2026-08-26
- Connected menu, ingredients, sizes, crusts, half-and-half behavior, contacts, address, and operating hours to Rosa’s local knowledge.

## [1.4.3] — 2026-08-26
- Added Rosa’s local conversational engine and knowledge data with no external AI API dependency.

## [1.4.2] — 2026-08-26
- Added an accessible conversational `dialog`, conversation log, input field, quick suggestions, focus return, and keyboard flow.

## [1.4.1] — 2026-08-26
- Added Rosa’s original avatar, floating launcher, hero card, and dedicated “Meet Rosa” section.

## [1.4.0] — 2026-08-26
- Established Rosa as the digital host and configured official hours: weekdays 18:00–00:00; weekends 16:00–00:00 in `America/Sao_Paulo`.

## [1.3.9] — 2026-08-26
- Final design/copy/image polish while preserving the security protections introduced in 1.2.x.

## [1.3.8] — 2026-08-26
- Refined final CTA and microcopy around direct ordering, wood-fired preparation, and the Laranjeiras experience without artificial urgency.

## [1.3.7] — 2026-08-26
- Refined gastronomic hover, focus, elevation, and transition states with reduced-motion support.

## [1.3.6] — 2026-08-26
- Strengthened the fire-inspired atmosphere using depth, warm light, surfaces, and controlled gradients.

## [1.3.5] — 2026-08-26
- Added the Dona Rosa signature-pizza section with sensory copy and a dedicated CTA.

## [1.3.4] — 2026-08-26
- Upgraded menu cards with photography, overlays, badges, and stronger editorial hierarchy.

## [1.3.3] — 2026-08-26
- Added original food imagery for pizza, cheese pull, wood-fired oven, and dessert and integrated it into the hero, gallery, and menu.

## [1.3.2] — 2026-08-26
- Rewrote hero, process, menu, recommender, ordering, location, and final CTA copy for a more sensory and product-specific voice.

## [1.3.1] — 2026-08-26
- Promoted food photography to the hero and sharpened the primary CTA and visual-discovery microcopy.

## [1.3.0] — 2026-08-26
- Recalibrated palette, depth, surfaces, hierarchy, and visual rhythm around fire, flour, wood, and tomato.

## [1.2.9] — 2026-08-26
- Stability & Security release focused on client-side hardening, accessibility, and reliability.
