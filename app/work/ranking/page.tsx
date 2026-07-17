"use client";

import { useMemo, useState } from "react";
import { useWorkPlaces } from "@/lib/hooks/useWorkPlaces";

export default function RankingPage() {
  const { data } = useWorkPlaces();
  const [order, setOrder] = useState<"desc" | "asc">("desc");

  const sorted = useMemo(
    () => [...data].sort((a, b) => (order === "desc" ? b.hourlyWage - a.hourlyWage : a.hourlyWage - b.hourlyWage)),
    [data, order]
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setOrder("desc")}
          className={`rounded-lg px-3 py-1.5 text-sm ${order === "desc" ? "bg-blue-600 text-white" : "bg-black/10 dark:bg-white/10"}`}
        >
          高い順
        </button>
        <button
          onClick={() => setOrder("asc")}
          className={`rounded-lg px-3 py-1.5 text-sm ${order === "asc" ? "bg-blue-600 text-white" : "bg-black/10 dark:bg-white/10"}`}
        >
          低い順
        </button>
      </div>
      {sorted.length === 0 && (
        <p className="text-sm text-black/40 dark:text-white/40">バイト図鑑にまだ登録がありません</p>
      )}
      <ol className="space-y-2">
        {sorted.map((p, i) => (
          <li
            key={p.id}
            className="rounded-xl border border-black/10 dark:border-white/15 p-3 flex justify-between items-center"
          >
            <span>
              {i + 1}. {p.storeName}
            </span>
            <span className="font-semibold">{p.hourlyWage}円</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
