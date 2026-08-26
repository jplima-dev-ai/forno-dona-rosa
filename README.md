# Pizzaria Forno Dona Rosa

**Versão 1.2.9 — Stability & Security Edition**

Landing page/PWA de portfólio construída em HTML, CSS e JavaScript puro, com cardápio explorável, favoritos, recomendador determinístico, carrinho persistente e envio estruturado do pedido pelo WhatsApp.

## O que a linha 1.2.x representa

A série **1.2.0 → 1.2.9** é um ciclo de hardening. Nenhuma grande feature foi adicionada; o foco foi revisar, corrigir e amadurecer os recursos existentes.

Principais resultados:

- remoção de DOM XSS persistente associado a conteúdo do carrinho;
- validação e normalização de todo estado vindo de `localStorage`;
- preços recalculados sempre a partir do catálogo canônico;
- limites defensivos de quantidade e tamanho do carrinho;
- fluxo meio a meio validando segundo sabor diferente;
- foco e fechamento do menu mobile refinados;
- restauração explícita do foco ao fechar o carrinho;
- deep links aceitos somente para pizzas existentes;
- fallback de compartilhamento mais resiliente;
- CSP restritiva compatível com a hospedagem estática atual;
- links externos endurecidos com `noopener noreferrer`;
- service worker restrito a same-origin, com estratégias distintas para navegação e assets;
- suporte reforçado a contraste aumentado e forced-colors;
- auditoria estática reproduzível em `tools/audit.py`.

## Rodar localmente

No terminal do VS Code:

```bash
python -m http.server 8000
```

Acesse `http://localhost:8000`.

## Auditoria local

Com Node e Python instalados:

```bash
python tools/audit.py
```

O script verifica integridade estrutural, âncoras, referências locais, links `_blank`, sinks DOM proibidos, CSP, service worker same-origin e sintaxe JavaScript.

## Estrutura

```text
forno-dona-rosa-v1.3.9/
├── assets/
├── css/styles.css
├── data/menu.js
├── docs/
├── js/
│   ├── config.js
│   └── main.js
├── tools/
│   ├── audit.py
│   └── generate.py
├── CHANGELOG.md
├── LICENSE
├── README.md
├── SECURITY.md
├── index.html
├── manifest.webmanifest
├── robots.txt
├── service-worker.js
└── sitemap.xml
```

## Segurança

Leia [SECURITY.md](SECURITY.md). Este projeto é estático e não contém autenticação, banco de dados ou pagamentos. O GitHub Pages limita a configuração de headers HTTP; a CSP desta versão é aplicada via meta tag.

## Acessibilidade

O código preserva HTML semântico, skip link, foco visível, navegação por teclado, `dialog` nativo, regiões de status, `prefers-reduced-motion`, contraste aumentado e estados acessíveis. Veja `docs/ACCESSIBILITY.md`.

**Importante:** auditoria estática não equivale a teste manual com NVDA, Axe, zoom, touch ou navegadores reais. Esses testes só devem ser declarados aprovados quando forem executados.

## Publicação

URL configurada para:

`https://jplima-dev-ai.github.io/forno-dona-rosa/`

Após substituir os arquivos no repositório:

```bash
git add .
git commit -m "release: v1.3.9 stability and security hardening"
git push
git tag -a v1.3.9 -m "Forno Dona Rosa v1.3.9"
git push origin v1.3.9
```

## Licença

MIT.


## Linha 1.3.x

A série 1.3.x foi dedicada a melhorar direção de arte, copies e imagens gastronômicas. A home agora usa fotografia editorial de pizzas, o cardápio ganhou imagens reais por item e a interface recebeu um passe visual mais sofisticado e apetitoso.
