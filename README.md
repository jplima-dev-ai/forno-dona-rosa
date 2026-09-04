# Forno Dona Rosa

**Plataforma web premium, acessível, mobile-first e static-first para pizzarias de pequeno e médio porte.**

[Documentação](docs/README.md) · [Changelog](CHANGELOG.md) · [Segurança](SECURITY.md) · [Admin Studio](docs/admin/ADMIN-STUDIO.md)

O Forno Dona Rosa evoluiu de uma landing page para um produto front-end completo: site multipágina, catálogo orientado por dados, páginas individuais de produto, Sacola persistente, checkout acessível, entrega ou retirada, agendamento, Pix ou dinheiro, molhos opcionais, busca global, Rosa como anfitriã digital, PWA, arquitetura white-label, Admin Studio e quality gates executáveis.

A interface pública e a documentação são escritas em **português brasileiro**. Nomes técnicos de arquivos, pastas, módulos, scripts, assets e identificadores permanecem em **inglês**.

## Versão atual

**v4.0.9 — Commerce Experience Intelligence + Visual Desire System**

A linha 3.9 adiciona uma camada editorial completa: hub de artigos, páginas individuais, categorias, SEO estruturado, busca integrada, gestão editorial no Admin Studio e abstração de newsletter compatível com a arquitetura static-first. A newsletter permanece desligada até existir um provedor HTTPS real; o site não finge coleta de e-mails sem backend ou serviço externo.

### Editorial, mídia e audiência

O Admin Studio agora permite preparar imagens de produto, ajustar ponto focal, editar conteúdo institucional, administrar avaliações reais, criar artigos estruturados e configurar SEO/social preview. Para GitHub Pages, dados e mídia continuam exportáveis em pacotes validados. O pipeline também aplica um polish gastronômico conservador às imagens-fonte existentes e regenera derivados responsivos sem afirmar que fotos duplicadas se tornaram sessões fotográficas únicas.

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

## Arquitetura em uma frase

O storefront é gerado estaticamente a partir de dados canônicos, enquanto Sacola, checkout, Rosa, disponibilidade, status comercial e Admin Studio compartilham contratos de domínio no navegador.

```text
data/catalog.json
        ↓
tools/build-site.py
        ↓
Home + páginas institucionais + menu + order + products/<id>/ + articles/<slug>/ + categories/<id>/
```

Principais fontes da verdade:

- `data/brand/brand.json` — identidade, contatos, operação e recursos da marca;
- `data/brand/content.json` — copy configurável;
- `data/catalog.json` — produtos, preços, imagens e capacidades;
- `data/reviews.json` — avaliações reais quando disponíveis;
- `data/articles.json` — artigos, categorias, tags, publicação e SEO editorial;
- `data/newsletter.json` — contrato de newsletter e provedor, desativado por padrão;
- `data/commerce-config.js` — contrato comercial derivado para o runtime.

Veja [Arquitetura](docs/ARCHITECTURE.md) para os limites completos.

## Admin Studio

A rota técnica `/admin/` permite editar dados operacionais sem alterar código. O painel possui modo Simples/Avançado, busca por ação, histórico com desfazer, preview, onboarding, import/export de bundle e validações de segurança.

A publicação remota automática **não é simulada**: GitHub Pages não é backend autenticado. O fluxo atual continua local-first e pode evoluir para uma API real sem reescrever a experiência administrativa.

## Crédito

O storefront exibe por padrão:

> **Desenvolvido por KJ Productions**

O crédito vive na configuração canônica da marca e pode ser desativado em projetos white-label quando necessário.

## Acessibilidade

A arquitetura considera desde a origem:

- HTML semântico, landmarks e headings coerentes;
- navegação por teclado e foco visível;
- dialogs nativos e retorno de foco;
- labels, `fieldset`/`legend` e mensagens de erro associadas;
- `aria-live` apenas para mudanças relevantes;
- zoom/reflow e conteúdo longo;
- `prefers-reduced-motion`;
- forced colors;
- touch targets adequados;
- uma única árvore DOM sem duplicação mobile/desktop.

Automação não equivale a teste humano. NVDA, JAWS, Narrator, TalkBack, VoiceOver e dispositivos físicos só podem ser marcados como aprovados quando realmente executados e registrados.

## Qualidade e testes

Requisitos de referência:

```text
Node.js >= 20
Python >= 3.11
```

No Windows/PowerShell, o comando mais compatível é:

```powershell
npm.cmd run quality
```

O quality gate executa build, sintaxe, configuração, brand leak, naming, audit, health/regression, comportamento de Rosa/checkout, Template Factory, documentação, conversão, comércio, responsividade, arquitetura multipágina, experiência de produto, Smart Commerce, Real Storefront, Admin Studio, segurança, Browser Certification estrutural, Mobile Usability e Project Doctor.

Para navegador real, após instalar as dependências de desenvolvimento:

```powershell
npm.cmd run test:browser
npm.cmd run test:a11y
```

Consulte [Testes e quality gates](docs/quality/TESTING.md) e [Browser Testing](docs/testing/BROWSER-TESTING.md).

**Última validação real de browser (2026-09-04): 249 passed, 3 skipped, 0 failed em Playwright/Chromium no Windows.** O gate Axe serious/critical passou na matriz executada. NVDA humano e Core Web Vitals publicados continuam separados da automação.

## Comandos úteis

```powershell
npm.cmd run build
npm.cmd run check:js
npm.cmd run audit
npm.cmd run docs
npm.cmd run doctor
npm.cmd run security
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

A implementação de referência é Dona Rosa, mas os contratos de marca, catálogo, comércio e conteúdo foram separados para reutilização. Veja:

- [White-label](docs/WHITE-LABEL.md);
- [Configuração](docs/customization/CONFIGURATION.md);
- [Criar um cliente](docs/customization/CREATE-A-CLIENT.md).

## Evidência e limites

Os gates automatizados comprovam apenas aquilo que executam. A versão 3.7 mantém um ledger em `docs/releases/evidence/v3.7.9/summary.md` para distinguir claramente:

- executado e aprovado;
- configurado, mas não executado;
- bloqueado pelo ambiente;
- ainda não testado.

Essa distinção é parte do contrato de qualidade do projeto.

## Licença

Consulte [LICENSE](LICENSE).
