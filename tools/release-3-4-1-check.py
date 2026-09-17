#!/usr/bin/env python3
from pathlib import Path
import json, subprocess, sys
ROOT = Path(__file__).resolve().parents[1]
fail = []
def text(rel): return (ROOT / rel).read_text(encoding="utf-8")
def check(condition, message):
    if not condition: fail.append(message)
pkg = json.loads(text("package.json")); manifest = json.loads(text("data/release-manifest-v4.json")); version = pkg.get("version")
check(version == "3.4.1", "package version must be 3.4.1")
check(manifest.get("version") == "3.4.1", "release manifest version must be 3.4.1")
check(manifest.get("name") == "3.4.1 Maintenance Release", "release manifest name mismatch")
check('version: "3.4.1"' in text("js/app-meta.js"), "app meta must be 3.4.1")
check('const VERSION = "3.4.1"' in text("service-worker.js"), "service worker must be 3.4.1")
check('3.4.1' in text("index.html"), "root HTML must identify 3.4.1")
check('Admin Studio v3.4.1' in text("admin/index.html"), "Admin Studio must identify 3.4.1")
check((ROOT / "docs/RELEASE-3.4.1.md").exists(), "3.4.1 release notes missing")
check((ROOT / "docs/releases/evidence/v3.4.1/summary.md").exists(), "3.4.1 evidence summary missing")
check("release:3.4.1" in manifest.get("qualityGates", []), "manifest does not wire release:3.4.1")
status = manifest.get("status", {})
check(status.get("releaseApproval") in {"PENDING_3_4_1_FINAL_EVIDENCE","PENDING_PUBLISHED_CWV_EVIDENCE","APPROVED_WITH_DECLARED_LIMITATIONS"}, "release approval status is not an honest 3.4.1 state")
check(status.get("nvda") == "MANUAL_PASS", "NVDA 3.4.1 manual evidence must be MANUAL_PASS")
check(status.get("talkback") == "MANUAL_PASS", "TalkBack 3.4.1 manual evidence must be MANUAL_PASS")
check(status.get("otherScreenReaders") == "NOT_TESTED_NO_ACCESS", "untested screen readers must remain explicit")
if fail:
    print("FORNO DONA ROSA 3.4.1 RELEASE EVIDENCE GATE: FAIL")
    for item in fail: print("-", item)
    raise SystemExit(1)
compat = subprocess.run([sys.executable, str(ROOT / "tools/release-v4-1-9-check.py")], cwd=ROOT)
if compat.returncode: raise SystemExit(compat.returncode)
print("FORNO DONA ROSA 3.4.1 RELEASE EVIDENCE GATE: PASS")
print("- version, runtime metadata, generated HTML and release documentation are aligned")
print("- NVDA and TalkBack manual tests are recorded as MANUAL_PASS for 3.4.1; 3.4.0 evidence remains preserved historically")
print("- published Core Web Vitals and any renewed automated browser matrix remain explicit evidence items")
