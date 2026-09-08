# Admin Variant & Pricing Studio — 4.1.7

O Admin Studio permite editar as variantes de cada pizza sem tocar no JSON. Para cada tamanho — Média, Grande e Família — o operador pode alterar preço, disponibilidade, diâmetro e rendimento estimado.

## Contratos

- somente pizzas exibem o editor de variantes;
- ao menos um tamanho deve permanecer disponível;
- preço deve ser maior que zero;
- diâmetro aceito no painel: 20–60 cm;
- rendimento exige mínimo >= 1 e máximo >= mínimo;
- ao salvar, `basePrice` acompanha o preço da variante Média para compatibilidade legada;
- no Admin, o campo de preço base fica somente leitura para pizzas; a edição canônica ocorre na variante Média, evitando duas fontes de verdade;
- alterações ficam no rascunho, participam de histórico/undo, preview e exportação do Admin.

## Acessibilidade

O editor usa `fieldset`, `legend`, labels nativos, checkboxes e inputs numéricos. Não depende de cor, drag-and-drop ou controle customizado.
