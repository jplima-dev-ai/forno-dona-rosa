# Forno Dona Rosa 4.1.5 — Intelligent Bag 2.0

## Destaque

A sacola agora edita configuração de pizzas sem obrigar o usuário a remover o item e repetir o fluxo de montagem.

## Added

- editor de pizza dentro da sacola;
- troca de tamanho com preços e variantes válidas;
- troca de borda;
- edição de remoções e observações;
- prévia de novo subtotal antes de salvar;
- API `FORNO_APP.updateBagItem` para evolução da Rosa na 4.1.6;
- `FORNO_APP.getBagItems` com snapshots imutáveis;
- suíte estrutural, comportamental e E2E específica.

## Accessibility

Controles nativos, foco previsível, `aria-expanded`, cancelamento reversível e anúncio de atualização. Validação humana com NVDA permanece `MANUAL_REQUIRED` até a 4.1.9.

## Compatibility

O schema da sacola permanece v4, porque a forma persistida dos itens não mudou.
