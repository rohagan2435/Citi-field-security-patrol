const CACHE_NAME = 'citi-security-patrol-v2';

const APP_FILES = [
  './index-qr-offline-test.html',
  './supabase-config.js',
  './offline-storage.js',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then(keys =>
        Promise.all(
          keys
            .filter(key =>
              key.startsWith('citi-security-patrol-') &&
              key !== CACHE_NAME
            )
            .map(key => caches.delete(key))
        )
      )
    ])
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  if (
    event.request.method !== 'GET' ||
    url.origin !== self.location.origin ||
    !APP_FILES.some(file =>
      url.pathname.endsWith(file.replace('./', '/'))
    )
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request)
    )
  );
});
