"use client";

import { useState } from "react";
import { useLovePartners } from "@/lib/hooks/useLovePartners";
import { LovePartner } from "@/lib/love/types";

const emptyForm: LovePartner = {
  name: "",
  nickname: "",
  metDate: "",
  confessDate: "",
  datingStartDate: "",
  breakupDate: "",
  reunionDate: "",
  photoUrl: "",
  memories: "",
  memo: "",
};

const FIELDS: { key: keyof LovePartner; label: string; type?: string }[] = [
  { key: "name", label: "名前" },
  { key: "nickname", label: "あだ名" },
  { key: "metDate", label: "出会った日", type: "date" },
  { key: "confessDate", label: "告白日", type: "date" },
  { key: "datingStartDate", label: "付き合った日", type: "date" },
  { key: "breakupDate", label: "別れた日", type: "date" },
  { key: "reunionDate", label: "復縁日", type: "date" },
  { key: "photoUrl", label: "写真URL" },
];

export default function AlbumPage() {
  const { data, add, update, remove } = useLovePartners();
  const [form, setForm] = useState<LovePartner & { id?: string }>(emptyForm);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { id, ...payload } = form;
    if (id) await update(id, payload);
    else await add(payload);
    setForm(emptyForm);
  }

  return (
    <div className="space-y-6">
      <p className="text-xs text-black/40 dark:text-white/40">
        ※ 復縁した場合は、既存の相手を「編集」して復縁日を追記(継続として記録)するか、新しく登録(新しくカウント)するか選べます。
      </p>

      <form onSubmit={handleSubmit} className="rounded-xl border border-black/10 dark:border-white/15 p-4 space-y-3">
        <h3 className="font-semibold">{form.id ? "恋愛アルバムを編集" : "恋愛アルバムに登録"}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {FIELDS.map((f) => (
            <input
              key={f.key}
              type={f.type || "text"}
              placeholder={f.label}
              required={f.key === "name"}
              value={(form[f.key] as string) || ""}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
            />
          ))}
          <textarea
            placeholder="思い出"
            value={form.memories}
            onChange={(e) => setForm({ ...form, memories: e.target.value })}
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
        {data.map((p) => (
          <div key={p.id} className="rounded-xl border border-black/10 dark:border-white/15 p-4">
            <div className="flex justify-between items-start">
              <h4 className="font-semibold">
                {p.name}
                {p.nickname && <span className="text-black/40 dark:text-white/40 text-sm ml-1">({p.nickname})</span>}
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
            <p className="text-sm mt-1">
              出会い: {p.metDate || "―"} / 告白: {p.confessDate || "―"} / 交際開始: {p.datingStartDate || "―"}
            </p>
            {(p.breakupDate || p.reunionDate) && (
              <p className="text-sm">
                別れ: {p.breakupDate || "―"} / 復縁: {p.reunionDate || "―"}
              </p>
            )}
            {p.memories && <p className="text-sm whitespace-pre-wrap mt-1">思い出: {p.memories}</p>}
            {p.memo && <p className="text-sm whitespace-pre-wrap">メモ: {p.memo}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
