# Forno Dona Rosa 3.4.0 — Stabilization Release

A versão 3.4.0 é a linha corrente de estabilização. Nenhuma versão posterior deve ser criada até que os bugs conhecidos sejam eliminados ou haja ordem explícita do responsável pelo projeto.

## Objetivo

Consolidar a experiência comercial existente, corrigir regressões reais e falsos negativos de testes, e fechar evidência de navegador e NVDA sem adicionar nova superfície funcional.

## Estado atual

- Windows Playwright na build correta: **403 passed, 0 failed, 17 skipped (8.4m)**.
- Matriz observada: desktop, 320 px, 390 px, 430 px, tablet e landscape.
- Axe serious/critical e contratos automatizados de acessibilidade: PASS dentro da matriz executada.
- Reflow, rotas/deep links, checkout, sacola, Rosa Concierge, Admin e fluxos críticos de comércio passaram na rodada automatizada.
- GitHub Actions **Quality**: PASS na `main`.
- GitHub Actions **Browser Certification**: PASS na `main`.
- GitHub Pages build/deployment: PASS.
- NVDA manual: **MANUAL_REQUIRED**.
- Core Web Vitals em ambiente publicado: medição pendente.

## Correções de estabilização consolidadas

- confirmações pendentes da Rosa (`sim`/`não`) ignoram o throttle normal de mensagens;
- a suíte não tenta interagir com a Sacola atrás do dialog modal da Rosa;
- testes frágeis de estado de sacola, checkout e Admin foram ajustados para medir o contrato real;
- contraste, alvos touch e overflow detectados nas primeiras rodadas foram corrigidos na camada comum;
- servidor E2E local foi estabilizado para reduzir recusas de conexão;
- manifesto e evidence ledger registram o estado real da matriz Windows sem confundir automação com NVDA;
- hotfix pós-tag de CI adicionou a dependência Python `packaging==26.3`, necessária pelos release gates no GitHub Actions.

## Proveniência Git

- Tag publicada: `v3.4.0`.
- Commit de estabilização marcado pela tag: `4fd196c56d78ce1317070681ab4ecb30d172a570` (`release: stabilize Forno Dona Rosa 3.4.0`).
- Hotfix pós-tag de CI na `main`: `a2f145d7cb187f2f028eecc485ff81c0091beac8` (`fix(ci): install packaging for release gates`).
- A tag `v3.4.0` permanece imutável para preservar rastreabilidade; o hotfix não altera o runtime do produto, apenas o ambiente de validação remota.

## Decisão

A matriz automatizada de navegador da 3.4.0 está **PASS**, e a validação remota no GitHub também está **PASS** para Quality, Browser Certification e Pages. A release ainda não deve ser descrita como manualmente certificada para leitores de tela até a conclusão da validação humana com NVDA. A evidência consolidada está em `docs/releases/evidence/v3.4.0/summary.md`.
