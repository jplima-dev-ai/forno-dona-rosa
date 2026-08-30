# Contratos de componentes reutilizáveis

Estes contratos devem sobreviver a mudanças de marca e layout.

## Cabeçalho

- logo vem da configuração;
- nome acessível permanece disponível;
- navegação curta e operável por teclado;
- mobile não cria overflow nem duplica a árvore DOM.

## Product card

- nome é heading no contexto;
- preço é textual;
- disponibilidade é perceptível sem depender só de cor;
- imagem é decorativa quando nome/descrição adjacentes já comunicam o conteúdo;
- ações principais têm alvo de toque adequado e teclado.

## Product detail

- superfície modal usa `<dialog>` quando aberta como overlay;
- página individual possui heading, breadcrumb, preço e disponibilidade;
- personalizações dependem das capacidades do produto;
- foco retorna corretamente ao fechar dialog.

## Sacola

- storage nunca controla preço canônico;
- IDs desconhecidos são rejeitados;
- totais são recalculados;
- mudanças relevantes são anunciadas sem spam;
- uma única ação principal conduz para entrega/retirada.

## Checkout

- labels visíveis;
- valores preservados em erro;
- entrega e retirada têm estados distintos;
- provider de CEP não substitui validação da área;
- dados pessoais não persistem sem opt-in;
- state machine impede progressão incoerente.

## Rosa

- identidade vem da configuração;
- recebe bridge sanitizada;
- não inventa fatos comerciais;
- ambiguidade pede confirmação;
- ação destrutiva exige confirmação explícita.

## Admin Studio

- edita dados, não HTML;
- rascunho e publicado são conceitos separados;
- import é validado antes de substituir estado;
- preview não é publicação;
- ações irreversíveis devem ser explícitas.

## UI móvel fixa

- respeita safe areas;
- não cobre campo focado;
- Sacola tem prioridade sobre navegação secundária quando contém itens;
- Rosa permanece secundária à ação comercial principal.
