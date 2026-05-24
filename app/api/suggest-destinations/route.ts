import Anthropic from "@anthropic-ai/sdk";
import { COUNTRIES } from "@/lib/country-data";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: Request) {
  try {
    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === "your-api-key-here") {
      // APIキー未設定の場合はデフォルト提案を返す
      return Response.json({ destinations: ["FR", "IT", "TH"] });
    }

    const { profile } = await request.json();

    const countryCodes = Object.keys(COUNTRIES).join(", ");
    const prompt = `あなたは旅行コンシェルジュです。以下のユーザープロファイルを元に、海外旅行の行き先として最適な国を3〜4カ国提案してください。

ユーザープロファイル：
${JSON.stringify(profile, null, 2)}

対応国コード一覧：${countryCodes}

回答は以下のJSON形式のみで返してください（説明不要）：
{"destinations": ["XX", "YY", "ZZ"]}

必ず上記の国コード一覧に含まれるコードを使用してください。`;

    const response = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 100,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return Response.json({ destinations: ["FR", "IT", "TH"] });

    const parsed = JSON.parse(match[0]);
    return Response.json(parsed);
  } catch {
    return Response.json({ destinations: ["FR", "IT", "TH"] });
  }
}
