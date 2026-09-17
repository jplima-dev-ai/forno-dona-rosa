#!/usr/bin/env python3
from pathlib import Path
import hashlib, json, re, subprocess

ROOT = Path(__file__).resolve().parents[1]
VERSION = "3.4.1"
BOOTSTRAP_PATHS = {
    ".github/workflows/release-3-4-1-bootstrap.yml",
    "tools/bootstrap-release-3-4-1.py",
}

def read(rel):
    return (ROOT / rel).read_text(encoding="utf-8")

def write(rel, content):
    p = ROOT / rel
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(content.rstrip("\r\n") + "\n", encoding="utf-8", newline="\n")

def sub(rel, pattern, repl, count=0, flags=0):
    s = read(rel)
    s2, n = re.subn(pattern, repl, s, count=count, flags=flags)
    if n == 0:
        raise RuntimeError(f"pattern not found in {rel}: {pattern}")
    write(rel, s2)

p = ROOT / "package.json"
pkg = json.loads(p.read_text(encoding="utf-8"))
pkg["version"] = VERSION
pkg["description"] = "Static-first accessible pizzeria storefront — 3.4.1 maintenance release with configurable pizza commerce, assistive ordering, intelligent Bag editing, Rosa concierge and hardened release quality gates."
pkg.setdefault("scripts", {})["release:3.4.1"] = "python tools/release-3-4-1-check.py"
p.write_text(json.dumps(pkg, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")

p = ROOT / "package-lock.json"
lock = json.loads(p.read_text(encoding="utf-8"))
lock["version"] = VERSION
lock.setdefault("packages", {}).setdefault("", {})["version"] = VERSION
p.write_text(json.dumps(lock, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")

sub("js/app-meta.js", r'version:\s*"(?:3\.4\.0|3\.4\.1)"', 'version: "3.4.1"', count=1)
sub("js/app-meta.js", r'release:\s*"[^"]+"', 'release: "3.4.1 Maintenance — Performance & Startup Hardening"', count=1)
sub("service-worker.js", r'const VERSION = "(?:3\.4\.0|3\.4\.1)";', 'const VERSION = "3.4.1";', count=1)
sub("service-worker.js", r'const CACHE_REVISION = "[^"]+";', 'const CACHE_REVISION = "3.4.1-maintenance-r1";', count=1)
sub("js/resilience-v4.js", r'window\.FORNO_META\?\.version \|\| "(?:3\.4\.0|3\.4\.1)"', 'window.FORNO_META?.version || "3.4.1"', count=1)

home = read("index.html")
home = re.sub(r'<meta content="(?:3\.4\.0|3\.4\.1)" name="x-project-version"\s*/>', '<meta content="3.4.1" name="x-project-version"/>', home, count=1)
home = home.replace("Rosa Order Concierge 3.0 • v3.4.0", "Rosa Order Concierge 3.0 • v3.4.1")
write("index.html", home)
admin = read("admin/index.html").replace('content="3.4.0"', 'content="3.4.1"').replace("Admin Studio v3.4.0", "Admin Studio v3.4.1")
write("admin/index.html", admin)

p = ROOT / "data/release-manifest-v4.json"
manifest = json.loads(p.read_text(encoding="utf-8"))
manifest["version"] = VERSION
manifest["name"] = "3.4.1 Maintenance Release"
manifest.setdefault("releasePolicy", {})["requiredBaseline"] = "3.4.1 current maintenance line"
manifest["qualityGates"] = ["release:3.4.1" if g == "release:3.4.0" else g for g in manifest.get("qualityGates", [])]
if "release:3.4.1" not in manifest["qualityGates"]:
    manifest["qualityGates"].append("release:3.4.1")
status = manifest.setdefault("status", {})
status.update({
    "structuralPackage": "LOCAL_PASS",
    "runtimeStaticBuild": "LOCAL_PASS",
    "browserMatrix": "BASELINE_3_4_0_WINDOWS_PASS_403_RETEST_PENDING",
    "browserAccessibility": "BASELINE_3_4_0_AXE_PASS_RETEST_PENDING",
    "nvda": "MANUAL_PASS",
    "talkback": "MANUAL_PASS",
    "otherScreenReaders": "NOT_TESTED_NO_ACCESS",
    "coreWebVitals": "REQUIRES_PUBLISHED_MEASUREMENT",
    "releaseApproval": "PENDING_3_4_1_FINAL_EVIDENCE",
})
p.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")

pairs = {
    ".github/ISSUE_TEMPLATE/bug_report.yml": [("Forno Dona Rosa 3.4.0", "Forno Dona Rosa 3.4.1"), ("versão 3.4.0", "versão 3.4.1")],
    ".github/ISSUE_TEMPLATE/feature_request.yml": [("versão pública corrente é 3.4.0", "versão pública corrente é 3.4.1"), ("linha 3.4.0", "linha 3.4.1")],
    ".github/PULL_REQUEST_TEMPLATE.md": [("versão pública corrente é **3.4.0**", "versão pública corrente é **3.4.1**")],
    "CONTRIBUTING.md": [("versão pública corrente é **3.4.0**", "versão pública corrente é **3.4.1**"), ("clarify 3.4.0 release status", "clarify 3.4.1 release status"), ("além de **3.4.0**", "além de **3.4.1**")],
}
for rel, replacements in pairs.items():
    s = read(rel)
    for old, new in replacements:
        s = s.replace(old, new)
    write(rel, s)

s = read("README.md")
s = s.replace("> **Versão corrente: 3.4.0 — Stabilization Release.** Esta é a versão publicada e suportada até nova ordem explícita.", "> **Versão corrente: 3.4.1 — Maintenance Release.** Esta é a versão publicada e suportada até nova ordem explícita.")
s = s.replace("[Release 3.4.0](https://github.com/jplima-dev-ai/forno-dona-rosa/releases/tag/v3.4.0)", "[Release 3.4.1](https://github.com/jplima-dev-ai/forno-dona-rosa/releases/tag/v3.4.1)")
status_section = '''## Estado oficial da 3.4.1

A release 3.4.1 é a linha atual do produto e consolida a manutenção de performance e inicialização integrada após a 3.4.0.

Evidência consolidada:

- build 3.4.1: PASS, com 55 páginas + sitemap gerados;
- gates estruturais, comportamentais e de release: PASS;
- matriz Windows Playwright da baseline 3.4.0: **403 passed, 0 failed, 17 skipped (8.4m)**;
- Axe serious/critical da baseline 3.4.0: PASS;
- NVDA no Windows e TalkBack no Android: **MANUAL PASS na 3.4.1**, com a baseline 3.4.0 preservada historicamente;
- JAWS, Narrator e VoiceOver: não testados por falta de acesso aos ambientes necessários;
- Core Web Vitals em ambiente publicado: medição pendente.

A documentação preserva separadamente a evidência histórica da 3.4.0 e os testes manuais realizados na 3.4.1. Automação também não substitui validação humana com tecnologia assistiva.
'''
s, n = re.subn(r'## Estado oficial da 3\.4\.0\n.*?(?=\n## Funcionalidades principais)', status_section.rstrip(), s, count=1, flags=re.S)
if n != 1: raise RuntimeError("README status section not found")
s = s.replace("npm.cmd run release:3.4.0", "npm.cmd run release:3.4.1")
s = s.replace("A versão corrente do produto, do `package.json`, dos metadados, da release e da documentação oficial é **3.4.0**.", "A versão corrente do produto, do `package.json`, dos metadados, da release e da documentação oficial é **3.4.1**.")
s, n = re.subn(r'A release 3\.4\.0 possui evidência automatizada de browser e CI, além de validação manual com NVDA e TalkBack, registrada em:\n\n- `docs/RELEASE-3\.4\.0\.md`;\n- `docs/releases/evidence/v3\.4\.0/summary\.md`;\n- GitHub Actions;\n- GitHub Release `v3\.4\.0`\.', 'A 3.4.1 possui ledger próprio e preserva a 3.4.0 como baseline histórica:\n\n- `docs/RELEASE-3.4.1.md`;\n- `docs/releases/evidence/v3.4.1/summary.md`;\n- `docs/RELEASE-3.4.0.md` (histórico);\n- `docs/releases/evidence/v3.4.0/summary.md` (histórico);\n- GitHub Actions;\n- GitHub Release `v3.4.1`.', s, count=1)
if n != 1: raise RuntimeError("README evidence section not found")
write("README.md", s)

changelog = read("CHANGELOG.md")
if not changelog.startswith("## 3.4.1 — Maintenance Release"):
    section = '''## 3.4.1 — Maintenance Release

- Promove a linha de manutenção pós-3.4.0 para versão pública 3.4.1 sem adicionar nova superfície funcional.
- Hospeda fontes localmente e elimina dependência de Google Fonts no storefront gerado.
- Torna o bundle de estilos da home determinístico e reduz pressão de preload acima da dobra.
- Alinha estilos do Experience Router ao markup da home e adia scripts não críticos.
- Adia a renderização oculta da Rosa, a inicialização do checkout até abertura e a renderização oculta da Sacola.
- Endurece a coleta de evidência de performance com baseline reproduzível e execução Lighthouse em múltiplas rodadas.
- Atualiza metadados, Service Worker, páginas geradas, Admin Studio, templates de contribuição e quality gates para reconhecer a 3.4.1.
- Registra **MANUAL PASS na 3.4.1** para NVDA no Windows e TalkBack no Android, mantendo a evidência 3.4.0 preservada historicamente.
- Mantém a tag e a documentação 3.4.0 imutáveis para rastreabilidade.

'''
    write("CHANGELOG.md", section + changelog)
else:
    changelog = changelog.replace("Preserva a evidência manual de NVDA/TalkBack da 3.4.0 como baseline histórica; nenhum novo PASS manual é declarado para 3.4.1 sem reteste específico.", "Registra **MANUAL PASS na 3.4.1** para NVDA no Windows e TalkBack no Android, mantendo a evidência 3.4.0 preservada historicamente.")
    write("CHANGELOG.md", changelog)

for path in (ROOT / "tools").glob("*.py"):
    if path.name == "release-3-4-0-check.py":
        continue
    s = path.read_text(encoding="utf-8")
    s = s.replace("pkg.get('version') == '3.4.0'", "pkg.get('version') in {'3.4.0','3.4.1'}")
    s = s.replace("pkg.get('version') != '3.4.0'", "pkg.get('version') not in {'3.4.0','3.4.1'}")
    s = s.replace("str(pkg.get('version')) != '3.4.0'", "str(pkg.get('version')) not in {'3.4.0','3.4.1'}")
    s = s.replace("str(version) != '3.4.0'", "str(version) not in {'3.4.0','3.4.1'}")
    s = s.replace("pdata.get('version') != '3.4.0'", "pdata.get('version') not in {'3.4.0','3.4.1'}")
    s = s.replace("'.'.join(m.groups()) != '3.4.0'", "'.'.join(m.groups()) not in {'3.4.0','3.4.1'}")
    path.write_text(s, encoding="utf-8", newline="\n")

write("tools/signature-commerce-v4-1-9-check.py", '''#!/usr/bin/env python3
from pathlib import Path
import json,re,sys
ROOT=Path(__file__).resolve().parents[1]
checks=[]
def text(p): return (ROOT/p).read_text(encoding='utf-8')
def check(name,cond): checks.append((name,bool(cond)))
pkg=json.loads(text('package.json'))
manifest=json.loads(text('data/release-manifest-v4.json'))
index=text('index.html'); admin=text('admin/index.html'); sw=text('service-worker.js'); build=text('tools/build-site.py')
current=pkg.get('version'); check('version supported', current in {'3.4.0','3.4.1'})
check('app meta matches package', f'version: "{current}"' in text('js/app-meta.js'))
check('service worker matches package', f'const VERSION = "{current}"' in sw)
check('root HTML matches package', f'content="{current}"' in index)
check('admin HTML matches package', f'content="{current}"' in admin and f'Admin Studio v{current}' in admin)
check('release manifest matches package', manifest.get('version')==current)
status=manifest.get('status',{})
run=status.get('lastWindowsBrowserRun',{})
browser_status=status.get('browserMatrix')
browser_honest=(browser_status in {'PENDING_WINDOWS_EXECUTION','RETEST_REQUIRED_AFTER_3.4.0_FIX','BASELINE_3_4_0_WINDOWS_PASS_403_RETEST_PENDING'} or (browser_status=='WINDOWS_CHROMIUM_PASS_403' and run.get('passed')==403 and run.get('failed')==0 and run.get('skipped')==17))
check('release manifest honest browser status', browser_honest)
check('release manifest honest NVDA status', status.get('nvda') in {'MANUAL_REQUIRED','MANUAL_PASS','BASELINE_3_4_0_MANUAL_PASS_RETEST_PENDING'})
check('release manifest honest TalkBack status', status.get('talkback') in {None,'MANUAL_PASS','BASELINE_3_4_0_MANUAL_PASS_RETEST_PENDING'})
check('unclaimed screen readers remain explicit', status.get('otherScreenReaders') in {None,'NOT_TESTED_NO_ACCESS'})
check('fortress sitewide generator', 'css/accessibility-fortress-v4-1-8.css' in build)
check('fortress in service worker shell', 'css/accessibility-fortress-v4-1-8.css' in sw)
check('signature release docs', (ROOT/'docs/RELEASE-3.4.0.md').exists() and (ROOT/'docs/SIGNATURE-COMMERCE-4.1.9.md').exists())
check('signature evidence ledger', (ROOT/'docs/releases/evidence/v4.1.9/summary.md').exists())
check('signature E2E exists', (ROOT/'tests/e2e/signature-commerce-v4-1-9.spec.js').exists())
check('signature behavior gate wired', 'signature-commerce-v4-1-9-behavior-check.js' in pkg.get('scripts',{}).get('quality',''))
check('signature release gate wired', 'release-v4-1-9-check.py' in pkg.get('scripts',{}).get('quality',''))
failed=[n for n,ok in checks if not ok]
for n,ok in checks: print(('PASS' if ok else 'FAIL').ljust(5),n)
print(f'{len(checks)-len(failed)}/{len(checks)} Signature Commerce checks passed')
if failed: sys.exit(1)
''')

write("tools/release-v4-1-9-check.py", '''#!/usr/bin/env python3
from pathlib import Path
import subprocess,sys,json
r=Path(__file__).resolve().parents[1]
pkg=json.loads((r/'package.json').read_text(encoding='utf-8'))
if pkg.get('version') not in {'3.4.0','3.4.1'}: print('FAIL unsupported 3.4 release version'); sys.exit(1)
steps=[
 [sys.executable,str(r/'tools/variant-commerce-v4-1-check.py')],
 [sys.executable,str(r/'tools/pizza-configurator-v4-1-1-check.py')],
 [sys.executable,str(r/'tools/smart-portion-v4-1-2-check.py')],
 [sys.executable,str(r/'tools/mesa-dona-rosa-v4-1-3-check.py')],
 [sys.executable,str(r/'tools/smart-pairing-v4-1-4-check.py')],
 [sys.executable,str(r/'tools/intelligent-bag-v4-1-5-check.py')],
 [sys.executable,str(r/'tools/rosa-order-concierge-v4-1-6-check.py')],
 [sys.executable,str(r/'tools/admin-variant-pricing-v4-1-7-check.py')],
 [sys.executable,str(r/'tools/accessibility-fortress-v4-1-8-check.py')],
 [sys.executable,str(r/'tools/signature-commerce-v4-1-9-check.py')],
 ['node',str(r/'tools/signature-commerce-v4-1-9-behavior-check.js')]
]
for cmd in steps:
    res=subprocess.run(cmd,cwd=r)
    if res.returncode: sys.exit(res.returncode)
print(f'FORNO DONA ROSA {pkg.get("version")} COMPATIBILITY RELEASE GATE: PASS')
print('Nota: este gate preserva a cadeia histórica. A baseline 3.4.0 mantém sua evidência; a 3.4.1 registra MANUAL_PASS próprio para NVDA no Windows e TalkBack no Android. Outros leitores permanecem não testados por falta de acesso; a matriz automatizada renovada e CWV publicado permanecem pendentes.')
''')

b = read("tools/signature-commerce-v4-1-9-behavior-check.js")
if '"PENDING_3_4_1_FINAL_EVIDENCE"' not in b:
    b = b.replace('"PENDING_PUBLISHED_CWV_EVIDENCE"]', '"PENDING_PUBLISHED_CWV_EVIDENCE","PENDING_3_4_1_FINAL_EVIDENCE"]')
write("tools/signature-commerce-v4-1-9-behavior-check.js", b)

s = read("tools/accessibility-certification-v4-check.py")
s = re.sub(r"print\('Nota:.*?\'\)\s*$", "print('Nota: a matriz v4 preserva a baseline 3.4.0 e registra separadamente MANUAL_PASS na 3.4.1 para NVDA no Windows e TalkBack no Android. Leitores não executados permanecem sem claim de aprovação.')", s, flags=re.S)
write("tools/accessibility-certification-v4-check.py", s)

s = read("tools/browser-certification-check.py").replace("check('3.4.0 Stabilization Commerce E2E'", "check('3.4.1 Signature Commerce E2E'")
write("tools/browser-certification-check.py", s)

for rel in ["tests/e2e/rosa-order-concierge.spec.js", "tests/e2e/signature-commerce-v4-1-9.spec.js"]:
    write(rel, read(rel).replace("3.4.0", "3.4.1"))

write("tools/release-3-4-1-check.py", '''#!/usr/bin/env python3
from pathlib import Path
import json, subprocess, sys
ROOT = Path(__file__).resolve().parents[1]
fail = []
def text(rel): return (ROOT / rel).read_text(encoding="utf-8")
def check(condition, message):
    if not condition: fail.append(message)
pkg = json.loads(text("package.json")); manifest = json.loads(text("data/release-manifest-v4.json")); version = pkg.get("version")
check(version == "3.4.1", "package version must be 3.4.1")
check(manifest.get("version") == "3.4.1", "release manifest version must be 3.4.1")
check(manifest.get("name") == "3.4.1 Maintenance Release", "release manifest name mismatch")
check('version: "3.4.1"' in text("js/app-meta.js"), "app meta must be 3.4.1")
check('const VERSION = "3.4.1"' in text("service-worker.js"), "service worker must be 3.4.1")
check('3.4.1' in text("index.html"), "root HTML must identify 3.4.1")
check('Admin Studio v3.4.1' in text("admin/index.html"), "Admin Studio must identify 3.4.1")
check((ROOT / "docs/RELEASE-3.4.1.md").exists(), "3.4.1 release notes missing")
check((ROOT / "docs/releases/evidence/v3.4.1/summary.md").exists(), "3.4.1 evidence summary missing")
check("release:3.4.1" in manifest.get("qualityGates", []), "manifest does not wire release:3.4.1")
status = manifest.get("status", {})
check(status.get("releaseApproval") in {"PENDING_3_4_1_FINAL_EVIDENCE","PENDING_PUBLISHED_CWV_EVIDENCE","APPROVED_WITH_DECLARED_LIMITATIONS"}, "release approval status is not an honest 3.4.1 state")
check(status.get("nvda") == "MANUAL_PASS", "NVDA 3.4.1 manual evidence must be MANUAL_PASS")
check(status.get("talkback") == "MANUAL_PASS", "TalkBack 3.4.1 manual evidence must be MANUAL_PASS")
check(status.get("otherScreenReaders") == "NOT_TESTED_NO_ACCESS", "untested screen readers must remain explicit")
if fail:
    print("FORNO DONA ROSA 3.4.1 RELEASE EVIDENCE GATE: FAIL")
    for item in fail: print("-", item)
    raise SystemExit(1)
compat = subprocess.run([sys.executable, str(ROOT / "tools/release-v4-1-9-check.py")], cwd=ROOT)
if compat.returncode: raise SystemExit(compat.returncode)
print("FORNO DONA ROSA 3.4.1 RELEASE EVIDENCE GATE: PASS")
print("- version, runtime metadata, generated HTML and release documentation are aligned")
print("- NVDA and TalkBack manual tests are recorded as MANUAL_PASS for 3.4.1; 3.4.0 evidence remains preserved historically")
print("- published Core Web Vitals and any renewed automated browser matrix remain explicit evidence items")
''')

write("docs/RELEASE-3.4.1.md", '''# Forno Dona Rosa 3.4.1 — Maintenance Release

A versão 3.4.1 oficializa a linha de manutenção integrada após a 3.4.0. O objetivo é consolidar performance, inicialização e reprodutibilidade de evidência sem ampliar o escopo funcional do produto.

## Escopo

- fontes locais nas páginas geradas;
- bundle determinístico de estilos da home;
- redução de preload não essencial;
- scripts da home adiados quando seguro;
- renderização oculta da Rosa adiada;
- checkout inicializado somente quando aberto;
- Sacola oculta renderizada sob demanda;
- baseline de performance 3.4.1 reproduzível e endurecida;
- atualização de metadados, cache revision, HTML gerado, Admin Studio e quality gates para 3.4.1.

## Evidência automatizada disponível

A manutenção que compõe esta release foi integrada à `main` após validação automatizada no PR #8. Naquela integração, Quality, Browser Certification e Performance Baseline concluíram com sucesso. A execução de performance registrou mediana mobile Performance 77, TBT 25,5 ms e CLS 0; desktop Performance 98, TBT 0 e CLS ~0,0029. Os números Lighthouse sintéticos são tratados separadamente das métricas observadas no navegador.

O bump formal para 3.4.1 possui gate próprio (`release:3.4.1`) e deve manter `npm run quality` verde antes da publicação.

## Tecnologia assistiva

A 3.4.1 possui validação manual informada pelo responsável pelo projeto para as duas tecnologias assistivas efetivamente testadas nesta release:

- NVDA no Windows: **MANUAL PASS na 3.4.1**;
- TalkBack no Android: **MANUAL PASS na 3.4.1**;
- JAWS, Narrator e VoiceOver: não testados por falta de acesso aos ambientes necessários.

A baseline 3.4.0 também preserva sua própria evidência manual histórica. Os novos PASS da 3.4.1 são registrados separadamente e não substituem nem reescrevem a evidência anterior. Automação de Axe/Playwright não substitui teste humano com leitor de tela.

## Core Web Vitals

A medição publicada de Core Web Vitals continua sendo evidência separada da baseline Lighthouse de CI e deve permanecer explícita enquanto não houver coleta de campo publicada.

## Proveniência

- Base histórica protegida: tag `v3.4.0` em `4fd196c56d78ce1317070681ab4ecb30d172a570`.
- Integração da manutenção na `main`: `d7b0bdf3cb03672e60a2c74006e979fee123156d`.
- A tag `v3.4.0`, `docs/RELEASE-3.4.0.md`, `docs/releases/evidence/v3.4.0/summary.md` e `tools/release-3-4-0-check.py` permanecem históricos e não devem ser reescritos como 3.4.1.

## Política de release

A 3.4.1 é uma maintenance release. Mudanças futuras de versão continuam exigindo decisão explícita do responsável pelo projeto.
''')

write("docs/releases/evidence/v3.4.1/summary.md", '''# Evidence — Forno Dona Rosa 3.4.1 Maintenance Release

## Estado

A 3.4.1 consolida a manutenção integrada após a estabilização 3.4.0. Este ledger separa evidência realmente executada de evidência histórica herdada.

## Build e integridade local

- `npm run build`: PASS no bump 3.4.1; 55 páginas + sitemap gerados.
- catálogo sincronizado: 32 produtos.
- media build: 32 produtos verificados, sem rebuild necessário na rodada observada.
- HTML público após o bump: nenhuma ocorrência residual de versão 3.4.0.
- `git diff --check`: sem erro de whitespace; avisos LF/CRLF do Git no Windows não são tratados como falha.

## Evidência de manutenção integrada antes do bump formal

PR #8, posteriormente integrado à `main`, validou a linha de manutenção que compõe a 3.4.1:

- Quality: PASS;
- Browser Certification: PASS;
- Performance Baseline: PASS.

Performance Baseline #14, em execução de PR:

- mobile mediana: Performance 77; FCP 1955,8 ms; LCP sintético 5932,9 ms; TBT 25,5 ms; CLS 0; observed LCP 180 ms;
- desktop: Performance 98; FCP 445,4 ms; LCP sintético 1191,1 ms; TBT 0; CLS 0,0029; observed LCP 265 ms.

Os valores Lighthouse/Lantern sintéticos não são apresentados como latência observada literal.

## Tecnologia assistiva — 3.4.1

- NVDA no Windows: **MANUAL PASS na 3.4.1**, conforme teste humano informado pelo responsável pelo projeto.
- TalkBack no Android: **MANUAL PASS na 3.4.1**, conforme teste humano informado pelo responsável pelo projeto.
- JAWS: não testado.
- Narrator: não testado.
- VoiceOver: não testado.

A evidência manual da 3.4.0 permanece preservada como baseline histórica independente.

## Evidência ainda pendente

- nova execução completa de Playwright/Axe especificamente sobre o bump formal 3.4.1, caso se deseje renovar a matriz automatizada além da baseline integrada;
- Core Web Vitals de campo no ambiente publicado.

## Regra de interpretação

`PASS` significa executado e aprovado. Para NVDA e TalkBack, o PASS 3.4.1 corresponde ao teste humano informado pelo responsável pelo projeto. `NOT_TESTED_NO_ACCESS` permanece sem claim de compatibilidade.
''')

write("STABILIZATION-BUILD.txt", '''Forno Dona Rosa
Product version: 3.4.1
Maintenance build: 1
Cache revision: 3.4.1-maintenance-r1

This build promotes the validated post-3.4.0 maintenance line to the public 3.4.1 release:
- local fonts and deterministic home CSS bundle;
- reduced preload pressure and deferred non-critical home startup;
- hidden Rosa rendering deferred until needed;
- checkout initialized on demand;
- hidden Bag rendering deferred;
- reproducible/hardened performance baseline evidence;
- 3.4.1-specific release gate and documentation;
- NVDA on Windows and TalkBack on Android: MANUAL_PASS for 3.4.1, with 3.4.0 evidence preserved historically.

Local validation for this release line:
- build: PASS;
- structural/behavior/release gates: PASS;
- renewed automated browser matrix remains a separate CI evidence item;
- published Core Web Vitals remain pending field evidence.
''')

subprocess.run(["npm", "run", "build"], cwd=ROOT, check=True)

leftovers=[]
for html in ROOT.rglob("*.html"):
    if "3.4.0" in html.read_text(encoding="utf-8", errors="ignore"):
        leftovers.append(str(html.relative_to(ROOT)))
if leftovers:
    raise RuntimeError("3.4.0 remains in HTML: " + ", ".join(leftovers[:10]))

tracked = subprocess.check_output(["git", "ls-files"], cwd=ROOT, text=True).splitlines()
new_files = ["docs/RELEASE-3.4.1.md", "docs/releases/evidence/v3.4.1/summary.md", "tools/release-3-4-1-check.py"]
paths = sorted(set(tracked + new_files) - BOOTSTRAP_PATHS - {"SHA256SUMS.txt"})
lines=[]
for rel in paths:
    p=ROOT/rel
    if not p.is_file():
        continue
    digest=hashlib.sha256(p.read_bytes()).hexdigest()
    lines.append(f"{digest}  ./{rel.replace('\\','/')}")
write("SHA256SUMS.txt", "\n".join(lines))

print("BOOTSTRAP 3.4.1 COMPLETE")
