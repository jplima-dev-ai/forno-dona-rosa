# Media Publication Checklist — 4.0.9

Para cada pizza:
- catalog image presente;
- hero image presente ou fallback documentado;
- detail image presente ou fallback documentado;
- ingrediente identificador preservado no crop mobile;
- borda e textura legíveis;
- alt text específico;
- dimensões reservadas para evitar CLS;
- WebP/AVIF derivados quando pipeline disponível.

Para cada bebida:
- embalagem/produto identificável;
- leitura visual de frescor/frio;
- alt text não redundante;
- crop mobile coerente;
- sem texto crítico embutido somente na imagem.

Nordestina da Dona Rosa:
- fotografia definitiva de carne de sol ainda deve substituir `plannedSource` se o catálogo continuar usando fallback;
- validar cebola roxa, requeijão, carne de sol e borda no crop;
- não publicar uma imagem de ingrediente/composição que não corresponda ao produto real.
