(() => {
  "use strict";
  const source = window.BRAND_CONFIG || {};
  const brand = source.brand || {};
  const contacts = source.contacts || {};
  const location = source.location || {};
  const seo = source.seo || {};
  const assistant = source.assistant || {};
  window.PIZZARIA_CONFIG = Object.freeze({
    businessName: brand.legalDisplayName || brand.name || "Local business",
    shortName: brand.shortName || brand.name || "",
    businessType: brand.businessType || "local-business",
    locale: brand.locale || "pt-BR",
    currency: brand.currency || "BRL",
    logo: brand.logo || {},
    assistant,
    features: source.features || {},
    whatsappNumber: contacts.whatsappNumber || "",
    whatsappDisplay: contacts.whatsappDisplay || "",
    whatsappMessage: `Olá, ${brand.name || ""}! Vim pelo site e gostaria de fazer um pedido.`.trim(),
    email: contacts.email || "",
    instagram: contacts.instagram || "",
    address: location.fullAddress || "",
    location,
    siteUrl: seo.siteUrl || "",
    timezone: brand.timezone || "America/Sao_Paulo",
    storageNamespace: brand.storageNamespace || "local-business",
    businessHours: source.hours || {},
    businessHoursNote: source.businessHoursNote || ""
  });
})();
