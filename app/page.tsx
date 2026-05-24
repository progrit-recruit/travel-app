import Link from "next/link";

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
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">✈️ TravelReady</h1>
          <p className="text-sm text-gray-500 mt-0.5">海外旅行オフラインサポート</p>
        </div>
      </header>

      <div className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
        <p className="text-gray-600 mb-6">何をしますか？</p>

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
