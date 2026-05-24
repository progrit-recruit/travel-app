import Anthropic from "@anthropic-ai/sdk";
import type { Itinerary } from "@/lib/trip-plan";
import { getMockItinerary } from "@/lib/mock-itineraries";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function buildModifyPrompt(itinerary: Itinerary, instruction: string): string {
  return `以下の旅行プランを「${instruction}」という指示に従って修正してください。

現在のプラン：
${JSON.stringify(itinerary, null, 2)}

修正後のプランを同じJSON形式のみで返答してください（説明不要）。total_costも更新してください。`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    // ── generate：モック旅程をそのまま返す（デモ用確定プラン）──
    if (action === "generate") {
      const { destination, tripDays } = body.context ?? {};
      if (!destination) {
        return Response.json({ error: "行き先が指定されていません" }, { status: 400 });
      }
      const itinerary = getMockItinerary(destination, tripDays ?? 5);
      // 生成感を演出するため 800ms 待機
      await new Promise((r) => setTimeout(r, 800));
      return Response.json({ itinerary });
    }

    // ── modify：Claude API でリアルタイム修正 ──
    if (action === "modify") {
      if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === "your-api-key-here") {
        return Response.json({ error: "修正機能にはAPIキーが必要です" }, { status: 500 });
      }
      const prompt = buildModifyPrompt(body.itinerary, body.instruction);
      const response = await client.messages.create({
        model: "claude-haiku-4-5",
        max_tokens: 4096,
        messages: [{ role: "user", content: prompt }],
      });
      const text = response.content[0].type === "text" ? response.content[0].text : "";
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) {
        return Response.json({ error: "修正プランの生成に失敗しました" }, { status: 500 });
      }
      const itinerary: Itinerary = JSON.parse(match[0]);
      return Response.json({ itinerary });
    }

    return Response.json({ error: "不明なアクションです" }, { status: 400 });
  } catch (err) {
    console.error("generate-plan error:", err);
    return Response.json({ error: "プランの処理中にエラーが発生しました" }, { status: 500 });
  }
}
