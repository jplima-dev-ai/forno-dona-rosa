"use strict";

const VERSION = "1.9.9";
const CORE_CACHE = `forno-core-${VERSION}`;
const RUNTIME_CACHE = `forno-runtime-${VERSION}`;
const RUNTIME_LIMIT = 24;
const CORE_ASSETS = [
  "./", "./index.html", "./css/styles.css", "./js/app-meta.js", "./js/app-config.js", "./js/main.js", "./js/rosa.js",
  "./data/menu.js", "./data/rosa-knowledge-base.js", "./manifest.webmanifest",
  "./assets/images/dona-rosa-hero-pizza.webp", "./assets/images/rosa-avatar.jpg",
  "./assets/images/signature-pizza.svg", "./assets/icons/icon-192.png", "./assets/icons/icon-512.png"
];
const WARM_ASSETS = [
  "./assets/images/cheese-pull-pizza.webp", "./assets/images/wood-fired-oven-pizza.webp",
  "./assets/images/nutella-strawberry-pizza.webp", "./assets/images/og-cover.png"
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
      await cache.put("./index.html", response.clone());
    }
    return response;
  } catch {
    return (await caches.match("./index.html")) || Response.error();
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

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (request.mode === "navigate") { event.respondWith(networkFirstNavigation(request)); return; }
  if (request.destination === "image") { event.respondWith(cacheFirstImage(request)); return; }
  if (["style", "script", "font", "manifest"].includes(request.destination)) event.respondWith(staleWhileRevalidate(request));
});
