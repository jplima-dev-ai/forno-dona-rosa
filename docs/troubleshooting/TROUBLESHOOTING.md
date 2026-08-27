# Troubleshooting

## The logo does not appear
1. Confirm `brand.logo.header` in `data/brand/brand.json`.
2. Confirm that the referenced file exists.
3. Run `python tools/brand-sync.py`.
4. Run `python tools/project-doctor.py`.

## A generated client fails validation
Run:

```bash
python tools/project-doctor.py --brand brands/<slug>
```

Correct the first reported failed invariant before changing unrelated code.

## Postal-code lookup does not fill the address
The checkout tries the configured lookup flow and can degrade to manual address entry. Confirm network connectivity, then inspect the browser network/console. A provider outage should not erase already entered customer data.

## Rosa does not recognize a product
Check the catalog ID/name/aliases first, then run:

```bash
node tools/rosa-behavior-check.js
```

Do not patch the conversation engine with arbitrary substring exceptions before reproducing the mismatch.

## Documentation references a missing file
Run:

```bash
python tools/docs-check.py
```

Update the canonical document or restore the legitimately required file; do not silence the checker for stale documentation.
