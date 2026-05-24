import Link from "next/link";
import OnboardingGate from "@/components/OnboardingGate";

export default function Home() {
  return (
    <main
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #5ba3c9 0%, #7ebfda 18%, #a8d8ea 40%, #c6e8f0 62%, #e2f3f8 80%, #f0f8fb 100%)",
      }}
    >
      <OnboardingGate />

      {/* Decorative birds */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <span className="absolute top-14 left-10 text-white/70 text-sm">🕊</span>
        <span className="absolute top-10 left-[40%] text-white/50 text-xs">🕊</span>
        <span className="absolute top-20 right-14 text-white/60 text-xs">🕊</span>
        <span className="absolute top-28 left-[60%] text-white/40 text-[10px]">🕊</span>
        <span className="absolute top-8 right-[35%] text-white/50 text-[11px]">🕊</span>
        <span className="absolute top-36 left-16 text-white/30 text-[10px]">🕊</span>
      </div>

      {/* Hero section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-20 pb-10 text-center">
        {/* Logo */}
        <div className="mb-1">
          <h1
            className="text-6xl font-bold text-slate-800 tracking-tight"
            style={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontStyle: "italic" }}
          >
            fitrip
          </h1>
          <p className="text-sm text-slate-600 mt-2 tracking-[0.3em]">ー フィトリップ ー</p>
        </div>

        {/* Divider */}
        <div className="w-16 h-px bg-slate-400/40 my-6" />

        {/* Tagline */}
        <p className="text-xl font-semibold text-slate-800 leading-relaxed mb-3">
          あなたの理想の旅を、<br />自由にリメイクしよう
        </p>
        <p className="text-sm text-slate-600 leading-relaxed max-w-xs">
          行き先・こだわり・スタイルに合わせて<br />AIが最適な旅程を提案します
        </p>
      </div>

      {/* Bottom CTA cards */}
      <div className="px-5 pb-14 flex flex-col gap-3 max-w-sm mx-auto w-full">
        {/* Plan button */}
        <Link
          href="/plan"
          className="flex items-center gap-4 p-5 bg-white rounded-2xl shadow-md active:scale-[0.97] transition-transform"
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-2xl shrink-0">
            🧳
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 text-sm">プランを自由にカスタマイズ</p>
            <p className="text-xs text-indigo-500 mt-0.5 font-medium">3D地球儀で旅先を選ぶ →</p>
          </div>
        </Link>

        {/* My Page button */}
        <Link
          href="/mypage"
          className="flex items-center gap-4 p-5 bg-white rounded-2xl shadow-md active:scale-[0.97] transition-transform"
        >
          <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center text-2xl shrink-0">
            ❤️
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 text-sm">あなただけの旅の形に</p>
            <p className="text-xs text-rose-500 mt-0.5 font-medium">マイページ・旅の記録 →</p>
          </div>
        </Link>
      </div>
    </main>
  );
}
