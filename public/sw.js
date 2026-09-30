// Service worker de Casa Escencia. Solo cachea recursos públicos e inmutables;
// las páginas HTML nunca se guardan (cuenta, checkout y panel son privados), y
// sin conexión las navegaciones caen a /offline.html.
const VERSION = "v1";
const STATIC_CACHE = `ce-static-${VERSION}`;
const OFFLINE_URL = "/offline.html";
const PRECACHE = [OFFLINE_URL, "/images/logo.svg", "/icons/icon-192.png", "/icons/icon-512.png"];
const CACHEABLE = ["/_next/static/", "/images/", "/icons/"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== STATIC_CACHE).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match(OFFLINE_URL).then((r) => r ?? Response.error())),
    );
    return;
  }

  if (!CACHEABLE.some((prefix) => url.pathname.startsWith(prefix))) return;

  // Stale-while-revalidate: responde al instante con lo guardado y refresca en segundo plano.
  event.respondWith(
    caches.open(STATIC_CACHE).then(async (cache) => {
      const cached = await cache.match(request);
      const network = fetch(request)
        .then((response) => {
          if (response.ok) cache.put(request, response.clone());
          return response;
        })
        .catch(() => cached ?? Response.error());
      return cached ?? network;
    }),
  );
});
