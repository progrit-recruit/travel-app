"use client";

import { useEffect, useRef, useState } from "react";

type SearchResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
};

// Service Worker を登録する
function registerSW() {
  if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js").catch(console.error);
  }
}

export default function MapClient() {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<unknown>(null);
  const markerRef = useRef<unknown>(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);
  const [offlineMsg, setOfflineMsg] = useState(false);
  const [cachedTiles, setCachedTiles] = useState<number | null>(null);

  // Leaflet を動的に読み込んで地図を初期化
  useEffect(() => {
    registerSW();

    let map: unknown;

    (async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      // デフォルトアイコンの画像パスを修正（Next.js対応）
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      if (!mapRef.current || leafletMapRef.current) return;

      map = L.map(mapRef.current).setView([35.6812, 139.7671], 13); // 初期位置: 東京

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }).addTo(map as any);

      leafletMapRef.current = map;

      // キャッシュ済みタイル数を取得
      if ("caches" in window) {
        const cache = await caches.open("osm-tiles-v1").catch(() => null);
        if (cache) {
          const keys = await cache.keys();
          setCachedTiles(keys.length);
        }
      }
    })();

    // オフライン検知
    const onOffline = () => setOfflineMsg(true);
    const onOnline  = () => setOfflineMsg(false);
    window.addEventListener("offline", onOffline);
    window.addEventListener("online", onOnline);
    if (!navigator.onLine) setOfflineMsg(true);

    return () => {
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("online", onOnline);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (leafletMapRef.current) (leafletMapRef.current as any).remove();
      leafletMapRef.current = null;
    };
  }, []);

  // 現在地に移動
  const goToCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const L = (await import("leaflet")).default;
        const { latitude: lat, longitude: lng } = pos.coords;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const map = leafletMapRef.current as any;
        if (!map) return;

        map.setView([lat, lng], 16);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (markerRef.current) (markerRef.current as any).remove();
        markerRef.current = L.marker([lat, lng])
          .addTo(map)
          .bindPopup("現在地")
          .openPopup();
        setLocating(false);
      },
      () => setLocating(false),
      { timeout: 10000 }
    );
  };

  // 場所を検索（Nominatim）
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    setResults([]);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&accept-language=ja`,
        { headers: { "User-Agent": "TravelReady/1.0" } }
      );
      const data: SearchResult[] = await res.json();
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  // 検索結果を選択して地図を移動
  const selectResult = async (result: SearchResult) => {
    const L = (await import("leaflet")).default;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const map = leafletMapRef.current as any;
    if (!map) return;

    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    map.setView([lat, lng], 15);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (markerRef.current) (markerRef.current as any).remove();
    markerRef.current = L.marker([lat, lng])
      .addTo(map)
      .bindPopup(result.display_name.split(",")[0])
      .openPopup();

    setResults([]);
    setQuery(result.display_name.split(",")[0]);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* オフライン状態バナー */}
      {offlineMsg && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-2 text-sm text-orange-700">
          📵 オフライン中 — キャッシュ済みエリアのみ表示できます
        </div>
      )}

      {/* 検索バー */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="場所・施設名を検索..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-blue-400"
        />
        <button
          type="submit"
          disabled={searching}
          className="px-4 py-2.5 bg-blue-500 text-white text-sm font-medium rounded-xl disabled:opacity-50"
        >
          {searching ? "..." : "検索"}
        </button>
      </form>

      {/* 検索結果 */}
      {results.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          {results.map((r) => (
            <button
              key={r.place_id}
              onClick={() => selectResult(r)}
              className="w-full text-left px-4 py-3 text-sm text-gray-800 hover:bg-gray-50 border-b border-gray-100 last:border-none"
            >
              <p className="font-medium">{r.display_name.split(",")[0]}</p>
              <p className="text-xs text-gray-400 truncate">{r.display_name}</p>
            </button>
          ))}
        </div>
      )}

      {/* 地図 */}
      <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
        <div ref={mapRef} className="w-full" style={{ height: "60vh", minHeight: "320px" }} />

        {/* 現在地ボタン */}
        <button
          onClick={goToCurrentLocation}
          disabled={locating}
          className="absolute bottom-4 right-4 z-[1000] bg-white border border-gray-200 shadow-md rounded-full w-12 h-12 flex items-center justify-center text-xl hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-50"
          title="現在地"
        >
          {locating ? "⏳" : "📍"}
        </button>
      </div>

      {/* キャッシュ情報 */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
        <p className="text-sm text-blue-700 font-medium mb-1">🗺️ オフラインマップの使い方</p>
        <p className="text-xs text-blue-600 leading-relaxed">
          オンライン時に見たエリアは自動的にキャッシュされます。
          旅行前に目的地周辺をスクロールしておくと、オフライン時も地図が表示されます。
        </p>
        {cachedTiles !== null && (
          <p className="text-xs text-blue-500 mt-1">
            現在 {cachedTiles.toLocaleString()} 枚のタイルを保存済み
          </p>
        )}
      </div>
    </div>
  );
}
