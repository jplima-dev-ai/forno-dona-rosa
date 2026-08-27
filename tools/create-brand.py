#!/usr/bin/env python3
"""Create a reusable client brand package from a supported preset."""
from __future__ import annotations
import argparse, json, re, shutil, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PRESETS = ROOT / "presets"
BRANDS = ROOT / "brands"
SOURCE_BRAND = ROOT / "data/brand/brand.json"
SOURCE_CONTENT = ROOT / "data/brand/content.json"
SOURCE_THEME = ROOT / "css/brand-theme.css"

def slugify(value: str) -> str:
    value = value.strip().lower()
    value = re.sub(r"[^a-z0-9]+", "-", value).strip("-")
    if not re.fullmatch(r"[a-z0-9][a-z0-9-]{1,31}", value or ""):
        raise ValueError("Slug must be 2-32 lowercase ASCII characters using letters, numbers or hyphens.")
    return value

def read_json(path: Path): return json.loads(path.read_text(encoding="utf-8"))
def write_json(path: Path, payload): path.write_text(json.dumps(payload, ensure_ascii=False, indent=2)+"\n", encoding="utf-8")

def main():
    parser = argparse.ArgumentParser(description="Create a new client configuration package.")
    parser.add_argument("--name")
    parser.add_argument("--slug")
    parser.add_argument("--preset", default="pizzeria")
    parser.add_argument("--whatsapp")
    parser.add_argument("--city")
    parser.add_argument("--state")
    parser.add_argument("--assistant")
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()

    name = args.name or input("Business name: ").strip()
    slug = slugify(args.slug or input("Brand slug: ").strip() or name)
    preset_path = PRESETS / args.preset / "preset.json"
    if not preset_path.exists(): raise ValueError(f"Unknown preset: {args.preset}")
    preset = read_json(preset_path)
    target = BRANDS / slug
    if target.exists() and not args.force: raise ValueError(f"Brand already exists: {target.relative_to(ROOT)}")
    if target.exists(): shutil.rmtree(target)
    (target / "assets").mkdir(parents=True)

    brand = read_json(SOURCE_BRAND)
    content = read_json(SOURCE_CONTENT)
    brand["brand"]["name"] = name
    brand["brand"]["legalDisplayName"] = name
    brand["brand"]["shortName"] = name[:40]
    brand["brand"]["businessType"] = preset["businessType"]
    brand["brand"]["storageNamespace"] = slug
    brand["brand"]["logo"] = {
        "full": f"assets/images/brand/{slug}-logo.png",
        "header": f"assets/images/brand/{slug}-logo.webp",
        "alt": name
    }
    if args.whatsapp:
        digits = re.sub(r"\D", "", args.whatsapp)
        brand["contacts"]["whatsappNumber"] = digits
        brand["contacts"]["whatsappDisplay"] = args.whatsapp
    if args.city: brand["location"]["city"] = brand["delivery"]["city"] = args.city
    if args.state: brand["location"]["state"] = brand["delivery"]["state"] = args.state.upper()
    assistant = args.assistant or brand["assistant"]["name"]
    brand["assistant"]["name"] = assistant
    brand["assistant"]["role"] = f"Anfitriã digital da {name}"
    brand["features"].update(preset["defaultFeatures"])
    brand["seo"]["title"] = name
    brand["seo"]["ogTitle"] = name
    brand["seo"]["siteUrl"] = "https://example.com/"
    content["hero"]["kicker"] = name
    content["hero"]["assistantCta"] = f"Conversar com {assistant}"

    write_json(target / "brand.json", brand)
    write_json(target / "content.json", content)
    shutil.copy2(SOURCE_THEME, target / "brand-theme.css")
    (target / "assets/README.md").write_text(
        f"# Assets for {name}\n\nReplace the placeholder logo paths declared in `brand.json` before applying this brand.\n",
        encoding="utf-8")
    (target / "README.md").write_text(
        f"# {name}\n\nPreset: `{args.preset}`\n\nValidate with `python tools/project-doctor.py --brand brands/{slug}`.\nApply with `python tools/apply-brand.py {slug}` after adding the required logo assets.\n",
        encoding="utf-8")
    print(f"Brand package created: brands/{slug}")

if __name__ == "__main__":
    try: main()
    except Exception as exc:
        print(f"CREATE BRAND FAILED: {exc}", file=sys.stderr); raise SystemExit(1)
