// Cache constants
const CACHE_NAME = 'dual-calc-v1';
const cacheFiles = ['index.html', '/'];

// Make a fetch request, and cache the result
async function cacheRequest(request) {
    const result = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, result.clone());
    return result;
}

// Read contents from cache
async function readFromCache(request) {
    const cache = await caches.open(CACHE_NAME);
    return await cache.match(request);
}

// Pre cache index.html on install
self.addEventListener('install', (event) => {
    return event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(cacheFiles))
    )
})

// Intercept fetch requests for caching
self.addEventListener("fetch", (event) => {
    // Cache everything going ot localhost, except the push api subscription
    if(!event.request.url.includes('localhost') || event.request.url.includes('subscribe')) return;

    // Try to make a network request, and if it fails revert to cache
    return event.respondWith(cacheRequest(event.request).catch(() => readFromCache(event.request)))
});

// Handle push notifications
self.addEventListener("push", async (event) => {
    if (!(self.Notification && self.Notification.permission === "granted")) {
        return;
    }

    // Read the data form the notification event
    const data = event.data.json() ?? {};

    // Show the user a push notification
    self.registration.showNotification(data.title, data);

    // Notify all client windows about the change
    const allClients = await clients.matchAll();
    allClients.forEach(c => c.postMessage(data));
});