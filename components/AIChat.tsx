"use client";

import { useEffect, useRef, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const QUICK_STARTS = [
  { emoji: "🧳", label: "ロストバゲージ", text: "荷物が届いていません。ロストバゲージの対応方法を教えてください。" },
  { emoji: "🤒", label: "急病・怪我", text: "急に体調が悪くなりました。海外での病院のかかり方を教えてください。" },
  { emoji: "💳", label: "盗難・紛失", text: "パスポートと財布が盗まれました。今すぐすべきことを教えてください。" },
  { emoji: "🏛️", label: "大使館連絡", text: "日本大使館に連絡したいです。連絡方法と対応してもらえることを教えてください。" },
  { emoji: "🚌", label: "交通トラブル", text: "道に迷ってしまいました。目的地に戻るにはどうすればいいですか？" },
  { emoji: "🤝", label: "文化・マナー", text: "現地で失礼なことをしてしまったかもしれません。どう対処すればいいですか？" },
];

const OFFLINE_TIPS: Record<string, string> = {
  "ロストバゲージ": `【ロストバゲージ対応】\n1. 荷物受取エリアを離れる前に航空会社カウンターへ\n2. PIR（財産不規則報告書）を記入・受け取る\n3. 旅行保険の緊急連絡先に電話\n4. ホテルの住所を伝え、届いたら配送してもらう\n5. 当面必要な衣類の購入費用は領収書を保管（保険請求に必要）`,
  "急病・怪我": `【急病・怪我の対応】\n1. 重症なら迷わず現地の救急（日本: 119）に電話\n2. ホテルのフロントに相談（病院を紹介してくれることが多い）\n3. 旅行保険のキャッシュレス医療サービスに連絡\n4. 受診時はパスポートと保険証書を持参\n5. 処方薬は必ず領収書・薬の袋を保管`,
  "盗難・紛失": `【盗難・紛失の対応】\n1. 現地警察へ行き被害届（Police Report）を取得\n2. 日本大使館・領事館に連絡しパスポート再発行を申請\n3. クレジットカード会社に紛失連絡・利用停止\n4. 旅行保険会社に連絡\n5. 緊急連絡先: 外務省海外安全情報 +81-3-5501-8000`,
  "大使館連絡": `【日本大使館への連絡】\n• 在外公館の電話番号は外務省サイトで確認可能\n• 緊急の場合: 外務省緊急連絡先 +81-3-5501-8000（24時間）\n• 対応内容: パスポート再発行、日本人逮捕・行方不明の相談、緊急帰国の支援\n• 必要書類: 写真2枚、手数料（現地通貨）、日本の住民票（場合による）`,
  "交通トラブル": `【迷子・交通トラブルの対応】\n1. 近くの警察官や観光案内所に助けを求める\n2. ホテルのカードを見せてタクシーに乗る\n3. Google マップをオフラインで使用（事前にダウンロード推奨）\n4. 現地語で「助けてください」を覚えておく\n5. ホテル名・住所を紙に書いて持ち歩く`,
  "文化・マナー": `【文化・マナートラブルの対応】\n1. まず誠実に謝罪する（笑顔で「Sorry」は万国共通）\n2. 宗教的な場所での失礼は特に誠実な謝罪を\n3. 法律違反の疑いがある場合は日本大使館に連絡\n4. 現地ガイドや通訳に助けを求める\n5. 次回のために現地の文化・タブーを事前に調べることを推奨`,
};

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const onOffline = () => setIsOffline(true);
    const onOnline = () => setIsOffline(false);
    window.addEventListener("offline", onOffline);
    window.addEventListener("online", onOnline);
    if (!navigator.onLine) setIsOffline(true);
    return () => {
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("online", onOnline);
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: text.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setApiError(null);

    // オフライン時は簡易FAQを返す
    if (isOffline) {
      const matched = QUICK_STARTS.find((q) => text.includes(q.text.slice(0, 6)));
      const offlineReply = matched
        ? OFFLINE_TIPS[matched.label] ?? "オフライン中のため、AIに接続できません。\nインターネットに接続してから再度お試しください。"
        : "オフライン中のため、AIに接続できません。\nインターネットに接続してから再度お試しください。";
      setMessages([...newMessages, { role: "assistant", content: offlineReply }]);
      return;
    }

    setIsLoading(true);
    const assistantMessage: Message = { role: "assistant", content: "" };
    setMessages([...newMessages, assistantMessage]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "エラーが発生しました。" }));
        setApiError(err.error ?? "エラーが発生しました。");
        setMessages(newMessages);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages([
          ...newMessages,
          { role: "assistant", content: accumulated },
        ]);
      }
    } catch {
      setApiError("ネットワークエラーが発生しました。");
      setMessages(newMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleQuickStart = (text: string) => {
    sendMessage(text);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* オフラインバナー */}
      {isOffline && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-2 text-sm text-orange-700">
          📵 オフライン中 — 定型回答のみ利用できます
        </div>
      )}

      {/* APIエラー */}
      {apiError && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2 text-sm text-red-700">
          ⚠️ {apiError}
        </div>
      )}

      {/* クイックスタート */}
      {messages.length === 0 && (
        <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4">
          <p className="text-sm font-medium text-purple-800 mb-3">よくあるトラブルを選んでください</p>
          <div className="grid grid-cols-2 gap-2">
            {QUICK_STARTS.map((q) => (
              <button
                key={q.label}
                onClick={() => handleQuickStart(q.text)}
                disabled={isLoading}
                className="flex items-center gap-2 px-3 py-2.5 bg-white border border-purple-200 rounded-xl text-left text-sm hover:bg-purple-50 active:scale-95 transition-all disabled:opacity-50"
              >
                <span className="text-lg">{q.emoji}</span>
                <span className="font-medium text-gray-800 text-xs">{q.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* チャット履歴 */}
      {messages.length > 0 && (
        <div className="flex flex-col gap-3 min-h-0">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <span className="text-xl mr-2 mt-1 flex-shrink-0">🤖</span>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed ${
                  msg.role === "user"
                    ? "bg-purple-500 text-white rounded-br-sm"
                    : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm"
                }`}
              >
                {msg.content || (
                  <span className="flex gap-1 items-center text-gray-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]" />
                  </span>
                )}
              </div>
              {msg.role === "user" && (
                <span className="text-xl ml-2 mt-1 flex-shrink-0">👤</span>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      )}

      {/* 入力フォーム */}
      <div className="sticky bottom-0 bg-gray-50 pt-2">
        {messages.length > 0 && (
          <button
            onClick={() => { setMessages([]); setApiError(null); }}
            className="w-full mb-2 text-xs text-gray-400 hover:text-gray-600 py-1"
          >
            会話をリセット
          </button>
        )}
        <form onSubmit={handleSubmit} className="flex gap-2 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="困っていることを入力... (⌘+Enter で送信)"
            rows={2}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-purple-400 resize-none"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2.5 bg-purple-500 text-white text-sm font-medium rounded-xl disabled:opacity-50 self-end"
          >
            {isLoading ? "..." : "送信"}
          </button>
        </form>
        <p className="text-xs text-gray-400 mt-1 text-center">
          AIの回答は参考情報です。緊急時は現地の緊急番号・大使館に連絡してください。
        </p>
      </div>
    </div>
  );
}
