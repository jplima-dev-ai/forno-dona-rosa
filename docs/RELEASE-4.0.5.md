# 4.0.5 — Conversion Intelligence

## Tese
Medir a jornada de decisão sem transformar a pizzaria em um sistema de vigilância.

## Entregas
1. Taxonomia de eventos de conversão compartilhada.
2. Resumo de sessão sem retenção de conteúdo sensível.
3. Instrumentação de produto, Rosa, Sacola, checkout e handoff para WhatsApp.
4. Bridge opcional para o `FORNO_ANALYTICS` já existente.
5. Quality gate que bloqueia coleta de campos proibidos.

## Eventos principais
`page_view`, `experience_intent`, `search_started`, `desire_selected`, `product_view`, `rosa_opened`, `rosa_recommendation`, `bag_add`, `bag_opened`, `repeat_order`, `checkout_started`, `whatsapp_handoff`.

## Privacidade
O módulo não coleta nome, endereço, CEP, telefone, mensagem do WhatsApp, observações do pedido, texto de conversa com a Rosa nem termos digitados na busca. Apenas contagens e tokens operacionais allowlisted são mantidos em `sessionStorage`.

## Funis que passam a ser observáveis
- Home → Cardápio → Produto → Sacola → Checkout → WhatsApp.
- Rosa → recomendação → produto → Sacola.
- Busca → produto → Sacola.
- Último pedido → Sacola → Checkout.

## Critérios de aceite
- Nenhum evento aceita chaves fora da allowlist.
- Nenhum texto livre do usuário é persistido.
- O resumo é de sessão e não cria identificador de usuário.
- `main.js` emite eventos apenas após ações reais relevantes.
- Sintaxe JS e gate da release passam.
