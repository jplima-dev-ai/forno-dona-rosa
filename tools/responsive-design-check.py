from pathlib import Path
import re, sys, json
ROOT=Path(__file__).resolve().parents[1]
css=(ROOT/'css/styles.css').read_text(encoding='utf-8')
html=(ROOT/'index.html').read_text(encoding='utf-8')
changelog=(ROOT/'CHANGELOG.md').read_text(encoding='utf-8')
meta=(ROOT/'js/app-meta.js').read_text(encoding='utf-8')
checks=[]
def check(name, cond): checks.append((name, bool(cond)))

VERSION=json.loads((ROOT/'package.json').read_text(encoding='utf-8'))['version']; check(f'current version {VERSION}', f'version: "{VERSION}"' in meta and (f'content="{VERSION}" name="x-project-version"' in html or f'name="x-project-version" content="{VERSION}"' in html))
for patch in range(10):
    check(f'changelog 2.9.{patch}', re.search(rf'^##\s+2\.9\.{patch}(?:\s|$)', changelog, re.M))
check('mobile edge token', '--mobile-edge:' in css)
check('touch target token', '--tap-target:3rem' in css)
check('short mobile header', '@media(max-width:48rem)' in css and '.site-header{min-height:4rem' in css)
check('mobile hero edge-to-edge', '.hero__visual{width:calc(100% + (var(--mobile-edge) * 2))' in css)
check('duplicate hero Rosa removed visually on mobile', '.rosa-hero-card{display:none}' in css)
check('compact three-column process', '.process-strip{grid-template-columns:repeat(3,minmax(0,1fr))' in css)
check('horizontal phone product cards', '.menu-card{display:grid;grid-template-columns:minmax(7.2rem,34vw) minmax(0,1fr)' in css)
check('mobile filters horizontal', '.filter-bar{gap:.45rem' in css and 'scrollbar-width:none' in css)
check('full-height mobile Bag', '.cart-dialog{width:100%;height:100dvh;max-height:100dvh' in css)
check('full-height checkout retained', '.checkout-dialog{width:100%;height:100dvh' in css)
check('Rosa secondary circular launcher', '.rosa-launcher{right:max(.65rem' in css and 'width:3.65rem;height:3.65rem' in css)
check('small phone stress rule', '@media(max-width:23rem)' in css)
check('mobile landscape stress rule', '@media(max-height:32rem) and (orientation:landscape)' in css)
check('tablet range rule', '@media(min-width:48.01rem) and (max-width:72rem)' in css)
check('large screen rule', '@media(min-width:90rem)' in css)
check('forced colors v2.9', '@media(forced-colors:active)' in css and '.mobile-bag-bar:not([hidden])' in css)
check('reduced motion v2.9', '@media(prefers-reduced-motion:reduce)' in css and '.main-nav>a::after{transition:none}' in css)
check('single mobile nav DOM', html.count('class="mobile-nav"') == 1)
check('single menu grid DOM', html.count('id="menu-grid"') == 1)
failed=[name for name,ok in checks if not ok]
for name,ok in checks: print(('PASS' if ok else 'FAIL'), name)
print(f'\n{len(checks)-len(failed)}/{len(checks)} responsive-design checks passed')
if failed: sys.exit(1)
