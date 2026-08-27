#!/usr/bin/env python3
"""Apply a generated brand package to the canonical static site configuration."""
from __future__ import annotations
import shutil, subprocess, sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]

def main():
    if len(sys.argv)!=2: raise ValueError("Usage: python tools/apply-brand.py <brand-slug>")
    slug=sys.argv[1]
    source=ROOT/"brands"/slug
    if not source.is_dir(): raise ValueError(f"Brand not found: brands/{slug}")
    for filename in ("brand.json","content.json"):
        if not (source/filename).exists(): raise ValueError(f"Missing brands/{slug}/{filename}")
        shutil.copy2(source/filename, ROOT/"data/brand"/filename)
    if (source/"brand-theme.css").exists(): shutil.copy2(source/"brand-theme.css", ROOT/"css/brand-theme.css")
    subprocess.run([sys.executable, str(ROOT/"tools/brand-sync.py")], check=True, cwd=ROOT)
    print(f"Brand applied: {slug}")
if __name__=="__main__":
    try: main()
    except Exception as exc:
        print(f"APPLY BRAND FAILED: {exc}", file=sys.stderr); raise SystemExit(1)
