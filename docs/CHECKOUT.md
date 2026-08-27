# Local Smart Checkout

## Goal

The v2.4 checkout reduces WhatsApp back-and-forth by preparing a structured customer-and-delivery payload before handoff. It remains a static front-end flow: no account, payment processor, server-side customer profile or automatic order submission is introduced.

## Customer flow

1. Review the Bag.
2. Continue to delivery details.
3. Enter the customer's name and CEP.
4. Resolve the CEP through ViaCEP, with BrasilAPI CEP v1 as fallback.
5. Validate that the resolved city/state is Serra — ES.
6. Complete house/building number and optional complement/reference.
7. Review customer, address and Bag summary.
8. Open WhatsApp with a prefilled message; the customer still sends it manually.

## Delivery rules

- Supported city: Serra.
- Supported state: ES.
- A successful provider lookup outside Serra — ES blocks checkout handoff.
- When both providers fail, manual street/neighborhood entry remains possible, but the UI explicitly marks the address as requiring confirmation by staff.
- City and state remain constrained to Serra — ES in manual fallback mode.

## Privacy

- CEP lookup sends only the CEP to the selected postal provider.
- Name, house/building number, complement and landmark are not sent to CEP providers.
- Form progress uses `sessionStorage` by default.
- Persistent address storage requires explicit opt-in.
- A saved address can be deleted from the checkout.
- Non-persistent session checkout data is removed after a successful WhatsApp handoff.

## Accessibility

- Native `dialog` semantics with labelled title and description.
- Explicit text close action.
- Field labels remain visible.
- Field errors are specific and linked to their fields.
- CEP lookup emits one concise live-region update.
- Focus moves to the next customer-editable field after lookup.
- Main actions exceed minimum touch target expectations on mobile.
- Layout reflows to a single column and full-height mobile surface.
- Forced-colors styling is included.

## External services

The current browser-side postal lookup uses:

- ViaCEP: `https://viacep.com.br/ws/{CEP}/json/`
- BrasilAPI CEP v1: `https://brasilapi.com.br/api/cep/v1/{CEP}`

These services are used only for address assistance. Order availability, delivery acceptance and final value remain confirmed by the pizzeria in WhatsApp.
