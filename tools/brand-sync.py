#!/usr/bin/env python3
"""Synchronize brand source files with static/runtime assets for a GitHub Pages build."""
from __future__ import annotations
import base64, hashlib, json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BRAND_PATH = ROOT / "data/brand/brand.json"
CONTENT_PATH = ROOT / "data/brand/content.json"

def load(path):
    return json.loads(path.read_text(encoding="utf-8"))

def require(value, label):
    if value in (None, "", []):
        raise ValueError(f"Missing required brand value: {label}")
    return value

def js_object(name, payload, source):
    raw = json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
    return f'// Generated from {source} by tools/brand-sync.py. Do not edit manually.\n(() => {{\n  "use strict";\n  const deepFreeze = (value) => {{ if (!value || typeof value !== "object" || Object.isFrozen(value)) return value; Object.values(value).forEach(deepFreeze); return Object.freeze(value); }};\n  window.{name} = deepFreeze({raw});\n}})();\n'

def replace_once(text, pattern, repl, label):
    new, count = re.subn(pattern, repl, text, count=1, flags=re.S)
    if count != 1:
        raise ValueError(f"Could not synchronize {label}")
    return new

def main():
    brand = load(BRAND_PATH)
    content = load(CONTENT_PATH)
    b = brand["brand"]; c = brand["contacts"]; loc = brand["location"]; seo = brand["seo"]
    require(b.get("name"), "brand.name"); require(b.get("storageNamespace"), "brand.storageNamespace")
    require(c.get("whatsappNumber"), "contacts.whatsappNumber"); require(seo.get("siteUrl"), "seo.siteUrl")
    require(b.get("logo", {}).get("header"), "brand.logo.header")

    (ROOT / "data/brand/brand-config.js").write_text(js_object("BRAND_CONFIG", brand, "data/brand/brand.json"), encoding="utf-8")
    (ROOT / "data/brand/content-config.js").write_text(js_object("BRAND_CONTENT", content, "data/brand/content.json"), encoding="utf-8")

    html_path = ROOT / "index.html"
    html = html_path.read_text(encoding="utf-8")
    html = replace_once(html, r'<meta content="[^"]*" name="application-name"/>', f'<meta content="{b["legalDisplayName"]}" name="application-name"/>', "application-name")
    html = replace_once(html, r'<title>.*?</title>', f'<title>{seo["title"]}</title>', "title")
    html = replace_once(html, r'<meta content="[^"]*" name="description"/>', f'<meta content="{seo["description"]}" name="description"/>', "description")
    html = replace_once(html, r'<link href="[^"]*" rel="canonical"/>', f'<link href="{seo["siteUrl"]}" rel="canonical"/>', "canonical")
    html = replace_once(html, r'<meta content="[^"]*" property="og:title"/>', f'<meta content="{seo["ogTitle"]}" property="og:title"/>', "og:title")
    html = replace_once(html, r'<meta content="[^"]*" property="og:description"/>', f'<meta content="{seo["ogDescription"]}" property="og:description"/>', "og:description")
    html = replace_once(html, r'<meta content="[^"]*" property="og:url"/>', f'<meta content="{seo["siteUrl"]}" property="og:url"/>', "og:url")
    og_img = seo["ogImage"] if seo["ogImage"].startswith("http") else seo["siteUrl"].rstrip("/") + "/" + seo["ogImage"].lstrip("/")
    html = replace_once(html, r'<meta content="[^"]*" property="og:image"/>', f'<meta content="{og_img}" property="og:image"/>', "og:image")
    schema = {
        "@context":"https://schema.org", "@type":seo.get("schemaType","LocalBusiness"), "name":b["legalDisplayName"],
        "servesCuisine":seo.get("servesCuisine",""), "telephone":"+" + c["whatsappNumber"], "email":c.get("email",""), "url":seo["siteUrl"],
        "sameAs":[f'https://www.instagram.com/{c["instagram"]}/'] if c.get("instagram") else [],
        "address":{"@type":"PostalAddress","streetAddress":loc["streetAddress"],"addressLocality":loc["city"],"addressRegion":loc["state"],"postalCode":loc["postalCode"],"addressCountry":loc.get("country","BR")}
    }
    html = replace_once(html, r'<script type="application/ld\+json">.*?</script>', '<script type="application/ld+json">'+json.dumps(schema,ensure_ascii=False,separators=(",",":"))+'</script>', "JSON-LD")
    inline = re.search(r'<script type="application/ld\+json">(.*?)</script>', html, re.S)
    if not inline: raise ValueError("Could not locate JSON-LD after synchronization")
    digest = base64.b64encode(hashlib.sha256(inline.group(1).encode()).digest()).decode()
    html = replace_once(html, r"script-src 'self' 'sha256-[^']+'", f"script-src 'self' 'sha256-{digest}'", "CSP JSON-LD hash")
    html = replace_once(html, r'<a aria-label="[^"]* — início" class="brand" href="#topo">', f'<a aria-label="{b["legalDisplayName"]} — início" class="brand" href="#topo">', "brand aria-label")
    logo_match = re.search(r'<img\b(?=[^>]*\bdata-brand-logo(?:="")?)[^>]*>', html, re.S)
    if not logo_match:
        raise ValueError("Could not synchronize header logo")
    logo_tag = logo_match.group(0)
    if not re.search(r'\bsrc="[^"]*"', logo_tag):
        raise ValueError("Brand logo is missing a src attribute")
    synced_logo_tag = re.sub(r'\bsrc="[^"]*"', f'src="{b["logo"]["header"]}"', logo_tag, count=1)
    html = html[:logo_match.start()] + synced_logo_tag + html[logo_match.end():]
    html_path.write_text(html, encoding="utf-8")

    manifest = {"name":b["legalDisplayName"],"short_name":b["shortName"],"description":seo["description"],"start_url":"./","display":"standalone","background_color":"#17100c","theme_color":"#17100c","lang":b.get("locale","pt-BR"),"icons":[{"src":"assets/icons/icon-192.png","sizes":"192x192","type":"image/png"},{"src":"assets/icons/icon-512.png","sizes":"512x512","type":"image/png"}]}
    (ROOT/"manifest.webmanifest").write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    base = seo["siteUrl"].rstrip("/") + "/"
    (ROOT/"robots.txt").write_text(f"User-agent: *\nAllow: /\n\nSitemap: {base}sitemap.xml\n", encoding="utf-8")
    sitemap = f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>{base}</loc><lastmod>2026-08-27</lastmod><changefreq>monthly</changefreq><priority>1.0</priority></url></urlset>\n'
    (ROOT/"sitemap.xml").write_text(sitemap, encoding="utf-8")
    print(f'Brand sync OK: {b["name"]}')

if __name__ == "__main__":
    try: main()
    except Exception as exc:
        print(f"BRAND SYNC FAILED: {exc}", file=sys.stderr); raise SystemExit(1)
