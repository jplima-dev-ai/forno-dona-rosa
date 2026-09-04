# Forno Dona Rosa 4.0.9 — Premium Release

## Tese

A 4.0.9 não acrescenta uma nova grande feature. Ela consolida a série 4.x e fecha o produto como uma experiência de comércio local premium, adaptativa, acessível, mensurável e resiliente.

## Cinco habilidades ativadas

### 1. Premium Experience & Visual Desire
- fecha a linguagem visual 4.x;
- preserva `catalog / hero / detail`;
- reforça temperatura visual `hot / cold`;
- adiciona polish apenas como progressive enhancement;
- não substitui fotografia real por filtros agressivos.

### 2. Universal Responsive Engineering
- layout fluido;
- container queries;
- conteúdo resiliente;
- reduced motion;
- forced colors;
- sem breakpoint por marca/aparelho.

### 3. Accessibility Nexus
- contratos de autonomia;
- foco visível;
- reflow;
- dialogs e retorno de foco protegidos pelos testes existentes;
- Browser/Playwright/Axe: `AUTOMATED_PASS` na execução real de 2026-09-04 (249 passed, 3 skipped, 0 failed).
- NVDA/JAWS/Narrator/VoiceOver permanecem `MANUAL_REQUIRED` até execução humana real.

### 4. AEGIS Quality Guardian
- release manifest;
- quality gate consolidado;
- integridade dos arquivos;
- resiliência para storage, mídia, rede e service worker;
- sem transformar NOT TESTED em PASS.

### 5. Conversion & White-label Readiness
- eventos privacy-first;
- experiência orientada por intenção;
- Smart Menu;
- Rosa Context Engine;
- Admin health;
- nenhuma identidade de cliente nova hardcoded na camada 4.0.9.

## Produto assinatura

A **Nordestina da Dona Rosa** permanece produto nativo da linha 4.x, preparada para descoberta regional, Rosa, Smart Menu, mídia premium e analytics.

## Imagens

O catálogo final possui **23 pizzas e 23 imagens-base únicas**, incluindo asset próprio para a Nordestina da Dona Rosa e para as pizzas doces. O pipeline gera variantes responsivas e mantém dimensões intrínsecas verificadas. A unicidade binária é automatizada; fidelidade entre fotografia e produto servido continua editorial/humana.

## Definition of Done local

Antes do push:

```powershell
npm.cmd run check:js
npm.cmd run release-v4:gate
npm.cmd run quality
npm.cmd run test:a11y:v4
npm.cmd run test:browser
```

A suíte Playwright/Chromium real terminou com **249 passed, 3 skipped e 0 failed**. Testes humanos com NVDA e Core Web Vitals publicados continuam manuais/ambientais.
