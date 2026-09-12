from pathlib import Path
import json,sys,re

r=Path(__file__).resolve().parents[1]
checks=[]
def c(name,ok):
    print(("PASS" if ok else "FAIL"),name)
    checks.append(bool(ok))

cat=json.loads((r/"data/catalog.json").read_text(encoding="utf-8"))
pizzas=[p for p in cat["products"] if p.get("type")=="pizza"]
admin=(r/"admin/index.html").read_text(encoding="utf-8")
js=(r/"js/admin.js").read_text(encoding="utf-8")
core=(r/"js/admin-core.js").read_text(encoding="utf-8")
pkg=json.loads((r/'package.json').read_text(encoding='utf-8'))
version=str(pkg.get('version',''))

c("current version semantic", bool(re.fullmatch(r'\d+\.\d+\.\d+',version)))
c("variant studio html", 'variant-editor-list' in admin and 'Tamanhos e preços' in admin)
c("native fieldset", '<fieldset id="variant-studio"' in admin and '<legend>Tamanhos e preços</legend>' in admin)
c("admin renders variants", 'renderVariantStudio' in js)
c("admin applies variants", 'applyVariantStudio' in js)
c("at least one size guard", 'Mantenha ao menos um tamanho disponível' in js)
c("core validates variants", 'availableCount' in core and 'Variante duplicada' in core)
c("23 pizzas variant contract", len(pizzas)==23 and all(len(p.get('variants',[]))==3 for p in pizzas))
c("docs", (r/'docs/ADMIN-VARIANT-PRICING-STUDIO-4.1.7.md').exists())
print(f"{sum(checks)}/{len(checks)} admin variant checks passed")
sys.exit(0 if all(checks) else 1)
