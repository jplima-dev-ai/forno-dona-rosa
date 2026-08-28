# Design System

## Direction

Forno Dona Rosa uses an editorial food aesthetic inspired by fire, flour, wood, tomato, and warm restaurant lighting. Premium means intentional hierarchy and restraint rather than excessive visual effects.

## Core roles

- Charcoal/dark brown: primary background and depth.
- Cream: primary readable text.
- Terracotta/tomato: brand and action emphasis.
- Warm gold: process, focus, and premium accents.
- Olive: secondary natural-food cues.

## Typography

- `Fraunces` for expressive display headings.
- `Manrope` for interface/body text.
- `Space Mono` for compact labels, process markers, and technical-style details.

## Interaction rules

Hover is enhancement only. Keyboard focus remains visible. Motion must have a purpose and must respect reduced-motion preferences.

## Brand layer

`css/brand-theme.css` is the client-specific token layer. It should change before core component CSS when adapting a client. Brand assets live under `assets/images/brand/`; product photography and structural UI rules remain separate. A new client should feel bespoke through art direction, copy and tokens without forking accessibility or responsive component behavior.

## v2.9 mobile refinement layer

The v2.9 layer treats mobile as a deliberate commerce composition rather than a reduced desktop layout.

### Mobile priorities

1. Primary purchase actions before secondary assistance.
2. Lower vertical cost per product decision.
3. One-handed reach for Bag, navigation and checkout actions.
4. No duplicated DOM for desktop/mobile variants.
5. Safe-area-aware fixed surfaces.
6. Content-driven breakpoints, including narrow-phone and landscape stress cases.

### Product card behavior

- Desktop/tablet: image-first editorial card grid.
- Narrow phone: horizontal image/content card for faster scanning.
- Product name, current price, availability and purchase action remain visible.
- Descriptive and sensory content compresses progressively but remains available in product details.

### Fixed mobile surfaces

The four-item navigation dock is shown while the Bag is empty. Once the Bag has content, the Bag continuation bar replaces the navigation dock so two competing bottom bars are not stacked. Rosa remains secondary and sits above the active commerce surface.
