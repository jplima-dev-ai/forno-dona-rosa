#!/usr/bin/env node
"use strict";

const fs = require("fs");
const vm = require("vm");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const deliverySource = fs.readFileSync(path.join(ROOT, "data/delivery-config.js"), "utf8");
const postalSource = fs.readFileSync(path.join(ROOT, "js/postal-code-service.js"), "utf8");
let fetchPlan = [];

const context = {
  window: {},
  console,
  AbortController,
  setTimeout,
  clearTimeout,
  fetch: async (url) => {
    const next = fetchPlan.shift();
    if (!next) throw new Error(`Unexpected fetch: ${url}`);
    if (next.urlIncludes && !String(url).includes(next.urlIncludes)) throw new Error(`Expected ${next.urlIncludes}, got ${url}`);
    return { ok: next.ok, json: async () => next.body };
  }
};
context.window.window = context.window;
vm.createContext(context);
vm.runInContext(deliverySource, context, { filename: "delivery-config.js" });
vm.runInContext(postalSource, context, { filename: "postal-code-service.js" });
const postal = context.window.FORNO_POSTAL;
const delivery = context.window.FORNO_DELIVERY;

const checks = [];
function check(name, condition) { checks.push([name, Boolean(condition)]); }

(async () => {
  check("CEP strips formatting", postal.stripPostalCode("29165-130") === "29165130");
  check("CEP limits to 8 digits", postal.stripPostalCode("29165130123") === "29165130");
  check("CEP formats 5-3", postal.formatPostalCode("29165130") === "29165-130");
  check("City normalization removes accents/case", postal.normalizeText(" SÉRRA ") === "serra");
  check("Serra/ES is service area", postal.isServiceArea({ city: "Serra", state: "ES" }, delivery));
  check("Vitória/ES is blocked", !postal.isServiceArea({ city: "Vitória", state: "ES" }, delivery));
  check("Serra/RJ is blocked", !postal.isServiceArea({ city: "Serra", state: "RJ" }, delivery));

  fetchPlan = [{ urlIncludes: "viacep.com.br", ok: true, body: { cep: "29165-130", logradouro: "Av. Central", bairro: "Parque Residencial Laranjeiras", localidade: "Serra", uf: "ES" } }];
  let result = await postal.lookup("29165130");
  check("ViaCEP success resolves first", result.ok && result.address.provider === "viacep" && result.address.city === "Serra");

  fetchPlan = [
    { urlIncludes: "viacep.com.br", ok: true, body: { erro: true } },
    { urlIncludes: "brasilapi.com.br", ok: true, body: { cep: "29165130", street: "Av. Central", neighborhood: "Laranjeiras", city: "Serra", state: "ES" } }
  ];
  result = await postal.lookup("29165130");
  check("BrasilAPI fallback resolves", result.ok && result.address.provider === "brasilapi" && result.address.state === "ES");

  fetchPlan = [
    { urlIncludes: "viacep.com.br", ok: false, body: {} },
    { urlIncludes: "brasilapi.com.br", ok: false, body: {} }
  ];
  result = await postal.lookup("29165130");
  check("Provider failure returns manual fallback signal", !result.ok && result.reason === "not-found");

  result = await postal.lookup("123");
  check("Invalid CEP avoids lookup", !result.ok && result.reason === "invalid");

  const passed = checks.filter(([, ok]) => ok).length;
  for (const [name, ok] of checks) console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  console.log(`\n${passed}/${checks.length} checkout behavior checks passed`);
  if (passed !== checks.length) process.exit(1);
})().catch((error) => { console.error(error); process.exit(1); });
