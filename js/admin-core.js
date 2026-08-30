(() => {
  "use strict";

  const clone = (value) => JSON.parse(JSON.stringify(value));
  const text = (value, max = 240) => String(value ?? "").trim().slice(0, max);
  const digits = (value, max = 15) => String(value ?? "").replace(/\D/g, "").slice(0, max);
  const money = (value) => {
    const parsed = Number(String(value ?? "").replace(",", "."));
    return Number.isFinite(parsed) && parsed >= 0 ? Math.round(parsed * 100) / 100 : null;
  };
  const slug = (value) => text(value, 40).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 32);
  const email = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text(value, 160));
  const whatsapp = (value) => /^55\d{10,11}$/.test(digits(value));
  const safeHttpsUrl = (value) => { if (!value) return true; try { const url = new URL(String(value)); return url.protocol === "https:"; } catch { return false; } };

  function normalizeBundle(input) {
    if (!input || typeof input !== "object") throw new Error("O arquivo não contém um bundle válido.");
    const source = input.payload && typeof input.payload === "object" ? input.payload : input;
    const brand = clone(source.brand || {});
    brand.credits = { enabled: true, label: "Desenvolvido por", name: "KJ Productions", url: null, ...(brand.credits || {}) };
    const content = clone(source.content || {});
    const catalog = clone(source.catalog || {});
    const reviews = clone(source.reviews || { schemaVersion: 1, reviews: [] });
    const articles = clone(source.articles || { schemaVersion: 1, categories: [], articles: [] });
    const newsletter = clone(source.newsletter || { schemaVersion: 1, enabled: false, provider: "none", endpoint: null });
    if (!brand.brand || !brand.contacts || !brand.location || !brand.commerce) throw new Error("Configuração da marca incompleta.");
    if (!content.hero) throw new Error("Conteúdo principal incompleto.");
    if (!Array.isArray(catalog.products)) throw new Error("Catálogo inválido.");
    if (!Array.isArray(reviews.reviews)) reviews.reviews = [];
    if (!Array.isArray(articles.categories)) articles.categories = [];
    if (!Array.isArray(articles.articles)) articles.articles = [];
    return { brand, content, catalog, reviews, articles, newsletter };
  }

  function validate(bundle) {
    const errors = [];
    let data;
    try { data = normalizeBundle(bundle); } catch (error) { return { ok: false, errors: [error.message] }; }
    const b = data.brand.brand || {};
    const c = data.brand.contacts || {};
    const l = data.brand.location || {};
    const hero = data.content.hero || {};
    if (text(b.name, 80).length < 2) errors.push("Informe o nome da marca.");
    if (text(b.legalDisplayName, 120).length < 2) errors.push("Informe o nome comercial.");
    if (!/^[a-z0-9][a-z0-9-]{1,31}$/.test(String(b.storageNamespace || ""))) errors.push("O namespace deve usar apenas letras minúsculas, números e hífen.");
    if (!whatsapp(c.whatsappNumber)) errors.push("Informe o WhatsApp no formato internacional brasileiro, começando por 55.");
    if (c.email && !email(c.email)) errors.push("Informe um e-mail válido.");
    if (!text(l.city, 80) || !text(l.state, 2)) errors.push("Informe cidade e estado.");
    if (text(hero.title, 180).length < 8) errors.push("O título principal está muito curto.");
    if (text(hero.lead, 320).length < 16) errors.push("A descrição principal está muito curta.");
    if (!safeHttpsUrl(data.brand.credits?.url)) errors.push("O link do crédito deve usar HTTPS.");
    if (data.catalog.products.length > 250) errors.push("O catálogo excede o limite de 250 produtos.");
    const seen = new Set();
    for (const product of data.catalog.products) {
      if (!product || typeof product !== "object") { errors.push("Existe um produto inválido no catálogo."); continue; }
      if (!/^[a-z0-9][a-z0-9-]{1,63}$/.test(String(product.id || ""))) errors.push(`ID inválido em produto: ${product.name || "sem nome"}.`);
      if (seen.has(product.id)) errors.push(`ID de produto duplicado: ${product.id}.`);
      seen.add(product.id);
      if (text(product.name, 120).length < 2) errors.push(`Produto ${product.id || "sem ID"} está sem nome.`);
      if (!(Number(product.basePrice) > 0)) errors.push(`Produto ${product.name || product.id} precisa de preço maior que zero.`);
    }
    for (const review of data.reviews.reviews) {
      if (!review || typeof review !== "object") { errors.push("Existe uma avaliação inválida."); continue; }
      if (text(review.author, 80).length < 2) errors.push("Avaliação sem nome de autor.");
      if (text(review.quote, 420).length < 8) errors.push(`Avaliação de ${review.author || "autor desconhecido"} está muito curta.`);
      if (!(Number(review.rating) >= 1 && Number(review.rating) <= 5)) errors.push(`Nota inválida na avaliação de ${review.author || "autor desconhecido"}.`);
      if (review.active !== false && review.authorized !== true) errors.push(`Avaliação ativa de ${review.author || "autor desconhecido"} precisa de autorização de uso.`);
    }
    const categoryIds = new Set(data.articles.categories.map((category) => String(category?.id || "")));
    const articleSlugs = new Set();
    if (data.articles.articles.length > 200) errors.push("A área editorial excede o limite de 200 artigos.");
    for (const article of data.articles.articles) {
      if (!article || typeof article !== "object") { errors.push("Existe um artigo inválido."); continue; }
      const articleSlug = String(article.slug || article.id || "");
      if (!/^[a-z0-9][a-z0-9-]{1,79}$/.test(articleSlug)) errors.push(`Slug inválido em artigo: ${article.title || "sem título"}.`);
      if (articleSlugs.has(articleSlug)) errors.push(`Slug de artigo duplicado: ${articleSlug}.`);
      articleSlugs.add(articleSlug);
      if (text(article.title, 160).length < 8) errors.push(`Artigo ${articleSlug || "sem slug"} precisa de título.`);
      if (text(article.summary, 360).length < 24) errors.push(`Artigo ${article.title || articleSlug} precisa de um resumo mais claro.`);
      if (!categoryIds.has(String(article.category || ""))) errors.push(`Categoria inexistente em ${article.title || articleSlug}.`);
      if (!Array.isArray(article.sections) || article.sections.length === 0 || article.sections.length > 8) errors.push(`Artigo ${article.title || articleSlug} precisa de 1 a 8 seções.`);
      for (const section of article.sections || []) {
        if (text(section?.heading, 160).length < 3) errors.push(`Artigo ${article.title || articleSlug} tem seção sem título.`);
        if (!Array.isArray(section?.paragraphs) || section.paragraphs.length === 0) errors.push(`Artigo ${article.title || articleSlug} tem seção sem texto.`);
      }
    }
    const provider = String(data.newsletter.provider || "none");
    if (!new Set(["none","external-form","future-api"]).has(provider)) errors.push("Provedor de newsletter inválido.");
    if (data.newsletter.enabled === true) {
      if (provider === "none") errors.push("Newsletter ativada precisa de um provedor.");
      if (!safeHttpsUrl(data.newsletter.endpoint) || !data.newsletter.endpoint) errors.push("Newsletter ativada precisa de endpoint HTTPS.");
    }
    const fulfillment = data.brand.commerce?.fulfillment || {};
    const methods = data.brand.commerce?.payment?.methods || [];
    if (!fulfillment.delivery && !fulfillment.pickup) errors.push("Ative entrega ou retirada.");
    if (!Array.isArray(methods) || methods.length === 0) errors.push("Ative ao menos uma forma de pagamento.");
    const unavailable = data.brand.commerce?.availability?.unavailableProductIds || [];
    if (!Array.isArray(unavailable)) errors.push("Lista de indisponibilidade inválida.");
    else unavailable.filter((id) => !seen.has(id)).forEach((id) => errors.push(`Produto indisponível inexistente: ${id}.`));
    return { ok: errors.length === 0, errors };
  }

  function setProductAvailability(bundle, productId, available) {
    const data = normalizeBundle(bundle);
    const ids = new Set(data.brand.commerce?.availability?.unavailableProductIds || []);
    if (available) ids.delete(productId); else ids.add(productId);
    data.brand.commerce.availability = { ...(data.brand.commerce.availability || {}), unavailableProductIds: [...ids] };
    return data;
  }

  function setFeatured(bundle, productId, featured, label = "") {
    const data = normalizeBundle(bundle);
    const merch = data.brand.commerce.merchandising || (data.brand.commerce.merchandising = { featuredProductIds: [], seasonalProductIds: [], labels: {} });
    const ids = new Set(Array.isArray(merch.featuredProductIds) ? merch.featuredProductIds : []);
    if (featured) ids.add(productId); else ids.delete(productId);
    merch.featuredProductIds = [...ids].slice(0, 6);
    merch.labels = { ...(merch.labels || {}) };
    if (featured && text(label, 60)) merch.labels[productId] = text(label, 60);
    if (!featured) delete merch.labels[productId];
    return data;
  }

  function reconcileDerived(bundle) {
    const data = normalizeBundle(bundle);
    const l = data.brand.location;
    const d = data.brand.delivery || (data.brand.delivery = {});
    const c = data.brand.commerce || (data.brand.commerce = {});
    l.fullAddress = [l.streetAddress, `${l.city} - ${l.state}`, l.postalCode ? `CEP ${l.postalCode}` : ""].filter(Boolean).join(", ");
    d.city = l.city; d.state = l.state; d.country = l.country || "BR"; d.serviceAreaLabel = `${l.city} — ${l.state}`;
    if (c.pickup) c.pickup.addressLabel = l.fullAddress;
    return data;
  }

  function exportEnvelope(bundle, version = (window.FORNO_META?.version || "3.7.9")) {
    const payload = reconcileDerived(bundle);
    const result = validate(payload);
    if (!result.ok) throw new Error(result.errors.join("\n"));
    return {
      format: "forno-admin-bundle",
      formatVersion: 1,
      projectVersion: version,
      exportedAt: new Date().toISOString(),
      payload
    };
  }

  function summary(bundle) {
    const data = normalizeBundle(bundle);
    const unavailable = new Set(data.brand.commerce?.availability?.unavailableProductIds || []);
    const featured = data.brand.commerce?.merchandising?.featuredProductIds || [];
    return {
      brandName: data.brand.brand.name,
      products: data.catalog.products.length,
      available: data.catalog.products.filter((p) => !unavailable.has(p.id)).length,
      unavailable: unavailable.size,
      featured: featured.length,
      delivery: data.brand.commerce?.fulfillment?.delivery !== false,
      pickup: data.brand.commerce?.fulfillment?.pickup === true,
      scheduling: data.brand.commerce?.scheduling?.enabled === true
    };
  }

  window.ADMIN_CORE = Object.freeze({ clone, text, digits, money, slug, email, whatsapp, safeHttpsUrl, normalizeBundle, reconcileDerived, validate, setProductAvailability, setFeatured, exportEnvelope, summary });
})();
