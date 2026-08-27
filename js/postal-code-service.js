(() => {
  "use strict";

  const stripPostalCode = (value) => String(value || "").replace(/\D/g, "").slice(0, 8);
  const formatPostalCode = (value) => {
    const digits = stripPostalCode(value);
    return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
  };
  const normalizeText = (value) => String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

  const normalizeResult = (provider, raw, cep) => {
    if (!raw || typeof raw !== "object") return null;
    if (provider === "viacep") {
      if (raw.erro === true) return null;
      return {
        provider,
        postalCode: formatPostalCode(raw.cep || cep),
        street: String(raw.logradouro || "").trim(),
        neighborhood: String(raw.bairro || "").trim(),
        city: String(raw.localidade || "").trim(),
        state: String(raw.uf || "").trim().toUpperCase()
      };
    }
    if (provider === "brasilapi") {
      return {
        provider,
        postalCode: formatPostalCode(raw.cep || cep),
        street: String(raw.street || "").trim(),
        neighborhood: String(raw.neighborhood || "").trim(),
        city: String(raw.city || "").trim(),
        state: String(raw.state || "").trim().toUpperCase()
      };
    }
    return null;
  };

  async function fetchJson(url, timeoutMs = 4500) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { signal: controller.signal, headers: { Accept: "application/json" } });
      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    } finally {
      clearTimeout(timeout);
    }
  }

  async function lookup(value) {
    const cep = stripPostalCode(value);
    if (cep.length !== 8) return { ok: false, reason: "invalid" };

    const viaCepRaw = await fetchJson(`https://viacep.com.br/ws/${cep}/json/`);
    const viaCep = normalizeResult("viacep", viaCepRaw, cep);
    if (viaCep?.city && viaCep?.state) return { ok: true, address: viaCep };

    const brasilRaw = await fetchJson(`https://brasilapi.com.br/api/cep/v1/${cep}`);
    const brasil = normalizeResult("brasilapi", brasilRaw, cep);
    if (brasil?.city && brasil?.state) return { ok: true, address: brasil };

    return { ok: false, reason: "not-found" };
  }

  function isServiceArea(address, config = window.FORNO_DELIVERY || {}) {
    return Boolean(address) &&
      normalizeText(address.city) === normalizeText(config.city || "Serra") &&
      String(address.state || "").toUpperCase() === String(config.state || "ES").toUpperCase();
  }

  window.FORNO_POSTAL = Object.freeze({ stripPostalCode, formatPostalCode, normalizeText, normalizeResult, lookup, isServiceArea });
})();
