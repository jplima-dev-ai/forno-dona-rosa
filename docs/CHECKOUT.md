# Checkout

## Objetivo

Transformar uma Sacola em uma mensagem completa para WhatsApp com o menor atrito possível, sem envio automático e sem exigir backend.

## State machine

```text
bag
→ fulfillment
→ schedule
→ payment
→ extras
→ review
→ handoff
```

As transições são explícitas em `js/checkout-state.js`.

## Entrega ou retirada

### Entrega

- exige os dados de endereço necessários;
- CEP usa ViaCEP como primário e BrasilAPI como fallback;
- área atendida é derivada da configuração da marca;
- provider failure permite fallback manual identificado como sujeito a confirmação.

### Retirada

- remove os campos de entrega da experiência ativa;
- campos ocultos ficam `disabled` e fora da validação/foco;
- lookup pendente de CEP é invalidado;
- o endereço configurado da pizzaria é apresentado ao cliente.

Esse contrato possui regressões específicas porque já existiu um bug histórico em que Retirada restaurada podia reexibir CEP/endereço.

## Horário

O cliente pode escolher o mais rápido possível ou agendar quando habilitado. Slots válidos são derivados de:

- timezone da marca;
- horários regulares;
- horários especiais;
- antecedência mínima;
- horizonte máximo configurado.

## Pagamento

A referência Dona Rosa aceita:

- Pix;
- dinheiro em espécie.

Ao escolher dinheiro, troco é opcional e o valor informado não pode ser menor que o subtotal demonstrativo atual.

## Extras

Molhos são configuráveis e opcionais. Somente opções disponíveis entram na revisão e na mensagem final.

## Revisão

A revisão apresenta itens, personalizações, recebimento, horário, pagamento, troco quando aplicável, molhos e endereço apenas para entrega. Ações de edição retornam diretamente à seção correspondente em vez de reiniciar o fluxo.

## WhatsApp

O site apenas abre o WhatsApp com mensagem pré-preenchida. O cliente continua responsável por revisar e tocar em **Enviar**.

O snapshot de último pedido só é salvo no momento do handoff e é reconciliado posteriormente com catálogo/preços/disponibilidade atuais.

## Privacidade

Nome/endereço são de sessão por padrão. Persistência exige opt-in explícito e pode ser apagada pelo usuário. Storage é tratado como entrada não confiável e sanitizado antes de renderização.

## Acessibilidade

- `fieldset`/`legend` para escolhas relacionadas;
- labels visíveis;
- erros associados ao campo;
- foco contextual ao entrar em revisão;
- conditional UI removida do fluxo quando não aplicável;
- touch targets e safe areas no mobile;
- reduced motion e forced colors.

## Evidência

`node tools/checkout-behavior-check.js` cobre normalização/serviço de CEP. Os gates de conversão, commerce, security e browser certification protegem contratos adicionais. Nenhum deles substitui teste manual com tecnologia assistiva e dispositivo real.
