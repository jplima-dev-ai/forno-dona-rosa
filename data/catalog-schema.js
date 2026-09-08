window.CATALOG_SCHEMA = Object.freeze({
  schemaVersion: 2,
  defaultType: "pizza",
  simpleTypes: Object.freeze(["bebida"]),
  productGroups: Object.freeze([
    Object.freeze({ id: "pizzas", label: "Pizzas", messageLabel: "PIZZAS", match: Object.freeze({ type: "pizza", excludeCategories: Object.freeze(["doces"]) }) }),
    Object.freeze({ id: "bebidas", label: "Bebidas", messageLabel: "BEBIDAS", match: Object.freeze({ type: "bebida" }) }),
    Object.freeze({ id: "sobremesas", label: "Sobremesas", messageLabel: "SOBREMESAS", match: Object.freeze({ category: "doces" }) })
  ]),
  modifiers: Object.freeze({
    pizza: Object.freeze(["variant", "size", "crust", "halfAndHalf", "remove", "notes"]),
    bebida: Object.freeze([])
  })
});
