"use client";

import { useEffect, useRef, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { DayPlan, Itinerary, TripPlan } from "@/lib/trip-plan";
import { getCountry } from "@/lib/country-data";
import { loadProfile } from "@/lib/user-profile";

type Slot = DayPlan["slots"][number];

type Props = {
  plan: TripPlan;
  onUpdateItinerary: (itinerary: Itinerary) => void;
  onNext: () => void;
};

/* ─── Drag handle icon ─────────────────────────────── */
function DragHandle(props: React.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="flex items-center justify-center w-5 shrink-0 touch-none cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-400 self-center"
      tabIndex={-1}
      aria-label="ドラッグして並び替え"
    >
      <svg width="10" height="16" viewBox="0 0 10 16" fill="currentColor">
        <circle cx="3" cy="2" r="1.5" />
        <circle cx="7" cy="2" r="1.5" />
        <circle cx="3" cy="8" r="1.5" />
        <circle cx="7" cy="8" r="1.5" />
        <circle cx="3" cy="14" r="1.5" />
        <circle cx="7" cy="14" r="1.5" />
      </svg>
    </button>
  );
}

/* ─── Sortable slot row ────────────────────────────── */
function SortableSlotRow({ slot, id }: { slot: Slot; id: string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const isFlight = slot.transport === "飛行機";

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex gap-2 py-2.5 border-b border-gray-50 last:border-none ${
        isDragging ? "opacity-50 bg-indigo-50/60 rounded-xl z-10" : ""
      } ${isFlight ? "-mx-4 px-4 bg-sky-50/70" : ""}`}
    >
      <DragHandle {...attributes} {...listeners} />

      {/* Time */}
      <div
        className={`w-11 text-xs font-semibold shrink-0 pt-0.5 ${
          isFlight ? "text-sky-500" : "text-gray-400"
        }`}
      >
        {slot.time}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          {isFlight && <span className="text-base leading-none">✈️</span>}
          <p
            className={`text-sm font-semibold leading-snug ${
              isFlight ? "text-sky-700" : "text-gray-800"
            }`}
          >
            {slot.spot}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 mt-0.5">
          {slot.duration && (
            <span className="text-xs text-gray-400">⏱ {slot.duration}</span>
          )}
          {!isFlight && slot.transport && (
            <span className="text-xs text-gray-400">🚌 {slot.transport}</span>
          )}
          {slot.cost > 0 && (
            <span
              className={`text-xs font-medium ${
                isFlight ? "text-sky-600" : "text-gray-400"
              }`}
            >
              ¥{slot.cost.toLocaleString()}
            </span>
          )}
        </div>
        {slot.comment && (
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
            {slot.comment}
          </p>
        )}
      </div>
    </div>
  );
}

/* ─── Hotel row (non-draggable, appended to each non-last day) ── */
function HotelRow({ hotel }: { hotel: Itinerary["hotel"] }) {
  return (
    <div className="flex items-center gap-3 mt-1.5 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2.5">
      <span className="text-lg">🏨</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-emerald-700 truncate">
          {hotel.name}
        </p>
        <p className="text-xs text-gray-500">
          宿泊 · ¥{hotel.cost_per_night.toLocaleString()}/泊
        </p>
      </div>
    </div>
  );
}

/* ─── Day card with per-day DnD context ─────────────── */
type DayCardProps = {
  dayPlan: DayPlan;
  isOpen: boolean;
  onToggle: () => void;
  /** hotel を渡さない（null）= 最終日 → 宿泊行を非表示 */
  hotel: Itinerary["hotel"] | null;
  onReorder: (newSlots: Slot[]) => void;
};

function DayCard({ dayPlan, isOpen, onToggle, hotel, onReorder }: DayCardProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 8 },
    })
  );

  const slotIds = dayPlan.slots.map((_, i) => `d${dayPlan.day}-s${i}`);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = slotIds.indexOf(String(active.id));
    const newIdx = slotIds.indexOf(String(over.id));
    if (oldIdx !== -1 && newIdx !== -1) {
      onReorder(arrayMove(dayPlan.slots, oldIdx, newIdx));
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
      >
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full flex items-center justify-center shrink-0">
            {dayPlan.day}
          </span>
          <span className="text-sm font-semibold text-gray-800">
            {dayPlan.title}
          </span>
        </div>
        <span className="text-gray-400 text-sm">{isOpen ? "▲" : "▼"}</span>
      </button>

      {/* Expanded content */}
      {isOpen && (
        <div className="px-4 pb-3 border-t border-gray-100">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={slotIds} strategy={verticalListSortingStrategy}>
              {dayPlan.slots.map((slot, i) => (
                <SortableSlotRow key={slotIds[i]} slot={slot} id={slotIds[i]} />
              ))}
            </SortableContext>
          </DndContext>

          {/* Hotel row */}
          {hotel && <HotelRow hotel={hotel} />}
        </div>
      )}
    </div>
  );
}

/* ─── Main component ─────────────────────────────── */
export default function Step4Plan({ plan, onUpdateItinerary, onNext }: Props) {
  const [loading, setLoading] = useState(!plan.itinerary);
  const [error, setError] = useState<string | null>(null);
  const [openDays, setOpenDays] = useState<number[]>([1]);
  const [modifyText, setModifyText] = useState("");
  const [modifying, setModifying] = useState(false);
  const [localItinerary, setLocalItinerary] = useState<Itinerary | null>(
    plan.itinerary
  );
  const generatedRef = useRef(false);

  const country = getCountry(plan.destination ?? "");

  // Sync when parent updates itinerary (generate / modify)
  useEffect(() => {
    if (plan.itinerary) setLocalItinerary(plan.itinerary);
  }, [plan.itinerary]);

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
      setLocalItinerary(data.itinerary);
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
    if (!modifyText.trim() || !localItinerary) return;
    setModifying(true);
    try {
      const res = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "modify",
          itinerary: localItinerary,
          instruction: modifyText,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      onUpdateItinerary(data.itinerary);
      setLocalItinerary(data.itinerary);
      setModifyText("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "修正に失敗しました");
    } finally {
      setModifying(false);
    }
  };

  /** 特定日のスロット並び順を更新する */
  const handleReorderDay = (dayIndex: number, newSlots: Slot[]) => {
    if (!localItinerary) return;
    const newDays = localItinerary.days.map((day, i) =>
      i === dayIndex ? { ...day, slots: newSlots } : day
    );
    const updated = { ...localItinerary, days: newDays };
    setLocalItinerary(updated);
    onUpdateItinerary(updated);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* ヘッダーサマリー */}
      <div className="bg-indigo-600 text-white rounded-2xl p-4">
        <p className="text-sm font-medium opacity-80 mb-1">
          {country?.flag} {country?.name} · {plan.tripDays}日間
        </p>
        {localItinerary ? (
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold">
              ¥{localItinerary.total_cost.toLocaleString()}
            </p>
            <div className="text-xs text-right opacity-80">
              <p>✈️ ¥{localItinerary.flight.cost.toLocaleString()}</p>
              <p>
                🏨 ¥
                {(
                  localItinerary.hotel.cost_per_night *
                  localItinerary.hotel.nights
                ).toLocaleString()}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm opacity-80">プラン生成中...</p>
        )}
      </div>

      {/* ハイライト */}
      {localItinerary?.highlights && localItinerary.highlights.length > 0 && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
          <p className="text-xs font-semibold text-amber-700 mb-1.5">
            ✨ このプランの見どころ
          </p>
          <div className="flex flex-col gap-1">
            {localItinerary.highlights.map((h, i) => (
              <p key={i} className="text-xs text-gray-700">
                • {h}
              </p>
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
          <button
            onClick={generatePlan}
            className="mt-2 text-sm text-red-600 underline"
          >
            再生成する
          </button>
        </div>
      )}

      {/* 旅程（ドラッグソート対応） */}
      {localItinerary && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5">
            <p className="text-xs font-semibold text-gray-500">
              旅程（タップで展開 · ⠿ドラッグで並び替え）
            </p>
          </div>
          {localItinerary.days.map((day, dayIndex) => (
            <DayCard
              key={day.day}
              dayPlan={day}
              isOpen={openDays.includes(day.day)}
              onToggle={() =>
                setOpenDays((prev) =>
                  prev.includes(day.day)
                    ? prev.filter((d) => d !== day.day)
                    : [...prev, day.day]
                )
              }
              hotel={
                dayIndex < localItinerary.days.length - 1
                  ? localItinerary.hotel
                  : null
              }
              onReorder={(newSlots) => handleReorderDay(dayIndex, newSlots)}
            />
          ))}
        </div>
      )}

      {/* プラン修正チャット */}
      {localItinerary && (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
          <p className="text-xs font-semibold text-gray-600 mb-2">
            🤖 プランを修正する
          </p>
          <p className="text-xs text-gray-400 mb-2">
            例：「2日目の午前を美術館に変えて」「ホテルをもう少し安くして」
          </p>
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

      {localItinerary && (
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
