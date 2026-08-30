# Acessibilidade

## Princípio

A acessibilidade é requisito arquitetural. O projeto mira princípios de WCAG 2.2 AA e prioriza uso prático com teclado, zoom, contraste e leitores de tela, especialmente NVDA no Windows — sem declarar conformidade baseada apenas em checks automatizados.

## Contratos implementados

- HTML semântico e landmarks;
- hierarquia coerente de headings;
- skip link;
- links, botões e formulários nativos;
- labels visíveis e nomes acessíveis;
- `fieldset`/`legend` para escolhas relacionadas;
- foco visível e retorno de foco;
- dialogs nativos;
- mensagens de erro associadas aos campos;
- live regions limitadas a mudanças relevantes;
- reduced motion;
- forced colors;
- reflow e dialogs roláveis em zoom alto;
- safe areas/touch targets no mobile;
- uma única árvore DOM para desktop/mobile;
- alt text contextual e `alt=""` para imagens decorativas redundantes.

## Checkout

- Retirada remove/desabilita campos de entrega do fluxo ativo;
- CEP anuncia estados de forma concisa;
- validação explica recuperação em linguagem humana;
- revisão recebe foco contextual antes do handoff;
- nenhuma etapa envia WhatsApp automaticamente.

## Admin Studio

O painel usa controles nativos, labels, headings, status e navegação por teclado. Modo Simples reduz carga cognitiva sem esconder dados de tecnologias assistivas por hacks de DOM duplicado.

## Mobile e responsividade

Breakpoints respondem ao espaço. O projeto inclui contratos para 320/390/430 px, tablet e landscape baixo, além de overflow/reflow e fixed UI coordenada.

## Automação

A linha 3.7 configura Playwright/Axe e um gate estrutural de Browser Certification. Axe pode detectar classes de problemas, mas não comprova experiência com leitor de tela.

## Evidência manual obrigatória para claims de AT

Registre:

- sistema e versão;
- navegador;
- tecnologia assistiva;
- fluxo;
- esperado/observado;
- PASS/FAIL/PARTIAL.

NVDA, JAWS, Narrator, TalkBack e VoiceOver permanecem NOT TESTED até execução real registrada.
