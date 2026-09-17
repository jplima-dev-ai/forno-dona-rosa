# Forno Dona Rosa

[![Quality](https://github.com/jplima-dev-ai/forno-dona-rosa/actions/workflows/quality.yml/badge.svg)](https://github.com/jplima-dev-ai/forno-dona-rosa/actions/workflows/quality.yml)
[![Browser Certification](https://github.com/jplima-dev-ai/forno-dona-rosa/actions/workflows/browser-certification.yml/badge.svg)](https://github.com/jplima-dev-ai/forno-dona-rosa/actions/workflows/browser-certification.yml)

**Plataforma web premium, acessível, mobile-first, static-first e white-label para pizzarias de pequeno e médio porte.**

O Forno Dona Rosa não foi tratado como um site institucional simples. O projeto foi desenvolvido como um **produto comercial demonstrável**, com catálogo orientado a dados, páginas de produto, Sacola persistente, checkout, PWA, busca, concierge contextual, administração local-first, arquitetura white-label e uma disciplina explícita de acessibilidade, testes e evidência.

**Demo:** https://jplima-dev-ai.github.io/forno-dona-rosa/

[Release 3.4.0](https://github.com/jplima-dev-ai/forno-dona-rosa/releases/tag/v3.4.0) · [Arquitetura](docs/ARCHITECTURE.md) · [Documentação](docs/README.md) · [Changelog](CHANGELOG.md) · [Admin Studio](docs/admin/ADMIN-STUDIO.md)

> **Versão corrente: 3.4.0 — Stabilization Release.** Esta é a versão publicada e suportada até nova ordem explícita.

## O problema de engenharia

Uma pizzaria local parece um domínio simples até o momento em que a experiência precisa funcionar de verdade.

O storefront precisa lidar com catálogo, tamanhos, preços, disponibilidade, montagem do pedido, entrega ou retirada, agendamento, pagamento, persistência, navegação em telas pequenas, acessibilidade, conteúdo editorial e manutenção operacional — sem transformar cada mudança em uma edição manual de dezenas de páginas.

O projeto nasceu para responder a quatro perguntas:

1. Como criar uma experiência comercial rica sem depender obrigatoriamente de backend para a demo e o portfólio?
2. Como manter marca, catálogo, conteúdo e comércio separados da estrutura da interface?
3. Como permitir evolução para múltiplos clientes sem duplicar o projeto inteiro?
4. Como tratar acessibilidade e qualidade como requisitos de arquitetura, não como correções de fim de projeto?

## A solução

A implementação combina **dados canônicos + build estático + runtime compartilhado**.

```text
Dados canônicos
  ├─ marca e conteúdo
  ├─ catálogo
  ├─ reviews
  └─ editorial
        ↓
Build estático
        ↓
Home + institucionais + menu + pedido + produtos + artigos + categorias
        ↓
Runtime compartilhado
  ├─ Sacola
  ├─ checkout
  ├─ Rosa Order Concierge
  ├─ status comercial
  ├─ busca
  └─ PWA
```

O resultado é um storefront navegável e funcional em hospedagem estática, mas com fronteiras preparadas para substituir persistência local por APIs autenticadas no futuro sem reescrever o DOM inteiro.

## O que este projeto demonstra

### Engenharia de produto

- catálogo configurável e páginas individuais de produto;
- variantes Média, Grande e Família;
- configurador progressivo com revisão antes da Sacola;
- Smart Portion para estimativa de porções;
- Mesa da Dona Rosa para pedidos em grupo;
- Smart Pairing para sugestões contextuais;
- Intelligent Bag para edição de tamanho, borda, quantidade e observações;
- Rosa Order Concierge conectada ao estado real do pedido;
- checkout com entrega ou retirada, agendamento, Pix ou dinheiro;
- busca global;
- PWA e service worker;
- conteúdo editorial gerado a partir de dados estruturados.

### Arquitetura e manutenção

- fontes de verdade explícitas em `data/`;
- geração multipágina por `tools/build-site.py`;
- pipeline de mídia responsiva;
- runtime público separado por responsabilidade;
- state machine explícita para checkout;
- contratos de repository/persistence substituíveis;
- Admin Studio local-first;
- arquitetura white-label para reutilização em novos clientes;
- ADRs e documentação de decisões técnicas.

### Qualidade e acessibilidade

- HTML semântico, landmarks e headings coerentes;
- navegação por teclado e foco visível;
- dialogs nativos e retorno de foco;
- labels, `fieldset`/`legend` e mensagens de erro associadas;
- `aria-live` usado apenas para mudanças relevantes;
- zoom, reflow e conteúdo longo;
- `prefers-reduced-motion`;
- forced colors;
- touch targets adequados;
- uma única árvore DOM para desktop e mobile;
- Playwright E2E;
- Axe serious/critical;
- quality gates estruturais, comportamentais, responsivos e de segurança;
- GitHub Actions para Quality, Browser Certification e baseline de performance.

## Evidência verificável

A release 3.4.0 foi estabilizada com uma matriz ampla de validação:

- **403 testes Playwright aprovados**;
- **0 falhas**;
- **17 testes ignorados** por condições previstas;
- desktop, 320 px, 390 px, 430 px, tablet e landscape;
- Axe serious/critical: PASS na matriz automatizada executada;
- reflow, rotas, deep links, checkout, Sacola, Rosa, Admin e fluxos críticos de comércio: PASS;
- GitHub Actions `Quality`: PASS;
- GitHub Actions `Browser Certification`: PASS;
- GitHub Pages build/deployment: PASS;
- **NVDA no Windows: validação manual PASS**;
- **TalkBack no Android: validação manual PASS**;
- **JAWS, Narrator e VoiceOver: não testados** por falta de acesso aos ambientes necessários.

Automação não substitui validação humana com tecnologia assistiva. O projeto evita declarar compatibilidade certificada com leitores de tela que não foram realmente executados.

## Performance: medir antes de otimizar

A otimização foi conduzida com baseline reproduzível em CI, três execuções mobile e decisão pela mediana para reduzir reação a ruído de uma única rodada.

Baseline do PR final de consolidação:

- Lighthouse mobile mediano: **77**;
- Lighthouse desktop: **98**;
- TBT mobile mediano: **25,5 ms**;
- TBT desktop: **0 ms**;
- CLS mobile: **0**;
- CLS desktop: **0,0029**;
- LCP observado no trace mobile mediano: **180 ms**;
- load observado mobile mediano: **255 ms**.

Os valores sintéticos do Lighthouse/Lantern e os valores observados no trace são registrados separadamente. O projeto não trata um único run ruidoso como regressão por padrão.

Entre as otimizações consolidadas estão:

- fontes self-hosted;
- preload apenas de fontes acima da dobra;
- bundle CSS determinístico da Home;
- scripts deferidos;
- renderização oculta da Rosa adiada;
- inicialização do checkout somente no primeiro uso;
- renderização completa da Sacola adiada, mantendo o resumo visível atualizado no boot.

## Jornada comercial principal

```text
Home
→ Cardápio
→ Produto
→ Sacola
→ Entrega ou Retirada
→ Agora ou Agendamento
→ Pix ou Dinheiro
→ Extras opcionais
→ Revisão
→ WhatsApp controlado pelo cliente
```

Nada é enviado automaticamente.

## Decisões técnicas importantes

### Static-first, não static-only

GitHub Pages é suficiente para demonstrar o produto porque navegação, catálogo e montagem do pedido não dependem de execução server-side. A arquitetura, porém, mantém fronteiras de repository/persistence para futura integração autenticada.

```text
Local Repository hoje
        ↓
mesmo contrato
        ↓
Authenticated API Repository no futuro
```

### Dados antes de páginas

O Admin Studio edita **dados**, não estrutura HTML. Marca, conteúdo, catálogo, reviews e artigos vivem em fontes canônicas e alimentam o build.

### Estado persistido não é confiável

Itens desconhecidos da Sacola são descartados, quantidades são limitadas e preços são recalculados pelo catálogo atual. Dados pessoais do checkout são session-first; persistência de endereço exige consentimento explícito.

### Acessibilidade como contrato

Os testes automatizados verificam contratos possíveis de automatizar. Claims sobre leitores de tela só são registrados quando houve execução humana real.

## Principais fontes de verdade

- `data/brand/brand.json` — identidade, contatos, horários e configuração operacional;
- `data/brand/content.json` — copy configurável;
- `data/catalog.json` — produtos, preços, imagens e capacidades;
- `data/reviews.json` — avaliações reais quando disponíveis;
- `data/articles.json` — artigos, categorias, tags, publicação e SEO editorial;
- `data/newsletter.json` — contrato de newsletter, desativado por padrão;
- `data/commerce-config.js` — contrato comercial derivado para o runtime.

## Admin Studio

A rota técnica `/admin/` permite editar dados operacionais sem alterar código. O painel possui modo Simples/Avançado, busca por ação, histórico com desfazer, preview, onboarding, import/export de bundle e validações de segurança.

A publicação remota automática não é simulada: GitHub Pages não é backend autenticado. O fluxo atual permanece local-first.

## White-label

Dona Rosa é a implementação de referência. Contratos de marca, catálogo, conteúdo e comércio foram separados para reaproveitamento.

- [White-label](docs/WHITE-LABEL.md)
- [Configuração](docs/customization/CONFIGURATION.md)
- [Criar um cliente](docs/customization/CREATE-A-CLIENT.md)

## Stack e ferramentas

```text
HTML5
CSS moderno
JavaScript
Python
Node.js
Playwright
Axe
Lighthouse
GitHub Actions
GitHub Pages
```

Requisitos de desenvolvimento:

```text
Node.js >= 20
Python >= 3.11
```

## Executar localmente no Windows

```powershell
npm.cmd install
python -m pip install -r requirements-dev.txt
npm.cmd run build
npm.cmd run quality
```

Para navegador real:

```powershell
npx playwright install chromium
npm.cmd run test:browser
npm.cmd run test:a11y
```

## Estrutura principal

```text
.github/
admin/
assets/
css/
data/
dev/
docs/
js/
menu/
order/
products/
schemas/
templates/
tests/
tools/
index.html
service-worker.js
manifest.webmanifest
```

`dev/ui-preview.html` é uma superfície interna de QA, fora do sitemap e da navegação comercial.

## Documentação e rastreabilidade

- [Arquitetura](docs/ARCHITECTURE.md)
- [Release 3.4.0](docs/RELEASE-3.4.0.md)
- [Evidência consolidada](docs/releases/evidence/v3.4.0/summary.md)
- [Segurança](SECURITY.md)
- [Contribuição](CONTRIBUTING.md)
- [Changelog](CHANGELOG.md)

Alguns módulos mantêm nomes históricos `v4.x`. Esses identificadores representam linhagem técnica e foram preservados para compatibilidade e auditoria; **não representam a versão pública atual**. A versão oficial do produto continua sendo **3.4.0**.

## Crédito

O storefront exibe por padrão:

> **Desenvolvido por KJ Productions**

O crédito vive na configuração canônica da marca e pode ser desativado em projetos white-label quando necessário.

## Licença

MIT. Consulte [LICENSE](LICENSE).
