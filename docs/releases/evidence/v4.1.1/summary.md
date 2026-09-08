# Evidence Ledger — v4.1.1

## Estado da release

A 4.1.1 introduz o Dona Rosa Pizza Configurator, uma jornada linear de quatro etapas na mesma página: tamanho e sabores, personalização, revisão e adição à sacola.

## Evidência executada neste ambiente

- build: PASS — 55 páginas + sitemap gerados para v4.1.1;
- JavaScript syntax: PASS;
- Health Check: 205/205 PASS;
- Regression Check: 237/237 PASS;
- Browser Certification structural: 42/42 PASS;
- Mobile Usability structural: 25/25 PASS;
- Pizza Configurator structural: 10/10 PASS;
- Pizza Configurator behavior: 5/5 PASS;
- Variant Commerce 4.1.0 compatibility gate: PASS — 23 pizzas;
- Release 4.1.0 compatibility gate: PASS;
- Release 4.1.1 gate: PASS;
- Accessibility Certification structural: PASS;
- Performance & Resilience structural: PASS;
- Visual Media Uniqueness: PASS — 23 pizzas / 23 imagens-base;
- Release Forensic: PASS — JS 264.6 KB; CSS 120.6 KB; maior mídia de produto 603.4 KB; 260 imagens HTML verificadas; 8/8 behavior forensic checks;
- security: PASS — 28/28 hardening, 4/4 behavior e audit PASS.

O comando agregado `npm run quality` foi iniciado e avançou pelos gates até o limite de execução deste ambiente. Os gates restantes foram executados separadamente; qualquer falha encontrada foi corrigida na causa e retestada.

## Regressões encontradas e corrigidas durante a construção

1. Os gates antigos de extras opcionais exigiam especificamente `<details>`. A 4.1.1 promoveu esses campos para uma etapa visível; os testes foram atualizados para proteger o novo contrato sem perder compatibilidade com a estrutura antiga.
2. Gates editoriais e de Variant Commerce estavam congelados em versão exatamente 4.1.0. Foram convertidos para contratos compatíveis com releases >= 4.1.0.
3. O rodapé e metadado do Admin Studio ainda exibiam 4.1.0. Foram sincronizados para 4.1.1.
4. O release forensic estava congelado em 4.1.0. Agora valida a linha 4.1 e exige que o fallback de resiliência acompanhe a versão real.
5. O configurador e o Variant Engine foram adicionados ao shell offline do service worker e o novo gate protege essa dependência.

## Testes que ainda exigem ambiente real

- Playwright `tests/e2e/pizza-configurator.spec.js`: NOT_TESTED neste ambiente;
- matriz Playwright completa em Chromium no Windows: NOT_TESTED nesta execução;
- NVDA humano: MANUAL_REQUIRED;
- Core Web Vitals no GitHub Pages publicado: NOT_TESTED.

Nenhum item NOT_TESTED foi convertido em PASS.
