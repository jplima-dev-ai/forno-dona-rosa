(() => {
  "use strict";

  const clamp = (value, fallback = 50) => {
    const number = Number(value);
    return Number.isFinite(number) ? Math.max(0, Math.min(100, Math.round(number))) : fallback;
  };

  const variantPath = (path, width, format = "webp") => {
    const value = String(path || "");
    return value.replace(/\.(?:webp|png|jpe?g|avif)$/i, `-${width}.${format}`);
  };

  function mediaContract(product = {}) {
    const legacy = String(product.image || "");
    const media = product.media || {};
    const catalog = media.catalog || {};
    const hero = media.hero || {};
    const detail = Array.isArray(media.detail) ? media.detail : [];
    const focal = media.focalPoint || { x: 50, y: 50 };
    return {
      catalog: {
        src: catalog.src || legacy,
        alt: catalog.alt || media.alt || product.name || "",
        focalPoint: catalog.focalPoint || focal,
      },
      hero: {
        src: hero.src || legacy,
        alt: hero.alt || media.alt || product.name || "",
        focalPoint: hero.focalPoint || focal,
      },
      detail: detail.map((item) => typeof item === "string" ? { src: item, alt: product.name || "" } : item),
      visualTraits: Array.isArray(media.visualTraits) ? media.visualTraits : [],
      temperature: media.temperature || (product.type === "bebida" ? "cold" : "hot"),
    };
  }

  function applyFocal(img, focalPoint) {
    if (!img) return img;
    const point = focalPoint || { x: 50, y: 50 };
    img.style.setProperty("--focal-x", `${clamp(point.x)}%`);
    img.style.setProperty("--focal-y", `${clamp(point.y)}%`);
    img.classList.add("focal-media");
    return img;
  }

  function picture(product, role = "catalog", options = {}) {
    const contract = mediaContract(product);
    const selected = contract[role] || contract.catalog;
    const resolve = options.resolve || ((path) => path);
    const picture = document.createElement("picture");
    picture.className = `desire-media desire-media--${role}`;
    picture.dataset.mediaRole = role;
    picture.dataset.temperature = contract.temperature;

    const avif = document.createElement("source");
    avif.type = "image/avif";
    avif.srcset = [480, 800, 1200].map((w) => `${resolve(variantPath(selected.src, w, "avif"))} ${w}w`).join(", ");
    avif.sizes = options.sizes || (role === "hero" ? "(max-width: 48rem) 100vw, 50vw" : "(max-width: 42rem) 92vw, 30vw");

    const webp = document.createElement("source");
    webp.type = "image/webp";
    webp.srcset = [480, 800, 1200].map((w) => `${resolve(variantPath(selected.src, w, "webp"))} ${w}w`).join(", ");
    webp.sizes = avif.sizes;

    const img = document.createElement("img");
    img.src = resolve(selected.src);
    img.alt = options.decorative ? "" : String(selected.alt || product.name || "");
    img.loading = options.loading || (role === "hero" ? "eager" : "lazy");
    img.decoding = "async";
    img.width = Number(options.width || (role === "hero" ? 1200 : 800));
    img.height = Number(options.height || (role === "hero" ? 900 : 800));
    applyFocal(img, selected.focalPoint);

    picture.append(avif, webp, img);
    return picture;
  }

  window.FORNO_VISUAL_MEDIA = Object.freeze({ mediaContract, picture, applyFocal, variantPath });
})();
