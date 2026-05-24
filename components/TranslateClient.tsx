"use client";

import { useState, useCallback, useEffect } from "react";

type LangPair = {
  id: string;
  fromLabel: string;
  toLabel: string;
  apiPair: string;
};

const LANG_PAIRS: LangPair[] = [
  { id: "ja-en", fromLabel: "日本語", toLabel: "英語",      apiPair: "ja|en" },
  { id: "en-ja", fromLabel: "英語",   toLabel: "日本語",    apiPair: "en|ja" },
  { id: "ja-ko", fromLabel: "日本語", toLabel: "韓国語",    apiPair: "ja|ko" },
  { id: "ja-zh", fromLabel: "日本語", toLabel: "中国語",    apiPair: "ja|zh" },
  { id: "ja-th", fromLabel: "日本語", toLabel: "タイ語",    apiPair: "ja|th" },
  { id: "ja-fr", fromLabel: "日本語", toLabel: "フランス語", apiPair: "ja|fr" },
  { id: "ja-es", fromLabel: "日本語", toLabel: "スペイン語", apiPair: "ja|es" },
];

const CACHE_KEY = "translate-cache";

function loadCache(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function saveCache(cache: Record<string, string>) {
  // キャッシュは最大200件まで保持
  const entries = Object.entries(cache);
  const trimmed = Object.fromEntries(entries.slice(-200));
  localStorage.setItem(CACHE_KEY, JSON.stringify(trimmed));
}

function cacheKey(pairId: string, text: string) {
  return `${pairId}::${text}`;
}

async function translateOnline(text: string, apiPair: string): Promise<string> {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${apiPair}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const translated = data?.responseData?.translatedText;
  if (!translated) throw new Error("翻訳結果が空です");
  return translated;
}

type Status = "idle" | "translating" | "done" | "cached" | "error" | "offline";

export default function TranslateClient() {
  const [pairId, setPairId] = useState("ja-en");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [cacheCount, setCacheCount] = useState(0);

  const currentPair = LANG_PAIRS.find((p) => p.id === pairId) ?? LANG_PAIRS[0];

  useEffect(() => {
    setCacheCount(Object.keys(loadCache()).length);
  }, []);

  const handleTranslate = useCallback(async () => {
    const text = inputText.trim();
    if (!text) return;

    // キャッシュから先に探す
    const cache = loadCache();
    const key = cacheKey(pairId, text);
    if (cache[key]) {
      setOutputText(cache[key]);
      setStatus("cached");
      return;
    }

    setStatus("translating");
    setOutputText("");

    try {
      const result = await translateOnline(text, currentPair.apiPair);
      setOutputText(result);
      setStatus("done");

      // キャッシュに保存
      cache[key] = result;
      saveCache(cache);
      setCacheCount(Object.keys(cache).length);
    } catch {
      if (!navigator.onLine) {
        setStatus("offline");
      } else {
        setStatus("error");
      }
    }
  }, [inputText, pairId, currentPair]);

  const handlePairChange = (id: string) => {
    setPairId(id);
    setOutputText("");
    setStatus("idle");
  };

  const handleSwap = () => {
    const reversed = LANG_PAIRS.find(
      (p) => p.fromLabel === currentPair.toLabel && p.toLabel === currentPair.fromLabel
    );
    if (reversed) {
      handlePairChange(reversed.id);
      setInputText(outputText);
    }
  };

  const statusBadge = () => {
    if (status === "cached")  return <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">✓ キャッシュから表示（オフライン可）</span>;
    if (status === "done")    return <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">✓ 翻訳完了・保存済み</span>;
    if (status === "offline") return <span className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">⚠ オフライン: キャッシュにありません</span>;
    if (status === "error")   return <span className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded-full">翻訳に失敗しました</span>;
    return null;
  };

  return (
    <div className="flex flex-col gap-4">
      {/* オフライン説明 */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
        <p className="text-sm text-blue-700 font-medium mb-1">📶 オフライン対応の仕組み</p>
        <p className="text-xs text-blue-600 leading-relaxed">
          翻訳した内容はすべてブラウザに保存されます。一度翻訳すれば、次回はネットなしで表示できます。
        </p>
        {cacheCount > 0 && (
          <p className="text-xs text-blue-500 mt-1">現在 {cacheCount} 件の翻訳を保存中</p>
        )}
      </div>

      {/* 言語ペア選択 */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <p className="text-xs text-gray-400 mb-2">翻訳する言語</p>
        <div className="grid grid-cols-2 gap-2">
          {LANG_PAIRS.map((pair) => (
            <button
              key={pair.id}
              onClick={() => handlePairChange(pair.id)}
              className={`px-3 py-2 rounded-xl border text-sm font-medium transition-colors text-left ${
                pairId === pair.id
                  ? "bg-blue-50 border-blue-300 text-blue-700"
                  : "border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {pair.fromLabel} → {pair.toLabel}
            </button>
          ))}
        </div>
      </div>

      {/* 翻訳エリア */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {/* 入力 */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500">{currentPair.fromLabel}</span>
            {inputText && (
              <button onClick={() => { setInputText(""); setOutputText(""); setStatus("idle"); }} className="text-xs text-gray-400 hover:text-gray-600">
                クリア
              </button>
            )}
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleTranslate(); }}
            placeholder={`${currentPair.fromLabel}で入力... (⌘+Enter で翻訳)`}
            className="w-full h-32 text-base text-gray-800 resize-none outline-none placeholder-gray-300"
          />
        </div>

        {/* ボタン */}
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
          <button
            onClick={handleTranslate}
            disabled={!inputText.trim() || status === "translating"}
            className="flex-1 py-2.5 rounded-xl bg-blue-500 text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-600 active:bg-blue-700 transition-colors"
          >
            {status === "translating" ? "翻訳中..." : "翻訳する"}
          </button>
          {outputText && (
            <button onClick={handleSwap} className="px-3 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 text-sm" title="言語を入れ替え">
              ⇄
            </button>
          )}
        </div>

        {/* 出力 */}
        <div className="p-4 min-h-[8rem]">
          <div className="flex items-center justify-between mb-2 flex-wrap gap-1">
            <span className="text-xs font-medium text-gray-500">{currentPair.toLabel}</span>
            {statusBadge()}
          </div>
          {outputText ? (
            <div className="flex flex-col gap-2">
              <p className="text-base text-gray-800 leading-relaxed">{outputText}</p>
              <button onClick={() => navigator.clipboard.writeText(outputText)} className="self-start text-xs text-blue-500 hover:text-blue-700">
                コピー
              </button>
            </div>
          ) : status === "offline" ? (
            <p className="text-sm text-orange-500">オフラインのため翻訳できません。先にオンラインで翻訳しておくとここに保存されます。</p>
          ) : (
            <p className="text-sm text-gray-300">翻訳結果がここに表示されます</p>
          )}
        </div>
      </div>
    </div>
  );
}
