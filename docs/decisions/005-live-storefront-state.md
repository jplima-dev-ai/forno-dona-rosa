# ADR 005 — Live Storefront State

## Decisão
Centralizar o estado operacional em `js/business-status.js`, usando timezone, horários regulares e `specialHours`.

## Motivo
A mesma verdade precisa alimentar Home, Cardápio, Pedido, Localização e Rosa. Duplicar regras de horário aumenta risco de mensagens contraditórias.

## Limite
O estado é calculado no cliente e não substitui confirmação operacional da pizzaria. Um backend futuro poderá fornecer exceções em tempo real através do contrato existente.
