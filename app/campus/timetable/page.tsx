"use client";

import { Fragment, useMemo, useState } from "react";
import { useTimetable } from "@/lib/hooks/useTimetable";
import { TimetableEntry, Weekday } from "@/lib/campus/types";

const DAYS: Weekday[] = ["月", "火", "水", "木", "金", "土", "日"];
const PERIODS = [1, 2, 3, 4, 5, 6];

const emptyForm = {
  day: "月" as Weekday,
  period: 1,
  courseName: "",
  room: "",
  professor: "",
  color: "#4361ee",
};

export default function TimetablePage() {
  const { data, add, update, remove } = useTimetable();
  const [form, setForm] = useState<typeof emptyForm & { id?: string }>(emptyForm);

  const todayDay = DAYS[(new Date().getDay() + 6) % 7];
  const todaysClasses = useMemo(
    () => data.filter((t) => t.day === todayDay).sort((a, b) => a.period - b.period),
    [data, todayDay]
  );

  function findEntry(day: Weekday, period: number) {
    return data.find((t) => t.day === day && t.period === period);
  }

  function selectCell(day: Weekday, period: number) {
    const entry = findEntry(day, period);
    if (entry) {
      setForm({
        id: entry.id,
        day: entry.day,
        period: entry.period,
        courseName: entry.courseName,
        room: entry.room || "",
        professor: entry.professor || "",
        color: entry.color || "#4361ee",
      });
    } else {
      setForm({ ...emptyForm, day, period });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: TimetableEntry = {
      day: form.day,
      period: form.period,
      courseName: form.courseName,
      room: form.room,
      professor: form.professor,
      color: form.color,
    };
    if (form.id) {
      await update(form.id, payload);
    } else {
      await add(payload);
    }
    setForm(emptyForm);
  }

  async function handleDelete() {
    if (!form.id) return;
    await remove(form.id);
    setForm(emptyForm);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-black/10 dark:border-white/15 p-4 text-sm">
        <b>今日の授業:</b>{" "}
        {todaysClasses.length === 0 ? (
          "なし"
        ) : (
          todaysClasses.map((t) => (
            <span
              key={t.id}
              className="inline-block ml-2 px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-xs"
            >
              {t.period}限 {t.courseName}
            </span>
          ))
        )}
      </div>

      <div className="grid grid-cols-[36px_repeat(7,1fr)] gap-1 text-xs">
        <div />
        {DAYS.map((d) => (
          <div key={d} className={`text-center font-bold py-1 ${d === todayDay ? "text-blue-600" : ""}`}>
            {d}
          </div>
        ))}
        {PERIODS.map((p) => (
          <Fragment key={p}>
            <div className="flex items-center justify-center text-black/40 dark:text-white/40">{p}限</div>
            {DAYS.map((d) => {
              const entry = findEntry(d, p);
              return (
                <button
                  key={`${d}-${p}`}
                  onClick={() => selectCell(d, p)}
                  className={`min-h-[56px] rounded-lg border p-1 text-left ${
                    d === todayDay ? "ring-1 ring-blue-500" : "border-black/10 dark:border-white/15"
                  }`}
                  style={
                    entry?.color
                      ? { backgroundColor: entry.color + "22", borderColor: entry.color }
                      : undefined
                  }
                >
                  {entry?.courseName}
                  {entry?.room && <div className="text-[10px] text-black/40 dark:text-white/40">{entry.room}</div>}
                </button>
              );
            })}
          </Fragment>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="rounded-xl border border-black/10 dark:border-white/15 p-4 space-y-3">
        <h3 className="font-semibold">{form.id ? "授業を編集" : "授業を追加"}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <select
            value={form.day}
            onChange={(e) => setForm({ ...form, day: e.target.value as Weekday })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          >
            {DAYS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <select
            value={form.period}
            onChange={(e) => setForm({ ...form, period: Number(e.target.value) })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          >
            {PERIODS.map((p) => (
              <option key={p} value={p}>
                {p}限
              </option>
            ))}
          </select>
          <input
            type="color"
            value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
            className="h-9 w-full rounded-lg"
          />
          <input
            placeholder="授業名"
            required
            value={form.courseName}
            onChange={(e) => setForm({ ...form, courseName: e.target.value })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm col-span-2 sm:col-span-1"
          />
          <input
            placeholder="教室"
            value={form.room}
            onChange={(e) => setForm({ ...form, room: e.target.value })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          />
          <input
            placeholder="担当教授"
            value={form.professor}
            onChange={(e) => setForm({ ...form, professor: e.target.value })}
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
          {form.id && (
            <button
              type="button"
              onClick={handleDelete}
              className="rounded-lg bg-red-500 text-white px-4 py-1.5 text-sm"
            >
              削除
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
