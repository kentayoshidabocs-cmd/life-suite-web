"use client";

import { useMemo, useState } from "react";
import { useWorkShifts } from "@/lib/hooks/useWorkShifts";
import { WorkShift } from "@/lib/work/types";
import { shiftHours, shiftIncome } from "@/lib/work/stats";

const emptyForm: WorkShift = {
  date: new Date().toISOString().slice(0, 10),
  storeName: "",
  hourlyWage: 1100,
  startTime: "09:00",
  endTime: "17:00",
  breakMinutes: 60,
  transportFee: 0,
  memo: "",
};

export default function ShiftsPage() {
  const { data, add, update, remove } = useWorkShifts();
  const [form, setForm] = useState<WorkShift & { id?: string }>(emptyForm);

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
        <h3 className="font-semibold">{form.id ? "勤務記録を編集" : "勤務記録を追加"}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <input
            type="date"
            required
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          />
          <input
            placeholder="店舗名"
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
            type="number"
            placeholder="交通費"
            value={form.transportFee}
            onChange={(e) => setForm({ ...form, transportFee: Number(e.target.value) })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          />
          <input
            type="time"
            required
            value={form.startTime}
            onChange={(e) => setForm({ ...form, startTime: e.target.value })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          />
          <input
            type="time"
            required
            value={form.endTime}
            onChange={(e) => setForm({ ...form, endTime: e.target.value })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          />
          <input
            type="number"
            placeholder="休憩(分)"
            value={form.breakMinutes}
            onChange={(e) => setForm({ ...form, breakMinutes: Number(e.target.value) })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          />
          <input
            placeholder="メモ"
            value={form.memo}
            onChange={(e) => setForm({ ...form, memo: e.target.value })}
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
            <th>店舗名</th>
            <th>時給</th>
            <th>勤務時間</th>
            <th>収入</th>
            <th>交通費</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((s) => (
            <tr key={s.id} className="border-t border-black/5 dark:border-white/10">
              <td className="py-1.5">{s.date}</td>
              <td>{s.storeName}</td>
              <td>{s.hourlyWage}円</td>
              <td>{shiftHours(s).toFixed(1)}h</td>
              <td>{Math.round(shiftIncome(s)).toLocaleString()}円</td>
              <td>{s.transportFee ? `${s.transportFee}円` : ""}</td>
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
