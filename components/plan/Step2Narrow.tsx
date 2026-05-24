"use client";

import { useState } from "react";
import { COUNTRIES, TRIP_TYPES, TRIP_TYPE_DAYS, getCountriesByCode } from "@/lib/country-data";

type Props = {
  selectedDestinations: string[];
  destination: string | null;
  tripType: string | null;
  tripDays: number;
  onSelectDestination: (code: string) => void;
  onSelectTripType: (type: string, days: number) => void;
  onNext: () => void;
  onBack: () => void;
};

function CostBar({ label, color, value, total }: { label: string; color: string; value: number; total: number }) {
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
  tripType,
  tripDays,
  onSelectDestination,
  onSelectTripType,
  onNext,
  onBack,
}: Props) {
  const [customDays, setCustomDays] = useState(tripDays);
  const countries = getCountriesByCode(selectedDestinations);
  const selected = destination ? COUNTRIES[destination] : null;

  const flightCost = selected ? Math.round((selected.flightMin + selected.flightMax) / 2) : 0;
  const hotelCost = selected ? Math.round((selected.hotelMin + selected.hotelMax) / 2) * (tripDays - 1) : 0;
  const localCost = selected ? Math.round((selected.localMin + selected.localMax) / 2) * tripDays : 0;
  const totalCost = flightCost + hotelCost + localCost;

  const canNext = !!destination && !!tripType;

  return (
    <div className="flex flex-col gap-5">
      {/* 国選択 */}
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-2">行き先を1カ国選んでください</p>
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

      {/* 選択した国の情報 */}
      {selected && (
        <div className="bg-gray-50 rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-bold text-gray-900">{selected.flag} {selected.name}</p>
              <p className="text-xs text-gray-500">{selected.continent}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">東京から</p>
              <p className="text-sm font-semibold text-gray-700">約{selected.flightHours}時間</p>
            </div>
          </div>

          <div className="flex gap-3 text-xs">
            <div className="flex-1 bg-white rounded-xl p-2 text-center">
              <p className="text-gray-400">ベストシーズン</p>
              <p className="font-medium text-gray-700 mt-0.5 leading-snug">{selected.bestSeason}</p>
            </div>
            <div className="flex-1 bg-white rounded-xl p-2 text-center">
              <p className="text-gray-400">通貨</p>
              <p className="font-medium text-gray-700 mt-0.5">
                1{selected.currency} ≈ ¥{selected.rateToJPY.toFixed(selected.rateToJPY < 10 ? 3 : 0)}
              </p>
            </div>
          </div>

          {/* 費用内訳 */}
          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-semibold text-gray-500">費用目安（{tripDays}日間/1人）</p>
            <CostBar label="✈️ 航空券" color="bg-blue-400" value={flightCost} total={totalCost} />
            <CostBar label="🏨 ホテル" color="bg-emerald-400" value={hotelCost} total={totalCost} />
            <CostBar label="🍽️ 現地費" color="bg-amber-400" value={localCost} total={totalCost} />
            <p className="text-right text-sm font-bold text-gray-800 mt-1">
              合計目安 ¥{totalCost.toLocaleString()}
            </p>
          </div>

          {/* 人気スポット */}
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-1.5">人気スポット TOP{selected.topSpots.length}</p>
            <div className="flex flex-col gap-1">
              {selected.topSpots.map((spot, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-xs text-indigo-400 font-bold w-5 shrink-0">{i + 1}</span>
                  {spot}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 旅のタイプ */}
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-2">旅のスタイルを選んでください</p>
        <div className="flex flex-col gap-2">
          {TRIP_TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => {
                const days = type.value === "custom" ? customDays : TRIP_TYPE_DAYS[type.value];
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
                <span className="text-xs text-indigo-600 font-medium">{TRIP_TYPE_DAYS[type.value]}日間</span>
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
