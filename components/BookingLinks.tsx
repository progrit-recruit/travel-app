"use client";

import { useState } from "react";
import { BOOKING_CATEGORIES, type BookingService, type Tag } from "@/lib/booking-links";

const TAG_COLORS: Record<Tag["color"], string> = {
  emerald: "bg-emerald-50 text-emerald-700",
  blue:    "bg-blue-50 text-blue-700",
  orange:  "bg-orange-50 text-orange-700",
  purple:  "bg-purple-50 text-purple-700",
  gray:    "bg-gray-100 text-gray-500",
};

function ServiceCard({ service }: { service: BookingService }) {
  return (
    <div className={`bg-white rounded-2xl border p-4 flex flex-col gap-3 ${service.recommended ? "border-emerald-200" : "border-gray-200"}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-gray-900">{service.name}</p>
            {service.recommended && (
              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">おすすめ</span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-0.5 leading-snug">{service.description}</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex flex-wrap gap-1">
          {service.tags.map((tag) => (
            <span key={tag.label} className={`text-xs px-2 py-0.5 rounded-full ${TAG_COLORS[tag.color]}`}>
              {tag.label}
            </span>
          ))}
        </div>
        <a
          href={service.url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-700 active:scale-95 transition-all"
        >
          開く →
        </a>
      </div>
    </div>
  );
}

export default function BookingLinks() {
  const [activeCategoryId, setActiveCategoryId] = useState(BOOKING_CATEGORIES[0].id);

  const activeCategory = BOOKING_CATEGORIES.find((c) => c.id === activeCategoryId)!;

  return (
    <div className="flex flex-col gap-4">
      {/* カテゴリタブ */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {BOOKING_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategoryId(cat.id)}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeCategoryId === cat.id
                ? "bg-gray-900 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.title}</span>
          </button>
        ))}
      </div>

      {/* サービス一覧 */}
      <div className="flex flex-col gap-3">
        {activeCategory.services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>

      {/* 注意書き */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
        <p className="text-xs text-gray-500 leading-relaxed">
          ※ 各サービスの公式サイトに移動します。料金・条件は各サービスにてご確認ください。
          クレジットカードの海外旅行保険の付帯条件は、ご利用のカード会社にお問い合わせください。
        </p>
      </div>
    </div>
  );
}
