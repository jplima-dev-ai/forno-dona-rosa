# ADR 003 — Busca global e curadoria de produto

## Contexto
Com a migração multipágina, obrigar o cliente a conhecer a arquitetura do site aumentaria atrito.

## Decisão
Adicionar busca global no shell compartilhado e uma curadoria pequena no Cardápio. A busca usa dados locais e não envia termos para terceiros.

## Consequências
- produtos e informações operacionais ficam localizáveis pela mesma interação;
- o sistema continua static-first;
- a curadoria não interfere no catálogo canônico.
