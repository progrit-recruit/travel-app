export type ChecklistItem = {
  id: string;
  label: string;
  note?: string;
};

export type ChecklistCategory = {
  id: string;
  icon: string;
  title: string;
  items: ChecklistItem[];
};

export const DEFAULT_CHECKLIST: ChecklistCategory[] = [
  {
    id: "documents",
    icon: "📄",
    title: "書類・手続き",
    items: [
      { id: "passport", label: "パスポート（有効期限6ヶ月以上）" },
      { id: "visa", label: "ビザ（必要な場合）" },
      { id: "insurance", label: "海外旅行保険の加入" },
      { id: "flight", label: "航空券・予約確認書の印刷またはDL" },
      { id: "hotel", label: "ホテル・宿泊予約書" },
    ],
  },
  {
    id: "communication",
    icon: "📱",
    title: "通信・電源",
    items: [
      { id: "esim", label: "e-SIM またはSIMカードの準備", note: "オフライン用にダウンロードしておこう" },
      { id: "plug", label: "変換プラグ（現地の形状を確認）" },
      { id: "battery", label: "モバイルバッテリー" },
      { id: "charger", label: "充電ケーブル（全デバイス分）" },
      { id: "offline-map", label: "オフラインマップのダウンロード", note: "Google Maps → 地域を選んでDL" },
      { id: "offline-translate", label: "翻訳アプリの言語パックをDL" },
    ],
  },
  {
    id: "money",
    icon: "💴",
    title: "お金・クレジットカード",
    items: [
      { id: "card-check", label: "クレジットカードの海外利用設定を確認" },
      { id: "card-pin", label: "クレジットカードの暗証番号を確認" },
      { id: "cash", label: "現地通貨の現金を準備（小額）" },
      { id: "emergency-cash", label: "緊急用の予備現金" },
    ],
  },
  {
    id: "health",
    icon: "💊",
    title: "健康・安全",
    items: [
      { id: "medicine", label: "常備薬（胃腸薬・風邪薬・痛み止めなど）" },
      { id: "prescription", label: "処方箋のコピーと英文診断書（必要な場合）" },
      { id: "emergency-contact", label: "緊急連絡先をメモ（大使館・保険会社）" },
      { id: "vaccine", label: "ワクチン接種（必要な場合）" },
    ],
  },
  {
    id: "luggage",
    icon: "🧳",
    title: "荷物",
    items: [
      { id: "clothes", label: "衣類（日数分＋予備）" },
      { id: "toiletries", label: "洗面用具・化粧品" },
      { id: "sunscreen", label: "日焼け止め" },
      { id: "umbrella", label: "折りたたみ傘またはレインコート" },
      { id: "lock", label: "スーツケースの鍵・TSAロック" },
    ],
  },
];
