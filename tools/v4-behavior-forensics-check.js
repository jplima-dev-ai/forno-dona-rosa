"use strict";
const fs = require("fs");
const vm = require("vm");

let pass = 0;
let fail = 0;
function check(name, condition, detail = "") {
  if (condition) { console.log(`PASS  ${name}${detail ? ` — ${detail}` : ""}`); pass += 1; }
  else { console.log(`FAIL  ${name}${detail ? ` — ${detail}` : ""}`); fail += 1; }
}

// Experience router must publish the same event contract its consumers listen for.
{
  let clickHandler = null;
  let dispatched = null;
  const route = { dataset: { intentRoute: "guided-choice" } };
  const root = {
    addEventListener(type, fn) { if (type === "click") clickHandler = fn; },
    contains(node) { return node === route; }
  };
  class CE { constructor(type, init = {}) { this.type = type; this.detail = init.detail; } }
  const context = {
    CustomEvent: CE,
    window: { dispatchEvent(event) { dispatched = event; } },
    document: { querySelectorAll() { return [root]; } }
  };
  vm.runInNewContext(fs.readFileSync("js/experience-router-v4.js", "utf8"), context);
  clickHandler({ target: { closest() { return route; } } });
  check("experience intent dispatch target", dispatched?.type === "forno:experience-intent");
  check("experience intent payload", dispatched?.detail?.intent === "guided-choice" && dispatched?.detail?.routeId === "guided-choice");
}

// Adaptive Commerce must understand the public FORNO_APP business contract ({open}).
{
  const context = {
    window: { addEventListener() {}, FORNO_APP: null },
    document: { addEventListener() {}, querySelector() { return null; }, createElement() { return {}; } },
    MutationObserver: function () {},
    Object,
  };
  vm.runInNewContext(fs.readFileSync("js/adaptive-commerce-v4.js", "utf8"), context);
  const state = context.window.FORNO_ADAPTIVE_COMMERCE.chooseState({
    intent: "", bag: { count: 0 }, business: { open: false }, hasLastOrder: false
  });
  check("adaptive closed state via FORNO_APP contract", state === "closed", state);
}

// Resilience must not destroy valid plain-text Admin preferences.
{
  class CE { constructor(type, init = {}) { this.type = type; this.detail = init.detail; } }
  const context = {
    CustomEvent: CE,
    HTMLImageElement: function () {},
    navigator: { onLine: true },
    window: {
      FORNO_META: { version: "4.0.9" },
      BRAND_CONFIG: { brand: { storageNamespace: "forno" } },
      FORNO_DELIVERY: {},
      addEventListener() {},
      dispatchEvent() {},
      localStorage: null,
      sessionStorage: null,
    },
    document: { readyState: "loading", addEventListener() {}, documentElement: { dataset: {} } },
    setTimeout,
    clearTimeout,
    Promise,
    Symbol,
    Object,
  };
  vm.runInNewContext(fs.readFileSync("js/resilience-v4.js", "utf8"), context);
  const makeStore = (entries) => {
    const map = new Map(entries);
    return {
      get length() { return map.size; },
      key(i) { return [...map.keys()][i] ?? null; },
      getItem(k) { return map.has(k) ? map.get(k) : null; },
      setItem(k, v) { map.set(k, String(v)); },
      removeItem(k) { map.delete(k); },
      has(k) { return map.has(k); }
    };
  };
  const store = makeStore([
    ["forno-admin-mode-v1", "simple"],
    ["forno-admin-onboarding-v1", "done"],
    ["forno-bag-v3", "{broken json"]
  ]);
  const report = context.window.FORNO_RESILIENCE.inspectStorage(store);
  check("resilience version follows release", context.window.FORNO_RESILIENCE.VERSION === "4.0.9");
  check("plain admin preferences are not treated as corrupt JSON", !report.some(x => x.key === "forno-admin-mode-v1" || x.key === "forno-admin-onboarding-v1"));
  check("corrupt JSON storage still detected", report.some(x => x.key === "forno-bag-v3"));
}

// Rosa recommendations must feed the Conversion Intelligence event contract.
{
  const rosa = fs.readFileSync("js/rosa.js", "utf8");
  check("Rosa emits recommendation event", rosa.includes('new CustomEvent("forno:rosa-recommendation"'));
  check("Rosa recommendation includes product id", rosa.includes("productId: product.id"));
}

console.log(`\n${pass}/${pass + fail} v4 behavior forensic checks passed`);
process.exit(fail ? 1 : 0);
