const CACHE_NAME = 'earthquake-monitor-v1';
const OFFLINE_URL = '/offline';
self.addEventListener('install', (event: any) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        OFFLINE_URL,
        '/safety',
        '/static/safety-guidelines.json',
        // Add other critical assets
      ]);
    })
  );
});

self.addEventListener('fetch', (event: any) => { // Changed FetchEvent to any
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(OFFLINE_URL);
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((response) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
}); 