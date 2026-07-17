"use client";

import { useMemo, useState } from "react";
import { useLoveTrips } from "@/lib/hooks/useLoveTrips";
import { LoveTrip } from "@/lib/love/types";
import { ALL_PREFECTURES } from "@/lib/love/prefectures";

const emptyForm: LoveTrip = { date: "", destination: "", prefecture: "", hotel: "", photoUrl: "", cost: 0, impression: "" };

export default function TripsPage() {
  const { data, add, update, remove } = useLoveTrips();
  const [form, setForm] = useState<LoveTrip & { id?: string }>(emptyForm);

  const sorted = useMemo(
    () => [...data].sort((a, b) => (a.date || "") < (b.date || "") ? 1 : -1),
    [data]
  );

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
        <h3 className="font-semibold">{form.id ? "旅行記録を編集" : "旅行記録を追加"}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          />
          <input
            placeholder="行き先"
            required
            value={form.destination}
            onChange={(e) => setForm({ ...form, destination: e.target.value })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          />
          <select
            value={form.prefecture}
            onChange={(e) => setForm({ ...form, prefecture: e.target.value })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          >
            <option value="">都道府県を選択</option>
            {ALL_PREFECTURES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <input
            placeholder="ホテル"
            value={form.hotel}
            onChange={(e) => setForm({ ...form, hotel: e.target.value })}
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
          <textarea
            placeholder="感想"
            value={form.impression}
            onChange={(e) => setForm({ ...form, impression: e.target.value })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm col-span-2 sm:col-span-3"
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
        {sorted.map((t) => (
          <div key={t.id} className="rounded-xl border border-black/10 dark:border-white/15 p-4">
            <div className="flex justify-between items-start">
              <h4 className="font-semibold">
                {t.destination}
                {t.prefecture && <span className="text-black/40 dark:text-white/40 text-sm ml-1">({t.prefecture})</span>}
              </h4>
              <div className="space-x-2 text-xs">
                <button onClick={() => setForm({ ...t })} className="text-blue-600">
                  編集
                </button>
                <button onClick={() => remove(t.id)} className="text-red-500">
                  削除
                </button>
              </div>
            </div>
            <p className="text-sm mt-1">
              {t.date} / ホテル: {t.hotel || "―"} / 金額: {(t.cost || 0).toLocaleString()}円
            </p>
            {t.impression && <p className="text-sm">{t.impression}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
