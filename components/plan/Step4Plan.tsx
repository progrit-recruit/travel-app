"use client";

import { useEffect, useRef, useState } from "react";
import type { DayPlan, Itinerary, TripPlan } from "@/lib/trip-plan";
import { getCountry } from "@/lib/country-data";
import { loadProfile } from "@/lib/user-profile";

type Props = {
  plan: TripPlan;
  onUpdateItinerary: (itinerary: Itinerary) => void;
  onNext: () => void;
};

function SlotRow({ slot }: { slot: DayPlan["slots"][number] }) {
  return (
    <div className="flex gap-3 py-2 border-b border-gray-50 last:border-none">
      <div className="w-12 text-xs text-gray-400 font-medium shrink-0 pt-0.5">{slot.time}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 leading-snug">{slot.spot}</p>
        <div className="flex flex-wrap gap-2 mt-0.5">
          {slot.duration && (
            <span className="text-xs text-gray-400">⏱ {slot.duration}</span>
          )}
          {slot.transport && (
            <span className="text-xs text-gray-400">🚌 {slot.transport}</span>
          )}
          {slot.cost > 0 && (
            <span className="text-xs text-gray-400">¥{slot.cost.toLocaleString()}</span>
          )}
        </div>
        {slot.comment && (
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{slot.comment}</p>
        )}
      </div>
    </div>
  );
}

function DayCard({ dayPlan, isOpen, onToggle }: { dayPlan: DayPlan; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
      >
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full flex items-center justify-center">
            {dayPlan.day}
          </span>
          <span className="text-sm font-semibold text-gray-800">{dayPlan.title}</span>
        </div>
        <span className="text-gray-400 text-sm">{isOpen ? "▲" : "▼"}</span>
      </button>
      {isOpen && (
        <div className="px-4 pb-3 border-t border-gray-100">
          {dayPlan.slots.map((slot, i) => (
            <SlotRow key={i} slot={slot} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Step4Plan({ plan, onUpdateItinerary, onNext }: Props) {
  const [loading, setLoading] = useState(!plan.itinerary);
  const [error, setError] = useState<string | null>(null);
  const [openDays, setOpenDays] = useState<number[]>([1]);
  const [modifyText, setModifyText] = useState("");
  const [modifying, setModifying] = useState(false);
  const generatedRef = useRef(false);

  const country = getCountry(plan.destination ?? "");

  const generatePlan = async () => {
    setLoading(true);
    setError(null);
    try {
      const profile = loadProfile();
      const res = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate",
          context: {
            destination: plan.destination,
            tripType: plan.tripType,
            tripDays: plan.tripDays,
            interests: plan.interests,
            freeText: plan.freeText,
            extractedSpots: plan.extractedSpots,
            profile,
          },
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      onUpdateItinerary(data.itinerary);
      setOpenDays([1]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "プランの生成に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!plan.itinerary && !generatedRef.current) {
      generatedRef.current = true;
      generatePlan();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleModify = async () => {
    if (!modifyText.trim() || !plan.itinerary) return;
    setModifying(true);
    try {
      const res = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "modify",
          itinerary: plan.itinerary,
          instruction: modifyText,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      onUpdateItinerary(data.itinerary);
      setModifyText("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "修正に失敗しました");
    } finally {
      setModifying(false);
    }
  };

  const itinerary = plan.itinerary;

  return (
    <div className="flex flex-col gap-4">
      {/* ヘッダーサマリー */}
      <div className="bg-indigo-600 text-white rounded-2xl p-4">
        <p className="text-sm font-medium opacity-80 mb-1">
          {country?.flag} {country?.name} · {plan.tripDays}日間
        </p>
        {itinerary ? (
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold">¥{itinerary.total_cost.toLocaleString()}</p>
            <div className="text-xs text-right opacity-80">
              <p>✈️ ¥{itinerary.flight.cost.toLocaleString()}</p>
              <p>🏨 ¥{(itinerary.hotel.cost_per_night * itinerary.hotel.nights).toLocaleString()}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm opacity-80">プラン生成中...</p>
        )}
      </div>

      {/* フライト・ホテル情報 */}
      {itinerary && (
        <div className="flex gap-2">
          <div className="flex-1 bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs">
            <p className="font-semibold text-blue-700 mb-0.5">✈️ フライト</p>
            <p className="text-gray-700">{itinerary.flight.airline}</p>
            <p className="text-gray-500">{itinerary.flight.duration} · ¥{itinerary.flight.cost.toLocaleString()}</p>
          </div>
          <div className="flex-1 bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-xs">
            <p className="font-semibold text-emerald-700 mb-0.5">🏨 ホテル</p>
            <p className="text-gray-700 leading-snug">{itinerary.hotel.name}</p>
            <p className="text-gray-500">{itinerary.hotel.nights}泊 · ¥{(itinerary.hotel.cost_per_night * itinerary.hotel.nights).toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* ハイライト */}
      {itinerary?.highlights && itinerary.highlights.length > 0 && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
          <p className="text-xs font-semibold text-amber-700 mb-1.5">✨ このプランの見どころ</p>
          <div className="flex flex-col gap-1">
            {itinerary.highlights.map((h, i) => (
              <p key={i} className="text-xs text-gray-700">• {h}</p>
            ))}
          </div>
        </div>
      )}

      {/* ローディング */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-sm text-gray-500">AIがプランを生成中...</p>
          <p className="text-xs text-gray-400">少々お待ちください（30秒ほど）</p>
        </div>
      )}

      {/* エラー */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-700">{error}</p>
          <button onClick={generatePlan} className="mt-2 text-sm text-red-600 underline">
            再生成する
          </button>
        </div>
      )}

      {/* 旅程 */}
      {itinerary && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold text-gray-500">旅程（タップで展開）</p>
          {itinerary.days.map((day) => (
            <DayCard
              key={day.day}
              dayPlan={day}
              isOpen={openDays.includes(day.day)}
              onToggle={() =>
                setOpenDays((prev) =>
                  prev.includes(day.day) ? prev.filter((d) => d !== day.day) : [...prev, day.day]
                )
              }
            />
          ))}
        </div>
      )}

      {/* プラン修正チャット */}
      {itinerary && (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
          <p className="text-xs font-semibold text-gray-600 mb-2">🤖 プランを修正する</p>
          <p className="text-xs text-gray-400 mb-2">例：「2日目の午前を美術館に変えて」「ホテルをもう少し安くして」</p>
          <div className="flex gap-2">
            <textarea
              value={modifyText}
              onChange={(e) => setModifyText(e.target.value)}
              placeholder="修正したい内容を入力..."
              rows={2}
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-indigo-400 resize-none bg-white"
            />
            <button
              onClick={handleModify}
              disabled={!modifyText.trim() || modifying}
              className="px-4 py-2 bg-indigo-500 text-white text-sm font-medium rounded-xl disabled:opacity-40 self-end"
            >
              {modifying ? "⏳" : "送信"}
            </button>
          </div>
        </div>
      )}

      {itinerary && (
        <button
          onClick={onNext}
          className="w-full py-3.5 bg-indigo-500 text-white font-semibold rounded-2xl transition-all active:scale-[0.98]"
        >
          このプランで予約する →
        </button>
      )}
    </div>
  );
}
