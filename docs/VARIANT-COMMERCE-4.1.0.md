# Variant Commerce Engine — 4.1.0

## Objetivo

Transformar tamanho de pizza em um contrato de variante explícito, reutilizável e editável, preservando compatibilidade com pedidos 4.0.

## Contrato

Cada pizza pode declarar `variants`. Cada variante possui `id`, `label`, `price`, `diameterCm`, `serves` e `available`. Bebidas não recebem variantes de pizza.

A ordem canônica inicial é Média, Grande e Família. O catálogo atual usa 30 cm / 1–2 pessoas, 35 cm / 2–3 pessoas e 40 cm / 3–5 pessoas como informação demonstrativa configurável. Esses dados não devem ser tratados como promessa operacional sem revisão do estabelecimento.

## Preço

O runtime prefere `variant.price`. Para catálogos legados sem `variants`, calcula o preço usando `pricing.sizes.*.multiplier`. No meio a meio, mantém a regra de maior preço para o tamanho comum escolhido. Borda continua sendo adicionada depois do preço da variante.

## Acessibilidade

O controle usa `select` nativo com `label`. `aria-describedby` aponta para uma ajuda contextual que informa diâmetro, rendimento estimado e que o preço é atualizado conforme sabor e borda. Não existe `role` customizado.

## Persistência

A sacola passa de `bag-v3` para `bag-v4`. Ao iniciar, a aplicação procura v4; na ausência, lê v3, depois v2 e por último o carrinho legado. O estado normalizado é regravado em v4 e chaves legadas são removidas.

## Compatibilidade futura

O motor aceita variantes específicas por produto. Assim uma pizza pode desabilitar Família, alterar preço ou rendimento sem condicional espalhada pelo runtime. O mesmo modelo pode evoluir para outros negócios white-label.
