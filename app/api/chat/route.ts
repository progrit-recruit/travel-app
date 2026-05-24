import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `あなたは海外旅行中のトラブルを専門に支援するAIアシスタントです。
ユーザーは現在海外にいて、困っている状況です。以下の方針で回答してください。

【回答方針】
- 簡潔で実用的なアドバイスを提供する
- 緊急度に応じて優先順位をつける
- 具体的な行動ステップを番号付きで示す
- 現地の緊急連絡先（警察110/119、大使館など）を必要に応じて案内する
- 日本語で回答する
- 専門的な知識が必要な場合（医療・法律）は必ず専門家への相談を勧める

【対応できるトラブル例】
- パスポート・荷物の紛失・盗難
- 急病・怪我・病院での対応
- 緊急連絡先・大使館への連絡方法
- 交通トラブル（迷子・乗り間違い）
- 言語バリア・コミュニケーション問題
- クレジットカードトラブル
- 現地の文化・マナー・法律

回答は300文字程度を目安に、要点を押さえた内容にしてください。`;

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === "your-api-key-here") {
      return new Response(
        JSON.stringify({ error: "APIキーが設定されていません。.env.localにANTHROPIC_API_KEYを設定してください。" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const claudeStream = await client.messages.stream({
            model: "claude-haiku-4-5",
            max_tokens: 1024,
            system: SYSTEM_PROMPT,
            messages,
          });

          for await (const chunk of claudeStream) {
            if (
              chunk.type === "content_block_delta" &&
              chunk.delta.type === "text_delta"
            ) {
              controller.enqueue(encoder.encode(chunk.delta.text));
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response(
      JSON.stringify({ error: "リクエストの処理中にエラーが発生しました。" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
