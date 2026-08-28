# Getting started

Applies to v3.0.9.

## Requirements
- Python 3.11 or newer.
- Node.js 20 or newer for JavaScript behavior checks and `npm run quality`.
- A modern browser for manual UI review.

## Run the reference implementation
From the repository root:

```bash
python -m http.server 8000
```

Open `http://localhost:8000`.

## Verify the repository

```bash
npm run quality
```

A successful run ends with all mandatory static, behavioral, documentation, template-factory and project-doctor gates passing. Browser/assistive-technology checks are separate manual evidence unless a browser test environment is installed and actually executed.

## Create your first client package

```bash
python tools/create-brand.py --name "Example Pizzeria" --slug example-pizzeria --preset pizzeria
```

Then follow [Create a new client](../customization/CREATE-A-CLIENT.md).
