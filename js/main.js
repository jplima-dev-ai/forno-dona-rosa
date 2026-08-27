(() => {
  "use strict";

  const cfg = window.PIZZARIA_CONFIG || {};
  const rawMenu = Array.isArray(window.FORNO_MENU) ? window.FORNO_MENU : [];
  const features = window.APP_FEATURES || {};
  const storageNamespace = String(cfg.storageNamespace || "forno").replace(/[^a-z0-9-]/gi, "-").toLowerCase();
  const pricing = window.FORNO_PRICING || {};
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const MAX_QTY = 10;
  const MAX_REMOVE = 100;
  const MAX_NOTES = 180;
  const MAX_BAG_LINES = 40;
  const MAX_BAG_QTY = 80;
  const MAX_WHATSAPP_MESSAGE = 6000;
  const BAG_SCHEMA_VERSION = Number(window.FORNO_META?.bagSchemaVersion) || 3;
  const BAG_KEY = `${storageNamespace}-bag-v3`;
  const LEGACY_BAG_KEY = `${storageNamespace}-bag-v2`;
  const LEGACY_CART_KEY = `${storageNamespace}-cart`;
  const FAVORITES_KEY = `${storageNamespace}-favorites`;
  const LAST_ORDER_KEY = `${storageNamespace}-last-order-v1`;
  const LAST_ORDER_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 45;

  const money = (value) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
      Number.isFinite(value) ? value : 0,
    );

  const menu = rawMenu.filter(
    (item) =>
      item &&
      typeof item.id === "string" &&
      typeof item.name === "string" &&
      typeof item.description === "string" &&
      Number.isFinite(item.basePrice) &&
      item.basePrice >= 0,
  );
  const menuById = new Map(menu.map((item) => [item.id, item]));

  const whatsappNumber = String(cfg.whatsappNumber || "").replace(/\D/g, "");
  const whatsappReady = /^55\d{10,11}$/.test(whatsappNumber);
  const whatsappUrl = (message) =>
    whatsappReady
      ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(String(message || ""))}`
      : "#pedido";

  const clampInt = (value, min, max) => {
    const parsed = Number.parseInt(value, 10);
    if (!Number.isFinite(parsed)) return min;
    return Math.min(max, Math.max(min, parsed));
  };

  const cleanText = (value, maxLength) =>
    typeof value === "string" ? value.trim().slice(0, maxLength) : "";

  const storage = {
    get(key, fallback) {
      try {
        const value = JSON.parse(localStorage.getItem(key));
        return value ?? fallback;
      } catch {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch {
        return false;
      }
    },
  };

  const el = (tag, options = {}) => {
    const node = document.createElement(tag);
    if (options.className) node.className = options.className;
    if (options.text !== undefined) node.textContent = String(options.text);
    if (options.attrs) {
      for (const [name, value] of Object.entries(options.attrs)) {
        if (value !== null && value !== undefined) node.setAttribute(name, String(value));
      }
    }
    return node;
  };

  const empty = (node) => {
    while (node?.firstChild) node.removeChild(node.firstChild);
  };

  const sensoryLabels = Object.freeze({
    classica: "Clássica", suave: "Leve", intensa: "Intensa", queijo: "Muito queijo",
    cremosa: "Cremosa", picante: "Picante", vegetariana: "Vegetariana", vegana: "Vegana",
    doce: "Doce", autoral: "Autoral", carne: "Com carne", vegetais: "Vegetal", chocolate: "Chocolate"
  });

  const sensoryFor = (product, limit = 3) => (product?.traits || [])
    .map((trait) => sensoryLabels[trait])
    .filter(Boolean)
    .slice(0, limit);

  const smallProductImage = (src) => typeof src === "string" && src.endsWith(".webp")
    ? src.replace(/\.webp$/, "-384.webp")
    : src;

  const safeSize = (key) =>
    pricing.sizes?.[key] ? key : Object.keys(pricing.sizes || {})[0] || "media";
  const safeCrust = (key) =>
    pricing.crusts?.[key] ? key : Object.keys(pricing.crusts || {})[0] || "tradicional";

  const unitPriceFor = (productId, product2Id, sizeKey, crustKey) => {
    const product = menuById.get(productId);
    if (!product) return 0;
    if (product.type === "bebida") return Math.max(0, product.basePrice);
    const product2 = product2Id ? menuById.get(product2Id) : null;
    const size = pricing.sizes?.[safeSize(sizeKey)] || { multiplier: 1 };
    const crust = pricing.crusts?.[safeCrust(crustKey)] || { add: 0 };
    const base = product2 && product2.type === "pizza" ? Math.max(product.basePrice, product2.basePrice) : product.basePrice;
    const multiplier = Number.isFinite(size.multiplier) ? size.multiplier : 1;
    const add = Number.isFinite(crust.add) ? crust.add : 0;
    return Math.max(0, base * multiplier + add);
  };

  const normalizeCartItem = (raw) => {
    if (!raw || typeof raw !== "object") return null;
    const pizza = menuById.get(raw.pizzaId);
    if (!pizza) return null;
    const isDrink = pizza.type === "bebida";
    const candidate2 = !isDrink && raw.pizza2Id && raw.pizza2Id !== raw.pizzaId ? menuById.get(raw.pizza2Id) : null;
    const pizza2 = candidate2?.type === "pizza" ? candidate2 : null;
    const size = isDrink ? null : safeSize(raw.size);
    const crust = isDrink ? null : safeCrust(raw.crust);
    const qty = clampInt(raw.qty, 1, MAX_QTY);
    const unitPrice = unitPriceFor(pizza.id, pizza2?.id || null, size, crust);
    const storedId = cleanText(raw.id, 80);
    const id = /^[A-Za-z0-9_-]{1,80}$/.test(storedId) ? storedId : createId();

    return {
      id,
      pizzaId: pizza.id,
      pizza2Id: pizza2?.id || null,
      productType: pizza.type || "pizza",
      size,
      crust,
      qty,
      remove: cleanText(raw.remove, MAX_REMOVE),
      notes: cleanText(raw.notes, MAX_NOTES),
      unitPrice,
      total: unitPrice * qty,
    };
  };

  const createId = () =>
    globalThis.crypto?.randomUUID?.() ||
    `item-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  const storedEnvelope = storage.get(BAG_KEY, null);
  const storedV2 = storedEnvelope === null ? storage.get(LEGACY_BAG_KEY, null) : null;
  const legacyCart = storedEnvelope === null && storedV2 === null ? storage.get(LEGACY_CART_KEY, null) : null;

  function readStoredBag() {
    if (storedEnvelope && typeof storedEnvelope === "object" && !Array.isArray(storedEnvelope)) {
      const items = Array.isArray(storedEnvelope.items) ? storedEnvelope.items : [];
      return items;
    }
    if (Array.isArray(storedV2)) return storedV2;
    if (Array.isArray(legacyCart)) return legacyCart;
    return [];
  }

  function sanitizeBag(rawItems) {
    const safe = [];
    const usedIds = new Set();
    let totalQty = 0;
    for (const raw of Array.isArray(rawItems) ? rawItems : []) {
      if (safe.length >= MAX_BAG_LINES || totalQty >= MAX_BAG_QTY) break;
      const item = normalizeCartItem(raw);
      if (!item) continue;
      item.qty = Math.min(item.qty, MAX_BAG_QTY - totalQty);
      if (item.qty < 1) continue;
      if (usedIds.has(item.id)) item.id = createId();
      usedIds.add(item.id);
      item.total = item.unitPrice * item.qty;
      safe.push(item);
      totalQty += item.qty;
    }
    return safe;
  }

  let bag = sanitizeBag(readStoredBag());

  const storedFavorites = storage.get(FAVORITES_KEY, []);
  let favorites = new Set(
    Array.isArray(storedFavorites)
      ? storedFavorites.filter((id) => typeof id === "string" && menuById.has(id)).slice(0, menu.length)
      : [],
  );


  function readLastOrder() {
    const raw = storage.get(LAST_ORDER_KEY, null);
    if (!raw || typeof raw !== "object" || !Array.isArray(raw.items)) return null;
    const createdAt = Date.parse(raw.createdAt || "");
    if (!Number.isFinite(createdAt) || Date.now() - createdAt > LAST_ORDER_MAX_AGE_MS) return null;
    const items = sanitizeBag(raw.items);
    return items.length ? { createdAt: new Date(createdAt).toISOString(), items } : null;
  }

  let lastOrder = readLastOrder();

  let deferredInstall = null;
  let lastMenuFilter = "todas";
  let menuSearch = "";
  let navPreviousFocus = null;
  let bagPreviousFocus = null;
  let productPreviousFocus = null;

  function bagEnvelope() {
    return {
      schemaVersion: BAG_SCHEMA_VERSION,
      updatedAt: new Date().toISOString(),
      items: bag,
    };
  }

  function persistNormalizedState() {
    storage.set(BAG_KEY, bagEnvelope());
    storage.set(FAVORITES_KEY, [...favorites]);
    try {
      localStorage.removeItem(LEGACY_BAG_KEY);
      localStorage.removeItem(LEGACY_CART_KEY);
    } catch {}
  }

  function initWhatsApp() {
    $$(".js-whatsapp").forEach((link) => {
      if (!whatsappReady) {
        link.href = "#pedido";
        link.removeAttribute("target");
        link.removeAttribute("rel");
        link.setAttribute("aria-label", "WhatsApp indisponível; ir para a seção de pedido");
        return;
      }
      link.href = whatsappUrl(cfg.whatsappMessage || "Olá!");
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    });
  }

  function initRoute() {
    const link = $("#route-link");
    const address = cleanText(cfg.address, 240);
    if (link && address) {
      link.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
      link.rel = "noopener noreferrer";
    }
  }

  function setInert(target, value) {
    if (!target || !("inert" in target)) return;
    target.inert = value;
  }

  function initMenuNav() {
    const button = $("#nav-toggle");
    const nav = $("#main-nav");
    const scrim = $("#nav-scrim");
    const main = $("main");
    const footer = $("footer");
    const cartButton = $("#open-cart");
    if (!button || !nav || !scrim) return;

    const isOpen = () => button.getAttribute("aria-expanded") === "true";

    function close(restoreFocus = true) {
      nav.classList.remove("is-open");
      scrim.hidden = true;
      scrim.classList.remove("is-open");
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-label", "Abrir menu de navegação");
      document.body.classList.remove("nav-is-open");
      setInert(main, false);
      setInert(footer, false);
      setInert(cartButton, false);
      if (restoreFocus) (navPreviousFocus || button).focus();
      navPreviousFocus = null;
    }

    function open() {
      navPreviousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : button;
      nav.classList.add("is-open");
      scrim.hidden = false;
      scrim.classList.add("is-open");
      button.setAttribute("aria-expanded", "true");
      button.setAttribute("aria-label", "Fechar menu de navegação");
      document.body.classList.add("nav-is-open");
      setInert(main, true);
      setInert(footer, true);
      setInert(cartButton, true);
      nav.querySelector("a, button:not([hidden])")?.focus();
    }

    button.addEventListener("click", () => (isOpen() ? close(true) : open()));
    scrim.addEventListener("click", () => close(true));
    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) close(false);
    });

    document.addEventListener("keydown", (event) => {
      if (!isOpen()) return;
      if (event.key === "Escape") {
        event.preventDefault();
        close(true);
        return;
      }
      if (event.key !== "Tab") return;
      const focusables = [
        ...nav.querySelectorAll('a[href], button:not([disabled]):not([hidden])'),
        button,
      ].filter((node) => !node.hasAttribute("inert"));
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    matchMedia("(min-width: 64.01rem)").addEventListener?.("change", (event) => {
      if (event.matches && isOpen()) close(false);
    });
  }

  function initReveal() {
    const elements = $$("[data-reveal]");
    if (
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      elements.forEach((node) => node.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    elements.forEach((node) => observer.observe(node));
  }

  function buildMenuCard(product, index) {
    const article = el("article", { className: "menu-card", attrs: { "data-product-type": product.type || "pizza" } });
    const visual = el("button", { className: "menu-card__visual", attrs: { type: "button", "data-product-detail": product.id, "aria-label": `Ver detalhes de ${product.name}` } });
    if (product.image) {
      const small = smallProductImage(product.image);
      const image = el("img", {
        attrs: {
          src: small, srcset: `${small} 384w, ${product.image} 768w`,
          sizes: "(max-width: 48rem) 34vw, (max-width: 70rem) 50vw, 33vw",
          alt: "", loading: index < 2 ? "eager" : "lazy", decoding: "async", width: "768", height: "768"
        },
      });
      image.addEventListener("error", () => visual.classList.add("is-image-fallback"), { once: true });
      visual.append(image);
    } else {
      visual.classList.add("is-image-fallback");
      visual.append(el("span", { className: "menu-card__icon", text: "Produto", attrs: { "aria-hidden": "true" } }));
    }
    const overlay = el("span", { className: "menu-card__overlay", attrs: { "aria-hidden": "true" } });
    overlay.append(el("span", { className: "menu-card__index", text: String(index + 1).padStart(2, "0") }));
    if (product.badge) overlay.append(el("span", { className: "menu-card__badge", text: product.badge }));
    visual.append(overlay);

    const body = el("div", { className: "menu-card__body" });
    body.append(el("p", { className: "menu-card__category", text: product.categoryLabel }));
    const top = el("div", { className: "menu-card__top" });
    top.append(el("h3", { text: product.name }), el("span", { text: money(product.basePrice) }));
    body.append(top);
    const tags = sensoryFor(product);
    if (tags.length) {
      const tagList = el("ul", { className: "sensory-tags", attrs: { "aria-label": `Características de ${product.name}` } });
      tags.forEach((tag) => tagList.append(el("li", { text: tag })));
      body.append(tagList);
    }
    body.append(el("p", { text: product.description }));

    const actions = el("div", { className: "card-actions" });
    const quickPrice = product.type === "bebida" ? product.basePrice : unitPriceFor(product.id, null, "media", "tradicional");
    actions.append(
      el("button", { className: "small-action small-action--primary", text: product.type === "bebida" ? `Adicionar · ${money(quickPrice)}` : `Adicionar média · ${money(quickPrice)}`, attrs: { type: "button", "data-quick-add": product.id, "aria-label": product.type === "bebida" ? `Adicionar ${product.name} à sacola por ${money(quickPrice)}` : `Adicionar ${product.name} média com borda tradicional à sacola por ${money(quickPrice)}` } }),
    );
    if (product.type !== "bebida") {
      actions.append(el("button", { className: "small-action", text: "Personalizar", attrs: { type: "button", "data-customize": product.id, "aria-label": `Ver detalhes e personalizar ${product.name}` } }));
    }
    body.append(actions);
    article.append(visual, body);
    return article;
  }

  const normalizeSearch = (value) => String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .trim();

  function renderMenu(filter = lastMenuFilter) {
    const grid = $("#menu-grid");
    const status = $("#filter-status");
    if (!grid) return;
    const validFilters = new Set(["todas", "favoritos", "bebidas", ...menu.map((p) => p.category)]);
    lastMenuFilter = validFilters.has(filter) ? filter : "todas";
    const query = normalizeSearch(menuSearch);
    const items = menu.filter((product) => {
      const filterMatch = lastMenuFilter === "todas"
        ? true
        : lastMenuFilter === "favoritos"
          ? favorites.has(product.id)
          : product.category === lastMenuFilter;
      if (!filterMatch) return false;
      if (!query) return true;
      const haystack = normalizeSearch([product.name, product.description, product.categoryLabel, ...(product.traits || [])].join(" "));
      return haystack.includes(query);
    });

    empty(grid);
    if (items.length) {
      items.forEach((product, index) => grid.append(buildMenuCard(product, index)));
    } else {
      const emptyState = el("div", { className: "menu-empty" });
      emptyState.append(
        el("strong", { text: "Não encontrei esse sabor." }),
        el("p", { text: "Tente outro ingrediente, limpe a busca ou peça uma sugestão à Rosa." }),
        el("button", { className: "small-action", text: "Limpar busca", attrs: { type: "button", "data-clear-menu-search": "" } }),
        el("button", { className: "small-action", text: "Pedir ajuda à Rosa", attrs: { type: "button", "data-rosa-open": "", "data-rosa-context": "cardapio", "data-rosa-prompt": "Me indique uma pizza" } }),
      );
      grid.append(emptyState);
    }
    if (status) status.textContent = `${items.length} ${items.length === 1 ? "item exibido" : "itens exibidos"}.`;
    renderFavoriteList();
  }

  function initFilters() {
    $$(".filter-chip").forEach((button) =>
      button.addEventListener("click", () => {
        $$(".filter-chip").forEach((candidate) => {
          const active = candidate === button;
          candidate.classList.toggle("is-active", active);
          candidate.setAttribute("aria-pressed", String(active));
        });
        renderMenu(button.dataset.filter);
      }),
    );

    $("#menu-search")?.addEventListener("input", (event) => {
      menuSearch = cleanText(event.target.value, 80);
      renderMenu(lastMenuFilter);
    });

    $("#menu-grid")?.addEventListener("click", (event) => {
      const clearSearch = event.target.closest("[data-clear-menu-search]");
      if (clearSearch) {
        const input = $("#menu-search");
        menuSearch = "";
        if (input) input.value = "";
        renderMenu(lastMenuFilter);
        input?.focus();
        return;
      }
      const rosaButton = event.target.closest("[data-rosa-open]");
      if (rosaButton && window.ROSA?.open) {
        window.ROSA.open(rosaButton, rosaButton.dataset.rosaContext || "cardapio", rosaButton.dataset.rosaPrompt || "");
        return;
      }
      const addButton = event.target.closest("[data-quick-add]");
      const customizeButton = event.target.closest("[data-customize]");
      const detailButton = event.target.closest("[data-product-detail]");
      if (addButton) addDefaultProduct(addButton.dataset.quickAdd);
      if (customizeButton) openProductDialog(customizeButton.dataset.customize, customizeButton);
      if (detailButton) openProductDialog(detailButton.dataset.productDetail, detailButton);
    });
    $$('[data-desire]').forEach((button) => button.addEventListener("click", () => {
      const desire = cleanText(button.dataset.desire, 40);
      const search = $("#menu-search");
      menuSearch = desire;
      if (search) search.value = desire === "bebida" ? "" : desire;
      if (desire === "bebida") {
        lastMenuFilter = "bebidas";
        $$(".filter-chip").forEach((candidate) => {
          const active = candidate.dataset.filter === "bebidas";
          candidate.classList.toggle("is-active", active);
          candidate.setAttribute("aria-pressed", String(active));
        });
        menuSearch = "";
      } else {
        lastMenuFilter = "todas";
        $$(".filter-chip").forEach((candidate) => {
          const active = candidate.dataset.filter === "todas";
          candidate.classList.toggle("is-active", active);
          candidate.setAttribute("aria-pressed", String(active));
        });
      }
      renderMenu(lastMenuFilter);
      $("#cardapio")?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    }));

  }

  function toggleFavorite(id) {
    if (!menuById.has(id)) return;
    favorites.has(id) ? favorites.delete(id) : favorites.add(id);
    storage.set(FAVORITES_KEY, [...favorites]);
    const product = menuById.get(id);
    announceApp(favorites.has(id) ? `${product?.name || "Item"} adicionado aos favoritos.` : `${product?.name || "Item"} removido dos favoritos.`);
    renderMenu(lastMenuFilter);
  }

  function renderFavoriteList() {
    const box = $("#favorite-list");
    const section = $("#favoritos");
    if (!box) return;
    empty(box);
    const items = menu.filter((product) => favorites.has(product.id));
    if (section) section.hidden = !items.length;
    if (!items.length) return;
    items.forEach((product) => {
      const pill = el("span", { className: "favorite-pill" });
      pill.append(
        el("span", { text: product.name }),
        el("button", {
          className: "small-action",
          text: "Remover",
          attrs: { type: "button", "data-remove-fav": product.id, "aria-label": `Remover ${product.name} dos favoritos` },
        }),
      );
      box.append(pill);
    });
  }

  function renderReturningOrder() {
    const section = $("#returning-order");
    const summary = $("#returning-order-summary");
    if (!section || !summary) return;
    lastOrder = readLastOrder();
    section.hidden = !lastOrder;
    if (!lastOrder) return;
    const safeItems = sanitizeBag(lastOrder.items);
    const count = safeItems.reduce((sum, item) => sum + item.qty, 0);
    const total = safeItems.reduce((sum, item) => sum + item.total, 0);
    summary.textContent = `${count} ${count === 1 ? "item" : "itens"} · valores recalculados hoje · ${money(total)}`;
  }

  function saveLastOrder() {
    const snapshot = sanitizeBag(bag).map((item) => ({ ...item }));
    if (!snapshot.length) return false;
    const payload = { createdAt: new Date().toISOString(), items: snapshot };
    const saved = storage.set(LAST_ORDER_KEY, payload);
    if (saved) lastOrder = payload;
    renderReturningOrder();
    return saved;
  }

  function restoreLastOrder() {
    const stored = readLastOrder();
    if (!stored) { announceApp("O último pedido não está mais disponível neste dispositivo."); renderReturningOrder(); return; }
    const restored = sanitizeBag(stored.items);
    const existingQty = bag.reduce((sum, item) => sum + item.qty, 0);
    const incomingQty = restored.reduce((sum, item) => sum + item.qty, 0);
    if (bag.length + restored.length > MAX_BAG_LINES || existingQty + incomingQty > MAX_BAG_QTY) {
      announceApp("Sua sacola atual não comporta o último pedido inteiro. Revise a sacola antes de repetir.");
      return;
    }
    bag = sanitizeBag([...bag, ...restored.map((item) => ({ ...item, id: createId() }))]);
    saveCart();
    announceApp("Último pedido adicionado à sacola com preços atuais do catálogo.");
    openCart($("#repeat-last-order"));
  }

  function initReturningOrder() {
    $("#repeat-last-order")?.addEventListener("click", restoreLastOrder);
    $("#clear-last-order")?.addEventListener("click", () => {
      try { localStorage.removeItem(LAST_ORDER_KEY); } catch {}
      lastOrder = null;
      renderReturningOrder();
      announceApp("Histórico do último pedido removido deste dispositivo.");
    });
    renderReturningOrder();
  }

  function initFavoriteList() {
    $("#favorite-list")?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-remove-fav]");
      if (button) toggleFavorite(button.dataset.removeFav);
    });
  }

  function openProductDialog(productId, trigger) {
    const product = menuById.get(productId);
    const dialog = $("#product-dialog");
    if (!product || !dialog?.showModal) return;
    productPreviousFocus = trigger instanceof HTMLElement ? trigger : document.activeElement;
    dialog.dataset.productId = product.id;
    const image = $("#product-dialog-image");
    const small = smallProductImage(product.image);
    if (image) { image.src = small; image.srcset = `${small} 384w, ${product.image} 768w`; image.alt = ""; }
    const title = $("#product-dialog-title"); if (title) title.textContent = product.name;
    const description = $("#product-dialog-description"); if (description) description.textContent = product.description;
    const price = $("#product-dialog-price"); if (price) price.textContent = product.type === "bebida" ? money(product.basePrice) : `A partir de ${money(product.basePrice)}`;
    const tags = $("#product-dialog-tags");
    if (tags) { empty(tags); sensoryFor(product, 4).forEach((tag) => tags.append(el("li", { text: tag }))); }
    const quick = $("#product-dialog-add");
    if (quick) {
      const quickPrice = product.type === "bebida" ? product.basePrice : unitPriceFor(product.id, null, "media", "tradicional");
      quick.dataset.productId = product.id;
      quick.textContent = product.type === "bebida" ? `Adicionar · ${money(quickPrice)}` : `Adicionar média · ${money(quickPrice)}`;
    }
    const customize = $("#product-dialog-customize");
    if (customize) customize.hidden = product.type === "bebida";
    const favorite = $("#product-dialog-favorite");
    if (favorite) {
      favorite.hidden = features.favorites === false;
      favorite.dataset.favorite = product.id;
      favorite.setAttribute("aria-pressed", String(favorites.has(product.id)));
      favorite.textContent = favorites.has(product.id) ? "★ Favorito" : "☆ Favoritar";
      favorite.setAttribute("aria-label", `${favorites.has(product.id) ? "Remover" : "Adicionar"} ${product.name} ${favorites.has(product.id) ? "dos" : "aos"} favoritos`);
    }
    const shareButton = $("#product-dialog-share");
    if (shareButton) {
      shareButton.dataset.sharePizza = product.id;
      shareButton.setAttribute("aria-label", `Compartilhar ${product.name}`);
    }
    dialog.showModal();
    $("#product-dialog-add")?.focus();
  }

  function closeProductDialog() { const dialog = $("#product-dialog"); if (dialog?.open) dialog.close(); }

  function initProductDialog() {
    const dialog = $("#product-dialog");
    $("#product-dialog-close")?.addEventListener("click", closeProductDialog);
    dialog?.addEventListener("click", (event) => { if (event.target === dialog) closeProductDialog(); });
    dialog?.addEventListener("close", () => {
      if (productPreviousFocus instanceof HTMLElement && productPreviousFocus.isConnected) productPreviousFocus.focus();
      productPreviousFocus = null;
    });
    $("#product-dialog-add")?.addEventListener("click", (event) => {
      const id = event.currentTarget.dataset.productId;
      if (id && addDefaultProduct(id)) closeProductDialog();
    });
    $("#product-dialog-customize")?.addEventListener("click", () => {
      const id = dialog?.dataset.productId;
      const select = $("#pizza-select");
      if (!id || !select || !menuById.has(id)) return;
      select.value = id; updatePreview(); closeProductDialog();
      $("#pedido")?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
      requestAnimationFrame(() => select.focus());
    });
    $("#product-dialog-favorite")?.addEventListener("click", (event) => {
      const id = event.currentTarget.dataset.favorite;
      if (!id || !menuById.has(id)) return;
      toggleFavorite(id);
      const product = menuById.get(id);
      event.currentTarget.setAttribute("aria-pressed", String(favorites.has(id)));
      event.currentTarget.textContent = favorites.has(id) ? "★ Favorito" : "☆ Favoritar";
      event.currentTarget.setAttribute("aria-label", `${favorites.has(id) ? "Remover" : "Adicionar"} ${product.name} ${favorites.has(id) ? "dos" : "aos"} favoritos`);
      event.currentTarget.focus();
    });
    $("#product-dialog-share")?.addEventListener("click", (event) => {
      const id = event.currentTarget.dataset.sharePizza;
      if (id) sharePizza(id);
    });
  }

  function populateOrder() {
    const first = $("#pizza-select");
    const second = $("#pizza-select-2");
    [first, second].forEach((select) => {
      if (!select) return;
      empty(select);
      select.append(el("option", { text: "Selecione um sabor", attrs: { value: "" } }));
      menu.filter((product) => product.type !== "bebida").forEach((product) =>
        select.append(el("option", { text: product.name, attrs: { value: product.id } })),
      );
    });
  }

  function currentOrderSelection() {
    const pizzaId = $("#pizza-select")?.value || "";
    const half = Boolean($("#half-half")?.checked);
    const secondId = half ? $("#pizza-select-2")?.value || "" : "";
    const size = safeSize($("#size-select")?.value);
    const crust = safeCrust($("#crust-select")?.value);
    const qty = clampInt($("#quantity")?.value, 1, MAX_QTY);
    return { pizzaId, pizza2Id: half && secondId !== pizzaId ? secondId : null, half, size, crust, qty };
  }

  function calcCurrent() {
    const current = currentOrderSelection();
    if (!menuById.has(current.pizzaId)) return 0;
    return unitPriceFor(current.pizzaId, current.pizza2Id, current.size, current.crust) * current.qty;
  }

  function updatePreview() {
    const preview = $("#price-preview");
    if (preview) preview.textContent = money(calcCurrent());
  }

  function createCartItem(data) {
    const item = normalizeCartItem({ ...data, id: createId() });
    return item;
  }

  function showBagFeedback(product) {
    const feedback = $("#bag-feedback");
    const text = $("#bag-feedback-text");
    if (!feedback || !text || !product) return;
    text.textContent = `${product.name} adicionado à sacola.`;
    feedback.hidden = false;
    clearTimeout(showBagFeedback.timer);
    showBagFeedback.timer = setTimeout(() => { feedback.hidden = true; }, 6500);
  }

  function addDefaultProduct(productId) {
    const product = menuById.get(productId);
    if (!product) return false;
    const item = createCartItem({
      pizzaId: productId, pizza2Id: null, size: product.type === "bebida" ? null : "media",
      crust: product.type === "bebida" ? null : "tradicional", qty: 1, remove: "", notes: "",
    });
    const added = item ? addCart(item) : false;
    if (added) showBagFeedback(product);
    return added;
  }

  function initOrder() {
    populateOrder();
    const half = $("#half-half");
    const secondField = $("#second-flavor-field");
    const secondSelect = $("#pizza-select-2");
    const form = $("#order-form");
    const quantity = $("#quantity");

    half?.addEventListener("change", () => {
      if (secondField) secondField.hidden = !half.checked;
      if (secondSelect) secondSelect.required = half.checked;
      updatePreview();
    });

    ["pizza-select", "pizza-select-2", "size-select", "crust-select", "quantity"].forEach((id) =>
      $("#" + id)?.addEventListener("input", updatePreview),
    );

    quantity?.addEventListener("change", () => {
      quantity.value = String(clampInt(quantity.value, 1, MAX_QTY));
      updatePreview();
    });

    updatePreview();

    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      const error = $("#form-error");
      if (!form.checkValidity()) {
        if (error) {
          error.hidden = false;
          error.textContent = "Revise os campos obrigatórios antes de adicionar à sacola.";
        }
        form.reportValidity();
        return;
      }

      const current = currentOrderSelection();
      if (current.half && !current.pizza2Id) {
        secondSelect?.setAttribute("aria-invalid", "true");
        if (error) {
          error.hidden = false;
          error.textContent = "Para uma pizza meio a meio, escolha um segundo sabor diferente do primeiro.";
        }
        secondSelect?.focus();
        return;
      }

      const item = createCartItem({
        ...current,
        remove: cleanText($("#remove-ingredients")?.value, MAX_REMOVE),
        notes: cleanText($("#notes")?.value, MAX_NOTES),
      });
      if (!item) return;

      secondSelect?.removeAttribute("aria-invalid");
      if (error) { error.hidden = true; error.textContent = ""; }
      if (!addCart(item)) {
        if (error) {
          error.hidden = false;
          error.textContent = "A sacola atingiu o limite desta demonstração. Revise a sacola antes de adicionar outro item.";
        }
        return;
      }
      form.reset();
      if (secondField) secondField.hidden = true;
      if (secondSelect) secondSelect.required = false;
      if (quantity) quantity.value = "1";
      updatePreview();
      $("#open-cart")?.focus();
    });
  }

  function addCart(item) {
    const totalQty = bag.reduce((sum, current) => sum + current.qty, 0);
    if (!item || bag.length >= MAX_BAG_LINES || totalQty + item.qty > MAX_BAG_QTY) {
      announceCart("A sacola atingiu o limite seguro desta demonstração. Revise os itens antes de continuar.");
      return false;
    }
    bag.push(item);
    saveCart();
    announceCart("Item adicionado à sacola.");
    return true;
  }

  function saveCart() {
    bag = sanitizeBag(bag);
    const saved = storage.set(BAG_KEY, bagEnvelope());
    renderCart();
    if (!saved) announceCart("Não consegui salvar a sacola neste navegador. Você pode continuar nesta sessão, mas o pedido pode não persistir após fechar a página.");
  }

  function announceApp(text) {
    const status = $("#app-status");
    if (!status) return;
    status.textContent = "";
    requestAnimationFrame(() => { status.textContent = text; });
  }

  function announceCart(text) {
    const dialog = $("#cart-dialog");
    const status = $("#cart-status");
    if (dialog?.open && status) {
      status.textContent = "";
      requestAnimationFrame(() => { status.textContent = text; });
    } else {
      announceApp(text);
    }
  }

  function productNames(item) {
    const first = menuById.get(item.pizzaId);
    const second = item.pizza2Id ? menuById.get(item.pizza2Id) : null;
    return { first: first?.name || "Pizza indisponível", second: second?.name || "" };
  }

  function renderCart() {
    const box = $("#cart-items");
    const count = $("#cart-count");
    const total = $("#cart-total");
    const countNumber = bag.reduce((sum, item) => sum + item.qty, 0);
    if (count) {
      count.textContent = String(countNumber);
      count.setAttribute("aria-label", `${countNumber} ${countNumber === 1 ? "item" : "itens"}`);
    }
    const totalValue = bag.reduce((sum, item) => sum + item.total, 0);
    if (total) total.textContent = money(totalValue);
    const mobileBar = $("#mobile-bag-bar");
    const mobileCount = $("#mobile-bag-count");
    const mobileTotal = $("#mobile-bag-total");
    if (mobileBar) mobileBar.hidden = countNumber === 0;
    if (mobileCount) mobileCount.textContent = `${countNumber} ${countNumber === 1 ? "item" : "itens"}`;
    if (mobileTotal) mobileTotal.textContent = money(totalValue);
    document.body.classList.toggle("has-mobile-bag", countNumber > 0);
    if (!box) return;

    empty(box);
    if (!bag.length) {
      box.append(el("p", { className: "cart-empty", text: "Sua sacola está vazia." }));
      return;
    }

    const orderedBag = [...bag].sort((a, b) => (a.productType === "bebida") - (b.productType === "bebida"));
    let lastGroup = "";
    orderedBag.forEach((item) => {
      const firstProduct = menuById.get(item.pizzaId);
      const group = item.productType === "bebida" ? "Bebidas" : firstProduct?.category === "doces" ? "Sobremesas" : "Pizzas";
      if (group !== lastGroup) {
        box.append(el("h3", { className: "cart-group-title", text: group }));
        lastGroup = group;
      }
      const names = productNames(item);
      const size = pricing.sizes?.[item.size]?.label || item.size;
      const crust = pricing.crusts?.[item.crust]?.label || item.crust;
      const article = el("article", { className: "cart-item" });
      const top = el("div", { className: "cart-item__top" });
      if (firstProduct?.image) {
        top.append(el("img", { className: "cart-item__thumb", attrs: { src: smallProductImage(firstProduct.image), alt: "", loading: "lazy", decoding: "async", width: "88", height: "88" } }));
      }
      const details = el("div");
      details.append(el("strong", { text: names.second ? `${names.first} + ${names.second}` : names.first }));
      details.append(el("p", { text: item.productType === "bebida" ? `${item.qty}x bebida` : `${size} • borda ${crust} • ${item.qty}x` }));
      if (item.remove) details.append(el("p", { text: `Remover: ${item.remove}` }));
      if (item.notes) details.append(el("p", { text: `Obs.: ${item.notes}` }));
      top.append(details, el("strong", { text: money(item.total) }));

      const actions = el("div", { className: "cart-item__actions" });
      actions.append(
        el("button", { className: "small-action", text: "− 1", attrs: { type: "button", "data-dec": item.id, "aria-label": `Diminuir quantidade de ${names.first}` } }),
        el("button", { className: "small-action", text: "+ 1", attrs: { type: "button", "data-inc": item.id, "aria-label": `Aumentar quantidade de ${names.first}` } }),
        el("button", { className: "small-action", text: "Remover", attrs: { type: "button", "data-remove": item.id, "aria-label": `Remover ${names.first} da sacola` } }),
      );
      article.append(top, actions);
      box.append(article);
    });
    const summary = getBagSummary();
    const completion = el("p", { className: "bag-completion" });
    completion.textContent = summary.pizzas && summary.drinks
      ? "Sua sacola já tem pizza e bebida. Se quiser, a Rosa pode sugerir uma sobremesa para fechar a experiência."
      : summary.pizzas
        ? "Sua sacola já tem pizza. Você pode completar com uma bebida ou pedir uma sugestão à Rosa."
        : "Você adicionou bebidas. Escolha uma pizza para completar o pedido.";
    box.append(completion);
  }

  function openCart(trigger) {
    const dialog = $("#cart-dialog");
    if (!dialog?.showModal) return;
    bagPreviousFocus = trigger instanceof HTMLElement ? trigger : document.activeElement;
    renderCart();
    dialog.showModal();
    $("#close-cart")?.focus();
  }

  function closeCart() {
    const dialog = $("#cart-dialog");
    if (!dialog?.open) return;
    dialog.close();
  }

  function restoreCartActionFocus(itemId, action) {
    requestAnimationFrame(() => {
      const selector = itemId && action ? `[data-${action}="${CSS.escape(itemId)}"]` : "";
      const target = selector ? $(selector, $("#cart-items")) : null;
      (target || $("#cart-items button") || $("#close-cart"))?.focus();
    });
  }

  function initCart() {
    const dialog = $("#cart-dialog");
    $$("#open-cart, [data-open-cart]").forEach((button) =>
      button.addEventListener("click", () => openCart(button)),
    );
    $("#close-cart")?.addEventListener("click", closeCart);
    $("#review-cart-with-rosa")?.addEventListener("click", () => {
      const returnTarget = $("#open-cart") || document.activeElement;
      closeCart();
      requestAnimationFrame(() => window.ROSA?.open?.(returnTarget, "sacola", "Revise minha sacola e me diga se falta alguma coisa"));
    });
    $("#bag-feedback-open")?.addEventListener("click", (event) => openCart(event.currentTarget));
    $("#bag-feedback-close")?.addEventListener("click", () => { const feedback = $("#bag-feedback"); if (feedback) feedback.hidden = true; });

    dialog?.addEventListener("click", (event) => {
      if (event.target === dialog) closeCart();
    });
    dialog?.addEventListener("close", () => {
      if (bagPreviousFocus instanceof HTMLElement && bagPreviousFocus.isConnected) bagPreviousFocus.focus();
      bagPreviousFocus = null;
    });

    $("#cart-items")?.addEventListener("click", (event) => {
      const inc = event.target.closest("[data-inc]");
      const dec = event.target.closest("[data-dec]");
      const remove = event.target.closest("[data-remove]");
      const id = inc?.dataset.inc || dec?.dataset.dec || remove?.dataset.remove;
      if (!id) return;
      const index = bag.findIndex((item) => item.id === id);
      if (index < 0) return;

      const action = inc ? "inc" : dec ? "dec" : "remove";
      if (inc) {
        const totalQty = bag.reduce((sum, item) => sum + item.qty, 0);
        if (bag[index].qty >= MAX_QTY || totalQty >= MAX_BAG_QTY) {
          announceCart(`Limite de quantidade atingido para manter a sacola e a mensagem do pedido seguras.`);
          return;
        }
        bag[index].qty += 1;
        announceCart("Quantidade aumentada.");
      }
      if (dec) {
        bag[index].qty -= 1;
        if (bag[index].qty <= 0) bag.splice(index, 1);
        announceCart("Quantidade reduzida.");
      }
      if (remove) {
        bag.splice(index, 1);
        announceCart("Item removido.");
      }
      saveCart();
      restoreCartActionFocus(remove ? null : id, action);
    });

    $("#clear-cart")?.addEventListener("click", () => {
      if (!bag.length) {
        announceCart("A sacola já está vazia.");
        return;
      }
      bag = [];
      saveCart();
      announceCart("Sacola esvaziada.");
      $("#clear-cart")?.focus();
    });

    $("#send-cart")?.addEventListener("click", (event) => {
      if (features.checkout === false) { announceCart("A finalização online está desativada para esta configuração."); return; }
      if (!bag.length) {
        announceCart("Adicione ao menos um item à sacola antes de continuar.");
        return;
      }
      const trigger = event.currentTarget;
      closeCart();
      const opened = window.FORNO_CHECKOUT?.open?.(trigger);
      if (!opened) {
        announceApp("Não consegui abrir os dados de entrega. Sua sacola continua intacta.");
        requestAnimationFrame(() => openCart(trigger));
      }
    });

    renderCart();
  }

  function renderFinderResult(product) {
    const result = $("#finder-result");
    if (!result) return;
    empty(result);
    result.hidden = false;
    result.append(
      el("strong", { text: `Sua indicação: ${product.name}` }),
      el("p", { text: product.description }),
      el("button", {
        className: "small-action",
        text: "Adicionar à sacola",
        attrs: { type: "button", "data-finder-add": product.id },
      }),
    );
    result.focus();
  }

  function initFinder() {
    const form = $("#finder-form");
    const result = $("#finder-result");
    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const data = new FormData(form);
      const wanted = [data.get("style"), data.get("intensity"), data.get("focus")];
      const best = menu
        .map((product, index) => ({
          product,
          score: wanted.reduce((sum, trait) => sum + (product.traits?.includes(trait) ? 1 : 0), 0),
          index,
        }))
        .sort((a, b) => b.score - a.score || a.index - b.index)[0]?.product;
      if (best) renderFinderResult(best);
    });

    result?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-finder-add]");
      if (button) addDefaultProduct(button.dataset.finderAdd);
    });
  }

  function safeShareUrl(pizzaId = null) {
    let base;
    try {
      base = new URL(cfg.siteUrl || location.href, location.href);
      if (base.protocol !== "https:" && base.hostname !== "localhost") throw new Error("unsafe protocol");
    } catch {
      base = new URL(location.href);
    }
    base.hash = "";
    base.search = "";
    if (pizzaId && menuById.has(pizzaId)) base.searchParams.set("item", pizzaId);
    return base.toString();
  }

  async function copyText(text) {
    if (navigator.clipboard?.writeText && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const area = el("textarea", {
      className: "clipboard-helper",
      attrs: { readonly: "", "aria-hidden": "true", tabindex: "-1" },
    });
    area.value = text;
    document.body.append(area);
    area.select();
    const ok = document.execCommand?.("copy") === true;
    area.remove();
    return ok;
  }

  function showTransientStatus(text) {
    const status = $("#network-status");
    if (!status) return;
    status.textContent = text;
    status.hidden = false;
    window.setTimeout(() => {
      if (navigator.onLine) status.hidden = true;
    }, 2800);
  }

  async function share(data) {
    try {
      if (navigator.share) {
        await navigator.share(data);
        return;
      }
      const copied = await copyText(data.url);
      showTransientStatus(copied ? "Link copiado para a área de transferência." : "Não foi possível copiar o link automaticamente.");
    } catch (error) {
      if (error?.name !== "AbortError") showTransientStatus("Compartilhamento cancelado ou indisponível.");
    }
  }

  function sharePizza(id) {
    const product = menuById.get(id);
    if (!product) return;
    share({
      title: product.name,
      text: `Conheça ${product.name} da ${cfg.shortName || cfg.businessName || "casa"}.`,
      url: safeShareUrl(id),
    });
  }

  function initShare() {
    $("#share-site")?.addEventListener("click", () =>
      share({
        title: cfg.businessName || "Cardápio",
        text: "48 horas de paciência. 90 segundos de fogo.",
        url: safeShareUrl(),
      }),
    );

    const params = new URLSearchParams(location.search);
    const id = params.get("item") || params.get("pizza");
    if (!id || !menuById.has(id)) return;
    const product = menuById.get(id);
    const status = $("#filter-status");
    if (status) status.textContent = `Link direto aberto para ${product.name}.`;
    requestAnimationFrame(() => {
      const button = document.querySelector(`[data-quick-add="${CSS.escape(id)}"]`);
      button?.scrollIntoView({ block: "center", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      button?.focus({ preventScroll: true });
    });
  }

  function getBusinessStatus() {
    const hours = cfg.businessHours;
    if (!hours || typeof hours !== "object") {
      return { open: null, text: cleanText(cfg.businessHoursNote, 220) || "Consulte disponibilidade pelo WhatsApp." };
    }
    try {
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: cfg.timezone || "America/Sao_Paulo",
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      }).formatToParts(new Date());
      const weekday = parts.find((p) => p.type === "weekday")?.value;
      const dayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      const day = dayMap[weekday];
      const hour = Number(parts.find((p) => p.type === "hour")?.value || 0);
      const minute = Number(parts.find((p) => p.type === "minute")?.value || 0);
      const now = hour * 60 + minute;
      const slot = hours[day];
      if (!slot) return { open: false, text: "Fechada no momento. Consulte o próximo horário no atendimento." };
      const [oh, om] = String(slot.open).split(":").map(Number);
      const [ch, cm] = String(slot.close).split(":").map(Number);
      const start = oh * 60 + om;
      const end = ch === 24 ? 1440 : ch * 60 + cm;
      const isOpen = now >= start && now < end;
      const closeLabel = slot.close === "24:00" ? "0h" : slot.close;
      const openLabel = slot.open.replace(":00", "h");
      return {
        open: isOpen,
        text: isOpen ? `Estamos abertos agora, até ${closeLabel}.` : `Fechada agora. Hoje abrimos às ${openLabel} e atendemos até ${closeLabel}.`,
      };
    } catch {
      return { open: null, text: cleanText(cfg.businessHoursNote, 220) || "Consulte disponibilidade pelo WhatsApp." };
    }
  }

  function initHours() {
    const note = $("#hours-note");
    const status = $("#business-status span:last-child");
    const dot = $("#business-status .status-dot");
    const live = getBusinessStatus();
    if (note) note.textContent = `${cfg.businessHoursNote || ""} ${live.text}`.trim();
    if (status) status.textContent = live.text;
    if (dot && live.open !== null) dot.dataset.open = String(live.open);
  }

  function initPWA() {
    if (features.pwa === false) return;
    if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("./service-worker.js", { scope: "./" }).catch(() => {
          showTransientStatus("Modo offline indisponível neste navegador.");
        });
      });
    }

    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      deferredInstall = event;
      const button = $("#install-app");
      if (button) button.hidden = false;
    });

    window.addEventListener("appinstalled", () => {
      deferredInstall = null;
      const button = $("#install-app");
      if (button) button.hidden = true;
      showTransientStatus(`${cfg.shortName || cfg.businessName || "Aplicativo"} instalada neste dispositivo.`);
    });

    $("#install-app")?.addEventListener("click", async () => {
      if (!deferredInstall) return;
      deferredInstall.prompt();
      await deferredInstall.userChoice;
      deferredInstall = null;
      $("#install-app").hidden = true;
    });

    const status = $("#network-status");
    function setNetworkStatus() {
      if (!status) return;
      const send = $("#send-cart");
      if (navigator.onLine) {
        status.hidden = true;
        if (send) { send.disabled = false; send.removeAttribute("aria-disabled"); }
      } else {
        status.textContent = "Você está offline. O cardápio e a sacola continuam disponíveis, mas o WhatsApp exige conexão.";
        status.hidden = false;
        if (send) { send.disabled = true; send.setAttribute("aria-disabled", "true"); }
      }
    }
    addEventListener("online", setNetworkStatus);
    addEventListener("offline", setNetworkStatus);
    setNetworkStatus();
  }

  function initYear() {
    const year = $("#current-year");
    if (year) year.textContent = String(new Date().getFullYear());
  }

  function getBagSummary() {
    const count = bag.reduce((sum, item) => sum + item.qty, 0);
    const total = bag.reduce((sum, item) => sum + item.total, 0);
    const pizzas = bag.filter((item) => item.productType !== "bebida").reduce((sum, item) => sum + item.qty, 0);
    const drinks = bag.filter((item) => item.productType === "bebida").reduce((sum, item) => sum + item.qty, 0);
    return { count, total, totalLabel: money(total), pizzas, drinks };
  }


  function getCheckoutSnapshot() {
    const reviewGroups = { Pizzas: [], Bebidas: [], Sobremesas: [] };
    const messageGroups = { PIZZAS: [], BEBIDAS: [], SOBREMESAS: [] };
    bag.forEach((item) => {
      const names = productNames(item);
      const first = menuById.get(item.pizzaId);
      const size = pricing.sizes?.[item.size]?.label || item.size;
      const crust = pricing.crusts?.[item.crust]?.label || item.crust;
      const name = names.second ? `${names.first} + ${names.second}` : names.first;
      const group = item.productType === "bebida" ? "Bebidas" : first?.category === "doces" ? "Sobremesas" : "Pizzas";
      const messageGroup = group.toUpperCase();
      if (item.productType === "bebida") {
        reviewGroups[group].push(`${item.qty}x ${name} — ${money(item.total)}`);
        messageGroups[messageGroup].push(`${item.qty}x ${name} — ${money(item.total)}`);
      } else {
        reviewGroups[group].push(`${item.qty}x ${name} — ${size}, borda ${crust} — ${money(item.total)}`);
        const detail = [`${item.qty}x ${name}`, `Tamanho: ${size}`, `Borda: ${crust}`];
        if (item.remove) detail.push(`Remover: ${item.remove}`);
        if (item.notes) detail.push(`Observações: ${item.notes}`);
        detail.push(`Subtotal demonstrativo: ${money(item.total)}`);
        messageGroups[messageGroup].push(detail.join("\n"));
      }
    });
    const lines = [];
    const messageLines = [];
    for (const key of ["Pizzas", "Bebidas", "Sobremesas"]) {
      if (!reviewGroups[key].length) continue;
      lines.push(`${key}:`, ...reviewGroups[key]);
    }
    for (const key of ["PIZZAS", "BEBIDAS", "SOBREMESAS"]) {
      if (!messageGroups[key].length) continue;
      messageLines.push(key, ...messageGroups[key], "");
    }
    const totalValue = bag.reduce((sum, item) => sum + item.total, 0);
    return Object.freeze({
      count: bag.reduce((sum, item) => sum + item.qty, 0),
      total: totalValue,
      totalLabel: money(totalValue),
      lines: Object.freeze(lines),
      messageLines: Object.freeze(messageLines)
    });
  }

  function handoffToWhatsApp(message) {
    const safeMessage = cleanText(message, MAX_WHATSAPP_MESSAGE + 1);
    if (!bag.length) return { ok: false, reason: "empty-bag" };
    if (!whatsappReady) return { ok: false, reason: "whatsapp-unavailable" };
    if (!navigator.onLine) return { ok: false, reason: "offline" };
    if (!safeMessage || safeMessage.length > MAX_WHATSAPP_MESSAGE) return { ok: false, reason: "message-too-long" };
    saveLastOrder();
    const opened = window.open(whatsappUrl(safeMessage), "_blank", "noopener,noreferrer");
    if (!opened) return { ok: false, reason: "popup-blocked" };
    opened.opener = null;
    return { ok: true };
  }

  window.FORNO_APP = Object.freeze({
    addProduct(id) { return menuById.has(id) ? addDefaultProduct(id) : false; },
    openBag() { openCart(document.activeElement); },
    openCart() { openCart(document.activeElement); },
    getBagSummary,
    getCartSummary: getBagSummary,
    getCheckoutSnapshot,
    handoffToWhatsApp,
    clearBag() {
      if (!bag.length) return false;
      bag = [];
      saveCart();
      return true;
    },
    getBusinessStatus,
    openProduct(id) { openProductDialog(id, document.activeElement); },
    openCheckout() { return window.FORNO_CHECKOUT?.open?.(document.activeElement) || false; },
    repeatLastOrder() { restoreLastOrder(); },
    getHealthSnapshot() {
      return Object.freeze({
        version: window.FORNO_META?.version || "unknown",
        bagSchemaVersion: BAG_SCHEMA_VERSION,
        catalogItems: menu.length,
        bagLines: bag.length,
        bagQuantity: bag.reduce((sum, item) => sum + item.qty, 0),
        storageAvailable: (() => {
          const ok = storage.set("forno-health-probe", { ok: true });
          try { localStorage.removeItem("forno-health-probe"); } catch {}
          return ok;
        })(),
      });
    },
  });

  document.addEventListener("DOMContentLoaded", () => {
    persistNormalizedState();
    initWhatsApp();
    initRoute();
    initMenuNav();
    initReveal();
    initFilters();
    initFavoriteList();
    initReturningOrder();
    renderMenu();
    initProductDialog();
    initOrder();
    initCart();
    initFinder();
    initShare();
    initHours();
    initPWA();
    initYear();
  });
})();
