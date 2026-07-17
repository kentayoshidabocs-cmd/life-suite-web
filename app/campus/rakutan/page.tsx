"use client";

import { useMemo, useState } from "react";
import { useRakutan } from "@/lib/hooks/useRakutan";
import { RakutanEntry } from "@/lib/campus/types";

const emptyForm: RakutanEntry = {
  courseName: "",
  difficulty: 3,
  attendanceStrictness: 3,
  testDifficulty: 3,
  reportVolume: 3,
  review: "",
};

const RATING_FIELDS: { key: keyof RakutanEntry; label: string }[] = [
  { key: "difficulty", label: "難易度" },
  { key: "attendanceStrictness", label: "出席の厳しさ" },
  { key: "testDifficulty", label: "テスト難易度" },
  { key: "reportVolume", label: "レポート量" },
];

export default function RakutanPage() {
  const { data, add, update, remove } = useRakutan();
  const [form, setForm] = useState<RakutanEntry & { id?: string }>(emptyForm);
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () => data.filter((r) => r.courseName.toLowerCase().includes(search.toLowerCase())),
    [data, search]
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { id, ...rest } = form;
    const payload = { ...rest, postedAt: rest.postedAt || new Date().toISOString().slice(0, 10) };
    if (id) await update(id, payload);
    else await add(payload);
    setForm(emptyForm);
  }

  return (
    <div className="space-y-6">
      <input
        placeholder="授業名で検索..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-3 py-2 text-sm"
      />

      <form onSubmit={handleSubmit} className="rounded-xl border border-black/10 dark:border-white/15 p-4 space-y-3">
        <h3 className="font-semibold">{form.id ? "楽単情報を編集" : "楽単情報を登録"}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <input
            placeholder="授業名"
            required
            value={form.courseName}
            onChange={(e) => setForm({ ...form, courseName: e.target.value })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm col-span-2 sm:col-span-1"
          />
          {RATING_FIELDS.map(({ key, label }) => (
            <select
              key={key}
              value={form[key] as number}
              onChange={(e) => setForm({ ...form, [key]: Number(e.target.value) })}
              className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {label} {n}
                </option>
              ))}
            </select>
          ))}
          <input
            placeholder="一言口コミ"
            value={form.review}
            onChange={(e) => setForm({ ...form, review: e.target.value })}
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

      <div className="space-y-3">
        {filtered.length === 0 && <p className="text-sm text-black/40 dark:text-white/40">まだ登録がありません</p>}
        {filtered.map((r) => (
          <div key={r.id} className="rounded-xl border border-black/10 dark:border-white/15 p-4">
            <div className="flex justify-between items-start">
              <h4 className="font-semibold">{r.courseName}</h4>
              <div className="space-x-2 text-xs">
                <button onClick={() => setForm({ ...r })} className="text-blue-600">
                  編集
                </button>
                <button onClick={() => remove(r.id)} className="text-red-500">
                  削除
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-1 text-xs">
              <span className="px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10">難易度 {r.difficulty}</span>
              <span className="px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10">
                出席の厳しさ {r.attendanceStrictness}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10">
                テスト難易度 {r.testDifficulty}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10">レポート量 {r.reportVolume}</span>
            </div>
            <p className="text-sm mt-1">{r.review}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
