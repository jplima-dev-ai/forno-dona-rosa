# Changelog

## [1.0.1] — 2026-08-25

### Corrigido

- Estrutura física alinhada aos caminhos usados pelo HTML: `css/styles.css`, `js/config.js` e `js/main.js`.
- Criado `js/config.js`, eliminando dependências inexistentes no JavaScript.
- Corrigidas duplicações acidentais de propriedades no CSS.
- Removido `overflow-x: hidden` global usado como remendo preventivo.
- Navegação mobile passou de `100vh` para `100dvh`.
- Mídias receberam regras resilientes de largura máxima.
- Links vazios de Instagram/Facebook foram removidos.
- Depoimentos e dados comerciais fictícios passaram a ser identificados explicitamente como demonstração.
- Número de WhatsApp da demo passou a ser propositalmente inválido para evitar contato com terceiros reais.
- Todos os `href="#"` foram removidos e receberam fallback navegável.
- Imagem Open Graph externa foi substituída por asset local.
- README foi alinhado à estrutura real e às verificações realmente executadas.

### Adicionado

- `.gitignore`.
- `LICENSE` MIT.
- `robots.txt`.
- `assets/images/og-cover.png`.
- `js/config.js`.
- Pasta `tools/` para separar utilitário Python do runtime da landing page.

### Publicação

- `canonical`, `og:url` e URLs absolutas do JSON-LD continuam com `SEU-USUARIO`, pois a URL final do GitHub Pages ainda não foi informada.
- Testes manuais com NVDA, Axe e matriz cross-browser ficam como etapa de QA da publicação; não são declarados como aprovados sem execução.
