# Brand assets

The current reference brand assets live in `assets/images/brand/`.

- `forno-dona-rosa-logo.png` — full-resolution transparent master.
- `forno-dona-rosa-logo-720.webp` — optimized header/runtime version.

For another client, replace these with appropriately named client assets and update `brand.logo.full` and `brand.logo.header` in `data/brand/brand.json`, then run `python tools/brand-sync.py`.

Do not use the master PNG for small UI surfaces when an optimized derivative is available. Preserve intrinsic width/height or aspect ratio to avoid layout shift.
