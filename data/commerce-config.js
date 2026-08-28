(() => {
  "use strict";
  const source = window.BRAND_CONFIG || {};
  const commerce = source.commerce || {};
  const hours = source.hours || {};
  const unavailable = new Set(Array.isArray(commerce.availability?.unavailableProductIds) ? commerce.availability.unavailableProductIds.filter((id) => typeof id === "string") : []);
  window.FORNO_COMMERCE = Object.freeze({
    fulfillment: Object.freeze({ delivery: commerce.fulfillment?.delivery !== false, pickup: commerce.fulfillment?.pickup === true, default: commerce.fulfillment?.default === "pickup" ? "pickup" : "delivery" }),
    payment: Object.freeze({ methods: Object.freeze(Array.isArray(commerce.payment?.methods) ? commerce.payment.methods.filter((m) => ["pix","cash"].includes(m)) : ["pix"]), default: commerce.payment?.default === "cash" ? "cash" : "pix", cashChangeEnabled: commerce.payment?.cashChangeEnabled !== false }),
    scheduling: Object.freeze({ enabled: commerce.scheduling?.enabled === true, asapEnabled: commerce.scheduling?.asapEnabled !== false, minLeadMinutes: Math.max(0, Number(commerce.scheduling?.minLeadMinutes) || 0), maxDaysAhead: Math.max(1, Math.min(30, Number(commerce.scheduling?.maxDaysAhead) || 7)) }),
    deliveryFee: Object.freeze(commerce.deliveryFee || { mode:"confirm-on-whatsapp", flatFee:null, label:"Taxa de entrega confirmada no WhatsApp" }),
    deliveryEstimate: Object.freeze(commerce.deliveryEstimate || { mode:"confirm-on-whatsapp", minMinutes:null, maxMinutes:null, label:"Prazo de entrega confirmado no WhatsApp" }),
    pickup: Object.freeze(commerce.pickup || {}),
    minimumOrder: Number.isFinite(commerce.minimumOrder) ? Math.max(0, commerce.minimumOrder) : null,
    unavailableProductIds: unavailable,
    hours: Object.freeze(hours),
    timezone: source.brand?.timezone || "America/Sao_Paulo",
    analytics: Object.freeze(commerce.analytics || { enabled:false })
  });
})();
