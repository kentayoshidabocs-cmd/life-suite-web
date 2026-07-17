"use client";

import { useMemo, useState } from "react";
import { useLovePartners } from "@/lib/hooks/useLovePartners";
import { calcAnniversary } from "@/lib/love/anniversary";

export default function AnniversaryPage() {
  const { data } = useLovePartners();

  const activePartners = useMemo(
    () =>
      data
        .filter((p) => p.datingStartDate && !p.breakupDate)
        .sort((a, b) => (a.datingStartDate! < b.datingStartDate! ? 1 : -1)),
    [data]
  );

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = activePartners.find((p) => p.id === selectedId) || activePartners[0] || null;
  const info = calcAnniversary(selected?.datingStartDate);

  if (activePartners.length === 0) {
    return (
      <p className="text-sm text-black/40 dark:text-white/40">
        「付き合った日」が入力された、別れていない相手が恋愛アルバムに登録されていません。
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {activePartners.length > 1 && (
        <select
          value={selected?.id}
          onChange={(e) => setSelectedId(e.target.value)}
          className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
        >
          {activePartners.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      )}

      {info.message && (
        <div className="rounded-xl bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-200 p-4 text-sm font-medium">
          {info.message}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Stat label="今日で" value={info.daysTogether !== null ? `${info.daysTogether}日` : "―"} />
        <Stat
          label="次の100日単位"
          value={info.next100 ? `${info.next100.date}(あと${info.next100.daysUntil}日)` : "―"}
        />
        <Stat
          label={info.nextHalfYear?.label || "次の半年"}
          value={info.nextHalfYear ? `${info.nextHalfYear.date}(あと${info.nextHalfYear.daysUntil}日)` : "―"}
        />
        <Stat
          label={info.nextYear?.label || "次の1年"}
          value={info.nextYear ? `${info.nextYear.date}(あと${info.nextYear.daysUntil}日)` : "―"}
        />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-black/5 dark:bg-white/10 p-3">
      <p className="text-xs text-black/50 dark:text-white/50">{label}</p>
      <p className="text-sm font-semibold mt-0.5">{value}</p>
    </div>
  );
}
