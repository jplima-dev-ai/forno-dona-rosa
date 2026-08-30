# Criar um novo cliente

## 1. Escolha um preset

Presets iniciais disponíveis:

- `pizzeria`;
- `coffee-shop`.

O preset define capacidades iniciais, não direção artística final.

## 2. Gere o pacote

```powershell
python tools/create-brand.py --name "Bella Napoli" --slug bella-napoli --preset pizzeria
```

O comando cria `brands/bella-napoli/` com configuração, conteúdo, tema e checklist de assets.

## 3. Adicione assets de marca

Use nomes técnicos em inglês. Atualize os caminhos de logo declarados na configuração.

## 4. Configure dados reais

Revise contatos, endereço, SEO, delivery, horários, recursos, copy e identidade. Veja [Configuração](CONFIGURATION.md).

Não deixe dados demonstrativos da Dona Rosa em um cliente real.

## 5. Valide o pacote

```powershell
python tools/project-doctor.py --brand brands/bella-napoli
```

## 6. Aplique ao storefront

```powershell
python tools/apply-brand.py bella-napoli
```

A operação sincroniza a configuração canônica com o site estático.

## 7. Substitua catálogo e mídia

Produtos, preços e imagens da referência são apenas demonstração. Cada cliente precisa de catálogo e assets próprios/licenciados.

## 8. Rode o gate completo

```powershell
npm.cmd run quality
```

## 9. Revise em navegador e tecnologia assistiva

No mínimo, valide fluxo por teclado, dialogs, checkout, narrow mobile, landscape, zoom/reflow e as combinações reais de tecnologia assistiva exigidas pelo cliente. Não transforme NOT TESTED em PASS.

## 10. Opção Admin Studio

Para ajustes operacionais sem editar arquivos diretamente, use `/admin/`, exporte um bundle validado e aplique com `tools/apply-admin-bundle.py`. Publicação remota exige backend/autenticação apropriados.
