"use client";

import { useState } from "react";
import type { TripPlan } from "@/lib/trip-plan";
import { getCountry, TRIP_TYPES } from "@/lib/country-data";

type Props = {
  plan: TripPlan;
  onConfirm: () => void;
};

const PAYMENT_METHODS = [
  { id: "credit", label: "クレジットカード", icon: "💳" },
  { id: "apple", label: "Apple Pay", icon: "🍎" },
  { id: "google", label: "Google Pay", icon: "G" },
];

export default function Step5Booking({ plan, onConfirm }: Props) {
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [confirming, setConfirming] = useState(false);

  const itinerary = plan.itinerary!;
  const country = getCountry(plan.destination ?? "");
  const tripTypeLabel = TRIP_TYPES.find((t) => t.value === plan.tripType)?.label;
  const hotelTotal = itinerary.hotel.cost_per_night * itinerary.hotel.nights;

  const handleConfirm = async () => {
    setConfirming(true);
    // モック決済処理（1秒待機）
    await new Promise((r) => setTimeout(r, 1200));
    onConfirm();
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">予約内容を確認</h2>
        <p className="text-xs text-gray-400 mt-1">内容を確認して予約を確定してください</p>
      </div>

      {/* トリップサマリー */}
      <div className="bg-indigo-600 text-white rounded-2xl p-4">
        <p className="text-lg font-bold">{country?.flag} {country?.name}の旅</p>
        <p className="text-sm opacity-80 mt-0.5">{tripTypeLabel} · {plan.tripDays}日間</p>
        <p className="text-2xl font-bold mt-2">¥{itinerary.total_cost.toLocaleString()}</p>
        <p className="text-xs opacity-70 mt-0.5">（1名あたり・すべて込み）</p>
      </div>

      {/* 料金明細 */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-700">料金明細</p>
        </div>
        {[
          { label: `✈️ 航空券（${itinerary.flight.airline}）`, value: itinerary.flight.cost },
          { label: `🏨 ホテル（${itinerary.hotel.name}）`, sub: `${itinerary.hotel.nights}泊`, value: hotelTotal },
          {
            label: "🍽️ 現地費用（食事・観光・交通）",
            value: itinerary.total_cost - itinerary.flight.cost - hotelTotal,
          },
        ].map((row) => (
          <div key={row.label} className="flex items-center justify-between px-4 py-3 border-b border-gray-50 last:border-none">
            <div>
              <p className="text-sm text-gray-700">{row.label}</p>
              {row.sub && <p className="text-xs text-gray-400">{row.sub}</p>}
            </div>
            <p className="text-sm font-semibold text-gray-800">¥{row.value.toLocaleString()}</p>
          </div>
        ))}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
          <p className="text-sm font-bold text-gray-800">合計</p>
          <p className="text-base font-bold text-indigo-700">¥{itinerary.total_cost.toLocaleString()}</p>
        </div>
      </div>

      {/* キャンセルポリシー */}
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
        <p className="text-xs font-semibold text-amber-700 mb-1">⚠️ キャンセルポリシー</p>
        <p className="text-xs text-gray-600 leading-relaxed">
          出発の7日前まで：無料キャンセル可<br />
          3〜7日前：料金の50%<br />
          3日前以内：料金の100%
        </p>
      </div>

      {/* 決済手段 */}
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-2">決済手段を選択</p>
        <div className="flex flex-col gap-2">
          {PAYMENT_METHODS.map((m) => (
            <button
              key={m.id}
              onClick={() => setPaymentMethod(m.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${
                paymentMethod === m.id
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <span className="text-xl">{m.icon}</span>
              <span className="text-sm font-medium text-gray-800">{m.label}</span>
              {paymentMethod === m.id && (
                <span className="ml-auto text-indigo-500">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 予約確定ボタン */}
      <button
        onClick={handleConfirm}
        disabled={confirming}
        className="w-full py-4 bg-indigo-600 text-white font-bold text-base rounded-2xl disabled:opacity-70 transition-all active:scale-[0.98] shadow-lg"
      >
        {confirming ? "⏳ 予約処理中..." : `¥${itinerary.total_cost.toLocaleString()} で予約を確定する`}
      </button>

      {/* 提携サービス案内 */}
      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex flex-col gap-2">
        <p className="text-xs font-semibold text-gray-600">✨ 旅の前に準備しておこう</p>
        <a
          href="https://www.airalo.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm hover:bg-gray-50"
        >
          <span>📡 海外eSIM（Airalo）</span>
          <span className="text-xs text-indigo-500">確認 →</span>
        </a>
        <a
          href="https://hoken.rakuten.co.jp/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm hover:bg-gray-50"
        >
          <span>🛡️ 海外旅行保険</span>
          <span className="text-xs text-indigo-500">確認 →</span>
        </a>
      </div>

      <p className="text-xs text-center text-gray-400">
        ※ これはデモアプリのため実際の決済・予約は行われません
      </p>
    </div>
  );
}
