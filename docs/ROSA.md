# Rosa — Local Conversational Hostess

## Purpose
Rosa is the local conversational layer of the Forno Dona Rosa portfolio project. She helps customers discover, compare and add menu items, review the Bag and reach the WhatsApp confirmation step without pretending to be a remote generative-AI service.

## Product principles
- Local-first and privacy-preserving.
- Short, useful responses by default.
- No invented delivery area, stock, preparation time or commercial availability.
- Destructive actions require explicit confirmation.
- Ambiguous product actions ask before mutating the Bag.
- Recommendations are explainable from canonical menu traits and temporary session preferences.

## Session model
Rosa uses `sessionStorage` under schema v4. The state is intentionally short-lived and limited to:
- recent conversation messages;
- temporary preference flags;
- recently referenced product IDs;
- one pending destructive confirmation.

The session is sanitized before reuse. Clearing the conversation removes messages, preferences and pending state. No conversational profile is persisted across browser sessions.

## Intent resolution
The pipeline is deterministic:
1. normalize and limit input;
2. recognize products and stronger exact aliases;
3. extract temporary preferences;
4. resolve action or informational intent;
5. use recent product references when the user says “the first”, “the second” or similar;
6. ask for disambiguation when several products are plausible;
7. execute only validated application actions.

## Recommendations
Recommendations use current catalog traits such as `suave`, `intensa`, `queijo`, `vegetariana`, `vegana`, `picante`, `doce` and product type. The engine ranks a small set and can explain the choice using only preferences present in the current session.

## Product actions
Rosa cards provide:
- Add to Bag;
- View details.

All actions use canonical catalog IDs. Add actions verify the application result before announcing success.

## Destructive actions
Clearing the Bag is never executed immediately from the first natural-language command. Rosa stores a pending `clear-bag` action and requires an explicit yes/no response.

## Accessibility
Rosa uses:
- a native `dialog`;
- real buttons and textarea controls;
- focus return to the invoking control;
- a conversation `role=log`;
- a separate polite status region for only the newest response;
- keyboard-operable quick actions and product-card actions;
- forced-colors support;
- mobile full-screen reflow and safe-area spacing.

Manual NVDA, real-device mobile, browser rendering, zoom and E2E validation are still required before claiming full production verification. Static and behavior gates do not replace assistive-technology testing.

## Behavior regression
Run:

```bash
node tools/rosa-behavior-check.js
```

The suite executes the real Rosa classification code in a controlled browser-like context and checks representative Portuguese prompts for preference extraction, comparison, ambiguous and exact product matching, destructive intent and detail actions.
