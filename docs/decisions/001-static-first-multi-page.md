# ADR 001 — Arquitetura multipágina static-first

## Contexto
A Dona Rosa precisava evoluir de landing page para site comercial sem introduzir backend ou framework apenas por aparência técnica.

## Decisão
Usar uma arquitetura multipágina estática gerada por `tools/build-site.py`, mantendo HTML/CSS/JavaScript no runtime público e GitHub Pages como destino de demonstração.

## Consequências
- URLs estáveis por intenção e por produto;
- SEO e compartilhamento melhores;
- Sacola continua compartilhada pela mesma origem;
- backend futuro pode ser conectado por contratos sem exigir reescrita visual;
- build continua reproduzível sem hidratação ou servidor Node em produção.
