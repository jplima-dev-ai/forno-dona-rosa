# Forensic Release Audit — Forno Dona Rosa v4.0.9

## Escopo
Revisão adversarial executada sobre a árvore completa v4.0.9 depois da integração das 23 fotografias únicas de pizzas.

## Bugs encontrados e corrigidos

1. **Experience Router publicava contrato incompatível** — emitia no `document` e usava `detail.routeId`, enquanto os consumidores escutavam no `window` e esperavam `detail.intent`. Corrigido para um único contrato público coerente.
2. **Adaptive Commerce não reconhecia a API pública de horário** — consultava apenas `business.isOpen`, porém `FORNO_APP.getBusinessStatus()` retorna `business.open`. O estado fechado agora funciona para ambos os contratos válidos.
3. **Falso mismatch do Service Worker** — `resilience-v4.js` ainda se identificava como 4.0.8. Agora acompanha `FORNO_META.version` com fallback 4.0.9.
4. **Quarentena de storage ampla demais** — qualquer chave contendo `forno` era tratada como JSON; preferências textuais válidas do Admin (`simple`, `done`) podiam ser removidas. Agora somente chaves explicitamente JSON são inspecionadas e o namespace white-label é respeitado.
5. **Reconciliação de Sacola inoperante** — `resilience-v4.js` esperava `summary.items`, mas `getBagSummary()` não expõe itens. Foi criada API não sensível `getBagProductIds()` para reconciliação real sem expor observações/endereço.
6. **Telemetria de recomendação da Rosa sem produtor** — Conversion Intelligence escutava `forno:rosa-recommendation`, mas a Rosa não emitia o evento. Foi adicionado emissor seguro e testes para recomendação, bebidas e “monte uma noite”.
7. **Preferência de bebida vazava para pedido explícito de pizza** — depois de pedir bebidas, “Me indique uma pizza” podia recomendar bebidas. Pedido explícito de pizza agora remove a preferência temporária de bebida.
8. **Dimensões intrínsecas incorretas em imagens geradas** — pizzas 4:3 eram publicadas com `width/height` quadrados e artigos/cards tinham ratios que não correspondiam aos arquivos. O build agora lê dimensões físicas com Pillow; todas as imagens HTML publicadas são validadas por proporção.
9. **Fallback antigo do exportador de mídia do Admin** — fallback de versão ainda apontava para 3.9.9. Atualizado para 4.0.9.
10. **Gate de performance declarava budgets sem comparar artefatos físicos** — o novo gate forense verifica JS total, CSS total e maior mídia de produto contra os budgets da release.

## Evidência automatizada final
- `npm run quality`: PASS após todas as correções.
- Rosa behavior suite: 28/28 PASS.
- Visual media uniqueness: 23/23 pizzas com imagens-base únicas.
- Release forensic gate: PASS.
- Dimensões intrínsecas: 260 imagens HTML verificadas.
- Referências locais em HTML publicado: 0 ausentes.
- A11y IDREFs (`label for`, `aria-labelledby`, `aria-describedby`, `aria-controls`): 0 alvos ausentes.

## Limites de evidência do runtime de geração
A execução Chromium/Playwright foi bloqueada neste runtime por política local (`ERR_BLOCKED_BY_ADMINISTRATOR`). Esse bloqueio não foi tratado como PASS. A evidência de navegador foi posteriormente obtida por execução real no Windows do usuário, registrada abaixo. NVDA humano e Core Web Vitals publicados continuam fora do escopo automatizado.

## Local Playwright follow-up — 2026-09-03

A Windows Chromium run exposed repeated WCAG AA color-contrast failures on the home Adaptive Commerce card across desktop, 320, 390, 430, tablet and landscape viewports. The card had a light computed background (`#f1ece7`) while inheriting the storefront light-on-dark palette.

Fix applied:
- adaptive title/body: `#321b0c`;
- kicker: `#8a460b`;
- ghost action: dark text/border on the light card;
- primary CTA remains white on `#b84424` (AA-compatible).

The existing Axe and v4 accessibility suites remain the release regression gate for this defect.

## Final Playwright validation — 2026-09-04

Após a correção de contraste, a suíte completa foi reexecutada em Windows/Chromium e terminou com:

```text
3 skipped
249 passed (6.0m)
0 failed
```

Isso fecha como PASS automatizado a browser/device matrix e o gate Axe serious/critical da release 4.0.9. Os 12 failures anteriores do Adaptive Commerce não reapareceram.

Continuam explicitamente fora desta evidência: teste humano completo com NVDA/JAWS/Narrator/VoiceOver/TalkBack e Core Web Vitals da versão publicada.
