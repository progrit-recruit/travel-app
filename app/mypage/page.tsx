import Link from "next/link";
import MyPageTab from "@/components/home/MyPageTab";

export default function MyPage() {
  return (
    <main className="flex flex-col min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-30">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Link
            href="/"
            className="w-8 h-8 flex items-center justify-center text-gray-400 text-xl rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="ホームに戻る"
          >
            ‹
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900">My Page</h1>
          </div>
          <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-xl">
            ✈️
          </div>
        </div>
      </header>

      {/* Content */}
      <MyPageTab />
    </main>
  );
}
