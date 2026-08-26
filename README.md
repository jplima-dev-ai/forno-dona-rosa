# Pizzaria Forno Dona Rosa — v1.0.9

Landing page premium desenvolvida como projeto de portfólio, com foco em identidade gastronômica, acessibilidade, responsividade, conversão e JavaScript vanilla.

## Assinatura do projeto

**48 horas de paciência. 90 segundos de fogo.**

O conceito visual conecta fermentação lenta, ingredientes selecionados e forno a lenha em uma narrativa editorial própria.

## Principais recursos

- Hero editorial com assinatura 48H → 400°C → 90S.
- Seção “O ritual do fogo”.
- Cardápio filtrável por categorias com botões acessíveis e `aria-pressed`.
- Montador de pedido que gera mensagem estruturada para WhatsApp.
- Contatos e localização da Pizzaria Forno Dona Rosa.
- Navegação mobile com gerenciamento de foco, `Escape`, scrim e `inert`.
- Skip link, foco visível e HTML semântico.
- `prefers-reduced-motion`.
- Layout fluido mobile-first com Grid, Flexbox e `clamp()`.
- SEO técnico: canonical, Open Graph, JSON-LD, robots.txt e sitemap.xml.
- Sem framework e sem etapa de build obrigatória.

## Dados configurados

- WhatsApp: (27) 99282-0798
- E-mail: contato.fornodonarosa@gmail.com
- Instagram: @fornodonarosa.pizzaria
- Endereço: Av. Central, 420 - Parque Residencial Laranjeiras, Serra - ES, CEP 29165-130
- GitHub Pages: https://jplima-dev-ai.github.io/forno-dona-rosa/

## Estrutura

```text
forno-dona-rosa-v1.0.9/
├── assets/images/
├── css/styles.css
├── js/config.js
├── js/main.js
├── tools/generate.py
├── .gitignore
├── CHANGELOG.md
├── LICENSE
├── README.md
├── index.html
├── robots.txt
└── sitemap.xml
```

## Rodar no VS Code

```bash
python -m http.server 8000
```

Abra `http://localhost:8000`.

## Publicar atualização

Copie os arquivos desta versão para a pasta do repositório local e execute:

```bash
git add .
git commit -m "release: v1.0.9"
git push
git tag -a v1.0.9 -m "Forno Dona Rosa v1.0.9"
git push origin v1.0.9
```

## QA desta entrega

Foram executadas verificações automáticas locais de sintaxe JavaScript, compilação Python, referências de arquivos, IDs, âncoras, um único H1, viewport, skip link, labels de formulário e ausência de `href="#"`.

Teste manual com NVDA, Axe e matriz visual cross-browser deve ser feito no ambiente Windows/navegadores do projeto antes de declarar conformidade integral.

## Licença

MIT.
