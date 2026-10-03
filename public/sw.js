/* Ravya Fashion service worker — offline shell + catalog cache. */
const VERSION = 'rf-v2';
const SHELL = ['/', '/manifest.json'];
/** Hard cap on cached build assets. Hashed filenames never expire on their own,
 *  so without this the cache only ever grows and evicts itself by storage pressure. */
const MAX_ENTRIES = 150;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(VERSION).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

/** Drop the oldest entries once the cache is over its cap. keys() is insertion-ordered. */
async function prune(cache) {
  const keys = await cache.keys();
  if (keys.length <= MAX_ENTRIES) return;
  for (const req of keys.slice(0, keys.length - MAX_ENTRIES)) await cache.delete(req);
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Build assets only: these are content-hashed, so a cache hit is always the
  // right file for that URL and cache-first cannot go stale.
  //
  // /products/ and /editorial/ are deliberately NOT cached here. Those
  // filenames are stable across regenerations, so caching them would serve a
  // replaced image's old bytes forever. They revalidate against the server
  // instead (see the Cache-Control header in next.config.mjs).
  if (url.pathname.startsWith('/_next/static') || url.pathname.startsWith('/_next/image')) {
    event.respondWith(
      caches.match(req).then((hit) => {
        if (hit) return hit;
        return fetch(req).then((res) => {
          const copy = res.clone();
          caches.open(VERSION).then(async (c) => {
            await c.put(req, copy);
            await prune(c);
          });
          return res;
        });
      }),
    );
    return;
  }

  // Navigations: network-first with cache fallback (offline shell).
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((hit) => hit || caches.match('/'))),
    );
  }
});
