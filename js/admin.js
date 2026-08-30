(() => {
  "use strict";
  const core = window.ADMIN_CORE;
  const $ = (id) => document.getElementById(id);
  const DRAFT_KEY = "forno-admin-draft-v1";
  const MAX_IMPORT_BYTES = 2_000_000;
  let state = null;
  let dirty = false;
  const history = window.ADMIN_HISTORY.create(30);
  const MODE_KEY = "forno-admin-mode-v1";
  const ONBOARDING_KEY = "forno-admin-onboarding-v1";
  const draftRepository = window.ADMIN_PERSISTENCE.createLocalDraftRepository(localStorage, DRAFT_KEY);

  const dayNames = ["Domingo","Segunda-feira","Terça-feira","Quarta-feira","Quinta-feira","Sexta-feira","Sábado"];
  const setStatus = (message) => { $("draft-status").textContent = message; };
  const markDirty = (label = "Alteração de configuração") => {
    dirty = true; history.capture(state, label); setStatus("Alterações ainda não exportadas."); updateSummary(); renderHistory(); updatePreview();
  };
  const safeAsset = (path) => { const value = String(path || "").replace(/^\.\//, ""); return /^(?:assets|data)\/[a-z0-9_./-]+$/i.test(value) && !value.includes("..") ? `../${value}` : ""; };

  async function fetchJson(path) {
    const response = await fetch(path, { cache: "no-store" });
    if (!response.ok) throw new Error(`Não foi possível carregar ${path}.`);
    return response.json();
  }

  function assign(path, value) {
    const parts = path.split(".");
    let target = state;
    while (parts.length > 1) target = target[parts.shift()];
    target[parts[0]] = value;
    markDirty(`Alterado: ${path}`);
  }

  function bindText(id, path, transform = core.text) {
    const el = $(id);
    el.addEventListener("input", () => assign(path, transform(el.value)));
  }

  function populateStaticFields() {
    const b = state.brand.brand, c = state.brand.contacts, l = state.brand.location, commerce = state.brand.commerce, hero = state.content.hero, credits = state.brand.credits || {};
    $("brand-name").value = b.name || ""; $("brand-legal-name").value = b.legalDisplayName || ""; $("brand-short-name").value = b.shortName || ""; $("brand-namespace").value = b.storageNamespace || "";
    $("contact-whatsapp").value = c.whatsappNumber || ""; $("contact-whatsapp-display").value = c.whatsappDisplay || ""; $("contact-email").value = c.email || ""; $("contact-instagram").value = c.instagram || "";
    $("location-address").value = l.streetAddress || ""; $("location-city").value = l.city || ""; $("location-state").value = l.state || ""; $("location-postal").value = l.postalCode || "";
    $("credit-enabled").checked = credits.enabled !== false; $("credit-label").value = credits.label || "Desenvolvido por"; $("credit-name").value = credits.name || "KJ Productions";
    $("op-delivery").checked = commerce.fulfillment?.delivery !== false; $("op-pickup").checked = commerce.fulfillment?.pickup === true; $("op-pix").checked = commerce.payment?.methods?.includes("pix"); $("op-cash").checked = commerce.payment?.methods?.includes("cash"); $("op-scheduling").checked = commerce.scheduling?.enabled === true;
    $("hero-title").value = hero.title || ""; $("hero-emphasis").value = hero.emphasis || ""; $("hero-lead").value = hero.lead || ""; $("hero-primary").value = hero.primaryCta || ""; $("hero-assistant").value = hero.assistantCta || "";
  }

  function buildHours() {
    const host = $("hours-editor"); host.replaceChildren();
    dayNames.forEach((name, index) => {
      const row = document.createElement("div"); row.className = "day-row";
      const label = document.createElement("strong"); label.textContent = name;
      const openWrap = document.createElement("div"); openWrap.className = "field"; const openLabel = document.createElement("label"); openLabel.textContent = "Abre"; openLabel.htmlFor = `hours-${index}-open`; const open = document.createElement("input"); open.type = "time"; open.id = `hours-${index}-open`; open.value = String(state.brand.hours?.[index]?.open || "").replace("24:00", "00:00");
      const closeWrap = document.createElement("div"); closeWrap.className = "field"; const closeLabel = document.createElement("label"); closeLabel.textContent = "Fecha"; closeLabel.htmlFor = `hours-${index}-close`; const close = document.createElement("input"); close.type = "time"; close.id = `hours-${index}-close`; close.value = String(state.brand.hours?.[index]?.close || "").replace("24:00", "00:00");
      const sync = () => { state.brand.hours[index] = { ...(state.brand.hours[index] || {}), label: name, open: open.value || "00:00", close: close.value === "00:00" ? "24:00" : close.value }; markDirty(); };
      open.addEventListener("change", sync); close.addEventListener("change", sync);
      openWrap.append(openLabel, open); closeWrap.append(closeLabel, close); row.append(label, openWrap, closeWrap); host.append(row);
    });
  }

  function buildProductSelect() {
    const select = $("product-select"); select.replaceChildren();
    state.catalog.products.forEach((product) => { const option = document.createElement("option"); option.value = product.id; option.textContent = product.name; select.append(option); });
    select.addEventListener("change", loadProduct);
    loadProduct();
  }

  function currentProduct() { return state.catalog.products.find((p) => p.id === $("product-select").value); }
  function loadProduct() {
    const product = currentProduct(); if (!product) return;
    const unavailable = new Set(state.brand.commerce.availability?.unavailableProductIds || []);
    const featured = new Set(state.brand.commerce.merchandising?.featuredProductIds || []);
    $("product-name").value = product.name || ""; $("product-price").value = Number(product.basePrice || 0).toFixed(2); $("product-category").value = product.category || ""; $("product-badge").value = product.badge || ""; $("product-description").value = product.description || ""; $("product-available").checked = !unavailable.has(product.id); $("product-featured").checked = featured.has(product.id); $("product-featured-label").value = state.brand.commerce.merchandising?.labels?.[product.id] || "";
    $("product-image").src = safeAsset(product.image); $("product-image").alt = `Prévia de ${product.name}`; $("product-preview-name").textContent = product.name; $("product-preview-price").textContent = new Intl.NumberFormat("pt-BR", { style:"currency", currency:"BRL" }).format(product.basePrice);
  }

  function applyProduct() {
    const product = currentProduct(); if (!product) return;
    const price = core.money($("product-price").value);
    product.name = core.text($("product-name").value, 120); product.basePrice = price; product.category = core.text($("product-category").value, 64); product.badge = core.text($("product-badge").value, 60); product.description = core.text($("product-description").value, 360);
    state = core.setProductAvailability(state, product.id, $("product-available").checked);
    state = core.setFeatured(state, product.id, $("product-featured").checked, $("product-featured-label").value);
    dirty = true; history.capture(state, `Produto atualizado: ${product.name}`); buildProductSelect(); $("product-select").value = product.id; loadProduct(); setStatus(`Alterações de ${product.name} aplicadas ao rascunho.`); updateSummary(); renderHistory(); updatePreview();
  }

  function buildSauces() {
    const host = $("sauce-list"); host.replaceChildren();
    const sauces = state.brand.commerce.orderExtras?.sauces || [];
    sauces.forEach((sauce, index) => {
      const row = document.createElement("div"); row.className = "sauce-row";
      const label = document.createElement("label"); label.htmlFor = `sauce-name-${index}`; label.textContent = sauce.name;
      const name = document.createElement("input"); name.id = `sauce-name-${index}`; name.value = sauce.name; name.maxLength = 60; name.setAttribute("aria-label", `Nome do molho ${index + 1}`);
      const price = document.createElement("input"); price.type = "number"; price.min = "0"; price.step = "0.01"; price.value = Number(sauce.price || 0).toFixed(2); price.setAttribute("aria-label", `Preço de ${sauce.name}`);
      const availableLabel = document.createElement("label"); availableLabel.className = "check-row"; const available = document.createElement("input"); available.type = "checkbox"; available.checked = sauce.available !== false; const span = document.createElement("span"); span.textContent = "Disponível"; availableLabel.append(available, span);
      const sync = () => { sauce.name = core.text(name.value, 60); sauce.price = core.money(price.value) ?? 0; sauce.available = available.checked; label.textContent = sauce.name || `Molho ${index + 1}`; markDirty(); };
      name.addEventListener("input", sync); price.addEventListener("change", sync); available.addEventListener("change", sync); row.append(label, name, price, availableLabel); host.append(row);
    });
  }

  function updateSummary() {
    if (!state) return; const info = core.summary(state); $("summary-products").textContent = info.products; $("summary-available").textContent = info.available; $("summary-unavailable").textContent = info.unavailable; $("summary-featured").textContent = info.featured;
  }

  function validateCurrent(announce = true) {
    const result = core.validate(state); if (announce) setStatus(result.ok ? "Configuração válida. Pronta para exportar." : `Há ${result.errors.length} problema(s). ${result.errors[0]}`); return result;
  }

  function downloadJson(filename, value) {
    const blob = new Blob([JSON.stringify(value, null, 2) + "\n"], { type:"application/json" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = filename; document.body.append(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  }

  function exportBundle() {
    const result = validateCurrent(); if (!result.ok) return;
    try { downloadJson(`forno-admin-bundle-${new Date().toISOString().slice(0,10)}.json`, core.exportEnvelope(state, window.FORNO_META?.version || "3.7.9")); dirty = false; setStatus("Bundle exportado. O rascunho continua disponível neste navegador."); }
    catch (error) { setStatus(error.message); }
  }

  function saveDraft() { if (draftRepository.save(state)) { dirty = false; setStatus("Rascunho salvo somente neste navegador."); } else { setStatus("Não foi possível salvar o rascunho. Exporte um backup antes de sair."); } }
  function resetDraft() { draftRepository.clear(); location.reload(); }

  async function importBundle(file) {
    try {
      if (!file || file.size <= 0) throw new Error("Selecione um arquivo JSON válido.");
      if (file.size > MAX_IMPORT_BYTES) throw new Error("O backup excede o limite de 2 MB.");
      if (!/\.json$/i.test(file.name || "")) throw new Error("Use um arquivo com extensão .json.");
      const parsed = JSON.parse(await file.text());
      if (parsed?.format && (parsed.format !== "forno-admin-bundle" || parsed.formatVersion !== 1)) throw new Error("Formato de bundle não suportado.");
      state = core.normalizeBundle(parsed);
      const result = core.validate(state);
      if (!result.ok) throw new Error(result.errors[0]);
      dirty = true; renderAll(); setStatus("Backup importado para o rascunho. Revise e exporte quando estiver pronto.");
    } catch (error) { setStatus(`Não foi possível importar: ${error.message}`); }
  }

  function bindOperations() {
    $("op-delivery").addEventListener("change", () => { state.brand.commerce.fulfillment.delivery = $("op-delivery").checked; markDirty(); });
    $("op-pickup").addEventListener("change", () => { state.brand.commerce.fulfillment.pickup = $("op-pickup").checked; markDirty(); });
    const syncPayments = () => { const methods=[]; if ($("op-pix").checked) methods.push("pix"); if ($("op-cash").checked) methods.push("cash"); state.brand.commerce.payment.methods = methods; if (!methods.includes(state.brand.commerce.payment.default)) state.brand.commerce.payment.default = methods[0] || "pix"; markDirty(); };
    $("op-pix").addEventListener("change", syncPayments); $("op-cash").addEventListener("change", syncPayments); $("op-scheduling").addEventListener("change", () => { state.brand.commerce.scheduling.enabled = $("op-scheduling").checked; markDirty(); });
  }

  function bindFields() {
    bindText("brand-name","brand.brand.name",v=>core.text(v,80)); bindText("brand-legal-name","brand.brand.legalDisplayName",v=>core.text(v,120)); bindText("brand-short-name","brand.brand.shortName",v=>core.text(v,40)); bindText("brand-namespace","brand.brand.storageNamespace",core.slug);
    bindText("contact-whatsapp","brand.contacts.whatsappNumber",core.digits); bindText("contact-whatsapp-display","brand.contacts.whatsappDisplay",v=>core.text(v,32)); bindText("contact-email","brand.contacts.email",v=>core.text(v,160)); bindText("contact-instagram","brand.contacts.instagram",v=>core.text(v,80));
    bindText("location-address","brand.location.streetAddress",v=>core.text(v,180)); bindText("location-city","brand.location.city",v=>core.text(v,80)); bindText("location-state","brand.location.state",v=>core.text(v,2).toUpperCase()); bindText("location-postal","brand.location.postalCode",v=>core.text(v,9));
    $("credit-enabled").addEventListener("change",()=>{ state.brand.credits.enabled=$("credit-enabled").checked; markDirty("Crédito do desenvolvedor alterado"); });
    bindText("credit-label","brand.credits.label",v=>core.text(v,40)); bindText("credit-name","brand.credits.name",v=>core.text(v,80));
    bindText("hero-title","content.hero.title",v=>core.text(v,180)); bindText("hero-emphasis","content.hero.emphasis",v=>core.text(v,160)); bindText("hero-lead","content.hero.lead",v=>core.text(v,320)); bindText("hero-primary","content.hero.primaryCta",v=>core.text(v,60)); bindText("hero-assistant","content.hero.assistantCta",v=>core.text(v,80));
  }

  function setMode(mode) {
    const resolved = mode === "advanced" ? "advanced" : "simple";
    document.documentElement.dataset.adminMode = resolved; $("admin-mode").value = resolved; localStorage.setItem(MODE_KEY, resolved);
  }

  function renderHistory() {
    const host = $("change-history"); if (!host) return; host.replaceChildren();
    const entries = history.entries();
    if (!entries.length) { const item = document.createElement("li"); item.textContent = "Nenhuma alteração registrada nesta sessão."; host.append(item); }
    else entries.forEach((entry) => { const item = document.createElement("li"); const time = new Date(entry.at).toLocaleTimeString("pt-BR", {hour:"2-digit", minute:"2-digit"}); item.textContent = `${time} — ${entry.label}`; host.append(item); });
    $("undo-button").disabled = !history.canUndo();
  }

  function updatePreview() {
    if (!state || !$("preview-brand")) return;
    const info = core.summary(state); const credits = state.brand.credits || {};
    $("preview-brand").textContent = state.brand.brand?.legalDisplayName || state.brand.brand?.name || "Pizzaria";
    $("preview-hero").textContent = [state.content.hero?.title, state.content.hero?.emphasis].filter(Boolean).join(" ");
    $("preview-products").textContent = `${info.products} produtos`;
    $("preview-fulfillment").textContent = [info.delivery ? "Entrega" : "", info.pickup ? "Retirada" : ""].filter(Boolean).join(" + ") || "Recebimento não configurado";
    $("preview-payments").textContent = (state.brand.commerce?.payment?.methods || []).map((item)=>item === "pix" ? "Pix" : item === "cash" ? "Dinheiro" : item).join(" + ");
    $("preview-credit").hidden = credits.enabled === false; $("preview-credit").textContent = `${credits.label || "Desenvolvido por"} ${credits.name || "KJ Productions"}`;
  }

  const searchActions = [
    ["preço produto cardápio", "Alterar preço de um produto", "products"],
    ["disponível esgotado indisponível", "Marcar produto disponível ou indisponível", "products"],
    ["horário sábado domingo abrir fechar", "Alterar horários da pizzaria", "operations"],
    ["whatsapp telefone contato", "Alterar WhatsApp", "brand"],
    ["endereço cep cidade localização", "Alterar endereço", "brand"],
    ["pix dinheiro pagamento", "Alterar formas de pagamento", "operations"],
    ["molho ketchup maionese", "Alterar molhos", "extras"],
    ["texto home título chamada", "Editar texto principal", "content"],
    ["artigo artigos blog curiosidade editorial", "Gerenciar artigos", "articles"],
    ["newsletter email lista novidades", "Configurar newsletter", "newsletter"],
    ["backup exportar importar", "Backup e exportação", "backup"],
    ["preview visualizar", "Visualizar alterações", "preview"],
    ["histórico desfazer", "Histórico e desfazer", "history"]
  ];
  function renderAdminSearch(query = "") {
    const host = $("admin-search-results"); host.replaceChildren(); const term = core.text(query,80).toLowerCase();
    const matches = searchActions.filter(([keys,label]) => !term || `${keys} ${label}`.toLowerCase().includes(term)).slice(0,8);
    if (!matches.length) { const p = document.createElement("p"); p.textContent = "Nenhuma ação encontrada. Tente produto, preço, horário, WhatsApp, artigo ou newsletter."; host.append(p); return; }
    matches.forEach(([,label,target]) => { const button=document.createElement("button"); button.type="button"; button.textContent=label; button.addEventListener("click",()=>{ $("admin-search-dialog").close(); document.getElementById(target)?.scrollIntoView({block:"start"}); document.getElementById(target)?.querySelector("input,select,textarea,button,a")?.focus(); }); host.append(button); });
  }

  function bindWorkflow() {
    $("admin-mode").addEventListener("change",()=>setMode($("admin-mode").value));
    document.querySelectorAll("[data-admin-jump]").forEach((button)=>button.addEventListener("click",()=>document.getElementById(button.dataset.adminJump)?.scrollIntoView({block:"start"})));
    $("undo-button").addEventListener("click",()=>{ const restored=history.undo(); if (!restored) return; state=restored; dirty=true; renderAll(); setStatus("Última alteração desfeita."); });
    $("clear-history-button").addEventListener("click",()=>{ history.clearKeepCurrent(state); renderHistory(); setStatus("Histórico desta sessão limpo. O rascunho atual foi preservado."); });
    $("refresh-preview").addEventListener("click",()=>{ updatePreview(); setStatus("Preview atualizado com o rascunho atual."); });
    $("admin-search-open").addEventListener("click",()=>{ renderAdminSearch(); $("admin-search-dialog").showModal(); $("admin-search-input").focus(); });
    $("admin-search-close").addEventListener("click",()=>$("admin-search-dialog").close());
    $("admin-search-input").addEventListener("input",()=>renderAdminSearch($("admin-search-input").value));
    $("onboarding-start").addEventListener("click",()=>{ localStorage.setItem(ONBOARDING_KEY,"done"); setMode("simple"); });
    $("onboarding-skip").addEventListener("click",()=>localStorage.setItem(ONBOARDING_KEY,"done"));
  }

  function renderAll() { populateStaticFields(); buildHours(); buildProductSelect(); buildSauces(); updateSummary(); renderHistory(); updatePreview(); }

  async function start() {
    try {
      const [brand, content, catalog, reviews, articles, newsletter] = await Promise.all([fetchJson("../data/brand/brand.json"), fetchJson("../data/brand/content.json"), fetchJson("../data/catalog.json"), fetchJson("../data/reviews.json"), fetchJson("../data/articles.json"), fetchJson("../data/newsletter.json")]);
      state = { brand, content, catalog, reviews, articles, newsletter };
      const saved = draftRepository.load(); if (saved) { try { state = core.normalizeBundle(saved); setStatus("Rascunho local restaurado."); } catch { draftRepository.clear(); } }
      history.reset(state); setMode(localStorage.getItem(MODE_KEY) || "simple"); renderAll(); bindFields(); bindOperations(); bindWorkflow();
      $("product-save").addEventListener("click", applyProduct); $("validate-button").addEventListener("click", () => validateCurrent(true)); $("export-button").addEventListener("click", exportBundle); $("save-draft").addEventListener("click", saveDraft); $("reset-draft").addEventListener("click", resetDraft); $("import-button").addEventListener("click", () => $("import-file").click()); $("import-file").addEventListener("change", () => { const file = $("import-file").files?.[0]; if (file) importBundle(file); $("import-file").value = ""; });
      window.addEventListener("beforeunload", (event) => { if (!dirty) return; event.preventDefault(); event.returnValue = ""; });
      if (!saved) setStatus("Configuração carregada. Nenhuma alteração pendente.");
      window.dispatchEvent(new CustomEvent("admin:ready"));
      if (!localStorage.getItem(ONBOARDING_KEY)) $("onboarding-dialog").showModal();
    } catch (error) { setStatus(`Falha ao carregar o painel: ${error.message}`); }
  }
  window.ADMIN_APP = Object.freeze({
    getState: () => state,
    markDirty,
    setStatus,
    updateSummary,
    updatePreview,
    core,
    downloadJson,
    renderAll
  });
  start();
})();
