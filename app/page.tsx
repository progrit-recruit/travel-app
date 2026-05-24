import Link from "next/link";
import OnboardingGate from "@/components/OnboardingGate";

const features = [
  {
    href: "/checklist",
    icon: "✅",
    title: "旅行前チェックリスト",
    description: "必要な準備を漏れなく確認",
    color: "bg-emerald-50 border-emerald-200",
    iconBg: "bg-emerald-100",
  },
  {
    href: "/translate",
    icon: "🌐",
    title: "オフライン翻訳",
    description: "ネット不要で言語を翻訳",
    color: "bg-blue-50 border-blue-200",
    iconBg: "bg-blue-100",
  },
  {
    href: "/booking",
    icon: "🔖",
    title: "予約サービス一覧",
    description: "ホテル・eSIM・保険・航空券・両替",
    color: "bg-rose-50 border-rose-200",
    iconBg: "bg-rose-100",
  },
  {
    href: "/map",
    icon: "🗺️",
    title: "マップ",
    description: "見たエリアは自動オフライン保存",
    color: "bg-orange-50 border-orange-200",
    iconBg: "bg-orange-100",
  },
  {
    href: "/ai",
    icon: "🤖",
    title: "AIトラブル相談",
    description: "困ったときにAIに相談",
    color: "bg-purple-50 border-purple-200",
    iconBg: "bg-purple-100",
  },
];

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <OnboardingGate />
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">✈️ TravelReady</h1>
          <p className="text-sm text-gray-500 mt-0.5">海外旅行オフラインサポート</p>
        </div>
      </header>

      <div className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
        {/* メインCTA：旅を計画する */}
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

        <p className="text-gray-500 text-sm mb-3">旅のサポートツール</p>

        <div className="flex flex-col gap-3">
          {features.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              className={`flex items-center gap-4 p-4 rounded-2xl border transition-transform active:scale-95 ${f.color}`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${f.iconBg}`}>
                {f.icon}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{f.title}</p>
                <p className="text-sm text-gray-500">{f.description}</p>
              </div>
              <span className="text-gray-400">›</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
