"use client";

import { useState } from "react";
import { useWorkPlaces } from "@/lib/hooks/useWorkPlaces";
import { WorkPlace, WantAgain } from "@/lib/work/types";

const emptyForm: WorkPlace = {
  storeName: "",
  hourlyWage: 1100,
  uniform: "",
  humanRelations: "",
  busyness: 3,
  ease: 3,
  rating: 3,
  wantAgain: "わからない",
};

export default function PlacesPage() {
  const { data, add, update, remove } = useWorkPlaces();
  const [form, setForm] = useState<WorkPlace & { id?: string }>(emptyForm);

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
        <h3 className="font-semibold">{form.id ? "バイト図鑑を編集" : "バイト図鑑に登録"}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <input
            placeholder="店名"
            required
            value={form.storeName}
            onChange={(e) => setForm({ ...form, storeName: e.target.value })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          />
          <input
            type="number"
            placeholder="時給"
            required
            value={form.hourlyWage}
            onChange={(e) => setForm({ ...form, hourlyWage: Number(e.target.value) })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          />
          <input
            placeholder="制服"
            value={form.uniform}
            onChange={(e) => setForm({ ...form, uniform: e.target.value })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          />
          <input
            placeholder="人間関係"
            value={form.humanRelations}
            onChange={(e) => setForm({ ...form, humanRelations: e.target.value })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm col-span-2 sm:col-span-1"
          />
          <select
            value={form.busyness}
            onChange={(e) => setForm({ ...form, busyness: Number(e.target.value) })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                忙しさ {n}
              </option>
            ))}
          </select>
          <select
            value={form.ease}
            onChange={(e) => setForm({ ...form, ease: Number(e.target.value) })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                楽さ {n}
              </option>
            ))}
          </select>
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
          <select
            value={form.wantAgain}
            onChange={(e) => setForm({ ...form, wantAgain: e.target.value as WantAgain })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          >
            <option value="はい">また働きたい: はい</option>
            <option value="いいえ">また働きたい: いいえ</option>
            <option value="わからない">また働きたい: わからない</option>
          </select>
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
        {data.length === 0 && <p className="text-sm text-black/40 dark:text-white/40">まだ登録がありません</p>}
        {data.map((p) => (
          <div key={p.id} className="rounded-xl border border-black/10 dark:border-white/15 p-4">
            <div className="flex justify-between items-start">
              <h4 className="font-semibold">
                {p.storeName}(時給{p.hourlyWage}円)
              </h4>
              <div className="space-x-2 text-xs">
                <button onClick={() => setForm({ ...p })} className="text-blue-600">
                  編集
                </button>
                <button onClick={() => remove(p.id)} className="text-red-500">
                  削除
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-1 text-xs">
              <span className="px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10">忙しさ {p.busyness}</span>
              <span className="px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10">楽さ {p.ease}</span>
              <span className="px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10">評価 {p.rating}</span>
              <span className="px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10">また働きたい: {p.wantAgain}</span>
            </div>
            <p className="text-sm mt-1">
              制服: {p.uniform} / 人間関係: {p.humanRelations}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
