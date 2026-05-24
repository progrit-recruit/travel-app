"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loadProfile } from "@/lib/user-profile";
import { loadConfirmedTrip, loadTripPlan } from "@/lib/trip-plan";
import { getCountry } from "@/lib/country-data";

const SUPPORT_TOOLS = [
  { href: "/checklist", icon: "✅", label: "チェック\nリスト", bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700" },
  { href: "/translate", icon: "🌐", label: "オフライン\n翻訳", bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700" },
  { href: "/booking", icon: "🔖", label: "予約\nサービス", bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-700" },
  { href: "/map", icon: "🗺️", label: "マップ", bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700" },
  { href: "/ai", icon: "🤖", label: "AIトラブル\n相談", bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700" },
];

/* ── Mock data ─────────────────────────────────── */

const MOCK_PAST_TRIPS = [
  { flag: "🇰🇷", country: "韓国", area: "ソウル", date: "2024.03", days: 4, rating: 5 },
  { flag: "🇫🇷", country: "フランス", area: "パリ", date: "2023.08", days: 7, rating: 5 },
  { flag: "🇹🇭", country: "タイ", area: "バンコク・プーケット", date: "2023.01", days: 6, rating: 4 },
];

const MOCK_ALBUM = [
  { emoji: "🗼", bg: "bg-blue-100", label: "エッフェル塔" },
  { emoji: "🏯", bg: "bg-amber-100", label: "景福宮" },
  { emoji: "🏖️", bg: "bg-cyan-100", label: "プーケット" },
  { emoji: "🌸", bg: "bg-pink-100", label: "桜の季節" },
  { emoji: "🍜", bg: "bg-orange-100", label: "現地グルメ" },
  { emoji: "🌅", bg: "bg-rose-100", label: "夕焼け" },
  { emoji: "⛩️", bg: "bg-red-100", label: "明洞" },
  { emoji: "🎡", bg: "bg-purple-100", label: "ロンドン" },
  { emoji: "🌊", bg: "bg-teal-100", label: "碧い海" },
];

const MOCK_COMMUNITY = [
  {
    id: 1,
    user: "yuki_travel",
    avatar: "🧳",
    destination: "🇮🇹 イタリア・ローマ",
    date: "3日前",
    text: "コロッセオの夕焼けが生涯最高の景色でした。ローマは歩けば歩くほど新しい発見がある街。また絶対来たい！",
    likes: 24,
    comments: 8,
    tags: ["ローマ", "コロッセオ"],
    chatMessages: [
      { from: "yuki_travel", avatar: "🧳", text: "コロッセオは朝一番が空いてておすすめです！", time: "3日前" },
      { from: "tabi_hana", avatar: "🌸", text: "行ってみたかった！何時頃が良いですか？", time: "3日前" },
      { from: "yuki_travel", avatar: "🧳", text: "開場の9時に並ぶと待ち時間ほぼゼロでした😊", time: "2日前" },
    ],
  },
  {
    id: 2,
    user: "hana_world",
    avatar: "🌸",
    destination: "🇬🇷 ギリシャ・サントリーニ",
    date: "1週間前",
    text: "青と白の世界に完全に溶け込んだ5日間。イアの夕日は言葉にできないくらい美しくて、思わず泣きそうになった。",
    likes: 51,
    comments: 13,
    tags: ["サントリーニ", "絶景"],
    chatMessages: [
      { from: "hana_world", avatar: "🌸", text: "イアの夕日ポイントは1時間前から場所取り必須です！", time: "1週間前" },
      { from: "explorer_ken", avatar: "🌍", text: "最高すぎる…私も来年行く予定です", time: "6日前" },
      { from: "hana_world", avatar: "🌸", text: "ぜひ！おすすめのホテルも教えますよ🏨", time: "6日前" },
    ],
  },
  {
    id: 3,
    user: "explorer_ken",
    avatar: "🌍",
    destination: "🇲🇻 モルディブ",
    date: "2週間前",
    text: "水上コテージから見る星空と、朝目覚めたら即ダイビングできる幸福。非日常の極みを体験しました。",
    likes: 87,
    comments: 21,
    tags: ["モルディブ", "ハネムーン", "絶景"],
    chatMessages: [
      { from: "explorer_ken", avatar: "🌍", text: "ベストシーズンは11〜4月です。ぜひ！", time: "2週間前" },
      { from: "yuki_travel", avatar: "🧳", text: "水上コテージって揺れたりしないですか？", time: "13日前" },
      { from: "explorer_ken", avatar: "🌍", text: "全く揺れませんでした！快適すぎて帰りたくなかった笑", time: "13日前" },
    ],
  },
];

const MOCK_DIARY = `2024年3月、ソウルの旅 — 1日目

仁川空港に降り立つと、春の気配が漂っていた。桜がもう少しで咲き始めそうな、そんな予感のする3月末だった。

ARexで明洞に向かいながら、窓の外を流れる韓国の街並みを見ていると、旅が始まった実感がじわじわと湧いてくる。ホテルに荷物を置いてすぐ、明洞の屋台へ飛び込んだ。チーズドッグをひとつ手にとって、熱々のまま頬張る。うまい。

夜、Nソウルタワーから見た夜景は、街全体が息をしているようだった。韓国語の歌が遠くから聞こえてきて、なぜか胸が締め付けられた。`;

/* ── Sub-components ─────────────────────────────── */

function StarRating({ n }: { n: number }) {
  return (
    <span className="text-amber-400 text-xs">
      {"★".repeat(n)}{"☆".repeat(5 - n)}
    </span>
  );
}

function SectionHeader({ emoji, title, sub }: { emoji: string; title: string; sub?: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-lg">{emoji}</span>
      <div>
        <p className="text-sm font-bold text-gray-900">{title}</p>
        {sub && <p className="text-xs text-gray-400">{sub}</p>}
      </div>
    </div>
  );
}

/* ── Chat slide-up panel ────────────────────────── */

type CommunityPost = typeof MOCK_COMMUNITY[number];

function ChatPanel({ post, onClose }: { post: CommunityPost; onClose: () => void }) {
  const [input, setInput] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    setSent(true);
    setTimeout(() => setSent(false), 2000);
    setInput("");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl max-w-lg mx-auto shadow-2xl">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-4 pb-3 border-b border-gray-100 flex items-center gap-3">
          <span className="text-2xl">{post.avatar}</span>
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-900">{post.user}</p>
            <p className="text-xs text-gray-400">{post.destination}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 text-xl px-1">✕</button>
        </div>

        {/* Messages */}
        <div className="px-4 py-3 space-y-3 max-h-60 overflow-y-auto">
          {post.chatMessages.map((msg, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-xl shrink-0">{msg.avatar}</span>
              <div className="flex-1">
                <div className="flex items-baseline gap-1.5">
                  <p className="text-xs font-semibold text-gray-700">{msg.from}</p>
                  <p className="text-xs text-gray-400">{msg.time}</p>
                </div>
                <div className="mt-0.5 bg-gray-50 rounded-xl rounded-tl-none px-3 py-2">
                  <p className="text-sm text-gray-700">{msg.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Demo badge */}
        <div className="px-4 pb-1">
          <p className="text-xs text-center text-amber-500 bg-amber-50 rounded-lg py-1">
            ✨ デモ表示中 — チャット機能は近日公開予定
          </p>
        </div>

        {/* Input */}
        <div className="px-4 pb-6 pt-2 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="メッセージを入力..."
            className="flex-1 px-4 py-2.5 bg-gray-100 rounded-xl text-sm outline-none focus:bg-gray-50 border border-transparent focus:border-indigo-300"
            onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
          />
          <button
            onClick={handleSend}
            className="px-4 py-2.5 bg-indigo-500 text-white text-sm font-semibold rounded-xl active:scale-95 transition-transform"
          >
            {sent ? "✓" : "送信"}
          </button>
        </div>
      </div>
    </>
  );
}

/* ── AI Diary section ───────────────────────────── */

function DiarySection() {
  const [generating, setGenerating] = useState(false);
  const [showDiary, setShowDiary] = useState(true);

  const handleGenerate = () => {
    setGenerating(true);
    setShowDiary(false);
    setTimeout(() => {
      setGenerating(false);
      setShowDiary(true);
    }, 1800);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <div className="px-4 pt-4 pb-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🤖</span>
          <div>
            <p className="text-sm font-bold text-gray-900">AI日記作成</p>
            <p className="text-xs text-gray-400">写真・旅程から日記を自動生成</p>
          </div>
        </div>
        <span className="text-xs bg-indigo-50 text-indigo-600 font-medium px-2 py-0.5 rounded-full">Demo</span>
      </div>

      {/* Fake photo upload */}
      <div className="px-4 py-3 flex gap-2">
        {["📸", "🖼️", "➕"].map((icon, i) => (
          <div
            key={i}
            className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl cursor-pointer transition-colors ${
              i < 2 ? "bg-gray-100" : "bg-gray-50 border-2 border-dashed border-gray-200"
            }`}
          >
            {icon}
          </div>
        ))}
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="flex-1 h-14 rounded-xl bg-indigo-500 text-white text-xs font-semibold disabled:opacity-60 flex items-center justify-center gap-1 active:scale-95 transition-transform"
        >
          {generating ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              生成中...
            </>
          ) : (
            "✨ 日記を生成"
          )}
        </button>
      </div>

      {/* Diary text */}
      {showDiary && !generating && (
        <div className="px-4 pb-4">
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-xs font-semibold text-amber-700">📖 AI生成日記</span>
              <span className="text-xs text-amber-500">· ソウル旅行 2024.03</span>
            </div>
            <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">{MOCK_DIARY}</p>
          </div>
          <div className="flex gap-2 mt-2">
            <button className="flex-1 py-2 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-xl active:scale-95">
              ✏️ 編集する
            </button>
            <button className="flex-1 py-2 text-xs text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-xl active:scale-95">
              📤 シェアする
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main component ─────────────────────────────── */

export default function MyPageTab() {
  const router = useRouter();
  const [chatPost, setChatPost] = useState<CommunityPost | null>(null);
  const [tripData, setTripData] = useState<{
    type: "confirmed" | "planning" | "none";
    flag?: string;
    name?: string;
    area?: string;
    days?: number;
    cost?: number;
  }>({ type: "none" });

  // Load trip data from localStorage
  useEffect(() => {
    const confirmed = loadConfirmedTrip();
    if (confirmed?.destination) {
      const c = getCountry(confirmed.destination);
      setTripData({
        type: "confirmed",
        flag: c?.flag,
        name: c?.name,
        area: confirmed.region ?? undefined,
        days: confirmed.tripDays,
        cost: confirmed.itinerary?.total_cost,
      });
      return;
    }
    const plan = loadTripPlan();
    if (plan?.destination) {
      const c = getCountry(plan.destination);
      setTripData({
        type: "planning",
        flag: c?.flag,
        name: c?.name,
        area: plan.region ?? undefined,
        days: plan.tripDays,
      });
    }
  }, []);

  const profile = loadProfile();
  const displayName = profile?.companion === "solo" ? "ひとり旅人" : "旅行者";

  return (
    <div className="flex-1 max-w-lg mx-auto w-full px-4 py-5 flex flex-col gap-5">

      {/* ── Profile header ── */}
      <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-3xl border-2 border-white/40">
            ✈️
          </div>
          <div className="flex-1">
            <p className="text-lg font-bold">{displayName} さん</p>
            <p className="text-xs text-indigo-200 mt-0.5">TravelReady メンバー</p>
          </div>
          <button
            onClick={() => router.push("/onboarding")}
            className="text-xs bg-white/20 border border-white/30 px-3 py-1.5 rounded-xl font-medium"
          >
            編集
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "訪問国", value: "3", icon: "🌍" },
            { label: "旅の記録", value: "3", icon: "📖" },
            { label: "AI日記", value: "5", icon: "✨" },
          ].map((s) => (
            <div key={s.label} className="bg-white/15 rounded-xl py-2 text-center">
              <p className="text-lg font-bold">{s.value}</p>
              <p className="text-xs text-indigo-200">{s.icon} {s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 計画中の旅程 ── */}
      <div>
        <SectionHeader emoji="📅" title="計画中の旅程" sub="最新のトリッププラン" />
        {tripData.type === "confirmed" && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{tripData.flag}</span>
              <div>
                <p className="font-bold text-gray-900">{tripData.name} · {tripData.area}</p>
                <p className="text-xs text-emerald-600 font-medium">✅ 予約確定済み · {tripData.days}日間</p>
              </div>
            </div>
            {tripData.cost && (
              <p className="text-sm font-semibold text-gray-700">合計 ¥{tripData.cost.toLocaleString()}</p>
            )}
          </div>
        )}
        {tripData.type === "planning" && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 flex items-center gap-3">
            <span className="text-3xl">{tripData.flag}</span>
            <div className="flex-1">
              <p className="font-bold text-gray-900">{tripData.name} · {tripData.area}</p>
              <p className="text-xs text-indigo-600 font-medium">⏳ 計画中 · {tripData.days}日間</p>
            </div>
            <button
              onClick={() => router.push("/plan")}
              className="text-xs bg-indigo-500 text-white px-3 py-1.5 rounded-xl font-semibold"
            >
              続きへ
            </button>
          </div>
        )}
        {tripData.type === "none" && (
          <div className="bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-5 flex flex-col items-center gap-2">
            <span className="text-3xl">🌏</span>
            <p className="text-sm text-gray-500">旅程がまだありません</p>
            <button
              onClick={() => router.push("/plan")}
              className="text-xs bg-indigo-500 text-white px-4 py-2 rounded-xl font-semibold mt-1"
            >
              旅を計画する →
            </button>
          </div>
        )}
      </div>

      {/* ── 旅のサポートツール ── */}
      <div>
        <SectionHeader emoji="🛠️" title="旅のサポートツール" sub="旅先でいつでも使える機能" />
        <div className="grid grid-cols-5 gap-2">
          {SUPPORT_TOOLS.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl border ${t.bg} ${t.border} active:scale-95 transition-transform`}
            >
              <span className="text-2xl">{t.icon}</span>
              <p className={`text-center text-xs font-medium leading-tight whitespace-pre-line ${t.text}`}>
                {t.label}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* ── 旅のアルバム ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <SectionHeader emoji="📸" title="旅のアルバム" />
          <span className="text-xs text-indigo-500 font-medium">Demo</span>
        </div>
        <div className="overflow-x-auto pb-1 no-scrollbar">
          <div className="flex gap-2" style={{ width: "max-content" }}>
            {MOCK_ALBUM.map((p, i) => (
              <div
                key={i}
                className={`w-24 h-24 rounded-2xl ${p.bg} flex flex-col items-center justify-center gap-1 shrink-0 cursor-pointer active:scale-95 transition-transform`}
              >
                <span className="text-3xl">{p.emoji}</span>
                <p className="text-xs text-gray-500 font-medium text-center px-1 leading-tight">{p.label}</p>
              </div>
            ))}
            {/* 追加ボタン */}
            <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 shrink-0 cursor-pointer active:scale-95 transition-transform bg-gray-50">
              <span className="text-2xl text-gray-300">＋</span>
              <p className="text-xs text-gray-400">追加</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── これまでの旅 ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <SectionHeader emoji="🗺️" title="これまでの旅" />
          <span className="text-xs text-indigo-500 font-medium">Demo</span>
        </div>
        <div className="flex flex-col gap-2">
          {MOCK_PAST_TRIPS.map((trip, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-2xl px-4 py-3 flex items-center gap-3 active:scale-[0.98] transition-transform cursor-pointer"
            >
              <span className="text-3xl shrink-0">{trip.flag}</span>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-bold text-gray-900">{trip.country}</p>
                  <span className="text-xs text-gray-400">·</span>
                  <p className="text-sm text-gray-600">{trip.area}</p>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <StarRating n={trip.rating} />
                  <span className="text-xs text-gray-400">{trip.date} · {trip.days}日間</span>
                </div>
              </div>
              <span className="text-gray-300 text-lg">›</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── AI日記作成 ── */}
      <DiarySection />

      {/* ── みんなの記録 ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <SectionHeader emoji="👥" title="みんなの記録" sub="旅人コミュニティ" />
          <span className="text-xs text-indigo-500 font-medium">Demo</span>
        </div>
        <div className="flex flex-col gap-3">
          {MOCK_COMMUNITY.map((post) => (
            <div
              key={post.id}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden"
            >
              {/* Post header */}
              <div className="px-4 pt-4 pb-2 flex items-center gap-2.5">
                <span className="text-2xl">{post.avatar}</span>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">{post.user}</p>
                  <p className="text-xs text-gray-400">{post.destination} · {post.date}</p>
                </div>
              </div>

              {/* Fake photo area */}
              <div className="mx-4 mb-3 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 h-28 flex items-center justify-center">
                <span className="text-5xl opacity-60">
                  {post.id === 1 ? "🏛️" : post.id === 2 ? "🌅" : "🌊"}
                </span>
              </div>

              {/* Text */}
              <div className="px-4 pb-3">
                <p className="text-sm text-gray-700 leading-relaxed">{post.text}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="px-4 pb-4 flex items-center gap-4">
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span>❤️ {post.likes}</span>
                  <span>💬 {post.comments}</span>
                </div>
                <div className="flex-1" />
                <button
                  onClick={() => setChatPost(post)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-500 text-white text-xs font-semibold rounded-xl active:scale-95 transition-transform"
                >
                  💬 チャットで交流
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom spacer for nav bar */}
      <div className="h-4" />

      {/* Chat panel */}
      {chatPost && (
        <ChatPanel post={chatPost} onClose={() => setChatPost(null)} />
      )}
    </div>
  );
}
