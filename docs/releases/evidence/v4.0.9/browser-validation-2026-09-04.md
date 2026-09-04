# Browser Validation — v4.0.9 — 2026-09-04

## Ambiente

Execução real em Windows usando a suíte Playwright/Chromium do projeto.

## Resultado consolidado

```text
3 skipped
249 passed (6.0m)
0 failed
```

## Cobertura observada no log

A execução incluiu, entre outros contratos:

- rotas públicas e deep links;
- home, menu, pedido, sobre, experiência, localização, ajuda, privacidade, artigos e produtos;
- Admin Studio;
- checkout e regra de retirada sem campos de endereço;
- mobile usability;
- Axe serious/critical;
- reflow em 320 CSS px;
- forced colors e reduced motion;
- semântica nativa do Experience Router;
- nomes e caminhos de fechamento dos dialogs críticos.

## Regressão do Adaptive Commerce

A execução anterior tinha 12 failures, originados por quatro violações de contraste WCAG AA no mesmo card da home, repetidas em desktop, 320, 390, 430, tablet e landscape.

A correção definiu paleta escura explícita sobre a superfície clara do card e preservou o CTA primário com contraste AA. A execução de 2026-09-04 terminou sem failures, confirmando a correção no gate automatizado.

## Limites

Este documento comprova a automação executada. Não comprova por si só experiência humana com NVDA/JAWS/Narrator/VoiceOver/TalkBack, nem Core Web Vitals da versão publicada.
