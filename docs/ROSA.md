# Rosa — anfitriã digital local

## Propósito

Rosa é a camada conversacional local do Forno Dona Rosa. Ela ajuda a descobrir, comparar e adicionar produtos, entender a Sacola e chegar ao checkout sem fingir ser um serviço remoto de IA generativa.

## Princípios

- local-first e orientada à privacidade;
- respostas curtas e úteis;
- nenhum fato comercial inventado;
- ações destrutivas exigem confirmação;
- produto ambíguo não altera Sacola sem desambiguação;
- recomendações são explicáveis por dados do catálogo e preferências temporárias.

## Sessão

A sessão usa `sessionStorage` com schema limitado e sanitizado. Pode conter:

- mensagens recentes;
- preferências temporárias;
- produtos referenciados recentemente;
- uma confirmação destrutiva pendente.

Nenhum perfil conversacional permanente é criado.

## Resolução de intenção

Pipeline simplificado:

1. normalizar/limitar entrada;
2. reconhecer produtos e aliases;
3. extrair preferências temporárias;
4. resolver intenção;
5. usar contexto recente para ordinais/referências;
6. pedir desambiguação quando necessário;
7. executar apenas ações validadas pela aplicação.

## Recomendações

Usam características canônicas como intensidade, queijo, vegetariana, vegana, picante e doce. O conjunto é pequeno e pode explicar por que foi sugerido.

## Contexto operacional

Rosa pode reutilizar status comercial, disponibilidade e Sacola atual, mas não substitui a fonte canônica nem o checkout.

## Acessibilidade

- `<dialog>` nativo;
- textarea/botões reais;
- retorno de foco ao invocador visível;
- conversa com `role="log"`;
- status separado para a resposta mais recente;
- quick actions por teclado;
- forced colors;
- full-screen/reflow no mobile.

## Regressão

```powershell
node tools/rosa-behavior-check.js
```

A suíte cobre preferências, comparação, ambiguidade, resolução exata, intenção destrutiva e detalhes. Ela não substitui NVDA/dispositivo real.

## Contexto editorial

Na 3.9, a Rosa reconhece perguntas sobre artigos, forno, fermentação e curiosidades. Ela pode informar que existe uma leitura relacionada, mas não abre páginas automaticamente nem substitui a busca global. O índice editorial é gerado estaticamente em `data/articles-index.js`.
