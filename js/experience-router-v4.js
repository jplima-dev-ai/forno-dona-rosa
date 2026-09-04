/* Forno Dona Rosa 4.0 — static-first intent router. No personal data collection. */
(function () {
  "use strict";

  const ROOT_SELECTOR = "[data-experience-router]";

  function emitIntent(routeId) {
    window.dispatchEvent(new CustomEvent("forno:experience-intent", {
      detail: { intent: routeId, routeId }
    }));
  }

  function enhance(root) {
    root.addEventListener("click", (event) => {
      const link = event.target.closest("[data-intent-route]");
      if (!link || !root.contains(link)) return;
      emitIntent(link.dataset.intentRoute || "unknown");
    });
  }

  document.querySelectorAll(ROOT_SELECTOR).forEach(enhance);
})();
