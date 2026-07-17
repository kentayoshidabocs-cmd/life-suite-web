"use client";

import { useWorkShifts } from "@/lib/hooks/useWorkShifts";
import { calcSummary } from "@/lib/work/stats";

export default function SummaryPage() {
  const { data } = useWorkShifts();
  const s = calcSummary(data);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Stat label="総勤務時間" value={`${s.totalHours.toFixed(1)}h`} />
        <Stat label="総勤務日数" value={`${s.totalDays}日`} />
        <Stat label="総収入" value={`${Math.round(s.totalIncome).toLocaleString()}円`} />
        <Stat label="今月の収入" value={`${Math.round(s.monthIncome).toLocaleString()}円`} />
        <Stat label="今年の収入" value={`${Math.round(s.yearIncome).toLocaleString()}円`} />
      </div>
      <div className="rounded-xl border border-black/10 dark:border-white/15 p-4 text-sm space-y-1">
        <p>一番働いた月: {s.bestMonth ? `${s.bestMonth.month}(${s.bestMonth.hours.toFixed(1)}h)` : "―"}</p>
        <p>
          一番長い勤務:{" "}
          {s.longestShift ? `${s.longestShift.date} ${s.longestShift.storeName}(${s.longestShift.hours.toFixed(1)}h)` : "―"}
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-black/5 dark:bg-white/10 p-3">
      <p className="text-xs text-black/50 dark:text-white/50">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}
