"use client";

import { useMemo } from "react";
import { useLovePartners } from "@/lib/hooks/useLovePartners";

export default function TimelinePage() {
  const { data } = useLovePartners();

  const sorted = useMemo(
    () => [...data].sort((a, b) => (a.metDate || a.datingStartDate || "").localeCompare(b.metDate || b.datingStartDate || "")),
    [data]
  );

  if (sorted.length === 0) {
    return <p className="text-sm text-black/40 dark:text-white/40">恋愛アルバムにまだ登録がありません</p>;
  }

  return (
    <div className="relative pl-4 border-l-2 border-black/10 dark:border-white/15 space-y-6">
      {sorted.map((p) => (
        <div key={p.id} className="relative">
          <span className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-pink-500" />
          <h4 className="font-semibold">
            {p.name}
            {p.nickname && <span className="text-black/40 dark:text-white/40 text-sm ml-1">({p.nickname})</span>}
          </h4>
          <ul className="text-sm text-black/60 dark:text-white/60 mt-1 space-y-0.5">
            {p.metDate && <li>出会い: {p.metDate}</li>}
            {p.confessDate && <li>告白: {p.confessDate}</li>}
            {p.datingStartDate && <li>交際開始: {p.datingStartDate}</li>}
            {p.breakupDate && <li>お別れ: {p.breakupDate}</li>}
            {p.reunionDate && <li>復縁: {p.reunionDate}</li>}
          </ul>
        </div>
      ))}
    </div>
  );
}
