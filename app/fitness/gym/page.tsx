"use client";

import { useWorkouts } from "@/lib/hooks/useWorkouts";
import { calcGymStats } from "@/lib/fitness/stats";

export default function GymPage() {
  const { data } = useWorkouts();
  const stats = calcGymStats(data);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Stat label="今月通った日数" value={`${stats.daysThisMonth}日`} />
        <Stat label="今年通った日数" value={`${stats.daysThisYear}日`} />
        <Stat label="連続記録" value={`${stats.currentStreak}日`} />
        <Stat label="総トレーニング回数" value={`${stats.totalSessions}回`} />
      </div>
      <p className="text-xs text-black/40 dark:text-white/40">
        ※「同年代・同性・同身長・同体重の利用者平均との比較」は、本アプリが単一ユーザー向けのため実データが存在せず未実装です。
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-black/5 dark:bg-white/10 p-4">
      <p className="text-xs text-black/50 dark:text-white/50">{label}</p>
      <p className="text-xl font-semibold mt-0.5">{value}</p>
    </div>
  );
}
