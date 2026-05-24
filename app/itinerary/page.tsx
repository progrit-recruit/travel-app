"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadConfirmedTrip, loadTripPlan, type TripPlan } from "@/lib/trip-plan";
import { getCountry } from "@/lib/country-data";
import ItineraryView from "@/components/itinerary/ItineraryView";

export default function ItineraryPage() {
  const [trip, setTrip] = useState<TripPlan | null>(null);
  const [status, setStatus] = useState<"confirmed" | "planning" | "none">("none");

  useEffect(() => {
    const confirmed = loadConfirmedTrip();
    if (confirmed?.itinerary) {
      setTrip(confirmed);
      setStatus("confirmed");
      return;
    }
    const plan = loadTripPlan();
    if (plan?.itinerary) {
      setTrip(plan);
      setStatus("planning");
    }
  }, []);

  const country = trip ? getCountry(trip.destination ?? "") : null;
  const itinerary = trip?.itinerary ?? null;

  return (
    <main className="flex flex-col min-h-screen bg-gray-50 pb-10">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-30">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Link
            href="/mypage"
            className="w-8 h-8 flex items-center justify-center text-gray-400 text-xl rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="マイページに戻る"
          >
            ‹
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900">旅程の詳細</h1>
            {trip && country && (
              <p className="text-xs text-gray-400 mt-0.5">
                {country.flag} {country.name}
                {trip.region ? ` · ${trip.region}` : ""}
                {" · "}
                {trip.tripDays}日間
              </p>
            )}
          </div>
          {status === "confirmed" && (
            <span className="text-xs bg-emerald-100 text-emerald-700 font-semibold px-2.5 py-1 rounded-full">
              ✅ 確定済み
            </span>
          )}
          {status === "planning" && (
            <span className="text-xs bg-indigo-100 text-indigo-700 font-semibold px-2.5 py-1 rounded-full">
              ⏳ 計画中
            </span>
          )}
        </div>
      </header>

      <div className="flex-1 max-w-lg mx-auto w-full px-4 py-5 flex flex-col gap-4">
        {/* No trip found */}
        {!trip && (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <span className="text-5xl">🌏</span>
            <p className="text-gray-600 font-medium">旅程がまだありません</p>
            <p className="text-sm text-gray-400">プランを作成してから旅程を確認できます</p>
            <Link
              href="/plan"
              className="mt-2 px-6 py-2.5 bg-indigo-500 text-white text-sm font-semibold rounded-2xl"
            >
              旅を計画する →
            </Link>
          </div>
        )}

        {/* Cost summary */}
        {itinerary && country && (
          <div className="bg-indigo-600 text-white rounded-2xl p-4">
            <p className="text-sm font-medium opacity-80 mb-1">
              {country.flag} {country.name} · {trip!.tripDays}日間
            </p>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-bold">
                ¥{itinerary.total_cost.toLocaleString()}
              </p>
              <div className="text-xs text-right opacity-80">
                <p>✈️ ¥{itinerary.flight.cost.toLocaleString()}</p>
                <p>
                  🏨 ¥
                  {(
                    itinerary.hotel.cost_per_night * itinerary.hotel.nights
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Highlights */}
        {itinerary?.highlights && itinerary.highlights.length > 0 && (
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
            <p className="text-xs font-semibold text-amber-700 mb-1.5">
              ✨ このプランの見どころ
            </p>
            <div className="flex flex-col gap-1">
              {itinerary.highlights.map((h, i) => (
                <p key={i} className="text-xs text-gray-700">
                  • {h}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Day-by-day itinerary */}
        {itinerary && (
          <>
            <p className="text-xs font-semibold text-gray-500 -mb-1">
              旅程（タップで展開）
            </p>
            <ItineraryView itinerary={itinerary} />
          </>
        )}

        {/* Edit shortcut for planning trips */}
        {status === "planning" && (
          <Link
            href="/plan"
            className="flex items-center justify-center gap-2 py-3 border-2 border-dashed border-indigo-300 text-indigo-600 text-sm font-semibold rounded-2xl hover:bg-indigo-50 transition-colors"
          >
            ✏️ プランを編集する
          </Link>
        )}
      </div>
    </main>
  );
}
