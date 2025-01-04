self.addEventListener('push', function(event) {
  const options = {
    body: event.data.text(),
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    vibrate: [200, 100, 200],
    tag: 'earthquake-alert',
    renotify: true,
  };

  event.waitUntil(
    self.registration.showNotification('Earthquake Alert', options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
}); 