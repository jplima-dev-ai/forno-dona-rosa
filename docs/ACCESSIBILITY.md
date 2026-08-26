# Acessibilidade

Baseline: WCAG 2.2 AA.

## Implementado
- HTML semântico e um único `h1`.
- Skip link.
- Navegação por teclado e foco visível.
- Menu mobile com `aria-expanded` e Escape.
- Carrinho em `<dialog>` nativo.
- Favoritos com `aria-pressed`.
- Status do carrinho, filtro e conectividade com live regions.
- Labels nativos nos formulários.
- `prefers-reduced-motion`.
- Sem dependência de hover para funções críticas.

## QA manual pendente
- NVDA + Chrome/Firefox em Windows.
- Axe/Lighthouse no ambiente de publicação.
- Zoom 200% e reflow em navegador real.

Nunca declare esses testes como aprovados sem executá-los.


## Hardening v1.2.9

- Menu mobile controla foco e isola `main`, `footer` e carrinho com `inert` quando suportado.
- O `dialog` do carrinho devolve foco ao acionador após fechamento.
- Conteúdo digitado pelo visitante é inserido com `textContent`, preservando segurança e leitura por tecnologia assistiva.
- O cardápio não usa mais `aria-live` na grade inteira; alterações são anunciadas pelo status específico.
- Estados de alto contraste e forced-colors possuem ajustes adicionais.
