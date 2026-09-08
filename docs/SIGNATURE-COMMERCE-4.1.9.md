# Signature Commerce 4.1.9

## Objetivo
Consolidar a linha 4.1 sem ampliar feature surface: validar contratos cruzados de variantes, configurador, porções, Mesa, harmonização, sacola, Rosa, Admin, checkout, offline, acessibilidade e responsividade.

## Regras de liberação
- Nenhuma mutação comercial pode contornar os normalizadores da sacola.
- Nenhuma recomendação adiciona item automaticamente.
- Alteração de tamanho pela Rosa exige confirmação quando modifica item existente.
- Entrega e retirada continuam isoladas no checkout.
- A Accessibility Fortress deve estar presente em todas as páginas estáticas geradas.
- `NOT_TESTED` e `MANUAL_REQUIRED` nunca podem ser promovidos para PASS sem execução real.

## Evidência esperada
A aprovação final no Windows deve registrar `npm run quality`, `npm run security`, Playwright completo, contratos Axe e teste manual NVDA. CWV só pode ser fechado depois da publicação.
