(() => {
  "use strict";

  const normalize = (value) => String(value || "")
    .normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9\s-]/g, " ").replace(/\s+/g, " ").toLowerCase().trim();

  const menu = () => Array.isArray(window.FORNO_MENU) ? window.FORNO_MENU : [];
  const productMap = () => new Map(menu().map((product) => [product.id, product]));
  const money = (value) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value) || 0);
  const sizeWords = Object.freeze({ media: ["media", "média"], grande: ["grande"], familia: ["familia", "família"] });
  const ordinalWords = Object.freeze({ 0: ["primeira", "primeiro", "1a", "1ª"], 1: ["segunda", "segundo", "2a", "2ª"], 2: ["terceira", "terceiro", "3a", "3ª"] });

  function resolveSize(text) {
    const q = normalize(text);
    for (const [id, words] of Object.entries(sizeWords)) if (words.some((word) => q.includes(normalize(word)))) return id;
    return null;
  }

  function resolveBagIndex(text, items) {
    const q = normalize(text);
    const pizzas = items.map((item, index) => ({ item, index })).filter(({ item }) => item.productType !== "bebida");
    for (const [ordinal, words] of Object.entries(ordinalWords)) {
      if (words.some((word) => q.includes(normalize(word)))) return pizzas[Number(ordinal)]?.index ?? -1;
    }
    const map = productMap();
    const matches = pizzas.filter(({ item }) => {
      const product = map.get(item.pizzaId);
      return product && [product.name, ...(product.aliases || [])].some((name) => q.includes(normalize(name)));
    });
    return matches.length === 1 ? matches[0].index : -1;
  }

  function findProduct(text) {
    const q = normalize(text);
    let best = null;
    for (const product of menu()) {
      const names = [product.name, ...(product.aliases || [])];
      for (const name of names) {
        const n = normalize(name);
        if (n && q.includes(n) && (!best || n.length > best.score)) best = { product, score: n.length };
      }
    }
    return best?.product || null;
  }

  function sizeVariant(product, size) {
    if (!product || product.type === "bebida" || !size) return null;
    return window.FORNO_VARIANTS?.resolve?.(product, size) || null;
  }

  function interpret(rawText) {
    const text = normalize(rawText);
    if (!text) return null;
    const items = window.FORNO_APP?.getBagItems?.() || [];
    const size = resolveSize(text);
    const asksPrice = /quanto (fica|custa)|qual (o )?preco|preço/.test(text);
    const mutationWords = /troca|troque|muda|mude|altera|alterar|coloque|deixe/.test(text);
    const addWords = /adicione|adicionar|coloque na sacola|quero uma|quero um/.test(text);

    if (size && mutationWords && items.length) {
      const bagIndex = resolveBagIndex(text, items);
      if (bagIndex >= 0) {
        const item = items[bagIndex];
        const product = productMap().get(item.pizzaId);
        const variant = sizeVariant(product, size);
        if (!variant || variant.available === false) {
          return { handled: true, intent: "concierge-size-unavailable", text: `${product?.name || "Essa pizza"} não tem o tamanho solicitado disponível agora.` };
        }
        if (item.size === size) {
          return { handled: true, intent: "concierge-noop", text: `${product.name} já está no tamanho ${variant.label}.` };
        }
        const currentVariant = sizeVariant(product, item.size);
        return {
          handled: true,
          intent: "concierge-confirm-edit",
          text: `Posso trocar ${product.name} de ${currentVariant?.label || item.size} para ${variant.label}. O valor unitário passa de ${money(item.unitPrice)} para ${money(variant.price + Number(window.FORNO_PRICING?.crusts?.[item.crust]?.add || 0))}. Você confirma? Responda “sim” ou “não”.`,
          pendingAction: { type: "concierge-update-size", itemId: item.id, productId: product.id, size, label: variant.label },
          productIds: [product.id],
        };
      }
      return { handled: true, intent: "concierge-ambiguous-bag-item", text: "Encontrei mais de uma possibilidade na sacola. Diga qual pizza ou use “primeira”, “segunda” ou “terceira pizza”." };
    }

    const product = findProduct(text);
    if (product && size && asksPrice && product.type !== "bebida") {
      const variant = sizeVariant(product, size);
      return variant
        ? { handled: true, intent: "concierge-price", text: `${product.name} no tamanho ${variant.label} fica em ${money(variant.price)} antes de bordas adicionais.`, productIds: [product.id] }
        : { handled: true, intent: "concierge-size-unavailable", text: `${product.name} não tem esse tamanho disponível agora.`, productIds: [product.id] };
    }

    if (product && size && addWords && product.type !== "bebida") {
      const variant = sizeVariant(product, size);
      if (!variant || variant.available === false) return { handled: true, intent: "concierge-size-unavailable", text: `${product.name} não tem esse tamanho disponível agora.`, productIds: [product.id] };
      const added = window.FORNO_APP?.addConfiguredProduct?.({ pizzaId: product.id, pizza2Id: null, size, crust: "tradicional", qty: 1, remove: "", notes: "" });
      return {
        handled: true,
        intent: "concierge-add-configured",
        text: added ? `Adicionei ${product.name} ${variant.label} à sua sacola. Você ainda pode editar tamanho, borda e observações na própria sacola.` : `Não consegui adicionar ${product.name} agora. Revise a sacola e tente novamente.`,
        productIds: [product.id],
      };
    }

    if (size && asksPrice && items.length) {
      const bagIndex = resolveBagIndex(text, items);
      if (bagIndex >= 0) {
        const item = items[bagIndex];
        const product = productMap().get(item.pizzaId);
        const variant = sizeVariant(product, size);
        if (variant) return { handled: true, intent: "concierge-price", text: `Se ${product.name} ficar no tamanho ${variant.label}, o valor unitário fica em ${money(variant.price + Number(window.FORNO_PRICING?.crusts?.[item.crust]?.add || 0))}. Não alterei sua sacola.`, productIds: [product.id] };
      }
    }

    if (/para quantas pessoas|quantas pessoas|serve quantas/.test(text) && product && size) {
      const variant = sizeVariant(product, size);
      if (variant?.serves) return { handled: true, intent: "concierge-serves", text: `${product.name} ${variant.label} está configurada nesta demonstração para servir aproximadamente ${variant.serves.min}–${variant.serves.max} pessoas. É uma estimativa; apetite e ocasião podem mudar isso.`, productIds: [product.id] };
    }

    return null;
  }

  window.FORNO_ROSA_CONCIERGE = Object.freeze({ interpret, resolveSize, findProduct, resolveBagIndex });
})();
