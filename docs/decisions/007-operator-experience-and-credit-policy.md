# ADR 007 — Operator experience and creator credit policy

## Decisão

O Admin Studio deve priorizar operadores não técnicos. Configurações frequentes ficam no modo Simples; opções menos frequentes ou técnicas continuam disponíveis no modo Avançado.

O storefront exibe por padrão o crédito `Feito por KJProductions`, armazenado na configuração canônica da marca. O crédito pode ser desativado em um projeto white-label sem editar templates.

## Motivos

- reduzir medo de alterar configurações;
- evitar que o empreendedor precise abrir código;
- preservar autoria no projeto de portfólio;
- permitir remoção contratual do crédito em clientes específicos;
- manter a mesma fonte de verdade entre Home e páginas geradas.

## Limite arquitetural

GitHub Pages permanece leitura estática. O painel não simula autenticação ou escrita remota. Uma futura API poderá substituir o adapter local de persistência sem alterar a semântica do painel.


## Nota posterior

O texto do crédito foi atualizado na linha 3.6 para **Desenvolvido por KJ Productions**. A decisão arquitetural permanece válida: o crédito continua configurável e pode ser desativado no white-label.
