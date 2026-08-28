(() => {
  "use strict";
  const brand = window.BRAND_CONFIG || {};
  const delivery = brand.delivery || {};
  const location = brand.location || {};
  const commerce = brand.commerce || {};
  const slug = String(brand.brand?.storageNamespace || brand.brand?.shortName || brand.brand?.name || "business").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "business";
  window.FORNO_DELIVERY = Object.freeze({
    schemaVersion: 2,
    enabled: delivery.enabled !== false,
    city: delivery.city || location.city || "",
    state: delivery.state || location.state || "",
    country: delivery.country || location.country || "BR",
    cityNormalized: String(delivery.city || location.city || "").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, ""),
    serviceAreaLabel: delivery.serviceAreaLabel || [delivery.city || location.city, delivery.state || location.state].filter(Boolean).join(" — "),
    postalCodeLookup: delivery.postalCodeLookup !== false,
    rememberAddressOptIn: delivery.rememberAddressOptIn !== false,
    addressSessionKey: `${slug}-checkout-session-v1`,
    savedAddressKey: `${slug}-saved-address-v1`,
    maxLengths: Object.freeze({ name:80, street:120, number:20, neighborhood:80, complement:80, reference:120 }),
    commerce: commerce
  });
})();
