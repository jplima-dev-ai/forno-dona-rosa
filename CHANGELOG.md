# Changelog

## [1.3.9] — 2026-08-26

### Direção de arte e design

- Hero redesenhado com fotografia gastronômica principal.
- Nova seção editorial de galeria com closes, forno a lenha e sobremesa.
- Nova seção de pizza assinatura com foco na Dona Rosa.
- Cartões de cardápio evoluídos para usar imagens reais, overlays e badges.
- Ajustes de ritmo visual, superfícies, sombras e contraste para percepção premium.

### Copywriting

- Hero, ritual, cardápio, assinatura e CTA final reescritos para aumentar desejo e clareza de valor.
- Descrições das pizzas refinadas para linguagem mais sensorial e menos genérica.
- Microcopies e notas de apoio ajustadas para comunicar pedido direto, calor do forno e qualidade dos ingredientes.

### Imagens

- Adicionadas quatro imagens gastronômicas inéditas em `assets/images/`.
- Hero agora usa `hero-dona-rosa.jpg`.
- Menu e seções editoriais passaram a exibir imagens apetitosas coerentes com a identidade da marca.

### Técnica

- `data/menu.js` ganhou campos visuais (`image` e `badge`).
- `js/main.js` passou a renderizar imagens no cardápio sem quebrar o hardening da linha 1.2.x.
- `service-worker.js` atualizado para o cache `forno-dona-rosa-v1.3.9` e para os novos assets.

## [1.2.9] — 2026-08-26

Release anterior focada em estabilidade, segurança e hardening. Consulte o histórico desta versão no repositório anterior.
