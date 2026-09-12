(() => {
  "use strict";

  const selector = 'script[type="application/x-forno-deferred"][src]';
  let started = false;

  function hydrate() {
    if (started) return;
    started = true;

    const placeholders = Array.from(document.querySelectorAll(selector));
    for (const placeholder of placeholders) {
      const script = document.createElement("script");
      script.src = placeholder.src;
      script.async = false;
      if (placeholder.crossOrigin) script.crossOrigin = placeholder.crossOrigin;
      if (placeholder.referrerPolicy) script.referrerPolicy = placeholder.referrerPolicy;
      placeholder.replaceWith(script);
    }
  }

  function scheduleHydration() {
    if (typeof requestAnimationFrame === "function") {
      requestAnimationFrame(hydrate);
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
