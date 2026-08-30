(() => {
  "use strict";
  const menu = () => Array.isArray(window.MENU_DATA?.products) ? window.MENU_DATA.products : [];
  const commerce = () => window.FORNO_COMMERCE || {};
  const money = (value) => new Intl.NumberFormat("pt-BR", { style:"currency", currency:"BRL" }).format(Number(value) || 0);
  const resolve = (path) => window.FORNO_META?.resolve?.(path) || path;
  const available = (id) => !commerce().unavailableProductIds?.has?.(id);

  function alternatives(productId, limit = 2) {
    const products = menu();
    const product = products.find((item) => item.id === productId);
    if (!product) return [];
    const traits = new Set(product.traits || []);
    return products
      .filter((candidate) => candidate.id !== productId && available(candidate.id))
      .map((candidate) => ({ candidate, score:(candidate.type === product.type ? 4 : 0) + (candidate.category === product.category ? 3 : 0) + (candidate.traits || []).filter((trait) => traits.has(trait)).length }))
      .filter((entry) => entry.score > 0)
      .sort((a,b) => b.score - a.score || a.candidate.name.localeCompare(b.candidate.name, "pt-BR"))
      .slice(0, limit)
      .map((entry) => entry.candidate);
  }

  function featuredProducts() {
    const ids = commerce().merchandising?.featuredProductIds || [];
    const products = menu();
    return ids.map((id) => products.find((product) => product.id === id)).filter(Boolean);
  }

  function media480(path) { return String(path || "").replace(/\.webp$/i, "-480.webp"); }

  function renderFeatured() {
    const root = document.querySelector("[data-featured-products]");
    if (!root) return;
    root.replaceChildren();
    const labels = commerce().merchandising?.labels || {};
    featuredProducts().forEach((product) => {
      const card = document.createElement("article"); card.className = "storefront-featured-card";
      const link = document.createElement("a"); link.href = resolve(`products/${product.id}/`);
      const img = document.createElement("img"); img.src = resolve(media480(product.image)); img.alt = ""; img.loading = "lazy"; img.decoding = "async"; img.width = 480; img.height = 480; const focal = product.media?.focalPoint; if (focal) img.style.objectPosition = `${Number(focal.x) || 50}% ${Number(focal.y) || 50}%`;
      const body = document.createElement("div"); body.className = "storefront-featured-card__body";
      const kicker = document.createElement("p"); kicker.className = "kicker"; kicker.textContent = labels[product.id] || product.badge || "Seleção da casa";
      const title = document.createElement("h3"); title.textContent = product.name;
      const desc = document.createElement("p"); desc.textContent = product.description;
      const price = document.createElement("strong"); price.textContent = available(product.id) ? `A partir de ${money(product.basePrice)}` : "Indisponível hoje — ver alternativas";
      body.append(kicker,title,desc,price); link.append(img,body); card.append(link); root.append(card);
    });
  }

  function renderStatusCopy(status) {
    const node = document.querySelector("[data-storefront-status-copy]");
    if (!node || !status) return;
    node.textContent = status.isOpen
      ? `${status.headline}. ${status.detail} Escolha uma favorita ou explore o cardápio completo.`
      : `${status.headline}. ${status.detail} Você ainda pode montar a Sacola e agendar quando houver horário disponível.`;
  }

  async function renderReviews() {
    const root = document.querySelector("[data-trust-reviews]");
    if (!root || commerce().reviews?.enabled === false) return;
    try {
      const response = await fetch(resolve(commerce().reviews?.source || "data/reviews.json"), { credentials:"same-origin" });
      if (!response.ok) return;
      const payload = await response.json();
      const reviews = Array.isArray(payload?.reviews) ? payload.reviews.filter((review) => review && review.quote && review.author && review.authorized === true && review.active !== false) : [];
      if (!reviews.length) { root.hidden = true; return; }
      const grid = root.querySelector("[data-review-grid]"); if (!grid) return;
      grid.replaceChildren();
      reviews.slice(0, 6).forEach((review) => {
        const article = document.createElement("article"); article.className = "review-card";
        const quote = document.createElement("blockquote"); quote.textContent = review.quote;
        const rating = document.createElement("p"); rating.className = "review-card__rating"; rating.setAttribute("aria-label", `${Number(review.rating) || 5} de 5 estrelas`); rating.textContent = "★".repeat(Math.max(1, Math.min(5, Number(review.rating) || 5)));
        const footer = document.createElement("footer"); footer.textContent = [review.author, review.source].filter(Boolean).join(" · ");
        article.append(rating, quote, footer); grid.append(article);
      });
      root.hidden = false;
    } catch { root.hidden = true; }
  }

  window.FORNO_STOREFRONT = Object.freeze({ alternatives, featuredProducts, renderFeatured });
  document.addEventListener("DOMContentLoaded", () => {
    renderFeatured();
    renderReviews();
    renderStatusCopy(window.FORNO_BUSINESS_STATUS?.getStatus?.());
  });
  window.addEventListener("forno:business-status", (event) => renderStatusCopy(event.detail));
})();
