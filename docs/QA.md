# QA — Forno Dona Rosa v1.2.9

## Verificações automatizadas incluídas

Execute:

```bash
python tools/audit.py
```

O auditor cobre:

- IDs duplicados;
- um único `h1`;
- `lang=pt-BR`;
- viewport;
- skip link;
- âncoras internas;
- arquivos locais referenciados;
- segurança de `target=_blank`;
- ausência de `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `eval`, `new Function` e `document.write` no runtime principal;
- CSP presente;
- restrição same-origin do service worker;
- sintaxe dos arquivos JavaScript;
- presença de dados mínimos do manifest.

## Matriz manual ainda necessária antes de declarar release plenamente validada

- 320 × 568;
- 390 × 844;
- 768 × 1024;
- 1366 × 768;
- 1920 × 1080;
- zoom 200%;
- teclado completo;
- NVDA;
- Axe;
- instalação PWA em navegador compatível;
- offline após instalação;
- Chromium, Firefox e Safari/WebKit quando disponíveis.

Não marque essas linhas como aprovadas sem execução real.
