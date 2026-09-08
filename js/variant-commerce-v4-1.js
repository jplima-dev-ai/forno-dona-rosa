(() => {
  "use strict";

  const pricing = window.FORNO_PRICING || {};
  const roundMoney = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100;

  function fallbackVariants(product) {
    if (!product || product.type === "bebida") return [];
    return Object.entries(pricing.sizes || {}).map(([id, definition]) => ({
      id,
      label: String(definition?.label || id),
      price: roundMoney(Number(product.basePrice || 0) * (Number(definition?.multiplier) || 1)),
      diameterCm: Number.isFinite(Number(definition?.diameterCm)) ? Number(definition.diameterCm) : null,
      serves: definition?.serves && Number.isFinite(Number(definition.serves.min)) && Number.isFinite(Number(definition.serves.max))
        ? { min: Number(definition.serves.min), max: Number(definition.serves.max) }
        : null,
      available: definition?.available !== false,
    }));
  }

  function normalizeVariant(raw, product) {
    if (!raw || typeof raw !== "object" || !raw.id) return null;
    const fallback = pricing.sizes?.[raw.id] || {};
    const price = Number(raw.price);
    const computed = Number(product?.basePrice || 0) * (Number(fallback.multiplier) || 1);
    const serves = raw.serves || fallback.serves;
    return Object.freeze({
      id: String(raw.id),
      label: String(raw.label || fallback.label || raw.id),
      price: roundMoney(Number.isFinite(price) && price >= 0 ? price : computed),
      diameterCm: Number.isFinite(Number(raw.diameterCm ?? fallback.diameterCm)) ? Number(raw.diameterCm ?? fallback.diameterCm) : null,
      serves: serves && Number.isFinite(Number(serves.min)) && Number.isFinite(Number(serves.max))
        ? Object.freeze({ min: Number(serves.min), max: Number(serves.max) })
        : null,
      available: raw.available !== false,
    });
  }

  function listFor(product) {
    if (!product || product.type === "bebida") return Object.freeze([]);
    const source = Array.isArray(product.variants) && product.variants.length ? product.variants : fallbackVariants(product);
    return Object.freeze(source.map((variant) => normalizeVariant(variant, product)).filter(Boolean));
  }

  function commonFor(products) {
    const valid = (Array.isArray(products) ? products : []).filter((product) => product && product.type !== "bebida");
    if (!valid.length) return Object.freeze([]);
    const lists = valid.map(listFor);
    const first = lists[0];
    return Object.freeze(first.filter((variant) => variant.available && lists.every((list) => list.some((candidate) => candidate.id === variant.id && candidate.available))));
  }

  function resolveForPair(primary, secondary, requestedId) {
    const choices = commonFor([primary, secondary].filter(Boolean));
    if (!choices.length) return null;
    return choices.find((variant) => variant.id === requestedId) || choices[0];
  }

  function resolve(product, requestedId) {
    const choices = listFor(product).filter((variant) => variant.available);
    return choices.find((variant) => variant.id === requestedId) || choices[0] || null;
  }

  function priceFor(product, requestedId) {
    return resolve(product, requestedId)?.price ?? Math.max(0, Number(product?.basePrice) || 0);
  }

  function describe(variant) {
    if (!variant) return "";
    const parts = [variant.label];
    if (variant.diameterCm) parts.push(`${variant.diameterCm} cm`);
    if (variant.serves) parts.push(`serve ${variant.serves.min}–${variant.serves.max}`);
    return parts.join(" · ");
  }

  window.FORNO_VARIANTS = Object.freeze({ listFor, commonFor, resolve, resolveForPair, priceFor, describe });
})();
