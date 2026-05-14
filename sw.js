const CACHE = 'arcadia-v1';
const ASSETS = [
  '/Arcadia/index.html',
  '/Arcadia/accueil.html',
  '/Arcadia/launcher.html',
  '/Arcadia/mascotte.png',
  '/Arcadia/icon-app.png',
  '/Arcadia/gravity_lane.mp3',
  '/Arcadia/manifest.json',
  '/Arcadia/sw.js'
];

// Installation — mise en cache des fichiers essentiels
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activation — supprime les anciens caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — réseau d'abord, cache en fallback
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
