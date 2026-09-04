(() => {
  "use strict";

  const VERSION = "1";
  const storageNamespace = window.BRAND_CONFIG?.brand?.storageNamespace || window.PIZZARIA_CONFIG?.storageNamespace || "forno";
  const STORAGE_KEY = `${storageNamespace}_conversion_summary_v${VERSION}`;
  const ALLOWED_EVENTS = new Set([
    "page_view",
    "experience_intent",
    "search_started",
    "desire_selected",
    "product_view",
    "favorite_added",
    "rosa_opened",
    "rosa_recommendation",
    "bag_add",
    "bag_opened",
    "repeat_order",
    "checkout_started",
    "whatsapp_handoff",
  ]);
  const SAFE_KEYS = new Set([
    "source",
    "context",
    "intent",
    "productId",
    "productType",
    "category",
    "path",
    "state",
    "result",
    "bagCount",
  ]);
  const SAFE_TOKEN = /^[\p{L}\p{N}._:/-]{1,80}$/u;
  const MAX_COUNT = 9999;
  let searchTracked = false;

  function safeInt(value, min = 0, max = MAX_COUNT) {
    const n = Number.parseInt(value, 10);
    if (!Number.isFinite(n)) return min;
    return Math.min(max, Math.max(min, n));
  }

  function safeToken(value) {
    if (typeof value !== "string") return "";
    const token = value.trim().slice(0, 80);
    return SAFE_TOKEN.test(token) ? token : "";
  }

  function safePath() {
    const path = String(location.pathname || "/");
    return path.slice(0, 120).replace(/[^A-Za-z0-9_./-]/g, "");
  }

  function sanitize(detail = {}) {
    const safe = {};
    if (!detail || typeof detail !== "object") return safe;
    for (const [key, raw] of Object.entries(detail)) {
      if (!SAFE_KEYS.has(key)) continue;
      if (key === "bagCount") {
        safe[key] = safeInt(raw);
        continue;
      }
      const token = safeToken(String(raw ?? ""));
      if (token) safe[key] = token;
    }
    return safe;
  }

  function emptySummary() {
    return { schemaVersion: VERSION, startedAt: new Date().toISOString(), counts: {}, funnel: {} };
  }

  function readSummary() {
    try {
      const parsed = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "null");
      if (!parsed || parsed.schemaVersion !== VERSION || typeof parsed.counts !== "object") return emptySummary();
      return parsed;
    } catch {
      return emptySummary();
    }
  }

  function persistSummary(summary) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(summary));
      return true;
    } catch {
      return false;
    }
  }

  function track(name, detail = {}) {
    if (!ALLOWED_EVENTS.has(name)) return false;
    const data = sanitize(detail);
    const summary = readSummary();
    summary.counts[name] = safeInt(summary.counts[name]) + 1;
    summary.funnel[name] = true;
    summary.lastEvent = name;
    summary.updatedAt = new Date().toISOString();
    persistSummary(summary);

    const payload = Object.freeze({ name, data: Object.freeze(data) });
    document.dispatchEvent(new CustomEvent("forno:conversion", { detail: payload }));
    window.FORNO_ANALYTICS?.track?.(name, data);
    return true;
  }

  function snapshot() {
    const summary = readSummary();
    return Object.freeze({
      schemaVersion: summary.schemaVersion,
      startedAt: summary.startedAt,
      updatedAt: summary.updatedAt || null,
      lastEvent: summary.lastEvent || null,
      counts: Object.freeze({ ...summary.counts }),
      funnel: Object.freeze({ ...summary.funnel }),
    });
  }

  function reset() {
    try { sessionStorage.removeItem(STORAGE_KEY); } catch {}
  }

  function detectProductId(node) {
    if (!(node instanceof Element)) return "";
    const direct = node.closest("[data-product-id],[data-open-product],[data-view-product],[data-menu-product]");
    if (!direct) return "";
    return safeToken(
      direct.getAttribute("data-product-id") ||
      direct.getAttribute("data-open-product") ||
      direct.getAttribute("data-view-product") ||
      direct.getAttribute("data-menu-product") ||
      "",
    );
  }

  function handleClick(event) {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;

    const rosa = target.closest("[data-rosa-open]");
    if (rosa) {
      track("rosa_opened", { context: rosa.getAttribute("data-rosa-context") || "geral" });
      return;
    }

    const desire = target.closest(".desire-chip[data-desire]");
    if (desire) {
      track("desire_selected", { source: "desire-strip", category: desire.getAttribute("data-desire") || "" });
      return;
    }

    if (target.closest("#open-cart,[data-open-cart]")) {
      const bagCount = window.FORNO_APP?.getBagSummary?.().count || 0;
      track("bag_opened", { source: "ui", bagCount });
      return;
    }

    if (target.closest("#repeat-last-order,[data-adaptive-action='repeat']")) {
      track("repeat_order", { source: "returning-order" });
      return;
    }

    if (target.closest("#send-cart,[data-smart-checkout]")) {
      const bagCount = window.FORNO_APP?.getBagSummary?.().count || 0;
      track("checkout_started", { source: "bag", bagCount });
      return;
    }

    const productId = detectProductId(target);
    if (productId) track("product_view", { source: "catalog", productId });
  }

  function handleSearch(event) {
    if (searchTracked) return;
    const field = event.target;
    if (!(field instanceof HTMLInputElement) || field.id !== "menu-search") return;
    if (field.value.trim().length < 1) return;
    searchTracked = true;
    track("search_started", { source: "menu" });
  }

  function init() {
    track("page_view", { path: safePath() });
    document.addEventListener("click", handleClick, { passive: true });
    document.addEventListener("input", handleSearch, { passive: true });
  }

  window.addEventListener("forno:experience-intent", (event) => {
    const intent = safeToken(String(event?.detail?.intent || event?.detail || ""));
    if (intent) track("experience_intent", { intent });
  });

  document.addEventListener("forno:rosa-recommendation", (event) => {
    const productId = safeToken(String(event?.detail?.productId || ""));
    track("rosa_recommendation", { productId, context: event?.detail?.context || "rosa" });
  });

  document.addEventListener("DOMContentLoaded", init, { once: true });

  window.FORNO_CONVERSION = Object.freeze({ track, snapshot, reset, sanitize });
})();
