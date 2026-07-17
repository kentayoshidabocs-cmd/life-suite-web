"use client";

import { useMemo, useState } from "react";
import { useProteinLog } from "@/lib/hooks/useProteinLog";
import { ProteinEntry } from "@/lib/fitness/types";

const emptyForm: ProteinEntry = {
  date: new Date().toISOString().slice(0, 10),
  time: "08:00",
  productName: "",
  flavor: "",
  proteinAmount: 20,
  remainingAmount: 0,
};

export default function ProteinPage() {
  const { data, add, update, remove } = useProteinLog();
  const [form, setForm] = useState<ProteinEntry & { id?: string }>(emptyForm);

  const today = new Date().toISOString().slice(0, 10);
  const loggedToday = useMemo(() => data.some((p) => p.date === today), [data, today]);
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
      {!loggedToday && (
        <div className="rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 p-3 text-sm">
          ⏰ 今日はまだプロテインの記録がありません。飲み忘れていませんか?
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-xl border border-black/10 dark:border-white/15 p-4 space-y-3">
        <h3 className="font-semibold">{form.id ? "プロテイン記録を編集" : "プロテイン記録を追加"}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <input
            type="date"
            required
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          />
          <input
            type="time"
            required
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          />
          <input
            placeholder="商品名"
            required
            value={form.productName}
            onChange={(e) => setForm({ ...form, productName: e.target.value })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          />
          <input
            placeholder="味"
            value={form.flavor}
            onChange={(e) => setForm({ ...form, flavor: e.target.value })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          />
          <input
            type="number"
            placeholder="タンパク質量(g)"
            value={form.proteinAmount}
            onChange={(e) => setForm({ ...form, proteinAmount: Number(e.target.value) })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          />
          <input
            type="number"
            placeholder="残量(g)"
            value={form.remainingAmount}
            onChange={(e) => setForm({ ...form, remainingAmount: Number(e.target.value) })}
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
            <th>時刻</th>
            <th>商品名</th>
            <th>タンパク質</th>
            <th>残量</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((p) => (
            <tr key={p.id} className="border-t border-black/5 dark:border-white/10">
              <td className="py-1.5">{p.date}</td>
              <td>{p.time}</td>
              <td>
                {p.productName}
                {p.flavor ? `(${p.flavor})` : ""}
              </td>
              <td>{p.proteinAmount}g</td>
              <td>{p.remainingAmount}g</td>
              <td className="text-right space-x-2">
                <button onClick={() => setForm({ ...p })} className="text-blue-600 text-xs">
                  編集
                </button>
                <button onClick={() => remove(p.id)} className="text-red-500 text-xs">
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
