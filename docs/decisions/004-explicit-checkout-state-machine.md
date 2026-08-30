# ADR 004 — Estado explícito do checkout

## Decisão
Modelar a progressão comercial com estados nomeados (`bag`, `fulfillment`, `schedule`, `payment`, `extras`, `review`, `handoff`) sem introduzir framework externo.

## Motivo
A jornada já possui condicionais suficientes para que estados implícitos gerem regressões difíceis de rastrear, especialmente em Retirada, agendamento e retorno da revisão.

## Consequência
A interface continua simples e progressiva, mas transições passam a ser observáveis e testáveis.
