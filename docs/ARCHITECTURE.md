# Arquitetura

## Camadas
`data/menu.js` → catálogo e preços demonstrativos.

`js/config.js` → identidade e dados variáveis da empresa.

`js/main.js` → estado, carrinho, favoritos, recomendador, PWA e integração com WhatsApp.

`css/styles.css` → tokens visuais, layout responsivo e estados.

`service-worker.js` → shell offline e cache progressivo.

## Persistência
`localStorage` armazena apenas carrinho e favoritos no navegador do usuário. Não existe backend nem conta.
