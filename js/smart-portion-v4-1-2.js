(() => {
  "use strict";

  const LIMITS = Object.freeze({ adults: [1, 20], children: [0, 12] });
  const APPETITE = Object.freeze({ leve: 0.82, normal: 1, alta: 1.22 });
  const SIZE_META = Object.freeze({
    media: Object.freeze({ id: "media", label: "Média", diameterCm: 30, serves: Object.freeze({ min: 1, max: 2 }), midpoint: 1.5 }),
    grande: Object.freeze({ id: "grande", label: "Grande", diameterCm: 35, serves: Object.freeze({ min: 2, max: 3 }), midpoint: 2.5 }),
    familia: Object.freeze({ id: "familia", label: "Família", diameterCm: 40, serves: Object.freeze({ min: 3, max: 5 }), midpoint: 4 }),
  });

  const clampInt = (value, min, max) => Math.min(max, Math.max(min, Number.parseInt(value, 10) || min));
  const appetiteFactor = (value) => APPETITE[value] || APPETITE.normal;

  function effectivePeople({ adults = 1, children = 0, appetite = "normal" } = {}) {
    const a = clampInt(adults, ...LIMITS.adults);
    const c = clampInt(children, ...LIMITS.children);
    return Math.max(1, (a + c * 0.65) * appetiteFactor(appetite));
  }

  function planFor(effective) {
    if (effective <= 1.75) return [{ size: "media", qty: 1 }];
    if (effective <= 3) return [{ size: "grande", qty: 1 }];
    if (effective <= 5) return [{ size: "familia", qty: 1 }];

    let remaining = effective;
    const plan = [];
    const families = Math.floor(remaining / SIZE_META.familia.midpoint);
    if (families > 0) {
      plan.push({ size: "familia", qty: families });
      remaining -= families * SIZE_META.familia.midpoint;
    }
    if (remaining > 0.25) {
      if (remaining <= 1.75) plan.push({ size: "media", qty: 1 });
      else if (remaining <= 3) plan.push({ size: "grande", qty: 1 });
      else plan.push({ size: "familia", qty: 1 });
    }
    return plan;
  }

  function coverage(plan) {
    return plan.reduce((acc, item) => {
      const meta = SIZE_META[item.size];
      return {
        min: acc.min + meta.serves.min * item.qty,
        max: acc.max + meta.serves.max * item.qty,
        pizzas: acc.pizzas + item.qty,
      };
    }, { min: 0, max: 0, pizzas: 0 });
  }

  function formatPlan(plan) {
    return plan.map(({ size, qty }) => `${qty} ${qty === 1 ? "pizza" : "pizzas"} ${SIZE_META[size].label}`).join(" + ");
  }

  function recommend(input = {}) {
    const adults = clampInt(input.adults ?? 1, ...LIMITS.adults);
    const children = clampInt(input.children ?? 0, ...LIMITS.children);
    const appetite = APPETITE[input.appetite] ? input.appetite : "normal";
    const effective = effectivePeople({ adults, children, appetite });
    const plan = planFor(effective);
    const range = coverage(plan);
    const preferredSize = plan.slice().sort((a, b) => b.qty - a.qty || SIZE_META[b.size].midpoint - SIZE_META[a.size].midpoint)[0]?.size || "media";
    return Object.freeze({ adults, children, appetite, effective, plan: Object.freeze(plan.map(Object.freeze)), range: Object.freeze(range), preferredSize });
  }

  function summary(result) {
    const appetiteLabel = result.appetite === "leve" ? "apetite leve" : result.appetite === "alta" ? "apetite alto" : "apetite normal";
    return `${formatPlan(result.plan)}. Faixa de referência: aproximadamente ${result.range.min}–${result.range.max} pessoas, considerando ${appetiteLabel}.`;
  }

  function initUI() {
    const form = document.getElementById("portion-form");
    if (!form) return;
    const resultBox = document.getElementById("portion-result");
    const resultTitle = document.getElementById("portion-result-title");
    const resultSummary = document.getElementById("portion-result-summary");
    const resultDetail = document.getElementById("portion-result-detail");
    const apply = document.getElementById("portion-apply-size");
    const status = document.getElementById("portion-status");

    const render = () => {
      const data = new FormData(form);
      const result = recommend({ adults: data.get("adults"), children: data.get("children"), appetite: data.get("appetite") });
      if (resultSummary) resultSummary.textContent = formatPlan(result.plan);
      if (resultDetail) resultDetail.textContent = `Estimativa de referência: ${result.range.min}–${result.range.max} pessoas. Crianças contam com peso menor no cálculo e o apetite ajusta a margem.`;
      if (apply) {
        apply.dataset.portionSize = result.preferredSize;
        apply.textContent = `Usar tamanho ${SIZE_META[result.preferredSize].label} no configurador`;
      }
      if (resultBox) resultBox.hidden = false;
      if (status) status.textContent = summary(result);
      return result;
    };

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      render();
      resultTitle?.focus();
    });

    apply?.addEventListener("click", () => {
      const size = apply.dataset.portionSize || "media";
      const select = document.getElementById("size-select");
      const section = document.getElementById("pedido");
      if (select && [...select.options].some((option) => option.value === size)) {
        select.value = size;
        select.dispatchEvent(new Event("input", { bubbles: true }));
      }
      section?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
      select?.focus();
      if (status) status.textContent = `Tamanho ${SIZE_META[size].label} aplicado ao configurador. Escolha o sabor para confirmar disponibilidade e preço.`;
    });
  }

  window.FORNO_PORTIONS = Object.freeze({ recommend, summary, formatPlan, effectivePeople, SIZE_META });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initUI, { once: true });
  else initUI();
})();
