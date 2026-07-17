"use client";

import { useMemo, useState } from "react";
import { useAssignments } from "@/lib/hooks/useAssignments";
import { AssignmentEntry } from "@/lib/campus/types";

const emptyForm: AssignmentEntry = { title: "", courseName: "", dueDate: "", done: false };

function daysRemaining(dueStr: string) {
  const due = new Date(dueStr);
  if (isNaN(due.getTime())) return null;
  due.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((due.getTime() - today.getTime()) / 86400000);
}

export default function AssignmentsPage() {
  const { data, add, update, remove } = useAssignments();
  const [form, setForm] = useState<AssignmentEntry & { id?: string }>(emptyForm);

  const sorted = useMemo(
    () => [...data].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()),
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
        <h3 className="font-semibold">{form.id ? "課題を編集" : "課題を追加"}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <input
            placeholder="課題名"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          />
          <input
            placeholder="授業名"
            value={form.courseName}
            onChange={(e) => setForm({ ...form, courseName: e.target.value })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          />
          <input
            type="date"
            required
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
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
            <th></th>
            <th className="py-1">課題名</th>
            <th>授業名</th>
            <th>提出期限</th>
            <th>あと</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((a) => {
            const diff = daysRemaining(a.dueDate);
            let badge = null;
            if (a.done) {
              badge = (
                <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 text-xs">
                  提出済
                </span>
              );
            } else if (diff !== null) {
              const cls =
                diff < 0
                  ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                  : diff <= 3
                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300"
                  : "bg-black/5 dark:bg-white/10";
              badge = (
                <span className={`px-2 py-0.5 rounded-full text-xs ${cls}`}>
                  {diff < 0 ? "期限切れ" : `${diff}日`}
                </span>
              );
            }
            return (
              <tr key={a.id} className="border-t border-black/5 dark:border-white/10">
                <td className="py-1.5">
                  <input
                    type="checkbox"
                    checked={a.done}
                    onChange={(e) => update(a.id, { done: e.target.checked })}
                  />
                </td>
                <td>{a.title}</td>
                <td>{a.courseName}</td>
                <td>{a.dueDate}</td>
                <td>{badge}</td>
                <td className="text-right space-x-2">
                  <button onClick={() => setForm({ ...a })} className="text-blue-600 text-xs">
                    編集
                  </button>
                  <button onClick={() => remove(a.id)} className="text-red-500 text-xs">
                    削除
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
