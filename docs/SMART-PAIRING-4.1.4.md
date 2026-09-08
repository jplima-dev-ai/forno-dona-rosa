# Smart Pairing Engine — 4.1.4

A 4.1.4 adiciona harmonizações editoriais contextuais para pizzas do catálogo. O motor sugere bebida e sobremesa disponíveis, explica resumidamente a combinação e nunca adiciona itens automaticamente à Sacola.

## Contrato
- recomendações são sugestões, não regras;
- apenas itens disponíveis podem ser sugeridos;
- interação de adição exige botão explícito;
- controles são HTML nativo e o resultado recebe foco após solicitação;
- o módulo funciona localmente e faz parte do shell offline.

## Evidência
Gates locais estruturais e comportamentais são registrados em `docs/releases/evidence/v4.1.4/summary.md`. Playwright real e NVDA permanecem pendentes até o ciclo 4.1.9 conforme estratégia de validação escolhida.
