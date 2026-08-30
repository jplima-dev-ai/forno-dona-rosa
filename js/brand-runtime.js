(() => {
  "use strict";
  const cfg = window.BRAND_CONFIG || {};
  const brand = cfg.brand || {};
  const contacts = cfg.contacts || {};
  const location = cfg.location || {};
  const assistant = cfg.assistant || {};
  const content = window.BRAND_CONTENT || {};
  const credits = cfg.credits || {};
  document.querySelectorAll("[data-site-credit]").forEach((node) => {
    const enabled = credits.enabled !== false;
    node.hidden = !enabled;
    if (enabled) node.textContent = `${credits.label || "Desenvolvido por"} ${credits.name || "KJ Productions"}`;
  });

  const setText = (selector, value) => { if (!value) return; document.querySelectorAll(selector).forEach((node) => { node.textContent = value; }); };
  setText("[data-brand-name]", brand.name);
  setText("[data-brand-business-name]", brand.legalDisplayName || brand.name);
  setText("[data-brand-city]", location.city);
  setText("[data-brand-service-area]", cfg.delivery?.serviceAreaLabel);
  setText("[data-brand-assistant-name]", assistant.name);
  setText("[data-brand-whatsapp-display]", contacts.whatsappDisplay);
  setText("[data-brand-email]", contacts.email);
  setText("[data-brand-instagram]", contacts.instagram);
  document.querySelectorAll("[data-brand-email-link]").forEach((node) => { if (contacts.email) node.href = `mailto:${contacts.email}`; });
  document.querySelectorAll("[data-brand-instagram-link]").forEach((node) => { if (contacts.instagram) node.href = `https://www.instagram.com/${contacts.instagram}/`; });
  if (content.hero) {
    setText("[data-content-hero-kicker]", content.hero.kicker);
    setText("[data-content-hero-lead]", content.hero.lead);
    setText("[data-content-hero-title]", content.hero.title);
    setText("[data-content-hero-emphasis]", content.hero.emphasis);
    setText("[data-content-hero-primary]", content.hero.primaryCta);
    setText("[data-content-hero-assistant]", content.hero.assistantCta);
  }
  document.querySelectorAll("[data-brand-logo]").forEach((image) => {
    if (!(image instanceof HTMLImageElement)) return;
    if (brand.logo?.header) image.src = window.FORNO_META?.resolve?.(brand.logo.header) || brand.logo.header;
    image.alt = "";
  });
})();
