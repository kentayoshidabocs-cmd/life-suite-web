"use client";

import { useState } from "react";
import { DateConditions, suggestDateIdeas, suggestGifts, Budget } from "@/lib/love/aiSuggestions";

export default function AiSupportPage() {
  const [cond, setCond] = useState<DateConditions>({
    rainy: false,
    student: false,
    hasCar: false,
    anniversary: false,
    budget: "low",
  });

  const dateIdeas = suggestDateIdeas(cond);
  const gifts = suggestGifts(cond.budget);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-black/10 dark:border-white/15 p-4 space-y-3">
        <h3 className="font-semibold">条件を入力</h3>
        <div className="flex flex-wrap gap-3 text-sm">
          <label className="flex items-center gap-1.5">
            <input type="checkbox" checked={cond.rainy} onChange={(e) => setCond({ ...cond, rainy: e.target.checked })} />
            雨
          </label>
          <label className="flex items-center gap-1.5">
            <input type="checkbox" checked={cond.student} onChange={(e) => setCond({ ...cond, student: e.target.checked })} />
            学生
          </label>
          <label className="flex items-center gap-1.5">
            <input type="checkbox" checked={cond.hasCar} onChange={(e) => setCond({ ...cond, hasCar: e.target.checked })} />
            車あり
          </label>
          <label className="flex items-center gap-1.5">
            <input
              type="checkbox"
              checked={cond.anniversary}
              onChange={(e) => setCond({ ...cond, anniversary: e.target.checked })}
            />
            記念日
          </label>
          <select
            value={cond.budget}
            onChange={(e) => setCond({ ...cond, budget: e.target.value as Budget })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1 text-sm"
          >
            <option value="low">予算: 低め</option>
            <option value="mid">予算: 中くらい</option>
            <option value="high">予算: 高め</option>
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-black/10 dark:border-white/15 p-4">
        <h3 className="font-semibold mb-2">💡 デート提案</h3>
        <div className="space-y-2">
          {dateIdeas.map((idea) => (
            <div key={idea.title} className="text-sm">
              <span className="font-medium">{idea.title}</span> — {idea.description}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-black/10 dark:border-white/15 p-4">
        <h3 className="font-semibold mb-2">🎁 プレゼント提案</h3>
        <div className="flex flex-wrap gap-2">
          {gifts.map((g) => (
            <span key={g.title} className="px-2 py-1 rounded-full bg-black/5 dark:bg-white/10 text-sm">
              {g.title}
            </span>
          ))}
        </div>
      </div>

      <p className="text-xs text-black/40 dark:text-white/40">
        ※ 提案はルールベースの簡易ロジックによるものです。「流行スポット」機能(毎日更新の実店舗情報)は、
        リアルタイムの外部データソースが必要なため今回は未実装です。
      </p>
    </div>
  );
}
