# Forno Dona Rosa 3.4.1 — Performance Evidence

## Escopo

A 3.4.1 é uma release de estabilização de performance mobile baseada em medição do ambiente publicado, sem ampliação da superfície funcional de pedidos.

## Baseline publicada da 3.4.0 — 2026-09-12

URL: `https://jplima-dev-ai.github.io/forno-dona-rosa/`

### Mobile

- Lighthouse Performance: 70
- FCP: 3160 ms
- LCP: 3310 ms
- TBT: 144 ms
- CLS: 0.282

### Desktop

- Lighthouse Performance: 96
- FCP: 858 ms
- LCP: 878 ms
- TBT: 0 ms
- CLS: 0.091

## Diagnóstico comprovado

- O CLS mobile foi causado pela troca tardia das webfonts Manrope, Fraunces e Space Mono.
- O LCP mobile observado é o bloco `experience-router__grid`, não a imagem principal da hero.
- Após remover as webfonts externas, o CLS caiu para aproximadamente zero nas medições de PR.
- A segunda fonte de atraso identificada foi o caminho crítico composto por múltiplas folhas de estilo e scripts clássicos síncronos.

## Mudanças da 3.4.1

- tipografia local com stacks estáveis de sistema, serif e mono;
- remoção de Google Fonts do caminho crítico;
- correção da geometria intrínseca da imagem principal;
- bundle CSS único da home preservando a ordem de cascata anterior;
- scripts externos locais carregados com `defer`, preservando a ordem de execução;
- atualização da versão, cache do service worker, manifesto e metadados para 3.4.1;
- evidência manual de NVDA no Windows e TalkBack no Android preservada como PASS;
- JAWS, Narrator e VoiceOver permanecem explicitamente não testados, sem alegação de aprovação.

## Estado

A release permanece **PENDING** até que Quality, Browser Certification e o reteste Lighthouse da 3.4.1 estejam concluídos. A aprovação final de performance será baseada na versão efetivamente publicada no GitHub Pages, não apenas no servidor local sem compressão usado pelo CI.
