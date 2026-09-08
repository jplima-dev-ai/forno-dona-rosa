# Evidence — Forno Dona Rosa 4.1.9

## Executado neste ambiente
- Build: PASS — 32 produtos; 0 mídias reconstruídas; 55 páginas + sitemap gerados.
- JavaScript syntax: PASS.
- Signature Commerce structural: 15/15 PASS.
- Signature Commerce adversarial behavior: 10/10 PASS.
- Browser certification structural: 45/45 PASS.
- Security hardening: 28/28 PASS.
- Security behavior: 4/4 PASS.
- Audit: PASS.
- Documentation: 104 Markdown files PASS.
- Release Forensic: PASS — JS 302.5 KB; CSS 130.7 KB; maior mídia 603.4 KB; 260 imagens HTML verificadas; 8/8 behavior forensic.
- Health: 205/205 PASS durante o `npm run quality` agregado.
- O `npm run quality` agregado avançou até a sequência 4.1.0 e foi interrompido por timeout do ambiente, sem gate reportado como falha.
- O trecho restante 4.1.1 → 4.1.9 foi executado separadamente. Durante ele, o release gate 4.1.8 revelou um bloqueio histórico por versão exata; o gate foi corrigido para compatibilidade `>= 4.1.8` e retestado com PASS.

## Ainda não executado neste ambiente
- Playwright real completo: NOT_TESTED.
- Playwright 4.1.9 Signature Commerce: NOT_TESTED.
- NVDA humano: MANUAL_REQUIRED.
- Narrator/VoiceOver: NOT_TESTED.
- Core Web Vitals em ambiente publicado: NOT_TESTED.

## Decisão de release
O pacote 4.1.9 está estruturalmente e comportamentalmente pronto para a rodada final no Windows. A aprovação final pública continua PENDING_FINAL_EVIDENCE até os testes de navegador e NVDA combinados com o usuário.


## Windows Playwright run — RC0 findings
- Environment: Windows, Chromium Playwright runtime installed.
- Result supplied by operator: **101 failed, 17 skipped, 302 passed (11.1m)**.
- Classification: release remains **PENDING_FINAL_EVIDENCE**.
- Confirmed product defects: Smart Pairing contrast; undersized/too-close touch targets; resilience image fallback overflow.
- Confirmed test/contract defects: Bag cancel assertion matched option text inside the editor; Smart Portion `Alto` label was ambiguous across two native radio groups; checkout test used a nonexistent `data-test` selector; dialog test depended on exact boolean-attribute serialization.
- Infrastructure defect: high-concurrency local Python server produced intermittent `ERR_CONNECTION_REFUSED`; RC1 uses a dedicated threaded server with a larger accept queue and bounded workers.
- RC1 status: local structural/regression gates pass; **real Windows Playwright rerun required**.
- NVDA: **MANUAL_REQUIRED after browser rerun is green**.

## Windows Playwright run — RC1 findings
- Result supplied by operator: **30 failed, 17 skipped, 373 passed (13.1m)**.
- Improvement versus RC0: failures reduced from 101 to 30; accessibility contrast, touch target, overflow, checkout interaction and server-refusal clusters were eliminated from the final failure list.
- Remaining failures collapsed to three repeated causes across six Chromium viewport projects:
  1. Admin E2E edited the legacy `basePrice` field although pizza pricing source-of-truth is the `media` variant; RC2 test now edits the canonical variant and the Admin marks base price read-only for pizzas.
  2. Rosa Concierge E2E opened the assistant through a broad accessible-name match; the product itself opens correctly through the explicit `data-rosa-open` contract (already proven by the Signature Commerce test). RC2 scopes the tests to that canonical opener.
  3. Signature checkout E2E called `toBeHidden()` on eight matching delivery-field elements; all eight were actually hidden. RC2 asserts that the visible subset has count zero.
- RC2 cache revision invalidates RC1 assets without changing the commercial version 4.1.9.
- RC2 local validation: Health 205/205 PASS; Regression 237/237 PASS; Browser structural 45/45 PASS; Mobile 25/25 PASS; Fortress 15/15 PASS; Signature 15/15 PASS; Signature adversarial 10/10 PASS; Security 28/28 + 4/4 PASS; Docs 104 PASS; Audit PASS; Release Forensic PASS.
- RC2 real Windows Playwright: **RETEST_REQUIRED**.
- NVDA remains **MANUAL_REQUIRED after browser suite reaches 0 failed**.

## Addendum — rebaseline 3.4.0 (2026-09-08)
A evidência acima preserva o histórico da antiga numeração 4.1.9. O estado corrente foi rebaselined para **3.4.0**. A rodada final Windows Playwright da build correta terminou com **403 passed, 0 failed, 17 skipped (8.4m)**. O ledger corrente está em `docs/releases/evidence/v3.4.0/summary.md`. NVDA humano continua `MANUAL_REQUIRED` e CWV publicado continua pendente.
