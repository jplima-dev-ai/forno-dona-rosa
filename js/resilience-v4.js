"use strict";

(() => {
  const VERSION = window.FORNO_META?.version || "4.0.9";
  const storageNamespace = window.BRAND_CONFIG?.brand?.storageNamespace || window.PIZZARIA_CONFIG?.storageNamespace || "forno";

  function jsonStorageKeys() {
    return new Set([
      `${storageNamespace}-bag-v3`,
      `${storageNamespace}-bag-v2`,
      `${storageNamespace}-cart`,
      `${storageNamespace}-favorites`,
      `${storageNamespace}-last-order-v1`,
      `${storageNamespace}-assistant-session-v5`,
      window.FORNO_DELIVERY?.addressSessionKey || `${storageNamespace}-checkout-session-v1`,
      window.FORNO_DELIVERY?.savedAddressKey || `${storageNamespace}-saved-address-v1`,
      `${storageNamespace}_conversion_summary_v1`,
      `${storageNamespace}-admin-draft-v1`
    ]);
  }

  function emit(type, detail = {}) {
    window.dispatchEvent(new CustomEvent(`forno:resilience:${type}`, { detail }));
  }

  function safeJSONParse(value, fallback = null) {
    if (typeof value !== "string" || !value.trim()) return fallback;
    try { return JSON.parse(value); }
    catch {
      return fallback;
    }
  }

  function storageLooksRelevant(key) {
    return Boolean(key && jsonStorageKeys().has(key));
  }

  function inspectStorage(storage) {
    const report = [];
    for (let i = 0; i < storage.length; i += 1) {
      const key = storage.key(i);
      if (!storageLooksRelevant(key)) continue;
      const raw = storage.getItem(key);
      if (raw == null || raw === "") continue;
      const parsed = safeJSONParse(raw, Symbol.for("invalid"));
      if (parsed === Symbol.for("invalid")) report.push({ key, status: "corrupt-json" });
    }
    return report;
  }

  function quarantineCorruptStorage() {
    const stores = [
      ["localStorage", window.localStorage],
      ["sessionStorage", window.sessionStorage]
    ];
    const quarantined = [];
    stores.forEach(([name, storage]) => {
      inspectStorage(storage).forEach(item => {
        try {
          const raw = storage.getItem(item.key);
          storage.removeItem(item.key);
          quarantined.push({ storage: name, key: item.key, bytes: raw ? raw.length : 0 });
        } catch {}
      });
    });
    if (quarantined.length) emit("storage-recovered", { count: quarantined.length });
    return quarantined;
  }

  function getCatalogProducts() {
    const data = window.FORNO_MENU || window.MENU_DATA?.products || window.MENU_DATA || [];
    return Array.isArray(data) ? data : Array.isArray(data?.products) ? data.products : [];
  }

  function getBagSummary() {
    try {
      return window.FORNO_APP?.getBagSummary?.() || null;
    } catch {
      return null;
    }
  }

  function reconcileBagAgainstCatalog() {
    const products = getCatalogProducts();
    const ids = new Set(products.map(p => String(p.id)));
    const bagIds = window.FORNO_APP?.getBagProductIds?.() || [];
    if (!Array.isArray(bagIds)) return { stale: [] };
    const stale = [...new Set(bagIds.map(String).filter(Boolean).filter(id => !ids.has(id)))];
    if (stale.length) {
      emit("stale-bag-items", { count: stale.length, ids: stale });
    }
    return { stale };
  }

  function installImageFallbacks(root = document) {
    root.addEventListener("error", event => {
      const img = event.target;
      if (!(img instanceof HTMLImageElement)) return;
      if (img.dataset.fallbackApplied === "true") return;
      img.dataset.fallbackApplied = "true";
      img.classList.add("media-fallback");
      img.alt = img.alt || "Imagem do produto temporariamente indisponível";
      const placeholder = img.closest("picture, .product-media, .product-card__media, figure");
      if (placeholder) placeholder.classList.add("media-fallback-shell");
      emit("asset-fallback", { kind: "image" });
    }, true);
  }

  function installNetworkState() {
    const update = () => {
      document.documentElement.dataset.network = navigator.onLine ? "online" : "offline";
      emit("network", { online: navigator.onLine });
    };
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    update();
  }

  function installServiceWorkerHandshake() {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.addEventListener("message", event => {
      const data = event.data || {};
      if (data.type === "FORNO_SW_VERSION") {
        document.documentElement.dataset.swVersion = String(data.version || "");
        if (data.version && data.version !== VERSION) {
          emit("service-worker-version-mismatch", { app: VERSION, worker: data.version });
        }
      }
    });
    navigator.serviceWorker.ready.then(registration => {
      registration.active?.postMessage?.({ type: "FORNO_GET_VERSION" });
      if (registration.waiting) {
        emit("service-worker-update-ready", { version: VERSION });
      }
    }).catch(() => {});
  }

  async function withTimeout(promise, ms, fallback = null) {
    let timer;
    const timeout = new Promise(resolve => {
      timer = setTimeout(() => resolve(fallback), ms);
    });
    return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
  }

  function healthSnapshot() {
    const bag = reconcileBagAgainstCatalog();
    return Object.freeze({
      version: VERSION,
      online: navigator.onLine,
      staleBagItems: bag.stale.length,
      catalogProducts: getCatalogProducts().length,
      hasServiceWorker: "serviceWorker" in navigator,
      timestamp: Date.now()
    });
  }

  function init() {
    quarantineCorruptStorage();
    installImageFallbacks();
    installNetworkState();
    installServiceWorkerHandshake();
    window.setTimeout(reconcileBagAgainstCatalog, 0);
  }

  window.FORNO_RESILIENCE = Object.freeze({
    VERSION,
    safeJSONParse,
    inspectStorage,
    quarantineCorruptStorage,
    reconcileBagAgainstCatalog,
    installImageFallbacks,
    withTimeout,
    healthSnapshot,
    init
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
