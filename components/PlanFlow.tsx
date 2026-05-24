"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  emptyTripPlan,
  loadTripPlan,
  saveTripPlan,
  confirmTrip,
  type TripPlan,
  type Itinerary,
} from "@/lib/trip-plan";
import { isOnboardingComplete } from "@/lib/user-profile";
import { getCountry } from "@/lib/country-data";

// SSR不要なコンポーネントを動的インポート（マップはLeafletを使うため）
const Step1Map = dynamic(() => import("@/components/plan/Step1Map"), { ssr: false });
import Step2Narrow from "@/components/plan/Step2Narrow";
import Step3Interests from "@/components/plan/Step3Interests";
import Step4Plan from "@/components/plan/Step4Plan";
import Step5Booking from "@/components/plan/Step5Booking";

const STEP_LABELS = [
  "行き先マップ",
  "行き先の絞り込み",
  "こだわり入力",
  "AIプラン提案",
  "予約確認",
];
const TOTAL = 5;

export default function PlanFlow() {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0〜4
  const [plan, setPlan] = useState<TripPlan>(emptyTripPlan);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (!isOnboardingComplete()) {
      router.replace("/onboarding");
      return;
    }
    const saved = loadTripPlan();
    if (saved) setPlan(saved);
  }, [router]);

  // ステップが変わったら保存
  useEffect(() => {
    saveTripPlan(plan);
  }, [plan]);

  const update = (patch: Partial<TripPlan>) =>
    setPlan((p) => ({ ...p, ...patch }));

  const next = () => setStep((s) => Math.min(s + 1, TOTAL - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const handleConfirm = () => {
    confirmTrip(plan);
    setConfirmed(true);
  };

  // 確定後の完了画面
  if (confirmed) {
    const country = getCountry(plan.destination ?? "");
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6 text-center">
        <div className="text-7xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">予約完了！</h1>
        <p className="text-base text-gray-600 mb-1">
          {country?.flag} {country?.name}の旅が確定しました
        </p>
        <p className="text-sm text-gray-400 mb-8 leading-relaxed">
          旅のしおりはホーム画面から<br />いつでも確認できます
        </p>
        <div className="flex flex-col gap-2 w-full max-w-xs">
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 text-xs text-left">
            <p className="font-semibold text-indigo-700 mb-1.5">📡 出発前の準備チェック</p>
            <p className="text-gray-600">• eSIMの設定（出発3日前まで）</p>
            <p className="text-gray-600">• 海外旅行保険の確認</p>
            <p className="text-gray-600">• チェックリストの確認</p>
          </div>
          <button
            onClick={() => router.replace("/")}
            className="w-full py-3.5 bg-indigo-500 text-white font-semibold rounded-2xl active:scale-[0.98] transition-all"
          >
            ホームに戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white px-4 pt-4 pb-3 border-b border-gray-100 sticky top-0 z-[1500]">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-3">
            {step > 0 ? (
              <button onClick={back} className="text-sm text-gray-400 hover:text-gray-600 py-1">
                ‹ 戻る
              </button>
            ) : (
              <button onClick={() => router.push("/")} className="text-sm text-gray-400 hover:text-gray-600 py-1">
                ‹ ホーム
              </button>
            )}
            <div className="text-center">
              <span className="text-xs font-medium text-gray-500">{STEP_LABELS[step]}</span>
            </div>
            <span className="text-xs font-medium text-gray-400">{step + 1} / {TOTAL}</span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${((step + 1) / TOTAL) * 100}%` }}
            />
          </div>
        </div>
      </header>

      {/* コンテンツ */}
      <div className={`flex-1 max-w-lg mx-auto w-full ${step === 0 ? "" : "px-4 py-5"}`}>
        {step === 0 && (
          <Step1Map
            selectedDestinations={plan.selectedDestinations}
            onToggle={(code) =>
              update({
                selectedDestinations: plan.selectedDestinations.includes(code)
                  ? plan.selectedDestinations.filter((c) => c !== code)
                  : [...plan.selectedDestinations, code],
              })
            }
            onNext={next}
          />
        )}
        {step === 1 && (
          <Step2Narrow
            selectedDestinations={plan.selectedDestinations}
            destination={plan.destination}
            tripType={plan.tripType}
            tripDays={plan.tripDays}
            onSelectDestination={(code) => update({ destination: code })}
            onSelectTripType={(type, days) => update({ tripType: type, tripDays: days })}
            onNext={next}
            onBack={back}
          />
        )}
        {step === 2 && (
          <Step3Interests
            destination={plan.destination!}
            interests={plan.interests}
            freeText={plan.freeText}
            extractedSpots={plan.extractedSpots}
            onUpdateInterests={(v) => update({ interests: v })}
            onUpdateFreeText={(v) => update({ freeText: v })}
            onUpdateExtractedSpots={(v) => update({ extractedSpots: v })}
            onNext={next}
          />
        )}
        {step === 3 && (
          <Step4Plan
            plan={plan}
            onUpdateItinerary={(itinerary: Itinerary) => update({ itinerary })}
            onNext={next}
          />
        )}
        {step === 4 && plan.itinerary && (
          <Step5Booking plan={plan} onConfirm={handleConfirm} />
        )}
      </div>
    </div>
  );
}
