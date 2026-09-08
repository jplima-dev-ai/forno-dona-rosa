# Evidence — Forno Dona Rosa 3.4.0 Stabilization

## Estado corrente
A linha comercial corrente permanece **3.4.0**. Esta evidência consolida a estabilização final de navegador depois dos ciclos históricos 4.1.x, sem renomear arquivos antigos que preservam proveniência técnica.

## Windows Playwright — evidência fornecida pelo operador
- Data: 2026-09-08.
- Ambiente: Windows + Chromium Playwright.
- Projetos executados: desktop, 320 px, 390 px, 430 px, tablet e landscape.
- Resultado final: **403 passed, 0 failed, 17 skipped (8.4m)**.
- A suíte mostrou explicitamente o marcador `3.4.0 Rosa Order Concierge stabilization`, confirmando a build correta.
- Os 17 skips são condicionais da matriz e não foram convertidos em PASS.

## Cobertura observada na rodada verde
A execução incluiu rotas, deep links de produto, Axe serious/critical, contratos de acessibilidade, lifecycle de foco da Rosa, reflow em 320 px e demais viewports da Fortress, alvos touch, checkout retirada/entrega, persistência da sacola após reload, edição reversível, Smart Pairing, Rosa Concierge e Admin.

## Gates locais da build
- Health: 205/205 PASS.
- Regression: 237/237 PASS.
- Browser certification estrutural: 45/45 PASS.
- Mobile: 25/25 PASS.
- Accessibility Fortress: 15/15 PASS.
- Signature/Stabilization: 15/15 PASS.
- Adversarial: 10/10 PASS.
- Security hardening: 28/28 PASS.
- Security behavior: 4/4 PASS.
- Audit: PASS.
- Release Forensic: PASS.

## Ainda pendente
- NVDA humano: **MANUAL_REQUIRED**.
- Narrator/JAWS/VoiceOver: não executados nesta evidência.
- Core Web Vitals no ambiente publicado: medição pendente.

## Decisão
A matriz automatizada de navegador da 3.4.0 está **PASS**. Acessibilidade automatizada está **PASS**, mas isso não substitui leitor de tela real. A aprovação de acessibilidade assistiva continua pendente do teste manual com NVDA.

## Última revisão pelas habilidades do projeto
- Responsive Engineering: nenhum novo defeito encontrado; `outline:none` inspecionado possui substituto `:focus-visible`, e os `overflow-x:hidden` observados apenas contêm trilhos horizontalmente roláveis já validados pela matriz de reflow.
- Accessibility Nexus: automação permanece distinta de NVDA humano; nenhum claim manual foi promovido.
- Aegis Forensics: corrigidos drifts de gate/documentação, sem patch cosmético no runtime.
- Premium Adaptive Architecture: nenhuma nova feature foi adicionada; hierarquia e fluxos comerciais foram preservados.
- `npm run quality` foi executado novamente e avançou por grande parte da cadeia até ser interrompido pelo limite de tempo do ambiente, sem falha reportada antes do timeout. Os gates diretamente afetados por esta revisão foram executados individualmente e passaram.
