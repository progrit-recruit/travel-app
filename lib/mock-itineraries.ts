/**
 * デモ用の想定旅程テンプレート
 * generate-plan API の "generate" アクションはここから返す（AI呼び出しなし）
 * 旅行日数に応じて days をスライスし、hotel.nights / total_cost を自動調整する
 */

import type { Itinerary, DayPlan } from "@/lib/trip-plan";
import { COUNTRIES } from "@/lib/country-data";

/** 国コードごとのテンプレート（days は最大日数分） */
const TEMPLATES: Record<
  string,
  { days: DayPlan[]; hotel: Itinerary["hotel"]; flight: Itinerary["flight"]; highlights: string[]; localCostPerDay: number }
> = {
  /* ───────── 韓国（KR）───────── */
  KR: {
    flight: { airline: "大韓航空 KE701", cost: 38000, duration: "約2時間30分" },
    hotel: { name: "明洞ビジネスホテル", cost_per_night: 12500, nights: 3 },
    highlights: [
      "景福宮の衛兵交代式と朝鮮王朝の歴史を体感",
      "明洞・弘大で韓国コスメ＆ファッションを満喫",
      "本場サムギョプサルとチキン、韓国グルメを食べ尽くす",
    ],
    localCostPerDay: 8000,
    days: [
      {
        day: 1, title: "ソウル到着・明洞ナイトマーケット",
        slots: [
          { time: "13:00", spot: "仁川国際空港 着", duration: "1時間", transport: "飛行機", cost: 0, comment: "入国審査・両替を済ませ、ARex（空港鉄道）でソウル駅へ" },
          { time: "15:30", spot: "明洞ホテル チェックイン", duration: "30分", transport: "ARex → 地下鉄", cost: 1200, comment: "荷物を預けて身軽に動こう" },
          { time: "16:30", spot: "明洞ショッピングストリート", duration: "2時間", transport: "徒歩", cost: 5000, comment: "コスメ・ファッションのブランドが集結する韓国最大の商業地" },
          { time: "18:30", spot: "明洞屋台グルメ", duration: "1.5時間", transport: "徒歩", cost: 3000, comment: "トッポキ・ホットク・チーズドッグをハシゴ食い" },
          { time: "20:00", spot: "N ソウルタワー 夜景", duration: "1時間", transport: "タクシー", cost: 2000, comment: "ソウルの夜景を一望。展望台入場料含む" },
        ],
      },
      {
        day: 2, title: "王宮と伝統文化の一日",
        slots: [
          { time: "09:00", spot: "景福宮 衛兵交代式", duration: "2時間", transport: "地下鉄", cost: 1000, comment: "朝10:00から衛兵交代式が行われる。韓服レンタルで入場無料に" },
          { time: "11:30", spot: "北村韓屋村", duration: "1時間30分", transport: "徒歩", cost: 0, comment: "石畳の路地に韓屋が並ぶ絶好のフォトスポット" },
          { time: "13:00", spot: "仁寺洞 ランチ & 伝統工芸", duration: "2時間", transport: "徒歩", cost: 4000, comment: "韓定食ランチと伝統土産探し" },
          { time: "15:30", spot: "昌徳宮と秘苑 ガイドツアー", duration: "2時間", transport: "徒歩", cost: 1500, comment: "ユネスコ世界遺産。秘苑は事前予約ガイドツアーで入園" },
          { time: "18:30", spot: "弘大 夕食 & ナイトライフ", duration: "2.5時間", transport: "地下鉄", cost: 5000, comment: "大学街の活気あるエリア。フライドチキン × 生マッコリで乾杯" },
        ],
      },
      {
        day: 3, title: "江南 & 現代ソウル探検",
        slots: [
          { time: "09:30", spot: "東大門デザインプラザ（DDP）", duration: "1.5時間", transport: "地下鉄", cost: 0, comment: "ザハ・ハディド設計の未来的建築。展示は要別途入場料" },
          { time: "11:30", spot: "COEX Mall & 別マダン図書館", duration: "1.5時間", transport: "地下鉄", cost: 500, comment: "インスタ映えの本棚コリドール。COEX水族館もオプション" },
          { time: "13:30", spot: "狎鴎亭ロデオ ランチ", duration: "1時間", transport: "徒歩", cost: 4500, comment: "おしゃれなカフェ・レストランが並ぶ江南のグルメストリート" },
          { time: "15:00", spot: "江南ショッピング", duration: "2時間", transport: "徒歩", cost: 6000, comment: "ブランドショップと韓国コスメを巡る" },
          { time: "17:30", spot: "漢江公園 夕景ピクニック", duration: "1.5時間", transport: "タクシー", cost: 2000, comment: "コンビニでピクニックセットを買って夕日を眺める韓国定番スポット" },
          { time: "19:30", spot: "本場サムギョプサルで締めディナー", duration: "1.5時間", transport: "タクシー", cost: 4000, comment: "炭火で焼く豚バラとサムジャン、エゴマで最後の夕食を" },
        ],
      },
      {
        day: 4, title: "帰国日・免税ショッピング",
        slots: [
          { time: "08:00", spot: "朝食 & 最後のコスメ買い出し", duration: "1.5時間", transport: "徒歩", cost: 1500, comment: "ホテル周辺でコムタン（牛骨スープ）の朝食。見逃した土産も確保" },
          { time: "10:00", spot: "ホテル チェックアウト", duration: "30分", transport: "ー", cost: 0, comment: "" },
          { time: "11:00", spot: "仁川国際空港 移動", duration: "1時間", transport: "ARex 直通", cost: 1200, comment: "出発の3時間前には空港到着を" },
          { time: "13:30", spot: "免税店ショッピング & 搭乗", duration: "1時間", transport: "ー", cost: 3000, comment: "出国後の免税エリアで最後のお買い物" },
          { time: "14:40", spot: "仁川発 → 日本 帰国", duration: "2時間30分", transport: "飛行機", cost: 0, comment: "" },
        ],
      },
    ],
  },

  /* ───────── タイ（TH）───────── */
  TH: {
    flight: { airline: "タイ国際航空 TG682", cost: 68000, duration: "約6時間30分" },
    hotel: { name: "アヴァニ リバーサイド バンコク", cost_per_night: 15000, nights: 5 },
    highlights: [
      "ワット・ポーの涅槃仏とチャオプラヤー川の夕日クルーズ",
      "フローティングマーケットでタイ料理と水上生活を体験",
      "プーケット・ピピ島のエメラルドグリーンの海でシュノーケリング",
    ],
    localCostPerDay: 6000,
    days: [
      {
        day: 1, title: "バンコク到着・チャオプラヤー川沿い散策",
        slots: [
          { time: "14:00", spot: "スワンナプーム国際空港 着", duration: "1時間30分", transport: "飛行機", cost: 0, comment: "入国後、空港鉄道でアソーク駅へ。ホテルはチャオプラヤー川沿い" },
          { time: "17:00", spot: "ホテル チェックイン & プール", duration: "1時間", transport: "エアポートレール", cost: 1500, comment: "リバービューの部屋でチェックイン。ルーフトッププールで南国気分" },
          { time: "18:30", spot: "チャオプラヤー川 サンセットクルーズ", duration: "1時間30分", transport: "ホテル送迎ボート", cost: 3000, comment: "川沿いに輝く寺院群と夕日が幻想的" },
          { time: "20:30", spot: "アジアティーク・ザ・リバーフロント", duration: "1.5時間", transport: "無料シャトルボート", cost: 2500, comment: "川沿いの夜市でパッタイとタイ式マッサージを初体験" },
        ],
      },
      {
        day: 2, title: "バンコク三大寺院と王宮エリア",
        slots: [
          { time: "08:30", spot: "ワット・プラケオ（エメラルド寺院）& 王宮", duration: "2時間", transport: "ボート", cost: 1500, comment: "タイで最も神聖な寺院。肌を隠す服装が必須" },
          { time: "11:00", spot: "ワット・ポー 涅槃仏", duration: "1時間30分", transport: "徒歩", cost: 500, comment: "全長46mの金色の涅槃仏。タイ古式マッサージ発祥の地でもある" },
          { time: "13:00", spot: "ターオ・リア テラスランチ", duration: "1時間", transport: "徒歩", cost: 2500, comment: "リバービューのカフェでガパオライスとスムージー" },
          { time: "14:30", spot: "ワット・アルン（暁の寺）", duration: "1時間30分", transport: "渡し船", cost: 400, comment: "対岸から眺める姿が美しい。頂上まで登れる展望スポット" },
          { time: "17:00", spot: "カオサン通り & スーパーショッピング", duration: "2時間", transport: "タクシー", cost: 3000, comment: "バックパッカーの聖地。ゾウのパンツ・カラフルな雑貨などお土産探し" },
          { time: "20:00", spot: "屋台街 ヤワラート（中華街）ディナー", duration: "2時間", transport: "タクシー", cost: 3000, comment: "バンコクの中華街で本場の海鮮タイ料理を堪能" },
        ],
      },
      {
        day: 3, title: "ダムヌン・サドゥアック フローティングマーケット",
        slots: [
          { time: "06:30", spot: "ホテル出発（早朝ツアー）", duration: "1時間30分", transport: "送迎バス", cost: 0, comment: "市場は午前中が活気あり。早起きが吉" },
          { time: "08:30", spot: "ダムヌン・サドゥアック水上市場", duration: "2時間", transport: "ロングテールボート", cost: 4000, comment: "手こぎボートで水上市場を巡り、新鮮なフルーツとカオニャオを味わう" },
          { time: "11:30", spot: "ナコーンパトム・プラパトム寺院", duration: "1時間", transport: "送迎バス", cost: 500, comment: "世界最大の仏塔を誇るタイ最古の仏教寺院" },
          { time: "14:00", spot: "バンコク帰着 & スパ体験", duration: "2時間", transport: "送迎バス", cost: 5000, comment: "帰着後はホテルスパでハーブボールマッサージ。ヘロヘロの体を癒す" },
          { time: "17:00", spot: "サイアム・パラゴン ショッピング", duration: "2時間", transport: "BTS", cost: 4000, comment: "バンコク最大のショッピングモール。タイブランドのコスメも充実" },
          { time: "20:00", spot: "ルーフトップバー「スカイバー」", duration: "1.5時間", transport: "タクシー", cost: 5000, comment: "映画『ハングオーバー2』のロケ地。63階から望むバンコク夜景" },
        ],
      },
      {
        day: 4, title: "プーケット移動 & ビーチリゾート",
        slots: [
          { time: "08:00", spot: "バンコク発 → プーケット（国内線）", duration: "1時間20分", transport: "国内線", cost: 8000, comment: "早朝便でプーケットへ移動" },
          { time: "10:30", spot: "プーケットホテル チェックイン & ビーチ", duration: "3時間", transport: "タクシー", cost: 1500, comment: "パトンビーチまたはカタビーチへ。ビーチチェアでのんびり" },
          { time: "14:00", spot: "シュノーケリング ボートツアー（ピピ島）", duration: "4時間", transport: "スピードボート", cost: 8000, comment: "透明度抜群のエメラルド海でカラフルな熱帯魚と泳ぐ" },
          { time: "19:00", spot: "バンザーン・シーフードマーケット ディナー", duration: "2時間", transport: "タクシー", cost: 4000, comment: "好きな魚介を選んで調理してもらえる。ロブスターも絶品" },
        ],
      },
      {
        day: 5, title: "プーケット ゆったりリゾートDAY",
        slots: [
          { time: "09:00", spot: "象乗り体験 & 象保護施設ツアー", duration: "2時間", transport: "ホテル送迎", cost: 6000, comment: "倫理的な象保護プログラム参加。ゾウと水浴び体験も" },
          { time: "12:00", spot: "ビーチサイドレストランでランチ", duration: "1時間30分", transport: "徒歩", cost: 3500, comment: "波音を聴きながらグリーンカレーとマンゴースティッキーライス" },
          { time: "14:00", spot: "プーケット旧市街（オールドタウン）", duration: "2時間", transport: "タクシー", cost: 0, comment: "ポルトガル風のカラフルな街並み。カフェとギャラリーが点在" },
          { time: "17:00", spot: "プロムテープ岬 サンセット", duration: "1時間30分", transport: "タクシー", cost: 0, comment: "プーケットで最も美しいと言われる夕日スポット" },
          { time: "19:30", spot: "タイ古式マッサージ & ディナー", duration: "2時間", transport: "徒歩", cost: 5000, comment: "2時間のトラディショナルマッサージで旅の疲れを癒して最終夜へ" },
        ],
      },
      {
        day: 6, title: "帰国日",
        slots: [
          { time: "08:00", spot: "最後のビーチ散歩 & 朝食", duration: "1時間30分", transport: "徒歩", cost: 1500, comment: "朝の静かなビーチを散歩しながらパパイヤサラダの朝食" },
          { time: "10:30", spot: "プーケット国際空港 移動", duration: "30分", transport: "タクシー", cost: 1200, comment: "出発3時間前を目安に空港へ" },
          { time: "13:30", spot: "プーケット発 → バンコク経由 → 日本", duration: "約8時間", transport: "飛行機", cost: 0, comment: "タイ国際航空でバンコク経由帰国" },
        ],
      },
    ],
  },

  /* ───────── フランス（FR）───────── */
  FR: {
    flight: { airline: "エールフランス AF291", cost: 128000, duration: "約12時間30分" },
    hotel: { name: "ホテル デ ザール モンマルトル", cost_per_night: 22000, nights: 7 },
    highlights: [
      "エッフェル塔の夜景と夕暮れのセーヌ川クルーズ",
      "ルーヴル美術館でモナ・リザと『ミロのヴィーナス』を鑑賞",
      "ヴェルサイユ宮殿の鏡の回廊と整形式庭園の圧倒的スケール",
    ],
    localCostPerDay: 18000,
    days: [
      {
        day: 1, title: "パリ到着・シャンゼリゼ散策",
        slots: [
          { time: "09:00", spot: "シャルル・ド・ゴール国際空港 着", duration: "1時間30分", transport: "飛行機", cost: 0, comment: "入国後、RERでパリ市内へ。Navigo週間パスを購入しておくと便利" },
          { time: "12:00", spot: "ホテル チェックイン（モンマルトル）", duration: "30分", transport: "RER + 地下鉄", cost: 2200, comment: "モンマルトルの丘の麓。芸術家の街で異国情緒満点" },
          { time: "14:00", spot: "シャンゼリゼ大通り & 凱旋門", duration: "2時間", transport: "地下鉄", cost: 1600, comment: "凱旋門の屋上から360°パノラマ。夕暮れ時が特におすすめ" },
          { time: "17:00", spot: "エッフェル塔 & トロカデロ庭園", duration: "2時間", transport: "地下鉄", cost: 2600, comment: "夕暮れから夜景へ。毎正時にきらめくライトアップを堪能" },
          { time: "20:30", spot: "ビストロでフレンチの夕食", duration: "1.5時間", transport: "地下鉄", cost: 7000, comment: "前菜・メイン・デザートの3コースと地元産ワインで初夜を祝う" },
        ],
      },
      {
        day: 2, title: "ルーヴル美術館とセーヌ川クルーズ",
        slots: [
          { time: "09:00", spot: "ルーヴル美術館", duration: "3時間", transport: "地下鉄", cost: 1800, comment: "モナ・リザ、ミロのヴィーナス、ニケ像の三大名作を効率よく巡る" },
          { time: "13:00", spot: "チュイルリー庭園でランチピクニック", duration: "1時間", transport: "徒歩", cost: 2000, comment: "ルーヴル前の庭園でバゲットサンドとクロワッサンのピクニック" },
          { time: "14:30", spot: "オルセー美術館", duration: "2時間", transport: "徒歩", cost: 1600, comment: "印象派の傑作が集結。モネ・ルノワール・ゴッホを堪能" },
          { time: "17:30", spot: "セーヌ川バトーパリジャン クルーズ", duration: "1時間30分", transport: "徒歩", cost: 1800, comment: "船上からエッフェル塔・ノートルダム・オルセーを一望" },
          { time: "20:00", spot: "マレ地区でディナー & 夜散歩", duration: "2時間", transport: "地下鉄", cost: 8000, comment: "トレンディなレストランが集まるマレ地区。ファラフェルも有名" },
        ],
      },
      {
        day: 3, title: "ヴェルサイユ宮殿 日帰り旅行",
        slots: [
          { time: "08:30", spot: "ヴェルサイユ宮殿 移動", duration: "40分", transport: "RER C線", cost: 700, comment: "パリ市内から約40分。早めに出て開館待ちの行列を避けよう" },
          { time: "09:30", spot: "ヴェルサイユ宮殿 見学", duration: "3時間", transport: "ー", cost: 2000, comment: "鏡の回廊・王の寝室・国王の大厩舎。音声ガイドで深掘り" },
          { time: "13:00", spot: "宮殿庭園でランチ", duration: "1時間", transport: "徒歩", cost: 3000, comment: "フランス式整形庭園を散策しながらカフェでランチ" },
          { time: "14:30", spot: "プチ・トリアノン & マリー・アントワネット農場", duration: "2時間", transport: "自転車", cost: 1000, comment: "王妃の別邸と農村体験施設。庭園の別の顔を楽しめる" },
          { time: "17:30", spot: "パリ帰着・モンパルナス散策", duration: "1.5時間", transport: "RER", cost: 700, comment: "夕食はモンパルナス界隈でクレープとガレット（そば粉のクレープ）" },
          { time: "20:00", spot: "クレープリーでブルターニュ料理ディナー", duration: "1.5時間", transport: "地下鉄", cost: 5000, comment: "" },
        ],
      },
      {
        day: 4, title: "モンマルトルと芸術の丘",
        slots: [
          { time: "09:00", spot: "サクレ・クール大聖堂 & モンマルトルの丘", duration: "2時間", transport: "地下鉄", cost: 0, comment: "丘の上からパリ全景を一望。朝の光の中の聖堂が神秘的" },
          { time: "11:30", spot: "テルトル広場 似顔絵 & 街歩き", duration: "1.5時間", transport: "徒歩", cost: 2000, comment: "画家たちが集まる広場。オリジナルの似顔絵を描いてもらえる" },
          { time: "13:30", spot: "モンマルトル老舗レストランでランチ", duration: "1時間", transport: "徒歩", cost: 5000, comment: "ルノワールらが通ったカフェが点在するエリア" },
          { time: "15:00", spot: "ピカソ美術館 & マレ散策", duration: "2時間", transport: "地下鉄", cost: 1400, comment: "ピカソの生涯を作品で辿る。マレ地区のギャラリー巡りもあわせて" },
          { time: "18:00", spot: "マルシェ（フランス式市場）散策", duration: "1時間", transport: "地下鉄", cost: 2000, comment: "地元のフロマージュ・ハム・ワインを購入してホテルでつまみ食い" },
          { time: "20:00", spot: "ムーラン・ルージュ ショー", duration: "2時間", transport: "地下鉄", cost: 15000, comment: "フレンチカンカンのレビューショー。シャンパン1本付きVIP席がおすすめ" },
        ],
      },
      {
        day: 5, title: "ノルマンディー or ロワール古城 選択日",
        slots: [
          { time: "08:00", spot: "日帰りツアー出発（モン・サン・ミッシェル）", duration: "1時間30分", transport: "ツアーバス", cost: 0, comment: "パリ発日帰りツアーに参加。モン・サン・ミッシェルまで約4時間" },
          { time: "12:00", spot: "モン・サン・ミッシェル 島内観光", duration: "3時間", transport: "ー", cost: 3000, comment: "修道院と中世の石畳。潮の干満で表情が変わる世界遺産" },
          { time: "16:00", spot: "帰路・車中でワインと軽食", duration: "4時間", transport: "ツアーバス", cost: 2000, comment: "" },
          { time: "20:30", spot: "パリ着・ホテル近くのビストロで夕食", duration: "1.5時間", transport: "ー", cost: 6000, comment: "" },
        ],
      },
      {
        day: 6, title: "マルシェ & パリジャン体験",
        slots: [
          { time: "09:00", spot: "バスティーユのマルシェ（日曜市）", duration: "1.5時間", transport: "地下鉄", cost: 3000, comment: "地元民も買いに来るオープンマーケット。食材・花・骨董品が勢ぞろい" },
          { time: "11:00", spot: "ボン・マルシェ & ランプ・エピスリー", duration: "2時間", transport: "地下鉄", cost: 5000, comment: "パリ最古の百貨店と隣接の高級食料品館でお土産探し" },
          { time: "14:00", spot: "ロダン美術館 & アンヴァリッド", duration: "2時間", transport: "徒歩", cost: 1400, comment: "考える人の原作と、ナポレオンの墓廟を同時に鑑賞" },
          { time: "17:00", spot: "サン・ジェルマン・デ・プレ散策 & アペロ", duration: "1.5時間", transport: "徒歩", cost: 3000, comment: "カフェ・ド・フロールでサルトルゆかりのカフェクレームを" },
          { time: "20:30", spot: "フレンチ・ファインダイニング 送別ディナー", duration: "2時間", transport: "地下鉄", cost: 18000, comment: "最終夜はミシュランビブグルマン掲載レストランで特別ディナー" },
        ],
      },
      {
        day: 7, title: "帰国日・最後のパリ",
        slots: [
          { time: "08:00", spot: "ホテル周辺のブーランジェリーで朝食", duration: "1時間", transport: "徒歩", cost: 1500, comment: "クロワッサンとカフェ・オ・レで最後のパリの朝を" },
          { time: "10:00", spot: "お土産最終調達（マリアージュ・フレール / ファーション）", duration: "1時間", transport: "地下鉄", cost: 8000, comment: "紅茶・マカロン・スカーフをラストスパートで購入" },
          { time: "12:00", spot: "ホテル チェックアウト & 空港移動", duration: "1時間30分", transport: "RER B線", cost: 1100, comment: "シャルル・ド・ゴール空港まで約45分" },
          { time: "14:30", spot: "空港ラウンジ & 搭乗", duration: "1時間30分", transport: "ー", cost: 0, comment: "免税ショップを覗きつつ搭乗を待つ" },
          { time: "16:00", spot: "パリ発 → 日本 帰国", duration: "約13時間", transport: "飛行機", cost: 0, comment: "" },
        ],
      },
      {
        day: 8, title: "帰国（サマリー日）",
        slots: [
          { time: "09:00", spot: "日本 到着", duration: "ー", transport: "飛行機", cost: 0, comment: "お疲れ様でした。素晴らしいパリの思い出とともに帰国" },
        ],
      },
    ],
  },

  /* ───────── イタリア（IT）───────── */
  IT: {
    flight: { airline: "アリタリア航空 AZ787", cost: 118000, duration: "約12時間" },
    hotel: { name: "ホテル フォロ ロマーノ", cost_per_night: 20000, nights: 6 },
    highlights: [
      "コロッセオとローマ帝国の遺構を歩くタイムスリップ体験",
      "バチカン美術館でミケランジェロのシスティーナ礼拝堂を鑑賞",
      "フィレンツェのウフィツィ美術館でルネサンス絵画の傑作に感動",
    ],
    localCostPerDay: 16000,
    days: [
      {
        day: 1, title: "ローマ到着・トレヴィの泉",
        slots: [
          { time: "11:00", spot: "フィウミチーノ空港 着", duration: "1時間30分", transport: "飛行機", cost: 0, comment: "入国後、レオナルド・エクスプレスでテルミニ駅へ。約32分" },
          { time: "14:00", spot: "ホテル チェックイン（フォロ・ロマーノ近く）", duration: "30分", transport: "バス", cost: 1800, comment: "" },
          { time: "15:30", spot: "トレヴィの泉", duration: "1時間", transport: "徒歩", cost: 0, comment: "コインを投げて再訪を誓う。早夕方は観光客が少なめ" },
          { time: "17:00", spot: "スペイン広場 & トリニタ・デイ・モンティ教会", duration: "1時間30分", transport: "徒歩", cost: 0, comment: "135段の階段上から眺めるローマの街並み" },
          { time: "19:00", spot: "ナヴォーナ広場 ディナー", duration: "2時間", transport: "徒歩", cost: 8000, comment: "バロック彫刻に囲まれた広場でカルボナーラの本場を堪能" },
        ],
      },
      {
        day: 2, title: "コロッセオとフォロ・ロマーノ",
        slots: [
          { time: "09:00", spot: "コロッセオ 事前予約入場", duration: "2時間", transport: "地下鉄", cost: 1600, comment: "紀元72年建造の円形競技場。当時5万人が収容できた" },
          { time: "11:30", spot: "フォロ・ロマーノ & パラティーノの丘", duration: "2時間", transport: "徒歩", cost: 0, comment: "コロッセオのチケットで入場可。古代ローマの政治の中心地" },
          { time: "14:00", spot: "ジェラテリア(老舗ジェラート)でランチ後のスイーツ", duration: "30分", transport: "徒歩", cost: 1000, comment: "ピスタチオ＆ストラッチャテッラが定番" },
          { time: "15:30", spot: "カンピドーリオ広場 & カピトリーニ美術館", duration: "2時間", transport: "徒歩", cost: 1500, comment: "ミケランジェロ設計の広場。世界最古の公開美術館" },
          { time: "19:00", spot: "トラステヴェレ地区でディナー", duration: "2時間", transport: "バス", cost: 7000, comment: "地元ローマっ子が通うオステリアでアマトリチャーナ" },
        ],
      },
      {
        day: 3, title: "バチカン市国",
        slots: [
          { time: "08:30", spot: "バチカン美術館 事前予約入場", duration: "3時間", transport: "地下鉄", cost: 2800, comment: "世界最大の美術コレクション。システィーナ礼拝堂のフレスコ画は必見" },
          { time: "12:30", spot: "サン・ピエトロ大聖堂 & クーポラ登頂", duration: "2時間", transport: "徒歩", cost: 800, comment: "ローマ全景を見渡せる円蓋の頂上（537段の階段）へ挑戦" },
          { time: "15:30", spot: "カステル・サンタンジェロ", duration: "1時間30分", transport: "徒歩", cost: 1500, comment: "ローマ法王の避難城塞。テヴェレ川沿いの夕景が美しい" },
          { time: "18:00", spot: "リストランテでローマの夕食", duration: "2時間", transport: "タクシー", cost: 9000, comment: "カチョ・エ・ペペとティラミスで締め。自然派ワインをボトルで" },
        ],
      },
      {
        day: 4, title: "フィレンツェ日帰り",
        slots: [
          { time: "07:30", spot: "フィレンツェ移動（高速鉄道）", duration: "1時間30分", transport: "フレッチャロッサ", cost: 6000, comment: "ローマ・テルミニ発。フィレンツェ・サンタ・マリア・ノヴェッラ着" },
          { time: "09:30", spot: "ウフィツィ美術館", duration: "2時間30分", transport: "徒歩", cost: 2500, comment: "ボッティチェッリの『ヴィーナスの誕生』とレオナルド初期作品" },
          { time: "13:00", spot: "ランチ：フィオレンティーナ・ステーキ", duration: "1時間", transport: "徒歩", cost: 7000, comment: "Tボーンの分厚いビステッカ。ミディアムレアで注文するのがフィレンツェ流" },
          { time: "14:30", spot: "ドゥオーモ（花の聖母大聖堂）& 洗礼堂", duration: "2時間", transport: "徒歩", cost: 0, comment: "外観だけで圧倒される大聖堂。頂上からのパノラマが絶景" },
          { time: "17:30", spot: "ポンテ・ヴェッキオ & ミカエランジェロ広場 夕景", duration: "1時間", transport: "徒歩", cost: 0, comment: "アルノ川にかかる宝飾店橋。丘の上から夕暮れのフィレンツェを一望" },
          { time: "21:00", spot: "ローマ帰着", duration: "ー", transport: "フレッチャロッサ", cost: 6000, comment: "" },
        ],
      },
      {
        day: 5, title: "ローマの路地裏 & ショッピング",
        slots: [
          { time: "09:00", spot: "カンポ・デ・フィオーリ 朝市", duration: "1時間", transport: "バス", cost: 2000, comment: "野菜・スパイス・食材が並ぶ活気あるローカル市場" },
          { time: "10:30", spot: "パンテオン", duration: "1時間", transport: "徒歩", cost: 500, comment: "紀元前27年建造の神殿。完璧な球形ドームは2000年経った今も無補強" },
          { time: "12:30", spot: "スーパーマーケット＆デリでランチピクニック", duration: "1時間", transport: "徒歩", cost: 2000, comment: "コルネット・モッツァレラ・プロシュートで即席ピクニック" },
          { time: "14:00", spot: "ヴィア・コンドッティ ブランドショッピング", duration: "2時間", transport: "地下鉄", cost: 15000, comment: "グッチ・プラダ・フェンディ。イタリアブランドを本国価格で" },
          { time: "17:00", spot: "ボルゲーゼ公園 散策 & ギャラリー", duration: "2時間", transport: "地下鉄", cost: 200, comment: "ローマの肺ともいわれる緑の公園でコーヒー休憩" },
          { time: "20:00", spot: "最終夜のガストロノミアディナー", duration: "2時間", transport: "タクシー", cost: 12000, comment: "最後の夜はシェフのおまかせコースで旅を締めくくる" },
        ],
      },
      {
        day: 6, title: "ナポリ & ポンペイ日帰り（オプション）",
        slots: [
          { time: "08:00", spot: "ナポリ移動（高速鉄道）", duration: "1時間10分", transport: "フレッチャロッサ", cost: 5000, comment: "" },
          { time: "09:30", spot: "ポンペイ遺跡 見学", duration: "3時間", transport: "ポンペイ・スカヴィ駅", cost: 1800, comment: "79年のヴェスヴィオ噴火で埋もれた古代都市。時が止まった街を歩く" },
          { time: "14:00", spot: "ナポリで本場ピッツァ（マルゲリータ発祥の地）", duration: "1時間", transport: "ポンペイ→ナポリ", cost: 1500, comment: "ダ・ミケーレまたはソルビッロでナポリピッツァ。1枚900円ほど" },
          { time: "16:00", spot: "ナポリ歴史地区 & スパッカナポリ", duration: "1.5時間", transport: "徒歩", cost: 1000, comment: "ナポリ庶民の生活が溢れる路地裏。サン・セヴェーロ礼拝堂は必見" },
          { time: "19:30", spot: "ローマ帰着 & ホテルで休息", duration: "ー", transport: "フレッチャロッサ", cost: 5000, comment: "" },
        ],
      },
      {
        day: 7, title: "帰国日",
        slots: [
          { time: "08:00", spot: "ローマ最後の朝食（バール文化体験）", duration: "1時間", transport: "徒歩", cost: 500, comment: "イタリア人はエスプレッソをバー（カフェ）で立ち飲み。1杯100円ほど" },
          { time: "10:00", spot: "ホテル チェックアウト & 空港移動", duration: "1時間", transport: "タクシー", cost: 5000, comment: "フィウミチーノ空港まで約30分。タクシーは定額48€" },
          { time: "13:00", spot: "フィウミチーノ空港 搭乗", duration: "ー", transport: "ー", cost: 0, comment: "" },
          { time: "16:00", spot: "ローマ発 → 日本 帰国", duration: "約12時間", transport: "飛行機", cost: 0, comment: "" },
        ],
      },
    ],
  },

  /* ───────── 台湾（TW）───────── */
  TW: {
    flight: { airline: "チャイナエアライン CI107", cost: 32000, duration: "約3時間30分" },
    hotel: { name: "シーザーパーク台北", cost_per_night: 11000, nights: 3 },
    highlights: [
      "九份の赤提灯が灯る夕暮れとアジアのレトロ情緒",
      "夜市の食べ歩き（小籠包・胡椒餅・タピオカ）",
      "台北101展望台からの夜景と台湾茶の茶芸体験",
    ],
    localCostPerDay: 6000,
    days: [
      {
        day: 1, title: "台北到着・士林夜市デビュー",
        slots: [
          { time: "13:30", spot: "桃園国際空港 着", duration: "1時間", transport: "飛行機", cost: 0, comment: "MRTで台北市内へ。ICカード「悠遊カード」を購入しておくと便利" },
          { time: "15:30", spot: "ホテル チェックイン（台北駅エリア）", duration: "30分", transport: "MRT", cost: 700, comment: "" },
          { time: "17:00", spot: "中正紀念堂 & 衛兵交代式", duration: "1.5時間", transport: "MRT", cost: 0, comment: "毎正時（9〜17時）に行われる衛兵交代は見応え十分" },
          { time: "19:30", spot: "士林夜市 食べ歩き", duration: "2時間", transport: "MRT", cost: 3000, comment: "臭豆腐・鶏排（大鶏排）・芋圓でスタート。フルーツも絶品" },
          { time: "22:00", spot: "東区のバーでナイトキャップ", duration: "1時間", transport: "タクシー", cost: 2000, comment: "" },
        ],
      },
      {
        day: 2, title: "九份＆瑞芳 ノスタルジックな街歩き",
        slots: [
          { time: "09:00", spot: "台北発 → 九份 移動", duration: "1時間", transport: "電車+バス", cost: 800, comment: "瑞芳駅からバスで15分。片道650円程度" },
          { time: "10:30", spot: "九份 老街 散策", duration: "3時間", transport: "徒歩", cost: 2000, comment: "『千と千尋の神隠し』のモデルとも言われる赤提灯の街。雨の日も風情あり" },
          { time: "14:00", spot: "阿妹茶樓で台湾茶芸体験", duration: "1時間", transport: "徒歩", cost: 2500, comment: "九份の象徴的茶楼。高山烏龍茶と古早味点心を味わう" },
          { time: "16:00", spot: "台北帰着 & 迪化街 散策", duration: "1.5時間", transport: "バス+MRT", cost: 800, comment: "日本統治時代の建築が並ぶ問屋街。漢方・乾物・茶葉のお土産に最適" },
          { time: "19:00", spot: "寧夏夜市 ディナー", duration: "1.5時間", transport: "タクシー", cost: 2500, comment: "地元っ子御用達の夜市。蚵仔煎（牡蠣のオムレツ）とルーロー飯が絶品" },
          { time: "21:30", spot: "台北101 夜景観賞", duration: "1時間", transport: "MRT", cost: 1000, comment: "89階の展望台から夜の台北を一望。好天なら対岸の山まで" },
        ],
      },
      {
        day: 3, title: "故宮博物院 & 温泉体験",
        slots: [
          { time: "09:30", spot: "台湾国立故宮博物院", duration: "2時間30分", transport: "バス", cost: 500, comment: "「翠玉白菜」と「肉形石」が必見。中国4000年の至宝70万点を所蔵" },
          { time: "12:30", spot: "鼎泰豊（本店）で小籠包ランチ", duration: "1時間30分", transport: "MRT", cost: 3500, comment: "ミシュラン1つ星の小籠包専門店。開店と同時に行列必至" },
          { time: "15:00", spot: "北投温泉 入湯", duration: "2時間", transport: "MRT", cost: 3000, comment: "台北から30分の秘湯。硫黄泉・炭酸泉など種類が豊富" },
          { time: "18:30", spot: "永康街 ショッピング＆カフェ", duration: "1.5時間", transport: "MRT", cost: 2000, comment: "おしゃれな雑貨店とカフェが集まるエリア。タピオカ発祥店「春水堂」も近い" },
          { time: "21:00", spot: "饒河街夜市 ラストナイト", duration: "1.5時間", transport: "MRT", cost: 2000, comment: "胡椒餅で有名な夜市。シュワシュワの蜂蜜苦瓜汁を忘れずに" },
        ],
      },
      {
        day: 4, title: "帰国日",
        slots: [
          { time: "08:00", spot: "朝食 & 最後のお土産", duration: "1時間30分", transport: "徒歩", cost: 2000, comment: "パイナップルケーキ・ヌガーを追加購入。台湾コスメも忘れずに" },
          { time: "10:30", spot: "桃園空港へ移動", duration: "1時間", transport: "MRT快速", cost: 700, comment: "空港MRTで35分。台北駅から直通運転" },
          { time: "13:00", spot: "搭乗 & 帰国", duration: "約3時間30分", transport: "飛行機", cost: 0, comment: "台湾でのグルメと文化の記憶とともに帰国" },
        ],
      },
    ],
  },
};

/** どの国にもマッチしない場合のデフォルトテンプレートを生成する */
function buildDefaultTemplate(
  destination: string,
  tripDays: number
): Pick<typeof TEMPLATES[string], "flight" | "hotel" | "highlights" | "localCostPerDay" | "days"> {
  const country = COUNTRIES[destination];
  const flightCost = country
    ? Math.round(((country.flightMin + country.flightMax) / 2) / 1000) * 1000
    : 80000;
  const hotelCost = country
    ? Math.round(((country.hotelMin + country.hotelMax) / 2) / 1000) * 1000
    : 15000;
  const nights = Math.max(1, tripDays - 1);
  const name = country?.name ?? destination;
  const flag = country?.flag ?? "🌍";
  const topSpots = country?.topSpots ?? ["市内観光", "地元グルメ体験", "ショッピング"];

  const days: DayPlan[] = Array.from({ length: Math.min(tripDays, 10) }, (_, i) => {
    const day = i + 1;
    if (day === 1) {
      return {
        day, title: `${name}到着日`,
        slots: [
          { time: "14:00", spot: "空港到着・入国手続き", duration: "1時間", transport: "飛行機", cost: 0, comment: "両替・SIM購入を済ませてホテルへ" },
          { time: "16:30", spot: "ホテル チェックイン", duration: "30分", transport: "空港送迎", cost: 2000, comment: "" },
          { time: "18:00", spot: "ホテル周辺の散策", duration: "1.5時間", transport: "徒歩", cost: 0, comment: "まずは街の雰囲気を掴もう" },
          { time: "20:00", spot: "地元レストランで初夜のディナー", duration: "1.5時間", transport: "徒歩", cost: 4000, comment: "旅の始まりを地元料理で祝う" },
        ],
      };
    }
    if (day === tripDays) {
      return {
        day, title: "帰国日",
        slots: [
          { time: "08:00", spot: "朝食 & ラストショッピング", duration: "2時間", transport: "徒歩", cost: 3000, comment: "" },
          { time: "11:00", spot: "空港へ移動", duration: "1時間", transport: "タクシー", cost: 2000, comment: "出発3時間前には空港へ" },
          { time: "15:00", spot: `${name}発 → 日本 帰国`, duration: "ー", transport: "飛行機", cost: 0, comment: "" },
        ],
      };
    }
    const spotIndex = (day - 2) % topSpots.length;
    return {
      day, title: `${flag} ${topSpots[spotIndex]}`,
      slots: [
        { time: "09:30", spot: topSpots[spotIndex], duration: "3時間", transport: "タクシー", cost: 2000, comment: "現地観光のハイライト" },
        { time: "13:00", spot: "現地レストランでランチ", duration: "1時間", transport: "徒歩", cost: 3000, comment: "" },
        { time: "15:00", spot: "街歩き & ショッピング", duration: "2時間", transport: "徒歩", cost: 4000, comment: "" },
        { time: "19:00", spot: "ディナー", duration: "1.5時間", transport: "徒歩", cost: 5000, comment: "" },
      ],
    };
  });

  return {
    flight: {
      airline: country?.flightHours && country.flightHours <= 4 ? "JAL / ANA 直行" : "JAL / ANA 経由便",
      cost: flightCost,
      duration: country ? `約${country.flightHours}時間` : "約10時間",
    },
    hotel: { name: `${name}シティホテル`, cost_per_night: hotelCost, nights },
    highlights: [
      `${name}ならではの観光スポットを厳選`,
      `本場の${name}グルメと食文化を体験`,
      `地元の市場・ショッピングでお土産探し`,
    ],
    localCostPerDay: Math.round(((hotelCost * 0.4) / 1000)) * 1000 + 2000,
    days,
  };
}

/**
 * 国コードと旅行日数から確定的な旅程を返す
 * tripDays に合わせて days を切り詰め/調整し、costs を再計算する
 */
export function getMockItinerary(destination: string, tripDays: number): Itinerary {
  const tpl = TEMPLATES[destination] ?? buildDefaultTemplate(destination, tripDays);
  const nights = Math.max(1, tripDays - 1);

  // days をスライス（tripDays 日分）
  const days = tpl.days.slice(0, tripDays);

  const hotelTotal = tpl.hotel.cost_per_night * nights;
  const localTotal = tpl.localCostPerDay * tripDays;
  const totalCost = tpl.flight.cost + hotelTotal + localTotal;

  return {
    days,
    hotel: { ...tpl.hotel, nights },
    flight: tpl.flight,
    highlights: tpl.highlights,
    total_cost: totalCost,
  };
}
