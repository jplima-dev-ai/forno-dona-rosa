# Forno Dona Rosa — Visual Desire System 4.0

## Objetivo
Fazer a mídia comunicar calor, textura, frescor e qualidade antes da leitura do nome do produto, sem sacrificar autenticidade, performance ou acessibilidade.

## Regra central
A imagem deve aumentar compreensão e desejo. Não deve prometer uma aparência impossível de reproduzir no produto real.

## DNA visual da marca
- luz quente e lateral, como proximidade de forno;
- contraste suficiente para separar queijo, molho, borda e ingredientes;
- madeira escura, pedra ou superfície quente de baixa distração;
- composição editorial, evitando excesso de objetos decorativos;
- borda sempre legível nas pizzas;
- textura real: pontos tostados, queijo, molho, vegetais e carnes diferenciáveis;
- atmosfera consistente em todo o catálogo.

## Sistema de mídia por pizza
### Catalog
Uso: cards, busca, favoritos, Rosa e recomendações.
- enquadramento 4:3 ou 1:1 seguro;
- pizza ocupa a maior parte da cena;
- leitura imediata em 320–430 px;
- fundo simples;
- ingredientes principais distinguíveis.

### Hero
Uso: página do produto e destaque editorial.
- preferência por 4:3 ou 3:2;
- ângulo de aproximadamente 35–55 graus ou top-down cuidadosamente composto;
- borda dourada e volume do recheio visíveis;
- espaço negativo controlado para copy quando necessário.

### Detail
Uso: galeria de produto.
- close de uma fatia, borda ou ingrediente assinatura;
- pode mostrar uma fatia levantada quando isso for fiel ao produto;
- sem “cheese pull” artificial quando a receita não produz esse efeito.

## Sistema de mídia por bebida
- comunicar frio por condensação, gelo ou contexto real;
- preservar rótulo/embalagem sem deformação;
- fundo menos quente que a pizza para criar contraste térmico;
- brilho especular controlado;
- latas/garrafas não devem parecer flutuar;
- bebidas de compartilhar precisam comunicar escala.

## Nordestina da Dona Rosa — direção fotográfica
Cena principal:
- pizza em ângulo 3/4;
- carne de sol visivelmente desfiada e distribuída;
- cebola roxa criando contraste cromático;
- requeijão em pontos cremosos, sem cobrir toda a superfície;
- borda dourada com pontos tostados;
- brilho discreto que sugira a finalização de manteiga de garrafa;
- uma fatia levemente destacada como versão Detail, não obrigatoriamente no Catalog.

Evitar:
- carne seca visualmente;
- excesso de requeijão escondendo ingredientes;
- cebola crua em volume desproporcional;
- cenário folclórico caricato do Nordeste;
- elementos decorativos que transformem regionalidade em fantasia.

## Alt text
O alt descreve o que importa para identificar o produto. Não repete preço, badge ou frases promocionais já adjacentes.

Exemplo catalog:
“Pizza Nordestina da Dona Rosa com carne de sol desfiada, cebola roxa, requeijão cremoso e borda dourada.”

Exemplo detail:
“Fatia da pizza Nordestina da Dona Rosa destacando carne de sol, requeijão cremoso e cebola roxa sobre a massa assada.”

## Art direction responsiva
- não usar apenas `object-fit: cover` como solução universal;
- focal point é dado do produto;
- permitir variantes `catalog`, `hero` e `detail` quando existirem;
- usar `srcset`/`sizes` em mídia gerada;
- preservar ingrediente assinatura no crop mobile;
- `width`/`height` ou `aspect-ratio` definidos para evitar layout shift.

## Guia de geração/produção
Para cada produto, manter uma ficha com:
- ingredientes visualmente prioritários;
- ângulo;
- distância;
- tipo de luz;
- fundo;
- focal point mobile;
- focal point desktop;
- riscos de falsificação visual;
- alt text catalog;
- alt text detail.

## Quality gate visual
Rejeitar mídia quando:
- a pizza não é identificável em miniatura;
- a borda desaparece no crop;
- ingredientes importantes parecem artificiais;
- a imagem promete uma quantidade incompatível com a receita;
- a bebida não comunica corretamente seu formato/volume;
- o arquivo excede budget sem ganho perceptível;
- o contraste do overlay reduz legibilidade;
- o alt não diferencia produtos semelhantes.
