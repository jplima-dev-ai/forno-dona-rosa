(() => {
  "use strict";

  const byId = (id) => document.getElementById(id);
  const text = (value) => String(value ?? "").trim();
  const issue = (severity, area, message, target = "") => Object.freeze({ severity, area, message, target });

  function inspect(state) {
    const findings = [];
    if (!state || !window.ADMIN_APP?.core) return { score: 0, ready: false, findings: [issue("critical", "Painel", "Rascunho ainda não disponível.")] };
    const core = window.ADMIN_APP.core;
    const validation = core.validate(state);
    validation.errors.forEach((message) => findings.push(issue("critical", "Validação", message)));

    const products = Array.isArray(state.catalog?.products) ? state.catalog.products : [];
    for (const product of products) {
      const label = text(product.name) || text(product.id) || "Produto sem nome";
      if (text(product.description).length < 32) findings.push(issue("warning", "Produtos", `${label}: descrição curta para uma decisão de compra clara.`, "products"));
      if (!text(product.image)) findings.push(issue("critical", "Mídia", `${label}: imagem principal ausente.`, "media"));
      const media = product.media || {};
      if (!text(media.alt)) findings.push(issue("warning", "Mídia", `${label}: descrição alternativa de mídia ainda não está definida no contrato 4.x.`, "media"));
      if (media.plannedSource && media.plannedSource === product.image) findings.push(issue("info", "Mídia", `${label}: source planejado já coincide com a imagem principal.`, "media"));
      if (media.plannedSource && media.plannedSource !== product.image) findings.push(issue("warning", "Mídia", `${label}: existe uma imagem premium planejada ainda não promovida para source principal.`, "media"));
      if (!Array.isArray(product.traits) || product.traits.length < 2) findings.push(issue("warning", "Descoberta", `${label}: poucos traits para busca, Rosa e Smart Menu.`, "products"));
    }

    const hero = state.content?.hero || {};
    if (text(hero.title).length > 90) findings.push(issue("warning", "Conteúdo", "Título principal está longo; revise quebra em mobile e SEO.", "content"));
    if (text(hero.lead).length > 220) findings.push(issue("info", "Conteúdo", "Descrição principal é extensa; confirme ritmo de leitura na primeira dobra.", "content"));

    const articles = Array.isArray(state.articles?.articles) ? state.articles.articles : [];
    for (const article of articles.filter((item) => item?.published !== false)) {
      const label = text(article.title) || text(article.slug) || "Artigo";
      if (!text(article.seoTitle)) findings.push(issue("warning", "SEO", `${label}: título SEO específico ausente.`, "articles"));
      if (!text(article.seoDescription)) findings.push(issue("warning", "SEO", `${label}: descrição SEO específica ausente.`, "articles"));
    }

    const reviews = Array.isArray(state.reviews?.reviews) ? state.reviews.reviews : [];
    if (!reviews.some((review) => review?.active !== false && review?.authorized === true)) findings.push(issue("info", "Confiança", "Nenhuma avaliação real autorizada está ativa. Não invente prova social; publique somente quando existir autorização.", "reviews"));

    const critical = findings.filter((item) => item.severity === "critical").length;
    const warnings = findings.filter((item) => item.severity === "warning").length;
    const infos = findings.filter((item) => item.severity === "info").length;
    const score = Math.max(0, 100 - critical * 25 - warnings * 6 - infos * 1);
    return Object.freeze({ score, ready: critical === 0, critical, warnings, infos, findings: Object.freeze(findings) });
  }

  function badgeText(report) {
    if (!report.ready) return "Bloqueado";
    if (report.score >= 90) return "Pronto para quality gate";
    if (report.score >= 75) return "Bom, com revisões";
    return "Precisa de revisão";
  }

  function render() {
    const host = byId("admin-health-findings");
    if (!host || !window.ADMIN_APP) return null;
    const report = inspect(window.ADMIN_APP.getState());
    byId("health-score").textContent = `${report.score}/100`;
    byId("health-critical").textContent = String(report.critical);
    byId("health-warnings").textContent = String(report.warnings);
    byId("health-readiness").textContent = badgeText(report);
    host.replaceChildren();
    if (!report.findings.length) {
      const p = document.createElement("p"); p.textContent = "Nenhum alerta estrutural encontrado neste rascunho."; host.append(p);
      return report;
    }
    const list = document.createElement("ul"); list.className = "admin-health-list";
    for (const finding of report.findings) {
      const li = document.createElement("li"); li.dataset.severity = finding.severity;
      const strong = document.createElement("strong"); strong.textContent = `${finding.area} — ${finding.severity === "critical" ? "Bloqueador" : finding.severity === "warning" ? "Revisar" : "Observação"}`;
      const p = document.createElement("p"); p.textContent = finding.message;
      li.append(strong, p);
      if (finding.target) {
        const button = document.createElement("button"); button.type = "button"; button.textContent = "Ir para esta área";
        button.addEventListener("click", () => {
          const section = byId(finding.target); section?.scrollIntoView({ block: "start" }); section?.querySelector("input,select,textarea,button,a")?.focus();
        });
        li.append(button);
      }
      list.append(li);
    }
    host.append(list);
    return report;
  }

  function init() {
    byId("health-refresh")?.addEventListener("click", () => {
      const report = render();
      window.ADMIN_APP?.setStatus?.(report?.ready ? "Saúde do conteúdo atualizada. Execute o quality gate antes de publicar." : "Saúde do conteúdo atualizada. Existem bloqueadores a corrigir.");
    });
    render();
  }

  window.addEventListener("admin:ready", init, { once: true });
  window.ADMIN_HEALTH_V4 = Object.freeze({ inspect, render });
})();
