import Link from "next/link";
import ChecklistClient from "@/components/ChecklistClient";

export default function ChecklistPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <header className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-gray-600 text-lg">
            ‹
          </Link>
          <div>
            <h1 className="text-lg font-bold text-gray-900">✅ 旅行前チェックリスト</h1>
            <p className="text-xs text-gray-400">チェックした内容は自動保存されます</p>
          </div>
        </div>
      </header>

      <div className="flex-1 px-4 py-4 max-w-lg mx-auto w-full">
        <ChecklistClient />
      </div>
    </main>
  );
}
