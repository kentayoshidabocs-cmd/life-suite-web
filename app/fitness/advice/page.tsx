"use client";

import { useWorkouts } from "@/lib/hooks/useWorkouts";
import { calcAiAdvice } from "@/lib/fitness/stats";

export default function AdvicePage() {
  const { data } = useWorkouts();
  const advice = calcAiAdvice(data);

  return (
    <div className="space-y-3">
      <p className="text-xs text-black/40 dark:text-white/40">
        ※ トレーニング記録を元にしたルールベースの簡易アドバイスです。
      </p>
      {advice.length === 0 ? (
        <p className="text-sm text-black/40 dark:text-white/40">
          まだアドバイスできるほどの記録がありません。トレーニング記録を追加してみてください。
        </p>
      ) : (
        <ul className="space-y-2">
          {advice.map((a, i) => (
            <li key={i} className="rounded-xl border border-black/10 dark:border-white/15 p-3 text-sm">
              💡 {a}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
