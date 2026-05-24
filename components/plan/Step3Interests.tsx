"use client";

import { useState } from "react";
import { getCountry } from "@/lib/country-data";

const INTEREST_OPTIONS = [
  { value: "food", label: "🍜 グルメ", sub: "現地料理・カフェ・スイーツ" },
  { value: "nature", label: "🏔️ 自然", sub: "山・海・国立公園" },
  { value: "photo", label: "📸 インスタ映え", sub: "絶景・フォトスポット" },
  { value: "history", label: "🏛️ 歴史・文化", sub: "世界遺産・美術館・建築" },
  { value: "shopping", label: "🛍️ ショッピング", sub: "ブランド・ローカルマーケット" },
  { value: "activities", label: "🏄 アクティビティ", sub: "ハイキング・マリンスポーツ" },
];

const SUGGEST_TEXTS = [
  "現地のローカルレストランでしか食べられないものを楽しみたい",
  "世界遺産を巡りながら歴史を感じたい",
  "インスタ映えするスポットで写真を撮りたい",
  "地元の市場でお土産を買いたい",
  "自然の中でハイキングを楽しみたい",
];

type Props = {
  destination: string;
  interests: string[];
  freeText: string;
  extractedSpots: string[];
  onUpdateInterests: (v: string[]) => void;
  onUpdateFreeText: (v: string) => void;
  onUpdateExtractedSpots: (v: string[]) => void;
  onNext: () => void;
};

export default function Step3Interests({
  destination,
  interests,
  freeText,
  extractedSpots,
  onUpdateInterests,
  onUpdateFreeText,
  onUpdateExtractedSpots,
  onNext,
}: Props) {
  const [analyzing, setAnalyzing] = useState(false);
  const country = getCountry(destination);

  const toggle = (val: string) =>
    onUpdateInterests(
      interests.includes(val) ? interests.filter((v) => v !== val) : [...interests, val]
    );

  const handleAnalyze = async () => {
    if (!freeText.trim()) return;
    setAnalyzing(true);
    try {
      const res = await fetch("/api/extract-interests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ freeText, destinationName: country?.name }),
      });
      const data = await res.json();
      if (data.extracted_spots?.length) onUpdateExtractedSpots(data.extracted_spots);
      if (data.categories?.length) {
        const merged = Array.from(new Set([...interests, ...data.categories]));
        onUpdateInterests(merged);
      }
    } catch {
      // noop
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          {country?.flag} {country?.name}での<br />こだわりを教えてください
        </h2>
        <p className="text-xs text-gray-400 mt-1">これをもとにAIがプランを作ります</p>
      </div>

      {/* カテゴリ選択 */}
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-2">こだわりポイント（複数選択可）</p>
        <div className="grid grid-cols-2 gap-2">
          {INTEREST_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => toggle(opt.value)}
              className={`p-3 rounded-xl border-2 text-left transition-all active:scale-95 ${
                interests.includes(opt.value)
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <p className="text-sm font-semibold text-gray-800">{opt.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{opt.sub}</p>
            </button>
          ))}
        </div>
      </div>

      {/* チャット入力 */}
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-2">
          行きたい場所・食べたいもの・やりたいことを自由に
        </p>

        {/* サジェストチップ */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {SUGGEST_TEXTS.map((text) => (
            <button
              key={text}
              onClick={() => onUpdateFreeText(freeText ? `${freeText}、${text}` : text)}
              className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 active:scale-95 transition-all"
            >
              + {text.slice(0, 16)}…
            </button>
          ))}
        </div>

        <textarea
          value={freeText}
          onChange={(e) => onUpdateFreeText(e.target.value)}
          placeholder={`例：${country?.name}のサグラダ・ファミリアには絶対行きたい。本場の料理を食べたい。`}
          rows={3}
          className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-indigo-400 resize-none"
        />

        <button
          onClick={handleAnalyze}
          disabled={!freeText.trim() || analyzing}
          className="mt-2 w-full py-2.5 text-sm font-medium bg-gray-800 text-white rounded-xl disabled:opacity-40 transition-all active:scale-[0.98]"
        >
          {analyzing ? "⏳ AIが解析中..." : "🤖 AIに解析してもらう"}
        </button>
      </div>

      {/* AI抽出結果 */}
      {extractedSpots.length > 0 && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3">
          <p className="text-xs font-semibold text-indigo-700 mb-1.5">✨ AIが検出したスポット</p>
          <div className="flex flex-wrap gap-1.5">
            {extractedSpots.map((spot) => (
              <span
                key={spot}
                className="text-xs px-3 py-1 bg-white border border-indigo-200 rounded-full text-indigo-700"
              >
                📍 {spot}
              </span>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onNext}
        className="w-full py-3.5 bg-indigo-500 text-white font-semibold rounded-2xl transition-all active:scale-[0.98]"
      >
        AIにプランを作ってもらう →
      </button>
      <p className="text-xs text-center text-gray-400">こだわりは後から修正できます</p>
    </div>
  );
}
