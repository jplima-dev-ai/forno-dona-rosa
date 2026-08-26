# Accessibility

## Baseline

The project targets WCAG 2.2 AA principles and prioritizes practical keyboard and screen-reader usability, especially NVDA on Windows.

## Implemented patterns

- Semantic landmarks and one coherent `h1`.
- Skip link to the main content.
- Native buttons, links, form controls, fieldsets, and labels.
- Visible focus and keyboard-operable navigation.
- Accessible `dialog` components for the Bag and Rosa.
- Focus return after dialogs close.
- Bounded `aria-live`/status announcements for dynamic changes.
- `prefers-reduced-motion` support.
- `forced-colors` support for Windows High Contrast.
- Reflow-aware layouts and scrollable dialogs at high zoom.
- Informative image alternative text where imagery conveys content; decorative imagery uses empty alt text.

## Manual validation still required

Static audits cannot prove full accessibility. Important release checks include NVDA reading order, keyboard flows, focus restoration, zoom/reflow, reduced motion, contrast, and real browser behavior.
