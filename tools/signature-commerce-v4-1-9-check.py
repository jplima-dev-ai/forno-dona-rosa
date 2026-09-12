#!/usr/bin/env python3
from pathlib import Path
import json,re,sys

ROOT=Path(__file__).resolve().parents[1]
checks=[]
def text(p): return (ROOT/p).read_text(encoding='utf-8')
def check(name,cond): checks.append((name,bool(cond)))

pkg=json.loads(text('package.json'))
version=str(pkg.get('version',''))
manifest=json.loads(text('data/release-manifest-v4.json'))
index=text('index.html')
admin=text('admin/index.html')
sw=text('service-worker.js')
build=text('tools/build-site.py')
app_meta=text('js/app-meta.js')

check('current version semantic', bool(re.fullmatch(r'\d+\.\d+\.\d+',version)))
check('app meta matches current version', f'version: "{version}"' in app_meta)
check('service worker matches current version', f'const VERSION = "{version}"' in sw)
check('root HTML matches current version', f'content="{version}"' in index)
check('admin HTML matches current version', f'content="{version}"' in admin and f'Admin Studio v{version}' in admin)
check('release manifest matches current version', manifest.get('version')==version and str(manifest.get('name','')).startswith(version))

status=manifest.get('status',{})
run=status.get('lastWindowsBrowserRun',{})
browser_status=status.get('browserMatrix')
browser_honest=(
    browser_status in {'PENDING_WINDOWS_EXECUTION','RETEST_REQUIRED_AFTER_3.4.0_FIX','RETEST_REQUIRED_AFTER_3.4.1_FIX'}
    or (browser_status=='WINDOWS_CHROMIUM_PASS_403' and run.get('passed')==403 and run.get('failed')==0 and run.get('skipped')==17)
)
check('release manifest honest browser status', browser_honest)
check('release manifest honest NVDA status', status.get('nvda') in {'MANUAL_REQUIRED','MANUAL_PASS'})
check('release manifest honest TalkBack status', status.get('talkback') in {None,'MANUAL_REQUIRED','MANUAL_PASS'})
check('unclaimed screen readers remain explicit', status.get('otherScreenReaders') in {None,'NOT_TESTED_NO_ACCESS'})
check('release approval remains explicit', status.get('releaseApproval') is not None)
check('fortress sitewide generator', 'css/accessibility-fortress-v4-1-8.css' in build)
check('fortress in service worker shell', 'css/accessibility-fortress-v4-1-8.css' in sw)
check('current release docs', (ROOT/f'docs/RELEASE-{version}.md').exists())
check('signature historical docs', (ROOT/'docs/SIGNATURE-COMMERCE-4.1.9.md').exists())
check('signature evidence ledger', (ROOT/'docs/releases/evidence/v4.1.9/summary.md').exists())
check('signature E2E exists', (ROOT/'tests/e2e/signature-commerce-v4-1-9.spec.js').exists())
check('signature behavior gate wired', 'signature-commerce-v4-1-9-behavior-check.js' in pkg.get('scripts',{}).get('quality',''))
check('signature release gate wired', 'release-v4-1-9-check.py' in pkg.get('scripts',{}).get('quality',''))

failed=[n for n,ok in checks if not ok]
for n,ok in checks:
    print(('PASS' if ok else 'FAIL').ljust(5),n)
print(f'{len(checks)-len(failed)}/{len(checks)} Signature Commerce checks passed')
if failed:
    sys.exit(1)
