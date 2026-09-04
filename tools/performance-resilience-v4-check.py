#!/usr/bin/env python3
from pathlib import Path
import json, sys, re
root = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path.cwd()
errors = []
p = root / "data/performance-budgets-v4.json"
try:
    data = json.loads(p.read_text(encoding="utf-8"))
except Exception as e:
    raise SystemExit(f"FAIL: budgets inválidos: {e}")
if data.get("version") != "4.0.8": errors.append("budget version != 4.0.8")
for key in ["javascriptTotalKb","cssTotalKb","singleImageKb","heroImageKb","initialRequests"]:
    if not isinstance(data.get("budgets", {}).get(key), (int,float)): errors.append(f"budget ausente: {key}")
js = root / "js/resilience-v4.js"
if not js.exists(): errors.append("resilience-v4.js ausente")
else:
    t = js.read_text(encoding="utf-8")
    for token in ["quarantineCorruptStorage","reconcileBagAgainstCatalog","installImageFallbacks","service-worker-version-mismatch","withTimeout","healthSnapshot"]:
        if token not in t: errors.append(f"runtime sem {token}")
    if "localStorage.clear" in t: errors.append("runtime usa localStorage.clear")
css = root / "css/resilience-v4.css"
if not css.exists(): errors.append("resilience css ausente")
sw = root / "service-worker.js"
if sw.exists():
    st = sw.read_text(encoding="utf-8")
    m=re.search(r'const VERSION = ["\'](\d+)\.(\d+)\.(\d+)["\'];', st)
    if not m or tuple(map(int,m.groups())) < (4,0,8):
        errors.append("service-worker está abaixo de 4.0.8")
    if "FORNO_GET_VERSION" not in st: errors.append("service-worker sem handshake")
pkg = root / "package.json"
if pkg.exists():
    try:
        pdata = json.loads(pkg.read_text(encoding="utf-8"))
        if tuple(map(int,pdata.get('version','0.0.0').split('.'))) < (4,0,8): errors.append('package version < 4.0.8')
    except Exception:
        errors.append("package.json inválido")
if errors:
    print("PERFORMANCE & RESILIENCE V4: FAIL")
    for e in errors: print("-", e)
    raise SystemExit(1)
print("PERFORMANCE & RESILIENCE V4: PASS (structural contract)")
print("Nota: budgets são metas; CWV reais exigem medição em navegador/ambiente publicado.")
