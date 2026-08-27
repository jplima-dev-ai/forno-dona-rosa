# Pizzaria Forno Dona Rosa — Portfólio Front-End

[English version](README.md)

Projeto conceitual de pizzaria artesanal desenvolvido como case de portfólio, com foco em **experiência premium, acessibilidade, responsividade, segurança, PWA e engenharia front-end sem framework**.

> A interface pública permanece em português porque representa uma pizzaria brasileira. A engenharia do repositório, nomes técnicos e documentação principal foram internacionalizados a partir da série 1.7.x.

## v1.9.9 — Responsive Checkout Edition

Esta versão foca exclusivamente em responsividade, correção de bugs e um caminho de compra mais curto: ações simplificadas no cardápio, campos opcionais progressivos e uma barra móvel para revisar a Sacola.

## Destaques

- HTML semântico e navegação por teclado.
- Baseline WCAG 2.2 AA e atenção especial ao NVDA no Windows.
- Layout adaptativo mobile-first.
- PWA com service worker e cache controlado.
- Sacola persistente com migração de schema e validação defensiva.
- Rosa, anfitriã digital local baseada em intents, contexto e base de conhecimento sem API externa.
- Catálogo de pizzas, bebidas, busca, favoritos, recomendações e pedido estruturado por WhatsApp.
- Self-Audit e Health Check automatizados.

## Executar localmente

```powershell
python -m http.server 8000
```

Abra `http://localhost:8000`.

## Verificações

```powershell
python tools/audit.py
python tools/health-check.py
```

## Documentação

- [Arquitetura / Architecture](docs/ARCHITECTURE.md)
- [Acessibilidade / Accessibility](docs/ACCESSIBILITY.md)
- [Design System](docs/DESIGN-SYSTEM.md)
- [Performance](docs/PERFORMANCE.md)
- [QA](docs/QA.md)
- [Case Study](docs/CASE-STUDY.md)
- [Security](SECURITY.md)
- [Changelog](CHANGELOG.md)

## Marca e dados

A Forno Dona Rosa é apresentada como um projeto de portfólio. Preços e alguns conteúdos do catálogo são demonstrativos; disponibilidade, entrega e valores finais são confirmados pelo WhatsApp.


## Refinamento de qualidade v1.9.9
A linha 1.8.x prioriza correções e qualidade em vez de novas funcionalidades: a Sacola sanitiza cumulativamente dados persistidos, meio a meio não aceita bebida como segundo sabor, Rosa confirma se uma mutação realmente funcionou, o foco de teclado sobrevive às rerenderizações da Sacola, o cache da PWA ficou mais determinístico e as principais imagens gastronômicas ganharam entrega em WebP. Antes de uma release, execute `python tools/regression-check.py` junto com os auditores existentes.
