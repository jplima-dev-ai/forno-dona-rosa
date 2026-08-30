# Assets de marca

Os assets da referência ficam em `assets/images/brand/`.

- `forno-dona-rosa-logo.png` — master transparente;
- `forno-dona-rosa-logo-720.webp` — versão otimizada para cabeçalho/runtime.

Para outro cliente, use nomes técnicos em inglês e atualize os caminhos em `data/brand/brand.json`. Depois execute:

```powershell
python tools/brand-sync.py
npm.cmd run quality
```

Não use o PNG master em superfícies pequenas quando existir derivado apropriado. Preserve proporção/dimensões para reduzir layout shift.

Imagens de produto seguem contrato separado em `assets/images/products/` e podem ter derivados AVIF/WebP gerados por `tools/build-media.py`.
