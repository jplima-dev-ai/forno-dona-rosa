(() => {
  "use strict";

  const variantEngine = window.FORNO_VARIANTS || null;
  const pricing = window.FORNO_PRICING || {};

  function sizeChoices(primary, secondary = null) {
    if (!primary || primary.type === "bebida") return Object.freeze([]);
    const choices = secondary && secondary.type === "pizza"
      ? variantEngine?.commonFor?.([primary, secondary]) || []
      : variantEngine?.listFor?.(primary) || [];
    return Object.freeze(choices.filter((variant) => variant && variant.available !== false));
  }

  function crustChoices() {
    return Object.freeze(Object.entries(pricing.crusts || {}).map(([id, definition]) => Object.freeze({
      id,
      label: String(definition?.label || id),
      add: Number.isFinite(Number(definition?.add)) ? Number(definition.add) : 0,
    })));
  }

  function canEdit(item) {
    return Boolean(item && item.productType !== "bebida" && item.pizzaId);
  }

  function editModel(item, primary, secondary = null) {
    if (!canEdit(item) || !primary) return null;
    return Object.freeze({
      itemId: String(item.id || ""),
      size: String(item.size || ""),
      crust: String(item.crust || ""),
      remove: typeof item.remove === "string" ? item.remove : "",
      notes: typeof item.notes === "string" ? item.notes : "",
      sizes: sizeChoices(primary, secondary),
      crusts: crustChoices(),
    });
  }

  window.FORNO_INTELLIGENT_BAG = Object.freeze({ sizeChoices, crustChoices, canEdit, editModel });
})();
