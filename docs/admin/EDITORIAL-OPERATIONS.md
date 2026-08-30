# Operações editoriais e newsletter

A linha 3.9 transforma o Admin Studio em uma interface editorial sem abrir HTML para o operador.

## Artigos

A fonte canônica é `data/articles.json`. Cada artigo possui slug, título, resumo, categoria, tags, estado de publicação, datas, imagem, produtos relacionados, seções estruturadas e SEO. O build gera `/articles/`, páginas individuais e páginas de categoria.

O editor do Admin Studio limita a experiência visual a três seções para manter simplicidade para operadores leigos. O schema interno aceita até oito seções para conteúdo criado por tooling ou versões futuras.

Artigo em rascunho não entra no site, no índice de busca nem no sitemap. Publicação é uma decisão explícita.

## Busca e Rosa

`data/articles-index.js` é gerado durante o build e alimenta a busca global. A Rosa reconhece intenções editoriais e pode indicar que existe conteúdo relacionado, sem navegar automaticamente pelo usuário.

## Newsletter

A fonte é `data/newsletter.json`. Existem três modos:

- `none`: nenhum provedor; formulário não é renderizado;
- `external-form`: formulário HTML aponta para um endpoint HTTPS de provedor externo;
- `future-api`: adapter usa `fetch` para uma API futura.

A configuração de referência permanece `enabled: false`. GitHub Pages não recebe nem armazena assinaturas por conta própria.

## Privacidade

O módulo `js/newsletter.js` não usa `localStorage` ou `sessionStorage` para guardar e-mails. Ativar newsletter exige endpoint HTTPS e uma política de privacidade compatível com o provedor escolhido.

## Aplicação de bundles

`tools/apply-admin-bundle.py` aceita artigos e newsletter, preservando compatibilidade com bundles antigos. Bundles antigos recebem os dados editoriais canônicos existentes e newsletter desativada quando essas chaves estiverem ausentes.
