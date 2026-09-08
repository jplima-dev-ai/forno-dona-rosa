# Intelligent Bag 2.0 — v4.1.5

A sacola da 4.1.5 permite editar uma pizza já adicionada sem removê-la e reconstruir o pedido. O editor preserva o item, recalcula o preço pela mesma fonte de verdade usada pelo configurador e salva apenas após confirmação explícita.

## O que pode ser editado

- tamanho disponível para aquele sabor ou combinação meio a meio;
- borda;
- ingredientes a remover;
- observações.

Quantidade continua usando os controles dedicados `− 1` e `+ 1`.

## Acessibilidade

O acionador é um botão nativo `Editar pizza` com `aria-expanded` e `aria-controls`. O editor usa formulário, labels, `select`, `input` e `textarea` nativos. Ao abrir, o foco vai para o primeiro campo. Ao cancelar, volta ao acionador. Depois de salvar, o item é renderizado novamente, a alteração é anunciada e o foco retorna ao botão de edição correspondente.

## Segurança de estado

A edição não altera `pizzaId`, `pizza2Id`, `id` ou quantidade. O patch passa novamente por `normalizeCartItem`, que valida disponibilidade, tamanho, borda, limites de texto e recalcula `unitPrice` e `total`. Uma falha preserva a configuração anterior.

## Compatibilidade

A feature não exige mudança no schema persistido da sacola; portanto `bagSchemaVersion` permanece 4. Isso evita migração sem benefício técnico.

## Evidência ainda pendente

A execução real de Playwright, NVDA humano e Core Web Vitals publicados permanece para a validação final da 4.1.9, conforme decisão do projeto.
