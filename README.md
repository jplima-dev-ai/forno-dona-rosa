> **Versão corrente: 3.4.0 — Stabilization Release.** Esta é a versão publicada e suportada até nova ordem explícita.

# Forno Dona Rosa

[![Quality](https://github.com/jplima-dev-ai/forno-dona-rosa/actions/workflows/quality.yml/badge.svg)](https://github.com/jplima-dev-ai/forno-dona-rosa/actions/workflows/quality.yml)
[![Browser Certification](https://github.com/jplima-dev-ai/forno-dona-rosa/actions/workflows/browser-certification.yml/badge.svg)](https://github.com/jplima-dev-ai/forno-dona-rosa/actions/workflows/browser-certification.yml)

**Plataforma web premium, acessível, mobile-first, static-first e white-label para pizzarias de pequeno e médio porte.**

[Release 3.4.0](https://github.com/jplima-dev-ai/forno-dona-rosa/releases/tag/v3.4.0) · [Documentação](docs/README.md) · [Changelog](CHANGELOG.md) · [Segurança](SECURITY.md) · [Admin Studio](docs/admin/ADMIN-STUDIO.md)

O Forno Dona Rosa combina catálogo orientado a dados, páginas de produto, variantes Média/Grande/Família, configurador acessível, Sacola persistente, checkout, entrega ou retirada, agendamento, Pix ou dinheiro, busca global, PWA, Rosa Order Concierge, arquitetura white-label, Admin Studio e quality gates automatizados.

A interface pública e a documentação são escritas em **português brasileiro**. Nomes técnicos de arquivos, módulos, scripts e checkers permanecem em inglês quando isso melhora manutenção e rastreabilidade.

## Estado oficial da 3.4.0

A release 3.4.0 é a linha atual e oficial do produto.

Evidência consolidada:

- Windows Playwright: **403 passed, 0 failed, 17 skipped (8.4m)**;
- matriz: desktop, 320 px, 390 px, 430 px, tablet e landscape;
- Axe serious/critical: PASS na matriz automatizada executada;
- reflow, rotas, checkout, Sacola, Rosa, Admin e fluxos críticos de comércio: PASS;
- GitHub Actions `Quality`: PASS;
- GitHub Actions `Browser Certification`: PASS;
- GitHub Pages build/deployment: PASS;
- NVDA manual: **MANUAL_REQUIRED**;
- Core Web Vitals em ambiente publicado: medição pendente.

Automação não substitui validação humana com tecnologia assistiva. O projeto não declara certificação NVDA enquanto o teste manual não estiver registrado.

## Funcionalidades principais

- catálogo configurável e páginas de produto;
- variantes explícitas de pizza: Média, Grande e Família;
- configurador progressivo com revisão antes da Sacola;
- Smart Portion para estimativa de porções;
- Mesa da Dona Rosa para pedidos em grupo;
- Smart Pairing para sugestões contextuais;
- Intelligent Bag para edição de tamanho, borda, quantidade, observações e remoção;
- Rosa Order Concierge conectada ao estado real do pedido;
- checkout com entrega ou retirada, agendamento, Pix ou dinheiro;
- busca global;
- PWA e service worker;
- Admin Studio local-first;
- arquitetura white-label;
- pipeline de mídia e geração estática;
- quality gates estruturais, comportamentais, de segurança, responsividade e acessibilidade.

## Jornada principal

```text
Home
→ Cardápio
→ Produto
→ Sacola
→ Entrega ou Retirada
→ Agora ou Agendamento
→ Pix ou Dinheiro
→ Molhos opcionais
→ Revisão
→ WhatsApp controlado pelo cliente
```

Nada é enviado automaticamente.

## Arquitetura

O storefront é gerado estaticamente a partir de dados canônicos. Sacola, checkout, Rosa, disponibilidade, status comercial e Admin Studio compartilham contratos de domínio no navegador.

```text
data/catalog.json
        ↓
tools/build-site.py
        ↓
Home + páginas institucionais + menu + order + products/<id>/ + articles/<slug>/ + categories/<id>/
```

Principais fontes de verdade:

- `data/brand/brand.json` — identidade, contatos, operação e recursos da marca;
- `data/brand/content.json` — copy configurável;
- `data/catalog.json` — produtos, preços, imagens e capacidades;
- `data/reviews.json` — avaliações reais quando disponíveis;
- `data/articles.json` — artigos, categorias, tags, publicação e SEO editorial;
- `data/newsletter.json` — contrato de newsletter, desativado por padrão;
- `data/commerce-config.js` — contrato comercial derivado para o runtime.

Veja [Arquitetura](docs/ARCHITECTURE.md) para os limites completos.

## Admin Studio

A rota técnica `/admin/` permite editar dados operacionais sem alterar código. O painel possui modo Simples/Avançado, busca por ação, histórico com desfazer, preview, onboarding, import/export de bundle e validações de segurança.

A publicação remota automática não é simulada: GitHub Pages não é backend autenticado. O fluxo atual permanece local-first.

## Acessibilidade

A arquitetura considera desde a origem:

- HTML semântico, landmarks e headings coerentes;
- navegação por teclado e foco visível;
- dialogs nativos e retorno de foco;
- labels, `fieldset`/`legend` e mensagens de erro associadas;
- `aria-live` somente para mudanças relevantes;
- zoom/reflow e conteúdo longo;
- `prefers-reduced-motion`;
- forced colors;
- touch targets adequados;
- uma única árvore DOM sem duplicação mobile/desktop.

NVDA, JAWS, Narrator, TalkBack, VoiceOver e dispositivos físicos só podem ser marcados como aprovados quando realmente executados e registrados.

## Requisitos

```text
Node.js >= 20
Python >= 3.11
```

## Executar localmente no Windows

Na raiz do projeto:

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

## Comandos úteis

```powershell
npm.cmd run build
npm.cmd run check:js
npm.cmd run audit
npm.cmd run docs
npm.cmd run doctor
npm.cmd run security
npm.cmd run browser:gate
npm.cmd run release:3.4.0
npm.cmd run quality
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

## White-label

A implementação de referência é Dona Rosa, mas os contratos de marca, catálogo, comércio e conteúdo foram separados para reutilização.

- [White-label](docs/WHITE-LABEL.md)
- [Configuração](docs/customization/CONFIGURATION.md)
- [Criar um cliente](docs/customization/CREATE-A-CLIENT.md)

## Proveniência dos nomes `v4.x`

Alguns arquivos, módulos e checkers mantêm nomes históricos como `variant-commerce-v4-1.js`, `rosa-order-concierge-v4-1-6.js` e `release-v4-1-9-check.py`. Esses identificadores representam a **linhagem técnica de desenvolvimento** e foram preservados para compatibilidade, auditoria e rastreabilidade.

Eles **não representam a versão pública atual**. A versão corrente do produto, do `package.json`, dos metadados, da release e da documentação oficial é **3.4.0**.

## Qualidade e evidências

A release 3.4.0 possui evidência automatizada de browser e CI registrada em:

- `docs/RELEASE-3.4.0.md`;
- `docs/releases/evidence/v3.4.0/summary.md`;
- GitHub Actions;
- GitHub Release `v3.4.0`.

Os gates distinguem claramente:

- executado e aprovado;
- configurado, mas não executado;
- bloqueado pelo ambiente;
- validação manual ainda necessária.

## Segurança

Consulte [SECURITY.md](SECURITY.md) para política de reporte e limites de segurança.

## Contribuição

Contribuições devem preservar acessibilidade, estabilidade, rastreabilidade de versão e o comportamento local-first do projeto. Consulte [CONTRIBUTING.md](CONTRIBUTING.md) e o [Código de Conduta](CODE_OF_CONDUCT.md).

## Licença

MIT. Consulte [LICENSE](LICENSE).

## Crédito

O storefront exibe por padrão:

> **Desenvolvido por KJ Productions**

O crédito vive na configuração canônica da marca e pode ser desativado em projetos white-label quando necessário.
