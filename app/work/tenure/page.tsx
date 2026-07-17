"use client";

import { useWorkShifts } from "@/lib/hooks/useWorkShifts";
import { calcTenureByStore } from "@/lib/work/stats";

export default function TenurePage() {
  const { data } = useWorkShifts();
  const tenures = calcTenureByStore(data);

  return (
    <div className="space-y-3">
      {tenures.length === 0 && <p className="text-sm text-black/40 dark:text-white/40">勤務記録がまだありません</p>}
      {tenures.map((t) => (
        <div key={t.storeName} className="rounded-xl border border-black/10 dark:border-white/15 p-4">
          <h4 className="font-semibold">{t.storeName}</h4>
          <p className="text-sm mt-1">
            勤続日数: {t.tenureDays}日({t.firstDate} 〜 {t.lastDate})
          </p>
          <p className="text-sm">
            総勤務時間: {t.totalHours.toFixed(1)}h / 総収入: {Math.round(t.totalIncome).toLocaleString()}円
          </p>
        </div>
      ))}
    </div>
  );
}
