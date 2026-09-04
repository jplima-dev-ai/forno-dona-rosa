"use strict";

const VERSION = "4.0.9";
const CORE_CACHE = `forno-core-${VERSION}`;
const RUNTIME_CACHE = `forno-runtime-${VERSION}`;
const RUNTIME_LIMIT = 24;
const CORE_ASSETS = [
  "./", "./index.html", "./css/styles.css", "./css/brand-theme.css", "./js/app-meta.js", "./data/brand/brand-config.js", "./data/brand/content-config.js", "./js/app-config.js", "./js/feature-flags.js", "./data/catalog-schema.js", "./js/brand-runtime.js", "./js/main.js", "./js/rosa.js",
  "./data/menu.js", "./data/rosa-knowledge-base.js", "./data/delivery-config.js", "./data/commerce-config.js", "./js/analytics-adapter.js", "./js/commerce-events.js", "./js/checkout-state.js", "./js/repositories.js", "./js/postal-code-service.js", "./js/checkout.js", "./manifest.webmanifest", "./offline.html",
  "./assets/images/dona-rosa-hero-pizza.webp", "./assets/images/dona-rosa-hero-pizza-640.webp", "./assets/images/rosa-avatar.jpg", "./assets/images/brand/forno-dona-rosa-logo-720.webp",
  "./assets/icons/icon-192.png", "./assets/icons/icon-512.png",
  "./menu/", "./order/", "./about/", "./experience/", "./location/", "./help/", "./privacy/", "./articles/", "./css/site-pages.css", "./js/business-status.js", "./js/storefront.js", "./js/site-pages.js", "./js/newsletter.js", "./js/global-search.js", "./data/reviews.json", "./data/articles-index.js",
  "./css/experience-v4.css", "./css/visual-desire-v4.css", "./css/adaptive-commerce-v4.css", "./css/resilience-v4.css", "./css/premium-release-v4.css",
  "./js/experience-router-v4.js", "./js/visual-media-v4.js", "./js/smart-menu-v4.js", "./js/rosa-context-v4.js", "./js/adaptive-commerce-v4.js", "./js/conversion-intelligence-v4.js", "./js/resilience-v4.js", "./js/premium-release-v4.js"
];
const WARM_ASSETS = [
  "assets/images/products/margherita-pizza.webp",
  "assets/images/products/mozzarella-pizza.webp",
  "assets/images/products/calabrese-sausage-pizza.webp",
  "assets/images/products/portuguese-style-pizza.webp",
  "assets/images/products/chicken-catupiry-pizza.webp",
  "assets/images/products/neapolitan-pizza.webp",
  "assets/images/products/pepperoni-pizza.webp",
  "assets/images/products/dona-rosa-signature-pizza.webp",
  "assets/images/products/four-cheese-pizza.webp",
  "assets/images/products/burrata-parma-pizza.webp",
  "assets/images/products/tuscan-wood-fired-pizza.webp",
  "assets/images/products/house-carbonara-pizza.webp",
  "assets/images/products/mushroom-truffle-pizza.webp",
  "assets/images/products/rosa-spicy-pizza.webp",
  "assets/images/products/garden-vegetable-pizza.webp",
  "assets/images/products/vegan-margherita-pizza.webp",
  "assets/images/products/mediterranean-pizza.webp",
  "assets/images/products/vegan-mushroom-pizza.webp",
  "assets/images/products/nutella-strawberry-dessert-pizza.webp",
  "assets/images/products/belgian-chocolate-pizza.webp",
  "assets/images/products/banana-cinnamon-caramel-pizza.webp",
  "assets/images/products/guava-cheese-dessert-pizza.webp",
  "assets/images/products/coca-cola-can.webp",
  "assets/images/products/coca-cola-zero-can.webp",
  "assets/images/products/guarana-can.webp",
  "assets/images/products/sprite-can.webp",
  "assets/images/products/coca-cola-2l-bottle.webp",
  "assets/images/products/guarana-2l-bottle.webp",
  "assets/images/products/still-water-bottle.webp",
  "assets/images/products/sparkling-water-bottle.webp",
  "assets/images/products/orange-juice.webp",
  "./assets/images/cheese-pull-pizza.webp", "./assets/images/wood-fired-oven-pizza.webp",
  "./assets/images/nutella-strawberry-pizza.webp"
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CORE_CACHE);
    await cache.addAll(CORE_ASSETS);
    await Promise.allSettled(WARM_ASSETS.map((asset) => cache.add(asset)));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => ![CORE_CACHE, RUNTIME_CACHE].includes(key)).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});

async function trimRuntimeCache() {
  const cache = await caches.open(RUNTIME_CACHE);
  const keys = await cache.keys();
  if (keys.length <= RUNTIME_LIMIT) return;
  await Promise.all(keys.slice(0, keys.length - RUNTIME_LIMIT).map((request) => cache.delete(request)));
}

async function networkFirstNavigation(request) {
  try {
    const response = await fetch(request, { cache: "no-store" });
    if (response.ok && response.type === "basic") {
      const cache = await caches.open(CORE_CACHE);
      await cache.put(request, response.clone());
    }
    return response;
  } catch {
    return (await caches.match(request)) || (await caches.match("./offline.html")) || (await caches.match("./index.html")) || Response.error();
  }
}

async function matchVersioned(request) {
  const runtime = await caches.open(RUNTIME_CACHE);
  const runtimeHit = await runtime.match(request);
  if (runtimeHit) return runtimeHit;
  const core = await caches.open(CORE_CACHE);
  return core.match(request);
}

async function staleWhileRevalidate(request) {
  const cached = await matchVersioned(request);
  const network = fetch(request).then(async (response) => {
    if (response?.ok && response.type === "basic") {
      const cache = await caches.open(RUNTIME_CACHE);
      await cache.put(request, response.clone());
      await trimRuntimeCache();
    }
    return response;
  }).catch(() => null);
  return cached || (await network) || Response.error();
}

async function cacheFirstImage(request) {
  const cached = await matchVersioned(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (!response.ok || response.type !== "basic") return response;
    const cache = await caches.open(RUNTIME_CACHE);
    await cache.put(request, response.clone());
    await trimRuntimeCache();
    return response;
  } catch { return Response.error(); }
}


function isSensitiveToolingPath(url) {
  const path = url.pathname;
  return /(?:^|\/)admin(?:\/|$)/.test(path) || /(?:^|\/)dev(?:\/|$)/.test(path) || /\/(?:admin(?:-[a-z-]+)?\.js|admin\.css)$/.test(path);
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (isSensitiveToolingPath(url)) return;
  if (request.mode === "navigate") { event.respondWith(networkFirstNavigation(request)); return; }
  if (request.destination === "image") { event.respondWith(cacheFirstImage(request)); return; }
  if (["style", "script", "font", "manifest"].includes(request.destination)) event.respondWith(staleWhileRevalidate(request));
});


self.addEventListener("message", (event) => {
  const data = event.data || {};
  if (data.type === "FORNO_GET_VERSION") {
    event.source?.postMessage?.({ type: "FORNO_SW_VERSION", version: VERSION });
  }
});
