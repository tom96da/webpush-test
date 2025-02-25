// Handle push event received from the backend
self.addEventListener('push', function (event) {
  console.log('Push event received:', event);
  const data = event.data.json(); // Parse the message from the server as JSON

  // Display the push notification using the showNotification method
  event.waitUntil(
    self.registration.showNotification(data.title, data.options)
      .then(() => console.log('Notification displayed:', data.title, data.options))
      .catch(err => console.error('Notification display error:', err))
  );
});

// Handle notification click event
self.addEventListener('notificationclick', function (event) {
  console.log('Notification click event:', event);
  event.notification.close(); // Close the notification
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      for (let client of windowClients) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

// Execute when Service Worker is installed
self.addEventListener('install', (event) => {
  console.log('Service worker install ...');
  self.skipWaiting(); // Force the active service worker to switch
});

// Execute when Service Worker is activated
self.addEventListener('activate', (event) => {
  console.log('Service worker activate ...');
  event.waitUntil(self.clients.claim()); // Immediately start controlling the clients
});

// Listen for messages from the client
self.addEventListener('message', (event) => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
