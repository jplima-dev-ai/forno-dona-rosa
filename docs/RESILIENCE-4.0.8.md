# Resilience contract 4.0.8

## Cenários protegidos
- JSON local corrompido: quarentena seletiva de chaves relevantes, sem apagar todo o storage.
- Item antigo na Sacola: detectar produto que não existe mais no catálogo e emitir evento de reconciliação.
- Imagem quebrada: manter espaço, texto alternativo e fallback visual.
- Offline: expor estado na raiz do documento sem bloquear navegação local.
- Service Worker antigo: handshake de versão e evento de mismatch/update-ready.
- Dependência lenta: helper `withTimeout()` para fluxos que precisem degradar com prazo finito.

## Não fazer
- `localStorage.clear()`.
- retry infinito.
- `catch {}` em fluxo crítico sem fallback observável.
- esconder mídia quebrada com `display:none`.
- declarar budgets como métricas medidas.
