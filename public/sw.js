const TILE_CACHE = "osm-tiles-v1";
const TILE_HOSTS = ["tile.openstreetmap.org"];

self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(clients.claim());
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);

  // OpenStreetMap タイルだけをキャッシュ対象にする
  if (!TILE_HOSTS.some((h) => url.hostname.endsWith(h))) return;

  e.respondWith(
    caches.open(TILE_CACHE).then(async (cache) => {
      const cached = await cache.match(e.request);
      if (cached) return cached; // キャッシュがあればそれを返す

      try {
        const response = await fetch(e.request);
        if (response.ok) {
          cache.put(e.request, response.clone()); // キャッシュに保存
        }
        return response;
      } catch {
        // オフライン且つキャッシュなし → 透明な1x1px PNGを返す
        return new Response(
          atob("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="),
          { headers: { "Content-Type": "image/png" } }
        );
      }
    })
  );
});
