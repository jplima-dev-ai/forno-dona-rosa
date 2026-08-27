# Pizzaria Forno Dona Rosa — Portfólio Front-End

[English version](README.md)

Projeto conceitual de pizzaria artesanal desenvolvido como case de portfólio, com foco em **experiência premium, acessibilidade, responsividade, segurança, PWA e engenharia front-end sem framework**.

> A interface pública permanece em português porque representa uma pizzaria brasileira. A engenharia do repositório, nomes técnicos e documentação principal foram internacionalizados a partir da série 1.7.x.

## v2.6.9 — Template Factory e preparação para produção

A linha 2.6 transforma a base white-label da 2.5 em um fluxo reproduzível de criação de clientes. Entraram schemas de configuração, presets de pizzaria e cafeteria, gerador de marca, Project Doctor, prevenção de drift da documentação, componentes mais resilientes a conteúdo longo/flags e um comando único de qualidade compatível com automação no GitHub.

A Forno Dona Rosa continua sendo a implementação de referência; a arquitetura reutilizável não apaga sua identidade. Para adaptar um cliente, comece em `docs/customization/CREATE-A-CLIENT.md`.

## Destaques

- HTML semântico e navegação por teclado.
- Baseline WCAG 2.2 AA e atenção especial ao NVDA no Windows.
- Layout adaptativo mobile-first.
- PWA com service worker e cache controlado.
- Sacola persistente com migração de schema e validação defensiva.
- Rosa, anfitriã digital local baseada em intents, contexto e base de conhecimento sem API externa.
- Catálogo de pizzas, bebidas, busca, favoritos, recomendações e checkout local estruturado antes do WhatsApp.
- Self-Audit e Health Check automatizados.

## Executar localmente

```powershell
python -m http.server 8000
```

Abra `http://localhost:8000`.

## Verificações

```powershell
python tools/brand-sync.py
python tools/config-check.py
python tools/brand-leak-check.py
python tools/audit.py
python tools/health-check.py
python tools/regression-check.py
```

## Documentação

- [Arquitetura / Architecture](docs/ARCHITECTURE.md)
- [Checkout local / Local Checkout](docs/CHECKOUT.md)
- [Acessibilidade / Accessibility](docs/ACCESSIBILITY.md)
- [Design System](docs/DESIGN-SYSTEM.md)
- [Performance](docs/PERFORMANCE.md)
- [QA](docs/QA.md)
- [Case Study](docs/CASE-STUDY.md)
- [Security](SECURITY.md)
- [White-label](docs/WHITE-LABEL.md)
- [Componentes reutilizáveis](docs/COMPONENTS.md)
- [Assets da marca](docs/BRAND-ASSETS.md)
- [Changelog](CHANGELOG.md)

## Marca e dados

A Forno Dona Rosa é apresentada como um projeto de portfólio. Preços e alguns conteúdos do catálogo são demonstrativos; disponibilidade, entrega e valores finais são confirmados pelo WhatsApp.
