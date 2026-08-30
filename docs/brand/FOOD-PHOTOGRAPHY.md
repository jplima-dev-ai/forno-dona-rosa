# Direção de fotografia gastronômica

Este documento define a linguagem visual recomendada para imagens futuras da plataforma.

## Objetivo

A fotografia deve aumentar desejo sem representar ingredientes que o produto não possui. A imagem precisa parecer quente, artesanal e real; não plástica ou excessivamente processada.

## Pizzas salgadas

Prefira ângulo entre 30° e 45°, luz lateral quente, borda com textura visível, queijo com brilho natural e ingredientes identificáveis. Marcas de forno são bem-vindas quando coerentes com o produto.

## Pizzas doces

Use luz ligeiramente mais suave, contraste suficiente para chocolate/frutas e textura de massa ainda perceptível. Evite saturação que torne morango ou chocolate artificiais.

## Bebidas

Priorize leitura clara da embalagem ou conteúdo, condensação discreta e contexto compatível com a mesa da pizzaria. Não use imagens genéricas que possam confundir marca ou volume.

## Consistência

- mantenha temperatura de cor próxima entre produtos;
- preserve espaço suficiente para recortes mobile;
- configure o ponto focal no Admin Studio;
- não invente ingredientes em edição;
- use uma foto distinta quando o sabor tiver composição visual distinta.

## Pipeline técnico

`tools/polish-food-media.py` aplica um tratamento conservador e idempotente às imagens-fonte de pizzas: contraste, cor, brilho e nitidez leves. O script não transforma uma imagem em outro produto e não substitui fotografia original de qualidade.

Depois do polish, `tools/build-media.py` gera derivados AVIF/WebP responsivos e imagem social.

## Acessibilidade

A decisão de `alt` depende do contexto. Quando a foto apenas repete nome e descrição imediatamente adjacentes, `alt=""` pode evitar redundância. Quando a imagem transmite informação não disponível no texto próximo, descreva somente o conteúdo relevante.
