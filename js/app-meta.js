(() => {
  "use strict";
  const scriptUrl = document.currentScript?.src || new URL("js/app-meta.js", document.baseURI).href;
  const siteRoot = new URL("../", scriptUrl).href;
  window.FORNO_META = Object.freeze({
    version: "3.0.9",
    bagSchemaVersion: 3,
    catalogSchemaVersion: 2,
    brandSchemaVersion: 1,
    templateSchemaVersion: 2,
    release: "Production Website Edition",
    siteRoot,
    resolve(path) { return new URL(String(path || ""), siteRoot).href; }
  });
})();
