# Referência de configuração

A fonte canônica principal da marca é `data/brand/brand.json`. Pacotes gerados usam a mesma estrutura em `brands/<slug>/brand.json`.

## Identidade

- `brand.name` — nome público;
- `brand.legalDisplayName` — nome usado em metadata/structured data;
- `brand.businessType` — família de preset;
- `brand.locale` — locale da interface;
- `brand.currency` — moeda;
- `brand.timezone` — timezone IANA;
- `brand.storageNamespace` — prefixo de storage isolado;
- `brand.logo.full` — logo master;
- `brand.logo.header` — logo otimizado do cabeçalho.

## Contatos e localização

WhatsApp deve conter apenas dígitos internacionais. Endereço, cidade, estado, CEP e área de entrega precisam representar fatos reais do cliente.

## Operação

A configuração cobre:

- horários regulares e especiais;
- entrega/retirada;
- agendamento;
- formas de pagamento;
- taxa/prazo quando conhecidos;
- molhos/extras;
- merchandising editorial;
- status de disponibilidade.

Não invente valores comerciais ausentes. Quando uma informação depender da operação, prefira copy explícita de confirmação.

## Recursos

Feature flags suportam capacidades como favoritos, recompra, Rosa, checkout, consulta de CEP, PWA, busca e half-and-half. A ausência de um recurso deve ser tratada também pelo runtime, não só pela apresentação.

## Crédito

`credits.enabled`, `credits.label`, `credits.name` e `credits.url` controlam o crédito do projeto. URLs externas de crédito aceitam apenas HTTPS.

## Schemas

Contratos formais:

- `schemas/brand.schema.json`;
- `schemas/content.schema.json`;
- `schemas/catalog.schema.json`.

`tools/project-doctor.py` e os quality gates verificam invariantes de alto valor mesmo sem depender de pacote externo de JSON Schema.

## Sincronização

Após alterar os dados canônicos:

```powershell
python tools/brand-sync.py
npm.cmd run quality
```

Para operadores não técnicos, prefira o Admin Studio e o fluxo de bundle validado.
