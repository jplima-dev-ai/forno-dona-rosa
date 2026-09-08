# Evidence Ledger — v4.1.0

## Estado local

| Gate | Status | Evidência |
| --- | --- | --- |
| Build + quality | AUTOMATED_PASS | `npm run quality` executado no ambiente de construção após os fixes de auditoria |
| Security | AUTOMATED_PASS | `npm run security` executado no ambiente de construção |
| Variant structural gate | AUTOMATED_PASS | 23 pizzas com Média, Grande e Família explícitas |
| Variant behavior | AUTOMATED_PASS | resolução, preço, indisponibilidade, fallback legado e bebidas |
| Browser certification static | AUTOMATED_PASS | contrato Playwright e E2E de variantes presentes |
| Playwright real | NOT_TESTED | requer navegador instalado no ambiente/Windows do projeto |
| NVDA humano | MANUAL_REQUIRED | não executado neste ambiente |
| CWV publicado | NOT_TESTED | depende da versão publicada |

## Correções forenses durante a construção

Os auditores 4.0 que extraíam IDs por regex de `data/menu.js` passaram a confundir IDs de variantes com IDs de produtos. A causa foi corrigida nos gates canônicos para ler `data/catalog.json`, fonte estruturada do catálogo, em vez de desabilitar a validação.

O metadado da home e o rodapé do Admin também foram sincronizados com 4.1.0 após os gates detectarem drift de versão.
