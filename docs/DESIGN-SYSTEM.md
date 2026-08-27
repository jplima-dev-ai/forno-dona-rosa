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
