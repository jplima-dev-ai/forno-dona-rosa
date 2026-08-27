#!/usr/bin/env python3
"""Exercise brand generation and reusable-template invariants without changing the active brand."""
from __future__ import annotations
import json, shutil, subprocess, sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
slug="quality-coffee"
target=ROOT/"brands"/slug
checks=[]
def check(name,ok): checks.append((name,bool(ok)))
try:
    if target.exists(): shutil.rmtree(target)
    subprocess.run([sys.executable,"tools/create-brand.py","--name","Quality Coffee House","--slug",slug,"--preset","coffee-shop","--whatsapp","+55 27 99999-0000","--city","Serra","--state","ES","--assistant","Luna"],cwd=ROOT,check=True,capture_output=True,text=True,encoding="utf-8",errors="replace")
    brand=json.loads((target/"brand.json").read_text(encoding="utf-8"))
    preset=json.loads((ROOT/"presets/coffee-shop/preset.json").read_text(encoding="utf-8"))
    check("generated brand directory",target.is_dir())
    check("generated namespace",brand["brand"]["storageNamespace"]==slug)
    check("preset type",brand["brand"]["businessType"]=="coffee-shop")
    check("assistant override",brand["assistant"]["name"]=="Luna")
    check("half-and-half disabled",brand["features"]["halfAndHalf"] is False)
    check("preset contract",preset["defaultFeatures"]["halfAndHalf"] is False)
    subprocess.run([sys.executable,"tools/project-doctor.py","--brand",f"brands/{slug}"],cwd=ROOT,check=True,capture_output=True,text=True,encoding="utf-8",errors="replace")
    check("generated brand doctor",True)
finally:
    if target.exists(): shutil.rmtree(target)
failed=[name for name,ok in checks if not ok]
for name,ok in checks: print(f"{'PASS' if ok else 'FAIL'} {name}")
print(f"{len(checks)-len(failed)}/{len(checks)} template-factory checks passed")
if failed: raise SystemExit(1)
