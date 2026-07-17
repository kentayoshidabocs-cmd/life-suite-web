"use client";

import { useMemo, useState } from "react";
import { useWorkouts } from "@/lib/hooks/useWorkouts";
import { WorkoutEntry, BODY_PARTS } from "@/lib/fitness/types";

const emptyForm: WorkoutEntry = {
  date: new Date().toISOString().slice(0, 10),
  bodyPart: "胸",
  exercise: "",
  weight: 0,
  reps: 10,
  sets: 3,
  rpe: 8,
  restSeconds: 90,
  memo: "",
};

export default function WorkoutsPage() {
  const { data, add, update, remove } = useWorkouts();
  const [form, setForm] = useState<WorkoutEntry & { id?: string }>(emptyForm);

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
      <form onSubmit={handleSubmit} className="rounded-xl border border-black/10 dark:border-white/15 p-4 space-y-3">
        <h3 className="font-semibold">{form.id ? "トレーニング記録を編集" : "トレーニング記録を追加"}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <input
            type="date"
            required
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          />
          <select
            value={form.bodyPart}
            onChange={(e) => setForm({ ...form, bodyPart: e.target.value as WorkoutEntry["bodyPart"] })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          >
            {BODY_PARTS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          <input
            placeholder="種目名"
            required
            value={form.exercise}
            onChange={(e) => setForm({ ...form, exercise: e.target.value })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          />
          <input
            type="number"
            placeholder="重量(kg)"
            value={form.weight}
            onChange={(e) => setForm({ ...form, weight: Number(e.target.value) })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          />
          <input
            type="number"
            placeholder="回数"
            value={form.reps}
            onChange={(e) => setForm({ ...form, reps: Number(e.target.value) })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          />
          <input
            type="number"
            placeholder="セット数"
            value={form.sets}
            onChange={(e) => setForm({ ...form, sets: Number(e.target.value) })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          />
          <input
            type="number"
            placeholder="RPE"
            value={form.rpe}
            onChange={(e) => setForm({ ...form, rpe: Number(e.target.value) })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          />
          <input
            type="number"
            placeholder="インターバル(秒)"
            value={form.restSeconds}
            onChange={(e) => setForm({ ...form, restSeconds: Number(e.target.value) })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          />
          <input
            placeholder="メモ"
            value={form.memo}
            onChange={(e) => setForm({ ...form, memo: e.target.value })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm col-span-2"
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
            <th>部位</th>
            <th>種目</th>
            <th>重量×回数×set</th>
            <th>RPE</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((w) => (
            <tr key={w.id} className="border-t border-black/5 dark:border-white/10">
              <td className="py-1.5">{w.date}</td>
              <td>{w.bodyPart}</td>
              <td>{w.exercise}</td>
              <td>
                {w.weight}kg×{w.reps}×{w.sets}
              </td>
              <td>{w.rpe}</td>
              <td className="text-right space-x-2">
                <button onClick={() => setForm({ ...w })} className="text-blue-600 text-xs">
                  編集
                </button>
                <button onClick={() => remove(w.id)} className="text-red-500 text-xs">
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
