# Accessibility Certification Layer — 4.0.7

Esta camada é um ledger de evidência, não um selo de conformidade universal.

## Contratos de autonomia
O release protege Home, Cardápio/Busca, Produto, Rosa, Sacola, Checkout e Admin Studio. Cada fluxo é avaliado por semântica, teclado, foco, nomes/estados, recuperação de erro e reflow quando aplicável.

## Estados de evidência
- `AUTOMATED_PASS`: passou em verificação automatizada executada.
- `MANUAL_REQUIRED`: contrato requer tecnologia assistiva real.
- `NOT_TESTED`: ainda não existe evidência suficiente.
- `NOT_APPLICABLE`: não se aplica ao fluxo.

## Matriz manual prioritária
1. Windows + Chrome/Edge + NVDA: fluxo completo de compra.
2. Windows + Firefox + NVDA: navegação, cardápio, produto e checkout.
3. Windows + Edge + Narrator: smoke de autonomia.
4. macOS + Safari + VoiceOver: recomendado antes de declaração multiplataforma.

Nunca converter `MANUAL_REQUIRED` ou `NOT_TESTED` em PASS por inferência.

## Status automatizado da release 4.0.9

Em 2026-09-04, a suíte real Playwright/Chromium concluiu **249 passed, 3 skipped, 0 failed**. O gate Axe serious/critical e os contratos automatizados de reflow, forced colors, reduced motion, semântica e dialogs críticos passaram.

A matriz humana com NVDA/JAWS/Narrator/VoiceOver/TalkBack permanece independente e não é inferida desse resultado.
