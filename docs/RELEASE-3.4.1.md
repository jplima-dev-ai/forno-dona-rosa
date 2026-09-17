# Forno Dona Rosa 3.4.1 — Maintenance Release

A versão 3.4.1 oficializa a linha de manutenção integrada após a 3.4.0. O objetivo é consolidar performance, inicialização e reprodutibilidade de evidência sem ampliar o escopo funcional do produto.

## Escopo

- fontes locais nas páginas geradas;
- bundle determinístico de estilos da home;
- redução de preload não essencial;
- scripts da home adiados quando seguro;
- renderização oculta da Rosa adiada;
- checkout inicializado somente quando aberto;
- Sacola oculta renderizada sob demanda;
- baseline de performance 3.4.1 reproduzível e endurecida;
- atualização de metadados, cache revision, HTML gerado, Admin Studio e quality gates para 3.4.1.

## Evidência automatizada disponível

A manutenção que compõe esta release foi integrada à `main` após validação automatizada no PR #8. Naquela integração, Quality, Browser Certification e Performance Baseline concluíram com sucesso. A execução de performance registrou mediana mobile Performance 77, TBT 25,5 ms e CLS 0; desktop Performance 98, TBT 0 e CLS ~0,0029. Os números Lighthouse sintéticos são tratados separadamente das métricas observadas no navegador.

O bump formal para 3.4.1 possui gate próprio (`release:3.4.1`) e deve manter `npm run quality` verde antes da publicação.

## Tecnologia assistiva

A 3.4.1 possui validação manual informada pelo responsável pelo projeto para as duas tecnologias assistivas efetivamente testadas nesta release:

- NVDA no Windows: **MANUAL PASS na 3.4.1**;
- TalkBack no Android: **MANUAL PASS na 3.4.1**;
- JAWS, Narrator e VoiceOver: não testados por falta de acesso aos ambientes necessários.

A baseline 3.4.0 também preserva sua própria evidência manual histórica. Os novos PASS da 3.4.1 são registrados separadamente e não substituem nem reescrevem a evidência anterior. Automação de Axe/Playwright não substitui teste humano com leitor de tela.

## Core Web Vitals

A medição publicada de Core Web Vitals continua sendo evidência separada da baseline Lighthouse de CI e deve permanecer explícita enquanto não houver coleta de campo publicada.

## Proveniência

- Base histórica protegida: tag `v3.4.0` em `4fd196c56d78ce1317070681ab4ecb30d172a570`.
- Integração da manutenção na `main`: `d7b0bdf3cb03672e60a2c74006e979fee123156d`.
- A tag `v3.4.0`, `docs/RELEASE-3.4.0.md`, `docs/releases/evidence/v3.4.0/summary.md` e `tools/release-3-4-0-check.py` permanecem históricos e não devem ser reescritos como 3.4.1.

## Política de release

A 3.4.1 é uma maintenance release. Mudanças futuras de versão continuam exigindo decisão explícita do responsável pelo projeto.
