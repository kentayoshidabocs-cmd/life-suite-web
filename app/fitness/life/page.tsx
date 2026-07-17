"use client";

import { useMemo, useState } from "react";
import { useLifeLog } from "@/lib/hooks/useLifeLog";
import { LifeEntry } from "@/lib/fitness/types";

const emptyForm: LifeEntry = {
  date: new Date().toISOString().slice(0, 10),
  sleepHours: 7,
  water: 1500,
  steps: 0,
  period: false,
  condition: "",
};

export default function LifePage() {
  const { data, add, update, remove } = useLifeLog();
  const [form, setForm] = useState<LifeEntry & { id?: string }>(emptyForm);

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
        <h3 className="font-semibold">{form.id ? "生活記録を編集" : "今日の記録を追加"}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <input
            type="date"
            required
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          />
          <input
            type="number"
            placeholder="睡眠時間(h)"
            value={form.sleepHours}
            onChange={(e) => setForm({ ...form, sleepHours: Number(e.target.value) })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          />
          <input
            type="number"
            placeholder="水分摂取量(ml)"
            value={form.water}
            onChange={(e) => setForm({ ...form, water: Number(e.target.value) })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          />
          <input
            type="number"
            placeholder="歩数"
            value={form.steps}
            onChange={(e) => setForm({ ...form, steps: Number(e.target.value) })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          />
          <label className="flex items-center gap-1.5 text-sm">
            <input
              type="checkbox"
              checked={!!form.period}
              onChange={(e) => setForm({ ...form, period: e.target.checked })}
            />
            生理
          </label>
          <input
            placeholder="体調メモ"
            value={form.condition}
            onChange={(e) => setForm({ ...form, condition: e.target.value })}
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
            <th>睡眠</th>
            <th>水分</th>
            <th>歩数</th>
            <th>体調</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((l) => (
            <tr key={l.id} className="border-t border-black/5 dark:border-white/10">
              <td className="py-1.5">
                {l.date}
                {l.period ? " 🩸" : ""}
              </td>
              <td>{l.sleepHours}h</td>
              <td>{l.water}ml</td>
              <td>{l.steps}歩</td>
              <td>{l.condition}</td>
              <td className="text-right space-x-2">
                <button onClick={() => setForm({ ...l })} className="text-blue-600 text-xs">
                  編集
                </button>
                <button onClick={() => remove(l.id)} className="text-red-500 text-xs">
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
