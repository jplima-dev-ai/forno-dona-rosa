# Forno Dona Rosa 4.0 — Commerce Experience Intelligence

## North Star
A linha 4.0 transforma o storefront de uma plataforma rica em recursos em uma experiência que entende intenção, desperta desejo, reduz decisão e produz evidência de qualidade.

## Princípios inegociáveis
1. Preservar static-first, local-first e white-label.
2. Não introduzir IA externa apenas por moda.
3. Não coletar dados pessoais para personalização contextual.
4. Não esconder conteúdo essencial em experiências visuais.
5. Toda evolução visual deve preservar teclado, foco, leitor de tela, reduced motion, zoom e reflow.
6. Cada release tem uma tese central, cinco entregas principais e critérios de aceite próprios.
7. Nenhuma release é considerada aprovada sem quality gate proporcional ao blast radius.

## 4.0.0 — Experience Architecture Foundation
Tese: reorganizar a experiência por intenção antes de ampliar funcionalidades.

Entregas:
- Experience Router: Pedido rápido, Quero ajuda para escolher, Quero conhecer a casa.
- hierarquia Primary / Secondary / Discovery para CTAs e superfícies;
- contrato de contexto anônimo da sessão;
- progressive disclosure na home;
- documentação e testes estruturais da arquitetura 4.0.

Critérios de aceite:
- nenhuma função existente removida;
- as três jornadas possuem entrada clara;
- ordem DOM continua coerente com leitura e foco;
- experiência funciona sem personalização salva;
- reduced motion não perde informação.

## 4.0.1 — Visual Desire System
Tese: imagem deixa de ilustrar e passa a vender o produto.

Entregas:
- padrão visual único para pizzas;
- padrão visual único para bebidas;
- três papéis de mídia: catalog, hero, detail;
- contrato de focal point e responsive art direction;
- fallback gastronômico elegante para mídia ausente.

Critérios de aceite:
- cada produto possui direção de imagem documentada;
- card, hero e detalhe preservam informação em mobile;
- alt text descreve o produto sem copy promocional vazia;
- sem CLS relevante por mídia sem dimensões;
- imagens responsivas não exigem uma foto enorme no celular.

## 4.0.2 — Smart Menu + Nordestina da Dona Rosa
Tese: descoberta por desejo e introdução de uma assinatura regional.

Entregas:
- novo produto “Nordestina da Dona Rosa”;
- traits sensoriais estruturados;
- ranking local por intenção;
- filtros sensoriais compreensíveis;
- explicação curta de por que cada recomendação apareceu.

Produto planejado:
- Nome: Nordestina da Dona Rosa
- Categoria: Especiais
- Badge: Assinatura nordestina
- Base proposta: molho da casa, muçarela, carne de sol desfiada, cebola roxa, requeijão cremoso e toque de manteiga de garrafa.
- Preço-base de trabalho: R$ 64,90, sujeito à decisão comercial antes da publicação.

Critérios de aceite:
- recomendação determinística e testável;
- produto novo aparece em busca, categoria, Rosa e páginas geradas;
- ausência de imagem específica usa fallback sem quebrar layout;
- filtros não dependem apenas de cor;
- aliases incluem formas comuns de buscar carne de sol.

## 4.0.3 — Rosa Context Engine 2.0
Tese: Rosa deixa de responder apenas perguntas e passa a compor decisões de compra contextualizadas.

Entregas:
- session context explícito e descartável;
- decomposição de intenção composta;
- recommendation engine compartilhado com o menu;
- cross-sell contextual e justificável;
- contrato acessível de conversa e anúncios.

Critérios de aceite:
- sem dependência de API externa;
- nenhuma coleta do texto da conversa em analytics;
- anúncios não duplicam fala do leitor de tela;
- recomendações explicáveis;
- estados vazios e ambiguidades possuem recuperação.

## 4.0.4 — Adaptive Commerce
Tese: a interface responde ao estado útil da sessão sem perseguir o usuário.

Entregas:
- home contextual para novo/recorrente;
- tratamento de Sacola existente;
- estado aberto/fechado com ação útil;
- experiência coerente para entrega/retirada;
- retomada de último pedido com consentimento implícito apenas local.

Critérios de aceite:
- personalização funciona sem conta;
- limpar dados locais restaura estado neutro;
- conteúdo essencial não some por personalização;
- horário não usa urgência falsa;
- contexto não bloqueia navegação manual.

## 4.0.5 — Conversion Intelligence
Tese: medir jornada, não pessoas.

Entregas:
- taxonomia oficial de eventos;
- adapter de analytics privacy-first;
- funis de menu, Rosa, favoritos e repetição;
- eventos de erro/fricção;
- documentação de payload permitido/proibido.

Eventos-base:
menu_view, search_started, search_result_selected, product_view, favorite_added, rosa_opened, rosa_recommendation, bag_add, bag_remove, checkout_started, fulfillment_selected, payment_selected, checkout_reviewed, whatsapp_opened, repeat_order, article_view.

Critérios de aceite:
- nenhum evento contém nome, endereço, CEP completo, telefone, texto da Rosa ou composição detalhada do pedido;
- adapter pode ser desligado;
- site funciona normalmente sem provedor;
- eventos têm schema e testes;
- duplicidade de evento é protegida nos pontos críticos.

## 4.0.6 — Admin Studio 4
Tese: transformar edição local em operação editorial/comercial segura.

Entregas:
- dashboard de saúde do site;
- content health para catálogo, mídia e SEO;
- preview responsivo funcional;
- fluxo Editar → Validar → Preview → Exportar;
- relatório de publicação/exportação.

Critérios de aceite:
- sem simular backend inexistente;
- undo/history preservados;
- validações orientam correção;
- preview não duplica conteúdo na árvore acessível do Admin;
- exportação falha de modo explícito diante de inconsistência crítica.

## 4.0.7 — Accessibility Certification Layer
Tese: acessibilidade vira contrato verificável de autonomia.

Entregas:
- matriz de fluxo crítico;
- contratos name/role/state/value/focus;
- testes de teclado e foco;
- reflow/zoom/forced-colors/reduced-motion;
- ledger de tecnologia assistiva executada vs não executada.

Critérios de aceite:
- nenhuma tecnologia assistiva é marcada PASS sem teste real;
- automação cobre contratos reproduzíveis;
- checkout é recuperável após erro;
- dialogs retornam foco;
- toda função crítica opera sem mouse.

## 4.0.8 — Performance & Resilience
Tese: experiência premium continua boa quando rede, cache ou dependência falham.

Entregas:
- budgets de JS/CSS/imagens;
- responsive media pipeline;
- falhas controladas de CEP e APIs;
- tratamento de localStorage/service worker/catálogo inconsistente;
- suíte adversarial de resiliência.

Critérios de aceite:
- fallback não finge sucesso;
- imagem quebrada não destrói card;
- storage corrompido permite recuperação;
- ausência de rede não apaga Sacola já salva;
- budgets documentados e mensuráveis.

## 4.0.9 — Premium Release / Portfolio Edition
Tese: nenhum recurso novo grande; consolidar e provar.

Entregas:
- três passes de polish: estrutura, percepção, detalhe;
- browser/device matrix;
- evidence ledger 4.0.9;
- case study de produto/UX/engenharia;
- release notes e known limitations.

Critérios de aceite:
- quality gate completo aprovado;
- sem P0/P1 conhecido;
- evidências distinguem PASS, FAIL, BLOCKED e NOT TESTED;
- README representa o produto atual;
- experiência mobile e desktop parecem intencionais, não versões esticadas.

## Status de fechamento — 2026-09-04

A linha 4.0.0→4.0.9 está funcionalmente consolidada. Quality/forensic gates passam e a matriz Playwright/Chromium real fechou com **249 passed, 3 skipped, 0 failed**. Permanecem como evidência externa/manual: teste humano com leitor de tela e Core Web Vitals após publicação.
