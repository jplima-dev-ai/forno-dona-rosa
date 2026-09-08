# Forno Dona Rosa 4.1.0 — Variant Commerce Engine

## Resumo

A 4.1.0 inicia a linha 4.1 transformando o tamanho da pizza em uma capacidade comercial explícita. Média, Grande e Família deixam de existir apenas como multiplicadores globais e passam a ser variantes de cada pizza.

## Valor para o cliente

Ao escolher o sabor, o seletor apresenta tamanho, diâmetro, rendimento estimado e preço calculado para a configuração atual. O tamanho segue para a Sacola, revisão e mensagem do pedido.

## Engenharia

- catálogo schema v4;
- bag schema v4 com migração v3;
- API `FORNO_VARIANTS`;
- fallback para catálogo legado;
- compatibilidade com meio a meio e bordas;
- testes estruturais e comportamentais dedicados.

## Evidência pendente

Os gates locais `npm run quality` e `npm run security` foram executados e aprovados no ambiente de construção. A suíte Playwright específica de variantes foi adicionada, mas a execução em navegador real permanece pendente para o Windows do projeto. Teste humano com NVDA continua sendo evidência manual; não é declarado como PASS por esta documentação.
