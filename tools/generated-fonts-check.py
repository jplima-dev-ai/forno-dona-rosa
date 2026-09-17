#!/usr/bin/env python3
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
BUILD_SITE = ROOT / "tools" / "build-site.py"

EXCLUDED_PARTS = {
    "node_modules",
    "playwright-report",
    "test-results",
    ".git",
}

def generated_pages():
    for path in ROOT.rglob("*.html"):
        rel = path.relative_to(ROOT)
        if any(part in EXCLUDED_PARTS for part in rel.parts):
            continue
        text = path.read_text(encoding="utf-8", errors="replace")
        if "data-page=" in text:
            yield rel, text

checks = []

def check(label, condition):
    ok = bool(condition)
    checks.append((label, ok))
    print(("PASS  " if ok else "FAIL  ") + label)

source = BUILD_SITE.read_text(encoding="utf-8")
pages = list(generated_pages())

check("build-site generator exists", BUILD_SITE.exists())
check("generated pages discovered", len(pages) > 0)
check(
    "generator no longer references Google Fonts",
    "fonts.googleapis.com" not in source and "fonts.gstatic.com" not in source,
)

google_refs = []
missing_local = []
local_pattern = re.compile(r'href="(?:\.\./)*css/fonts-local\.css"')

for rel, text in pages:
    if "fonts.googleapis.com" in text or "fonts.gstatic.com" in text:
        google_refs.append(str(rel))
    if not local_pattern.search(text):
        missing_local.append(str(rel))

check(
    f"generated pages contain no Google Fonts references ({len(pages)} checked)",
    not google_refs,
)
check(
    f"generated pages load local font stylesheet ({len(pages)} checked)",
    not missing_local,
)

if google_refs:
    print("Google Fonts references found in:")
    for path in google_refs[:20]:
        print(f"  - {path}")

if missing_local:
    print("Missing local font stylesheet in:")
    for path in missing_local[:20]:
        print(f"  - {path}")

failed = [label for label, ok in checks if not ok]
print(f"{len(checks)-len(failed)}/{len(checks)} generated-font checks passed")
if failed:
    sys.exit(1)
