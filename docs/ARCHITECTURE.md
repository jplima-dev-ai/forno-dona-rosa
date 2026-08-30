# Arquitetura

## Objetivo

Manter uma plataforma comercial para pizzarias que seja publicável como site estático, acessível, mobile-first, white-label e preparada para receber backend no futuro sem reescrever o storefront.

## Visão geral

```text
Dados canônicos
  ├─ marca e conteúdo
  ├─ catálogo
  └─ reviews
        ↓
Build estático
        ↓
Home + páginas institucionais + menu + order + products/<id>/
        ↓
Runtime compartilhado
  ├─ Sacola
  ├─ checkout
  ├─ Rosa
  ├─ status comercial
  ├─ busca
  └─ PWA
```

O Admin Studio edita **dados**, não estrutura de página.

## Camadas

### Dados canônicos

- `data/brand/brand.json` — identidade, contatos, horários, recursos e configuração operacional.
- `data/brand/content.json` — copy configurável.
- `data/catalog.json` — catálogo e preços canônicos.
- `data/reviews.json` — avaliações reais quando disponíveis.

Arquivos `.js` derivados existem para compatibilidade com runtime estático; a origem autoritativa continua documentada nos JSONs canônicos.

### Build

- `tools/build-site.py` — gera páginas multipágina e URLs individuais de produto.
- `tools/build-media.py` — gera mídia responsiva incremental.
- `tools/brand-sync.py` — sincroniza metadata/identidade estática com configuração da marca.

### Runtime público

- `js/main.js` — catálogo, Sacola, favoritos, feedback, PWA e bridges da aplicação.
- `js/checkout.js` — entrega/retirada, agendamento, pagamento, extras, revisão e WhatsApp.
- `js/checkout-state.js` — state machine explícita do checkout.
- `js/rosa.js` — assistente local e ações contextuais.
- `js/business-status.js` — verdade única para aberto/fechado e próximos horários.
- `js/global-search.js` — busca de páginas e produtos.
- `js/storefront.js` e `js/site-pages.js` — comportamento compartilhado das páginas geradas.

### Administração

- `admin/` — superfície administrativa local-first.
- `js/admin-core.js` — normalização e regras do domínio administrativo.
- `js/admin.js` — interação do Admin Studio.
- `js/admin-history.js` — histórico/undo da sessão.
- `js/admin-persistence.js` — fronteira de persistência substituível.
- `tools/apply-admin-bundle.py` — validação e aplicação segura do bundle ao projeto.

## Estado e confiança

### Sacola

A Sacola persistida é não confiável. IDs desconhecidos são descartados, quantidades são limitadas e preços são recalculados pelo catálogo atual.

### Checkout

Dados pessoais são session-first. Endereço persistente exige consentimento explícito. Retirada desativa completamente os campos de entrega e cancela lookup pendente de CEP.

### Rosa

A sessão é curta e limitada. Rosa recebe bridges sanitizadas e não tem acesso irrestrito ao estado interno nem inventa fatos comerciais ausentes.

### Admin Studio

Rascunho local não é autorização. Import/export é configuração, não publicação remota autenticada.

## Static-first e backend-ready

GitHub Pages permanece um destino válido para demo/portfólio porque o produto não depende de execução server-side para navegar e montar pedidos.

Quando houver backend real, a troca planejada acontece nas fronteiras de repository/persistence, não no DOM inteiro:

```text
Local Repository hoje
        ↓
mesmo contrato
        ↓
Authenticated API Repository no futuro
```

## PWA e Service Worker

O Service Worker cacheia apenas recursos públicos same-origin dentro de limites definidos. Rotas `/admin/` e `/dev/` ficam fora dessa fronteira. Navegações multipágina são cacheadas pela própria rota para evitar contaminação de Home/menu/produto.

## Testabilidade

A arquitetura possui três níveis de evidência:

1. gates estáticos e comportamentais locais;
2. browser E2E/Axe via Playwright quando o ambiente permite;
3. validação humana/dispositivo/tecnologia assistiva para claims que automação não pode provar.

## Decisões formais

ADRs vivem em `docs/decisions/` e registram decisões de static-first, nomenclatura técnica, busca, state machine, status comercial e Administração.

## Camada editorial v3.9

A área editorial segue o mesmo princípio de fonte canônica do catálogo:

```text
data/articles.json
        ↓
tools/build-site.py
        ↓
/articles/
/articles/<slug>/
/categories/<id>/
data/articles-index.js
sitemap.xml
```

Artigos em rascunho permanecem nos dados canônicos, mas não entram no build público, índice de busca ou sitemap. A busca global consome o índice gerado; o Admin Studio edita os dados estruturados, não HTML.

`data/newsletter.json` define somente o contrato de integração. Sem provedor HTTPS real, o componente de newsletter não é renderizado. Essa separação preserva a arquitetura static-first e evita fingir persistência de e-mail no GitHub Pages.
