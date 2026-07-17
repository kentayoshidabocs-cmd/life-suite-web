import { WorkoutEntry, MealEntry, GoalEntry, BodyStatsEntry } from "./types";

export interface PersonalBest {
  exercise: string;
  maxWeight: number;
  maxReps: number;
  estimatedMax: number;
}

// 推定1RMはEpleyの公式: weight * (1 + reps / 30)
export function calcPersonalBests(workouts: WorkoutEntry[]): PersonalBest[] {
  const byExercise: Record<string, WorkoutEntry[]> = {};
  for (const w of workouts) {
    (byExercise[w.exercise] ||= []).push(w);
  }
  return Object.entries(byExercise).map(([exercise, list]) => {
    const maxWeight = Math.max(...list.map((w) => w.weight || 0));
    const maxReps = Math.max(...list.map((w) => w.reps || 0));
    const estimatedMax = Math.max(...list.map((w) => (w.weight || 0) * (1 + (w.reps || 0) / 30)));
    return { exercise, maxWeight, maxReps, estimatedMax: Math.round(estimatedMax * 10) / 10 };
  });
}

export interface GymStats {
  daysThisMonth: number;
  daysThisYear: number;
  currentStreak: number;
  totalSessions: number;
}

export function calcGymStats(workouts: WorkoutEntry[]): GymStats {
  const dates = [...new Set(workouts.map((w) => w.date))].sort();
  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const thisYear = String(now.getFullYear());

  const daysThisMonth = dates.filter((d) => d.startsWith(thisMonth)).length;
  const daysThisYear = dates.filter((d) => d.startsWith(thisYear)).length;

  const dateSet = new Set(dates);
  let currentStreak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  // 今日まだ記録がなければ、昨日を起点に連続日数を数える
  if (!dateSet.has(cursor.toISOString().slice(0, 10))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (dateSet.has(cursor.toISOString().slice(0, 10))) {
    currentStreak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return { daysThisMonth, daysThisYear, currentStreak, totalSessions: dates.length };
}

export function calcAiAdvice(workouts: WorkoutEntry[]): string[] {
  const advice: string[] = [];
  const now = new Date();
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - 14);
  const recent = workouts.filter((w) => new Date(w.date) >= cutoff);

  const countByPart: Record<string, number> = {};
  const lastDateByPart: Record<string, string> = {};
  for (const w of workouts) {
    countByPart[w.bodyPart] = 0;
  }
  for (const w of recent) {
    countByPart[w.bodyPart] = (countByPart[w.bodyPart] || 0) + 1;
  }
  for (const w of workouts) {
    if (!lastDateByPart[w.bodyPart] || w.date > lastDateByPart[w.bodyPart]) {
      lastDateByPart[w.bodyPart] = w.date;
    }
  }

  const entries = Object.entries(countByPart);
  if (entries.length > 0) {
    const [mostPart, mostCount] = entries.reduce((a, b) => (b[1] > a[1] ? b : a));
    if (mostCount >= 4) advice.push(`ここ2週間は「${mostPart}の日」が多めです。他の部位もバランスよく鍛えましょう。`);

    for (const [part, lastDate] of Object.entries(lastDateByPart)) {
      const days = Math.round((now.getTime() - new Date(lastDate).getTime()) / 86400000);
      if (days >= 10) advice.push(`「${part}」を最近(${days}日)やっていません。そろそろトレーニングを。`);
    }
  }

  const byExercise: Record<string, WorkoutEntry[]> = {};
  for (const w of workouts) (byExercise[w.exercise] ||= []).push(w);
  for (const [exercise, list] of Object.entries(byExercise)) {
    const sorted = [...list].sort((a, b) => (a.date < b.date ? -1 : 1));
    const last = sorted[sorted.length - 1];
    const prevMax = Math.max(...sorted.slice(0, -1).map((w) => w.weight || 0), 0);
    if (last && last.weight >= prevMax && prevMax > 0) {
      advice.push(`「${exercise}」は自己ベスト更新中です!次回は重量アップも検討してみましょう。`);
    }
  }

  return advice.slice(0, 6);
}

export interface GoalProgress {
  currentWeight: number | null;
  remaining: number | null;
  achievementRate: number | null;
  predictedDate: string | null;
}

export function calcGoalProgress(goal: GoalEntry, bodyStats: BodyStatsEntry[]): GoalProgress {
  const sorted = [...bodyStats].sort((a, b) => (a.date < b.date ? -1 : 1));
  const currentWeight = sorted.length > 0 ? sorted[sorted.length - 1].weight : null;
  if (currentWeight === null) {
    return { currentWeight: null, remaining: null, achievementRate: null, predictedDate: null };
  }

  const totalChange = goal.targetWeight - goal.startWeight;
  const currentChange = currentWeight - goal.startWeight;
  const remaining = Math.round((goal.targetWeight - currentWeight) * 10) / 10;
  const achievementRate = totalChange !== 0 ? Math.round((currentChange / totalChange) * 1000) / 10 : null;

  let predictedDate: string | null = null;
  const start = new Date(goal.startDate);
  const daysElapsed = Math.round((new Date().getTime() - start.getTime()) / 86400000);
  if (daysElapsed > 0 && currentChange !== 0 && totalChange !== 0 && Math.sign(currentChange) === Math.sign(totalChange)) {
    const ratePerDay = currentChange / daysElapsed;
    const daysNeeded = (goal.targetWeight - currentWeight) / ratePerDay;
    if (daysNeeded > 0 && Number.isFinite(daysNeeded)) {
      const predicted = new Date();
      predicted.setDate(predicted.getDate() + Math.round(daysNeeded));
      predictedDate = predicted.toISOString().slice(0, 10);
    }
  }

  return { currentWeight, remaining, achievementRate, predictedDate };
}

export interface MealAdvice {
  totalProtein: number;
  totalFat: number;
  totalCalories: number;
  messages: string[];
}

export function calcMealAdvice(meals: MealEntry[], bodyWeightKg: number | null): MealAdvice {
  const totalProtein = meals.reduce((s, m) => s + (m.protein || 0), 0);
  const totalFat = meals.reduce((s, m) => s + (m.fat || 0), 0);
  const totalCalories = meals.reduce((s, m) => s + (m.calories || 0), 0);

  const messages: string[] = [];
  const weight = bodyWeightKg || 60;

  if (totalProtein < weight * 1.2) messages.push("タンパク質不足の可能性があります(目安: 体重1kgあたり1.6g)");
  if (totalCalories > 0 && (totalFat * 9) / totalCalories > 0.35) messages.push("脂質多めの傾向があります");
  if (totalCalories > 0 && totalCalories < weight * 25) messages.push("カロリー不足の可能性があります");
  if (messages.length === 0 && totalCalories > 0) messages.push("バランスは良さそうです");

  return { totalProtein, totalFat, totalCalories, messages };
}
