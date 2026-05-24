"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { COUNTRIES } from "@/lib/country-data";
import { loadProfile } from "@/lib/user-profile";

// react-globe.gl is ESM-only and uses browser APIs — load client-side only
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Globe = dynamic<any>(
  () => import("react-globe.gl").then((m) => m.default ?? m),
  { ssr: false }
);

const GEO_URL =
  "https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson";
const SESSION_KEY = "globe_geojson_v1";
const SUPPORTED_CODES = new Set(Object.keys(COUNTRIES));
const GLOBE_HEIGHT = 430; // px — fixed so ResizeObserver only needs to track width

type GeoFeature = {
  properties: { ISO_A2: string; NAME: string };
};

type Props = {
  selectedDestinations: string[];
  onToggle: (code: string) => void;
  onNext: () => void;
};

export default function Step1Map({ selectedDestinations, onToggle, onNext }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globeRef = useRef<any>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [geoData, setGeoData] = useState<{ features: GeoFeature[] } | null>(null);
  const [suggesting, setSuggesting] = useState(false);
  const [ready, setReady] = useState(false);

  // Track container width with ResizeObserver
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // Read immediately on mount
    setContainerWidth(Math.floor(el.getBoundingClientRect().width));
    const ro = new ResizeObserver((entries) => {
      setContainerWidth(Math.floor(entries[0].contentRect.width));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Load world GeoJSON (cache in sessionStorage to avoid re-fetching)
  useEffect(() => {
    try {
      const cached = sessionStorage.getItem(SESSION_KEY);
      if (cached) {
        setGeoData(JSON.parse(cached));
        return;
      }
    } catch {}
    fetch(GEO_URL)
      .then((r) => r.json())
      .then((data) => {
        try {
          sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
        } catch {}
        setGeoData(data);
      })
      .catch(() => {});
  }, []);

  // Fly to Asia-Pacific once globe has rendered
  useEffect(() => {
    if (!ready || !globeRef.current) return;
    globeRef.current.pointOfView({ lat: 33, lng: 110, altitude: 2.1 }, 600);
  }, [ready]);

  // --- Polygon colour/altitude (memoised to avoid re-rendering all polygons unnecessarily) ---

  const polygonCapColor = useCallback(
    (feat: GeoFeature) => {
      const iso = feat?.properties?.ISO_A2;
      if (!iso || !SUPPORTED_CODES.has(iso)) return "rgba(70,80,110,0.08)";
      return selectedDestinations.includes(iso)
        ? "rgba(99,102,241,0.85)"   // indigo-500 — selected
        : "rgba(165,180,252,0.28)"; // indigo-300 tint — available but not selected
    },
    [selectedDestinations]
  );

  const polygonAltitude = useCallback(
    (feat: GeoFeature) => {
      const iso = feat?.properties?.ISO_A2;
      return iso && selectedDestinations.includes(iso) ? 0.06 : 0.005;
    },
    [selectedDestinations]
  );

  const polygonLabel = useCallback((feat: GeoFeature) => {
    const iso = feat?.properties?.ISO_A2;
    const c = iso ? COUNTRIES[iso] : null;
    return c ? `${c.flag} ${c.name}` : (feat?.properties?.NAME ?? "");
  }, []);

  const handlePolygonClick = useCallback(
    (feat: GeoFeature) => {
      const iso = feat?.properties?.ISO_A2;
      if (iso && SUPPORTED_CODES.has(iso)) onToggle(iso);
    },
    [onToggle]
  );

  // --- Label pins on selected countries ---
  const labelData = selectedDestinations
    .filter((code) => COUNTRIES[code])
    .map((code) => ({
      lat: COUNTRIES[code].lat,
      lng: COUNTRIES[code].lng,
      text: `${COUNTRIES[code].flag} ${COUNTRIES[code].name}`,
    }));

  // --- AI destination suggestion ---
  const handleSuggest = async () => {
    setSuggesting(true);
    try {
      const profile = loadProfile();
      const res = await fetch("/api/suggest-destinations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile }),
      });
      const data = await res.json();
      if (Array.isArray(data.destinations)) {
        data.destinations.forEach((code: string) => {
          if (!selectedDestinations.includes(code)) onToggle(code);
        });
      }
    } catch {}
    setSuggesting(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* ── 3-D Globe ── */}
      <div
        ref={containerRef}
        className="relative bg-[#060a17] overflow-hidden"
        style={{ height: GLOBE_HEIGHT, flexShrink: 0 }}
      >
        {containerWidth > 0 && (
          <Globe
            ref={globeRef}
            width={containerWidth}
            height={GLOBE_HEIGHT}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
            bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
            backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
            atmosphereColor="lightskyblue"
            atmosphereAltitude={0.18}
            polygonsData={geoData?.features ?? []}
            polygonCapColor={polygonCapColor}
            polygonSideColor={() => "rgba(99,102,241,0.25)"}
            polygonStrokeColor={() => "rgba(255,255,255,0.12)"}
            polygonAltitude={polygonAltitude}
            polygonLabel={polygonLabel}
            onPolygonClick={handlePolygonClick}
            labelsData={labelData}
            labelLat="lat"
            labelLng="lng"
            labelText="text"
            labelSize={1.1}
            labelColor={() => "#ffffff"}
            labelResolution={2}
            labelAltitude={0.09}
            onGlobeReady={() => setReady(true)}
            animateIn
          />
        )}

        {/* Operation hint */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <span className="bg-black/55 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full whitespace-nowrap">
            ドラッグで回す・国をタップでピン 📍
          </span>
        </div>

        {/* AI suggest button */}
        <button
          onClick={handleSuggest}
          disabled={suggesting}
          className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur border border-gray-200 shadow-md rounded-xl px-3 py-2 text-xs font-medium text-gray-700 hover:bg-white disabled:opacity-60 flex items-center gap-1.5 transition-opacity"
        >
          {suggesting ? "⏳" : "✨"} AIに提案
        </button>

        {/* GeoJSON loading overlay */}
        {!geoData && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-white/50 text-sm animate-pulse">🌍 地図データを読み込み中...</p>
          </div>
        )}
      </div>

      {/* ── Bottom panel ── */}
      <div className="flex-1 bg-white border-t border-gray-100 px-4 pt-3 pb-4 flex flex-col justify-between min-h-0">
        <div className="mb-3">
          {selectedDestinations.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {selectedDestinations.map((code) => {
                const c = COUNTRIES[code];
                return (
                  <button
                    key={code}
                    onClick={() => onToggle(code)}
                    className="flex items-center gap-1 px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-full text-sm text-indigo-700 active:scale-95 transition-transform"
                  >
                    {c?.flag} {c?.name}
                    <span className="text-indigo-400 ml-0.5">×</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-1">
              地球儀をドラッグして回し、行きたい国をタップ
            </p>
          )}
        </div>

        <button
          onClick={onNext}
          disabled={selectedDestinations.length === 0}
          className="w-full py-3.5 bg-indigo-500 text-white font-semibold rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
        >
          選んだ行き先を見る →（{selectedDestinations.length}カ国）
        </button>
      </div>
    </div>
  );
}
