# Dona Rosa Pizza Configurator — 4.1.1

## Objetivo

A 4.1.1 transforma o formulário de personalização em uma jornada linear de quatro etapas na mesma página: tamanho e sabores, personalização, revisão e adição à sacola.

## Contrato de experiência

- preserva controles HTML nativos para sabores, tamanho, borda e quantidade;
- não cria um wizard que esconda etapas nem prenda foco;
- mantém meio a meio e preços por variante da 4.1.0;
- mostra revisão textual antes da ação final;
- atualiza a revisão sem usar live region para cada tecla, evitando verbosidade em leitor de tela;
- observações e remoção de ingredientes continuam opcionais e sujeitas a confirmação do atendimento;
- nenhum adicional não modelado é cobrado automaticamente.

## Responsividade

A barra de etapas reduz de quatro para duas e depois uma coluna conforme o espaço disponível. A revisão usa duas colunas quando há espaço e uma coluna em containers estreitos.

## Acessibilidade

As etapas usam lista ordenada real, os grupos usam `fieldset`/`legend`, a revisão usa `dl`, o submit continua botão nativo e erros continuam associados ao fluxo existente. Validação manual NVDA permanece obrigatória para evidência de tecnologia assistiva real.
