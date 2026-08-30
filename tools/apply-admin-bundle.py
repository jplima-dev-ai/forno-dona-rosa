#!/usr/bin/env python3
"""Apply a bundle exported by /admin/ to the canonical project data safely."""
from __future__ import annotations
import json, shutil, subprocess, sys, tempfile, re
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MAX_BUNDLE_BYTES = 2_000_000
MAX_PRODUCTS = 250
MAX_TEXT = 1000

TARGETS = {
    "brand": ROOT / "data/brand/brand.json",
    "content": ROOT / "data/brand/content.json",
    "catalog": ROOT / "data/catalog.json",
    "reviews": ROOT / "data/reviews.json",
    "articles": ROOT / "data/articles.json",
    "newsletter": ROOT / "data/newsletter.json",
}

def fail(message: str) -> None:
    print(f"ADMIN BUNDLE APPLY FAILED: {message}", file=sys.stderr)
    raise SystemExit(1)

def load_bundle(path: Path) -> dict:
    if path.suffix.lower() != ".json": fail("bundle must use .json extension")
    try:
        if path.stat().st_size > MAX_BUNDLE_BYTES: fail("bundle exceeds 2 MB limit")
        raw = json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        fail(f"could not read JSON: {exc}")
    if raw.get("format") != "forno-admin-bundle" or raw.get("formatVersion") != 1:
        fail("unsupported bundle format")
    payload = raw.get("payload")
    required=("brand","content","catalog")
    if not isinstance(payload, dict) or not all(key in payload for key in required):
        fail("bundle payload must contain brand, content and catalog")
    payload.setdefault("reviews", {"schemaVersion": 1, "reviews": []})
    payload.setdefault("articles", json.loads((ROOT / "data/articles.json").read_text(encoding="utf-8")))
    payload.setdefault("newsletter", {"schemaVersion": 1, "enabled": False, "provider": "none", "endpoint": None})
    return payload

def validate_payload(payload: dict) -> None:
    brand = payload["brand"]; content = payload["content"]; catalog = payload["catalog"]; reviews = payload.get("reviews", {"schemaVersion": 1, "reviews": []}); articles = payload.get("articles", {"schemaVersion":1,"categories":[],"articles":[]}); newsletter = payload.get("newsletter", {"schemaVersion":1,"enabled":False,"provider":"none"})
    errors=[]
    b=brand.get("brand",{}); c=brand.get("contacts",{}); loc=brand.get("location",{}); commerce=brand.get("commerce",{})
    if brand.get("schemaVersion") != 1: errors.append("brand.schemaVersion must be 1")
    if not str(b.get("name","")).strip(): errors.append("brand.name is required")
    ns=str(b.get("storageNamespace","")).strip()
    if not re.fullmatch(r"[a-z0-9][a-z0-9-]{1,31}", ns): errors.append("brand.storageNamespace is invalid")
    if not re.fullmatch(r"55\d{10,11}", str(c.get("whatsappNumber", ""))): errors.append("contacts.whatsappNumber is invalid")
    if not str(loc.get("city","")).strip() or not str(loc.get("state","")).strip(): errors.append("location city/state are required")
    if not isinstance(content.get("hero"), dict): errors.append("content.hero is required")
    products=catalog.get("products")
    if not isinstance(products,list) or not products: errors.append("catalog.products is required")
    if isinstance(products,list) and len(products) > MAX_PRODUCTS: errors.append(f"catalog exceeds {MAX_PRODUCTS} products")
    ids=set()
    if isinstance(products,list):
        for product in products:
            pid=str(product.get("id", "")); price=product.get("basePrice")
            if not re.fullmatch(r"[a-z0-9][a-z0-9-]{1,63}",pid): errors.append(f"invalid product id: {pid}")
            if pid in ids: errors.append(f"duplicate product id: {pid}")
            ids.add(pid)
            name=str(product.get("name","")).strip(); description=str(product.get("description", ""))
            if not name: errors.append(f"product {pid} missing name")
            if len(name) > 120 or len(description) > 360: errors.append(f"product {pid} text exceeds limits")
            if isinstance(price, bool) or not isinstance(price,(int,float)) or price <= 0 or price > 100000: errors.append(f"product {pid} invalid price")
    review_items=reviews.get("reviews",[]) if isinstance(reviews,dict) else []
    if not isinstance(review_items,list) or len(review_items)>100: errors.append("reviews must be a list with at most 100 entries")
    else:
        for review in review_items:
            if not isinstance(review,dict): errors.append("invalid review entry"); continue
            author=str(review.get("author","")).strip(); quote=str(review.get("quote","")).strip(); rating=review.get("rating")
            if len(author)<2 or len(author)>80: errors.append("review author is invalid")
            if len(quote)<8 or len(quote)>420: errors.append(f"review from {author or 'unknown'} has invalid quote")
            if isinstance(rating,bool) or not isinstance(rating,(int,float)) or not 1<=rating<=5: errors.append(f"review from {author or 'unknown'} has invalid rating")
            if review.get("active",True) and review.get("authorized") is not True: errors.append(f"active review from {author or 'unknown'} lacks usage authorization")
    article_items=articles.get("articles",[]) if isinstance(articles,dict) else []
    categories={str(c.get("id","")) for c in articles.get("categories",[]) if isinstance(c,dict)} if isinstance(articles,dict) else set()
    if not isinstance(article_items,list) or len(article_items)>200: errors.append("articles must be a list with at most 200 entries")
    else:
        slugs=set()
        for article in article_items:
            if not isinstance(article,dict): errors.append("invalid article entry"); continue
            slug=str(article.get("slug",article.get("id","")))
            if not re.fullmatch(r"[a-z0-9][a-z0-9-]{1,79}",slug): errors.append(f"invalid article slug: {slug}")
            if slug in slugs: errors.append(f"duplicate article slug: {slug}")
            slugs.add(slug)
            if len(str(article.get("title","" )).strip())<8: errors.append(f"article {slug} missing title")
            if len(str(article.get("summary","" )).strip())<24: errors.append(f"article {slug} summary is too short")
            if str(article.get("category","")) not in categories: errors.append(f"article {slug} has unknown category")
            sections=article.get("sections",[])
            if not isinstance(sections,list) or not 1<=len(sections)<=8: errors.append(f"article {slug} must have 1 to 8 sections")
    provider=str(newsletter.get("provider","none")) if isinstance(newsletter,dict) else "none"
    if provider not in {"none","external-form","future-api"}: errors.append("newsletter provider is invalid")
    if isinstance(newsletter,dict) and newsletter.get("enabled") is True:
        endpoint=str(newsletter.get("endpoint") or "")
        if provider=="none" or not re.fullmatch(r"https://[^\s]+",endpoint): errors.append("enabled newsletter requires HTTPS provider endpoint")
    credits=brand.get("credits", {})
    credit_url=credits.get("url")
    if credit_url and not re.fullmatch(r"https://[^\s]+", str(credit_url)): errors.append("credits.url must use HTTPS")
    unavailable=commerce.get("availability",{}).get("unavailableProductIds",[])
    for pid in unavailable if isinstance(unavailable,list) else []:
        if pid not in ids: errors.append(f"unknown unavailable product: {pid}")
    if errors: fail("; ".join(errors))

def write_atomic(path: Path, payload: dict) -> None:
    data=json.dumps(payload,ensure_ascii=False,indent=2)+"\n"
    with tempfile.NamedTemporaryFile("w",encoding="utf-8",delete=False,dir=path.parent,suffix=".tmp") as handle:
        handle.write(data); temp=Path(handle.name)
    temp.replace(path)

def run(label: str, *command: str) -> None:
    result=subprocess.run(command,cwd=ROOT,capture_output=True,text=True,encoding="utf-8",errors="replace")
    if result.returncode != 0:
        detail=(result.stdout+"\n"+result.stderr).strip()
        fail(f"{label} failed\n{detail}")
    print(f"PASS {label}")

def main() -> None:
    if len(sys.argv) != 2: fail("usage: python tools/apply-admin-bundle.py <bundle.json>")
    source=Path(sys.argv[1]).expanduser().resolve()
    if not source.exists(): fail(f"bundle not found: {source}")
    payload=load_bundle(source)
    loc=payload["brand"].get("location",{})
    delivery=payload["brand"].setdefault("delivery",{})
    commerce=payload["brand"].setdefault("commerce",{})
    loc["fullAddress"] = ", ".join(part for part in [loc.get("streetAddress", ""), f'{loc.get("city", "")} - {loc.get("state", "")}'.strip(" -"), f'CEP {loc.get("postalCode")}' if loc.get("postalCode") else ""] if part)
    delivery.update({"city":loc.get("city",""),"state":loc.get("state",""),"country":loc.get("country","BR"),"serviceAreaLabel":f'{loc.get("city","")} — {loc.get("state","")}'})
    if isinstance(commerce.get("pickup"),dict): commerce["pickup"]["addressLabel"] = loc["fullAddress"]
    validate_payload(payload)
    stamp=datetime.now().strftime("%Y%m%d-%H%M%S-%f")
    backup=ROOT/"backups"/f"admin-{stamp}"; backup.mkdir(parents=True,exist_ok=False)
    for key,path in TARGETS.items(): shutil.copy2(path, backup/path.name)
    try:
        for key,path in TARGETS.items(): write_atomic(path,payload[key])
        run("config check",sys.executable,"tools/config-check.py")
        run("brand sync",sys.executable,"tools/brand-sync.py")
        run("site build",sys.executable,"tools/build-site.py")
    except BaseException:
        for key,path in TARGETS.items(): shutil.copy2(backup/path.name,path)
        print(f"RESTORED backup from {backup}",file=sys.stderr)
        raise
    print("ADMIN BUNDLE APPLIED")
    print(f"Backup: {backup.relative_to(ROOT)}")
    print("Next: npm.cmd run quality")

if __name__ == "__main__": main()
