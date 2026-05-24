"use client";

import { useState } from "react";
import type { DayPlan, Itinerary } from "@/lib/trip-plan";

type Slot = DayPlan["slots"][number];

/* ─── Slot row (read-only) ────────────────────────── */
function SlotRow({ slot }: { slot: Slot }) {
  const isFlight = slot.transport === "飛行機";
  return (
    <div
      className={`flex gap-3 py-2.5 border-b border-gray-50 last:border-none ${
        isFlight ? "-mx-4 px-4 bg-sky-50/70" : ""
      }`}
    >
      <div
        className={`w-12 text-xs font-semibold shrink-0 pt-0.5 ${
          isFlight ? "text-sky-500" : "text-gray-400"
        }`}
      >
        {slot.time}
      </div>
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

/* ─── Hotel row ────────────────────────────────────── */
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

/* ─── Day card (collapsible, read-only) ───────────── */
function DayCard({
  dayPlan,
  hotel,
  defaultOpen,
}: {
  dayPlan: DayPlan;
  hotel: Itinerary["hotel"] | null;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen ?? false);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
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
        <span className="text-gray-400 text-sm">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="px-4 pb-3 border-t border-gray-100">
          {dayPlan.slots.map((slot, i) => (
            <SlotRow key={i} slot={slot} />
          ))}
          {hotel && <HotelRow hotel={hotel} />}
        </div>
      )}
    </div>
  );
}

/* ─── Main ItineraryView component ───────────────── */
export default function ItineraryView({ itinerary }: { itinerary: Itinerary }) {
  return (
    <div className="flex flex-col gap-2">
      {itinerary.days.map((day, i) => (
        <DayCard
          key={day.day}
          dayPlan={day}
          hotel={i < itinerary.days.length - 1 ? itinerary.hotel : null}
          defaultOpen={i === 0}
        />
      ))}
    </div>
  );
}
