# Troubleshooting

## PowerShell bloqueia `npm.ps1`

Use:

```powershell
npm.cmd run quality
```

Isso evita depender da política de execução do wrapper PowerShell do npm.

## `python` não é encontrado

Confirme:

```powershell
python --version
```

O projeto requer Python 3.11+.

## Quality falha após editar marca

Execute primeiro:

```powershell
python tools/brand-sync.py
npm.cmd run quality
```

Leia o **primeiro** erro real; falhas seguintes podem ser consequência.

## Bundle do Admin é rejeitado

Verifique:

- arquivo JSON;
- tamanho dentro do limite;
- preços numéricos positivos;
- URLs externas do crédito em HTTPS;
- quantidade de produtos dentro do contrato;
- estrutura compatível com o bundle atual.

Não edite o validador apenas para “fazer passar”. Corrija o dado ou a incompatibilidade de schema.

## CEP não consulta

A consulta depende de internet e dos provedores ViaCEP/BrasilAPI. Offline ou falha de provider deve permitir fallback manual quando a configuração autoriza, sem fingir validação remota.

## Retirada ainda mostra endereço

Isso é regressão. O estado Retirada deve ocultar e desabilitar campos de entrega. Rode os gates de regressão/browser e verifique `js/checkout.js` antes de publicar.

## Playwright não inicia localmente

Instale dependências e browser do Playwright conforme `docs/testing/BROWSER-TESTING.md`. Políticas corporativas podem bloquear navegação automatizada; nesse caso registre BLOCKED e use o workflow do GitHub Actions para evidência E2E.

## Cache mostra versão antiga

Confirme `package.json`, `js/app-meta.js` e `service-worker.js`. O quality gate verifica sincronização de versão e limpeza de caches obsoletos.
