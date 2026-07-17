"use client";

import { useMemo, useState } from "react";
import { useLoveTrips } from "@/lib/hooks/useLoveTrips";
import { useLoveWishlist } from "@/lib/hooks/useLoveWishlist";
import { REGIONS, ALL_PREFECTURES } from "@/lib/love/prefectures";
import { LoveWishlistItem } from "@/lib/love/types";

const emptyForm: LoveWishlistItem = { placeName: "", prefecture: "", memo: "" };

export default function MapPage() {
  const { data: trips } = useLoveTrips();
  const { data: wishlist, add, remove } = useLoveWishlist();
  const [selected, setSelected] = useState<string | null>(null);
  const [form, setForm] = useState<LoveWishlistItem>(emptyForm);

  const visitedSet = useMemo(
    () => new Set(trips.map((t) => t.prefecture).filter((p): p is string => !!p)),
    [trips]
  );
  const wishlistSet = useMemo(
    () => new Set(wishlist.map((w) => w.prefecture).filter((p): p is string => !!p)),
    [wishlist]
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await add(form);
    setForm(emptyForm);
  }

  const selectedTrips = trips.filter((t) => t.prefecture === selected);
  const selectedWishes = wishlist.filter((w) => w.prefecture === selected);

  return (
    <div className="space-y-6">
      <div className="flex gap-4 text-xs text-black/50 dark:text-white/50">
        <span>
          <span className="inline-block w-3 h-3 rounded bg-green-400 mr-1 align-middle" />
          行った({visitedSet.size}/{ALL_PREFECTURES.length})
        </span>
        <span>
          <span className="inline-block w-3 h-3 rounded bg-amber-300 mr-1 align-middle" />
          行きたい({wishlistSet.size})
        </span>
      </div>

      {REGIONS.map((r) => (
        <div key={r.region}>
          <p className="text-xs text-black/40 dark:text-white/40 mb-1">{r.region}</p>
          <div className="flex flex-wrap gap-1.5">
            {r.prefectures.map((p) => {
              const visited = visitedSet.has(p);
              const wished = wishlistSet.has(p);
              return (
                <button
                  key={p}
                  onClick={() => setSelected(p)}
                  className={`px-2.5 py-1 rounded-lg text-xs border ${
                    selected === p ? "ring-2 ring-blue-500 " : ""
                  }${
                    visited
                      ? "bg-green-100 border-green-300 text-green-800 dark:bg-green-900/40 dark:border-green-700 dark:text-green-300"
                      : wished
                      ? "bg-amber-100 border-amber-300 text-amber-800 dark:bg-amber-900/40 dark:border-amber-700 dark:text-amber-300"
                      : "bg-black/5 border-black/10 dark:bg-white/5 dark:border-white/15"
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {selected && (
        <div className="rounded-xl border border-black/10 dark:border-white/15 p-4">
          <h4 className="font-semibold mb-2">{selected}</h4>
          {selectedTrips.length === 0 && selectedWishes.length === 0 && (
            <p className="text-sm text-black/40 dark:text-white/40">旅行記録・行きたい場所ともにまだありません</p>
          )}
          {selectedTrips.map((t) => (
            <p key={t.id} className="text-sm">
              🧳 {t.destination}(旅行記録: {t.date || "日付未設定"})
            </p>
          ))}
          {selectedWishes.map((w) => (
            <div key={w.id} className="flex justify-between items-center text-sm">
              <span>⭐ {w.placeName}{w.memo ? `(${w.memo})` : ""}</span>
              <button onClick={() => remove(w.id)} className="text-red-500 text-xs">
                削除
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-xl border border-black/10 dark:border-white/15 p-4 space-y-3">
        <h3 className="font-semibold">行きたい場所を登録</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <input
            placeholder="場所名"
            required
            value={form.placeName}
            onChange={(e) => setForm({ ...form, placeName: e.target.value })}
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
            placeholder="メモ"
            value={form.memo}
            onChange={(e) => setForm({ ...form, memo: e.target.value })}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          />
        </div>
        <button type="submit" className="rounded-lg bg-blue-600 text-white px-4 py-1.5 text-sm">
          追加
        </button>
      </form>
    </div>
  );
}
