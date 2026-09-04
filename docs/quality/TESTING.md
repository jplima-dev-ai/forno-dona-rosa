# Testes e quality gates

## Princípio

O projeto separa **evidência executada** de **capacidade configurada**. Um teste só pode ser registrado como PASS quando realmente rodou no ambiente informado.

## Gate principal

No Windows/PowerShell:

```powershell
npm.cmd run quality
```

Em shells que permitem o wrapper do npm:

```bash
npm run quality
```

O gate principal executa build e checks de sintaxe, configuração, brand leak, nomenclatura, audit, saúde, regressão, Rosa, checkout, Template Factory, documentação, conversão, commerce, responsividade, arquitetura multipágina, produto, Smart Commerce, storefront, Admin Studio, segurança, Browser Certification estrutural, Mobile Usability e Project Doctor.

## Comandos focados

```powershell
npm.cmd run audit
npm.cmd run security
npm.cmd run docs
npm.cmd run doctor
npm.cmd run browser:gate
npm.cmd run mobile:gate
```

## Browser E2E

Após instalar as dependências de desenvolvimento e o navegador do Playwright:

```powershell
npm.cmd run test:browser
npm.cmd run test:browser:mobile
npm.cmd run test:a11y
```

Consulte `docs/testing/BROWSER-TESTING.md` para matriz, execução e artifacts.

## Matriz responsiva

A matriz representa espaços de layout, não marcas de aparelho:

- 320 × 640;
- 360 × 800;
- 390 × 844;
- 430 × 932;
- 768 × 1024;
- 844 × 390 landscape;
- 1366 × 768;
- 1920 × 1080 para revisão manual ampliada.

Também devem ser considerados zoom/reflow, conteúdo longo, teclado virtual, safe areas, reduced motion e forced colors.

## Fluxos críticos

### Cliente

- Home → Cardápio → Produto → Sacola → Checkout;
- busca/filtros e zero results;
- produto indisponível e alternativas;
- entrega e retirada;
- agendamento;
- Pix e dinheiro/troco;
- molhos;
- revisão e handoff manual para WhatsApp;
- recompra e storage antigo;
- offline/falha de CEP.

### Administração

- modo Simples/Avançado;
- alteração de preço/disponibilidade;
- preview e undo;
- import inválido/oversized;
- export de bundle;
- recuperação de rascunho corrompido;
- crédito configurável.

## Acessibilidade

Automação pode detectar uma classe de problemas, mas não comprova experiência de leitor de tela.

Para evidência manual registre:

- plataforma e versão;
- navegador;
- tecnologia assistiva;
- viewport/zoom;
- fluxo;
- resultado esperado;
- resultado observado;
- PASS/FAIL/PARTIAL.

NVDA, JAWS, Narrator, TalkBack e VoiceOver permanecem NOT TESTED até execução real registrada.

## Segurança

`npm.cmd run security` executa hardening estrutural, comportamento negativo e audit. Testes locais não substituem pentest de uma futura implantação com backend/autenticação.

## Release evidence

A linha 3.7 introduziu ledger de evidência em `docs/releases/evidence/`. Ele deve registrar explicitamente ambientes bloqueados e testes não executados em vez de converter ausência de evidência em aprovação.

## Evidência final v4.0.9 — 2026-09-04

Execução real no Windows/Chromium:

```text
3 skipped
249 passed (6.0m)
0 failed
```

A execução confirmou a correção do contraste do Adaptive Commerce e fechou sem failures a matriz automatizada coberta pela configuração. Testes humanos com leitores de tela e CWV publicado continuam fora desse resultado.
