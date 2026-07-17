"use client";

import { useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useWorkouts } from "@/lib/hooks/useWorkouts";
import { calcPersonalBests } from "@/lib/fitness/stats";

export default function ProgressPage() {
  const { data } = useWorkouts();
  const exercises = useMemo(() => [...new Set(data.map((w) => w.exercise))].sort(), [data]);
  const [selected, setSelected] = useState<string>("");

  const exercise = selected || exercises[0] || "";
  const chartData = useMemo(
    () =>
      data
        .filter((w) => w.exercise === exercise)
        .sort((a, b) => (a.date < b.date ? -1 : 1))
        .map((w) => ({ date: w.date, weight: w.weight, reps: w.reps })),
    [data, exercise]
  );

  const bests = calcPersonalBests(data);

  return (
    <div className="space-y-6">
      {exercises.length === 0 ? (
        <p className="text-sm text-black/40 dark:text-white/40">トレーニング記録がまだありません</p>
      ) : (
        <>
          <select
            value={exercise}
            onChange={(e) => setSelected(e.target.value)}
            className="rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-2 py-1.5 text-sm"
          >
            {exercises.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>

          <div className="rounded-xl border border-black/10 dark:border-white/15 p-4">
            <p className="text-sm font-semibold mb-2">重量推移</p>
            <div style={{ width: "100%", height: 240 }}>
              <ResponsiveContainer>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="weight" name="重量(kg)" stroke="#2a78d6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border border-black/10 dark:border-white/15 p-4">
            <p className="text-sm font-semibold mb-2">回数推移</p>
            <div style={{ width: "100%", height: 240 }}>
              <ResponsiveContainer>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="reps" name="回数" stroke="#e87ba4" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      <div className="rounded-xl border border-black/10 dark:border-white/15 p-4">
        <p className="text-sm font-semibold mb-2">自己ベスト</p>
        {bests.length === 0 ? (
          <p className="text-sm text-black/40 dark:text-white/40">まだ記録がありません</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-black/40 dark:text-white/40 text-left">
              <tr>
                <th className="py-1">種目</th>
                <th>最大重量</th>
                <th>最大回数</th>
                <th>推定MAX</th>
              </tr>
            </thead>
            <tbody>
              {bests.map((b) => (
                <tr key={b.exercise} className="border-t border-black/5 dark:border-white/10">
                  <td className="py-1.5">{b.exercise}</td>
                  <td>{b.maxWeight}kg</td>
                  <td>{b.maxReps}回</td>
                  <td>{b.estimatedMax}kg</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
