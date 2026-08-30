#!/usr/bin/env python3
"""Check documentation references, Markdown links, versions and obsolete docs."""
from __future__ import annotations
import re, json
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
VERSION=json.loads((ROOT/'package.json').read_text(encoding='utf-8'))['version']
DOCS=[ROOT/'README.md',ROOT/'SECURITY.md',*sorted((ROOT/'docs').rglob('*.md'))]
errors=[]

OBSOLETE={
    'README-PT.md',
    'docs/CASE-STUDY.md',
    'docs/QA.md',
    'docs/DESIGN-SYSTEM.md',
    'tools/generate.py',
    'assets/images/signature-pizza.svg',
    'assets/images/og-cover.png',
}
CANONICAL={
    'README.md','SECURITY.md','docs/README.md','docs/ARCHITECTURE.md',
    'docs/ACCESSIBILITY.md','docs/CHECKOUT.md','docs/quality/TESTING.md',
    'docs/testing/BROWSER-TESTING.md','docs/admin/ADMIN-STUDIO.md',
    'docs/case-study/architecture.md','docs/case-study/commerce-flow.md',
}

for rel in sorted(OBSOLETE):
    if (ROOT/rel).exists():
        errors.append(f'Obsolete file returned: {rel}')
for rel in sorted(CANONICAL):
    if not (ROOT/rel).exists():
        errors.append(f'Canonical documentation missing: {rel}')

for doc in DOCS:
    text=doc.read_text(encoding='utf-8')
    rel_doc=doc.relative_to(ROOT)
    # Backticked repository paths.
    for match in re.findall(r'`((?:tools|docs|data|js|css|assets|schemas|presets|tests)/[^`\s]+)`', text):
        clean=match.rstrip('.,;:)')
        if any(ch in clean for ch in '<>{}*'): continue
        if clean in OBSOLETE and rel_doc.as_posix() == 'docs/maintenance/REPOSITORY-CLEANUP.md': continue
        if not (ROOT/clean).exists(): errors.append(f'{rel_doc} references missing file: {clean}')
    # Relative Markdown links. Ignore web/mail/anchors and code-like dynamic paths.
    for target in re.findall(r'(?<!!)\[[^\]]+\]\(([^)]+)\)', text):
        target=target.strip().split()[0].strip('<>')
        if not target or target.startswith(('#','http://','https://','mailto:')): continue
        target=target.split('#',1)[0]
        if not target: continue
        resolved=(doc.parent/target).resolve()
        try: resolved.relative_to(ROOT.resolve())
        except ValueError:
            errors.append(f'{rel_doc} link escapes repository: {target}')
            continue
        if not resolved.exists(): errors.append(f'{rel_doc} has broken Markdown link: {target}')
    for dead in OBSOLETE:
        if dead in text and rel_doc.as_posix() not in {'CHANGELOG.md','docs/maintenance/REPOSITORY-CLEANUP.md'}:
            errors.append(f'{rel_doc} mentions obsolete file: {dead}')

if VERSION not in (ROOT/'README.md').read_text(encoding='utf-8'):
    errors.append('README.md does not identify current version')
for command in ('project-doctor.py','create-brand.py','docs-check.py'):
    if not (ROOT/'tools'/command).exists(): errors.append(f'Documented tool missing: tools/{command}')

if errors:
    print('DOCS CHECK FAILED')
    for error in errors: print(f'- {error}')
    raise SystemExit(1)
print(f'DOCS CHECK PASSED ({len(DOCS)} Markdown files checked)')
