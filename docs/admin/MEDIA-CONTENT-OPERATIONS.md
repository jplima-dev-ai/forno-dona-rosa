# Operações de mídia e conteúdo

A v3.8.9 amplia o Admin Studio para que um operador não técnico possa administrar imagens, textos, avaliações e apresentação em mecanismos de busca sem editar código.

## Mídia

O Admin aceita JPEG, PNG ou WebP de até 10 MB, exige dimensões mínimas e gera um preview WebP antes da exportação. O ponto focal é configurável por sliders e botões de direção, todos acessíveis por teclado.

O navegador não publica a imagem diretamente no GitHub Pages. Ele exporta um `forno-media-content-package-YYYY-MM-DD.json`. No repositório, execute:

```powershell
python tools/apply-media-content-package.py .\forno-media-content-package-YYYY-MM-DD.json
npm.cmd run quality
```

O aplicador valida base64, tipo real da imagem com Pillow, dimensões, produto de destino e caminho canônico. Em seguida cria backup, converte a fonte para WebP, atualiza o ponto focal, gera variantes AVIF/WebP e reconstrói o site.

## Avaliações

Só avaliações reais e autorizadas devem ser cadastradas. Uma avaliação marcada como ativa sem `authorized: true` é rejeitada pelo Admin Core e pelo aplicador. O storefront também filtra conteúdo sem autorização.

## SEO

O operador edita título e descrição em linguagem comum e recebe um preview aproximado. A estrutura do HTML continua sob responsabilidade do build, evitando que conteúdo administrativo quebre a interface.

## Limites

- GitHub Pages continua sem escrita remota.
- Crop destrutivo não é aplicado no navegador; a v3.8 usa ponto focal para preservar o enquadramento em contextos responsivos.
- O pacote de mídia tem limite de 25 MB e cada imagem decodificada, 8 MB.
- A geração final de AVIF/WebP ocorre no projeto com Pillow.
