"use client";

import { useState } from "react";
import OnboardingGate from "@/components/OnboardingGate";
import PlanTab from "@/components/home/PlanTab";
import MyPageTab from "@/components/home/MyPageTab";

type Tab = "plan" | "mypage";

export default function Home() {
  const [tab, setTab] = useState<Tab>("plan");

  return (
    <main className="flex flex-col min-h-screen bg-gray-50 pb-16">
      <OnboardingGate />

      {/* ── Header ── */}
      <header className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-30">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">✈️ TravelReady</h1>
            <p className="text-xs text-gray-400 mt-0.5">海外旅行オフラインサポート</p>
          </div>
          {tab === "mypage" && (
            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-xl">
              ✈️
            </div>
          )}
        </div>
      </header>

      {/* ── Tab Content ── */}
      <div className="flex-1 overflow-y-auto">
        {tab === "plan" ? <PlanTab /> : <MyPageTab />}
      </div>

      {/* ── Bottom Navigation ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 safe-area-inset-bottom">
        <div className="max-w-lg mx-auto flex">
          <button
            onClick={() => setTab("plan")}
            className={`flex-1 flex flex-col items-center gap-0.5 py-3 transition-colors ${
              tab === "plan" ? "text-indigo-600" : "text-gray-400"
            }`}
          >
            <span className="text-2xl">🌍</span>
            <span className="text-xs font-semibold">Plan</span>
            {tab === "plan" && (
              <span className="absolute bottom-1 w-1 h-1 bg-indigo-500 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setTab("mypage")}
            className={`flex-1 flex flex-col items-center gap-0.5 py-3 transition-colors ${
              tab === "mypage" ? "text-indigo-600" : "text-gray-400"
            }`}
          >
            <span className="text-2xl">👤</span>
            <span className="text-xs font-semibold">My Page</span>
            {tab === "mypage" && (
              <span className="absolute bottom-1 w-1 h-1 bg-indigo-500 rounded-full" />
            )}
          </button>
        </div>
      </nav>
    </main>
  );
}
