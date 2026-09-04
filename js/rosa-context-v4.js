(() => {
  "use strict";

  const normalize = (value) => String(value || "")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/\s+/g, " ").trim();

  let experienceIntent = "";
  let lastRecommendationIds = [];

  function menu() {
    if (Array.isArray(window.FORNO_MENU)) return window.FORNO_MENU;
    if (Array.isArray(window.MENU_DATA?.products)) return window.MENU_DATA.products;
    return [];
  }

  function derivePreferences(text = "") {
    const q = normalize(text);
    const prefs = {};
    if (/nordestin|regional|carne de sol|sert[aã]o/.test(q)) prefs.regional = true;
    if (/carne|calabresa|parma|bacon/.test(q)) prefs.meat = true;
    if (/cremos|requeij|catupiry|muito queijo|queijo/.test(q)) prefs.creamy = true;
    if (/forte|marcante|intens/.test(q)) prefs.intensity = "intensa";
    if (/leve|suave/.test(q)) prefs.intensity = "suave";
    if (/vegetarian|sem carne/.test(q)) prefs.style = "vegetariana";
    if (/doce|sobremesa|nutella|chocolate/.test(q)) prefs.desire = "doce";
    if (/bebida|refrigerante|suco|agua|água/.test(q)) prefs.type = "bebida";
    return prefs;
  }

  function bag() {
    return window.FORNO_APP?.getBagSummary?.() || { count: 0, pizzas: 0, drinks: 0, total: 0, totalLabel: "" };
  }

  function business() {
    return window.FORNO_APP?.getBusinessStatus?.() || null;
  }

  function currentSection() {
    const active = document.querySelector("[data-rosa-context][aria-current='true'], [data-rosa-context].is-active");
    return active?.getAttribute("data-rosa-context") || "geral";
  }

  function snapshot(extra = {}) {
    return Object.freeze({
      experienceIntent,
      section: currentSection(),
      bag: bag(),
      business: business(),
      lastRecommendationIds: [...lastRecommendationIds],
      ...extra,
    });
  }

  function mapForSmartMenu(preferences = {}) {
    return {
      regional: Boolean(preferences.regional),
      creamy: Boolean(preferences.creamy || preferences.cheese),
      meat: Boolean(preferences.meat),
      intensity: preferences.intensity || "",
      style: preferences.style || (preferences.vegetarian ? "vegetariana" : ""),
      desire: preferences.desire || (preferences.sweet ? "doce" : ""),
      type: preferences.type || (preferences.drink ? "bebida" : ""),
      avoid: preferences.avoid || (preferences.avoidSpicy ? "picante" : ""),
    };
  }

  function recommend(text = "", persistedPreferences = {}, limit = 3) {
    const preferences = { ...persistedPreferences, ...derivePreferences(text) };
    const smart = window.FORNO_SMART_MENU;
    let results = [];
    if (smart?.recommend) {
      results = smart.recommend(mapForSmartMenu(preferences), limit);
    }
    if (!results.length) {
      results = menu().filter((item) => item && item.type === (preferences.type || "pizza"))
        .slice(0, limit)
        .map((product) => ({ product, score: 0, reason: product.badge ? `Destaque: ${product.badge}.` : "Opção disponível no cardápio." }));
    }
    lastRecommendationIds = results.map((entry) => entry.product?.id).filter(Boolean);
    return results;
  }

  function explain(product, preferences = {}) {
    if (!product) return "Eu considero o que você pediu, o cardápio atual e o contexto desta sessão.";
    const smart = window.FORNO_SMART_MENU;
    if (smart?.explain) return smart.explain(product, mapForSmartMenu(preferences));
    return product.badge ? `${product.name} é ${product.badge.toLowerCase()}.` : `${product.name} combina com o que você pediu.`;
  }

  function complementarySuggestion() {
    const summary = bag();
    if (!summary.count) return { kind: "pizza", message: "Sua sacola está vazia; posso começar por uma pizza." };
    if (summary.pizzas > 0 && !summary.drinks) return { kind: "drink", message: "Sua sacola já tem pizza e nenhuma bebida. Posso sugerir uma opção gelada para completar." };
    return { kind: "review", message: "Seu pedido já tem uma boa base. Posso revisar a sacola ou sugerir uma sobremesa." };
  }

  window.addEventListener("forno:experience-intent", (event) => {
    const next = normalize(event?.detail?.intent || event?.detail || "");
    if (["quick-order", "guided-choice", "discover-house"].includes(next)) experienceIntent = next;
  });

  window.FORNO_ROSA_CONTEXT = Object.freeze({
    snapshot,
    derivePreferences,
    mapForSmartMenu,
    recommend,
    explain,
    complementarySuggestion,
  });
})();
