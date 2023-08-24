const cacheName = "dual-calculator-pwa";
const apiCacheName = "dual-calculator-api";
const filesToCache = [
  "/index.html",
  "/manifest.json",
  "/sw.js",
  "/dualCalculator.js",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];
const endpointsToCache = [
  "http://localhost/certificates",
  "http://localhost/sectors",
  "http://localhost/base-amount",
  "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css",
];

// Start the service worker and cache all of the app's content
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(cacheName).then((cache) => cache.addAll(filesToCache))
  );
  self.skipWaiting();
});

// Serve cached content when offline
self.addEventListener("fetch", (e) => {
  // api results to cache
  if (endpointsToCache.includes(e.request.url)) {
    e.respondWith(
      caches.open(apiCacheName).then(async (cache) => {
        const response = await cache.match(e.request);
        return (
          response ??
          fetch(e.request).then((fetchResponse) => {
            cache.put(e.request, fetchResponse.clone());
            return fetchResponse;
          })
        );
      })
    );

    return;
  }

  // normal assets to cache
  e.respondWith(
    caches.match(e.request).then((response) => response ?? fetch(e.request))
  );
});

// React to the push event listener and push the notification
self.addEventListener("push", (e) => {
  const data = e.data.json();

  try {
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
    });
  } catch (e) {
    console.error("Failed to send notification", e);
  }
});
