(() => {
  "use strict";

  const cfg = window.PIZZARIA_CONFIG || {};
  const kb = window.ROSA_KNOWLEDGE || {};
  const assistantName = cfg.assistant?.name || "Assistente";
  const brandName = cfg.shortName || cfg.businessName || "a empresa";
  const deliveryLabel = window.FORNO_DELIVERY?.serviceAreaLabel || "a área atendida";
  const menu = Array.isArray(window.FORNO_MENU) ? window.FORNO_MENU : [];
  const menuById = new Map(menu.map((item) => [item.id, item]));
  const storageNamespace = String(cfg.storageNamespace || "forno").replace(/[^a-z0-9-]/gi, "-").toLowerCase();
  const SESSION_KEY = `${storageNamespace}-assistant-session-v4`;
  const SESSION_SCHEMA = 4;
  const MAX_INPUT = 240;
  const MAX_HISTORY = 18;
  const MAX_REPLY = 900;
  const MAX_PRODUCTS = 4;
  const MIN_SEND_INTERVAL = 450;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  let previousFocus = null;
  let currentContext = "geral";
  let lastSendAt = 0;
  let lastIntent = "";
  let variationIndex = 0;

  const EMPTY_STATE = Object.freeze({
    messages: [],
    preferences: {},
    lastProductIds: [],
    pendingAction: null,
  });

  const normalize = (value) => String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, " ")
    .replace(/[^a-zA-Z0-9À-ÿ\s-]/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .trim();

  const clean = (value, max = MAX_INPUT) => String(value || "")
    .normalize("NFC")
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);

  const compact = (value) => normalize(value).replace(/[^a-z0-9]/g, "");
  const containsAny = (text, words) => words.some((word) => normalize(text).includes(normalize(word)));
  const safeProduct = (id) => menuById.get(id) || null;
  const money = (value) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value) || 0);

  function sanitizePreferences(raw) {
    if (!raw || typeof raw !== "object") return {};
    const out = {};
    for (const key of ["vegetarian", "vegan", "avoidSpicy", "cheese", "sweet", "drink"]) {
      if (raw[key] === true) out[key] = true;
    }
    if (["suave", "intensa"].includes(raw.intensity)) out.intensity = raw.intensity;
    return out;
  }

  function sanitizePending(raw) {
    if (!raw || typeof raw !== "object") return null;
    if (raw.type === "clear-bag") return { type: "clear-bag" };
    return null;
  }

  const storage = {
    get() {
      try {
        const raw = JSON.parse(sessionStorage.getItem(SESSION_KEY));
        if (!raw || raw.schemaVersion !== SESSION_SCHEMA) return { ...EMPTY_STATE };
        const messages = Array.isArray(raw.messages) ? raw.messages
          .filter((item) => item && ["user", "rosa"].includes(item.role) && typeof item.text === "string")
          .map((item) => ({
            role: item.role,
            text: clean(item.text, MAX_REPLY),
            productIds: Array.isArray(item.productIds) ? item.productIds.filter((id) => menuById.has(id)).slice(0, MAX_PRODUCTS) : [],
          }))
          .slice(-MAX_HISTORY) : [];
        return {
          messages,
          preferences: sanitizePreferences(raw.preferences),
          lastProductIds: Array.isArray(raw.lastProductIds) ? raw.lastProductIds.filter((id) => menuById.has(id)).slice(0, MAX_PRODUCTS) : [],
          pendingAction: sanitizePending(raw.pendingAction),
        };
      } catch {
        return { ...EMPTY_STATE };
      }
    },
    set(state) {
      try {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({
          schemaVersion: SESSION_SCHEMA,
          messages: state.messages.slice(-MAX_HISTORY),
          preferences: sanitizePreferences(state.preferences),
          lastProductIds: state.lastProductIds.filter((id) => menuById.has(id)).slice(0, MAX_PRODUCTS),
          pendingAction: sanitizePending(state.pendingAction),
        }));
        return true;
      } catch { return false; }
    },
    clear() { try { sessionStorage.removeItem(SESSION_KEY); } catch {} },
  };

  let state = storage.get();

  function persistState() { storage.set(state); }

  function create(tag, options = {}) {
    const node = document.createElement(tag);
    if (options.className) node.className = options.className;
    if (options.text !== undefined) node.textContent = String(options.text);
    if (options.attrs) Object.entries(options.attrs).forEach(([key, value]) => node.setAttribute(key, String(value)));
    return node;
  }

  function announce(text) {
    const status = $("#rosa-status");
    if (!status) return;
    status.textContent = "";
    requestAnimationFrame(() => { status.textContent = clean(text, MAX_REPLY); });
  }

  function productImage(product) {
    if (!product?.image) return "";
    return product.image.replace(/\.webp$/, "-384.webp");
  }

  function addProductCards(article, ids) {
    const safeIds = ids.filter((id) => menuById.has(id)).slice(0, MAX_PRODUCTS);
    if (!safeIds.length) return;
    const cards = create("div", { className: "rosa-product-cards", attrs: { "aria-label": "Produtos sugeridos pela Rosa" } });
    safeIds.forEach((id) => {
      const product = menuById.get(id);
      if (!product) return;
      const card = create("article", { className: "rosa-product-card" });
      const image = productImage(product);
      if (image) card.append(create("img", { attrs: { src: image, alt: "", loading: "lazy", decoding: "async", width: "160", height: "160" } }));
      const body = create("div");
      body.append(
        create("strong", { text: product.name }),
        create("span", { text: money(product.basePrice) }),
      );
      if (Array.isArray(product.traits) && product.traits.length) {
        body.append(create("small", { className: "rosa-product-traits", text: product.traits.slice(0, 3).map((trait) => trait.replace("classica", "clássica")).join(" · ") }));
      }
      const actions = create("div", { className: "rosa-product-card__actions" });
      actions.append(
        create("button", { className: "small-action", text: "Adicionar", attrs: { type: "button", "data-rosa-add": product.id, "aria-label": `Adicionar ${product.name} à sacola` } }),
        create("button", { className: "text-button", text: "Ver detalhes", attrs: { type: "button", "data-rosa-details": product.id, "aria-label": `Ver detalhes de ${product.name}` } }),
      );
      body.append(actions);
      card.append(body);
      cards.append(card);
    });
    article.append(cards);
  }

  function addMessage(role, text, persist = true, shouldAnnounce = false, productIds = []) {
    const log = $("#rosa-log");
    if (!log) return;
    const safe = clean(text, MAX_REPLY);
    const safeIds = Array.isArray(productIds) ? productIds.filter((id) => menuById.has(id)).slice(0, MAX_PRODUCTS) : [];
    const article = create("article", { className: `rosa-message rosa-message--${role}` });
    article.append(
      create("span", { className: "sr-only", text: role === "rosa" ? "Rosa diz: " : "Você diz: " }),
      create("p", { text: safe }),
    );
    if (role === "rosa" && safeIds.length) addProductCards(article, safeIds);
    log.append(article);
    log.scrollTop = log.scrollHeight;
    if (persist) {
      state.messages.push({ role, text: safe, productIds: safeIds });
      state.messages = state.messages.slice(-MAX_HISTORY);
      if (role === "rosa" && safeIds.length) state.lastProductIds = safeIds;
      persistState();
    }
    if (role === "rosa" && shouldAnnounce) announce(safe);
  }

  function renderHistory() {
    const log = $("#rosa-log");
    if (!log) return;
    while (log.firstChild) log.firstChild.remove();
    if (!state.messages.length) {
      addMessage("rosa", kb.greeting || `Olá! Eu sou a ${assistantName}, anfitriã digital da ${brandName}.`, true, false);
      return;
    }
    state.messages.forEach((item) => addMessage(item.role, item.text, false, false, item.productIds || []));
  }

  function extractPreferences(text) {
    const normalized = normalize(text);
    const prefs = {};
    if (containsAny(normalized, ["vegana", "vegano", "sem ingrediente animal"])) prefs.vegan = true;
    else if (containsAny(normalized, ["vegetariana", "vegetariano", "sem carne"])) prefs.vegetarian = true;
    if (containsAny(normalized, ["nao picante", "sem pimenta", "pouca pimenta", "nao muito picante"])) prefs.avoidSpicy = true;
    if (containsAny(normalized, ["muito queijo", "queijo", "cremosa", "cremoso"])) prefs.cheese = true;
    if (containsAny(normalized, ["doce", "sobremesa", "chocolate", "nutella"])) prefs.sweet = true;
    if (containsAny(normalized, ["bebida", "refrigerante", "suco", "agua"])) prefs.drink = true;
    if (containsAny(normalized, ["leve", "suave"])) prefs.intensity = "suave";
    if (containsAny(normalized, ["intensa", "intenso", "forte", "marcante"])) prefs.intensity = "intensa";
    return prefs;
  }

  function applyPreferenceOverrides(text) {
    const normalized = normalize(text);
    let changed = false;
    if (containsAny(normalized, ["sem restricoes", "sem restricao", "qualquer sabor", "esqueca minhas preferencias", "limpe minhas preferencias"])) {
      state.preferences = {};
      changed = true;
    }
    if (containsAny(normalized, ["pode ter carne", "quero carne", "com carne", "nao precisa ser vegetar"])) {
      delete state.preferences.vegan;
      delete state.preferences.vegetarian;
      changed = true;
    }
    if (containsAny(normalized, ["pode ser picante", "quero picante", "com pimenta"])) {
      delete state.preferences.avoidSpicy;
      changed = true;
    }
    if (containsAny(normalized, ["quero salgada", "quero salgado", "sem doce"])) {
      delete state.preferences.sweet;
      changed = true;
    }
    if (containsAny(normalized, ["quero pizza", "so pizza", "só pizza"])) {
      delete state.preferences.drink;
      changed = true;
    }
    if (changed) persistState();
  }

  function mergePreferences(next) {
    if (!next || !Object.keys(next).length) return;
    state.preferences = { ...state.preferences, ...next };
    if (next.vegan) state.preferences.vegetarian = true;
    persistState();
  }

  function productMatchesPreferences(product, prefs) {
    const traits = Array.isArray(product.traits) ? product.traits : [];
    if (prefs.vegan && !traits.includes("vegana")) return false;
    if (prefs.vegetarian && !traits.includes("vegetariana")) return false;
    if (prefs.avoidSpicy && traits.includes("picante")) return false;
    if (prefs.cheese && !traits.includes("queijo") && !traits.includes("cremosa")) return false;
    if (prefs.sweet && !traits.includes("doce")) return false;
    if (prefs.drink && product.type !== "bebida") return false;
    if (prefs.intensity && !traits.includes(prefs.intensity)) return false;
    return true;
  }

  function recommendationScore(product, prefs) {
    const traits = Array.isArray(product.traits) ? product.traits : [];
    let score = 0;
    if (product.id === "dona-rosa") score += 0.5;
    if (prefs.vegan && traits.includes("vegana")) score += 4;
    if (prefs.vegetarian && traits.includes("vegetariana")) score += 3;
    if (prefs.cheese && traits.includes("queijo")) score += 3;
    if (prefs.sweet && traits.includes("doce")) score += 4;
    if (prefs.drink && product.type === "bebida") score += 4;
    if (prefs.intensity && traits.includes(prefs.intensity)) score += 3;
    if (prefs.avoidSpicy && !traits.includes("picante")) score += 1;
    if (traits.includes("autoral")) score += 0.4;
    return score;
  }

  function recommendations(text) {
    const current = { ...state.preferences, ...extractPreferences(text) };
    const normalized = normalize(text);
    const relativeSet = containsAny(normalized, ["dessas", "desses", "entre elas", "entre eles", "qual delas", "qual deles", "essas opcoes", "essas opções"]);
    const source = relativeSet && state.lastProductIds.length
      ? state.lastProductIds.map(safeProduct).filter(Boolean)
      : menu;
    let candidates = source.filter((item) => productMatchesPreferences(item, current));
    if (!candidates.length && current.intensity) {
      const relaxed = { ...current };
      delete relaxed.intensity;
      candidates = source.filter((item) => productMatchesPreferences(item, relaxed));
    }
    if (!candidates.length) candidates = relativeSet ? source : menu.filter((item) => item.type !== "bebida");
    return candidates
      .map((product) => ({ product, score: recommendationScore(product, current) }))
      .sort((a, b) => b.score - a.score || a.product.basePrice - b.product.basePrice)
      .slice(0, 3)
      .map((entry) => entry.product);
  }

  function productAliases(product) {
    const aliases = [product.name, product.id];
    if (product.id === "dona-rosa") aliases.push("rosa");
    if (product.id === "quatro-formaggi") aliases.push("quatro queijos", "4 queijos");
    if (product.id === "coca-lata") aliases.push("coca", "coca lata", "coca 350", "coca cola 350");
    if (product.id === "coca-zero-lata") aliases.push("coca", "coca zero", "coca zero lata");
    if (product.id === "coca-2l") aliases.push("coca", "coca 2l", "coca 2 litros", "coca cola 2l");
    if (product.id === "guarana-lata") aliases.push("guarana", "guarana lata", "guarana 350");
    if (product.id === "guarana-2l") aliases.push("guarana", "guarana 2l", "guarana 2 litros");
    return aliases.map(normalize);
  }

  function findProducts(text) {
    const normalized = normalize(text);
    const compactText = compact(text);
    const matches = [];
    menu.forEach((item) => {
      let score = 0;
      for (const alias of productAliases(item)) {
        const aliasCompact = compact(alias);
        if (!alias) continue;
        if (normalized.includes(alias)) score = Math.max(score, alias.split(" ").length >= 2 ? 8 : 5);
        else if (aliasCompact.length >= 5 && compactText.includes(aliasCompact)) score = Math.max(score, 7);
      }
      if (score) matches.push({ product: item, score });
    });
    const sorted = matches.sort((a, b) => b.score - a.score || b.product.name.length - a.product.name.length);
    if (!sorted.length) return [];
    const bestScore = sorted[0].score;
    return sorted.filter((entry) => entry.score === bestScore).map((entry) => entry.product);
  }

  function resolveOrdinalReference(text) {
    if (!state.lastProductIds.length) return null;
    const normalized = normalize(text);
    const ordinals = [
      { words: ["primeira", "primeiro", "1"], index: 0 },
      { words: ["segunda", "segundo", "2"], index: 1 },
      { words: ["terceira", "terceiro", "3"], index: 2 },
      { words: ["quarta", "quarto", "4"], index: 3 },
    ];
    for (const item of ordinals) {
      if (item.words.some((word) => normalized === word || normalized.includes(` ${word}`) || normalized.startsWith(`${word} `))) {
        return safeProduct(state.lastProductIds[item.index]);
      }
    }
    if (containsAny(normalized, ["essa", "esse", "a anterior", "a ultima", "a última"])) return safeProduct(state.lastProductIds[0]);
    return null;
  }

  function findComparisonProducts(text) {
    const direct = findProducts(text);
    if (direct.length >= 2) return direct.slice(0, 2);
    return [];
  }

  function formatProduct(product) {
    return product ? `${product.name}: ${product.description} A partir de ${money(product.basePrice)}.` : "";
  }

  function compareProducts(products) {
    if (products.length < 2) return null;
    const [a, b] = products;
    const traitsA = new Set(a.traits || []);
    const traitsB = new Set(b.traits || []);
    const descriptor = (product, traits) => {
      const bits = [];
      if (traits.has("suave")) bits.push("mais suave");
      if (traits.has("intensa")) bits.push("mais intensa");
      if (traits.has("queijo")) bits.push("com destaque para queijos");
      if (traits.has("picante")) bits.push("picante");
      if (traits.has("vegetariana")) bits.push("vegetariana");
      if (traits.has("vegana")) bits.push("vegana");
      if (traits.has("doce")) bits.push("doce");
      if (!bits.length) bits.push(product.badge ? normalize(product.badge) : "equilibrada");
      return bits.slice(0, 3).join(", ");
    };
    let preferred = a;
    const prefs = state.preferences;
    if (productMatchesPreferences(b, prefs) && !productMatchesPreferences(a, prefs)) preferred = b;
    else if (recommendationScore(b, prefs) > recommendationScore(a, prefs)) preferred = b;
    return `${a.name} é ${descriptor(a, traitsA)}; ${b.name} é ${descriptor(b, traitsB)}. Pelo que você me contou nesta conversa, eu tenderia à ${preferred.name}. Posso adicionar uma delas ou abrir os detalhes.`;
  }

  function explainRecommendation(product) {
    if (!product) return "Eu priorizo o que você me diz sobre intensidade, queijo, restrições e tipo de produto.";
    const reasons = [];
    const traits = product.traits || [];
    if (state.preferences.vegan && traits.includes("vegana")) reasons.push("você pediu uma opção vegana");
    else if (state.preferences.vegetarian && traits.includes("vegetariana")) reasons.push("você pediu uma opção vegetariana");
    if (state.preferences.intensity && traits.includes(state.preferences.intensity)) reasons.push(`você prefere algo ${state.preferences.intensity}`);
    if (state.preferences.cheese && traits.includes("queijo")) reasons.push("você demonstrou preferência por queijo");
    if (state.preferences.avoidSpicy && !traits.includes("picante")) reasons.push("você pediu para evitar picância");
    if (state.preferences.sweet && traits.includes("doce")) reasons.push("você está procurando sobremesa");
    if (!reasons.length) reasons.push("ela combina bem com o perfil de sabor que apareceu nesta conversa");
    return `Sugeri ${product.name} porque ${reasons.join(" e ")}.`;
  }

  function bagSummary() {
    const summary = window.FORNO_APP?.getBagSummary?.();
    if (!summary?.count) return "Sua sacola está vazia. Posso sugerir uma pizza para começar.";
    const parts = [];
    if (summary.pizzas) parts.push(`${summary.pizzas} ${summary.pizzas === 1 ? "pizza" : "pizzas"}`);
    if (summary.drinks) parts.push(`${summary.drinks} ${summary.drinks === 1 ? "bebida" : "bebidas"}`);
    return `Sua sacola tem ${summary.count} ${summary.count === 1 ? "item" : "itens"}${parts.length ? `: ${parts.join(" e ")}` : ""}. Subtotal demonstrativo: ${summary.totalLabel}. Nada é enviado automaticamente.`;
  }

  function hourResponse() {
    const live = window.FORNO_APP?.getBusinessStatus?.();
    const schedule = "Funcionamos de segunda a sexta, das 18h à 0h, e aos sábados e domingos, das 16h à 0h.";
    return live?.text ? `${schedule} ${live.text}` : schedule;
  }

  function contextualIntro() {
    const map = {
      hero: "Posso te indicar um sabor e já te levar ao pedido.",
      cardapio: "Me diga se prefere algo clássico, intenso, vegetariano, com bastante queijo ou doce.",
      assinatura: "A Dona Rosa é a escolha mais autoral da casa; posso explicar o sabor ou comparar com outra pizza.",
      pedido: "Posso explicar tamanhos, bordas, meio a meio ou sugerir combinações.",
      sacola: "Posso revisar sua sacola, sugerir bebida ou sobremesa e preparar você para confirmar no WhatsApp.",
      localizacao: "Posso informar endereço, horário e te encaminhar para a rota ou WhatsApp.",
    };
    return map[currentContext] || "Posso te orientar pelo cardápio, pedido, sacola e informações da pizzaria.";
  }

  const intents = [
    { id: "clearBag", score: 7, words: ["esvazie minha sacola", "esvaziar sacola", "limpe minha sacola", "limpar sacola", "apague meu pedido"] },
    { id: "confirm", score: 7, words: ["sim confirme", "confirmo", "pode esvaziar", "sim pode", "sim"] },
    { id: "cancel", score: 7, words: ["nao", "não", "cancelar", "cancela", "deixa"] },
    { id: "compare", score: 6, words: ["comparar", "compare", "diferenca", "diferença"] },
    { id: "why", score: 6, words: ["por que", "porque sugeriu", "porque recomendou"] },
    { id: "greeting", score: 3, words: ["oi", "ola", "bom dia", "boa tarde", "boa noite", "quem e voce"] },
    { id: "privacy", score: 4, words: ["privacidade", "api", "meus dados", "dados da conversa", "internet"] },
    { id: "guide", score: 7, words: ["me ajude passo a passo", "ajuda passo a passo", "nao sei mexer", "não sei mexer", "como faco o pedido", "como faço o pedido"] },
    { id: "delivery", score: 7, words: ["preencher entrega", "dados de entrega", "endereco de entrega", "endereço de entrega", "finalizar pedido", "meu cep", "cep"] },
    { id: "hours", score: 4, words: ["horario", "hora", "aberto", "abre", "fecha", "funciona"] },
    { id: "location", score: 4, words: ["endereco da pizzaria", "endereço da pizzaria", "onde fica", "localizacao", "como chegar", "rota"] },
    { id: "contact", score: 4, words: ["telefone", "whatsapp", "contato", "falar com a pizzaria"] },
    { id: "instagram", score: 4, words: ["instagram", "rede social"] },
    { id: "email", score: 4, words: ["email", "e-mail"] },
    { id: "night", score: 4, words: ["monte uma noite", "monta uma noite", "combinacao", "combo", "complete meu pedido"] },
    { id: "add", score: 6, words: ["adicione", "adicionar", "coloque", "colocar", "quero essa", "quero a primeira", "quero a segunda"] },
    { id: "details", score: 5, words: ["detalhes", "mostre essa", "ver essa", "abrir essa"] },
    { id: "half", score: 4, words: ["meio a meio", "metade", "dois sabores"] },
    { id: "size", score: 3, words: ["tamanho", "media", "grande", "familia"] },
    { id: "crust", score: 4, words: ["borda", "catupiry", "cheddar"] },
    { id: "bag", score: 4, words: ["sacola", "meu pedido", "revisar", "o que pedi"] },
    { id: "ingredients", score: 3, words: ["ingrediente", "leva", "tem na", "composicao"] },
    { id: "recommend", score: 4, words: ["recomenda", "indique", "sugere", "qual pizza", "quero algo", "melhor pizza", "pizza doce", "vegetar", "mais leve", "mais intensa", "mais forte"] },
    { id: "drinks", score: 3, words: ["bebida", "refrigerante", "coca", "guarana", "sprite", "agua", "suco"] },
    { id: "menu", score: 3, words: ["cardapio", "sabores", "pizzas"] },
    { id: "order", score: 3, words: ["pedido", "pedir", "montar"] },
    { id: "thanks", score: 4, words: ["obrigado", "obrigada", "valeu", "tchau"] },
  ];

  function classify(text) {
    const normalized = normalize(text);
    const products = findProducts(normalized);
    const ordinalProduct = resolveOrdinalReference(normalized);
    const tokens = normalized.split(" ");
    if (products.length >= 2 && tokens.includes("ou")) {
      return { intent: "compare", confidence: 0.98, score: 10, products, ordinalProduct };
    }
    let best = { intent: "fallback", confidence: 0.25, score: 0, products, ordinalProduct };
    for (const intent of intents) {
      const hits = intent.words.filter((word) => normalized.includes(normalize(word))).length;
      const score = hits * intent.score;
      if (score > best.score) best = { intent: intent.id, confidence: Math.min(0.98, 0.48 + hits * 0.17), score, products, ordinalProduct };
    }
    if (best.intent !== "fallback") return best;
    if (products.length === 1) return { intent: "product", confidence: 0.98, score: 1, products, ordinalProduct };
    if (ordinalProduct) return { intent: "product", confidence: 0.85, score: 1, products: [ordinalProduct], ordinalProduct };
    if (Object.keys(extractPreferences(normalized)).length) {
      return { intent: "recommend", confidence: 0.82, score: 2, products, ordinalProduct };
    }
    return best;
  }

  function vary(options) {
    if (!Array.isArray(options) || !options.length) return "";
    variationIndex = (variationIndex + 1) % options.length;
    return options[variationIndex];
  }

  function ambiguousChoice(products, actionLabel = "escolher") {
    const ids = products.slice(0, MAX_PRODUCTS).map((p) => p.id);
    state.lastProductIds = ids;
    persistState();
    return {
      text: `Encontrei mais de uma opção. Qual delas você quer ${actionLabel}?`,
      productIds: ids,
    };
  }

  function handlePendingAction(text) {
    if (!state.pendingAction) return null;
    const normalized = normalize(text);
    if (containsAny(normalized, ["nao", "cancelar", "cancela", "deixa"])) {
      state.pendingAction = null;
      persistState();
      return { text: "Certo. Não alterei sua sacola.", intent: "cancel", confidence: 1 };
    }
    if (containsAny(normalized, ["sim", "confirmo", "pode", "confirmar"])) {
      if (state.pendingAction.type === "clear-bag") {
        const cleared = window.FORNO_APP?.clearBag?.();
        state.pendingAction = null;
        persistState();
        return { text: cleared ? "Pronto. Sua sacola foi esvaziada." : "Sua sacola já está vazia ou não consegui concluir a ação.", intent: "confirm", confidence: 1 };
      }
    }
    return { text: "Antes de continuar: você confirma que quer esvaziar toda a sacola? Responda “sim” ou “não”.", intent: "pending", confidence: 1 };
  }

  function respond(rawText) {
    const text = clean(rawText);
    const normalized = normalize(text);
    if (!normalized) return { text: "Escreva o que você gostaria de saber e eu te ajudo.", confidence: 1, intent: "empty" };

    const pending = handlePendingAction(normalized);
    if (pending) return pending;

    applyPreferenceOverrides(normalized);
    const nextPrefs = extractPreferences(normalized);
    mergePreferences(nextPrefs);
    const result = classify(normalized);
    if (result.confidence < 0.48) return { text: `Não tenho certeza do que você quis dizer. ${contextualIntro()}`, confidence: result.confidence, intent: "fallback" };

    const directProduct = result.products?.[0] || result.ordinalProduct || null;
    let reply = "";
    let productIds = [];

    switch (result.intent) {
      case "product":
        reply = formatProduct(directProduct);
        productIds = directProduct ? [directProduct.id] : [];
        break;
      case "greeting":
        reply = `${vary([`Olá! Eu sou a ${assistantName}, anfitriã digital da ${brandName}.`, `Oi! ${assistantName} por aqui — sua anfitriã digital da casa.`])} ${contextualIntro()}`;
        break;
      case "privacy":
        reply = "Eu funciono localmente nesta página. O histórico curto e suas preferências temporárias ficam somente nesta sessão do navegador e não são enviados para uma API externa.";
        break;
      case "guide": {
        const summary = window.FORNO_APP?.getBagSummary?.();
        reply = summary?.count
          ? `Você já escolheu ${summary.count} ${summary.count === 1 ? "item" : "itens"}. O próximo passo é preencher o endereço de entrega e depois conferir tudo antes de abrir o WhatsApp. Se quiser, toque em “Preencher entrega”.`
          : "Vamos por partes. Primeiro escolha uma pizza no cardápio e toque em “Adicionar média” ou “Personalizar”. Quando terminar, abra a Sacola. Eu continuo te ajudando daqui.";
        break;
      }
      case "delivery": {
        const summary = window.FORNO_APP?.getBagSummary?.();
        if (!summary?.count) reply = "Sua sacola ainda está vazia. Escolha pelo menos um item antes de preencher os dados de entrega.";
        else {
          reply = `Sua sacola está pronta para a próxima etapa. Vou abrir os dados de entrega; o CEP pode preencher rua, bairro, cidade e estado automaticamente, e a entrega é somente em ${deliveryLabel}.`;
          window.setTimeout(() => { closeRosa(); window.setTimeout(() => window.FORNO_APP?.openCheckout?.(), 0); }, 140);
        }
        break;
      }
      case "hours": reply = hourResponse(); break;
      case "location": reply = `Estamos na ${cfg.address}. O botão “Como chegar” na seção de localização abre a rota.`; break;
      case "contact": reply = `O WhatsApp é ${cfg.whatsappDisplay}. Use o atendimento para confirmar disponibilidade, valor final e entrega.`; break;
      case "instagram": reply = `Nosso Instagram é @${cfg.instagram}.`; break;
      case "email": reply = `Nosso e-mail é ${cfg.email}.`; break;
      case "drinks": {
        const picks = menu.filter((item) => item.type === "bebida").slice(0, 4);
        reply = "Posso te mostrar algumas bebidas. Se disser exatamente qual quer, eu adiciono; se houver ambiguidade, eu pergunto antes de agir.";
        productIds = picks.map((p) => p.id);
        break;
      }
      case "night": {
        const picks = ["dona-rosa", "margherita", "coca-2l", "nutella"].map(safeProduct).filter(Boolean);
        reply = "Para uma noite equilibrada, eu montaria Dona Rosa + Margherita Clássica + Coca-Cola 2 L + Nutella com Morango. É uma sugestão demonstrativa e você pode trocar qualquer item.";
        productIds = picks.map((p) => p.id);
        break;
      }
      case "compare": {
        const products = findComparisonProducts(normalized);
        if (products.length < 2) {
          reply = "Diga o nome de duas pizzas para eu comparar. Exemplo: “Dona Rosa ou Quatro Formaggi?”.";
        } else {
          reply = compareProducts(products);
          productIds = products.map((p) => p.id);
        }
        break;
      }
      case "why": {
        const product = result.products?.[0] || safeProduct(state.lastProductIds[0]);
        reply = explainRecommendation(product);
        productIds = product ? [product.id] : [];
        break;
      }
      case "add": {
        const ordinal = result.ordinalProduct || resolveOrdinalReference(normalized);
        const candidates = ordinal ? [ordinal] : findProducts(normalized);
        if (candidates.length > 1 && !ordinal) return { ...ambiguousChoice(candidates, "adicionar"), confidence: 0.96, intent: "disambiguate" };
        const found = ordinal || candidates[0];
        if (found && window.FORNO_APP?.addProduct) {
          const added = window.FORNO_APP.addProduct(found.id);
          reply = added === false
            ? `Não consegui adicionar ${found.name} agora. Revise a sacola e tente novamente.`
            : `Adicionei ${found.name} à sua sacola. Quer que eu sugira algo para combinar?`;
          productIds = [found.id];
        } else {
          reply = "Diga o nome exato da pizza ou bebida. Se eu encontrar mais de uma opção, vou pedir que você escolha antes de adicionar.";
        }
        break;
      }
      case "details": {
        const product = result.ordinalProduct || result.products?.[0] || safeProduct(state.lastProductIds[0]);
        if (product && window.FORNO_APP?.openProduct) {
          window.setTimeout(() => window.FORNO_APP.openProduct(product.id), 0);
          reply = `Abri os detalhes de ${product.name}.`;
          productIds = [product.id];
        } else reply = "Diga qual produto você quer ver em detalhes.";
        break;
      }
      case "clearBag":
        state.pendingAction = { type: "clear-bag" };
        persistState();
        reply = "Esvaziar a sacola remove todos os itens. Você confirma? Responda “sim” ou “não”.";
        break;
      case "half": reply = "No montador, marque “Fazer meio a meio” e escolha um segundo sabor diferente. Nesta demonstração, o cálculo usa o maior preço entre os dois sabores."; break;
      case "size": reply = "Temos tamanhos Média, Grande e Família. A quantidade de pessoas atendidas não foi fornecida, então confirme esse detalhe no WhatsApp."; break;
      case "crust": reply = "Você pode escolher borda tradicional, Catupiry ou Cheddar. Os adicionais exibidos são demonstrativos."; break;
      case "bag": reply = bagSummary(); break;
      case "ingredients": {
        const product = directProduct || safeProduct(state.lastProductIds[0]);
        reply = product ? formatProduct(product) : `Posso explicar qualquer item do cardápio. Diga o nome do produto que você quer conhecer.`;
        productIds = product ? [product.id] : [];
        break;
      }
      case "recommend": {
        const picks = recommendations(normalized);
        const first = picks[0];
        reply = first
          ? `Eu começaria pela ${first.name}. ${explainRecommendation(first)} Também deixei outras opções compatíveis abaixo.`
          : "Não encontrei uma combinação segura com esses critérios. Posso relaxar uma preferência e tentar de novo.";
        productIds = picks.map((p) => p.id);
        break;
      }
      case "menu": reply = `O cardápio demonstrativo tem ${menu.filter((i) => i.type !== "bebida").length} pizzas e ${menu.filter((i) => i.type === "bebida").length} bebidas. Você pode me dizer o perfil de sabor que procura.`; break;
      case "order": reply = "Você escolhe o produto, personaliza quando necessário, revisa a sacola, preenche o endereço de entrega e confere tudo antes de abrir o WhatsApp. Nada é enviado automaticamente."; break;
      case "thanks": reply = vary(["Foi um prazer te ajudar. Quando quiser, eu continuo daqui.", "Sempre um prazer. Se quiser revisar a sacola antes de sair, eu faço isso com você."]); break;
      default: reply = `Não tenho certeza do que você quis dizer. ${contextualIntro()}`;
    }

    lastIntent = result.intent;
    if (productIds.length) state.lastProductIds = productIds.slice(0, MAX_PRODUCTS);
    persistState();
    return { text: reply, confidence: result.confidence, intent: result.intent, productIds };
  }

  function quickActionModel() {
    const summary = window.FORNO_APP?.getBagSummary?.();
    if (currentContext === "sacola" || summary?.count) {
      return [
        ["Revise minha sacola", "Revisar sacola"],
        ["Me sugira uma bebida", "Adicionar bebida"],
        ["Me mostre uma sobremesa", "Ver sobremesas"],
        ["Quero preencher os dados de entrega", "Preencher entrega"],
        ["Esvazie minha sacola", "Esvaziar sacola"],
      ];
    }
    if (state.lastProductIds.length >= 2) {
      const [a, b] = state.lastProductIds.map(safeProduct);
      return [
        [`Compare ${a?.name || "a primeira"} e ${b?.name || "a segunda"}`, "Comparar opções"],
        ["Adicione a primeira", "Adicionar 1ª opção"],
        ["Por que você recomendou essa?", "Por que essa?"],
        ["Quero algo diferente", "Outra sugestão"],
      ];
    }
    return [
      ["Me ajude passo a passo", "Ajude passo a passo"],
      ["Me indique uma pizza", "Indique uma pizza"],
      ["Quero algo vegetariano", "Algo vegetariano"],
      ["Quero algo leve e não picante", "Leve e sem picância"],
      ["Me mostre as bebidas", "Ver bebidas"],
      ["Monte uma noite para mim", "Monte uma noite"],
      ["Qual é o horário?", "Horário"],
    ];
  }

  function renderQuickActions() {
    const root = $("#rosa-quick-actions");
    if (!root) return;
    while (root.firstChild) root.firstChild.remove();
    quickActionModel().forEach(([prompt, label]) => {
      root.append(create("button", { text: label, attrs: { type: "button", "data-rosa-prompt": prompt } }));
    });
  }

  function updateInputCount() {
    const input = $("#rosa-input");
    const output = $("#rosa-input-count");
    if (!input || !output) return;
    const length = [...input.value].length;
    output.textContent = length >= 180 ? `${length} de ${MAX_INPUT}` : "";
    output.hidden = length < 180;
  }

  function openRosa(trigger, context = "geral", seededPrompt = "") {
    const dialog = $("#rosa-dialog");
    if (!dialog?.showModal) return;
    currentContext = context || "geral";
    previousFocus = trigger instanceof HTMLElement ? trigger : document.activeElement;
    if (!dialog.open) dialog.showModal();
    renderHistory();
    renderQuickActions();
    const input = $("#rosa-input");
    input?.focus();
    updateInputCount();
    if (seededPrompt) submitPrompt(seededPrompt);
  }

  function closeRosa() {
    const dialog = $("#rosa-dialog");
    if (dialog?.open) dialog.close();
  }

  function submitPrompt(raw) {
    const now = Date.now();
    if (now - lastSendAt < MIN_SEND_INTERVAL) {
      announce("Envie uma mensagem por vez. Rosa já está processando sua última pergunta.");
      return;
    }
    lastSendAt = now;
    const text = clean(raw);
    if (!text) return;
    addMessage("user", text, true, false);
    const response = respond(text);
    window.setTimeout(() => {
      addMessage("rosa", response.text, true, true, response.productIds || []);
      renderQuickActions();
    }, 80);
  }

  function inspect(text) {
    const normalized = normalize(text);
    const result = classify(normalized);
    return Object.freeze({
      normalized,
      intent: result.intent,
      confidence: result.confidence,
      productIds: (result.products || []).map((p) => p.id).slice(0, MAX_PRODUCTS),
      ordinalProductId: result.ordinalProduct?.id || null,
      preferences: Object.freeze({ ...extractPreferences(normalized) }),
    });
  }

  function init() {
    const dialog = $("#rosa-dialog");
    const form = $("#rosa-form");
    const input = $("#rosa-input");
    $$('[data-rosa-open]').forEach((button) => button.addEventListener("click", () => openRosa(button, button.dataset.rosaContext || "geral", button.dataset.rosaPrompt || "")));
    $("#rosa-close")?.addEventListener("click", closeRosa);
    dialog?.addEventListener("close", () => {
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
      previousFocus = null;
    });
    dialog?.addEventListener("cancel", (event) => { event.preventDefault(); closeRosa(); });
    dialog?.addEventListener("click", (event) => { if (event.target === dialog) closeRosa(); });
    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      const value = clean(input?.value);
      if (!value) return;
      if (input) input.value = "";
      updateInputCount();
      submitPrompt(value);
    });
    input?.addEventListener("input", updateInputCount);
    $("#rosa-quick-actions")?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-rosa-prompt]");
      if (button) submitPrompt(button.dataset.rosaPrompt || button.textContent);
    });
    $("#rosa-log")?.addEventListener("click", (event) => {
      const addButton = event.target.closest("[data-rosa-add]");
      const detailsButton = event.target.closest("[data-rosa-details]");
      if (addButton) {
        const product = menuById.get(addButton.dataset.rosaAdd);
        const added = product && window.FORNO_APP?.addProduct?.(product.id);
        announce(added ? `${product.name} adicionado à sacola.` : `Não consegui adicionar ${product?.name || "esse item"} agora.`);
        renderQuickActions();
        return;
      }
      if (detailsButton) {
        const product = menuById.get(detailsButton.dataset.rosaDetails);
        if (!product) return;
        closeRosa();
        window.setTimeout(() => window.FORNO_APP?.openProduct?.(product.id), 0);
      }
    });
    $("#rosa-clear")?.addEventListener("click", () => {
      state = { messages: [], preferences: {}, lastProductIds: [], pendingAction: null };
      storage.clear();
      renderHistory();
      renderQuickActions();
      $("#rosa-input")?.focus();
      announce("Conversa e preferências temporárias limpas.");
    });
    renderHistory();
    renderQuickActions();
    updateInputCount();
  }

  document.addEventListener("DOMContentLoaded", init);
  const publicApi = {
    open: openRosa,
    classify,
    inspect,
    getLastIntent: () => lastIntent,
    getSessionSnapshot: () => Object.freeze({
      preferences: Object.freeze({ ...state.preferences }),
      lastProductIds: Object.freeze([...state.lastProductIds]),
      hasPendingAction: Boolean(state.pendingAction),
    }),
  };
  if (window.__FORNO_TEST__ === true) publicApi.__testRespond = respond;
  window.ROSA = Object.freeze(publicApi);
})();
