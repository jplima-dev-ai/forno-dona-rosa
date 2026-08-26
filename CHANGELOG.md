# Changelog

## [1.2.9] — 2026-08-26
### QA e release hardening
- Adicionada auditoria reproduzível `tools/audit.py`.
- Documentação e versão visual atualizadas para Stability & Security Edition.
- Verificações de integridade, CSP, links externos, recursos locais e sintaxe consolidadas.

## [1.2.8] — 2026-08-26
### SEO e resiliência
- Metadados de referrer e versão adicionados.
- Deep links agora validam IDs contra o catálogo antes de qualquer ação.
- Compartilhamento ganhou fallback de cópia compatível com contextos sem Clipboard API moderna.

## [1.2.7] — 2026-08-26
### Performance e estabilidade
- Renderização dinâmica passou a criar nós DOM diretamente, reduzindo parsing HTML repetido.
- Atualizações de carrinho e favoritos foram centralizadas e normalizadas.
- Service worker evita cache de respostas inválidas.

## [1.2.6] — 2026-08-26
### Persistência
- `localStorage` passou a ser tratado como entrada não confiável.
- IDs de produtos inválidos são descartados.
- Quantidades são limitadas e preços/totais são recalculados a partir do catálogo canônico.
- Carrinho demonstrativo limitado defensivamente a 50 linhas.

## [1.2.5] — 2026-08-26
### PWA e cache
- Cache versionado para v1.2.9.
- Service worker limitado a requisições GET same-origin.
- Navegação usa network-first com fallback do shell.
- Assets usam stale-while-revalidate.
- Falha de asset não recebe mais `index.html` como resposta indevida.
- `skipWaiting()` e `clients.claim()` tornam atualizações mais previsíveis.

## [1.2.4] — 2026-08-26
### Responsividade e reflow
- Conteúdo longo do carrinho ganhou quebra resiliente.
- Alvos interativos receberam `touch-action: manipulation`.
- Âncoras ganharam `scroll-margin-top` para não ficarem sob o header sticky.
- Fallback do backdrop-filter adicionado.

## [1.2.3] — 2026-08-26
### Acessibilidade
- Menu mobile passou a isolar conteúdo externo quando `inert` é suportado e controlar ciclo de foco.
- Carrinho restaura explicitamente o foco ao acionador ao fechar.
- Botões dinâmicos ganharam nomes acessíveis contextuais.
- Grid de cardápio deixou de ser uma live region redundante; anúncio permanece no status dedicado.
- Reforço para `prefers-contrast` e `forced-colors`.

## [1.2.2] — 2026-08-26
### Segurança
- Removido uso de `innerHTML` em conteúdo dinâmico.
- Corrigido vetor de DOM XSS persistente em observações recuperadas de `localStorage`.
- Adicionada CSP restritiva via meta tag.
- Links `_blank` usam `noopener noreferrer`.
- Criado `SECURITY.md` com modelo de ameaça e limitações do GitHub Pages.

## [1.2.1] — 2026-08-26
### Lógica e estado
- Pizza meio a meio exige segundo sabor válido e diferente.
- Quantidade é normalizada entre 1 e 10.
- Nomes, tamanhos, bordas e valores exibidos no carrinho derivam das fontes canônicas.
- Estados corrompidos ou obsoletos do navegador deixam de quebrar a interface.

## [1.2.0] — 2026-08-26
### Auditoria geral
- Revisão de segurança, persistência, carrinho, favoritos, deep links, menu mobile, compartilhamento e PWA.
- Congelamento de features para priorizar estabilidade e regressões.

## [1.1.9] — 2026-08-26
- Portfolio Engineering Edition consolidada.
