(() => {
  "use strict";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const app = () => window.FORNO_APP;

  function refreshOrderPage() {
    const text = $("#order-page-summary-text");
    if (!text) return;
    const summary = app()?.getBagSummary?.();
    if (!summary?.count) {
      text.textContent = "Sua Sacola está vazia. Escolha algo no cardápio antes de continuar.";
      $("#order-page-open-checkout")?.setAttribute("disabled", "");
      return;
    }
    text.textContent = `${summary.count} ${summary.count === 1 ? "item" : "itens"} · ${summary.totalLabel}.`;
    $("#order-page-open-checkout")?.removeAttribute("disabled");
    const resume=$("#order-page-resume"); if(resume) resume.hidden=false;
  }

  document.addEventListener("DOMContentLoaded", () => {
    refreshOrderPage();
    $$('[data-product-page-add]').forEach((button) => button.addEventListener("click", () => {
      const id = button.dataset.productPageAdd;
      if (app()?.addProduct?.(id)) {
        button.textContent = "Adicionado à Sacola";
        setTimeout(() => { button.textContent = `Adicionar à Sacola`; }, 1800);
        refreshOrderPage();
      }
    }));
    $$('[data-product-page-customize]').forEach((button) => button.addEventListener("click", () => app()?.openProduct?.(button.dataset.productPageCustomize)));
    $("#order-page-open-checkout")?.addEventListener("click", () => app()?.openCheckout?.());
    $$('[data-open-cart]').forEach((button) => button.addEventListener("click", () => app()?.openBag?.()));
    window.addEventListener("storage", refreshOrderPage);
  });
})();
