# Reusable component contracts

These contracts define behavior that must survive client customization.

## Brand header
- Uses the client logo from `brand.json`.
- Keeps an accessible text name for screen readers.
- Remains compact at narrow widths and does not force horizontal scrolling.

## Product card
- Product name remains a semantic heading in context.
- Price is textual, not encoded only through visual styling.
- Product images are decorative when equivalent name/description text is adjacent.
- Touch actions stay comfortably sized and keyboard operable.

## Product detail dialog
- Uses native `<dialog>` semantics.
- Has an accessible title and description.
- Restores focus after close.
- Product capability determines which modifiers are shown.

## Bag
- Never trusts persisted prices or unknown product IDs.
- Recalculates totals from the current catalog.
- Announces meaningful add/remove/quantity changes without flooding assistive technology.
- Groups products through catalog semantics rather than presentation order alone.

## Checkout
- Keeps visible labels and actionable error copy.
- Preserves entered values when validation fails.
- Treats provider-returned address data as input that still passes delivery-boundary validation.
- Does not persist personal address data unless the user explicitly opts in.

## Assistant
- Uses configured assistant name, role and brand identity.
- Receives only a sanitized application bridge, not unrestricted internal state.
- Does not invent unavailable commercial facts.
- Destructive actions require confirmation.

## Fixed mobile UI
- Must respect safe-area insets.
- Must not cover the focused field when the virtual keyboard is open.
- Bag navigation takes priority over secondary fixed navigation when an order exists.
