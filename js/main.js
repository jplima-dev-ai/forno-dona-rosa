(() => {
  "use strict";

  const cfg = window.PIZZARIA_CONFIG || {};
  const rawMenu = Array.isArray(window.FORNO_MENU) ? window.FORNO_MENU : [];
  const pricing = window.FORNO_PRICING || {};
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const MAX_QTY = 10;
  const MAX_REMOVE = 100;
  const MAX_NOTES = 180;
  const CART_KEY = "forno-cart";
  const FAVORITES_KEY = "forno-favorites";

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

  const safeSize = (key) =>
    pricing.sizes?.[key] ? key : Object.keys(pricing.sizes || {})[0] || "media";
  const safeCrust = (key) =>
    pricing.crusts?.[key] ? key : Object.keys(pricing.crusts || {})[0] || "tradicional";

  const unitPriceFor = (pizzaId, pizza2Id, sizeKey, crustKey) => {
    const pizza = menuById.get(pizzaId);
    if (!pizza) return 0;
    const pizza2 = pizza2Id ? menuById.get(pizza2Id) : null;
    const size = pricing.sizes?.[safeSize(sizeKey)] || { multiplier: 1 };
    const crust = pricing.crusts?.[safeCrust(crustKey)] || { add: 0 };
    const base = pizza2 ? Math.max(pizza.basePrice, pizza2.basePrice) : pizza.basePrice;
    const multiplier = Number.isFinite(size.multiplier) ? size.multiplier : 1;
    const add = Number.isFinite(crust.add) ? crust.add : 0;
    return Math.max(0, base * multiplier + add);
  };

  const normalizeCartItem = (raw) => {
    if (!raw || typeof raw !== "object") return null;
    const pizza = menuById.get(raw.pizzaId);
    if (!pizza) return null;
    const pizza2 = raw.pizza2Id && raw.pizza2Id !== raw.pizzaId ? menuById.get(raw.pizza2Id) : null;
    const size = safeSize(raw.size);
    const crust = safeCrust(raw.crust);
    const qty = clampInt(raw.qty, 1, MAX_QTY);
    const unitPrice = unitPriceFor(pizza.id, pizza2?.id || null, size, crust);
    const id = cleanText(raw.id, 80) || createId();

    return {
      id,
      pizzaId: pizza.id,
      pizza2Id: pizza2?.id || null,
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

  const storedCart = storage.get(CART_KEY, []);
  let cart = Array.isArray(storedCart)
    ? storedCart.map(normalizeCartItem).filter(Boolean).slice(0, 50)
    : [];

  const storedFavorites = storage.get(FAVORITES_KEY, []);
  let favorites = new Set(
    Array.isArray(storedFavorites)
      ? storedFavorites.filter((id) => typeof id === "string" && menuById.has(id)).slice(0, menu.length)
      : [],
  );

  let deferredInstall = null;
  let lastMenuFilter = "todas";
  let navPreviousFocus = null;
  let cartPreviousFocus = null;

  function persistNormalizedState() {
    storage.set(CART_KEY, cart);
    storage.set(FAVORITES_KEY, [...favorites]);
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
    const article = el("article", { className: "menu-card" });
    const visual = el("div", { className: "menu-card__visual", attrs: { "aria-hidden": "true" } });
    visual.append(el("span", { text: String(index + 1).padStart(2, "0") }));

    const body = el("div", { className: "menu-card__body" });
    body.append(el("p", { className: "menu-card__category", text: product.categoryLabel }));
    const top = el("div", { className: "menu-card__top" });
    top.append(el("h3", { text: product.name }), el("span", { text: money(product.basePrice) }));
    body.append(top, el("p", { text: product.description }));

    const actions = el("div", { className: "card-actions" });
    actions.append(
      el("button", { className: "small-action", text: "Adicionar", attrs: { type: "button", "data-quick-add": product.id } }),
      el("button", {
        className: "small-action",
        text: favorites.has(product.id) ? "Favoritada" : "Favoritar",
        attrs: {
          type: "button",
          "data-favorite": product.id,
          "aria-pressed": String(favorites.has(product.id)),
          "aria-label": `${favorites.has(product.id) ? "Remover" : "Adicionar"} ${product.name} ${favorites.has(product.id) ? "dos" : "aos"} favoritos`,
        },
      }),
      el("button", {
        className: "small-action",
        text: "Compartilhar",
        attrs: { type: "button", "data-share-pizza": product.id, "aria-label": `Compartilhar ${product.name}` },
      }),
    );
    body.append(actions);
    article.append(visual, body);
    return article;
  }

  function renderMenu(filter = "todas") {
    const grid = $("#menu-grid");
    const status = $("#filter-status");
    if (!grid) return;
    const validFilters = new Set(["todas", "favoritos", ...menu.map((p) => p.category)]);
    lastMenuFilter = validFilters.has(filter) ? filter : "todas";
    const items = menu.filter((product) => {
      if (lastMenuFilter === "todas") return true;
      if (lastMenuFilter === "favoritos") return favorites.has(product.id);
      return product.category === lastMenuFilter;
    });

    empty(grid);
    if (items.length) items.forEach((product, index) => grid.append(buildMenuCard(product, index)));
    else grid.append(el("p", { text: "Nenhuma pizza nesta seleção." }));
    if (status) status.textContent = `${items.length} ${items.length === 1 ? "pizza exibida" : "pizzas exibidas"}.`;
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

    $("#menu-grid")?.addEventListener("click", (event) => {
      const favoriteButton = event.target.closest("[data-favorite]");
      const addButton = event.target.closest("[data-quick-add]");
      const shareButton = event.target.closest("[data-share-pizza]");
      if (favoriteButton) toggleFavorite(favoriteButton.dataset.favorite);
      if (addButton) addDefaultProduct(addButton.dataset.quickAdd);
      if (shareButton) sharePizza(shareButton.dataset.sharePizza);
    });
  }

  function toggleFavorite(id) {
    if (!menuById.has(id)) return;
    favorites.has(id) ? favorites.delete(id) : favorites.add(id);
    storage.set(FAVORITES_KEY, [...favorites]);
    renderMenu(lastMenuFilter);
  }

  function renderFavoriteList() {
    const box = $("#favorite-list");
    if (!box) return;
    empty(box);
    const items = menu.filter((product) => favorites.has(product.id));
    if (!items.length) {
      box.append(el("p", { text: "Nenhuma pizza favoritada ainda." }));
      return;
    }
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

  function initFavoriteList() {
    $("#favorite-list")?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-remove-fav]");
      if (button) toggleFavorite(button.dataset.removeFav);
    });
  }

  function populateOrder() {
    const first = $("#pizza-select");
    const second = $("#pizza-select-2");
    [first, second].forEach((select) => {
      if (!select) return;
      empty(select);
      select.append(el("option", { text: "Selecione um sabor", attrs: { value: "" } }));
      menu.forEach((product) =>
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

  function addDefaultProduct(productId) {
    const item = createCartItem({
      pizzaId: productId,
      pizza2Id: null,
      size: "media",
      crust: "tradicional",
      qty: 1,
      remove: "",
      notes: "",
    });
    if (item) addCart(item);
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
          error.textContent = "Revise os campos obrigatórios antes de adicionar ao carrinho.";
        }
        form.reportValidity();
        return;
      }

      const current = currentOrderSelection();
      if (current.half && !current.pizza2Id) {
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

      if (error) error.hidden = true;
      addCart(item);
      form.reset();
      if (secondField) secondField.hidden = true;
      if (secondSelect) secondSelect.required = false;
      if (quantity) quantity.value = "1";
      updatePreview();
      $("#open-cart")?.focus();
    });
  }

  function addCart(item) {
    if (!item || cart.length >= 50) {
      announceCart("O carrinho atingiu o limite de itens desta demonstração.");
      return;
    }
    cart.push(item);
    saveCart();
    announceCart("Item adicionado ao carrinho.");
  }

  function saveCart() {
    cart = cart.map(normalizeCartItem).filter(Boolean).slice(0, 50);
    storage.set(CART_KEY, cart);
    renderCart();
  }

  function announceCart(text) {
    const status = $("#cart-status");
    if (!status) return;
    status.textContent = "";
    requestAnimationFrame(() => {
      status.textContent = text;
    });
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
    const countNumber = cart.reduce((sum, item) => sum + item.qty, 0);
    if (count) {
      count.textContent = String(countNumber);
      count.setAttribute("aria-label", `${countNumber} ${countNumber === 1 ? "item" : "itens"}`);
    }
    if (total) total.textContent = money(cart.reduce((sum, item) => sum + item.total, 0));
    if (!box) return;

    empty(box);
    if (!cart.length) {
      box.append(el("p", { className: "cart-empty", text: "Seu carrinho está vazio." }));
      return;
    }

    cart.forEach((item) => {
      const names = productNames(item);
      const size = pricing.sizes?.[item.size]?.label || item.size;
      const crust = pricing.crusts?.[item.crust]?.label || item.crust;
      const article = el("article", { className: "cart-item" });
      const top = el("div", { className: "cart-item__top" });
      const details = el("div");
      details.append(
        el("strong", { text: names.second ? `${names.first} + ${names.second}` : names.first }),
        el("p", { text: `${size} • borda ${crust} • ${item.qty}x` }),
      );
      if (item.remove) details.append(el("p", { text: `Remover: ${item.remove}` }));
      if (item.notes) details.append(el("p", { text: `Obs.: ${item.notes}` }));
      top.append(details, el("strong", { text: money(item.total) }));

      const actions = el("div", { className: "cart-item__actions" });
      actions.append(
        el("button", { className: "small-action", text: "− 1", attrs: { type: "button", "data-dec": item.id, "aria-label": `Diminuir quantidade de ${names.first}` } }),
        el("button", { className: "small-action", text: "+ 1", attrs: { type: "button", "data-inc": item.id, "aria-label": `Aumentar quantidade de ${names.first}` } }),
        el("button", { className: "small-action", text: "Remover", attrs: { type: "button", "data-remove": item.id, "aria-label": `Remover ${names.first} do carrinho` } }),
      );
      article.append(top, actions);
      box.append(article);
    });
  }

  function openCart(trigger) {
    const dialog = $("#cart-dialog");
    if (!dialog?.showModal) return;
    cartPreviousFocus = trigger instanceof HTMLElement ? trigger : document.activeElement;
    renderCart();
    dialog.showModal();
    $("#close-cart")?.focus();
  }

  function closeCart() {
    const dialog = $("#cart-dialog");
    if (!dialog?.open) return;
    dialog.close();
  }

  function initCart() {
    const dialog = $("#cart-dialog");
    $$("#open-cart, [data-open-cart]").forEach((button) =>
      button.addEventListener("click", () => openCart(button)),
    );
    $("#close-cart")?.addEventListener("click", closeCart);

    dialog?.addEventListener("click", (event) => {
      if (event.target === dialog) closeCart();
    });
    dialog?.addEventListener("close", () => {
      if (cartPreviousFocus instanceof HTMLElement && cartPreviousFocus.isConnected) cartPreviousFocus.focus();
      cartPreviousFocus = null;
    });

    $("#cart-items")?.addEventListener("click", (event) => {
      const inc = event.target.closest("[data-inc]");
      const dec = event.target.closest("[data-dec]");
      const remove = event.target.closest("[data-remove]");
      const id = inc?.dataset.inc || dec?.dataset.dec || remove?.dataset.remove;
      if (!id) return;
      const index = cart.findIndex((item) => item.id === id);
      if (index < 0) return;

      if (inc) {
        if (cart[index].qty >= MAX_QTY) {
          announceCart(`Quantidade máxima de ${MAX_QTY} unidades atingida.`);
          return;
        }
        cart[index].qty += 1;
        announceCart("Quantidade aumentada.");
      }
      if (dec) {
        cart[index].qty -= 1;
        if (cart[index].qty <= 0) cart.splice(index, 1);
        announceCart("Quantidade reduzida.");
      }
      if (remove) {
        cart.splice(index, 1);
        announceCart("Item removido.");
      }
      saveCart();
    });

    $("#clear-cart")?.addEventListener("click", () => {
      if (!cart.length) {
        announceCart("O carrinho já está vazio.");
        return;
      }
      cart = [];
      saveCart();
      announceCart("Carrinho limpo.");
    });

    $("#send-cart")?.addEventListener("click", () => {
      if (!cart.length) {
        announceCart("Adicione ao menos uma pizza antes de enviar.");
        return;
      }
      if (!whatsappReady) {
        announceCart("O número do WhatsApp não está configurado corretamente.");
        return;
      }

      const lines = ["Olá, Forno Dona Rosa! Vim pelo site e gostaria de pedir:", ""];
      cart.forEach((item, index) => {
        const names = productNames(item);
        const size = pricing.sizes?.[item.size]?.label || item.size;
        const crust = pricing.crusts?.[item.crust]?.label || item.crust;
        lines.push(
          `${index + 1}. ${names.second ? `${names.first} + ${names.second}` : names.first}`,
          `Tamanho: ${size}`,
          `Borda: ${crust}`,
          `Quantidade: ${item.qty}`,
          `Subtotal demonstrativo: ${money(item.total)}`,
        );
        if (item.remove) lines.push(`Remover: ${item.remove}`);
        if (item.notes) lines.push(`Observações: ${item.notes}`);
        lines.push("");
      });
      lines.push(
        `Subtotal demonstrativo do carrinho: ${money(cart.reduce((sum, item) => sum + item.total, 0))}`,
        "",
        "Pode confirmar disponibilidade, valor final e entrega para mim?",
      );
      const opened = window.open(whatsappUrl(lines.join("\n")), "_blank", "noopener,noreferrer");
      if (opened) opened.opener = null;
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
        text: "Adicionar ao carrinho",
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
    if (pizzaId && menuById.has(pizzaId)) base.searchParams.set("pizza", pizzaId);
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
      text: `Conheça a pizza ${product.name} da Forno Dona Rosa.`,
      url: safeShareUrl(id),
    });
  }

  function initShare() {
    $("#share-site")?.addEventListener("click", () =>
      share({
        title: "Pizzaria Forno Dona Rosa",
        text: "48 horas de paciência. 90 segundos de fogo.",
        url: safeShareUrl(),
      }),
    );

    const id = new URLSearchParams(location.search).get("pizza");
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

  function initHours() {
    const note = $("#hours-note");
    const status = $("#business-status span:last-child");
    if (!cfg.businessHours) {
      const text = cleanText(cfg.businessHoursNote, 220) || "Consulte disponibilidade pelo WhatsApp.";
      if (note) note.textContent = text;
      if (status) status.textContent = "Consulte disponibilidade pelo WhatsApp";
    }
  }

  function initPWA() {
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
      showTransientStatus("Forno Dona Rosa instalada neste dispositivo.");
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
      if (navigator.onLine) {
        status.hidden = true;
      } else {
        status.textContent = "Você está offline. O cardápio e o carrinho continuam disponíveis.";
        status.hidden = false;
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

  document.addEventListener("DOMContentLoaded", () => {
    persistNormalizedState();
    initWhatsApp();
    initRoute();
    initMenuNav();
    initReveal();
    initFilters();
    initFavoriteList();
    renderMenu();
    initOrder();
    initCart();
    initFinder();
    initShare();
    initHours();
    initPWA();
    initYear();
  });
})();
