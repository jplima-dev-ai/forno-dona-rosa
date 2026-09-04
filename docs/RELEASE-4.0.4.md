# Forno Dona Rosa 4.0.4 — Adaptive Commerce

## Tese
A página deve priorizar a próxima ação útil com base no estado atual da sessão, sem login obrigatório e sem coletar dados sensíveis.

## Cinco entregas
1. Adaptive Commerce Engine com máquina de estados explícita.
2. Experiência distinta para Sacola ativa, estabelecimento fechado, último pedido, escolha guiada, descoberta e nova visita.
3. CTA contextual para Sacola, repetir pedido, Rosa, cardápio ou história.
4. Reação a mudanças de Sacola, horário e intenção sem polling contínuo.
5. Quality gate com contrato de privacidade, acessibilidade e fallback.

## Prioridade de estados
`active-order > closed > returning > guided-choice > discover-house > new-visitor`.

## Privacidade
Nenhum endereço, CEP, nome, texto de conversa ou identificador pessoal é persistido por este módulo. Ele apenas consulta APIs e DOM já existentes no momento da renderização.

## Acessibilidade
- O painel não rouba foco na carga inicial.
- Mudanças passivas não geram anúncios automáticos.
- Mudança explícita de intenção pode usar o `#app-status` já existente.
- Ações são links ou botões nativos.
- Forced Colors e Reduced Motion possuem fallback.
