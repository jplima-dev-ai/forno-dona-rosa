# Forno Dona Rosa

**Experiência premium e acessível para comércio local · PWA · anfitriã conversacional local · checkout inteligente · arquitetura white-label**

[English README](README.md) · [Documentação](docs/README.md) · [Changelog](CHANGELOG.md) · [Segurança](SECURITY.md)

Forno Dona Rosa é um projeto front-end de portfólio construído em torno de uma pizzaria artesanal brasileira fictícia. O que começou como uma landing page premium evoluiu, versão após versão, para uma base reutilizável de comércio local com catálogo orientado por dados, estado defensivo no navegador, fluxo acessível de pedido, anfitriã conversacional determinística, PWA, checkout com consulta de CEP e uma fábrica de templates para novos clientes.

A experiência pública permanece em **português brasileiro**. A engenharia do repositório, os nomes técnicos e a documentação principal em inglês foram mantidos para facilitar avaliação internacional.

## Versão atual

**v2.7.9 — Compra Rápida & Confiabilidade**

A versão atual simplifica primeiro o caminho de compra. A ordem natural da página passa a ser **hero → orientação em três passos → cardápio**; os cards mostram apenas as decisões principais de compra; Sacola e checkout ganharam hierarquia mais clara; e bugs de recuperação, foco e estado de CEP encontrados durante a auditoria viraram regressões.

A Template Factory e a arquitetura white-label da 2.6 continuam intactas. A regra pública agora é explícita: **Cardápio → Sacola → endereço → WhatsApp**, enquanto Rosa, recomendador e personalizações permanecem como recursos opcionais.

## Fluxo do cliente

```text
Abrir o cardápio
       ↓
Adicionar ou personalizar um produto
       ↓
Revisar a Sacola
       ↓
Informar o mínimo necessário para entrega
       ↓
Revisar pedido e endereço
       ↓
Abrir o WhatsApp com a mensagem pronta
```

Destaques:

- cardápio mobile-first com imagens, busca, filtros e linguagem sensorial;
- tamanhos, bordas, remoções e pizza meio a meio quando aplicável;
- Sacola, favoritos e último pedido com persistência defensiva;
- **Rosa**, anfitriã local para recomendações, comparações e ajuda no pedido;
- ViaCEP com fallback BrasilAPI para preenchimento de endereço;
- validação de área de entrega configurável;
- revisão final antes do WhatsApp;
- PWA e estados offline controlados.

## Acessibilidade

Acessibilidade é requisito de produto. O projeto prioriza HTML semântico, controles nativos, foco visível, teclado, diálogos acessíveis, mensagens de erro recuperáveis, live regions disciplinadas, `prefers-reduced-motion`, forced colors e reflow/zoom.

Os testes automatizados não são apresentados como substitutos de NVDA, JAWS, Narrator, TalkBack, VoiceOver ou validação em dispositivo real. Essas ferramentas só devem aparecer como `PASS` quando forem efetivamente executadas. Consulte [docs/ACCESSIBILITY.md](docs/ACCESSIBILITY.md).

## Rosa

Rosa não depende de uma API externa de IA. Ela executa no navegador com intenções determinísticas, catálogo canônico, regras de confiança/fallback e memória curta de sessão.

Ela pode recomendar, comparar produtos, resolver ambiguidades, adicionar itens, revisar a Sacola e orientar o cliente passo a passo. Ações destrutivas exigem confirmação explícita.

## Checkout local inteligente

```text
Sacola → Cliente e entrega → Revisão → WhatsApp
```

O checkout inclui nome, CEP, endereço estruturado, fallback manual, validação de cidade/UF configurada, opção explícita para lembrar endereço no dispositivo e revisão final. Nada é enviado automaticamente.

## White-label e Template Factory

A identidade do cliente fica separada do núcleo:

```text
core
├── catálogo / Sacola / checkout / Rosa / PWA
│
cliente
├── configuração da marca
├── conteúdo
├── tema
├── assets
└── capacidades
```

Criar uma nova marca:

```powershell
python tools/create-brand.py --name "Bella Napoli" --slug bella-napoli --preset pizzeria
```

Validar:

```powershell
python tools/project-doctor.py --brand brands/bella-napoli
```

Aplicar:

```powershell
python tools/apply-brand.py bella-napoli
```

## Executar localmente

```powershell
python -m http.server 8000
```

Abra `http://localhost:8000`.

Para rodar o gate completo:

```powershell
npm run quality
```

Se o PowerShell bloquear `npm.ps1`:

```powershell
npm.cmd run quality
```

## Evolução do projeto

O histórico agora preserva **todas as microversões de 1.0.0 até 2.7.9**, sem saltar diretamente de `x.y.0` para `x.y.9`. Cada linha possui suas dez versões `x.y.0`–`x.y.9`.

| Linha | Evolução principal |
| --- | --- |
| 1.0.x | Fundação premium e fluxo local |
| 1.1.x | PWA, estado persistente e catálogo orientado por dados |
| 1.2.x | Segurança e hardening |
| 1.3.x | Direção de arte editorial e copy sensorial |
| 1.4.x | Rosa |
| 1.5.x | Sacola, catálogo expandido, busca e bebidas |
| 1.6.x | Hardening de estado, PWA, Rosa e acessibilidade |
| 1.7.x | Internacionalização técnica do repositório |
| 1.8.x | Bug sweep e regressões |
| 1.9.x | Compra mobile simplificada |
| 2.0.x | Visual commerce mobile e imagens de produtos |
| 2.1.x | Limpeza estrutural e nomes técnicos em inglês |
| 2.2.x | Product detail, retorno de cliente e offline |
| 2.3.x | Rosa multi-turn e ações seguras |
| 2.4.x | Checkout local inteligente |
| 2.5.x | White-label e configuração central |
| 2.6.x | Template Factory, Project Doctor e CI |
| 2.7.x | Compra rápida, redução de fricção, foco acessível e regressões de conversão |

Veja o histórico completo em [CHANGELOG.md](CHANGELOG.md).

## Documentação

Comece por [docs/README.md](docs/README.md). Também consulte [Arquitetura](docs/ARCHITECTURE.md), [Acessibilidade](docs/ACCESSIBILITY.md), [Checkout](docs/CHECKOUT.md), [Rosa](docs/ROSA.md), [Criação de cliente](docs/customization/CREATE-A-CLIENT.md), [Testes](docs/quality/TESTING.md) e [Troubleshooting](docs/troubleshooting/TROUBLESHOOTING.md).

## Licença

MIT. Consulte [LICENSE](LICENSE).
