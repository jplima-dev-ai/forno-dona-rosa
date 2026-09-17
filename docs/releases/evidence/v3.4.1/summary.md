# Evidence — Forno Dona Rosa 3.4.1 Maintenance Release

## Estado

A 3.4.1 consolida a manutenção integrada após a estabilização 3.4.0. Este ledger separa evidência realmente executada de evidência histórica herdada.

## Build e integridade local

- `npm run build`: PASS no bump 3.4.1; 55 páginas + sitemap gerados.
- catálogo sincronizado: 32 produtos.
- media build: 32 produtos verificados, sem rebuild necessário na rodada observada.
- HTML público após o bump: nenhuma ocorrência residual de versão 3.4.0.
- `git diff --check`: sem erro de whitespace; avisos LF/CRLF do Git no Windows não são tratados como falha.

## Evidência de manutenção integrada antes do bump formal

PR #8, posteriormente integrado à `main`, validou a linha de manutenção que compõe a 3.4.1:

- Quality: PASS;
- Browser Certification: PASS;
- Performance Baseline: PASS.

Performance Baseline #14, em execução de PR:

- mobile mediana: Performance 77; FCP 1955,8 ms; LCP sintético 5932,9 ms; TBT 25,5 ms; CLS 0; observed LCP 180 ms;
- desktop: Performance 98; FCP 445,4 ms; LCP sintético 1191,1 ms; TBT 0; CLS 0,0029; observed LCP 265 ms.

Os valores Lighthouse/Lantern sintéticos não são apresentados como latência observada literal.

## Tecnologia assistiva — 3.4.1

- NVDA no Windows: **MANUAL PASS na 3.4.1**, conforme teste humano informado pelo responsável pelo projeto.
- TalkBack no Android: **MANUAL PASS na 3.4.1**, conforme teste humano informado pelo responsável pelo projeto.
- JAWS: não testado.
- Narrator: não testado.
- VoiceOver: não testado.

A evidência manual da 3.4.0 permanece preservada como baseline histórica independente.

## Evidência ainda pendente

- nova execução completa de Playwright/Axe especificamente sobre o bump formal 3.4.1, caso se deseje renovar a matriz automatizada além da baseline integrada;
- Core Web Vitals de campo no ambiente publicado.

## Regra de interpretação

`PASS` significa executado e aprovado. Para NVDA e TalkBack, o PASS 3.4.1 corresponde ao teste humano informado pelo responsável pelo projeto. `NOT_TESTED_NO_ACCESS` permanece sem claim de compatibilidade.
