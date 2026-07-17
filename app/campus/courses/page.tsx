"use client";

import { useState } from "react";
import { useCourseInfo } from "@/lib/hooks/useCourseInfo";
import { CourseInfoEntry } from "@/lib/campus/types";

const emptyForm: CourseInfoEntry = {
  courseName: "",
  testFormat: "",
  materialsAllowed: "不可",
  attendanceMethod: "",
  reportDueDate: "",
  professorNotes: "",
  memo: "",
};

export default function CoursesPage() {
  const { data, add, update, remove } = useCourseInfo();
  const [form, setForm] = useState<CourseInfoEntry & { id?: string }>(emptyForm);

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
        <h3 className="font-semibold">{form.id ? "授業情報を編集" : "授業情報を追加"}</h3>
        <div className="grid grid-cols-2 gap-2">
          <input
            placeholder="授業名"
            required
            value={form.courseName}
            onChange={(e) => setForm({ ...form, courseName: e.target.value })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm col-span-2"
          />
          <input
            placeholder="テスト形式"
            value={form.testFormat}
            onChange={(e) => setForm({ ...form, testFormat: e.target.value })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          />
          <select
            value={form.materialsAllowed}
            onChange={(e) =>
              setForm({ ...form, materialsAllowed: e.target.value as CourseInfoEntry["materialsAllowed"] })
            }
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          >
            <option value="不可">持込不可</option>
            <option value="可">持込可</option>
            <option value="一部可">持込一部可</option>
          </select>
          <input
            placeholder="出席方法"
            value={form.attendanceMethod}
            onChange={(e) => setForm({ ...form, attendanceMethod: e.target.value })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          />
          <input
            type="date"
            value={form.reportDueDate}
            onChange={(e) => setForm({ ...form, reportDueDate: e.target.value })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          />
          <textarea
            placeholder="教授の特徴"
            value={form.professorNotes}
            onChange={(e) => setForm({ ...form, professorNotes: e.target.value })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm col-span-2"
          />
          <textarea
            placeholder="メモ"
            value={form.memo}
            onChange={(e) => setForm({ ...form, memo: e.target.value })}
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
        {data.length === 0 && <p className="text-sm text-black/40 dark:text-white/40">まだ登録がありません</p>}
        {data.map((c) => (
          <div key={c.id} className="rounded-xl border border-black/10 dark:border-white/15 p-4">
            <div className="flex justify-between items-start">
              <h4 className="font-semibold">{c.courseName}</h4>
              <div className="space-x-2 text-xs">
                <button onClick={() => setForm({ ...c })} className="text-blue-600">
                  編集
                </button>
                <button onClick={() => remove(c.id)} className="text-red-500">
                  削除
                </button>
              </div>
            </div>
            <p className="text-sm mt-1">
              テスト形式: {c.testFormat} / 持込: {c.materialsAllowed} / 出席: {c.attendanceMethod}
            </p>
            <p className="text-sm">レポート提出日: {c.reportDueDate}</p>
            <p className="text-sm whitespace-pre-wrap">教授の特徴: {c.professorNotes}</p>
            <p className="text-sm whitespace-pre-wrap">メモ: {c.memo}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
