# Evidence Ledger — 4.1.6

## Executado neste ambiente

- `node --check js/rosa-order-concierge-v4-1-6.js`: PASS.
- `node --check js/rosa.js`: PASS.
- `npm run check:js`: PASS.
- `python tools/rosa-order-concierge-v4-1-6-check.py`: PASS, 14/14.
- `node tools/rosa-order-concierge-v4-1-6-behavior-check.js`: PASS, 6/6.
- `node tools/rosa-behavior-check.js`: PASS, 28/28.
- `python tools/health-check.py`: PASS, 205/205.
- `python tools/regression-check.py`: PASS, 237/237.
- `python tools/browser-certification-check.py`: PASS, 43/43 structural checks.
- `python tools/mobile-usability-check.py`: PASS, 25/25.
- `python tools/accessibility-certification-v4-check.py`: PASS, structural contract.
- `python tools/performance-resilience-v4-check.py`: PASS, structural contract.
- `python tools/security-hardening-check.py`: PASS, 28/28.
- `node tools/security-behavior-check.js`: PASS, 4/4.
- `python tools/audit.py`: PASS.
- `python tools/docs-check.py`: PASS.
- `python tools/release-v4-1-6-check.py`: PASS.
- `python tools/release-forensic-check.py`: PASS.

## Correções encontradas durante os gates

- A adição de uma única pizza pela Rosa deixou de reutilizar a API de bundle da Mesa; foi criada `FORNO_APP.addConfiguredProduct()` para preservar anúncio e semântica corretos.
- Admin Studio e assinatura da home foram sincronizados de 4.1.5 para 4.1.6.
- O gate 4.1.5 foi convertido em gate de compatibilidade para permitir 4.1.6+ sem abandonar os contratos históricos.
- Browser certification passou a exigir presença do E2E da Rosa 4.1.6.

## Quality agregado

`npm run quality` foi iniciado. O build passou, `build:media` reportou `0 rebuilt, 32 current`, e a execução avançou pelos gates iniciais até `Health Check 205/205`. O comando agregado foi interrompido pelo limite de duração do ambiente, sem falha de gate observada. Os gates restantes relevantes foram executados individualmente e estão registrados acima como PASS.

## Ainda não executado neste ambiente

- Playwright `tests/e2e/rosa-order-concierge.spec.js`: NOT_TESTED.
- matriz Playwright completa: NOT_TESTED.
- NVDA humano: MANUAL_REQUIRED.
- Core Web Vitals em ambiente publicado: NOT_TESTED.

Nenhum item `NOT_TESTED` é tratado como PASS.
