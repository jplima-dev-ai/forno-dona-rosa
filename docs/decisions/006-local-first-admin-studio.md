# ADR 006 — Admin Studio local-first antes do backend

## Contexto

O projeto precisa ser vendido e personalizado para pizzarias cujos proprietários não dominam programação. GitHub Pages, entretanto, hospeda arquivos estáticos e não oferece um backend autenticado capaz de gravar alterações diretamente no repositório.

## Decisão

A versão 3.4 introduz um Admin Studio local-first que edita um modelo de dados em memória, persiste rascunhos somente no navegador e exporta bundles versionados. Um utilitário de aplicação transforma o bundle em arquivos canônicos após backup e validação.

## Motivos

- não expor credenciais ou tokens no frontend;
- não fingir autenticação server-side inexistente;
- permitir que pessoas leigas alterem dados sem tocar em código;
- preservar a arquitetura static-first atual;
- criar contratos que possam ser conectados a uma API autenticada futuramente.

## Consequências

Nesta fase, aplicar alterações publicadas ainda exige executar o utilitário do projeto e realizar o deploy. Uma futura camada backend poderá substituir esse passo sem redesenhar a interface administrativa.
