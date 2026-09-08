# Adaptive Ordering & Accessibility Fortress — 4.1.8

## Objetivo
Endurecer os fluxos comerciais construídos na linha 4.1 sem adicionar complexidade funcional nova. A versão protege configurador, Smart Portion, Mesa da Dona Rosa, Smart Pairing, sacola, checkout, Rosa Concierge e Admin Variant Studio.

## Contratos
- HTML nativo continua prioritário para inputs, selects, botões e dialogs.
- foco visível é reforçado sem remover o indicador do navegador;
- títulos de resultado possuem margem de rolagem para headers sticky;
- dialogs respeitam `100dvh`, overscroll local e landscape de pouca altura;
- controles e texto podem crescer sem largura rígida;
- telas de 320 px continuam sendo alvo explícito de teste;
- `prefers-reduced-motion: reduce` neutraliza motion não essencial;
- `forced-colors: active` preserva bordas e foco;
- nenhuma declaração de leitor de tela é feita sem teste real.

## Matriz automatizada planejada
320×568, 390×844, 768×1024, 1024×768 e 1366×768 no E2E dedicado. O contrato de dados também registra 430×932 e 1920×1080 para cobertura ampliada de release.

## Assistive technology
NVDA permanece `MANUAL_REQUIRED`. Narrator e VoiceOver permanecem `NOT_TESTED` até execução real. Automação estrutural não substitui tecnologia assistiva.
