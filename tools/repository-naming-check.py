#!/usr/bin/env python3
from pathlib import Path
import re, sys
ROOT=Path(__file__).resolve().parents[1]
SKIP={'.git','node_modules','__pycache__'}
ALLOWED={'README-PT.md'}
FORBIDDEN={
 'cardapio','pedido','pedidos','molho','molhos','sobre','historia','experiencia','localizacao','ajuda','privacidade',
 'cliente','clientes','produto','produtos','imagem','imagens','configuracao','entrega','retirada','pagamento','busca','teste','testes'
}
errors=[]
for path in ROOT.rglob('*'):
    rel=path.relative_to(ROOT)
    if any(part in SKIP for part in rel.parts):
        continue
    for part in rel.parts:
        if part in ALLOWED: continue
        try: part.encode('ascii')
        except UnicodeEncodeError:
            errors.append(f'non-ASCII technical path: {rel.as_posix()}'); break
        stem=Path(part).stem.lower()
        tokens={t for t in re.split(r'[^a-z0-9]+',stem) if t}
        bad=tokens & FORBIDDEN
        if bad:
            errors.append(f'Portuguese technical filename token {sorted(bad)[0]!r}: {rel.as_posix()}'); break
if errors:
    print('REPOSITORY NAMING CHECK FAILED')
    for e in sorted(set(errors)): print('-',e)
    sys.exit(1)
print('REPOSITORY NAMING CHECK PASSED')
print('- Technical paths: ASCII + English naming policy')
print('- Public copy/document content may remain Portuguese')
