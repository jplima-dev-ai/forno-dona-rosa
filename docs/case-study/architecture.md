# Case study — arquitetura 3.0

A versão 3.0 demonstra a evolução de uma landing page para um website comercial multipágina sem abandonar os contratos consolidados de acessibilidade, estado local, checkout, Rosa, white-label e PWA.

## Problema
Uma página única já concentrava descoberta, história, localização, FAQ, catálogo e checkout. Isso funcionava para conversão, mas limitava URLs específicas, SEO por intenção, compartilhamento de produtos e escalabilidade de conteúdo.

## Solução
- catálogo canônico em `data/catalog.json`;
- gerador estático em `tools/build-site.py`;
- páginas específicas por intenção;
- 31 páginas de produto geradas automaticamente;
- Sacola e checkout compartilhados entre páginas;
- runtime preparado para resolver assets em rotas profundas;
- nomenclatura técnica em inglês protegida por gate.

## Escolha de stack
A versão 3.0 continua Vanilla HTML/CSS/JavaScript. Não foi introduzido React porque a necessidade principal era arquitetura de informação, geração estática, performance e contratos de runtime — não estado de aplicação que justificasse hidratação ou bundle adicional.
