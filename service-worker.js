const CACHE_NAME = 'citi-security-patrol-v3';

const APP_FILES = [
  './index-qr-offline-test.html',
  './supabase-config.js',
  './offline-storage.js',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll(APP_FILES)
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key =>
            key.startsWith('citi-security-patrol-') &&
            key !== CACHE_NAME
          )
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) return;

  const isAppFile = APP_FILES.some(file => {
    const fileURL = new URL(file, self.registration.scope);
    return url.pathname === fileURL.pathname;
  });

  if (!isAppFile) return;

  event.respondWith(
    fetch(request)
      .then(response => {
        if (response.ok) {
          const copy = response.clone();
          event.waitUntil(
            caches.open(CACHE_NAME).then(cache =>
              cache.put(request, copy)
            )
          );
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(request, {
          ignoreSearch: true
        });

        if (cached) return cached;

        return new Response(
          'This page is not available offline yet.',
          {
            status: 503,
            headers: {
              'Content-Type': 'text/plain'
            }
          }
        );
      })
  );
});

