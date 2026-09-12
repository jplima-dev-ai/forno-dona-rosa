> **Versão corrente em validação: 3.4.1 — Performance Stabilization.** A `v3.4.0` permanece a última release formal publicada até a conclusão dos gates e da medição da 3.4.1 no GitHub Pages.

# Forno Dona Rosa

[![Quality](https://github.com/jplima-dev-ai/forno-dona-rosa/actions/workflows/quality.yml/badge.svg)](https://github.com/jplima-dev-ai/forno-dona-rosa/actions/workflows/quality.yml)
[![Browser Certification](https://github.com/jplima-dev-ai/forno-dona-rosa/actions/workflows/browser-certification.yml/badge.svg)](https://github.com/jplima-dev-ai/forno-dona-rosa/actions/workflows/browser-certification.yml)

**Plataforma web premium, acessível, mobile-first, static-first e white-label para pizzarias de pequeno e médio porte.**

[Release 3.4.0](https://github.com/jplima-dev-ai/forno-dona-rosa/releases/tag/v3.4.0) · [Evidência 3.4.1](docs/releases/evidence/v3.4.1/summary.md) · [Documentação](docs/README.md) · [Changelog](CHANGELOG.md) · [Segurança](SECURITY.md) · [Admin Studio](docs/admin/ADMIN-STUDIO.md)

O Forno Dona Rosa combina catálogo orientado a dados, páginas de produto, variantes Média/Grande/Família, configurador acessível, Sacola persistente, checkout, entrega ou retirada, agendamento, Pix ou dinheiro, busca global, PWA, Rosa Order Concierge, arquitetura white-label, Admin Studio e quality gates automatizados.

A interface pública e a documentação são escritas em **português brasileiro**. Nomes técnicos de arquivos, módulos, scripts e checkers permanecem em inglês quando isso melhora manutenção e rastreabilidade.

## Estado da 3.4.1

A 3.4.1 é uma atualização de estabilização de performance mobile. Ela não amplia a superfície funcional do produto; preserva os fluxos já validados e trabalha sobre gargalos medidos na versão publicada.

Baseline publicada da 3.4.0 em 12 de setembro de 2026:

- Lighthouse mobile: **Performance 70, LCP 3,31 s, CLS 0,282**;
- Lighthouse desktop: **Performance 96, LCP 0,88 s, CLS 0,091**;
- causa comprovada do CLS mobile: troca tardia das webfonts Manrope, Fraunces e Space Mono;
- LCP mobile observado: bloco `experience-router__grid`, com atraso de renderização relevante.

Mudanças da 3.4.1 em validação:

- remoção de Google Fonts do caminho crítico e uso de stacks tipográficas locais estáveis;
- correção da geometria intrínseca da imagem principal;
- bundle CSS único da home preservando a ordem da cascata;
- hidratação do runtime após o primeiro paint, preservando a ordem dos scripts;
- cache, manifesto e metadados alinhados com 3.4.1;
- gates de Quality, Browser Certification e Lighthouse executados antes da publicação.

A evidência final da 3.4.1 só será declarada PASS após os checks obrigatórios e o reteste da URL efetivamente publicada no GitHub Pages.

## Evidência de acessibilidade preservada

- Windows Playwright aceito como baseline: **403 passed, 0 failed, 17 skipped (8.4m)**;
- matriz: desktop, 320 px, 390 px, 430 px, tablet e landscape;
- Axe serious/critical: PASS na matriz automatizada executada;
- reflow, rotas, checkout, Sacola, Rosa, Admin e fluxos críticos de comércio: PASS;
- **NVDA no Windows: teste manual PASS**;
- **TalkBack no Android: teste manual PASS**;
- **JAWS, Narrator e VoiceOver: não testados**, pois o responsável pelo projeto não possui acesso aos ambientes/dispositivos necessários para validá-los com evidência real.

Automação não substitui validação humana com tecnologia assistiva. O projeto registra como aprovados apenas os leitores de tela realmente testados: **NVDA no Windows** e **TalkBack no Android**. Outros leitores permanecem explicitamente sem claim de aprovação.

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

### Evidência manual com leitores de tela

- **NVDA no Windows:** testado manualmente e aprovado pelo responsável pelo projeto.
- **TalkBack no Android:** testado manualmente e aprovado pelo responsável pelo projeto.
- **JAWS:** não testado por falta de acesso ao leitor/ambiente necessário.
- **Narrator:** não testado nesta evidência.
- **VoiceOver:** não testado por falta de acesso ao ecossistema/dispositivo necessário.

A ausência de teste em outros leitores de tela não é tratada como falha nem como aprovação. O projeto evita declarar compatibilidade certificada sem execução real.

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
npm.cmd run release:3.4.1
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

Eles **não representam a versão pública atual**. A versão corrente da linha em validação, do `package.json`, dos metadados e da documentação de desenvolvimento é **3.4.1**. A tag formal `v3.4.0` permanece imutável como release anterior até que a 3.4.1 conclua seu processo de publicação.

## Qualidade e evidências

A 3.4.1 preserva a evidência automatizada e manual aceita da 3.4.0 e adiciona evidência específica de performance em:

- `docs/releases/evidence/v3.4.1/summary.md`;
- `docs/RELEASE-3.4.0.md` como registro da release anterior;
- `docs/releases/evidence/v3.4.0/summary.md` como baseline histórica;
- GitHub Actions;
- GitHub Release `v3.4.0` até a publicação formal da nova release.

Os gates distinguem claramente:

- executado e aprovado;
- configurado, mas não executado;
- bloqueado pelo ambiente;
- não testado por falta de acesso.

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
