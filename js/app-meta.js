(() => {
  "use strict";
  const scriptUrl = document.currentScript?.src || new URL("js/app-meta.js", document.baseURI).href;
  const siteRoot = new URL("../", scriptUrl).href;
  window.FORNO_META = Object.freeze({
    version: "3.4.0",
    bagSchemaVersion: 4,
    catalogSchemaVersion: 4,
    brandSchemaVersion: 1,
    templateSchemaVersion: 2,
    release: "3.4.0 Stabilization — Signature Commerce",
    siteRoot,
    resolve(path) { return new URL(String(path || ""), siteRoot).href; }
  });
})();
