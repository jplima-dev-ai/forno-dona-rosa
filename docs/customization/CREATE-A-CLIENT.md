# Create a new client

Applies to v3.0.9.

## 1. Choose a preset
Supported starter presets:
- `pizzeria`
- `coffee-shop`

Presets define capabilities, not final art direction. A new client still requires real brand, content, catalog and media work.

## 2. Generate the client package

```bash
python tools/create-brand.py --name "Bella Napoli" --slug bella-napoli --preset pizzeria
```

The command creates `brands/bella-napoli/` with `brand.json`, `content.json`, `brand-theme.css` and an assets checklist.

## 3. Add brand assets
Add the logo files declared by the generated `brand.json`. Keep filenames technical and in English.

## 4. Edit client configuration
Update contacts, address, SEO, delivery rules, assistant identity and feature flags. See [Configuration](CONFIGURATION.md).

## 5. Validate before applying

```bash
python tools/project-doctor.py --brand brands/bella-napoli
```

## 6. Apply to the static site

```bash
python tools/apply-brand.py bella-napoli
```

This copies the canonical client configuration and runs `tools/brand-sync.py`.

## 7. Replace catalog and media
The current Forno Dona Rosa menu is reference content. Replace it deliberately for the client. Do not present demonstration prices or products as client facts.

## 8. Run the complete gate

```bash
npm run quality
```

## 9. Manual accessibility and responsive review
At minimum, verify keyboard flow, dialogs, checkout recovery, zoom/reflow, narrow mobile layouts and the real assistive-technology combinations required by the target audience. Do not convert `NOT TESTED` into `PASS`.
