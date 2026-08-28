# Checkout — v2.9.9

## Goal

Keep ordering short while supporting real pizzeria operations. The checkout is local/browser-first and hands the final message to WhatsApp; it never sends an order automatically.

## Flow

Sacola → fulfillment → customer data → timing → payment → review → WhatsApp.

## Fulfillment

- **Delivery:** Serra — ES only. CEP uses ViaCEP first and BrasilAPI as fallback; provider failure allows manual street/bairro input while the business confirms the address.
- **Pickup:** removes delivery-address requirements and shows the configured pizzeria address.

## Timing

- ASAP is available.
- Scheduling is enabled for the reference implementation.
- Scheduled civil time is checked against configured business hours, minimum lead time and maximum days ahead.

## Payment

The Forno Dona Rosa reference accepts only **Pix** and **cash**. Cash may include an optional change amount. If entered, it must be at least the current demonstrative subtotal.

## Operational truth

Delivery fee and ETA are configurable. Until the business provides real numbers, the reference implementation explicitly says they are confirmed on WhatsApp. Availability and final value are also confirmed by the pizzeria.

## Privacy

Name/address are session-only by default. Persistent address storage requires an unchecked explicit opt-in and can be deleted from the checkout. Browser storage is treated as untrusted input and sanitized before reuse.

## Accessibility contracts

Choices use native radio controls grouped by `fieldset`/`legend`; errors are associated with fields; review receives heading focus before the final handoff action; conditional fields are removed from the active flow with `hidden`; WhatsApp handoff is disclosed as manual. Automated checks do not substitute NVDA, JAWS, Narrator, TalkBack or VoiceOver testing.
