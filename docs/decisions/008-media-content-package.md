# ADR 008 — Pacote portátil de mídia e conteúdo

## Contexto

O Admin Studio precisa permitir que uma pizzaria leiga altere imagens e conteúdo, mas GitHub Pages não fornece backend de escrita.

## Decisão

O navegador prepara a mídia, valida a experiência e exporta um pacote JSON portátil contendo configuração validada e imagens WebP codificadas em base64. Um aplicador Python, executado no ambiente do projeto, valida novamente e realiza escrita com backup/rollback.

## Consequências

- nenhuma credencial do GitHub fica no frontend;
- o operador não precisa conhecer AVIF, WebP ou `srcset`;
- a publicação ainda exige aplicar o pacote e fazer deploy;
- a mesma UX poderá trocar o aplicador local por uma API autenticada no futuro.
