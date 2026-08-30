# Política de Segurança

## Escopo

Forno Dona Rosa é um storefront e Admin Studio static-first. A versão atual não possui autenticação remota, processador de pagamentos, banco privado ou persistência server-side de pedidos. O pedido é revisado no navegador e entregue ao WhatsApp somente após ação explícita do cliente.

## Modelo de confiança

Dados provenientes de `localStorage`, `sessionStorage`, imports administrativos, CEP, query strings e conteúdo configurável são tratados como **não confiáveis** até serem normalizados e validados.

As fontes canônicas de preço, produto e configuração continuam sendo os arquivos de dados do projeto ou, futuramente, um repositório/API autenticado que implemente os mesmos contratos.

## Controles defensivos implementados

- Content Security Policy nas páginas públicas e administrativas.
- Renderização de dados editáveis com APIs seguras de DOM/texto; sinks HTML inseguros são proibidos nos runtimes críticos.
- IDs persistidos são reconciliados com o catálogo atual.
- Preços são recalculados a partir do catálogo canônico.
- Quantidades, textos, URLs e volumes de import são limitados.
- Links externos com `target="_blank"` usam `noopener noreferrer`.
- URL configurável de crédito aceita somente HTTPS.
- WhatsApp usa destino controlado e mensagem codificada; nada é enviado automaticamente.
- Nome/endereço do checkout permanecem em sessão por padrão; persistência exige opt-in explícito.
- Consulta de CEP envia somente o CEP para provedores HTTPS allowlisted (ViaCEP e fallback BrasilAPI).
- Cidade/UF retornadas por provedor são normalizadas e validadas contra a área configurada antes do handoff.
- Falha de consulta mantém fallback manual identificado como dependente de confirmação da pizzaria.
- Service Worker restringe runtime cache a same-origin, limita crescimento e exclui `/admin/` e `/dev/` de sua fronteira pública de cache.
- Imports do Admin Studio aceitam JSON limitado e passam por validação estrutural antes de substituir o rascunho.
- Rascunhos locais corrompidos ou excessivos são descartados com recuperação segura.
- `tools/apply-admin-bundle.py` aplica limites, backup, escrita atômica, validação pós-escrita e rollback.

## Fronteira administrativa

O Admin Studio atual é local-first. Ele **não autentica um proprietário nem publica remotamente**. Qualquer implantação que permita escrita remota precisa adicionar, no servidor:

- autenticação;
- autorização por função/escopo;
- validação equivalente ou superior à do cliente;
- proteção de segredos;
- rate limiting quando aplicável;
- trilha de auditoria;
- backup/rollback;
- controles de upload de mídia;
- políticas de sessão e recuperação de conta.

Nunca coloque tokens administrativos, senhas ou chaves privadas no JavaScript público.

## Service Worker e offline

O Service Worker é uma fronteira de disponibilidade, não de autorização. Conteúdo público pode ser cacheado conforme política; superfícies administrativas e de desenvolvimento não são tratadas como assets públicos offline.

Mudanças de versão devem invalidar caches obsoletos sem fazer uma rota interna contaminar outra rota.

## Testes de segurança

Comandos principais:

```powershell
npm.cmd run security
npm.cmd run quality
```

A suíte atual inclui checks estáticos e testes comportamentais para imports inválidos, storage corrompido, limites de bundle, URL insegura de crédito, service worker e invariantes de DOM/configuração.

Isso **não equivale a pentest profissional**. Uma implantação comercial com backend, autenticação, pagamentos ou dados privados deve passar por revisão de segurança específica para a infraestrutura adotada.

## Divulgação responsável

Ao encontrar uma falha neste repositório de portfólio, não publique tokens, dados pessoais ou payloads sensíveis em issue pública. Para uma implantação real, use um canal privado de divulgação definido pelo operador.

## Privacidade do checkout

A versão static-first não envia dados pessoais para servidor próprio. Nome e endereço permanecem no navegador até o cliente abrir o WhatsApp. Provedores externos de CEP possuem seus próprios termos e políticas e devem ser revisados antes de uma implantação comercial real.

## Evidência

Claims de segurança devem corresponder a testes executados. “Gate configurado”, “teste bloqueado pelo ambiente” e “pentest não executado” não podem ser transformados em “PASS”.

## Editorial e newsletter

Artigos são conteúdo público gerado de `data/articles.json` e passam por escaping no build. Slugs, categorias e número de seções são validados antes da aplicação de bundles administrativos.

A newsletter permanece desativada por padrão. Quando ativada, o endpoint precisa usar HTTPS e o CSP da página recebe somente a origem configurada. `js/newsletter.js` não persiste e-mail em `localStorage` ou `sessionStorage`.

A presença de um formulário de newsletter não transforma GitHub Pages em backend. Consentimento, retenção, opt-out e política de privacidade dependem do provedor real escolhido e devem ser revisados antes de ativar a integração em produção.
