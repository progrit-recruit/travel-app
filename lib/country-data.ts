export type CountryData = {
  name: string;
  flag: string;
  lat: number;
  lng: number;
  continent: string;
  bestSeason: string;
  flightHours: number;
  currency: string;
  currencyName: string;
  rateToJPY: number;
  flightMin: number;  // JPY
  flightMax: number;
  hotelMin: number;   // JPY/night
  hotelMax: number;
  localMin: number;   // JPY/day
  localMax: number;
  topSpots: string[];
  description: string;
};

export const COUNTRIES: Record<string, CountryData> = {
  KR: {
    name: "韓国", flag: "🇰🇷", lat: 36.5, lng: 127.8, continent: "アジア",
    bestSeason: "春（3〜5月）・秋（9〜11月）", flightHours: 2.5,
    currency: "KRW", currencyName: "ウォン", rateToJPY: 0.11,
    flightMin: 20000, flightMax: 60000, hotelMin: 6000, hotelMax: 20000, localMin: 3000, localMax: 10000,
    topSpots: ["景福宮", "明洞", "北村韓屋村", "仁寺洞", "DMZ（非武装地帯）", "済州島", "釜山海雲台", "慶州仏国寺"],
    description: "近くて文化・グルメ・ショッピングを満喫できる人気No.1アジア旅行先",
  },
  TW: {
    name: "台湾", flag: "🇹🇼", lat: 23.7, lng: 120.9, continent: "アジア",
    bestSeason: "秋〜冬（10〜2月）", flightHours: 3.5,
    currency: "TWD", currencyName: "台湾ドル", rateToJPY: 4.6,
    flightMin: 25000, flightMax: 70000, hotelMin: 6000, hotelMax: 18000, localMin: 2000, localMax: 8000,
    topSpots: ["九份", "士林夜市", "故宮博物院", "太魯閣国家公園", "阿里山", "日月潭", "淡水", "台南安平古堡"],
    description: "親日的な雰囲気、美食と自然が充実した台湾。夜市文化も必見",
  },
  TH: {
    name: "タイ", flag: "🇹🇭", lat: 15.9, lng: 100.9, continent: "アジア",
    bestSeason: "冬（11〜2月）", flightHours: 7,
    currency: "THB", currencyName: "バーツ", rateToJPY: 4.1,
    flightMin: 50000, flightMax: 120000, hotelMin: 4000, hotelMax: 25000, localMin: 3000, localMax: 12000,
    topSpots: ["ワット・プラケオ（エメラルド寺院）", "チャトゥチャック市場", "アユタヤ遺跡", "チェンマイ旧市街", "パタヤビーチ", "プーケット", "カオサン通り", "フローティングマーケット"],
    description: "微笑みの国タイ。寺院・ビーチ・グルメ・マッサージが全部そろう",
  },
  VN: {
    name: "ベトナム", flag: "🇻🇳", lat: 14.1, lng: 108.3, continent: "アジア",
    bestSeason: "地域による（北：10〜4月、南：12〜4月）", flightHours: 6,
    currency: "VND", currencyName: "ドン", rateToJPY: 0.006,
    flightMin: 50000, flightMax: 130000, hotelMin: 3000, hotelMax: 18000, localMin: 2000, localMax: 8000,
    topSpots: ["ハノイ旧市街", "ハロン湾", "ホイアン古市街", "ミーソン聖域", "ホーチミン市", "フォービエン市場", "バナーヒルズ", "ニャチャンビーチ"],
    description: "世界遺産とグルメ天国。フォー・バインミーなど食も絶品で物価も安い",
  },
  SG: {
    name: "シンガポール", flag: "🇸🇬", lat: 1.4, lng: 103.8, continent: "アジア",
    bestSeason: "通年OK（2〜4月が比較的乾燥）", flightHours: 7,
    currency: "SGD", currencyName: "シンガポールドル", rateToJPY: 110,
    flightMin: 60000, flightMax: 150000, hotelMin: 10000, hotelMax: 40000, localMin: 5000, localMax: 20000,
    topSpots: ["マリーナ・ベイ・サンズ", "ガーデンズ・バイ・ザ・ベイ", "セントーサ島", "チャイナタウン", "リトルインディア", "シンガポール動物園", "クラークキー", "ナショナルギャラリー"],
    description: "多文化都市国家。清潔で安全、ショッピングも食も世界トップクラス",
  },
  ID: {
    name: "インドネシア（バリ）", flag: "🇮🇩", lat: -8.4, lng: 115.2, continent: "アジア",
    bestSeason: "乾季（5〜9月）", flightHours: 7.5,
    currency: "IDR", currencyName: "ルピア", rateToJPY: 0.009,
    flightMin: 60000, flightMax: 150000, hotelMin: 5000, hotelMax: 30000, localMin: 3000, localMax: 12000,
    topSpots: ["ウブド棚田（テガラランの棚田）", "タナロット寺院", "ウルワツ寺院", "クタビーチ", "スミニャック", "ウブド王宮", "ライステラス", "アグン山"],
    description: "神々の島バリ。ビーチリゾートからスピリチュアルな文化体験まで",
  },
  MY: {
    name: "マレーシア", flag: "🇲🇾", lat: 4.2, lng: 108.0, continent: "アジア",
    bestSeason: "4〜10月（クアラルンプール）", flightHours: 7,
    currency: "MYR", currencyName: "リンギット", rateToJPY: 33,
    flightMin: 55000, flightMax: 140000, hotelMin: 5000, hotelMax: 22000, localMin: 2500, localMax: 10000,
    topSpots: ["ペトロナスツインタワー", "バトゥ洞窟", "チャイナタウン（ペタリン通り）", "ランカウイ島", "ペナン島ジョージタウン", "キナバル山", "コタキナバル", "マラッカ歴史地区"],
    description: "多民族文化と大自然が共存。物価安くグルメも多彩なコスパ最強国",
  },
  PH: {
    name: "フィリピン", flag: "🇵🇭", lat: 12.9, lng: 121.8, continent: "アジア",
    bestSeason: "乾季（12〜5月）", flightHours: 4.5,
    currency: "PHP", currencyName: "ペソ", rateToJPY: 2.6,
    flightMin: 40000, flightMax: 120000, hotelMin: 4000, hotelMax: 25000, localMin: 2000, localMax: 10000,
    topSpots: ["ボラカイ島", "パラワン島エルニド", "コロン（世界最高のダイビング）", "チョコレートヒルズ", "マニライントラムロス", "セブ島", "シャルガオ島", "バナウェ棚田"],
    description: "7,000以上の島々。透明度抜群のビーチとダイビングが最大の魅力",
  },
  FR: {
    name: "フランス", flag: "🇫🇷", lat: 46.2, lng: 2.2, continent: "ヨーロッパ",
    bestSeason: "春（4〜6月）・秋（9〜11月）", flightHours: 14,
    currency: "EUR", currencyName: "ユーロ", rateToJPY: 162,
    flightMin: 100000, flightMax: 280000, hotelMin: 12000, hotelMax: 50000, localMin: 8000, localMax: 25000,
    topSpots: ["エッフェル塔", "ルーブル美術館", "ヴェルサイユ宮殿", "モン・サン＝ミシェル", "ニース海岸", "コート・ダジュール", "シャンゼリゼ通り", "オルセー美術館"],
    description: "芸術・美食・ファッションの首都パリ。南仏の海岸線や城下町も魅力",
  },
  IT: {
    name: "イタリア", flag: "🇮🇹", lat: 41.9, lng: 12.6, continent: "ヨーロッパ",
    bestSeason: "春（4〜6月）・秋（9〜11月）", flightHours: 13,
    currency: "EUR", currencyName: "ユーロ", rateToJPY: 162,
    flightMin: 100000, flightMax: 280000, hotelMin: 10000, hotelMax: 45000, localMin: 7000, localMax: 22000,
    topSpots: ["コロッセオ", "バチカン美術館", "ヴェネツィア運河", "フィレンツェ大聖堂", "アマルフィ海岸", "シチリア島", "トスカーナの丘", "ポンペイ遺跡"],
    description: "ローマ・ヴェネツィア・フィレンツェの芸術三都市。パスタもピザも本場",
  },
  ES: {
    name: "スペイン", flag: "🇪🇸", lat: 40.5, lng: -3.7, continent: "ヨーロッパ",
    bestSeason: "春（4〜6月）・秋（9〜11月）", flightHours: 15,
    currency: "EUR", currencyName: "ユーロ", rateToJPY: 162,
    flightMin: 100000, flightMax: 280000, hotelMin: 9000, hotelMax: 40000, localMin: 6000, localMax: 20000,
    topSpots: ["サグラダ・ファミリア", "グエル公園", "プラド美術館", "アルハンブラ宮殿", "セビリア大聖堂", "バルセロナのゴシック地区", "マドリードのソル広場", "イビサ島"],
    description: "ガウディ建築とフラメンコ。情熱的な文化とバルグルメが旅を彩る",
  },
  DE: {
    name: "ドイツ", flag: "🇩🇪", lat: 51.2, lng: 10.5, continent: "ヨーロッパ",
    bestSeason: "夏（6〜8月）・秋（オクトーバーフェスト）", flightHours: 13,
    currency: "EUR", currencyName: "ユーロ", rateToJPY: 162,
    flightMin: 90000, flightMax: 270000, hotelMin: 10000, hotelMax: 40000, localMin: 7000, localMax: 20000,
    topSpots: ["ノイシュヴァンシュタイン城", "ブランデンブルク門", "ケルン大聖堂", "ロマンチック街道", "ミュンヘン英語庭園", "ベルリン博物館島", "ハイデルベルク城", "ドレスデン旧市街"],
    description: "おとぎ話の城と歴史ある旧市街。ビール文化とクリスマスマーケットも魅力",
  },
  GB: {
    name: "イギリス", flag: "🇬🇧", lat: 54.4, lng: -2.2, continent: "ヨーロッパ",
    bestSeason: "夏（6〜8月）", flightHours: 14,
    currency: "GBP", currencyName: "ポンド", rateToJPY: 193,
    flightMin: 90000, flightMax: 270000, hotelMin: 14000, hotelMax: 55000, localMin: 10000, localMax: 30000,
    topSpots: ["バッキンガム宮殿", "ロンドン塔", "大英博物館", "ストーンヘンジ", "コッツウォルズ", "エジンバラ城", "スコットランドハイランド", "ウィンザー城"],
    description: "歴史と文化の宝庫ロンドン。アフタヌーンティーとパブカルチャーも体験",
  },
  CH: {
    name: "スイス", flag: "🇨🇭", lat: 46.9, lng: 8.2, continent: "ヨーロッパ",
    bestSeason: "夏（6〜9月）・冬スキー（12〜3月）", flightHours: 13,
    currency: "CHF", currencyName: "スイスフラン", rateToJPY: 173,
    flightMin: 100000, flightMax: 280000, hotelMin: 18000, hotelMax: 70000, localMin: 12000, localMax: 35000,
    topSpots: ["マッターホルン", "ユングフラウヨッホ", "インターラーケン", "ルツェルン湖", "グリンデルワルト", "ジュネーブ旧市街", "ベルン旧市街", "アーレシュルフト（峡谷）"],
    description: "アルプスの絶景と時計・チョコレートの国。物価は高いが景色は世界最高峰",
  },
  AT: {
    name: "オーストリア", flag: "🇦🇹", lat: 47.5, lng: 14.6, continent: "ヨーロッパ",
    bestSeason: "春（4〜6月）・冬（12〜2月）", flightHours: 13,
    currency: "EUR", currencyName: "ユーロ", rateToJPY: 162,
    flightMin: 100000, flightMax: 280000, hotelMin: 10000, hotelMax: 40000, localMin: 7000, localMax: 22000,
    topSpots: ["シェーンブルン宮殿", "ザルツブルク旧市街", "ハルシュタット", "ウィーン国立歌劇場", "ウィーン美術史美術館", "インスブルック旧市街", "グロースグロックナー", "ウィーン中央市場"],
    description: "音楽と宮殿の帝都ウィーン。ハルシュタットの湖畔の村は世界一美しいとも",
  },
  CZ: {
    name: "チェコ", flag: "🇨🇿", lat: 49.8, lng: 15.5, continent: "ヨーロッパ",
    bestSeason: "春〜秋（4〜10月）", flightHours: 13,
    currency: "CZK", currencyName: "コルナ", rateToJPY: 6.6,
    flightMin: 100000, flightMax: 270000, hotelMin: 7000, hotelMax: 25000, localMin: 4000, localMax: 12000,
    topSpots: ["プラハ城", "カレル橋", "旧市街広場（天文時計）", "チェスキー・クルムロフ", "カルロヴィ・ヴァリ", "クトナー・ホラ（人骨教会）", "プラハのユダヤ地区", "ヴィシェフラット城"],
    description: "黄金の街プラハ。中世の街並みがそのまま残り、ビールも世界最高水準",
  },
  NL: {
    name: "オランダ", flag: "🇳🇱", lat: 52.3, lng: 5.3, continent: "ヨーロッパ",
    bestSeason: "春（チューリップ：4〜5月）・夏（6〜8月）", flightHours: 13,
    currency: "EUR", currencyName: "ユーロ", rateToJPY: 162,
    flightMin: 90000, flightMax: 270000, hotelMin: 11000, hotelMax: 40000, localMin: 7000, localMax: 20000,
    topSpots: ["アムステルダム運河", "キューケンホフ公園（チューリップ）", "ゴッホ美術館", "アンネ・フランクの家", "風車村ザーンセ・スカンス", "デルフト旧市街", "マウリッツハイス美術館（真珠の耳飾りの少女）", "ライデン"],
    description: "運河と風車とチューリップ。ヴァン・ゴッホや「真珠の耳飾りの少女」の故郷",
  },
  PT: {
    name: "ポルトガル", flag: "🇵🇹", lat: 39.4, lng: -8.2, continent: "ヨーロッパ",
    bestSeason: "春（3〜5月）・秋（9〜11月）", flightHours: 15,
    currency: "EUR", currencyName: "ユーロ", rateToJPY: 162,
    flightMin: 100000, flightMax: 280000, hotelMin: 8000, hotelMax: 30000, localMin: 5000, localMax: 15000,
    topSpots: ["リスボン旧市街（アルファマ）", "シントラの宮殿群", "ポルト旧市街", "ドウロ渓谷", "アルガルヴェのビーチ", "ファティマ聖地", "エヴォラ旧市街", "アゾレス諸島"],
    description: "ヨーロッパで最もコスパの良い旅先の一つ。ファドの音楽とパステル・デ・ナタが名物",
  },
  GR: {
    name: "ギリシャ", flag: "🇬🇷", lat: 39.1, lng: 22.0, continent: "ヨーロッパ",
    bestSeason: "春〜初夏（4〜6月）・秋（9〜10月）", flightHours: 13,
    currency: "EUR", currencyName: "ユーロ", rateToJPY: 162,
    flightMin: 110000, flightMax: 290000, hotelMin: 8000, hotelMax: 40000, localMin: 5000, localMax: 18000,
    topSpots: ["アクロポリス（パルテノン神殿）", "サントリーニ島イア", "ミコノス島", "デルフィ遺跡", "メテオラ修道院", "クレタ島クノッソス宮殿", "ロードス島旧市街", "ザキントス島"],
    description: "青と白の絶景サントリーニ。古代遺跡と美しいエーゲ海の島々",
  },
  TR: {
    name: "トルコ", flag: "🇹🇷", lat: 38.9, lng: 35.2, continent: "ヨーロッパ/アジア",
    bestSeason: "春（4〜5月）・秋（9〜10月）", flightHours: 12,
    currency: "TRY", currencyName: "リラ", rateToJPY: 4.4,
    flightMin: 80000, flightMax: 220000, hotelMin: 5000, hotelMax: 25000, localMin: 3000, localMax: 12000,
    topSpots: ["カッパドキア（気球）", "アヤソフィア", "パムッカレ石灰棚", "トプカプ宮殿", "エフェソス遺跡", "グランドバザール", "ボスポラス海峡クルーズ", "アンタルヤ旧市街"],
    description: "東西文明が交差する国。カッパドキアの気球と青いモスクは必見",
  },
  US: {
    name: "アメリカ", flag: "🇺🇸", lat: 37.1, lng: -95.7, continent: "北米",
    bestSeason: "地域による（ニューヨーク：春秋、ハワイ：通年）", flightHours: 9,
    currency: "USD", currencyName: "ドル", rateToJPY: 155,
    flightMin: 80000, flightMax: 250000, hotelMin: 12000, hotelMax: 60000, localMin: 8000, localMax: 30000,
    topSpots: ["タイムズスクエア（ニューヨーク）", "グランドキャニオン", "ラスベガスのストリップ", "ゴールデンゲートブリッジ", "ハワイ・ワイキキビーチ", "イエローストーン国立公園", "ディズニーワールド", "ナイアガラの滝"],
    description: "広大な国土に多様な魅力。大都市・自然・テーマパーク・ビーチが揃う",
  },
  CA: {
    name: "カナダ", flag: "🇨🇦", lat: 56.1, lng: -106.3, continent: "北米",
    bestSeason: "夏（6〜9月）・紅葉（9〜10月）", flightHours: 10,
    currency: "CAD", currencyName: "カナダドル", rateToJPY: 113,
    flightMin: 90000, flightMax: 250000, hotelMin: 12000, hotelMax: 45000, localMin: 8000, localMax: 25000,
    topSpots: ["バンフ国立公園", "ナイアガラの滝", "バンクーバー・スタンレーパーク", "トロント CNタワー", "モントリオール旧市街", "ケベック旧市街", "ホエールウォッチング（ケベック）", "オーロラ（ユーコン）"],
    description: "世界最高の大自然。バンフの絶景からオーロラまで、スケールが違う",
  },
  AU: {
    name: "オーストラリア", flag: "🇦🇺", lat: -25.3, lng: 133.8, continent: "オセアニア",
    bestSeason: "春秋（9〜11月・3〜5月）", flightHours: 10,
    currency: "AUD", currencyName: "オーストラリアドル", rateToJPY: 100,
    flightMin: 70000, flightMax: 200000, hotelMin: 10000, hotelMax: 40000, localMin: 7000, localMax: 25000,
    topSpots: ["シドニーオペラハウス", "グレートバリアリーフ", "ウルル（エアーズロック）", "ボンダイビーチ", "ケアンズ熱帯雨林", "メルボルン・グレートオーシャンロード", "フィリップ島（ペンギン）", "ブルーマウンテンズ"],
    description: "大自然とワイルドライフ。コアラやカンガルーとの出会いも忘れられない体験",
  },
  NZ: {
    name: "ニュージーランド", flag: "🇳🇿", lat: -40.9, lng: 174.9, continent: "オセアニア",
    bestSeason: "夏（12〜2月）・秋（3〜5月）", flightHours: 11,
    currency: "NZD", currencyName: "NZドル", rateToJPY: 91,
    flightMin: 80000, flightMax: 200000, hotelMin: 9000, hotelMax: 35000, localMin: 6000, localMax: 22000,
    topSpots: ["ミルフォードサウンド", "マウントクック国立公園", "ホビットン（映画ロケ地）", "クイーンズタウン", "ロトルア地熱地帯", "ワイトモ洞窟（蛍光イカ）", "アベルタスマン国立公園", "マタマタ"],
    description: "指輪物語の舞台。フィヨルド・氷河・バンジージャンプの冒険の国",
  },
  AE: {
    name: "UAE（ドバイ）", flag: "🇦🇪", lat: 23.4, lng: 53.8, continent: "中東",
    bestSeason: "冬（11〜3月）", flightHours: 10,
    currency: "AED", currencyName: "ディルハム", rateToJPY: 42,
    flightMin: 70000, flightMax: 200000, hotelMin: 15000, hotelMax: 80000, localMin: 8000, localMax: 35000,
    topSpots: ["ブルジュ・ハリファ（世界一高いビル）", "パームジュメイラ", "ドバイモール", "デザートサファリ", "ドバイクリーク（昔ながらの地区）", "アブダビ・シェイクザイードモスク", "ドバイフレーム", "Gold Souk（金市場）"],
    description: "砂漠に建つ超近代都市ドバイ。世界一の高層ビルと超豪華ホテルが集結",
  },
  EG: {
    name: "エジプト", flag: "🇪🇬", lat: 26.8, lng: 30.8, continent: "アフリカ",
    bestSeason: "冬（11〜2月）", flightHours: 13,
    currency: "EGP", currencyName: "エジプトポンド", rateToJPY: 4.7,
    flightMin: 80000, flightMax: 200000, hotelMin: 5000, hotelMax: 25000, localMin: 3000, localMax: 12000,
    topSpots: ["ギザのピラミッド・スフィンクス", "カルナック神殿", "ルクソール神殿", "アブ・シンベル神殿", "エジプト考古学博物館", "ナイル川クルーズ", "紅海ダイビング（ダハブ）", "シナイ山"],
    description: "人類最古の文明エジプト。5000年の歴史と砂漠の絶景",
  },
  MA: {
    name: "モロッコ", flag: "🇲🇦", lat: 31.8, lng: -7.1, continent: "アフリカ",
    bestSeason: "春（3〜5月）・秋（9〜11月）", flightHours: 15,
    currency: "MAD", currencyName: "ディルハム", rateToJPY: 15,
    flightMin: 100000, flightMax: 250000, hotelMin: 5000, hotelMax: 25000, localMin: 3000, localMax: 10000,
    topSpots: ["フェズのメディナ（世界最大の旧市街）", "マラケシュ・ジャマ・エル・フナ広場", "サハラ砂漠（メルズーガ）", "シャウエン（青い街）", "アイト・ベン・ハドゥ（世界遺産）", "エッサウィラ旧港", "バヒア宮殿", "アトラス山脈トレッキング"],
    description: "青い街シャウエンとサハラ砂漠。アラブ・ベルベル・ヨーロッパが交差する神秘の国",
  },
  MV: {
    name: "モルディブ", flag: "🇲🇻", lat: 3.2, lng: 73.2, continent: "アジア",
    bestSeason: "乾季（12〜4月）", flightHours: 9,
    currency: "MVR", currencyName: "ルフィア", rateToJPY: 10,
    flightMin: 80000, flightMax: 220000, hotelMin: 30000, hotelMax: 200000, localMin: 5000, localMax: 20000,
    topSpots: ["水上コテージ（オーバーウォーターバンガロー）", "スノーケリング・ダイビング", "バイオルミネッセンスビーチ", "マレ市内観光", "フィッシングツアー", "ドルフィンウォッチング", "サンセットクルーズ", "シュノーケルポイント巡り"],
    description: "地上の楽園モルディブ。透明度100%の海と水上コテージで夢のような体験",
  },
};

export function getCountry(code: string): CountryData | null {
  return COUNTRIES[code] ?? null;
}

export function getCountriesByCode(codes: string[]): Array<CountryData & { code: string }> {
  return codes
    .map((code) => {
      const c = COUNTRIES[code];
      return c ? { ...c, code } : null;
    })
    .filter(Boolean) as Array<CountryData & { code: string }>;
}

export const TRIP_TYPES = [
  { value: "casual", label: "気軽たびっ", icon: "🌸", desc: "3〜5日・コンパクトに楽しむ" },
  { value: "sightseeing", label: "がっつり観光", icon: "🗺️", desc: "7〜10日・王道ルートを制覇" },
  { value: "resort", label: "のんびりリゾート", icon: "🏖️", desc: "5〜7日・滞在型でゆっくり" },
  { value: "gourmet", label: "グルメ特化", icon: "🍽️", desc: "食を軸にした旅" },
  { value: "custom", label: "カスタム", icon: "✏️", desc: "日数・スタイルを自分で指定" },
] as const;

export const TRIP_TYPE_DAYS: Record<string, number> = {
  casual: 4,
  sightseeing: 8,
  resort: 6,
  gourmet: 5,
  custom: 5,
};
