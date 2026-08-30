# White-label

Forno Dona Rosa é a implementação de referência. A arquitetura separa identidade do cliente, catálogo, conteúdo, regras comerciais e runtime reutilizável para que novas pizzarias possam ser configuradas sem copiar e editar o core manualmente.

## Fontes da verdade

Edite preferencialmente:

- `data/brand/brand.json` — identidade, contatos, endereço, horários, recursos, SEO e operação;
- `data/brand/content.json` — copy configurável;
- `data/catalog.json` — produtos, preços, imagens e capacidades;
- `css/brand-theme.css` — tokens visuais específicos da marca;
- `assets/images/brand/` — logos e assets institucionais.

Depois execute:

```powershell
python tools/brand-sync.py
npm.cmd run quality
```

## Core reutilizável

O core deve continuar independente da identidade Dona Rosa:

- Sacola e reconciliação de preços;
- busca/favoritos/recompra;
- páginas de produto;
- checkout e state machine;
- abstração de CEP;
- Rosa;
- status comercial;
- PWA/Service Worker;
- Admin Studio;
- acessibilidade, responsividade e quality gates.

## Dados específicos do cliente

- nome e identidade visual;
- contatos;
- endereço/área atendida;
- horários e exceções;
- catálogo e preços;
- meios de recebimento/pagamento;
- copy e SEO;
- identidade da assistente;
- mídia dos produtos;
- crédito KJ Productions quando contratado/aplicável.

## Isolamento de storage

`brand.storageNamespace` separa Sacola, favoritos, último pedido, checkout, assistente e rascunhos entre implantações. Cada cliente deve receber um slug estável e único.

Alterar o namespace cria intencionalmente um novo espaço local de estado.

## Feature flags

A configuração pode habilitar/desabilitar capacidades sem apagar implementação. O runtime deve validar capacidade além de esconder UI por CSS.

## Admin Studio

Para operadores não técnicos, `/admin/` oferece uma camada humana sobre os mesmos dados. A exportação de bundle não é autenticação nem publicação remota; para escrita online futura, preserve os contratos de `js/admin-persistence.js` e repositories e implemente API autenticada no servidor.

## Criar outro cliente

Use `tools/create-brand.py` e consulte `docs/customization/CREATE-A-CLIENT.md`.

## Adaptação para outros nichos

O modelo atual é otimizado para food commerce local. Presets podem reaproveitar parte significativa do core, mas uma vertical com regras de catálogo/checkout diferentes deve receber um preset próprio, em vez de forçar copy sobre semântica inadequada.

## Contrato de acessibilidade

White-label não pode remover labels visíveis, foco, teclado, dialogs semânticos, reduced motion, forced colors, reflow ou mensagens de erro apenas para combinar com uma direção visual. O core acessível é parte do produto, não opcional.
