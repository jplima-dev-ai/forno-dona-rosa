"use strict";

(() => {
  const VERSION = "4.0.9";

  function emit(type, detail = {}) {
    window.dispatchEvent(new CustomEvent(`forno:release:${type}`, { detail }));
  }

  function getHealth() {
    const resilience = window.FORNO_RESILIENCE?.healthSnapshot?.() || null;
    const conversion = window.FORNO_CONVERSION?.summary?.() || null;
    return Object.freeze({
      version: VERSION,
      resilience,
      conversion,
      reducedMotion: window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false,
      forcedColors: window.matchMedia?.("(forced-colors: active)")?.matches ?? false,
      online: navigator.onLine
    });
  }

  function markReady() {
    document.documentElement.dataset.fornoRelease = VERSION;
    emit("ready", { version: VERSION });
  }

  window.FORNO_RELEASE = Object.freeze({
    VERSION,
    getHealth,
    markReady
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", markReady, { once: true });
  } else {
    markReady();
  }
})();
