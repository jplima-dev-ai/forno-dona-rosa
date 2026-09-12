#!/usr/bin/env python3
from pathlib import Path
import json, subprocess, sys
r=Path(__file__).resolve().parents[1]
pkg=json.loads((r/'package.json').read_text(encoding='utf-8'))
manifest=json.loads((r/'data/release-manifest-v4.json').read_text(encoding='utf-8'))
fail=[]
if pkg.get('version')!='3.4.0': fail.append('package version must be 3.4.0')
if manifest.get('version')!='3.4.0': fail.append('release manifest version must be 3.4.0')
status=manifest.get('status',{})
run=status.get('lastWindowsBrowserRun',{})
if status.get('browserMatrix')!='WINDOWS_CHROMIUM_PASS_403': fail.append('Windows Chromium matrix evidence is not recorded as PASS')
if status.get('browserAccessibility')!='AUTOMATED_AXE_E2E_PASS': fail.append('automated browser accessibility evidence is not recorded as PASS')
if run.get('passed')!=403 or run.get('failed')!=0 or run.get('skipped')!=17: fail.append('Windows Playwright counts do not match the accepted 3.4.0 evidence')
if status.get('nvda')!='MANUAL_PASS': fail.append('NVDA manual evidence must be recorded as MANUAL_PASS')
if status.get('talkback')!='MANUAL_PASS': fail.append('TalkBack manual evidence must be recorded as MANUAL_PASS')
if status.get('otherScreenReaders')!='NOT_TESTED_NO_ACCESS': fail.append('untested screen readers must remain explicitly unclaimed')
if fail:
    for x in fail: print('FAIL',x)
    sys.exit(1)
res=subprocess.run([sys.executable,str(r/'tools/release-v4-1-9-check.py')],cwd=r)
if res.returncode: sys.exit(res.returncode)
print('FORNO DONA ROSA 3.4.0 FINAL STABILIZATION EVIDENCE GATE: PASS')
print('Windows Playwright: 403 passed, 0 failed, 17 skipped. NVDA and TalkBack manual evidence recorded as PASS; other screen readers remain untested; published CWV remains pending.')
