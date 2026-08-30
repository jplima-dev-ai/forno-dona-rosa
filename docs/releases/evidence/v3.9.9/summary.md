# Evidência v3.9.9

## Executado nesta release

- `npm run quality`: PASS.
- `36/36` editorial-content checks: PASS.
- `8/8` newsletter contract checks: PASS.
- bundle administrativo com artigos/newsletter aplicado em cópia isolada: PASS.
- polish gastronômico: 22 fontes de pizza tratadas; segunda execução `0 polished / 22 current`.
- smoke HTTP: Home, Artigos, artigo profundo, categoria, Cardápio, Pedido, Admin, índice editorial, newsletter JS e sitemap responderam `200`.

## Limites

- newsletter real: NOT CONFIGURED; permanece desativada sem provedor HTTPS.
- Playwright/Axe em navegador deste ambiente: não reexecutados nesta rodada; a arquitetura continua configurada para GitHub Actions.
- NVDA, JAWS, TalkBack e VoiceOver: NOT TESTED nesta release.
- as imagens foram aprimoradas tecnicamente; arquivos-fonte duplicados continuam exigindo fotografias distintas para representar cada sabor com fidelidade visual própria.
## Hotfix de certificação após execução no GitHub

A primeira execução real do Browser Certification no GitHub revelou e motivou correções em contraste WCAG, isolamento dos campos de retirada, contrato E2E do Admin, CSP de focal point, favicon e landmark principal da Home. O `npm run quality` local passou após as correções. A certificação Playwright/Axe deve ser considerada confirmada somente após nova execução verde no GitHub Actions.

