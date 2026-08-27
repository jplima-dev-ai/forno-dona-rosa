#!/usr/bin/env python3
"""Check documentation references, documented commands, versions and stale file mentions."""
from __future__ import annotations
import re, sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
VERSION="2.6.9"
DOCS=[ROOT/"README.md",ROOT/"README-PT.md",ROOT/"SECURITY.md",*sorted((ROOT/"docs").rglob("*.md"))]
errors=[]
known_removed=("tools/generate.py","signature-pizza.svg","og-cover.png")
for doc in DOCS:
    text=doc.read_text(encoding="utf-8")
    for match in re.findall(r'`((?:tools|docs|data|js|css|assets|schemas|presets)/[^`\s]+)`', text):
        clean=match.rstrip('.,;:)')
        if any(ch in clean for ch in '<>{}*'): continue
        if not (ROOT/clean).exists(): errors.append(f"{doc.relative_to(ROOT)} references missing file: {clean}")
    for dead in known_removed:
        if dead in text: errors.append(f"{doc.relative_to(ROOT)} mentions obsolete file: {dead}")
if VERSION not in (ROOT/"README.md").read_text(encoding="utf-8"): errors.append("README.md does not identify current version")
for command in ("project-doctor.py","create-brand.py","docs-check.py"):
    if not (ROOT/"tools"/command).exists(): errors.append(f"Documented tool missing: tools/{command}")
if errors:
    print("DOCS CHECK FAILED")
    [print(f"- {e}") for e in errors]
    raise SystemExit(1)
print(f"DOCS CHECK PASSED ({len(DOCS)} Markdown files checked)")
