# Forno Dona Rosa 4.1.8

## Adaptive Ordering & Accessibility Fortress
Release de hardening dos fluxos de pedido 4.1. Adiciona contrato explícito de acessibilidade, camada de reflow/zoom/forced-colors/reduced-motion e suíte E2E dedicada para fluxos comerciais críticos.

## Added
- `css/accessibility-fortress-v4-1-8.css`;
- `data/accessibility-ordering-contract-v4-1-8.json`;
- gate estrutural e release gate 4.1.8;
- suíte Playwright `accessibility-fortress-v4-1-8.spec.js`.

## Changed
- versão sincronizada para 4.1.8;
- shell offline inclui a nova camada CSS;
- home e Admin Studio carregam o hardening compartilhado.

## Evidence status
Testes estruturais locais podem ser executados no gate 4.1.8. Playwright real, NVDA e CWV publicado devem ser registrados somente após execução real.
