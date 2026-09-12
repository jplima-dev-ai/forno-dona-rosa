#!/usr/bin/env python3
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
ORDER=['css/styles.css', 'css/experience-v4.css', 'css/brand-theme.css', 'css/focal-position.css', 'css/adaptive-commerce-v4.css', 'css/visual-desire-v4.css', 'css/resilience-v4.css', 'css/premium-release-v4.css', 'css/smart-pairing-v4-1-4.css', 'css/intelligent-bag-v4-1-5.css', 'css/accessibility-fortress-v4-1-8.css']
parts=['/* Forno Dona Rosa 3.4.1 — home critical bundle. Generated; do not edit directly. */']
for rel in ORDER:
    parts.append(f"\n/* source: {rel} */\n" + (ROOT/rel).read_text(encoding="utf-8") + "\n")
(ROOT/"css/home-bundle.css").write_text("\n".join(parts),encoding="utf-8")
print(f"HOME CSS BUNDLE PASSED ({len(ORDER)} sources)")
