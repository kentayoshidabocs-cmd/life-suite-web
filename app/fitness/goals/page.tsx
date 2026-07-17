"use client";

import { useState } from "react";
import { useGoals } from "@/lib/hooks/useGoals";
import { useBodyStats } from "@/lib/hooks/useBodyStats";
import { GoalEntry } from "@/lib/fitness/types";
import { calcGoalProgress } from "@/lib/fitness/stats";

const emptyForm: GoalEntry = {
  label: "",
  startWeight: 0,
  targetWeight: 0,
  startDate: new Date().toISOString().slice(0, 10),
};

export default function GoalsPage() {
  const { data: goals, add, update, remove } = useGoals();
  const { data: bodyStats } = useBodyStats();
  const [form, setForm] = useState<GoalEntry & { id?: string }>(emptyForm);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { id, ...payload } = form;
    if (id) await update(id, payload);
    else await add(payload);
    setForm(emptyForm);
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="rounded-xl border border-black/10 dark:border-white/15 p-4 space-y-3">
        <h3 className="font-semibold">{form.id ? "目標を編集" : "目標を追加"}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <input
            placeholder="目標名(例: 減量)"
            required
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm col-span-2"
          />
          <input
            type="number"
            placeholder="開始時体重(kg)"
            required
            value={form.startWeight}
            onChange={(e) => setForm({ ...form, startWeight: Number(e.target.value) })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          />
          <input
            type="number"
            placeholder="目標体重(kg)"
            required
            value={form.targetWeight}
            onChange={(e) => setForm({ ...form, targetWeight: Number(e.target.value) })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          />
          <input
            type="date"
            required
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          />
        </div>
        <div className="flex gap-2">
          <button type="submit" className="rounded-lg bg-blue-600 text-white px-4 py-1.5 text-sm">
            保存
          </button>
          <button
            type="button"
            onClick={() => setForm(emptyForm)}
            className="rounded-lg bg-black/10 dark:bg-white/10 px-4 py-1.5 text-sm"
          >
            クリア
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {goals.length === 0 && <p className="text-sm text-black/40 dark:text-white/40">まだ目標がありません</p>}
        {goals.map((g) => {
          const progress = calcGoalProgress(g, bodyStats);
          return (
            <div key={g.id} className="rounded-xl border border-black/10 dark:border-white/15 p-4">
              <div className="flex justify-between items-start">
                <h4 className="font-semibold">
                  {g.label}: {g.startWeight}kg → {g.targetWeight}kg
                </h4>
                <div className="space-x-2 text-xs">
                  <button onClick={() => setForm({ ...g })} className="text-blue-600">
                    編集
                  </button>
                  <button onClick={() => remove(g.id)} className="text-red-500">
                    削除
                  </button>
                </div>
              </div>
              {progress.currentWeight === null ? (
                <p className="text-sm text-black/40 dark:text-white/40 mt-1">
                  体重・サイズ管理にまだ記録がないため進捗を計算できません
                </p>
              ) : (
                <p className="text-sm mt-1">
                  現在: {progress.currentWeight}kg / あと{Math.abs(progress.remaining ?? 0)}kg / 達成率:{" "}
                  {progress.achievementRate}% {progress.predictedDate && `/ 予想到達日: ${progress.predictedDate}`}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
