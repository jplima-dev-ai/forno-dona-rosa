(() => {
  "use strict";
  const cfg = window.FORNO_COMMERCE?.analytics || {};
  const enabled = cfg.enabled === true;
  function track(name, detail = {}) {
    if (!enabled || typeof name !== "string") return false;
    document.dispatchEvent(new CustomEvent("forno:analytics", { detail: { name: name.slice(0,80), data: detail } }));
    return true;
  }
  window.FORNO_ANALYTICS = Object.freeze({ enabled, track });
})();
