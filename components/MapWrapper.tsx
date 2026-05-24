"use client";

import dynamic from "next/dynamic";

const MapClient = dynamic(() => import("@/components/MapClient"), {
  ssr: false,
  loading: () => (
    <div
      className="w-full flex items-center justify-center rounded-2xl bg-gray-100 border border-gray-200"
      style={{ height: "60vh" }}
    >
      <p className="text-gray-400 text-sm">地図を読み込み中...</p>
    </div>
  ),
});

export default function MapWrapper() {
  return <MapClient />;
}
