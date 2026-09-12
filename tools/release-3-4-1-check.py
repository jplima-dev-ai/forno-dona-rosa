#!/usr/bin/env python3
from pathlib import Path
import json, subprocess, sys
r=Path(__file__).resolve().parents[1]
pkg=json.loads((r/'package.json').read_text(encoding='utf-8'))
manifest=json.loads((r/'data/release-manifest-v4.json').read_text(encoding='utf-8'))
fail=[]
if pkg.get('version')!='3.4.1': fail.append('package version must be 3.4.1')
if manifest.get('version')!='3.4.1': fail.append('release manifest version must be 3.4.1')
status=manifest.get('status',{})
run=status.get('lastWindowsBrowserRun',{})
if status.get('browserMatrix')!='WINDOWS_CHROMIUM_PASS_403': fail.append('accepted Windows Chromium baseline is missing')
if status.get('browserAccessibility')!='AUTOMATED_AXE_E2E_PASS': fail.append('automated accessibility baseline is missing')
if run.get('passed')!=403 or run.get('failed')!=0 or run.get('skipped')!=17: fail.append('accepted Windows Playwright baseline counts changed unexpectedly')
if status.get('nvda')!='MANUAL_PASS': fail.append('NVDA evidence must remain MANUAL_PASS')
if status.get('talkback')!='MANUAL_PASS': fail.append('TalkBack evidence must remain MANUAL_PASS')
if status.get('otherScreenReaders')!='NOT_TESTED_NO_ACCESS': fail.append('untested screen readers must remain explicitly unclaimed')
if status.get('coreWebVitals') not in {'PUBLISHED_LIGHTHOUSE_BASELINE_CAPTURED_OPTIMIZATION_IN_PROGRESS','PUBLISHED_LIGHTHOUSE_RETEST_PASS'}: fail.append('3.4.1 Lighthouse evidence state is invalid')
if fail:
    for x in fail: print('FAIL',x)
    sys.exit(1)
res=subprocess.run([sys.executable,str(r/'tools/release-v4-1-9-check.py')],cwd=r)
if res.returncode: sys.exit(res.returncode)
print('FORNO DONA ROSA 3.4.1 PERFORMANCE STABILIZATION GATE: PASS')
print('Manual AT evidence preserved. Published Lighthouse baseline recorded; post-deploy retest required before final performance approval.')
