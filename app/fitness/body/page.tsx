"use client";

import { useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useBodyStats } from "@/lib/hooks/useBodyStats";
import { BodyStatsEntry } from "@/lib/fitness/types";

const emptyForm: BodyStatsEntry = {
  date: new Date().toISOString().slice(0, 10),
  weight: 0,
  heightCm: undefined,
  bodyFatPercent: undefined,
  muscleMass: undefined,
  chest: undefined,
  waist: undefined,
  hip: undefined,
  thigh: undefined,
  arm: undefined,
};

export default function BodyPage() {
  const { data, add, update, remove } = useBodyStats();
  const [form, setForm] = useState<BodyStatsEntry & { id?: string }>(emptyForm);

  const sorted = useMemo(() => [...data].sort((a, b) => (a.date < b.date ? -1 : 1)), [data]);
  const chartData = sorted.map((s) => ({ date: s.date, weight: s.weight, bodyFat: s.bodyFatPercent }));

  const bmi =
    form.weight && form.heightCm ? Math.round((form.weight / (form.heightCm / 100) ** 2) * 10) / 10 : null;

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
        <h3 className="font-semibold">{form.id ? "記録を編集" : "今日の記録を追加"}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <input
            type="date"
            required
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          />
          <input
            type="number"
            placeholder="体重(kg)"
            required
            value={form.weight}
            onChange={(e) => setForm({ ...form, weight: Number(e.target.value) })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          />
          <input
            type="number"
            placeholder="身長(cm)"
            value={form.heightCm || ""}
            onChange={(e) => setForm({ ...form, heightCm: Number(e.target.value) })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          />
          <input
            type="number"
            placeholder="体脂肪率(%)"
            value={form.bodyFatPercent || ""}
            onChange={(e) => setForm({ ...form, bodyFatPercent: Number(e.target.value) })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          />
          <input
            type="number"
            placeholder="筋肉量(kg)"
            value={form.muscleMass || ""}
            onChange={(e) => setForm({ ...form, muscleMass: Number(e.target.value) })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          />
          <input
            type="number"
            placeholder="胸囲(cm)"
            value={form.chest || ""}
            onChange={(e) => setForm({ ...form, chest: Number(e.target.value) })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          />
          <input
            type="number"
            placeholder="ウエスト(cm)"
            value={form.waist || ""}
            onChange={(e) => setForm({ ...form, waist: Number(e.target.value) })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          />
          <input
            type="number"
            placeholder="ヒップ(cm)"
            value={form.hip || ""}
            onChange={(e) => setForm({ ...form, hip: Number(e.target.value) })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          />
          <input
            type="number"
            placeholder="太もも(cm)"
            value={form.thigh || ""}
            onChange={(e) => setForm({ ...form, thigh: Number(e.target.value) })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          />
          <input
            type="number"
            placeholder="二の腕(cm)"
            value={form.arm || ""}
            onChange={(e) => setForm({ ...form, arm: Number(e.target.value) })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          />
        </div>
        {bmi !== null && <p className="text-sm text-black/50 dark:text-white/50">BMI: {bmi}</p>}
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

      {chartData.length > 0 && (
        <div className="rounded-xl border border-black/10 dark:border-white/15 p-4">
          <p className="text-sm font-semibold mb-2">体重推移</p>
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={["auto", "auto"]} />
                <Tooltip />
                <Line type="monotone" dataKey="weight" name="体重(kg)" stroke="#2a78d6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <table className="w-full text-sm">
        <thead className="text-black/40 dark:text-white/40 text-left">
          <tr>
            <th className="py-1">日付</th>
            <th>体重</th>
            <th>体脂肪率</th>
            <th>筋肉量</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {[...sorted].reverse().map((s) => (
            <tr key={s.id} className="border-t border-black/5 dark:border-white/10">
              <td className="py-1.5">{s.date}</td>
              <td>{s.weight}kg</td>
              <td>{s.bodyFatPercent ? `${s.bodyFatPercent}%` : ""}</td>
              <td>{s.muscleMass ? `${s.muscleMass}kg` : ""}</td>
              <td className="text-right space-x-2">
                <button onClick={() => setForm({ ...s })} className="text-blue-600 text-xs">
                  編集
                </button>
                <button onClick={() => remove(s.id)} className="text-red-500 text-xs">
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
