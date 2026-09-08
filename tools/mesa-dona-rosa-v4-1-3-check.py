from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
checks={
"module":(ROOT/"js/mesa-dona-rosa-v4-1-3.js").exists(),
"section":"id=\"mesa\"" in (ROOT/"index.html").read_text(encoding="utf-8"),
"form":"id=\"mesa-form\"" in (ROOT/"index.html").read_text(encoding="utf-8"),
"status":"id=\"mesa-status\"" in (ROOT/"index.html").read_text(encoding="utf-8"),
"bundle api":"addConfiguredBundle" in (ROOT/"js/main.js").read_text(encoding="utf-8"),
"offline":"mesa-dona-rosa-v4-1-3.js" in (ROOT/"service-worker.js").read_text(encoding="utf-8"),
"responsive":".mesa-planner" in (ROOT/"css/styles.css").read_text(encoding="utf-8"),
"docs":(ROOT/"docs/MESA-DONA-ROSA-4.1.3.md").exists(),
}
for k,v in checks.items(): print(('PASS' if v else 'FAIL'),k)
if not all(checks.values()): raise SystemExit('MESA DONA ROSA 4.1.3 GATE: FAIL')
print(f'{sum(checks.values())}/{len(checks)} mesa-dona-rosa checks passed')
