export type Budget = "low" | "mid" | "high";

export interface DateConditions {
  rainy: boolean;
  student: boolean;
  hasCar: boolean;
  anniversary: boolean;
  budget: Budget;
}

interface DateIdea {
  title: string;
  description: string;
  tags: Partial<{ rainy: boolean; student: boolean; hasCar: boolean; anniversary: boolean; budget: Budget }>;
}

const DATE_IDEAS: DateIdea[] = [
  { title: "映画館デート", description: "天気を気にせず楽しめる定番デート", tags: { rainy: true, budget: "low" } },
  { title: "水族館めぐり", description: "室内でゆっくり過ごせる。記念日にもおすすめ", tags: { rainy: true, anniversary: true, budget: "mid" } },
  { title: "カフェ巡り", description: "近場でリラックス。学生の予算にも優しい", tags: { student: true, budget: "low" } },
  { title: "ドライブ+絶景スポット", description: "車があるなら少し遠出して景色を楽しむ", tags: { hasCar: true, budget: "low" } },
  { title: "高級レストランでディナー", description: "記念日にふさわしい特別な時間", tags: { anniversary: true, budget: "high" } },
  { title: "プラネタリウム", description: "雨の日でも楽しめる、落ち着いたデート", tags: { rainy: true, budget: "low" } },
  { title: "遊園地", description: "アクティブに一日楽しみたいときに", tags: { hasCar: true, budget: "mid" } },
  { title: "手作り料理デート", description: "お金をかけずに二人の時間を楽しむ", tags: { student: true, budget: "low" } },
  { title: "温泉旅行", description: "特別な記念日にゆっくり過ごす", tags: { anniversary: true, hasCar: true, budget: "high" } },
  { title: "美術館・博物館", description: "雨の日でも快適、会話のきっかけも豊富", tags: { rainy: true, budget: "low" } },
  { title: "夜景スポットドライブ", description: "車でしか行けない穴場の夜景を楽しむ", tags: { hasCar: true, budget: "low" } },
  { title: "ボウリング・カラオケ", description: "学生同士でも盛り上がれる定番", tags: { student: true, rainy: true, budget: "low" } },
  { title: "ホテルディナー+夜景", description: "特別な日にふさわしい非日常感", tags: { anniversary: true, budget: "high" } },
  { title: "近場の公園ピクニック", description: "晴れた日にお弁当を持って", tags: { budget: "low" } },
  { title: "ショッピングモール巡り", description: "雨でも快適に過ごせて色々楽しめる", tags: { rainy: true, budget: "mid" } },
];

export function suggestDateIdeas(cond: DateConditions, limit = 5): DateIdea[] {
  const scored = DATE_IDEAS.map((idea) => {
    let score = 0;
    if (cond.rainy && idea.tags.rainy) score += 2;
    if (!cond.rainy && idea.tags.rainy === undefined) score += 0.5;
    if (cond.student && idea.tags.student) score += 2;
    if (cond.hasCar && idea.tags.hasCar) score += 2;
    if (cond.anniversary && idea.tags.anniversary) score += 3;
    if (idea.tags.budget === cond.budget) score += 1.5;
    else if (idea.tags.budget === undefined) score += 0.3;
    return { idea, score };
  });
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.idea);
}

interface GiftIdea {
  title: string;
  budget: Budget;
}

const GIFT_IDEAS: GiftIdea[] = [
  { title: "手紙・メッセージカード", budget: "low" },
  { title: "ペアグッズ", budget: "low" },
  { title: "花束", budget: "low" },
  { title: "手作りのプレゼント", budget: "low" },
  { title: "アクセサリー", budget: "mid" },
  { title: "香水", budget: "mid" },
  { title: "ブランド財布", budget: "mid" },
  { title: "高級ディナー券", budget: "high" },
  { title: "旅行券", budget: "high" },
  { title: "腕時計", budget: "high" },
];

export function suggestGifts(budget: Budget, limit = 5): GiftIdea[] {
  const matched = GIFT_IDEAS.filter((g) => g.budget === budget);
  return (matched.length > 0 ? matched : GIFT_IDEAS).slice(0, limit);
}
