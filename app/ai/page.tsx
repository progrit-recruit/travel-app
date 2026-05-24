import Link from "next/link";
import AIChat from "@/components/AIChat";

export default function AIPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <header className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-[2000]">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Link href="/mypage" className="text-gray-400 hover:text-gray-600 text-lg">
            ‹
          </Link>
          <div>
            <h1 className="text-lg font-bold text-gray-900">🤖 AIトラブル相談</h1>
            <p className="text-xs text-gray-400">海外でのトラブルをAIがサポート</p>
          </div>
        </div>
      </header>

      <div className="flex-1 px-4 py-4 max-w-lg mx-auto w-full pb-6">
        <AIChat />
      </div>
    </main>
  );
}
