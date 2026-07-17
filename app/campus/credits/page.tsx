"use client";

import { useState } from "react";
import { useCredits } from "@/lib/hooks/useCredits";
import { useRequirements } from "@/lib/hooks/useRequirements";
import { calcGpaSummary } from "@/lib/campus/gpa";
import { CreditEntry, CreditStatus, Grade, RequirementEntry } from "@/lib/campus/types";

const emptyCredit = {
  courseName: "",
  units: 2,
  category: "",
  status: "履修中" as CreditStatus,
  grade: "" as Grade,
};

const GRADES: Grade[] = ["S", "A", "B", "C", "D", "F"];

export default function CreditsPage() {
  const { data: credits, add: addCredit, update: updateCredit, remove: removeCredit } = useCredits();
  const { data: requirements, add: addReq, remove: removeReq } = useRequirements();
  const [form, setForm] = useState<typeof emptyCredit & { id?: string }>(emptyCredit);
  const [reqForm, setReqForm] = useState({ category: "", requiredUnits: 0 });

  const summary = calcGpaSummary(credits, requirements);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: CreditEntry = {
      courseName: form.courseName,
      units: form.units,
      category: form.category,
      status: form.status,
      grade: form.grade,
    };
    if (form.id) await updateCredit(form.id, payload);
    else await addCredit(payload);
    setForm(emptyCredit);
  }

  async function handleReqSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: RequirementEntry = {
      category: reqForm.category,
      requiredUnits: Number(reqForm.requiredUnits),
    };
    await addReq(payload);
    setReqForm({ category: "", requiredUnits: 0 });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-black/10 dark:border-white/15 p-4">
        <h3 className="font-semibold mb-2">GPA: {summary.gpa}</h3>
        <p className="text-sm">
          取得単位: {summary.earnedCredits} / 卒業必要単位: {summary.totalRequired}(あと{summary.remainingTotal}単位)
        </p>
        <div className="flex flex-wrap gap-2 mt-2">
          {summary.byCategory.map((c) => (
            <span
              key={c.category}
              className={`text-xs px-2 py-1 rounded-full ${
                c.remaining > 0
                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300"
                  : "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
              }`}
            >
              {c.category}: {c.earned}/{c.required}(あと{c.remaining})
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-black/10 dark:border-white/15 p-4">
        <h3 className="font-semibold mb-2">卒業要件(分野ごとの必要単位)</h3>
        <form onSubmit={handleReqSubmit} className="flex flex-wrap gap-2 mb-3">
          <input
            placeholder="分野"
            required
            value={reqForm.category}
            onChange={(e) => setReqForm({ ...reqForm, category: e.target.value })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          />
          <input
            type="number"
            placeholder="必要単位数"
            required
            value={reqForm.requiredUnits}
            onChange={(e) => setReqForm({ ...reqForm, requiredUnits: Number(e.target.value) })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm w-32"
          />
          <button type="submit" className="rounded-lg bg-blue-600 text-white px-3 py-1.5 text-sm">
            追加
          </button>
        </form>
        <ul className="text-sm space-y-1">
          {requirements.map((r) => (
            <li key={r.id} className="flex justify-between items-center">
              <span>
                {r.category}: {r.requiredUnits}単位
              </span>
              <button onClick={() => removeReq(r.id)} className="text-red-500 text-xs">
                削除
              </button>
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="rounded-xl border border-black/10 dark:border-white/15 p-4 space-y-3">
        <h3 className="font-semibold">{form.id ? "履修登録を編集" : "履修登録を追加"}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          <input
            placeholder="授業名"
            required
            value={form.courseName}
            onChange={(e) => setForm({ ...form, courseName: e.target.value })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm col-span-2"
          />
          <input
            type="number"
            placeholder="単位数"
            required
            value={form.units}
            onChange={(e) => setForm({ ...form, units: Number(e.target.value) })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          />
          <input
            placeholder="分野"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          />
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as CreditStatus })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          >
            <option value="履修中">履修中</option>
            <option value="取得済み">取得済み</option>
            <option value="不合格">不合格</option>
          </select>
          <select
            value={form.grade}
            onChange={(e) => setForm({ ...form, grade: e.target.value as Grade })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          >
            <option value="">成績</option>
            {GRADES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <button type="submit" className="rounded-lg bg-blue-600 text-white px-4 py-1.5 text-sm">
            保存
          </button>
          <button
            type="button"
            onClick={() => setForm(emptyCredit)}
            className="rounded-lg bg-black/10 dark:bg-white/10 px-4 py-1.5 text-sm"
          >
            クリア
          </button>
        </div>
      </form>

      <table className="w-full text-sm">
        <thead className="text-black/40 dark:text-white/40 text-left">
          <tr>
            <th className="py-1">授業名</th>
            <th>単位数</th>
            <th>分野</th>
            <th>ステータス</th>
            <th>成績</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {credits.map((c) => (
            <tr key={c.id} className="border-t border-black/5 dark:border-white/10">
              <td className="py-1.5">{c.courseName}</td>
              <td>{c.units}</td>
              <td>{c.category}</td>
              <td>{c.status}</td>
              <td>{c.grade}</td>
              <td className="text-right space-x-2">
                <button
                  onClick={() =>
                    setForm({
                      id: c.id,
                      courseName: c.courseName,
                      units: c.units,
                      category: c.category,
                      status: c.status,
                      grade: c.grade,
                    })
                  }
                  className="text-blue-600 text-xs"
                >
                  編集
                </button>
                <button onClick={() => removeCredit(c.id)} className="text-red-500 text-xs">
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
