"use client";

import { useState } from "react";
import {
  COUNTRIES,
  COUNTRY_REGIONS,
  TRIP_TYPES,
  TRIP_TYPE_DAYS,
  getCountriesByCode,
} from "@/lib/country-data";

type Props = {
  selectedDestinations: string[];
  destination: string | null;
  region: string | null;
  tripType: string | null;
  tripDays: number;
  onSelectDestination: (code: string) => void;
  onSelectRegion: (region: string) => void;
  onSelectTripType: (type: string, days: number) => void;
  onNext: () => void;
  onBack: () => void;
};

function CostBar({
  label,
  color,
  value,
  total,
}: {
  label: string;
  color: string;
  value: number;
  total: number;
}) {
  const pct = Math.round((value / total) * 100);
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-14 text-gray-500 shrink-0">{label}</span>
      <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-16 text-right text-gray-600 shrink-0">¥{value.toLocaleString()}</span>
    </div>
  );
}

export default function Step2Narrow({
  selectedDestinations,
  destination,
  region,
  tripType,
  tripDays,
  onSelectDestination,
  onSelectRegion,
  onSelectTripType,
  onNext,
  onBack,
}: Props) {
  const [customDays, setCustomDays] = useState(tripDays);
  const countries = getCountriesByCode(selectedDestinations);
  const selected = destination ? COUNTRIES[destination] : null;
  const regions = destination ? (COUNTRY_REGIONS[destination] ?? []) : [];

  const flightCost = selected ? Math.round((selected.flightMin + selected.flightMax) / 2) : 0;
  const hotelCost = selected
    ? Math.round((selected.hotelMin + selected.hotelMax) / 2) * (tripDays - 1)
    : 0;
  const localCost = selected
    ? Math.round((selected.localMin + selected.localMax) / 2) * tripDays
    : 0;
  const totalCost = flightCost + hotelCost + localCost;

  const canNext = !!destination && !!region && !!tripType;

  return (
    <div className="flex flex-col gap-5">
      {/* ── 国選択 ── */}
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-2">
          行き先を1カ国選んでください
        </p>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {countries.map((c) => (
            <button
              key={c.code}
              onClick={() => onSelectDestination(c.code)}
              className={`shrink-0 flex flex-col items-center gap-1 px-4 py-3 rounded-2xl border-2 transition-all ${
                destination === c.code
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <span className="text-3xl">{c.flag}</span>
              <span className="text-xs font-medium text-gray-700">{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── 選択した国の概要 ── */}
      {selected && (
        <div className="bg-gray-50 rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-base font-bold text-gray-900">
              {selected.flag} {selected.name}
            </p>
            <div className="text-right">
              <p className="text-xs text-gray-400">東京から</p>
              <p className="text-sm font-semibold text-gray-700">約{selected.flightHours}時間</p>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-semibold text-gray-500">費用目安（{tripDays}日間/1人）</p>
            <CostBar label="✈️ 航空券" color="bg-blue-400" value={flightCost} total={totalCost} />
            <CostBar label="🏨 ホテル" color="bg-emerald-400" value={hotelCost} total={totalCost} />
            <CostBar label="🍽️ 現地費" color="bg-amber-400" value={localCost} total={totalCost} />
            <p className="text-right text-sm font-bold text-gray-800 mt-0.5">
              合計目安 ¥{totalCost.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* ── エリア選択（国が選ばれたら表示）── */}
      {selected && (
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-2">
            どのエリアに行きますか？
          </p>

          {/* 人気エリア グリッド */}
          {regions.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 mb-3">
              {regions.map((r) => (
                <button
                  key={r.name}
                  onClick={() => onSelectRegion(r.name)}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 text-left transition-all active:scale-[0.97] ${
                    region === r.name
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 bg-white hover:border-indigo-200 hover:bg-indigo-50/40"
                  }`}
                >
                  <span className="text-xl leading-none">{r.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-semibold truncate ${
                        region === r.name ? "text-indigo-700" : "text-gray-800"
                      }`}
                    >
                      {r.name}
                    </p>
                    {region === r.name && (
                      <p className="text-xs text-indigo-500">選択中 ✓</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 mb-3">この国の詳細エリアデータは準備中です</p>
          )}

          {/* その他の地域 ── 検索ボックス（現在は表示のみ） */}
          <div>
            <p className="text-xs font-medium text-gray-400 mb-1.5">その他の地域</p>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                readOnly
                placeholder="地域名で検索…（近日対応予定）"
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-400 placeholder-gray-300 cursor-not-allowed outline-none"
                aria-label="地域検索（現在は利用できません）"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── 旅のスタイル（エリアが選ばれたら表示）── */}
      {region && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <p className="text-xs font-semibold text-gray-500">旅のスタイルを選んでください</p>
            <span className="text-xs text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">
              {region}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {TRIP_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => {
                  const days =
                    type.value === "custom" ? customDays : TRIP_TYPE_DAYS[type.value];
                  onSelectTripType(type.value, days);
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all ${
                  tripType === type.value
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <span className="text-2xl">{type.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{type.label}</p>
                  <p className="text-xs text-gray-500">{type.desc}</p>
                </div>
                {tripType === type.value && type.value !== "custom" && (
                  <span className="text-xs text-indigo-600 font-medium shrink-0">
                    {TRIP_TYPE_DAYS[type.value]}日間
                  </span>
                )}
              </button>
            ))}

            {/* カスタム日数入力 */}
            {tripType === "custom" && (
              <div className="flex items-center gap-3 px-4 py-3 bg-indigo-50 rounded-xl border-2 border-indigo-200">
                <span className="text-sm text-gray-700">旅行日数：</span>
                <input
                  type="number"
                  min={2}
                  max={30}
                  value={customDays}
                  onChange={(e) => {
                    const d = Math.max(2, Math.min(30, Number(e.target.value)));
                    setCustomDays(d);
                    onSelectTripType("custom", d);
                  }}
                  className="w-20 px-3 py-1.5 border border-indigo-300 rounded-lg text-sm text-center outline-none focus:border-indigo-500"
                />
                <span className="text-sm text-gray-700">日間</span>
              </div>
            )}
          </div>
        </div>
      )}

      <button
        onClick={onNext}
        disabled={!canNext}
        className="w-full py-3.5 bg-indigo-500 text-white font-semibold rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
      >
        次へ → こだわりを設定する
      </button>
    </div>
  );
}
