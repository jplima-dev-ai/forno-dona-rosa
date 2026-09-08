(() => {
  "use strict";

  const clean = (value) => String(value || "").trim();
  const money = (value) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value) || 0);

  function buildReview({ first, second, half, sizeLabel, crustLabel, qty, remove, notes, total }) {
    const flavor = half && second ? `${first} + ${second}` : first;
    return Object.freeze({
      flavor: clean(flavor) || "Escolha um sabor",
      size: clean(sizeLabel) || "Escolha um tamanho",
      crust: clean(crustLabel) || "Tradicional",
      qty: Math.max(1, Number.parseInt(qty, 10) || 1),
      remove: clean(remove),
      notes: clean(notes),
      total: Number(total) || 0,
    });
  }

  function summaryText(review) {
    const parts = [review.flavor, review.size, `borda ${review.crust}`, `${review.qty}x`, money(review.total)];
    if (review.remove) parts.push(`remover ${review.remove}`);
    if (review.notes) parts.push(`observação: ${review.notes}`);
    return parts.join(" · ");
  }

  window.FORNO_CONFIGURATOR = Object.freeze({ buildReview, summaryText, money });
})();
