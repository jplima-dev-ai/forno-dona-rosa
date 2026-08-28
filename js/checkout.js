(() => {
  "use strict";

  const config = window.FORNO_DELIVERY || {};
  const commerce = window.FORNO_COMMERCE || {};
  const brandCfg = window.PIZZARIA_CONFIG || {};
  const brandName = brandCfg.shortName || brandCfg.businessName || "a empresa";
  const postal = window.FORNO_POSTAL;
  const app = () => window.FORNO_APP;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const clean = (value, max = 120) => String(value || "").replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
  const digits = (value) => String(value || "").replace(/\D/g, "");
  const sessionKey = config.addressSessionKey || "forno-checkout-session-v1";
  const savedKey = config.savedAddressKey || "forno-saved-address-v1";
  let previousFocus = null;
  let lookupToken = 0;
  let addressMode = "pending";
  let verifiedAddress = null;

  const field = (id) => $(`#${id}`);
  const status = (text) => {
    const node = field("checkout-status");
    if (!node) return;
    node.textContent = "";
    requestAnimationFrame(() => { node.textContent = text; });
  };
  const setError = (id, message = "") => {
    const input = field(id);
    const error = field(`${id}-error`);
    if (!input || !error) return;
    error.textContent = message;
    error.hidden = !message;
    if (message) input.setAttribute("aria-invalid", "true"); else input.removeAttribute("aria-invalid");
  };
  const safeGet = (key) => { try { return JSON.parse(sessionStorage.getItem(key)); } catch { return null; } };
  const safeSetSession = (key, value) => { try { sessionStorage.setItem(key, JSON.stringify(value)); } catch {} };
  const safeGetLocal = (key) => { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } };
  const safeSetLocal = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; } };
  const safeRemoveLocal = (key) => { try { localStorage.removeItem(key); } catch {} };

  function selected(name, fallback) {
    return $(`input[name="${name}"]:checked`, field("checkout-form"))?.value || fallback;
  }
  function parseMoney(value) {
    const normalized = String(value || "").replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".");
    const number = Number(normalized);
    return Number.isFinite(number) && number >= 0 ? number : null;
  }
  function money(value) { return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value); }

  function readForm() {
    const noNumber = Boolean(field("checkout-no-number")?.checked);
    const fulfillment = selected("fulfillment", "delivery");
    const timing = selected("timing", "asap");
    const payment = selected("payment", "pix");
    return {
      name: clean(field("checkout-name")?.value, config.maxLengths?.name || 80),
      fulfillment,
      timing,
      scheduledAt: timing === "scheduled" ? clean(field("checkout-scheduled-at")?.value, 30) : "",
      payment,
      changeFor: payment === "cash" ? clean(field("checkout-change-for")?.value, 30) : "",
      postalCode: fulfillment === "delivery" ? (postal?.formatPostalCode(field("checkout-postal-code")?.value) || "") : "",
      street: fulfillment === "delivery" ? clean(field("checkout-street")?.value, config.maxLengths?.street || 120) : "",
      number: fulfillment === "delivery" ? (noNumber ? "S/N" : clean(field("checkout-number")?.value, config.maxLengths?.number || 20)) : "",
      noNumber: fulfillment === "delivery" && noNumber,
      neighborhood: fulfillment === "delivery" ? clean(field("checkout-neighborhood")?.value, config.maxLengths?.neighborhood || 80) : "",
      city: fulfillment === "delivery" ? clean(field("checkout-city")?.value, 60) : "",
      state: fulfillment === "delivery" ? clean(field("checkout-state")?.value, 2).toUpperCase() : "",
      complement: fulfillment === "delivery" ? clean(field("checkout-complement")?.value, config.maxLengths?.complement || 80) : "",
      reference: fulfillment === "delivery" ? clean(field("checkout-reference")?.value, config.maxLengths?.reference || 120) : "",
      remember: fulfillment === "delivery" && Boolean(field("checkout-remember")?.checked),
      sauces: $$('[name="sauces"]:checked').map((node) => node.value).filter((id) => commerce.orderExtras?.sauces?.some((item) => item.id === id)).slice(0, 12),
      validation: fulfillment === "delivery" ? addressMode : "pickup",
      provider: fulfillment === "delivery" ? (verifiedAddress?.provider || "manual") : "pickup"
    };
  }

  function writeForm(data = {}) {
    const pairs = {
      "checkout-name": clean(data.name, config.maxLengths?.name || 80),
      "checkout-postal-code": postal?.formatPostalCode(data.postalCode) || "",
      "checkout-street": clean(data.street, config.maxLengths?.street || 120),
      "checkout-number": data.noNumber ? "" : clean(data.number, config.maxLengths?.number || 20),
      "checkout-neighborhood": clean(data.neighborhood, config.maxLengths?.neighborhood || 80),
      "checkout-city": clean(data.city, 60),
      "checkout-state": clean(data.state, 2).toUpperCase(),
      "checkout-complement": clean(data.complement, config.maxLengths?.complement || 80),
      "checkout-reference": clean(data.reference, config.maxLengths?.reference || 120),
      "checkout-scheduled-at": clean(data.scheduledAt, 30),
      "checkout-change-for": clean(data.changeFor, 30)
    };
    Object.entries(pairs).forEach(([id, value]) => { if (field(id) && value !== undefined) field(id).value = value || ""; });
    if (field("checkout-no-number")) field("checkout-no-number").checked = Boolean(data.noNumber || data.number === "S/N");
    if (field("checkout-remember")) field("checkout-remember").checked = Boolean(data.remember);
    const fulfillment = ["delivery", "pickup"].includes(data.fulfillment) ? data.fulfillment : commerce.fulfillment?.default || "delivery";
    const timing = data.timing === "scheduled" ? "scheduled" : "asap";
    const payment = data.payment === "cash" ? "cash" : "pix";
    $(`input[name="fulfillment"][value="${fulfillment}"]`)?.click();
    $(`input[name="timing"][value="${timing}"]`)?.click();
    $(`input[name="payment"][value="${payment}"]`)?.click();
    const savedSauces = new Set(Array.isArray(data.sauces) ? data.sauces : []);
    $$('[name="sauces"]').forEach((node) => { node.checked = savedSauces.has(node.value); });
    updateNumberState();
    updateConditionalFields();
  }

  function setAddressFieldsReadonly(readonly) {
    ["checkout-street", "checkout-neighborhood", "checkout-city", "checkout-state"].forEach((id) => {
      const input = field(id); if (!input) return;
      input.readOnly = readonly; input.setAttribute("aria-readonly", readonly ? "true" : "false");
    });
    if (!readonly) {
      if (field("checkout-city")) field("checkout-city").value = config.city || "Serra";
      if (field("checkout-state")) field("checkout-state").value = config.state || "ES";
    }
  }

  function setDeliveryState(kind, message) {
    const box = field("delivery-validation"); if (!box) return;
    box.dataset.state = kind;
    box.querySelector("strong").textContent = kind === "eligible" ? "Entrega validada" : kind === "manual" ? "Endereço a confirmar" : kind === "blocked" ? "Fora da área de entrega" : "Validando endereço";
    box.querySelector("p").textContent = message; box.hidden = false;
  }
  function clearAddress({ preservePostalCode = true } = {}) {
    ["checkout-street", "checkout-neighborhood", "checkout-city", "checkout-state"].forEach((id) => { if (field(id)) field(id).value = ""; });
    if (!preservePostalCode && field("checkout-postal-code")) field("checkout-postal-code").value = "";
    verifiedAddress = null; addressMode = "pending";
  }
  function hideDeliveryState() { const box = field("delivery-validation"); if (box) box.hidden = true; }

  async function lookupPostalCode() {
    if (selected("fulfillment", "delivery") !== "delivery") return;
    const input = field("checkout-postal-code"); if (!input || !postal) return;
    const cep = postal.stripPostalCode(input.value); input.value = postal.formatPostalCode(cep); setError("checkout-postal-code", "");
    if (cep.length !== 8) { if (cep.length) setError("checkout-postal-code", "Digite os 8 números do CEP do endereço de entrega."); clearAddress(); return; }
    const token = ++lookupToken; addressMode = "loading";
    setDeliveryState("loading", "Buscando rua, bairro, cidade e estado pelo CEP…"); status("Buscando endereço pelo CEP.");
    const result = await postal.lookup(cep); if (token !== lookupToken) return;
    if (!result.ok) {
      verifiedAddress = null; addressMode = "manual"; setAddressFieldsReadonly(false);
      setDeliveryState("manual", `Não conseguimos validar este CEP automaticamente. Preencha rua e bairro; ${config.serviceAreaLabel || "a área atendida"} permanece como área de entrega e o atendimento confirmará o endereço.`);
      status("CEP não localizado automaticamente. Preencha rua e bairro. O atendimento confirmará o endereço."); field("checkout-street")?.focus(); persistSession(); return;
    }
    verifiedAddress = result.address;
    if (!postal.isServiceArea(result.address, config)) {
      addressMode = "blocked"; setAddressFieldsReadonly(true);
      field("checkout-street").value = result.address.street || ""; field("checkout-neighborhood").value = result.address.neighborhood || ""; field("checkout-city").value = result.address.city || ""; field("checkout-state").value = result.address.state || "";
      setDeliveryState("blocked", `Este CEP pertence a ${result.address.city || "outra cidade"} — ${result.address.state || ""}. No momento, as entregas são somente em ${config.serviceAreaLabel || "a área atendida"}.`);
      status(`Endereço fora da área de entrega. Atendemos somente ${config.serviceAreaLabel || "a área atendida"}.`); persistSession(); return;
    }
    addressMode = "eligible"; setAddressFieldsReadonly(true);
    field("checkout-street").value = result.address.street || ""; field("checkout-neighborhood").value = result.address.neighborhood || ""; field("checkout-city").value = result.address.city || config.city || "Serra"; field("checkout-state").value = result.address.state || config.state || "ES";
    const needsStreet = !result.address.street, needsNeighborhood = !result.address.neighborhood;
    if (needsStreet) { field("checkout-street").readOnly = false; field("checkout-street").setAttribute("aria-readonly", "false"); }
    if (needsNeighborhood) { field("checkout-neighborhood").readOnly = false; field("checkout-neighborhood").setAttribute("aria-readonly", "false"); }
    const missing = [needsStreet ? "rua" : "", needsNeighborhood ? "bairro" : ""].filter(Boolean).join(" e ");
    setDeliveryState("eligible", missing ? `CEP localizado em ${config.serviceAreaLabel || "a área atendida"}. Complete ${missing} e o número do imóvel antes de continuar.` : "Rua, bairro, cidade e estado foram preenchidos automaticamente. Complete apenas número e, se quiser, complemento ou referência.");
    status(missing ? `CEP localizado em Serra. Complete ${missing} e o número do imóvel.` : "Endereço encontrado em Serra. Rua, bairro, cidade e estado foram preenchidos automaticamente.");
    (needsStreet ? field("checkout-street") : needsNeighborhood ? field("checkout-neighborhood") : field("checkout-number"))?.focus(); persistSession();
  }

  function updateNumberState() {
    const noNumber = field("checkout-no-number")?.checked; const number = field("checkout-number"); if (!number) return;
    number.disabled = Boolean(noNumber); number.required = selected("fulfillment", "delivery") === "delivery" && !noNumber;
    if (noNumber) { number.value = ""; setError("checkout-number", ""); }
  }

  function businessNowParts(date = new Date()) {
    const parts = new Intl.DateTimeFormat("en-CA", { timeZone: commerce.timezone || brandCfg.timezone || "America/Sao_Paulo", year:"numeric", month:"2-digit", day:"2-digit", hour:"2-digit", minute:"2-digit", hourCycle:"h23" }).formatToParts(date);
    const get = (type) => Number(parts.find((p) => p.type === type)?.value || 0);
    return { y:get("year"), m:get("month"), d:get("day"), h:get("hour"), min:get("minute") };
  }
  function civilEpoch(parts) { return Date.UTC(parts.y, parts.m-1, parts.d, parts.h || 0, parts.min || 0); }
  function parseCivil(value) {
    const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(String(value || ""));
    return m ? { y:+m[1],m:+m[2],d:+m[3],h:+m[4],min:+m[5] } : null;
  }
  function validateSchedule(value) {
    const selectedTime = parseCivil(value); if (!selectedTime) return "Escolha a data e o horário do agendamento.";
    const now = businessNowParts(); const minLead = Math.max(0, Number(commerce.scheduling?.minLeadMinutes) || 0); const maxDays = Math.max(1, Number(commerce.scheduling?.maxDaysAhead) || 7);
    const selectedEpoch = civilEpoch(selectedTime), minEpoch = civilEpoch(now) + minLead*60000, maxEpoch = civilEpoch(now) + maxDays*86400000;
    if (selectedEpoch < minEpoch) return `Escolha um horário com pelo menos ${minLead} minutos de antecedência.`;
    if (selectedEpoch > maxEpoch) return `Escolha uma data dentro dos próximos ${maxDays} dias.`;
    const weekday = new Date(Date.UTC(selectedTime.y, selectedTime.m-1, selectedTime.d)).getUTCDay(); const slot = commerce.hours?.[weekday];
    if (!slot) return "A pizzaria não atende nesta data.";
    const [oh,om] = String(slot.open || "00:00").split(":").map(Number), [ch,cm] = String(slot.close || "00:00").split(":").map(Number);
    const mins = selectedTime.h*60+selectedTime.min, start=oh*60+om, end=ch===24?1440:ch*60+cm;
    if (mins < start || mins >= end) return `Escolha um horário entre ${slot.open} e ${slot.close === "24:00" ? "00:00" : slot.close}.`;
    return "";
  }

  function validate() {
    const data = readForm(); let ok = true;
    setError("checkout-name", data.name ? "" : "Informe seu nome para identificarmos o pedido."); if (!data.name) ok = false;
    if (data.fulfillment === "delivery") {
      const required = [["checkout-postal-code", digits(data.postalCode).length === 8, "Digite os 8 números do CEP."],["checkout-street", data.street, "Informe o nome da rua."],["checkout-neighborhood", data.neighborhood, "Informe o bairro."],["checkout-number", data.noNumber || data.number, "Informe o número da casa ou prédio, ou marque ‘Meu endereço não tem número’." ]];
      required.forEach(([id, condition, message]) => { setError(id, condition ? "" : message); if (!condition) ok = false; });
      if (addressMode === "loading" || (addressMode === "pending" && digits(data.postalCode).length === 8)) { setError("checkout-postal-code", "Aguarde a validação do CEP antes de continuar."); ok = false; }
      if (addressMode === "blocked") { setError("checkout-postal-code", `Este CEP está fora de ${config.serviceAreaLabel || "a área atendida"}.`); ok = false; }
      if (normalizeCity(data.city) !== normalizeCity(config.city || "Serra") || data.state !== String(config.state || "ES").toUpperCase()) { setError("checkout-postal-code", `As entregas são somente em ${config.serviceAreaLabel || "a área atendida"}.`); ok = false; }
    }
    const scheduleError = data.timing === "scheduled" ? validateSchedule(data.scheduledAt) : ""; setError("checkout-scheduled-at", scheduleError); if (scheduleError) ok = false;
    const total = app()?.getCheckoutSnapshot?.()?.total || 0; const change = data.changeFor ? parseMoney(data.changeFor) : null;
    const changeError = data.payment === "cash" && data.changeFor && (change === null || change < total) ? `Se precisar de troco, informe um valor igual ou maior que ${money(total)}.` : "";
    setError("checkout-change-for", changeError); if (changeError) ok = false;
    if (!ok) { const firstInvalid = $("[aria-invalid='true']", field("checkout-form")); firstInvalid?.focus(); status("Há informações que precisam ser corrigidas antes de revisar o pedido."); }
    return ok ? data : null;
  }

  function normalizeCity(value) { return postal?.normalizeText(value) || clean(value, 60).toLowerCase(); }
  function persistSession() { safeSetSession(sessionKey, { schemaVersion: 2, updatedAt: new Date().toISOString(), ...readForm() }); }
  function updateSavedAddressControl() { const button = field("checkout-forget-address"); if (button) button.hidden = !(safeGetLocal(savedKey)?.schemaVersion >= 1); }
  function restoreSavedData() {
    const session = safeGet(sessionKey), saved = safeGetLocal(savedKey); const source = session?.schemaVersion >= 1 ? session : saved?.schemaVersion >= 1 ? saved : null; if (!source) return;
    writeForm(source);
    if ((source.fulfillment || "delivery") === "delivery" && source.validation === "eligible" && normalizeCity(source.city) === normalizeCity(config.city || "Serra") && source.state === (config.state || "ES")) { addressMode="eligible"; verifiedAddress={provider:"saved",city:source.city,state:source.state}; setAddressFieldsReadonly(true); setDeliveryState("eligible","Endereço recuperado deste dispositivo. Confira os dados antes de continuar."); }
    else if (source.validation === "manual") { addressMode="manual"; setAddressFieldsReadonly(false); setDeliveryState("manual","Endereço recuperado. O atendimento confirmará os dados antes da entrega."); }
  }

  function updateConditionalFields() {
    const fulfillment = selected("fulfillment", "delivery"), timing = selected("timing", "asap"), payment = selected("payment", "pix");
    $$('[data-delivery-fields]').forEach((node) => {
      const hidden = fulfillment !== "delivery";
      node.hidden = hidden;
      node.querySelectorAll?.("input, select, textarea, button").forEach((control) => { control.disabled = hidden; });
    });
    $$('[data-pickup-fields]').forEach((node) => {
      const hidden = fulfillment !== "pickup";
      node.hidden = hidden;
      node.querySelectorAll?.("input, select, textarea, button").forEach((control) => { control.disabled = hidden; });
    });
    if (fulfillment === "pickup") { ++lookupToken; addressMode = "pending"; verifiedAddress = null; hideDeliveryState(); }
    $$('[data-schedule-fields]').forEach((node) => { node.hidden = timing !== "scheduled"; });
    $$('[data-cash-fields]').forEach((node) => { node.hidden = payment !== "cash"; });
    if (field("checkout-postal-code")) field("checkout-postal-code").required = fulfillment === "delivery";
    ["checkout-street","checkout-neighborhood"].forEach((id) => { if (field(id)) field(id).required = fulfillment === "delivery"; });
    updateNumberState();
    const note = field("checkout-commerce-note");
    if (note) note.textContent = fulfillment === "pickup" ? `Retirada em ${commerce.pickup?.addressLabel || brandCfg.address || "na pizzaria"}. O horário escolhido e a disponibilidade são confirmados no WhatsApp.` : `${commerce.deliveryFee?.label || "Taxa de entrega confirmada no WhatsApp"}. ${commerce.deliveryEstimate?.label || "Prazo confirmado no WhatsApp"}.`;
    persistSession();
  }

  function buildReview(data) {
    const review=field("checkout-review-content"); if(!review)return; while(review.firstChild)review.removeChild(review.firstChild); const snapshot=app()?.getCheckoutSnapshot?.();
    const block=(title,lines)=>{const section=document.createElement("section"),heading=document.createElement("h3");heading.textContent=title;section.append(heading);lines.filter(Boolean).forEach((line)=>{const p=document.createElement("p");p.textContent=line;section.append(p);});review.append(section);};
    block("Cliente",[data.name]);
    if (data.fulfillment === "delivery") block("Entrega",[`${data.street}, ${data.number}`,data.neighborhood,`${data.city} — ${data.state}`,`CEP ${data.postalCode}`,data.complement?`Complemento: ${data.complement}`:"",data.reference?`Referência: ${data.reference}`:"",data.validation==="manual"?"Endereço: confirmação necessária pelo atendimento.":`Endereço: dentro de ${config.serviceAreaLabel || "a área atendida"}.`,commerce.deliveryFee?.label || "Taxa de entrega confirmada no WhatsApp",commerce.deliveryEstimate?.label || "Prazo de entrega confirmado no WhatsApp"]);
    else block("Retirada",[commerce.pickup?.addressLabel || brandCfg.address || "Retirada na pizzaria"]);
    block("Quando",[data.timing === "scheduled" ? `Agendado para ${data.scheduledAt.replace("T"," às ")}` : "O mais rápido possível"]);
    block("Pagamento",[data.payment === "pix" ? "Pix" : "Dinheiro em espécie", data.payment === "cash" && data.changeFor ? `Troco para: ${data.changeFor}` : ""]);
    const sauceNames = (data.sauces || []).map((id) => commerce.orderExtras?.sauces?.find((item) => item.id === id)?.name).filter(Boolean);
    if (sauceNames.length) block("Molhos", sauceNames);
    if(snapshot?.lines?.length)block("Seu pedido",snapshot.lines); block("Subtotal demonstrativo",[snapshot?.totalLabel||"R$ 0,00"]);
  }

  function showStep(step) {
    const deliveryStep = field("checkout-delivery-step");
    const reviewStep = field("checkout-review-step");
    const isReview = step === "review";
    deliveryStep.hidden = isReview;
    reviewStep.hidden = !isReview;
    field("checkout-step-label").textContent = isReview ? "Etapa 3 de 3" : "Etapa 2 de 3";
    field("checkout-dialog-title").textContent = isReview ? "Confira antes de abrir o WhatsApp" : "Como você quer receber?";
    (isReview ? field("checkout-dialog-title") : field("checkout-name"))?.focus();
  }

  function messageForWhatsApp(data) {
    const snapshot=app()?.getCheckoutSnapshot?.(); if(!snapshot)return""; const lines=[`Olá, ${brandName}! Gostaria de confirmar este pedido.`,"","CLIENTE",`Nome: ${data.name}`,""];
    if(data.fulfillment==="delivery"){lines.push("ENTREGA",`CEP: ${data.postalCode}`,`Endereço: ${data.street}, ${data.number}`,`Bairro: ${data.neighborhood}`,`Cidade: ${data.city} - ${data.state}`);if(data.complement)lines.push(`Complemento: ${data.complement}`);if(data.reference)lines.push(`Referência: ${data.reference}`);if(data.validation==="manual")lines.push("Validação do endereço: confirmar manualmente com o cliente.");lines.push(commerce.deliveryFee?.label || "Taxa: confirmar no atendimento",commerce.deliveryEstimate?.label || "Prazo: confirmar no atendimento");}
    else lines.push("RETIRADA NA PIZZARIA",commerce.pickup?.addressLabel || brandCfg.address || "Confirmar endereço de retirada");
    lines.push("", "QUANDO", data.timing === "scheduled" ? `Agendado: ${data.scheduledAt.replace("T"," ")}` : "O mais rápido possível", "", "PAGAMENTO", data.payment === "pix" ? "Pix" : "Dinheiro em espécie");
    if(data.payment==="cash" && data.changeFor)lines.push(`Troco para: ${data.changeFor}`);
    const sauceNames=(data.sauces||[]).map((id)=>commerce.orderExtras?.sauces?.find((item)=>item.id===id)?.name).filter(Boolean);
    if(sauceNames.length)lines.push("","MOLHOS",...sauceNames.map((name)=>`- ${name}`));
    lines.push("","PEDIDO",...snapshot.messageLines,"",`Subtotal demonstrativo: ${snapshot.totalLabel}`,"","Pode confirmar disponibilidade, valor final e os detalhes do atendimento?"); return lines.join("\n");
  }

  function open(trigger) { const dialog=field("checkout-dialog"),summary=app()?.getBagSummary?.(); if(!dialog?.showModal||!summary?.count)return false;previousFocus=trigger instanceof HTMLElement&&trigger.offsetParent!==null?trigger:document.querySelector("#open-cart")||document.activeElement;restoreSavedData();updateConditionalFields();showStep("delivery");dialog.showModal();field("checkout-name")?.focus();return true; }
  function close(){const dialog=field("checkout-dialog");if(dialog?.open)dialog.close();}

  function init() {
    const dialog=field("checkout-dialog");if(!dialog)return;
    const pickupAddress=field("checkout-pickup-address");if(pickupAddress)pickupAddress.textContent=commerce.pickup?.addressLabel||brandCfg.address||"Endereço confirmado no WhatsApp";
    const pickupRadio=field("checkout-fulfillment-pickup");if(pickupRadio)pickupRadio.closest("label").hidden=commerce.fulfillment?.pickup!==true;
    const deliveryRadio=field("checkout-fulfillment-delivery");if(deliveryRadio)deliveryRadio.closest("label").hidden=commerce.fulfillment?.delivery===false;
    const scheduledRadio=field("checkout-time-scheduled");if(scheduledRadio)scheduledRadio.closest("label").hidden=commerce.scheduling?.enabled!==true;
    const sauceList=field("checkout-sauce-list");
    if(sauceList){
      while(sauceList.firstChild)sauceList.removeChild(sauceList.firstChild);
      (commerce.orderExtras?.sauces||[]).forEach((sauce)=>{
        const label=document.createElement("label");label.className="check-row checkout-sauce-option";
        const input=document.createElement("input");input.type="checkbox";input.name="sauces";input.value=sauce.id;
        const text=document.createElement("span");text.textContent=sauce.price>0?`${sauce.name} (+ ${new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(sauce.price)})`:sauce.name;
        label.append(input,text);sauceList.append(label);
      });
      sauceList.closest("fieldset").hidden=!commerce.orderExtras?.sauces?.length;
    }
    const pix=field("checkout-payment-pix"),cash=field("checkout-payment-cash"); if(pix)pix.closest("label").hidden=!commerce.payment?.methods?.includes("pix"); if(cash)cash.closest("label").hidden=!commerce.payment?.methods?.includes("cash");
    restoreSavedData();
    updateConditionalFields();
    field("checkout-postal-code")?.addEventListener("input",(event)=>{event.currentTarget.value=postal.formatPostalCode(event.currentTarget.value);if(postal.stripPostalCode(event.currentTarget.value).length===8)lookupPostalCode();else{++lookupToken;clearAddress();hideDeliveryState();setError("checkout-postal-code","");}persistSession();});
    field("checkout-postal-code")?.addEventListener("blur",()=>{if(postal.stripPostalCode(field("checkout-postal-code").value).length===8&&addressMode==="pending")lookupPostalCode();});
    field("checkout-no-number")?.addEventListener("change",()=>{updateNumberState();persistSession();});
    $$('input[name="fulfillment"],input[name="timing"],input[name="payment"]').forEach((node)=>node.addEventListener("change",updateConditionalFields));
    field("checkout-form")?.addEventListener("input",persistSession);
    field("checkout-form")?.addEventListener("submit",(event)=>{event.preventDefault();const data=validate();if(!data)return;persistSession();if(data.remember)safeSetLocal(savedKey,{schemaVersion:2,...data});else safeRemoveLocal(savedKey);updateSavedAddressControl();buildReview(data);showStep("review");status("Dados prontos. Confira atendimento, pagamento e pedido antes de abrir o WhatsApp.");});
    field("checkout-edit")?.addEventListener("click",()=>showStep("delivery"));
    field("checkout-confirm")?.addEventListener("click",()=>{if(!navigator.onLine){status("Você está offline. Conecte-se à internet para abrir o WhatsApp.");return;}const data=validate();if(!data){showStep("delivery");return;}const result=app()?.handoffToWhatsApp?.(messageForWhatsApp(data));if(!result?.ok){status(result?.reason==="message-too-long"?"O pedido ficou grande demais para uma única mensagem. Reduza alguns itens ou fale diretamente com a pizzaria.":"Não consegui abrir o WhatsApp. Você pode tentar novamente sem perder os dados.");return;}if(!data.remember){try{sessionStorage.removeItem(sessionKey);}catch{}}status("WhatsApp aberto com seu pedido pronto para você revisar e enviar.");window.FORNO_ANALYTICS?.track?.("checkout_handoff",{fulfillment:data.fulfillment,payment:data.payment,timing:data.timing});});
    field("checkout-close")?.addEventListener("click",close);dialog.addEventListener("click",(event)=>{if(event.target===dialog)close();});dialog.addEventListener("close",()=>{previousFocus?.isConnected&&previousFocus.focus();previousFocus=null;});
    addEventListener("online",()=>{field("checkout-confirm").disabled=false;});addEventListener("offline",()=>{field("checkout-confirm").disabled=true;status("Você ficou offline. Seus dados continuam nesta sessão, mas o WhatsApp exige conexão.");});
    field("checkout-back-bag")?.addEventListener("click",()=>{close();requestAnimationFrame(()=>app()?.openBag?.());});
    field("checkout-forget-address")?.addEventListener("click",()=>{safeRemoveLocal(savedKey);if(field("checkout-remember"))field("checkout-remember").checked=false;status("Endereço salvo removido deste dispositivo.");updateSavedAddressControl();});
    field("checkout-confirm").disabled=!navigator.onLine;updateSavedAddressControl();
  }

  window.FORNO_CHECKOUT=Object.freeze({open,close,lookupPostalCode,readForm,messageForWhatsApp,validateSchedule});document.addEventListener("DOMContentLoaded",init);
})();
