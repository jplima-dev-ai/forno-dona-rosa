(() => {
  "use strict";

  const STATE = Object.freeze({
    ACTIVE_ORDER: "active-order",
    CLOSED: "closed",
    RETURNING: "returning",
    GUIDED: "guided-choice",
    DISCOVER: "discover-house",
    NEW: "new-visitor",
  });

  let experienceIntent = "";
  let lastState = "";
  let root = null;
  let observer = null;

  const bag = () => window.FORNO_APP?.getBagSummary?.() || { count: 0, pizzas: 0, drinks: 0, total: 0, totalLabel: "" };
  const business = () => window.FORNO_APP?.getBusinessStatus?.() || window.FORNO_BUSINESS_STATUS?.getStatus?.() || null;
  const hasLastOrder = () => {
    const section = document.querySelector("#returning-order");
    return Boolean(section && !section.hidden);
  };

  function snapshot() {
    const summary = bag();
    const status = business();
    return Object.freeze({
      intent: experienceIntent,
      bag: Object.freeze({ ...summary }),
      business: status ? Object.freeze({ ...status }) : null,
      hasLastOrder: hasLastOrder(),
    });
  }

  function chooseState(snap = snapshot()) {
    if (snap.bag.count > 0) return STATE.ACTIVE_ORDER;
    if (snap.business && (snap.business.isOpen === false || snap.business.open === false)) return STATE.CLOSED;
    if (snap.hasLastOrder) return STATE.RETURNING;
    if (snap.intent === "guided-choice") return STATE.GUIDED;
    if (snap.intent === "discover-house") return STATE.DISCOVER;
    return STATE.NEW;
  }

  function modelFor(state, snap = snapshot()) {
    switch (state) {
      case STATE.ACTIVE_ORDER: {
        const needsDrink = snap.bag.pizzas > 0 && snap.bag.drinks === 0;
        return {
          kicker: "Seu pedido está em andamento",
          title: `${snap.bag.count} ${snap.bag.count === 1 ? "item na Sacola" : "itens na Sacola"}.`,
          copy: needsDrink
            ? "Você já escolheu pizza. Revise a Sacola agora ou complete com uma bebida gelada sem perder o que já montou."
            : "Seu pedido já tem uma boa base. Revise quantidades e subtotal antes de seguir para entrega ou retirada.",
          primary: { kind: "bag", label: "Revisar Sacola" },
          secondary: needsDrink
            ? { kind: "rosa", label: "Sugerir uma bebida", prompt: "Minha sacola já tem pizza. Sugira uma bebida para completar.", context: "sacola" }
            : { kind: "rosa", label: "Revisar com a Rosa", prompt: "Revise minha sacola e diga se falta algo.", context: "sacola" },
        };
      }
      case STATE.CLOSED:
        return {
          kicker: "Você pode escolher com calma",
          title: "A casa está fechada agora — o cardápio continua aberto para você.",
          copy: "Monte sua Sacola sem pressa. Horários disponíveis e confirmação final aparecem antes de abrir o WhatsApp.",
          primary: { kind: "link", label: "Explorar o cardápio", href: "menu/" },
          secondary: { kind: "rosa", label: "Perguntar o horário", prompt: "Qual é o horário e quando posso pedir?", context: "horario" },
        };
      case STATE.RETURNING:
        return {
          kicker: "Bom te ver de novo",
          title: "Seu último pedido ainda está disponível neste dispositivo.",
          copy: "Você pode repeti-lo com os preços atuais ou começar outra escolha do zero.",
          primary: { kind: "repeat", label: "Adicionar último pedido" },
          secondary: { kind: "link", label: "Escolher algo diferente", href: "menu/" },
        };
      case STATE.GUIDED:
        return {
          kicker: "Escolha guiada",
          title: "Você não precisa percorrer o cardápio inteiro.",
          copy: "Conte para a Rosa se quer algo leve, intenso, cremoso, vegetariano ou regional e ela cruza seu desejo com o catálogo atual.",
          primary: { kind: "rosa", label: "Rosa, me ajude a escolher", prompt: "Me ajude a escolher uma pizza passo a passo.", context: "cardapio" },
          secondary: { kind: "link", label: "Ver todos os sabores", href: "menu/" },
        };
      case STATE.DISCOVER:
        return {
          kicker: "Conheça a Dona Rosa",
          title: "Primeiro a história. Depois, a pizza certa para sua noite.",
          copy: "Veja o processo artesanal, a identidade da casa e os sabores assinatura antes de decidir o pedido.",
          primary: { kind: "link", label: "Conhecer nossa história", href: "about/" },
          secondary: { kind: "link", label: "Ver sabores assinatura", href: "menu/" },
        };
      default:
        return {
          kicker: "Comece pelo que você quer agora",
          title: "Pedido rápido ou ajuda para escolher — você decide o caminho.",
          copy: "O cardápio leva direto aos sabores. A Rosa ajuda quando você quer comparar, descobrir ou montar uma combinação.",
          primary: { kind: "link", label: "Quero minha pizza", href: "menu/" },
          secondary: { kind: "rosa", label: "Quero ajuda para escolher", prompt: "Me indique uma pizza para começar.", context: "hero" },
        };
    }
  }

  function makeAction(action, primary = false) {
    const className = primary ? "btn btn--primary adaptive-commerce__action" : "btn btn--ghost adaptive-commerce__action";
    if (action.kind === "link") {
      const link = document.createElement("a");
      link.className = className;
      link.href = window.FORNO_META?.resolve?.(action.href) || action.href;
      link.textContent = action.label;
      return link;
    }
    const button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.textContent = action.label;
    button.dataset.adaptiveAction = action.kind;
    if (action.prompt) button.dataset.prompt = action.prompt;
    if (action.context) button.dataset.context = action.context;
    return button;
  }

  function ensureRoot() {
    if (root?.isConnected) return root;
    root = document.querySelector("#adaptive-commerce");
    if (root) return root;
    const section = document.createElement("section");
    section.id = "adaptive-commerce";
    section.className = "adaptive-commerce";
    section.setAttribute("aria-labelledby", "adaptive-commerce-title");
    const shell = document.createElement("div");
    shell.className = "section-shell adaptive-commerce__inner";
    shell.innerHTML = '<div class="adaptive-commerce__copy"><p class="kicker" data-adaptive-kicker></p><h2 id="adaptive-commerce-title" data-adaptive-title></h2><p data-adaptive-copy></p></div><div class="adaptive-commerce__actions" data-adaptive-actions></div>';
    section.append(shell);
    const fastOrder = document.querySelector("#como-pedir");
    if (fastOrder?.parentNode) fastOrder.insertAdjacentElement("afterend", section);
    else document.querySelector("main")?.prepend(section);
    root = section;
    return root;
  }

  function render({ announce = false } = {}) {
    const container = ensureRoot();
    if (!container) return;
    const snap = snapshot();
    const state = chooseState(snap);
    const model = modelFor(state, snap);
    container.dataset.adaptiveState = state;
    container.querySelector("[data-adaptive-kicker]").textContent = model.kicker;
    container.querySelector("[data-adaptive-title]").textContent = model.title;
    container.querySelector("[data-adaptive-copy]").textContent = model.copy;
    const actions = container.querySelector("[data-adaptive-actions]");
    actions.replaceChildren(makeAction(model.primary, true), makeAction(model.secondary, false));
    if (announce && state !== lastState) {
      const live = document.querySelector("#app-status");
      if (live) {
        live.textContent = "";
        requestAnimationFrame(() => { live.textContent = model.title; });
      }
    }
    lastState = state;
  }

  function act(event) {
    const button = event.target.closest("[data-adaptive-action]");
    if (!button) return;
    const kind = button.dataset.adaptiveAction;
    if (kind === "bag") window.FORNO_APP?.openBag?.();
    if (kind === "repeat") window.FORNO_APP?.repeatLastOrder?.();
    if (kind === "rosa") window.ROSA?.open?.(button, button.dataset.context || "geral", button.dataset.prompt || "");
  }

  function observeState() {
    const cartCount = document.querySelector("#cart-count");
    const returning = document.querySelector("#returning-order");
    observer?.disconnect();
    observer = new MutationObserver(() => render({ announce: false }));
    if (cartCount) observer.observe(cartCount, { childList: true, characterData: true, subtree: true, attributes: true });
    if (returning) observer.observe(returning, { attributes: true, attributeFilter: ["hidden"] });
  }

  function init() {
    ensureRoot();
    root?.addEventListener("click", act);
    observeState();
    render({ announce: false });
  }

  window.addEventListener("forno:experience-intent", (event) => {
    const intent = String(event?.detail?.intent || event?.detail || "").trim();
    if (["quick-order", "guided-choice", "discover-house"].includes(intent)) {
      experienceIntent = intent;
      render({ announce: true });
    }
  });
  window.addEventListener("forno:business-status", () => render({ announce: false }));
  window.addEventListener("storage", () => render({ announce: false }));
  document.addEventListener("DOMContentLoaded", init);

  window.FORNO_ADAPTIVE_COMMERCE = Object.freeze({ snapshot, chooseState, modelFor, render });
})();
