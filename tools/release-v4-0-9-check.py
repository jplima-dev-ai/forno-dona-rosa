#!/usr/bin/env python3
from pathlib import Path
import json, re, sys, subprocess

root = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path.cwd()
errors = []
warnings = []

def need(rel):
    p = root / rel
    if not p.exists():
        errors.append(f"arquivo ausente: {rel}")
    return p

pkgp = need("package.json")
manifestp = need("data/release-manifest-v4.json")
need("css/premium-release-v4.css")
need("js/premium-release-v4.js")
need("docs/RELEASE-4.0.9.md")
need("docs/releases/evidence/v4.0.9/summary.md")

if pkgp.exists():
    try:
        pkg = json.loads(pkgp.read_text(encoding="utf-8"))
        if pkg.get("version") != "4.0.9":
            errors.append(f"package version != 4.0.9 ({pkg.get('version')!r})")
        scripts = pkg.get("scripts", {})
        if "release-v4:gate" not in scripts:
            errors.append("script release-v4:gate ausente")
    except Exception as e:
        errors.append(f"package.json inválido: {e}")

if manifestp.exists():
    try:
        manifest = json.loads(manifestp.read_text(encoding="utf-8"))
        if manifest.get("version") != "4.0.9":
            errors.append("release manifest version != 4.0.9")
        if len(manifest.get("skills", [])) != 5:
            errors.append("release manifest deve registrar cinco habilidades")
        if manifest.get("releasePolicy", {}).get("manualATRequiredForClaim") is not True:
            errors.append("política de tecnologia assistiva manual ausente")
    except Exception as e:
        errors.append(f"release manifest inválido: {e}")

# Required cumulative artifacts
required_cumulative = [
    "data/experience-v4.json",
    "css/experience-v4.css",
    "js/experience-router-v4.js",
    "css/visual-desire-v4.css",
    "js/visual-media-v4.js",
    "js/smart-menu-v4.js",
    "js/rosa-context-v4.js",
    "js/adaptive-commerce-v4.js",
    "js/conversion-intelligence-v4.js",
    "js/admin-health-v4.js",
    "data/accessibility-contracts-v4.json",
    "js/resilience-v4.js",
    "data/performance-budgets-v4.json"
]
for rel in required_cumulative:
    need(rel)

# HTML integration checks on applied project
index = root / "index.html"
if index.exists():
    text = index.read_text(encoding="utf-8")
    for token in ["premium-release-v4.css", "premium-release-v4.js"]:
        if token not in text:
            errors.append(f"index.html sem integração: {token}")
    if "4.0.9" not in text:
        warnings.append("index.html não contém string de versão 4.0.9")

sw = root / "service-worker.js"
if sw.exists():
    st = sw.read_text(encoding="utf-8")
    if 'const VERSION = "4.0.9"' not in st and "const VERSION = '4.0.9'" not in st:
        errors.append("service-worker version != 4.0.9")
    if "FORNO_GET_VERSION" not in st:
        errors.append("service-worker sem handshake")

# Catalog checks
catalog = root / "data/catalog.json"
if catalog.exists():
    try:
        data = json.loads(catalog.read_text(encoding="utf-8"))
        products = data.get("products", data if isinstance(data, list) else [])
        names = [str(p.get("name","")).lower() for p in products if isinstance(p, dict)]
        if not any("nordestina" in n for n in names):
            errors.append("Nordestina da Dona Rosa ausente do catálogo")
        planned = [
            p for p in products if isinstance(p, dict)
            and "nordestina" in str(p.get("name","")).lower()
            and p.get("media", {}).get("plannedSource")
        ]
        if planned:
            warnings.append("Nordestina ainda registra plannedSource: verificar fotografia definitiva antes de publicar")
    except Exception as e:
        errors.append(f"catalog.json inválido: {e}")

# Never claim AT/CWV as measured in manifest
if manifestp.exists():
    raw = manifestp.read_text(encoding="utf-8")
    if '"nvda": "PASS"' in raw:
        errors.append("NVDA não pode estar PASS sem execução real")
    if '"cwvTargetsAreMeasured": true' in raw:
        errors.append("CWV não pode estar marcado como medido")

if errors:
    print("FORNO DONA ROSA 4.0.9 RELEASE GATE: FAIL")
    for e in errors:
        print("-", e)
    if warnings:
        print("Warnings:")
        for w in warnings:
            print("-", w)
    raise SystemExit(1)

print("FORNO DONA ROSA 4.0.9 RELEASE GATE: PASS (structural/local contract)")
for w in warnings:
    print("WARN:", w)
print("Nota: quality/browser/NVDA/CWV dependem de execução no projeto/ambiente real.")
