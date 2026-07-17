"use client";

import { useMemo, useState } from "react";
import { useMeals } from "@/lib/hooks/useMeals";
import { useBodyStats } from "@/lib/hooks/useBodyStats";
import { MealEntry, MealType } from "@/lib/fitness/types";
import { calcMealAdvice } from "@/lib/fitness/stats";

const emptyForm: MealEntry = {
  date: new Date().toISOString().slice(0, 10),
  mealType: "朝",
  description: "",
  protein: 0,
  fat: 0,
  calories: 0,
};

export default function MealsPage() {
  const { data, add, update, remove } = useMeals();
  const { data: bodyStats } = useBodyStats();
  const [form, setForm] = useState<MealEntry & { id?: string }>(emptyForm);

  const today = new Date().toISOString().slice(0, 10);
  const todaysMeals = useMemo(() => data.filter((m) => m.date === today), [data, today]);
  const latestWeight = useMemo(() => {
    const sorted = [...bodyStats].sort((a, b) => (a.date < b.date ? -1 : 1));
    return sorted.length > 0 ? sorted[sorted.length - 1].weight : null;
  }, [bodyStats]);

  const advice = calcMealAdvice(todaysMeals, latestWeight);
  const sorted = useMemo(() => [...data].sort((a, b) => (a.date < b.date ? 1 : -1)), [data]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { id, ...payload } = form;
    if (id) await update(id, payload);
    else await add(payload);
    setForm(emptyForm);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-black/10 dark:border-white/15 p-4">
        <p className="text-sm font-semibold mb-2">今日の合計(タンパク質{advice.totalProtein}g / 脂質{advice.totalFat}g / {advice.totalCalories}kcal)</p>
        <ul className="text-sm space-y-1">
          {advice.messages.map((m, i) => (
            <li key={i}>💡 {m}</li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="rounded-xl border border-black/10 dark:border-white/15 p-4 space-y-3">
        <h3 className="font-semibold">{form.id ? "食事記録を編集" : "食事記録を追加"}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <input
            type="date"
            required
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          />
          <select
            value={form.mealType}
            onChange={(e) => setForm({ ...form, mealType: e.target.value as MealType })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          >
            <option value="朝">朝</option>
            <option value="昼">昼</option>
            <option value="夜">夜</option>
          </select>
          <input
            placeholder="内容"
            required
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          />
          <input
            type="number"
            placeholder="タンパク質(g)"
            value={form.protein}
            onChange={(e) => setForm({ ...form, protein: Number(e.target.value) })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          />
          <input
            type="number"
            placeholder="脂質(g)"
            value={form.fat}
            onChange={(e) => setForm({ ...form, fat: Number(e.target.value) })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          />
          <input
            type="number"
            placeholder="カロリー(kcal)"
            value={form.calories}
            onChange={(e) => setForm({ ...form, calories: Number(e.target.value) })}
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

      <table className="w-full text-sm">
        <thead className="text-black/40 dark:text-white/40 text-left">
          <tr>
            <th className="py-1">日付</th>
            <th>区分</th>
            <th>内容</th>
            <th>P/F/kcal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((m) => (
            <tr key={m.id} className="border-t border-black/5 dark:border-white/10">
              <td className="py-1.5">{m.date}</td>
              <td>{m.mealType}</td>
              <td>{m.description}</td>
              <td>
                {m.protein}g / {m.fat}g / {m.calories}kcal
              </td>
              <td className="text-right space-x-2">
                <button onClick={() => setForm({ ...m })} className="text-blue-600 text-xs">
                  編集
                </button>
                <button onClick={() => remove(m.id)} className="text-red-500 text-xs">
                  削除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
