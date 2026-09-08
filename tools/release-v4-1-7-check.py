from pathlib import Path
import subprocess,sys
r=Path(__file__).resolve().parents[1]
cmd=[sys.executable,str(r/'tools/admin-variant-pricing-v4-1-7-check.py')]
res=subprocess.run(cmd,cwd=r)
if res.returncode: sys.exit(res.returncode)
print('FORNO DONA ROSA 4.1.7 RELEASE GATE: PASS')
