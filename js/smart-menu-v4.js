(() => {
  "use strict";
  const normalize = (value) => String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  const products = () => Array.isArray(window.FORNO_MENU) ? window.FORNO_MENU : (Array.isArray(window.MENU_DATA?.products) ? window.MENU_DATA.products : []);
  const unavailable = (id) => window.FORNO_COMMERCE?.unavailableProductIds?.has?.(id) === true;

  function tokensFor(product) {
    return new Set([
      product.id, product.name, product.category, product.categoryLabel, product.badge,
      ...(product.aliases || []), ...(product.traits || []), ...(product.media?.visualTraits || [])
    ].map(normalize).filter(Boolean));
  }

  function score(product, preferences = {}) {
    if (!product || unavailable(product.id)) return -Infinity;
    const tokens = tokensFor(product);
    let points = 0;
    const wanted = [preferences.style, preferences.intensity, preferences.focus, preferences.desire]
      .flatMap((value) => Array.isArray(value) ? value : [value]).map(normalize).filter(Boolean);
    wanted.forEach((token) => { if (tokens.has(token)) points += 5; });
    const avoid = [preferences.avoid].flatMap((value) => Array.isArray(value) ? value : [value]).map(normalize).filter(Boolean);
    avoid.forEach((token) => { if (tokens.has(token)) points -= 20; });
    if (preferences.type && normalize(product.type) === normalize(preferences.type)) points += 4;
    if (preferences.regional && tokens.has("regional")) points += 8;
    if (preferences.creamy && (tokens.has("cremosa") || tokens.has("cremoso"))) points += 5;
    if (preferences.meat && tokens.has("carne")) points += 4;
    return points;
  }

  function explain(product, preferences = {}) {
    const tokens = tokensFor(product);
    const reasons = [];
    if (preferences.regional && tokens.has("regional")) reasons.push("tem identidade regional");
    if (preferences.creamy && tokens.has("cremosa")) reasons.push("é cremosa");
    if (preferences.meat && tokens.has("carne")) reasons.push("leva carne");
    if (preferences.intensity && tokens.has(normalize(preferences.intensity))) reasons.push(`tem perfil ${preferences.intensity}`);
    if (!reasons.length) reasons.push(product.badge ? normalize(product.badge) : "combina com sua escolha");
    return `Indicada porque ${reasons.join(", ")}.`;
  }

  function recommend(preferences = {}, limit = 3) {
    return products().map((product) => ({ product, score: score(product, preferences) }))
      .filter((entry) => Number.isFinite(entry.score) && entry.score > 0)
      .sort((a,b) => b.score - a.score || a.product.name.localeCompare(b.product.name, "pt-BR"))
      .slice(0, Math.max(1, limit))
      .map((entry) => ({ ...entry, reason: explain(entry.product, preferences) }));
  }

  window.FORNO_SMART_MENU = Object.freeze({ score, recommend, explain, tokensFor });
})();
