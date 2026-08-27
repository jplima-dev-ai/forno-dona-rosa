# Testing and quality gates

## One-command gate

```bash
npm run quality
```

This command runs JavaScript syntax checks, configuration checks, brand-leak checks, the repository audit, health/regression suites, Rosa and checkout behavior tests, template-factory generation checks, documentation drift checks and the Project Doctor.

## Individual commands

```bash
python tools/audit.py
python tools/health-check.py
python tools/regression-check.py
node tools/rosa-behavior-check.js
node tools/checkout-behavior-check.js
python tools/template-factory-check.py
python tools/docs-check.py
python tools/project-doctor.py
```

## Responsive test matrix
Use the following as representative QA viewports, not device hardcodes: 320×568, 360×800, 390×844, 430×932, 768×1024, 1024×768, 1366×768 and 1920×1080. Also review mobile landscape, zoom/reflow, long content and virtual-keyboard behavior where forms are involved.

## Accessibility evidence
Static and behavioral gates do not prove screen-reader compatibility. For a release requiring accessibility evidence, record platform, browser, assistive technology, flow, expected behavior, observed behavior and result. NVDA/TalkBack/VoiceOver checks must only be marked PASS when actually executed.
