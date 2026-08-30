# ADR 009 — Editorial estático e fronteira da newsletter

## Contexto

O site precisava publicar conteúdo editorial e preparar crescimento de audiência sem antecipar um backend real.

## Decisão

Artigos são dados canônicos gerados estaticamente. Newsletter é uma integração opcional com contrato explícito de provedor e endpoint HTTPS. Sem provedor real, nenhum formulário de cadastro aparece.

## Consequências

O conteúdo recebe URLs próprias, SEO, sitemap e busca sem servidor. A coleta de e-mail não é simulada. Quando uma API existir, `future-api` poderá substituir o adapter sem reconstruir a experiência editorial.
