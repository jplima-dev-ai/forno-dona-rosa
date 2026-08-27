(() => {
  "use strict";
  const flags = window.BRAND_CONFIG?.features || {};
  window.APP_FEATURES = Object.freeze({
    favorites: flags.favorites !== false,
    reorder: flags.reorder !== false,
    assistant: flags.assistant !== false,
    checkout: flags.checkout !== false,
    postalCodeLookup: flags.postalCodeLookup !== false,
    pwa: flags.pwa !== false,
    productSearch: flags.productSearch !== false,
    halfAndHalf: flags.halfAndHalf !== false
  });
  document.documentElement.dataset.featuresReady = "true";
  for (const [name, enabled] of Object.entries(window.APP_FEATURES)) {
    document.documentElement.dataset[`feature${name[0].toUpperCase()}${name.slice(1)}`] = enabled ? "on" : "off";
  }
})();
