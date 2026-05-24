import Link from "next/link";

const STEPS = [
  { n: 1, icon: "🌍", title: "3D地球儀で行き先を選ぶ" },
  { n: 2, icon: "📍", title: "エリア・旅スタイルを絞り込む" },
  { n: 3, icon: "🎯", title: "こだわりを入力する" },
  { n: 4, icon: "🤖", title: "AIが旅程を自動生成" },
  { n: 5, icon: "✅", title: "予約内容を確認・確定" },
];

export default function PlanTab() {
  return (
    <div className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
      {/* メインCTA */}
      <Link
        href="/plan"
        className="flex items-center gap-4 p-5 rounded-2xl border-2 border-indigo-300 bg-gradient-to-br from-indigo-50 to-blue-50 mb-5 transition-transform active:scale-95"
      >
        <div className="w-14 h-14 rounded-2xl bg-indigo-500 flex items-center justify-center text-3xl shadow-md">
          🌍
        </div>
        <div className="flex-1">
          <p className="font-bold text-gray-900 text-base">旅を計画する</p>
          <p className="text-sm text-indigo-600 font-medium">AIが旅程を自動生成 →</p>
          <p className="text-xs text-gray-400 mt-0.5">行き先・こだわり・予算から最適プラン</p>
        </div>
      </Link>

      {/* 計画の流れ */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <p className="text-xs font-bold text-gray-500">📋 5ステップで旅程が完成</p>
        </div>
        {STEPS.map((s, i) => (
          <div
            key={s.n}
            className={`flex items-center gap-3 px-4 py-3 ${
              i < STEPS.length - 1 ? "border-b border-gray-50" : ""
            }`}
          >
            <span className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center shrink-0">
              {s.n}
            </span>
            <span className="text-lg leading-none">{s.icon}</span>
            <span className="text-sm text-gray-700">{s.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
