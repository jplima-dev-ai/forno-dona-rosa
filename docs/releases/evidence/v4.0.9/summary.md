# Evidence Ledger — v4.0.9

Atualizado em **2026-09-04** após execução real da suíte Playwright/Chromium no Windows.

| Gate / evidência | Status | O que significa |
|---|---|---|
| Integridade ZIP | AUTOMATED_PASS | O pacote pode ser lido sem membro corrompido |
| Python release tests | AUTOMATED_PASS | Contratos do upgrade/final gate passaram |
| JS syntax 4.0.9 | AUTOMATED_PASS | Módulos passaram `node --check` |
| Baseline 3.9.9 → 4.0.9 | AUTOMATED_PASS | A sequência cumulativa foi aplicada sobre a árvore real |
| `npm run quality` | AUTOMATED_PASS | Quality gate consolidado aprovado |
| Release forensic gate | AUTOMATED_PASS | Contratos forenses, budgets e integridade estrutural aprovados |
| Visual media uniqueness | AUTOMATED_PASS | 23 pizzas / 23 imagens-base únicas |
| Playwright browser matrix | AUTOMATED_PASS | Execução real no Windows/Chromium terminou com **249 passed, 3 skipped, 0 failed** |
| Axe serious/critical | AUTOMATED_PASS | Nenhuma falha bloqueadora nas rotas/viewports cobertos pela suíte final |
| Reflow 320 px | AUTOMATED_PASS | Sem overflow horizontal de página no contrato testado |
| Forced colors / reduced motion | AUTOMATED_PASS | Controles críticos preservados nos cenários automatizados |
| NVDA | MANUAL_REQUIRED | Requer execução humana real com leitor de tela |
| Narrator/JAWS/VoiceOver/TalkBack | NOT_TESTED | Não há execução humana registrada nesta release |
| Core Web Vitals publicados | NOT_MEASURED | Requer medição da versão publicada em ambiente real |

## Resultado final do browser

```text
3 skipped
249 passed (6.0m)
0 failed
```

Os 12 failures observados na execução anterior eram a repetição do mesmo defeito de contraste no Adaptive Commerce em seis viewports. A correção foi aplicada em `css/adaptive-commerce-v4.css` e a nova execução completa confirmou a regressão resolvida.

## Política de evidência

Automação e teste humano permanecem separados. `AUTOMATED_PASS` não equivale a certificação manual de NVDA, JAWS, Narrator, VoiceOver, TalkBack ou dispositivo físico. Core Web Vitals só será declarado medido após publicação.
