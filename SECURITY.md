# Security Policy

## Versão suportada

A linha atualmente mantida deste projeto de portfólio é a **v1.2.x**.

## Modelo de segurança

Este é um front-end estático hospedável no GitHub Pages. Não existe autenticação, banco de dados, painel administrativo ou processamento de pagamento neste repositório. O pedido é montado localmente e enviado ao WhatsApp somente quando o visitante aciona o botão correspondente.

### Controles aplicados na v1.2.9

- conteúdo digitado pelo usuário nunca é reinserido na interface por `innerHTML`;
- estado recuperado de `localStorage` é tratado como entrada não confiável, validado e normalizado;
- nomes, preços e totais do carrinho são reconstruídos a partir do catálogo canônico;
- quantidade por item é limitada a 10 e o carrinho demonstrativo a 50 linhas;
- parâmetros de deep link são aceitos apenas quando correspondem a IDs existentes no catálogo;
- links externos que abrem nova aba usam `noopener noreferrer`;
- Content Security Policy via `<meta http-equiv>` restringe scripts, objetos, frames, fontes e imagens;
- o service worker ignora requisições cross-origin e não responde falhas de assets JavaScript/CSS com HTML;
- somente respostas same-origin, `200 OK` e do tipo `basic` entram no cache dinâmico.

## Limitação do GitHub Pages

GitHub Pages não permite configurar livremente todos os cabeçalhos HTTP de segurança por repositório. A CSP desta versão usa meta tag, que oferece proteção útil, mas **não substitui** cabeçalhos HTTP como `Content-Security-Policy`, `Permissions-Policy` e `X-Content-Type-Options`. Em uma implantação comercial, prefira uma hospedagem/CDN que permita definir esses headers no servidor.

## Dados pessoais

O carrinho e favoritos ficam em `localStorage` do próprio navegador. Não coloque informações sensíveis nas observações do pedido. O site não envia esses dados a servidores próprios.

## Relato de vulnerabilidade

Como este é um projeto de portfólio, reporte problemas pelo repositório GitHub sem publicar credenciais, tokens ou dados pessoais de terceiros.
