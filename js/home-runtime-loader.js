(() => {
  "use strict";

  const selector = 'script[type="application/x-forno-deferred"][src]';
  const root = document.documentElement;
  let started = false;

  function publishState(state, detail = {}) {
    root.dataset.fornoRuntime = state;
    window.dispatchEvent(new CustomEvent("forno:runtime-state", {
      detail: { state, ...detail }
    }));
  }

  function hydrate() {
    if (started) return;
    started = true;

    const placeholders = Array.from(document.querySelectorAll(selector));
    if (!placeholders.length) {
      publishState("hydrated", { loaded: 0, failed: [] });
      return;
    }

    publishState("loading", { total: placeholders.length });
    let remaining = placeholders.length;
    let loaded = 0;
    const failed = [];

    const settle = (src, ok) => {
      if (ok) loaded += 1;
      else failed.push(src);
      remaining -= 1;
      if (remaining !== 0) return;
      publishState(failed.length ? "degraded" : "hydrated", {
        loaded,
        failed: Object.freeze([...failed])
      });
    };

    for (const placeholder of placeholders) {
      const script = document.createElement("script");
      script.src = placeholder.src;
      script.async = false;
      if (placeholder.crossOrigin) script.crossOrigin = placeholder.crossOrigin;
      if (placeholder.referrerPolicy) script.referrerPolicy = placeholder.referrerPolicy;
      script.addEventListener("load", () => settle(script.src, true), { once: true });
      script.addEventListener("error", () => settle(script.src, false), { once: true });
      placeholder.replaceWith(script);
    }
  }

  function scheduleHydration() {
    if (typeof requestAnimationFrame === "function") {
      // Two animation frames guarantee one paint opportunity before runtime work.
      requestAnimationFrame(() => requestAnimationFrame(hydrate));
    } else {
      setTimeout(hydrate, 0);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scheduleHydration, { once: true });
  } else {
    scheduleHydration();
  }
})();
