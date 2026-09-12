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
if data.get("version") != "4.0.8":
    errors.append("budget contract version != 4.0.8")
for key in ["javascriptTotalKb","cssTotalKb","singleImageKb","heroImageKb","initialRequests"]:
    if not isinstance(data.get("budgets", {}).get(key), (int,float)):
        errors.append(f"budget ausente: {key}")

js = root / "js/resilience-v4.js"
if not js.exists():
    errors.append("resilience-v4.js ausente")
else:
    t = js.read_text(encoding="utf-8")
    for token in ["quarantineCorruptStorage","reconcileBagAgainstCatalog","installImageFallbacks","service-worker-version-mismatch","withTimeout","healthSnapshot"]:
        if token not in t:
            errors.append(f"runtime sem {token}")
    if "localStorage.clear" in t:
        errors.append("runtime usa localStorage.clear")

css = root / "css/resilience-v4.css"
if not css.exists():
    errors.append("resilience css ausente")

package_version = None
pkg = root / "package.json"
try:
    package_version = json.loads(pkg.read_text(encoding="utf-8")).get("version")
    if not re.fullmatch(r"\d+\.\d+\.\d+", str(package_version or "")):
        errors.append("package.json version inválida")
except Exception:
    errors.append("package.json inválido")

sw = root / "service-worker.js"
if not sw.exists():
    errors.append("service-worker ausente")
else:
    st = sw.read_text(encoding="utf-8")
    m = re.search(r'const VERSION = ["\'](\d+\.\d+\.\d+)["\'];', st)
    if not m:
        errors.append("service-worker sem versão semântica")
    elif package_version and m.group(1) != package_version:
        errors.append(f"service-worker version {m.group(1)} != package version {package_version}")
    if "FORNO_GET_VERSION" not in st:
        errors.append("service-worker sem handshake")

if errors:
    print("PERFORMANCE & RESILIENCE CAPABILITY GATE: FAIL")
    for e in errors:
        print("-", e)
    raise SystemExit(1)
print("PERFORMANCE & RESILIENCE CAPABILITY GATE: PASS")
print("Nota: budgets são metas; CWV reais exigem medição em navegador/ambiente publicado.")
