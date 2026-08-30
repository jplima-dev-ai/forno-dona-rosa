# Admin Studio — guia operacional

O Admin Studio v3.7.9 foi desenhado para empreendedores que precisam atualizar o site sem editar HTML, CSS, JavaScript ou JSON manualmente.

## Modo simples

É o modo padrão. Ele concentra marca, contato, operação, horários, produtos, disponibilidade, textos, molhos, preview e backup. Opções técnicas menos frequentes ficam ocultas visualmente.

## Modo avançado

Revela configurações como namespace, categoria técnica do produto, selo e rótulo editorial. Nenhum dado é apagado ao alternar entre os modos.

## Buscar ação

Use **Buscar ação** e digite termos como `preço`, `sábado`, `WhatsApp`, `Pix`, `molho`, `backup` ou `preview`. O painel leva o foco à área correspondente.

## Histórico e desfazer

O histórico desta sessão registra alterações locais enquanto o painel permanece aberto. **Desfazer última alteração** restaura o snapshot anterior. Esse histórico não substitui o backup exportado.

## Preview

O preview resume o rascunho atual antes da exportação: marca, Hero, produtos, formas de recebimento, pagamento e crédito do desenvolvedor. Ele não publica nada e não substitui o teste do site completo.

## Crédito KJ Productions

Por padrão, o storefront apresenta **Desenvolvido por KJ Productions** no rodapé. O painel permite desligar o crédito em um projeto white-label sem modificar HTML.

## Rascunho e exportação

O rascunho fica no navegador. **Exportar alterações** gera um bundle JSON validado. Para aplicar no repositório:

```powershell
python tools/apply-admin-bundle.py .\forno-admin-bundle-2026-08-28.json
```

Depois execute:

```powershell
npm.cmd run quality
```

## Limite desta versão

Não existe autenticação server-side nem publicação automática no GitHub Pages. O contrato `js/admin-persistence.js` deixa essa fronteira explícita para uma futura API autenticada.

## Acessibilidade

O painel usa controles HTML nativos, labels, headings, skip link, foco visível, mensagens de estado, reflow, forced colors e reduced motion. A automação não substitui testes manuais com tecnologias assistivas.
