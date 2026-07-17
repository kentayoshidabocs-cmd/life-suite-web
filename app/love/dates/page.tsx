"use client";

import { useMemo, useState } from "react";
import { useLoveDates } from "@/lib/hooks/useLoveDates";
import { LoveDate } from "@/lib/love/types";

const emptyForm: LoveDate = { date: "", place: "", photoUrl: "", impression: "", cost: 0, rating: 3 };

export default function DatesPage() {
  const { data, add, update, remove } = useLoveDates();
  const [form, setForm] = useState<LoveDate & { id?: string }>(emptyForm);

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
        <h3 className="font-semibold">{form.id ? "デート記録を編集" : "デート記録を追加"}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <input
            type="date"
            required
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          />
          <input
            placeholder="場所"
            required
            value={form.place}
            onChange={(e) => setForm({ ...form, place: e.target.value })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          />
          <input
            type="number"
            placeholder="金額"
            value={form.cost}
            onChange={(e) => setForm({ ...form, cost: Number(e.target.value) })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          />
          <input
            placeholder="写真URL"
            value={form.photoUrl}
            onChange={(e) => setForm({ ...form, photoUrl: e.target.value })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          />
          <select
            value={form.rating}
            onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                評価 {n}
              </option>
            ))}
          </select>
          <input
            placeholder="感想"
            value={form.impression}
            onChange={(e) => setForm({ ...form, impression: e.target.value })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm col-span-2 sm:col-span-1"
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
        {sorted.length === 0 && <p className="text-sm text-black/40 dark:text-white/40">まだ記録がありません</p>}
        {sorted.map((d) => (
          <div key={d.id} className="rounded-xl border border-black/10 dark:border-white/15 p-4">
            <div className="flex justify-between items-start">
              <h4 className="font-semibold">
                {d.date} {d.place}
              </h4>
              <div className="space-x-2 text-xs">
                <button onClick={() => setForm({ ...d })} className="text-blue-600">
                  編集
                </button>
                <button onClick={() => remove(d.id)} className="text-red-500">
                  削除
                </button>
              </div>
            </div>
            <p className="text-sm mt-1">
              評価: {"★".repeat(d.rating || 0)}
              {"☆".repeat(5 - (d.rating || 0))} / 金額: {(d.cost || 0).toLocaleString()}円
            </p>
            {d.impression && <p className="text-sm">{d.impression}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
