// Minimal service worker — required for PWA installability
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', () => {
  // pass-through — no caching strategy needed for now
});
