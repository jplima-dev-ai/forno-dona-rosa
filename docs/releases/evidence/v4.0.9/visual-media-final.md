# Visual Media Evidence — v4.0.9 FINAL

## Resultado

- Pizzas no catálogo: **23**
- Imagens-base únicas de pizza: **23**
- Duplicação binária entre pizzas: **0**
- Variantes WebP obrigatórias por pizza: **384 / 480 / 800 / 1200**
- Variantes AVIF: **480 / 800 / 1200** e 384 conforme pipeline final
- Crop social WebP: **presente**
- Nordestina da Dona Rosa: **asset próprio publicado** (`nordestina-dona-rosa-pizza.webp`)
- Pizzas doces: **Nutella com Morango, Chocolate Belga, Banana/Canela/Doce de Leite e Romeu e Julieta com fotografia própria**

## Gate

`python tools/visual-media-uniqueness-check.py`

Resultado executado:

```text
VISUAL MEDIA UNIQUENESS: PASS — 23 pizzas, 23 imagens-base únicas
```

## Quality

`npm run quality` executado na árvore real transformada para 4.0.9: **PASS**.

A validação automatizada não substitui avaliação humana da fidelidade entre fotografia e produto servido no mundo real.
