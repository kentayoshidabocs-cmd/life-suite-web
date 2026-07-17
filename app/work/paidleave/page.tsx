"use client";

import { useWorkShifts } from "@/lib/hooks/useWorkShifts";
import { calcPaidLeave } from "@/lib/work/stats";

export default function PaidLeavePage() {
  const { data } = useWorkShifts();
  const leaves = calcPaidLeave(data);

  return (
    <div className="space-y-3">
      <p className="text-xs text-black/40 dark:text-white/40">
        ※ 労働基準法の基準に基づく目安の計算です。実際の付与日数・取得可否は勤務先の規定・実際の出勤率によって異なります。
      </p>
      {leaves.length === 0 && <p className="text-sm text-black/40 dark:text-white/40">勤務記録がまだありません</p>}
      {leaves.map((l) => (
        <div key={l.storeName} className="rounded-xl border border-black/10 dark:border-white/15 p-4">
          <h4 className="font-semibold">{l.storeName}</h4>
          <p className="text-sm mt-1">
            勤続日数: {l.tenureDays}日 / 週の平均勤務日数: 約{l.avgWeeklyDays}日
          </p>
          <p className="text-sm">現在取得可能日数: {l.currentGrantDays}日</p>
          <p className="text-sm">
            {l.nextGrantDate ? `次回付与予定日: ${l.nextGrantDate}(${l.nextGrantAmount}日)` : "次回付与予定: 該当なし(上限に到達)"}
          </p>
        </div>
      ))}
    </div>
  );
}
