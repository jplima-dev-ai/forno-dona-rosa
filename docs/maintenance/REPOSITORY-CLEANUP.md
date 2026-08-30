# Auditoria de higiene do repositório — v3.7.9

## Objetivo

Reduzir drift documental e arquivos sem função atual antes da próxima linha de desenvolvimento, sem apagar histórico de releases, ADRs, testes de regressão ou assets necessários ao build/runtime.

## Removido

Quatro documentos foram removidos porque já possuíam sucessores canônicos:

- `README-PT.md` — duplicata byte a byte de `README.md`;
- `docs/CASE-STUDY.md` — case study legado substituído por `docs/case-study/`;
- `docs/QA.md` — instruções antigas consolidadas em `docs/quality/TESTING.md`;
- `docs/DESIGN-SYSTEM.md` — overview antigo substituído por `docs/design-system/`.

Pastas vazias de artifacts locais também foram removidas. Outputs de Playwright continuam ignorados por `.gitignore` e são gerados apenas quando os testes de navegador executam.

## Preservado deliberadamente

Não foram removidos:

- release notes antigas;
- ADRs;
- gates por versão;
- scripts de regressão;
- páginas geradas do site;
- derivados responsivos de mídia;
- presets/brands/schemas;
- adapters de compatibilidade ainda referenciados pelo runtime ou tooling.

Esses arquivos podem parecer históricos, mas ainda funcionam como evidência, contrato de regressão, input de build ou compatibilidade.

## Documentação revisada

Foram reescritos/atualizados os documentos canônicos de:

- README;
- segurança;
- arquitetura;
- checkout;
- quality/testing;
- performance;
- mapa de documentação;
- getting started;
- criação de clientes;
- white-label;
- configuração;
- acessibilidade;
- componentes;
- Rosa;
- assets de marca;
- design system;
- troubleshooting.

A documentação operacional atual está em português. Nomes técnicos de arquivos e caminhos permanecem em inglês.

## Tooling aprimorado

`tools/docs-check.py` agora:

- exige os documentos canônicos atuais;
- falha se documentos obsoletos retornarem;
- valida caminhos de repositório em backticks;
- valida links Markdown relativos;
- impede links que escapem do repositório;
- confirma que o README identifica a versão corrente.

Os checks de saúde/audit também foram atualizados para depender do case study e README canônicos, não de duplicatas antigas.

## Resultado

- arquivos antes: 481;
- arquivos depois: 477 antes deste relatório, 478 com este relatório de manutenção;
- módulos JS/CSS/data órfãos encontrados: 0;
- `npm run quality`: PASS após a limpeza;
- continuidade do CHANGELOG: 1.0.0–3.7.9 OK.

## Regra para futuras limpezas

Um arquivo só deve ser removido quando sua função estiver comprovadamente substituída ou ausente. Arquivo histórico não é automaticamente obsoleto; release notes, ADRs e regressões antigas continuam valiosos quando explicam ou protegem o comportamento atual.
