# Contribuindo com o Forno Dona Rosa

Obrigado pelo interesse em contribuir.

A versão pública corrente é **3.4.0**. Nomes técnicos históricos contendo `v4.x` podem permanecer por compatibilidade e rastreabilidade, mas não devem ser interpretados como versão pública atual.

## Princípios obrigatórios

Toda contribuição deve preservar:

- acessibilidade por padrão;
- navegação por teclado;
- semântica HTML correta;
- foco visível e previsível;
- responsividade a partir de 320 px;
- `prefers-reduced-motion` e forced colors;
- arquitetura static-first/local-first;
- fonte única de verdade para catálogo e comércio;
- checkout com revisão antes do WhatsApp;
- ausência de envio automático de pedidos;
- rastreabilidade de versão e evidências de teste.

## Ambiente

Requisitos:

```text
Node.js >= 20
Python >= 3.11
```

No Windows/PowerShell:

```powershell
npm.cmd install
python -m pip install -r requirements-dev.txt
npx playwright install chromium
npm.cmd run build
npm.cmd run quality
```

## Antes de abrir um Pull Request

Execute, no mínimo:

```powershell
npm.cmd run quality
npm.cmd run test:browser
npm.cmd run test:a11y
```

Se a mudança afetar acessibilidade assistiva, descreva claramente quais testes manuais foram ou não foram executados. Não declare NVDA, JAWS, Narrator, TalkBack ou VoiceOver como aprovados sem teste humano real.

## Commits

Prefira mensagens curtas e descritivas, por exemplo:

```text
fix(checkout): restore focus after closing dialog
feat(admin): validate variant availability
docs(repo): clarify 3.4.0 release status
```

## Pull Requests

Explique:

1. o problema;
2. a causa raiz;
3. a solução;
4. os riscos;
5. os testes executados;
6. qualquer validação manual ainda pendente.

Mudanças que alterem a versão pública exigem decisão explícita do responsável pelo projeto. Não incremente a versão além de **3.4.0** por conta própria.

## Segurança

Vulnerabilidades não devem ser abertas como issue pública. Siga `SECURITY.md`.
