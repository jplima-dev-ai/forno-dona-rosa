# Getting started

## Requisitos

- Python 3.11 ou mais recente.
- Node.js 20 ou mais recente.
- Navegador moderno para revisão manual.

## Rodar localmente

Na raiz do repositório:

```powershell
python -m http.server 8000
```

Abra `http://localhost:8000`.

## Validar o projeto

No Windows/PowerShell:

```powershell
npm.cmd run quality
```

O gate cobre build e contratos locais. Testes Playwright/Axe exigem as dependências de desenvolvimento e um ambiente de navegador que permita execução.

## Testes de navegador

Depois de instalar as dependências:

```powershell
npm.cmd run test:browser
npm.cmd run test:a11y
```

Consulte `docs/testing/BROWSER-TESTING.md` antes de interpretar resultados.

## Criar um cliente

```powershell
python tools/create-brand.py --name "Example Pizzeria" --slug example-pizzeria --preset pizzeria
```

Depois siga [Criar um novo cliente](../customization/CREATE-A-CLIENT.md).

## Administração

A referência também possui `/admin/` para edição local-first de configuração sem alteração manual de código. Veja [Admin Studio](../admin/ADMIN-STUDIO.md).
