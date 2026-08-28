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

## v2.4 delivery checkout

The checkout is intentionally optimized for low digital familiarity as well as assistive technology use. Required fields keep visible labels, error text explains how to recover, and CEP lookup produces one concise status update rather than announcing every auto-filled field. After a successful lookup, focus moves to the next editable address field; when the provider omits street or neighborhood, only the missing fields become editable while city/state remain constrained to Serra — ES.

Primary checkout actions use explicit outcome-oriented labels and larger mobile targets. The full-screen mobile layout supports reflow, virtual keyboards, safe areas, forced colors and keyboard-only operation. A real NVDA/device pass remains required before claiming production conformance.

## v2.9 responsive accessibility notes

The v2.9 mobile redesign changes visual composition without changing semantic DOM order. Product cards, navigation, Bag and checkout are not duplicated into separate mobile and desktop trees. This protects reading order and focus order from visual/DOM divergence.

The refined CSS preserves visible focus, safe-area spacing, forced-colors fallbacks and reduced-motion behavior. Automated/static validation is not a substitute for NVDA, JAWS, Narrator, TalkBack or VoiceOver testing; those combinations remain `NOT TESTED` unless an evidence ledger explicitly records real execution.
