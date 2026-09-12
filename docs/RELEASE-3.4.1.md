# Forno Dona Rosa 3.4.1 — Performance Stabilization Release

## Estado

A versão **3.4.1** é a linha corrente de estabilização de performance. Este documento registra evidências executadas e pendências sem antecipar aprovação de release.

A release formal anterior permanece **v3.4.0** até que a 3.4.1 seja mesclada, publicada e validada no ambiente final. A tag `v3.4.0` não deve ser movida nem reescrita.

## Objetivo da 3.4.1

A 3.4.1 corrige gargalos medidos na home publicada da 3.4.0, com foco em estabilidade visual e caminho crítico de renderização mobile, sem alterar contratos comerciais de Sacola, checkout, Rosa, catálogo ou Admin Studio.

Principais mudanças:

- remoção de Google Fonts do caminho crítico e adoção de stacks locais estáveis;
- correção da geometria intrínseca do hero mobile;
- bundle CSS reprodutível da home gerado por `tools/build-home-bundle.py`;
- redução da home para um único stylesheet bloqueante;
- hidratação pós-paint dos scripts da home, preservando a ordem original;
- sincronização de versão em package, app meta, service worker, HTML e manifesto;
- modernização de gates históricos para validar capacidades reais, sem exigir artificialmente numeração 4.x.

## Baseline publicada — 3.4.0

Medição Lighthouse em `https://jplima-dev-ai.github.io/forno-dona-rosa/` antes da 3.4.1:

### Mobile

- Performance: **70**
- FCP: **3,16 s**
- LCP: **3,31 s**
- TBT: **144 ms**
- CLS: **0,282**

### Desktop

- Performance: **96**
- FCP: **0,86 s**
- LCP: **0,88 s**
- TBT: **0 ms**
- CLS: **0,091**

O diagnóstico identificou troca tardia das webfonts como principal causa do CLS. No mobile, o elemento de LCP era o bloco de decisão inicial `.experience-router__grid`.

## Evidência Lighthouse da branch 3.4.1

Execução GitHub Actions bem-sucedida após a arquitetura de hidratação pós-paint:

- workflow run: `34686599153`;
- job: `103534550092`.

### Mobile

- Performance: **97**
- FCP: **1,50 s**
- LCP: **2,40 s**
- TBT: **0 ms**
- CLS: **0**

### Desktop

- Performance: **98**
- FCP: **0,41 s**
- LCP: **1,09 s**
- TBT: **0 ms**
- CLS: **0**

Metas do gate de performance da 3.4.1:

- mobile CLS ≤ 0,10;
- mobile LCP ≤ 2,50 s;
- desktop CLS ≤ 0,10.

A execução acima passou essas metas em ambiente local de CI servido por `python -m http.server`. Ela é evidência de laboratório da branch, não substitui a medição da URL publicada.

## Acessibilidade

A 3.4.1 preserva os contratos automatizados existentes: semântica, teclado, foco, Axe serious/critical, reflow, 320 px, forced colors e `prefers-reduced-motion`.

Evidência manual já registrada na release 3.4.0:

- NVDA no Windows: PASS manual;
- TalkBack no Android: PASS manual;
- JAWS, Narrator e VoiceOver: sem claim de aprovação por falta de execução correspondente.

**A 3.4.1 não recebe automaticamente um novo PASS manual de leitor de tela.** Uma nova certificação manual só pode ser registrada após execução humana sobre a versão final.

## Browser e regressão

Antes da aprovação final da 3.4.1 são obrigatórios:

- `Quality`: PASS;
- `Browser Certification`: PASS;
- Playwright real executado na versão corrente;
- Axe automatizado sem violações serious/critical nos fluxos cobertos;
- GitHub Pages publicado com sucesso;
- reteste Lighthouse da URL publicada.

A evidência Windows 403 passed / 0 failed / 17 skipped permanece registrada como baseline da 3.4.0 e não deve ser apresentada como uma nova execução Windows da 3.4.1.

## Estado de aprovação

**PENDING_3_4_1_CI_AND_PUBLISHED_LIGHTHOUSE_RETEST**

A 3.4.1 só deve ser marcada como release aprovada depois que os gates obrigatórios estiverem verdes e a versão publicada for medida novamente.
