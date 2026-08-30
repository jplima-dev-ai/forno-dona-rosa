# Performance

## Estratégia

O projeto permanece framework-free e static-first para reduzir JavaScript inicial, dependências e custo de runtime. Performance é tratada como orçamento de experiência, não como busca cega por nota 100.

## Mídia

- `tools/build-media.py` gera variantes AVIF/WebP de forma incremental;
- páginas de produto usam `picture`, `srcset` e `sizes` quando aplicável;
- imagens abaixo da dobra usam lazy loading;
- dimensões/proporções estáveis reduzem layout shift;
- Hero recebe prioridade compatível com seu papel de LCP candidate.

O build não deve regenerar derivados quando a fonte e todos os outputs já estão atuais.

## CSS e JavaScript

- sem framework obrigatório;
- módulos são separados por domínio;
- comportamento secundário não deve bloquear a compra principal;
- novas dependências precisam justificar custo de bundle e manutenção.

## PWA

O Service Worker mantém caches versionados, same-origin e limitados. Rotas administrativas/de desenvolvimento ficam fora do cache público.

## Browser evidence

A linha 3.7 prepara Playwright para testes de fluxo e matriz mobile. Performance automatizada futura deve primeiro medir um baseline real antes de impor budgets arbitrários.

## Checklist de release

- Hero e mídia crítica otimizados;
- ausência de imagens originais gigantes em superfícies pequenas;
- dimensões/aspect ratio preservados;
- sem regressão de overflow/reflow;
- build de mídia incremental;
- cache antigo eliminado corretamente;
- scripts/fontes adicionais justificados;
- Lighthouse/Core Web Vitals só declarados quando efetivamente medidos.
