#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const store = new Map();
const dispatchedEvents = [];
const noop = () => {};
const documentMock = {
  addEventListener: noop,
  querySelector: () => null,
  querySelectorAll: () => [],
  activeElement: null,
  dispatchEvent(event) { dispatchedEvents.push(event); return true; },
};
const context = {
  console,
  Intl,
  Date,
  Object,
  Array,
  Map,
  Set,
  String,
  Number,
  Boolean,
  Math,
  JSON,
  RegExp,
  CustomEvent: class CustomEvent { constructor(type, init = {}) { this.type = type; this.detail = init.detail; } },
  document: documentMock,
  HTMLElement: function HTMLElement() {},
  sessionStorage: {
    getItem: (key) => store.has(key) ? store.get(key) : null,
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
  },
  requestAnimationFrame: (fn) => fn(),
  setTimeout: (fn) => { fn(); return 1; },
  clearTimeout: noop,
  __FORNO_TEST__: true,
};
context.window = context;
const appActions = { added: [], clears: 0 };
context.FORNO_APP = {
  addProduct(id) { appActions.added.push(id); return true; },
  clearBag() { appActions.clears += 1; return true; },
  getBagSummary() { return { count: 0, pizzas: 0, drinks: 0, totalLabel: "R$ 0,00" }; },
};
vm.createContext(context);

for (const file of ["data/menu.js", "data/rosa-knowledge-base.js", "js/rosa.js"]) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, file), "utf8"), context, { filename: file });
}

const rosa = context.ROSA;
const checks = [];
function check(name, condition, detail = "") {
  checks.push({ name, condition: Boolean(condition), detail });
}

const vegetarian = rosa.inspect("Quero algo vegetariano");
check("Vegetarian recommendation intent", vegetarian.intent === "recommend", vegetarian.intent);
check("Vegetarian preference extraction", vegetarian.preferences.vegetarian === true, JSON.stringify(vegetarian.preferences));

const nuanced = rosa.inspect("Quero algo leve e não muito picante");
check("Light preference extraction", nuanced.preferences.intensity === "suave", JSON.stringify(nuanced.preferences));
check("Avoid spicy extraction", nuanced.preferences.avoidSpicy === true, JSON.stringify(nuanced.preferences));

const compare = rosa.inspect("Dona Rosa ou Quatro Formaggi?");
check("Comparison intent", compare.intent === "compare", compare.intent);
check("Comparison resolves two products", compare.productIds.includes("dona-rosa") && compare.productIds.includes("quatro-formaggi"), compare.productIds.join(","));

const ambiguousCoke = rosa.inspect("Adicione Coca");
check("Ambiguous add remains add intent", ambiguousCoke.intent === "add", ambiguousCoke.intent);
check("Ambiguous Coca resolves multiple variants", ambiguousCoke.productIds.length >= 3, ambiguousCoke.productIds.join(","));

const exactCoke = rosa.inspect("Adicione Coca-Cola 2 L");
check("Exact Coca 2L recognized without ambiguity", exactCoke.productIds.length === 1 && exactCoke.productIds[0] === "coca-2l", exactCoke.productIds.join(","));

const clear = rosa.inspect("Esvazie minha sacola");
check("Destructive Bag intent", clear.intent === "clearBag", clear.intent);

const details = rosa.inspect("Ver detalhes da Dona Rosa");
check("Product details intent", details.intent === "details", details.intent);
check("Details resolves Dona Rosa", details.productIds.includes("dona-rosa"), details.productIds.join(","));

const why = rosa.inspect("Por que você recomendou essa?");
check("Recommendation explanation intent", why.intent === "why", why.intent);


const firstTurn = rosa.__testRespond("Quero algo vegetariano");
check("Multi-turn first recommendation", firstTurn.intent === "recommend" && firstTurn.productIds.length > 0, firstTurn.productIds.join(","));
const secondTurn = rosa.__testRespond("E mais intenso?");
check("Multi-turn preference continuity", secondTurn.intent === "recommend" && (secondTurn.productIds || []).every((id) => context.FORNO_MENU.find((p) => p.id === id)?.traits.includes("vegetariana")), (secondTurn.productIds || []).join(","));
const expectedFirst = secondTurn.productIds[0];
const thirdTurn = rosa.__testRespond("Adicione a primeira");
check("Ordinal follow-up executes canonical add", thirdTurn.intent === "add" && appActions.added.at(-1) === expectedFirst, appActions.added.join(","));

const beforeAmbiguous = appActions.added.length;
const ambiguousAction = rosa.__testRespond("Adicione Coca");
check("Ambiguous add does not mutate Bag", ambiguousAction.intent === "disambiguate" && appActions.added.length === beforeAmbiguous, ambiguousAction.intent);

const clearAsk = rosa.__testRespond("Esvazie minha sacola");
check("Clear Bag asks confirmation first", clearAsk.intent === "clearBag" && appActions.clears === 0 && rosa.getSessionSnapshot().hasPendingAction, clearAsk.text);
const clearConfirm = rosa.__testRespond("sim");
check("Confirmed clear executes once", clearConfirm.intent === "confirm" && appActions.clears === 1 && !rosa.getSessionSnapshot().hasPendingAction, clearConfirm.text);


rosa.__testRespond("Sem restrições");
check("Preference reset clears session filters", Object.keys(rosa.getSessionSnapshot().preferences).length === 0, JSON.stringify(rosa.getSessionSnapshot().preferences));
const setA = rosa.__testRespond("Quero algo vegetariano");
const setB = rosa.__testRespond("Qual dessas é mais leve?");
check("Relative recommendation stays inside last set", (setB.productIds || []).length > 0 && (setB.productIds || []).every((id) => setA.productIds.includes(id)), (setB.productIds || []).join(","));
rosa.__testRespond("Pode ter carne");
check("Preference override can re-allow meat", !rosa.getSessionSnapshot().preferences.vegetarian && !rosa.getSessionSnapshot().preferences.vegan, JSON.stringify(rosa.getSessionSnapshot().preferences));

dispatchedEvents.length = 0;
const drinksTurn = rosa.__testRespond("Me mostre as bebidas");
check("Drinks response does not throw and returns products", drinksTurn.intent === "drinks" && drinksTurn.productIds.length > 0, drinksTurn.productIds.join(","));
check("Drinks recommendation emits conversion event", dispatchedEvents.some((event) => event.type === "forno:rosa-recommendation" && event.detail?.productId === drinksTurn.productIds[0]));

dispatchedEvents.length = 0;
const nightTurn = rosa.__testRespond("Monte uma noite para mim");
check("Night bundle response does not throw", nightTurn.intent === "night" && nightTurn.productIds.length >= 3, nightTurn.productIds.join(","));
check("Night bundle emits recommendation event", dispatchedEvents.some((event) => event.type === "forno:rosa-recommendation" && event.detail?.productId === nightTurn.productIds[0]));

dispatchedEvents.length = 0;
const recommendationTurn = rosa.__testRespond("Me indique uma pizza");
check("Explicit pizza request clears prior drink preference", recommendationTurn.intent === "recommend" && recommendationTurn.productIds.length > 0 && recommendationTurn.productIds.every((id) => context.FORNO_MENU.find((p) => p.id === id)?.type === "pizza"), recommendationTurn.productIds.join(","));
check("Recommendation emits conversion event", recommendationTurn.intent === "recommend" && dispatchedEvents.some((event) => event.type === "forno:rosa-recommendation" && event.detail?.productId === recommendationTurn.productIds[0]), recommendationTurn.productIds.join(","));


let passed = 0;
for (const item of checks) {
  if (item.condition) {
    passed += 1;
    console.log(`PASS  ${item.name}${item.detail ? ` — ${item.detail}` : ""}`);
  } else {
    console.log(`FAIL  ${item.name}${item.detail ? ` — ${item.detail}` : ""}`);
  }
}
console.log(`\n${passed}/${checks.length} Rosa behavior checks passed`);
process.exitCode = passed === checks.length ? 0 : 1;
