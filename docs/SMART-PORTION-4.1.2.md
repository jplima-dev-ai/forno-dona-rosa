# Smart Portion & Group Ordering — 4.1.2

## Objetivo

Ajudar o cliente a estimar quantidade e tamanho de pizzas antes de escolher sabores, reduzindo incerteza sem apresentar uma recomendação como cálculo exato.

## Entradas

- adultos: 1–20;
- crianças: 0–12;
- apetite: leve, normal ou alto.

Crianças recebem peso menor na estimativa e o nível de apetite ajusta a margem. Esses fatores são heurísticos de experiência, não orientação nutricional e não garantia de rendimento.

## Saída

O módulo retorna uma combinação de tamanhos Média, Grande e Família e uma faixa aproximada de pessoas atendidas. O usuário pode ignorar a sugestão ou aplicar o tamanho predominante ao configurador.

## Acessibilidade

- formulário com labels nativos;
- apetite agrupado em `fieldset` e `legend`;
- resultado textual completo;
- foco movido ao título do resultado somente após ação explícita de calcular;
- região `role=status` para anunciar a recomendação sem interromper agressivamente;
- handoff para o configurador devolve foco ao seletor de tamanho.

## Responsividade

A experiência usa grid adaptativo e cai para uma coluna em espaços estreitos. Não depende de hover e possui reforço para `forced-colors`.

## Limites

A estimativa não conhece apetite individual, acompanhamentos, desperdício, tamanho real das fatias ou hábitos do grupo. O texto público deixa essa limitação explícita.
