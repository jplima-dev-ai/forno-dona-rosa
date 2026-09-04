# Testes de navegador e usabilidade móvel

**Versão revisada:** 3.7.9

Esta suíte valida o storefront em navegador real com Playwright e usa Axe para encontrar violações automatizáveis de acessibilidade. Ela complementa os quality gates estáticos; não substitui testes humanos com leitores de tela ou dispositivos físicos.

## Objetivo

Proteger a tarefa mais importante do produto: uma pessoa deve conseguir entrar, encontrar um produto, adicioná-lo à Sacola, escolher recebimento e chegar à revisão do pedido sem barreiras evitáveis.

## Matriz automatizada

A configuração inclui Chromium em:

- 320 × 640;
- 390 × 844;
- 430 × 932;
- 768 × 1024;
- 844 × 390 (landscape);
- 1366 × 768.

Os breakpoints não representam marcas específicas. São amostras de espaços críticos para detectar overflow, controles apertados, chrome fixo excessivo e mudanças de composição.

## Jornadas protegidas

- rotas principais e deep links de produto;
- CTA `Pedir agora` → Cardápio;
- busca tolerante por `calabreza`;
- adicionar produto e abrir Sacola;
- Retirada sem campos de CEP/endereço visíveis, ativos ou obrigatórios;
- validação de troco;
- modo Simples/Avançado do Admin Studio;
- preview e Desfazer administrativos;
- fallback offline e política de cache do Admin;
- dialogs críticos com fechamento por Escape;
- ausência de overflow horizontal nos viewports da matriz;
- alvos de toque práticos nos fluxos principais.

## Axe

O gate automatizado bloqueia violações com impacto `serious` ou `critical` nas páginas principais. Resultado verde no Axe **não significa conformidade total com WCAG nem acessibilidade completa**.

Ainda exigem validação manual quando a release for certificada para produção:

- NVDA;
- JAWS/Narrator quando aplicável;
- TalkBack;
- VoiceOver;
- zoom/reflow humano;
- exploração por toque;
- compreensão cognitiva do fluxo.

## Comandos

Após instalar as dependências de desenvolvimento e o Chromium do Playwright:

```powershell
npm.cmd run test:browser
```

Somente mobile:

```powershell
npm.cmd run test:browser:mobile
```

Acessibilidade automatizada:

```powershell
npm.cmd run test:a11y
```

No GitHub, `.github/workflows/browser-certification.yml` instala as dependências, executa `npm run quality`, executa o E2E e preserva artifacts quando disponíveis.

## Evidência e honestidade

Um teste só deve ser marcado como executado quando o runner realmente terminou. Falha de infraestrutura, browser bloqueado ou dependência ausente é `NOT RUN`/`BLOCKED`, nunca `PASS`.

## Evidência final v4.0.9 — 2026-09-04

Execução real no Windows/Chromium:

```text
3 skipped
249 passed (6.0m)
0 failed
```

A execução confirmou a correção do contraste do Adaptive Commerce e fechou sem failures a matriz automatizada coberta pela configuração. Testes humanos com leitores de tela e CWV publicado continuam fora desse resultado.
