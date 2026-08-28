#!/usr/bin/env python3
"""Production-readiness doctor for brand, catalog, assets, runtime, PWA and docs."""
from __future__ import annotations
import json,re,subprocess,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
VERSION="2.9.9"
checks=[]
def check(name, ok, detail=""):
    checks.append((name,bool(ok),detail))
def load(path): return json.loads(path.read_text(encoding="utf-8"))

def validate_brand(base:Path):
    b=load(base/"brand.json")
    required=[("brand.name",b.get("brand",{}).get("name")),("brand.storageNamespace",b.get("brand",{}).get("storageNamespace")),("contacts.whatsappNumber",b.get("contacts",{}).get("whatsappNumber")),("seo.siteUrl",b.get("seo",{}).get("siteUrl"))]
    for name,value in required: check(name,bool(value),str(value or "missing"))
    ns=b.get("brand",{}).get("storageNamespace",""); check("storage namespace format", bool(re.fullmatch(r"[a-z0-9][a-z0-9-]{1,31}",ns)), ns)
    wa=b.get("contacts",{}).get("whatsappNumber",""); check("WhatsApp digits",bool(re.fullmatch(r"[1-9][0-9]{9,14}",wa)),wa)
    return b

def parse_catalog():
    text=(ROOT/"data/menu.js").read_text(encoding="utf-8")
    ids=re.findall(r'\bid:\s*"([^"]+)"',text)
    imgs=re.findall(r'\bimage:\s*"([^"]+)"',text)
    prices=[float(x) for x in re.findall(r'\bbasePrice:\s*([0-9]+(?:\.[0-9]+)?)',text)]
    check("catalog IDs unique", len(ids)>0 and len(ids)==len(set(ids)), f"{len(ids)} ids")
    check("catalog prices positive", bool(prices) and all(x>0 for x in prices), f"{len(prices)} prices")
    missing=[img for img in imgs if not (ROOT/img).exists()]
    check("catalog image files", not missing, ", ".join(missing[:3]))

def main():
    import argparse
    p=argparse.ArgumentParser(); p.add_argument("--brand",default="data/brand"); a=p.parse_args()
    base=(ROOT/a.brand).resolve(); check("brand directory",base.is_dir(),str(base))
    if base.is_dir(): validate_brand(base)
    for f in ("schemas/brand.schema.json","schemas/content.schema.json","schemas/catalog.schema.json","presets/pizzeria/preset.json","presets/coffee-shop/preset.json"):
        check(f,(ROOT/f).exists())
    parse_catalog()
    meta=(ROOT/"js/app-meta.js").read_text(encoding="utf-8"); sw=(ROOT/"service-worker.js").read_text(encoding="utf-8")
    check("version metadata",f'version: "{VERSION}"' in meta)
    check("service worker version",f'const VERSION = "{VERSION}"' in sw)
    check("viewport",'width=device-width, initial-scale=1' in (ROOT/"index.html").read_text(encoding="utf-8"))
    check("container query contract",'container-type:inline-size' in (ROOT/"css/styles.css").read_text(encoding="utf-8").replace(' ',''))
    check("quality workflow",(ROOT/".github/workflows/quality.yml").exists())
    check("package quality command",'"quality"' in (ROOT/"package.json").read_text(encoding="utf-8") if (ROOT/"package.json").exists() else False)
    check("current changelog",all(f"## {v} " in (ROOT/"CHANGELOG.md").read_text(encoding="utf-8") for v in [f"2.6.{i}" for i in range(10)]))
    failed=[x for x in checks if not x[1]]
    print(f"Forno template project doctor — v{VERSION}")
    for name,ok,detail in checks: print(f"{'PASS' if ok else 'FAIL':4}  {name}" + (f" — {detail}" if detail else ""))
    print(f"\n{len(checks)-len(failed)}/{len(checks)} checks passed")
    if failed: raise SystemExit(1)
if __name__=="__main__": main()
