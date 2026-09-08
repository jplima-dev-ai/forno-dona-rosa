# Evidence Ledger — v4.1.5

## Executado neste ambiente

- `check:js`: PASS para o novo helper e o `main.js` modificado;
- Intelligent Bag structural gate: **14/14 PASS**;
- Intelligent Bag behavior gate: **6/6 PASS**;
- Release gate 4.1.5: **PASS**;
- Health Check: **205/205 PASS**;
- Regression Check: **237/237 PASS**;
- Browser Certification estrutural: **42/42 PASS**;
- Mobile Usability: **25/25 PASS**;
- Accessibility Certification v4: **PASS estrutural**;
- Performance & Resilience v4: **PASS estrutural**;
- Security hardening: **28/28 PASS**;
- Security behavior: **4/4 PASS**;
- Audit: **PASS**;
- Documentation check: **92 Markdown files PASS**;
- Release Forensic: **PASS** — JS 288,9 KB; CSS 126,5 KB; maior mídia 603,4 KB; 260 imagens HTML verificadas; 8/8 behavior forensic checks.

## Build

`build-site.py` concluiu e gerou **55 páginas + sitemap para v4.1.5**. A etapa pesada `build-media.py` foi interrompida pelo limite deste ambiente; duas variantes AVIF que ela havia regravado parcialmente foram restauradas byte a byte da baseline 4.1.4 porque mídia não faz parte desta release.

## Não executado neste ambiente

- Playwright real da 4.1.5: `NOT_TESTED`;
- NVDA humano: `MANUAL_REQUIRED`;
- CWV publicado: `NOT_TESTED`.

Esses itens permanecem deliberadamente para a validação final da 4.1.9.
