#!/usr/bin/env python3
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
ROSA = ROOT / "js" / "rosa.js"

text = ROSA.read_text(encoding="utf-8")
checks = []

def check(label, condition):
    ok = bool(condition)
    checks.append((label, ok))
    print(("PASS  " if ok else "FAIL  ") + label)

check("rosa.js exists", ROSA.exists())

open_match = re.search(
    r"function openRosa\([^)]*\)\s*\{(?P<body>.*?)\n\s*\}\n\n\s*function closeRosa",
    text,
    re.S,
)
check("openRosa function found", open_match is not None)

if open_match:
    body = open_match.group("body")
    check("openRosa renders history on demand", "renderHistory();" in body)
    check("openRosa renders quick actions on demand", "renderQuickActions();" in body)
    check("openRosa updates input count on demand", "updateInputCount();" in body)

startup_tail = re.compile(
    r"\n[ \t]*renderHistory\(\);"
    r"\n[ \t]*renderQuickActions\(\);"
    r"\n[ \t]*updateInputCount\(\);"
    r"\n[ \t]*\}"
    r"\n\n[ \t]*if[ \t]*\(document\.readyState[ \t]*===[ \t]*[\"']loading[\"']\)"
)

check(
    "init has no unconditional hidden Rosa rendering at startup",
    startup_tail.search(text) is None,
)
check("history rendering remains available", "renderHistory();" in text)
check("quick actions rendering remains available", "renderQuickActions();" in text)
check("input count rendering remains available", "updateInputCount();" in text)

failed = [label for label, ok in checks if not ok]
print(f"{len(checks)-len(failed)}/{len(checks)} Rosa startup checks passed")
if failed:
    sys.exit(1)
