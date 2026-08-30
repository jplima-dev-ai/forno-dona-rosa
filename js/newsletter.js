(() => {
  "use strict";
  const forms = [...document.querySelectorAll("[data-newsletter-form]")];
  if (!forms.length) return;
  const validHttps = (value) => { try { return new URL(value, document.baseURI).protocol === "https:"; } catch { return false; } };
  for (const form of forms) {
    const shell = form.closest("[data-newsletter]");
    const status = form.querySelector("[data-newsletter-status]");
    const provider = shell?.dataset.provider || "external-form";
    form.addEventListener("submit", async (event) => {
      if (!form.reportValidity()) { event.preventDefault(); return; }
      const action = form.action;
      if (!validHttps(action)) {
        event.preventDefault();
        if (status) status.textContent = "A newsletter ainda não possui um provedor seguro configurado.";
        return;
      }
      if (provider !== "future-api") return;
      event.preventDefault();
      const submit = form.querySelector('button[type="submit"]');
      if (submit) submit.disabled = true;
      if (status) status.textContent = "Enviando cadastro…";
      try {
        const response = await fetch(action, { method: "POST", body: new FormData(form), headers: { "Accept": "application/json" } });
        if (!response.ok) throw new Error("request failed");
        form.reset();
        if (status) status.textContent = "Cadastro recebido.";
      } catch {
        if (status) status.textContent = "Não foi possível cadastrar agora. Tente novamente mais tarde.";
      } finally {
        if (submit) submit.disabled = false;
      }
    });
  }
})();
