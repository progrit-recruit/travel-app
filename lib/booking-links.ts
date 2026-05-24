export type Tag = {
  label: string;
  color: "emerald" | "blue" | "orange" | "purple" | "gray";
};

export type BookingService = {
  id: string;
  name: string;
  description: string;
  url: string;
  tags: Tag[];
  recommended?: boolean;
};

export type BookingCategory = {
  id: string;
  icon: string;
  title: string;
  services: BookingService[];
};

export const BOOKING_CATEGORIES: BookingCategory[] = [
  {
    id: "hotel",
    icon: "🏨",
    title: "ホテル・宿泊",
    services: [
      {
        id: "booking",
        name: "Booking.com",
        description: "世界最大級の宿泊予約サイト。無料キャンセル対応が多い",
        url: "https://www.booking.com",
        tags: [
          { label: "日本語対応", color: "blue" },
          { label: "世界最大級", color: "emerald" },
        ],
        recommended: true,
      },
      {
        id: "agoda",
        name: "Agoda",
        description: "アジア特化で安いことが多い。即時確定が強み",
        url: "https://www.agoda.com/ja-jp",
        tags: [
          { label: "日本語対応", color: "blue" },
          { label: "アジア特化", color: "orange" },
        ],
      },
      {
        id: "expedia",
        name: "Expedia",
        description: "航空券+ホテルのセット予約でお得になりやすい",
        url: "https://www.expedia.co.jp",
        tags: [
          { label: "日本語対応", color: "blue" },
          { label: "セット割引", color: "purple" },
        ],
      },
      {
        id: "hotels",
        name: "Hotels.com",
        description: "10泊すると1泊無料になるポイント制度が人気",
        url: "https://jp.hotels.com",
        tags: [
          { label: "日本語対応", color: "blue" },
          { label: "ポイント還元", color: "emerald" },
        ],
      },
    ],
  },
  {
    id: "esim",
    icon: "📱",
    title: "eSIM・通信",
    services: [
      {
        id: "airalo",
        name: "Airalo",
        description: "世界最大のeSIMマーケット。200以上の国・地域に対応。アプリから即購入可能",
        url: "https://www.airalo.com/ja",
        tags: [
          { label: "日本語対応", color: "blue" },
          { label: "即時開通", color: "emerald" },
          { label: "200カ国+", color: "orange" },
        ],
        recommended: true,
      },
      {
        id: "nomad",
        name: "Nomad",
        description: "データ通信量が多くコスパが良い。旅行者に人気",
        url: "https://www.getnomad.app",
        tags: [
          { label: "大容量", color: "emerald" },
          { label: "コスパ良", color: "orange" },
        ],
      },
      {
        id: "holafly",
        name: "HolaFly",
        description: "無制限プランが特徴。長期旅行者向け",
        url: "https://esim.holafly.com/ja",
        tags: [
          { label: "日本語対応", color: "blue" },
          { label: "無制限プラン", color: "purple" },
        ],
      },
      {
        id: "iij",
        name: "IIJmio eSIM",
        description: "日本の通信会社で安心。海外ローミングも対応",
        url: "https://www.iijmio.jp/esim/",
        tags: [
          { label: "日本語対応", color: "blue" },
          { label: "国内キャリア", color: "gray" },
        ],
      },
    ],
  },
  {
    id: "insurance",
    icon: "🛡️",
    title: "海外旅行保険",
    services: [
      {
        id: "rakuten-ins",
        name: "楽天損保",
        description: "ネットから申し込める海外旅行保険。安くて手続きが簡単",
        url: "https://www.rakuten-sonpo.co.jp/travel/",
        tags: [
          { label: "日本語対応", color: "blue" },
          { label: "ネット完結", color: "emerald" },
        ],
        recommended: true,
      },
      {
        id: "aig",
        name: "AIG損保",
        description: "補償が手厚い。医療費が高い国への旅行に安心",
        url: "https://www.aig.co.jp/sonpo/personal/travel/kaigai",
        tags: [
          { label: "日本語対応", color: "blue" },
          { label: "高補償", color: "orange" },
        ],
      },
      {
        id: "card-insurance",
        name: "クレカ付帯保険を確認",
        description: "持っているクレジットカードに旅行保険が自動付帯している場合があります",
        url: "https://www.google.com/search?q=クレジットカード+海外旅行保険+自動付帯",
        tags: [
          { label: "無料の可能性", color: "emerald" },
          { label: "要確認", color: "gray" },
        ],
      },
      {
        id: "secom",
        name: "セコム損保",
        description: "緊急時のサポートが充実。救援者費用補償が手厚い",
        url: "https://www.secom-sonpo.co.jp/anshinkaigai/",
        tags: [
          { label: "日本語対応", color: "blue" },
          { label: "緊急サポート", color: "purple" },
        ],
      },
    ],
  },
  {
    id: "flight",
    icon: "✈️",
    title: "航空券",
    services: [
      {
        id: "google-flights",
        name: "Google フライト",
        description: "複数のサイトを一括比較。料金カレンダーで安い日程を探せる",
        url: "https://www.google.com/travel/flights",
        tags: [
          { label: "日本語対応", color: "blue" },
          { label: "比較サイト", color: "emerald" },
        ],
        recommended: true,
      },
      {
        id: "skyscanner",
        name: "Skyscanner",
        description: "全月比較や「どこでも」検索でお得な旅先を探せる",
        url: "https://www.skyscanner.jp",
        tags: [
          { label: "日本語対応", color: "blue" },
          { label: "最安値比較", color: "orange" },
        ],
      },
      {
        id: "ana",
        name: "ANA",
        description: "ANAマイルを貯めている方はこちらから直接予約",
        url: "https://www.ana.co.jp",
        tags: [
          { label: "日本語対応", color: "blue" },
          { label: "マイル積算", color: "purple" },
        ],
      },
      {
        id: "jal",
        name: "JAL",
        description: "JALマイルを貯めている方はこちらから直接予約",
        url: "https://www.jal.co.jp",
        tags: [
          { label: "日本語対応", color: "blue" },
          { label: "マイル積算", color: "purple" },
        ],
      },
    ],
  },
  {
    id: "money",
    icon: "💴",
    title: "外貨・両替",
    services: [
      {
        id: "wise",
        name: "Wise（旧TransferWise）",
        description: "実勢レートに近い手数料で送金・両替。海外デビットカードも発行可能",
        url: "https://wise.com/jp",
        tags: [
          { label: "日本語対応", color: "blue" },
          { label: "手数料格安", color: "emerald" },
        ],
        recommended: true,
      },
      {
        id: "revolut",
        name: "Revolut",
        description: "多通貨対応のデジタル銀行。海外ATM引き出し無料枠あり",
        url: "https://www.revolut.com/ja-JP",
        tags: [
          { label: "日本語対応", color: "blue" },
          { label: "多通貨対応", color: "orange" },
        ],
      },
      {
        id: "rate-check",
        name: "為替レート確認（Google）",
        description: "現在のレートをすぐに確認。両替前に必ずチェック",
        url: "https://www.google.com/search?q=円+ドル+レート",
        tags: [
          { label: "リアルタイム", color: "emerald" },
        ],
      },
    ],
  },
];
