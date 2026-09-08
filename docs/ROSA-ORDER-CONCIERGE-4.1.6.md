# Rosa Order Concierge 3.0 — 4.1.6

## Objetivo

Permitir que a Rosa trabalhe com o estado real do pedido sem criar um segundo motor de comércio. A interpretação de linguagem natural termina sempre nas APIs públicas já existentes da sacola e do Variant Commerce Engine.

## Comandos suportados nesta versão

- `quero uma calabresa grande`: adiciona uma Calabresa no tamanho Grande usando `addConfiguredProduct()`.
- `quanto fica a calabresa família?`: informa o preço da variante sem alterar a sacola.
- `troque a primeira pizza para família`: identifica a primeira pizza da sacola e prepara a alteração.
- `sim`: confirma a alteração pendente e só então chama `updateBagItem()`.
- `não`: cancela a alteração sem mutar a sacola.
- `calabresa família serve quantas pessoas?`: informa a faixa demonstrativa como estimativa, não garantia.

## Contrato de segurança

Perguntas de preço são somente leitura. Mudança de tamanho de item existente pode modificar o valor e por isso exige confirmação explícita. Quando a pizza da sacola não é identificada de forma inequívoca, a Rosa pede nome ou ordinal em vez de escolher sozinha.

A confirmação é persistida somente na sessão e passa por sanitização de `itemId`, `productId` e tamanho. No momento da confirmação, a própria `updateBagItem()` revalida o item e recalcula o preço pela fonte de verdade do comércio.

## Acessibilidade

A feature reutiliza o diálogo e o log acessíveis da Rosa. Não cria controles customizados adicionais. O usuário pode digitar, receber a resposta no fluxo existente e confirmar com texto simples. Mudanças de estado continuam sendo anunciadas pelo mecanismo de status já presente na Rosa.

A validação humana com NVDA permanece `MANUAL_REQUIRED` até o ciclo final 4.1.9.

## Limitações conscientes

A 4.1.6 não tenta interpretar qualquer frase arbitrária. O escopo é intencionalmente restrito a comandos que possam ser executados com alta confiança e baixo risco. Ingredientes, meio a meio e ações compostas mais complexas continuam nos fluxos visuais ou exigem comandos futuros explicitamente modelados.
