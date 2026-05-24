import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const VALID_CATEGORIES = ["food", "nature", "photo", "history", "shopping", "activities"];

export async function POST(request: Request) {
  try {
    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === "your-api-key-here") {
      return Response.json({ extracted_spots: [], categories: [] });
    }

    const { freeText, destinationName } = await request.json();
    if (!freeText?.trim()) {
      return Response.json({ extracted_spots: [], categories: [] });
    }

    const prompt = `以下の旅行に関するテキストから情報を抽出してください。
旅行先：${destinationName}
テキスト：「${freeText}」

以下のJSON形式のみで返答してください（説明不要）：
{
  "extracted_spots": ["具体的なスポット名や食べ物名を抽出"],
  "categories": ["以下から該当するものを選択：food, nature, photo, history, shopping, activities"]
}`;

    const response = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 200,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return Response.json({ extracted_spots: [], categories: [] });

    const parsed = JSON.parse(match[0]);
    // カテゴリをバリデーション
    const categories = (parsed.categories || []).filter((c: string) =>
      VALID_CATEGORIES.includes(c)
    );
    return Response.json({
      extracted_spots: parsed.extracted_spots || [],
      categories,
    });
  } catch {
    return Response.json({ extracted_spots: [], categories: [] });
  }
}
