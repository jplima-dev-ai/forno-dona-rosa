(() => {
  "use strict";

  const cfg = window.PIZZARIA_CONFIG || {};
  const kb = window.ROSA_KNOWLEDGE || {};
  const menu = Array.isArray(window.FORNO_MENU) ? window.FORNO_MENU : [];
  const menuById = new Map(menu.map((item) => [item.id, item]));
  const SESSION_KEY = "forno-rosa-session-v3";
  const MAX_INPUT = 240;
  const MAX_HISTORY = 16;
  const MAX_REPLY = 900;
  const MIN_SEND_INTERVAL = 450;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  let previousFocus = null;
  let currentContext = "geral";
  let lastSendAt = 0;
  let lastIntent = "";
  let variationIndex = 0;

  const normalize = (value) => String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .trim();
  const clean = (value, max = MAX_INPUT) => String(value || "")
    .normalize("NFC")
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
  const containsAny = (text, words) => words.some((word) => text.includes(normalize(word)));
  const safeProduct = (id) => menuById.get(id) || null;

  const storage = {
    get() {
      try {
        const raw = JSON.parse(sessionStorage.getItem(SESSION_KEY));
        if (!raw || raw.schemaVersion !== 3 || !Array.isArray(raw.messages)) return [];
        return raw.messages
          .filter((item) => item && ["user", "rosa"].includes(item.role) && typeof item.text === "string")
          .map((item) => ({ role: item.role, text: clean(item.text, MAX_REPLY) }))
          .slice(-MAX_HISTORY);
      } catch { return []; }
    },
    set(messages) {
      try {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({ schemaVersion: 3, messages: messages.slice(-MAX_HISTORY) }));
        return true;
      } catch { return false; }
    },
    clear() { try { sessionStorage.removeItem(SESSION_KEY); } catch {} },
  };

  let history = storage.get();

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

  function addMessage(role, text, persist = true, shouldAnnounce = false) {
    const log = $("#rosa-log");
    if (!log) return;
    const safe = clean(text, MAX_REPLY);
    const article = create("article", { className: `rosa-message rosa-message--${role}` });
    article.append(
      create("span", { className: "sr-only", text: role === "rosa" ? "Rosa diz: " : "Você diz: " }),
      create("p", { text: safe }),
    );
    log.append(article);
    log.scrollTop = log.scrollHeight;
    if (persist) {
      history.push({ role, text: safe });
      history = history.slice(-MAX_HISTORY);
      storage.set(history);
    }
    if (role === "rosa" && shouldAnnounce) announce(safe);
  }

  function renderHistory() {
    const log = $("#rosa-log");
    if (!log) return;
    while (log.firstChild) log.firstChild.remove();
    if (!history.length) {
      addMessage("rosa", kb.greeting || "Olá! Eu sou a Rosa, anfitriã digital da Forno Dona Rosa.", true, false);
      return;
    }
    history.forEach((item) => addMessage(item.role, item.text, false, false));
  }

  function formatProduct(product) { return product ? `${product.name}: ${product.description}` : ""; }

  function recommendations(text) {
    const normalized = normalize(text);
    if (containsAny(normalized, ["vegetar", "vegana", "vegetal", "sem carne"])) return ["orto","margherita-vegana","mediterranea"].map(safeProduct).filter(Boolean);
    if (containsAny(normalized, ["doce", "sobremesa", "nutella", "morango", "chocolate"])) return ["nutella","chocolate-belga","banana-doce-leite"].map(safeProduct).filter(Boolean);
    if (containsAny(normalized, ["queijo", "cremosa", "formaggi"])) return ["quatro-formaggi","burrata-parma","margherita"].map(safeProduct).filter(Boolean);
    if (containsAny(normalized, ["intensa", "forte", "marcante", "carne", "calabresa", "picante"])) return ["dona-rosa","picante-rosa","calabresa"].map(safeProduct).filter(Boolean);
    if (containsAny(normalized, ["leve", "suave", "classica", "tradicional"])) return ["margherita","orto"].map(safeProduct).filter(Boolean);
    return ["dona-rosa","margherita"].map(safeProduct).filter(Boolean);
  }

  function bagSummary() {
    const summary = window.FORNO_APP?.getBagSummary?.();
    if (!summary?.count) return "Sua sacola está vazia. Posso te sugerir a Dona Rosa para começar.";
    return `Sua sacola tem ${summary.count} ${summary.count === 1 ? "item" : "itens"}, com subtotal demonstrativo de ${summary.totalLabel}. Você pode revisar os detalhes na sacola antes de enviar pelo WhatsApp.`;
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
      assinatura: "A Dona Rosa é a escolha mais autoral da casa; posso explicar o sabor ou sugerir uma combinação.",
      pedido: "Posso explicar tamanhos, bordas, meio a meio ou sugerir combinações.",
      sacola: "Posso revisar sua sacola e sugerir bebida ou sobremesa antes do WhatsApp.",
      localizacao: "Posso informar endereço, horário e te encaminhar para a rota ou WhatsApp.",
    };
    return map[currentContext] || "Posso te orientar pelo cardápio, pedido, sacola e informações da pizzaria.";
  }

  const intents = [
    { id:"greeting", score:3, words:["oi","ola","bom dia","boa tarde","boa noite","quem e voce"] },
    { id:"privacy", score:4, words:["privacidade","api","meus dados","dados da conversa","internet"] },
    { id:"hours", score:4, words:["horario","hora","aberto","abre","fecha","funciona"] },
    { id:"location", score:4, words:["endereco","onde fica","localizacao","como chegar","rota"] },
    { id:"contact", score:4, words:["telefone","whatsapp","contato","falar com a pizzaria"] },
    { id:"instagram", score:4, words:["instagram","rede social"] },
    { id:"email", score:4, words:["email","e-mail"] },
    { id:"drinks", score:3, words:["bebida","refrigerante","coca","guarana","sprite","agua","suco"] },
    { id:"night", score:4, words:["monte uma noite","monta uma noite","combinacao","combo","complete meu pedido"] },
    { id:"add", score:4, words:["adicione","adicionar","coloque","colocar"] },
    { id:"half", score:4, words:["meio a meio","metade","dois sabores"] },
    { id:"size", score:3, words:["tamanho","media","grande","familia"] },
    { id:"crust", score:4, words:["borda","catupiry","cheddar"] },
    { id:"bag", score:4, words:["sacola","meu pedido","revisar","o que pedi"] },
    { id:"ingredients", score:3, words:["ingrediente","leva","tem na","composicao"] },
    { id:"recommend", score:3, words:["recomenda","indique","sugere","qual pizza","quero algo","melhor pizza","pizza doce","vegetar"] },
    { id:"menu", score:3, words:["cardapio","sabores","pizzas"] },
    { id:"order", score:3, words:["pedido","pedir","montar"] },
    { id:"thanks", score:4, words:["obrigado","obrigada","valeu","tchau"] },
  ];

  function findProduct(text) {
    const normalized = normalize(text);
    const compact = normalized.replace(/[^a-z0-9]/g, "");
    return menu.find((item) => {
      const name = normalize(item.name);
      const id = normalize(item.id);
      const compactName = name.replace(/[^a-z0-9]/g, "");
      const compactId = id.replace(/[^a-z0-9]/g, "");
      return normalized.includes(name) || normalized.includes(id) ||
        (compactName.length >= 5 && compact.includes(compactName)) ||
        (compactId.length >= 5 && compact.includes(compactId));
    });
  }

  function classify(text) {
    const normalized = normalize(text);
    const product = findProduct(normalized);
    let best = { intent: "fallback", confidence: 0.25, score: 0, product };
    for (const intent of intents) {
      const hits = intent.words.filter((word) => normalized.includes(normalize(word))).length;
      const score = hits * intent.score;
      if (score > best.score) best = { intent: intent.id, confidence: Math.min(0.95, 0.45 + hits * 0.18), score, product };
    }
    if (best.intent !== "fallback") return best;
    if (product) return { intent: "product", confidence: 0.98, score: 1, product };
    return best;
  }

  function vary(options) {
    if (!Array.isArray(options) || !options.length) return "";
    variationIndex = (variationIndex + 1) % options.length;
    return options[variationIndex];
  }

  function respond(rawText) {
    const text = normalize(rawText);
    const result = classify(text);
    if (!text) return { text: "Escreva o que você gostaria de saber e eu te ajudo.", confidence: 1, intent: "empty" };
    if (result.confidence < 0.48) return { text: `Não tenho certeza do que você quis dizer. ${contextualIntro()}`, confidence: result.confidence, intent: "fallback" };
    const product = result.product;
    let reply = "";
    switch (result.intent) {
      case "product": reply = formatProduct(product); break;
      case "greeting": reply = `${vary(["Olá! Eu sou a Rosa, anfitriã digital da Forno Dona Rosa.","Oi! Rosa por aqui — sua anfitriã digital da casa."])} ${contextualIntro()}`; break;
      case "privacy": reply = "Eu funciono localmente nesta página para perguntas sobre a pizzaria. O histórico curto fica somente na sessão do navegador e não é enviado para uma API externa."; break;
      case "hours": reply = hourResponse(); break;
      case "location": reply = `Estamos na ${cfg.address}. O botão “Como chegar” na seção de localização abre a rota.`; break;
      case "contact": reply = `O WhatsApp é ${cfg.whatsappDisplay}. Use o atendimento para confirmar disponibilidade, valor final e entrega.`; break;
      case "instagram": reply = `Nosso Instagram é @${cfg.instagram}.`; break;
      case "email": reply = `Nosso e-mail é ${cfg.email}.`; break;
      case "drinks": reply = `Temos estas bebidas demonstrativas: ${menu.filter(i=>i.type==="bebida").map(i=>i.name).join(", ")}. Diga o nome de uma delas se quiser adicionar à sacola.`; break;
      case "night": reply = "Para uma noite equilibrada, eu sugiro Dona Rosa + Margherita Clássica + Coca-Cola 2 L + Nutella com Morango. É uma combinação demonstrativa e você pode trocar qualquer item."; break;
      case "add": {
        const found = result.product || findProduct(text);
        if (found && window.FORNO_APP?.addProduct) {
          const added = window.FORNO_APP.addProduct(found.id);
          reply = added === false
            ? `Não consegui adicionar ${found.name} agora. Revise a sacola e tente novamente.`
            : `Adicionei ${found.name} à sua sacola. Quer que eu sugira algo para combinar?`;
        } else reply = "Diga o nome de uma pizza ou bebida do cardápio e eu tento adicioná-la à sua sacola.";
        break;
      }
      case "half": reply = "No montador, marque “Fazer meio a meio” e escolha um segundo sabor diferente. Nesta demonstração, o cálculo usa o maior preço entre os dois sabores."; break;
      case "size": reply = "Temos tamanhos Média, Grande e Família. A quantidade de pessoas atendidas não foi fornecida, então confirme esse detalhe no WhatsApp."; break;
      case "crust": reply = "Você pode escolher borda tradicional, Catupiry ou Cheddar. Os adicionais exibidos são demonstrativos."; break;
      case "bag": reply = bagSummary(); break;
      case "ingredients": reply = `Posso explicar qualquer item do cardápio. Hoje temos ${menu.filter(i=>i.type!=="bebida").length} pizzas e ${menu.filter(i=>i.type==="bebida").length} bebidas demonstrativas.`; break;
      case "recommend": {
        const picks = recommendations(text); reply = `Eu começaria por ${picks.map(p=>p.name).join(" ou ")}. ${picks[0]?.name || "Dona Rosa"} é minha primeira sugestão para o que você descreveu.`; break;
      }
      case "menu": reply = `O cardápio demonstrativo tem ${menu.filter(i=>i.type!=="bebida").length} pizzas e ${menu.filter(i=>i.type==="bebida").length} bebidas. Você pode usar a busca ou me dizer o perfil de sabor.`; break;
      case "order": reply = "Na seção Pedido você escolhe sabor, tamanho, borda, quantidade e observações; depois pode incluir bebidas, revisar a sacola e enviar tudo pelo WhatsApp."; break;
      case "thanks": reply = vary(["Foi um prazer te ajudar. Quando a fome bater de novo, eu continuo por aqui.","Sempre um prazer. Se quiser revisar a sacola antes de sair, eu faço isso com você."]); break;
      default: reply = `Não tenho certeza do que você quis dizer. ${contextualIntro()}`;
    }
    lastIntent = result.intent;
    return { text: reply, confidence: result.confidence, intent: result.intent };
  }

  function openRosa(trigger, context = "geral", seededPrompt = "") {
    const dialog = $("#rosa-dialog");
    if (!dialog?.showModal) return;
    currentContext = context || "geral";
    previousFocus = trigger instanceof HTMLElement ? trigger : document.activeElement;
    if (!dialog.open) dialog.showModal();
    renderHistory();
    const input = $("#rosa-input");
    input?.focus();
    if (seededPrompt) submitPrompt(seededPrompt);
  }

  function closeRosa() { const dialog = $("#rosa-dialog"); if (dialog?.open) dialog.close(); }

  function submitPrompt(raw) {
    const now = Date.now();
    if (now - lastSendAt < MIN_SEND_INTERVAL) { announce("Envie uma mensagem por vez. Rosa já está processando sua última pergunta."); return; }
    lastSendAt = now;
    const text = clean(raw);
    if (!text) return;
    addMessage("user", text, true, false);
    const response = respond(text);
    window.setTimeout(() => addMessage("rosa", response.text, true, true), 100);
  }

  function init() {
    const dialog = $("#rosa-dialog");
    const form = $("#rosa-form");
    const input = $("#rosa-input");
    $$('[data-rosa-open]').forEach((button) => button.addEventListener("click", () => openRosa(button, button.dataset.rosaContext || "geral", button.dataset.rosaPrompt || "")));
    $("#rosa-close")?.addEventListener("click", closeRosa);
    dialog?.addEventListener("close", () => { if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus(); previousFocus = null; });
    dialog?.addEventListener("click", (event) => { if (event.target === dialog) closeRosa(); });
    form?.addEventListener("submit", (event) => { event.preventDefault(); const value = clean(input?.value); if (!value) return; if (input) input.value = ""; submitPrompt(value); });
    $("#rosa-quick-actions")?.addEventListener("click", (event) => { const button = event.target.closest("[data-rosa-prompt]"); if (button) submitPrompt(button.dataset.rosaPrompt || button.textContent); });
    $("#rosa-clear")?.addEventListener("click", () => { history = []; storage.clear(); renderHistory(); $("#rosa-input")?.focus(); announce("Conversa limpa."); });
    renderHistory();
  }

  document.addEventListener("DOMContentLoaded", init);
  window.ROSA = Object.freeze({ open: openRosa, classify, getLastIntent: () => lastIntent });
})();
