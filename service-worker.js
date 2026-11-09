// Bump CACHE_NAME when the file list changes. Content updates no longer need a bump:
// requests go network-first, so the cache is only an offline fallback.
const CACHE_NAME = "mb-poultry-cache-v9";
const urlsToCache = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./pwa-installation.js",
  "./log-worker.js",
  "./local-name-storage.js",
  "./lang.js",
  "./language.js",

  "./retail-calculator/retail-calculator.html",
  "./retail-calculator/retail-calculator-script.js",
  "./retail-calculator/retail-calculator.css",
  "./retail-calculator/sales-report.js",

  "./images/payment-qr.jpeg",
  "./images/icon-192.jpg",
  "./images/icon-512.jpg",
  "./images/mb-icon.png"
];

self.addEventListener("install", event => {
  // cache: "reload" bypasses the HTTP cache so a new version never precaches stale files
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache.map(url => new Request(url, { cache: "reload" }))))
      .then(() => self.skipWaiting())   // take over now instead of waiting for all tabs to close
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Network-first for our own files (always fresh, all from the same version);
// fall back to the cache only when offline. Third-party requests (CDNs, tracking) pass through.
self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;

  event.respondWith(
    fetch(request, { cache: "no-cache" })
      .then(response => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        }
        return response;
      })
      .catch(() => caches.match(request, { ignoreSearch: true }))
  );
});
