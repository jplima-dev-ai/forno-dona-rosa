# Release 4.1.6 — Rosa Order Concierge 3.0

A 4.1.6 conecta linguagem natural à arquitetura comercial construída entre 4.1.0 e 4.1.5. A Rosa passa a consultar variantes, adicionar pizzas já dimensionadas e preparar edição de tamanho em itens existentes da sacola.

## Critérios de aceite

- consulta de preço não altera a sacola;
- adição explícita respeita o tamanho pedido;
- edição de tamanho exige confirmação;
- confirmação usa `FORNO_APP.updateBagItem()`;
- ambiguidades não executam mutação;
- comportamento anterior da Rosa continua protegido;
- módulo entra no shell offline;
- documentação e versão permanecem sincronizadas.

## Evidência automatizada local

Os gates executados nesta release são registrados em `docs/releases/evidence/v4.1.6/summary.md`.

## Pendente para 4.1.9

Playwright real em navegador, validação humana NVDA e Core Web Vitals publicados continuam separados do status dos gates estruturais locais.
