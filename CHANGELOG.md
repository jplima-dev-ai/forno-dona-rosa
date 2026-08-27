# Changelog

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
