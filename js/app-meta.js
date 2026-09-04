(() => {
  "use strict";
  const scriptUrl = document.currentScript?.src || new URL("js/app-meta.js", document.baseURI).href;
  const siteRoot = new URL("../", scriptUrl).href;
  window.FORNO_META = Object.freeze({
    version: "4.0.9",
    bagSchemaVersion: 3,
    catalogSchemaVersion: 3,
    brandSchemaVersion: 1,
    templateSchemaVersion: 2,
    release: "Commerce Experience Intelligence + Visual Desire System",
    siteRoot,
    resolve(path) { return new URL(String(path || ""), siteRoot).href; }
  });
})();
