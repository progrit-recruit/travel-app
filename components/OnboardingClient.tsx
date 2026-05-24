"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  emptyProfile,
  isOnboardingComplete,
  saveProfile,
  type UserProfile,
} from "@/lib/user-profile";

// ────────────────────────────────────────────
// 選択肢データ
// ────────────────────────────────────────────

type Opt = { label: string; value: string; sub?: string };

const AGE_OPTIONS: Opt[] = [
  { label: "10代", value: "teens" },
  { label: "20代", value: "20s" },
  { label: "30代", value: "30s" },
  { label: "40代", value: "40s" },
  { label: "50代", value: "50s" },
  { label: "60代以上", value: "60s+" },
];

const GENDER_OPTIONS: Opt[] = [
  { label: "男性", value: "male" },
  { label: "女性", value: "female" },
  { label: "その他", value: "other" },
  { label: "回答しない", value: "prefer_not_to_say" },
];

const EXPERIENCE_OPTIONS: Opt[] = [
  { label: "初めて", value: "first", sub: "海外旅行は初挑戦" },
  { label: "1〜2回", value: "1-2", sub: "少し経験あり" },
  { label: "3〜5回", value: "3-5", sub: "旅慣れてきた" },
  { label: "6回以上", value: "6+", sub: "旅のベテラン" },
];

const ACTIVE_TIME_OPTIONS: Opt[] = [
  { label: "🌅 朝型", value: "morning", sub: "早起きして観光" },
  { label: "🌙 夜型", value: "night", sub: "夜遅くまで遊ぶ" },
  { label: "🌓 どちらでも", value: "either", sub: "その日次第" },
];

const PACE_OPTIONS: Opt[] = [
  { label: "ゆったり", value: "slow", sub: "1日1〜2スポット" },
  { label: "標準", value: "standard", sub: "1日3〜4スポット" },
  { label: "アクティブ", value: "active", sub: "1日5スポット以上" },
];

const INTEREST_OPTIONS: Opt[] = [
  { label: "🍜 グルメ", value: "food" },
  { label: "🏔️ 自然・景色", value: "nature" },
  { label: "🏛️ 歴史・文化", value: "history" },
  { label: "🛍️ ショッピング", value: "shopping" },
  { label: "🏄 アクティビティ", value: "activities" },
  { label: "📸 写真映え", value: "photo" },
  { label: "🤝 現地交流", value: "local_interaction" },
  { label: "😌 リラックス", value: "relaxation" },
];

const DISLIKE_OPTIONS: Opt[] = [
  { label: "長時間移動", value: "long_travel" },
  { label: "人混み", value: "crowds" },
  { label: "早朝出発", value: "early_departure" },
  { label: "深夜行動", value: "late_night" },
  { label: "歩き回る観光", value: "walking_heavy" },
];

const FOOD_OPTIONS: Opt[] = [
  { label: "和食", value: "japanese" },
  { label: "洋食", value: "western" },
  { label: "中華", value: "chinese" },
  { label: "エスニック", value: "ethnic" },
  { label: "ローカルフード重視", value: "local" },
  { label: "こだわらない", value: "no_preference" },
];

const ALLERGY_OPTIONS: Opt[] = [
  { label: "小麦", value: "wheat" },
  { label: "卵", value: "egg" },
  { label: "乳製品", value: "dairy" },
  { label: "そば", value: "buckwheat" },
  { label: "落花生", value: "peanut" },
  { label: "えび", value: "shrimp" },
  { label: "かに", value: "crab" },
  { label: "ベジタリアン", value: "vegetarian" },
  { label: "ヴィーガン", value: "vegan" },
  { label: "ハラル", value: "halal" },
  { label: "その他", value: "other" },
];

const BUDGET_OPTIONS: Opt[] = [
  { label: "〜10万円", value: "0-100000", sub: "格安〜標準" },
  { label: "10〜20万円", value: "100000-200000", sub: "標準的な旅行" },
  { label: "20〜30万円", value: "200000-300000", sub: "少し余裕あり" },
  { label: "30〜50万円", value: "300000-500000", sub: "ゆとりの旅" },
  { label: "50万円以上", value: "500000+", sub: "贅沢な旅" },
];

const BUDGET_PRIORITY_OPTIONS: Opt[] = [
  { label: "とにかく安く", value: "budget" },
  { label: "バランス重視", value: "balanced" },
  { label: "ちょっと贅沢に", value: "comfort" },
  { label: "高級志向", value: "luxury" },
];

const COMPANION_OPTIONS: Opt[] = [
  { label: "🧍 一人", value: "solo" },
  { label: "❤️ カップル・夫婦", value: "couple" },
  { label: "👫 友人", value: "friends" },
  { label: "👨‍👩‍👧 家族（子連れ）", value: "family_kids" },
  { label: "👫 家族（大人のみ）", value: "family_adults" },
  { label: "👥 グループ", value: "group" },
];

// ────────────────────────────────────────────
// サブコンポーネント
// ────────────────────────────────────────────

function SingleSelect({
  options,
  value,
  onChange,
  cols = 2,
}: {
  options: Opt[];
  value: string | null;
  onChange: (v: string) => void;
  cols?: 2 | 3;
}) {
  return (
    <div className={`grid gap-2 ${cols === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`p-3 rounded-xl border-2 text-sm font-medium text-left transition-all active:scale-95 ${
            value === opt.value
              ? "border-indigo-500 bg-indigo-50 text-indigo-700"
              : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
          }`}
        >
          <div>{opt.label}</div>
          {opt.sub && (
            <div className="text-xs font-normal text-gray-400 mt-0.5">{opt.sub}</div>
          )}
        </button>
      ))}
    </div>
  );
}

function MultiSelect({
  options,
  values,
  onChange,
}: {
  options: Opt[];
  values: string[];
  onChange: (v: string[]) => void;
}) {
  const toggle = (val: string) =>
    onChange(
      values.includes(val) ? values.filter((v) => v !== val) : [...values, val]
    );

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => toggle(opt.value)}
          className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all active:scale-95 ${
            values.includes(opt.value)
              ? "border-indigo-500 bg-indigo-50 text-indigo-700"
              : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function SectionLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <p className="text-sm font-semibold text-gray-600 mb-2">
      {children}
      {required && <span className="text-indigo-500 ml-1">*</span>}
    </p>
  );
}

function StepHeading({ title, note }: { title: string; note?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-900 leading-snug whitespace-pre-line">
        {title}
      </h2>
      {note && <p className="text-xs text-gray-400 mt-1">※ {note}</p>}
    </div>
  );
}

// ────────────────────────────────────────────
// メインコンポーネント
// ────────────────────────────────────────────

const TOTAL_STEPS = 7;

export default function OnboardingClient() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<UserProfile>(emptyProfile);

  useEffect(() => {
    if (isOnboardingComplete()) {
      router.replace("/");
    }
  }, [router]);

  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS + 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const isNextDisabled =
    (step === 1 && !profile.age_group) ||
    (step === 6 && !profile.budget.range);

  // スキップ可能なステップ（必須項目なし、かつデフォルト値なし）
  const canSkip = [2, 4, 5, 7].includes(step);

  const handleComplete = () => {
    saveProfile(profile);
    router.replace("/");
  };

  // プロフィール更新ヘルパー
  const set = <K extends keyof UserProfile>(key: K, val: UserProfile[K]) =>
    setProfile((p) => ({ ...p, [key]: val }));

  const setStyle = <K extends keyof UserProfile["travel_style"]>(
    key: K,
    val: UserProfile["travel_style"][K]
  ) =>
    setProfile((p) => ({
      ...p,
      travel_style: { ...p.travel_style, [key]: val },
    }));

  const setFood = <K extends keyof UserProfile["food"]>(
    key: K,
    val: UserProfile["food"][K]
  ) =>
    setProfile((p) => ({ ...p, food: { ...p.food, [key]: val } }));

  const setBudget = <K extends keyof UserProfile["budget"]>(
    key: K,
    val: UserProfile["budget"][K]
  ) =>
    setProfile((p) => ({ ...p, budget: { ...p.budget, [key]: val } }));

  // ────── ステップコンテンツ ──────
  const renderContent = () => {
    switch (step) {
      // ウェルカム
      case 0:
        return (
          <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
            <div className="text-7xl mb-6">✈️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 leading-snug">
              旅のプロフィールを<br />作りましょう
            </h1>
            <p className="text-sm text-gray-500 mb-4">全7問・約2分で完了します</p>
            <div className="bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 mb-8 text-left max-w-xs">
              <p className="text-xs text-gray-500 leading-relaxed">
                🔒 この情報はあなた専用の旅程作成にのみ使用されます。
                性別・旅行経験などはスキップ可能です。
              </p>
            </div>
            <button
              onClick={next}
              className="w-full max-w-xs py-4 bg-indigo-500 text-white font-semibold rounded-2xl active:scale-[0.98] transition-all"
            >
              始める →
            </button>
            <button
              onClick={handleComplete}
              className="mt-3 text-sm text-gray-400 py-2"
            >
              スキップしてアプリを使う
            </button>
          </div>
        );

      // STEP 1: 年代 + 性別
      case 1:
        return (
          <>
            <StepHeading title={"まずあなたのことを\n教えてください"} note="年代のみ必須です" />
            <div className="flex flex-col gap-6">
              <div>
                <SectionLabel required>年代</SectionLabel>
                <SingleSelect
                  options={AGE_OPTIONS}
                  value={profile.age_group}
                  onChange={(v) => set("age_group", v)}
                  cols={3}
                />
              </div>
              <div>
                <SectionLabel>性別（任意）</SectionLabel>
                <SingleSelect
                  options={GENDER_OPTIONS}
                  value={profile.gender}
                  onChange={(v) => set("gender", v)}
                />
              </div>
            </div>
          </>
        );

      // STEP 2: 旅行経験
      case 2:
        return (
          <>
            <StepHeading title={"海外旅行の経験は\nありますか？"} />
            <SingleSelect
              options={EXPERIENCE_OPTIONS}
              value={profile.travel_experience}
              onChange={(v) => set("travel_experience", v)}
            />
          </>
        );

      // STEP 3: 活動時間帯 + ペース（デフォルト値あり）
      case 3:
        return (
          <>
            <StepHeading
              title={"あなたの旅の\nスタイルは？"}
              note="よく当てはまるものが選択されています。変更がなければそのまま次へ"
            />
            <div className="flex flex-col gap-6">
              <div>
                <SectionLabel>活動時間帯</SectionLabel>
                <SingleSelect
                  options={ACTIVE_TIME_OPTIONS}
                  value={profile.travel_style.active_time}
                  onChange={(v) => setStyle("active_time", v)}
                  cols={3}
                />
              </div>
              <div>
                <SectionLabel>移動のペース</SectionLabel>
                <SingleSelect
                  options={PACE_OPTIONS}
                  value={profile.travel_style.pace}
                  onChange={(v) => setStyle("pace", v)}
                  cols={3}
                />
              </div>
            </div>
          </>
        );

      // STEP 4: こだわり + 苦手
      case 4:
        return (
          <>
            <StepHeading title={"旅のこだわりを\n教えてください"} />
            <div className="flex flex-col gap-6">
              <div>
                <SectionLabel>こだわりたいポイント（複数選択可）</SectionLabel>
                <MultiSelect
                  options={INTEREST_OPTIONS}
                  values={profile.travel_style.interests}
                  onChange={(v) => setStyle("interests", v)}
                />
              </div>
              <div>
                <SectionLabel>苦手なこと（複数選択可）</SectionLabel>
                <MultiSelect
                  options={DISLIKE_OPTIONS}
                  values={profile.travel_style.dislikes}
                  onChange={(v) => setStyle("dislikes", v)}
                />
              </div>
            </div>
          </>
        );

      // STEP 5: 食事 + アレルギー
      case 5:
        return (
          <>
            <StepHeading title={"食事について\n教えてください"} />
            <div className="flex flex-col gap-6">
              <div>
                <SectionLabel>食事スタイル（複数選択可）</SectionLabel>
                <MultiSelect
                  options={FOOD_OPTIONS}
                  values={profile.food.preferences}
                  onChange={(v) => setFood("preferences", v)}
                />
              </div>
              <div>
                <SectionLabel>アレルギー・食事制限（複数選択可）</SectionLabel>
                <MultiSelect
                  options={ALLERGY_OPTIONS}
                  values={profile.food.allergies}
                  onChange={(v) => {
                    setFood("allergies", v);
                    if (!v.includes("other")) setFood("restrictions_note", "");
                  }}
                />
                {profile.food.allergies.includes("other") && (
                  <textarea
                    className="mt-3 w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-indigo-400 resize-none"
                    rows={2}
                    placeholder="その他のアレルギーや食事制限を入力..."
                    value={profile.food.restrictions_note}
                    onChange={(e) => setFood("restrictions_note", e.target.value)}
                  />
                )}
              </div>
            </div>
          </>
        );

      // STEP 6: 予算（必須）
      case 6:
        return (
          <>
            <StepHeading
              title={"旅行の予算は\nどのくらいですか？"}
              note="予算規模は必須です（航空券・ホテル含む、1人あたり）"
            />
            <div className="flex flex-col gap-6">
              <div>
                <SectionLabel required>予算規模</SectionLabel>
                <div className="flex flex-col gap-2">
                  {BUDGET_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setBudget("range", opt.value)}
                      className={`w-full px-4 py-3 rounded-xl border-2 text-sm font-medium flex items-center justify-between transition-all active:scale-[0.98] ${
                        profile.budget.range === opt.value
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <span>{opt.label}</span>
                      <span className="text-xs font-normal text-gray-400">{opt.sub}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <SectionLabel>重視するコスト感</SectionLabel>
                <SingleSelect
                  options={BUDGET_PRIORITY_OPTIONS}
                  value={profile.budget.priority}
                  onChange={(v) => setBudget("priority", v)}
                />
              </div>
            </div>
          </>
        );

      // STEP 7: 同行者
      case 7:
        return (
          <>
            <StepHeading title={"誰と旅しますか？"} />
            <SingleSelect
              options={COMPANION_OPTIONS}
              value={profile.companion}
              onChange={(v) => set("companion", v)}
            />
          </>
        );

      // 完了画面
      case TOTAL_STEPS + 1:
        return (
          <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
            <div className="text-7xl mb-6">🎉</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">プロフィール完成！</h2>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              あなた専用の旅行プランを<br />準備する準備ができました
            </p>
            <button
              onClick={handleComplete}
              className="w-full max-w-xs py-4 bg-indigo-500 text-white font-semibold rounded-2xl active:scale-[0.98] transition-all"
            >
              旅の準備を始める →
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  const isQuestionStep = step >= 1 && step <= TOTAL_STEPS;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* ヘッダー（質問ステップのみ） */}
      {isQuestionStep && (
        <header className="bg-white px-4 pt-4 pb-3 border-b border-gray-100 sticky top-0 z-10">
          <div className="max-w-lg mx-auto">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={back}
                className="text-sm text-gray-400 hover:text-gray-600 py-1"
              >
                ‹ 戻る
              </button>
              <span className="text-xs font-medium text-gray-400">
                STEP {step} / {TOTAL_STEPS}
              </span>
            </div>
            {/* プログレスバー */}
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
              />
            </div>
          </div>
        </header>
      )}

      {/* コンテンツ */}
      <div className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
        {renderContent()}
      </div>

      {/* フッター（質問ステップのみ） */}
      {isQuestionStep && (
        <div className="px-4 py-4 bg-white border-t border-gray-100 sticky bottom-0">
          <div className="max-w-lg mx-auto">
            <button
              onClick={next}
              disabled={isNextDisabled}
              className="w-full py-3.5 bg-indigo-500 text-white font-semibold rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
            >
              次へ
            </button>
            {canSkip && (
              <button
                onClick={next}
                className="w-full mt-2 py-2 text-sm text-gray-400 hover:text-gray-600"
              >
                あとで設定する
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
