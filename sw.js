// عامل الخدمة: يوفر عمل التطبيق بالكامل دون إنترنت بعد أول تحميل
const CACHE_VERSION = "v13";
const CACHE_NAME = `hisni-cache-${CACHE_VERSION}`;
const OFFLINE_URL = "offline.html";

const PRECACHE_ASSETS = [
  "./",
  "index.html",
  "offline.html",
  "manifest.json",

  "css/main.css",
  "css/fonts.css",
  "css/variables.css",
  "css/base.css",
  "css/layout.css",
  "css/components.css",
  "css/animations.css",

  "assets/fonts/cairo-arabic-400.woff2",
  "assets/fonts/cairo-latin-400.woff2",
  "assets/fonts/cairo-arabic-600.woff2",
  "assets/fonts/cairo-latin-600.woff2",
  "assets/fonts/cairo-arabic-700.woff2",
  "assets/fonts/cairo-latin-700.woff2",

  "js/app.js",
  "js/modules/router.js",
  "js/modules/dataLoader.js",
  "js/modules/storage.js",
  "js/modules/theme.js",
  "js/modules/fontSize.js",
  "js/modules/render.js",
  "js/modules/icons.js",
  "js/modules/format.js",
  "js/modules/share.js",
  "js/modules/toast.js",
  "js/modules/swRegister.js",
  "js/modules/qibla.js",
  "js/modules/namesGrid.js",
  "js/modules/confirmDialog.js",
  "js/modules/exitGuard.js",

  "data/sections.json",
  "data/morning-azkar.json",
  "data/evening-azkar.json",
  "data/ruqyah.json",
  "data/quran-duas.json",
  "data/asma-ul-husna.json",

  "assets/icons/icon-72.png",
  "assets/icons/icon-96.png",
  "assets/icons/icon-128.png",
  "assets/icons/icon-144.png",
  "assets/icons/icon-152.png",
  "assets/icons/icon-192.png",
  "assets/icons/icon-384.png",
  "assets/icons/icon-512.png",
  "assets/icons/icon-maskable-192.png",
  "assets/icons/icon-maskable-512.png",
  "assets/icons/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

// استراتيجية: Cache First مع تحديث في الخلفية (Stale-While-Revalidate)
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const networkFetch = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.ok) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(() => {
          if (event.request.mode === "navigate") {
            return caches.match(OFFLINE_URL);
          }
          return cachedResponse;
        });

      return cachedResponse || networkFetch;
    })
  );
});
