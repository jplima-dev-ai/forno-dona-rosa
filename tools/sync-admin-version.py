#!/usr/bin/env python3
"""Keep Admin Studio version markers synchronized with package.json."""
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
PACKAGE = json.loads((ROOT / "package.json").read_text(encoding="utf-8"))
VERSION = str(PACKAGE.get("version", "")).strip()
ADMIN = ROOT / "admin" / "index.html"

if not re.fullmatch(r"\d+\.\d+\.\d+", VERSION):
    raise SystemExit(f"SYNC ADMIN VERSION FAILED: invalid semantic version {VERSION!r}")

text = ADMIN.read_text(encoding="utf-8")
updated, meta_count = re.subn(
    r'(<meta\s+name="x-project-version"\s+content=")[^"]+("\s*/?>)',
    rf'\g<1>{VERSION}\2',
    text,
    count=1,
)
updated, footer_count = re.subn(
    r'Admin Studio v\d+\.\d+\.\d+',
    f'Admin Studio v{VERSION}',
    updated,
    count=1,
)

if meta_count != 1:
    raise SystemExit(f"SYNC ADMIN VERSION FAILED: expected one project-version meta, found {meta_count}")
if footer_count != 1:
    raise SystemExit(f"SYNC ADMIN VERSION FAILED: expected one Admin Studio footer version, found {footer_count}")

ADMIN.write_text(updated, encoding="utf-8")
print(f"ADMIN VERSION SYNC PASSED ({VERSION})")
