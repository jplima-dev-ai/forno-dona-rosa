(() => {
  "use strict";
  const MAX_DRAFT_BYTES = 1_500_000;
  function createLocalDraftRepository(storage, key) {
    return Object.freeze({
      load() {
        try {
          const raw = storage.getItem(key);
          if (!raw) return null;
          if (raw.length > MAX_DRAFT_BYTES) { storage.removeItem(key); return null; }
          const parsed = JSON.parse(raw);
          return parsed && typeof parsed === "object" ? parsed : null;
        } catch {
          try { storage.removeItem(key); } catch {}
          return null;
        }
      },
      save(value) {
        try {
          const raw = JSON.stringify(value);
          if (raw.length > MAX_DRAFT_BYTES) return false;
          storage.setItem(key, raw);
          return true;
        } catch { return false; }
      },
      clear() {
        try { storage.removeItem(key); return true; } catch { return false; }
      }
    });
  }
  function describePublishCapability() {
    return Object.freeze({ mode: "bundle", automaticPublish: false, authentication: false, backendRequiredForRemoteWrite: true });
  }
  window.ADMIN_PERSISTENCE = Object.freeze({ createLocalDraftRepository, describePublishCapability, MAX_DRAFT_BYTES });
})();
