const CACHE_NAME = 'tco-calculator-v1';
// Get the base path from the service worker scope
const basePath = self.location.pathname.replace('/service-worker.js', '') || '/RIP_2025_React';

const urlsToCache = [
  basePath + '/',
  basePath + '/static/css/main.css',
  basePath + '/static/js/main.js',
  basePath + '/manifest.json',
  basePath + '/logo192.png',
  basePath + '/logo512.png',
  basePath + '/favicon.ico'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache.map(url => new Request(url, { cache: 'reload' })));
      })
      .catch((error) => {
        console.error('Cache install failed:', error);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request).then((response) => {
          // Don't cache non-GET requests or external URLs
          if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
      .catch(() => {
        // If both cache and network fail, return a fallback response
        if (event.request.destination === 'document') {
          return caches.match(basePath + '/');
        }
      })
  );
});

