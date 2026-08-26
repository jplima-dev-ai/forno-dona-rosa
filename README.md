# Pizzaria Premium — Forno Dona Rosa

![Versão](https://img.shields.io/badge/vers%C3%A3o-1.0.1-c7331b)
![Licença](https://img.shields.io/badge/licen%C3%A7a-MIT-e8a93b)
![Stack](https://img.shields.io/badge/stack-HTML%20%2B%20CSS%20%2B%20JS-7a9b5c)

Landing page conceitual de pizzaria criada para portfólio, com foco em identidade visual, conversão, acessibilidade por teclado/leitor de tela e responsividade estrutural.

**Forno Dona Rosa, endereço, telefone, avaliações e demais dados comerciais são fictícios.**

## Destaques

- HTML semântico com `header`, `nav`, `main`, `section` e `footer`.
- Skip link e foco visível para navegação por teclado.
- Menu mobile com `aria-expanded`, fechamento por `Escape`, scrim e isolamento do conteúdo com `inert`.
- `prefers-reduced-motion` para reduzir animações não essenciais.
- Layout fluido com Grid, Flexbox e `clamp()`.
- Design tokens centralizados em `css/styles.css`.
- WhatsApp e endereço centralizados em `js/config.js`.
- JSON-LD de `Restaurant`, Open Graph e `robots.txt`.
- Ilustrações SVG inline e capa Open Graph local em PNG.
- JavaScript vanilla, sem framework e sem build obrigatório.

## Estrutura

```text
pizzariapremiun-v1.0.1/
├── assets/
│   └── images/
│       └── og-cover.png
├── css/
│   └── styles.css
├── js/
│   ├── config.js
│   └── main.js
├── tools/
│   └── generate.py
├── .gitignore
├── CHANGELOG.md
├── LICENSE
├── README.md
├── index.html
└── robots.txt
```

## Rodar no VS Code

Abra a pasta no VS Code e, no terminal integrado, execute:

```bash
python -m http.server 8000
```

Depois acesse `http://localhost:8000`.

## Configuração para um cliente real

1. Altere WhatsApp, mensagem padrão e endereço em `js/config.js`.
2. Substitua em `index.html` nome, textos, cardápio, endereço, horário e JSON-LD.
3. Ajuste a identidade no `:root` de `css/styles.css`.
4. Troque os depoimentos fictícios por avaliações reais e autorizadas.
5. Troque ilustrações por fotos próprias do cliente quando houver material real.
6. Após criar o GitHub Pages, troque `SEU-USUARIO` em `canonical`, `og:url` e JSON-LD pela URL pública final.
7. Em produção, use URL absoluta para `og:image`.

O número de WhatsApp da demonstração é propositalmente inválido (`5500000000000`) para não enviar visitantes do portfólio a uma pessoa real.

## GitHub Pages

```bash
git init
git add .
git commit -m "release: v1.0.1"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/pizzariapremiun.git
git push -u origin main
git tag -a v1.0.1 -m "Pizzaria Premium v1.0.1"
git push origin v1.0.1
```

No GitHub: **Settings → Pages → Deploy from a branch → main → /(root)**.

## Acessibilidade e QA

A versão 1.0.1 foi preparada seguindo baseline WCAG 2.2 AA, HTML nativo, foco visível, teclado e redução de movimento.

Nesta entrega foram executadas verificações reproduzíveis de:

- sintaxe JavaScript;
- compilação do utilitário Python;
- IDs duplicados;
- âncoras internas;
- referências a arquivos locais;
- existência de um único `h1`;
- idioma da página;
- meta viewport;
- presença do skip link;
- ausência de `href="#"`.

**Não declaramos teste manual com NVDA, Axe ou aprovação visual cross-browser sem executar essas etapas especificamente.**

## Licença

MIT. Consulte [LICENSE](LICENSE).
