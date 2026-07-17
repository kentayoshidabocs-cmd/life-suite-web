import { WorkShift } from "./types";

export function shiftHours(shift: WorkShift): number {
  const [sh, sm] = shift.startTime.split(":").map(Number);
  const [eh, em] = shift.endTime.split(":").map(Number);
  if ([sh, sm, eh, em].some((n) => Number.isNaN(n))) return 0;
  let minutes = eh * 60 + em - (sh * 60 + sm);
  if (minutes < 0) minutes += 24 * 60;
  minutes -= shift.breakMinutes || 0;
  return Math.max(minutes, 0) / 60;
}

export function shiftIncome(shift: WorkShift): number {
  return shiftHours(shift) * (Number(shift.hourlyWage) || 0);
}

export interface WorkSummary {
  totalHours: number;
  totalDays: number;
  totalIncome: number;
  monthIncome: number;
  yearIncome: number;
  bestMonth: { month: string; hours: number } | null;
  longestShift: { date: string; storeName: string; hours: number } | null;
}

export function calcSummary(shifts: WorkShift[]): WorkSummary {
  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const thisYear = String(now.getFullYear());

  let totalHours = 0;
  let totalIncome = 0;
  let monthIncome = 0;
  let yearIncome = 0;
  const days = new Set<string>();
  const hoursByMonth: Record<string, number> = {};
  let longestShift: WorkSummary["longestShift"] = null;

  for (const s of shifts) {
    const hours = shiftHours(s);
    const income = hours * (Number(s.hourlyWage) || 0);
    totalHours += hours;
    totalIncome += income;
    days.add(s.date);

    const month = s.date.slice(0, 7);
    hoursByMonth[month] = (hoursByMonth[month] || 0) + hours;

    if (month === thisMonth) monthIncome += income;
    if (s.date.slice(0, 4) === thisYear) yearIncome += income;

    if (!longestShift || hours > longestShift.hours) {
      longestShift = { date: s.date, storeName: s.storeName, hours };
    }
  }

  let bestMonth: WorkSummary["bestMonth"] = null;
  for (const [month, hours] of Object.entries(hoursByMonth)) {
    if (!bestMonth || hours > bestMonth.hours) bestMonth = { month, hours };
  }

  return { totalHours, totalDays: days.size, totalIncome, monthIncome, yearIncome, bestMonth, longestShift };
}

export interface TenureSummary {
  storeName: string;
  firstDate: string;
  lastDate: string;
  tenureDays: number;
  totalHours: number;
  totalIncome: number;
}

export function calcTenureByStore(shifts: WorkShift[]): TenureSummary[] {
  const byStore: Record<string, WorkShift[]> = {};
  for (const s of shifts) {
    (byStore[s.storeName] ||= []).push(s);
  }

  return Object.entries(byStore).map(([storeName, list]) => {
    const dates = list.map((s) => s.date).sort();
    const firstDate = dates[0];
    const lastDate = dates[dates.length - 1];
    const tenureDays = Math.max(
      Math.round((new Date().getTime() - new Date(firstDate).getTime()) / 86400000),
      0
    );
    const totalHours = list.reduce((sum, s) => sum + shiftHours(s), 0);
    const totalIncome = list.reduce((sum, s) => sum + shiftIncome(s), 0);
    return { storeName, firstDate, lastDate, tenureDays, totalHours, totalIncome };
  });
}

// 労働基準法の年次有給休暇付与日数(目安)。実際の付与は勤務先の規定・出勤率によって異なる。
const STANDARD_GRANT = [10, 11, 12, 14, 16, 18, 20];
const PRORATED_GRANT: Record<number, number[]> = {
  4: [7, 8, 9, 10, 12, 13, 15],
  3: [5, 6, 6, 8, 9, 10, 11],
  2: [3, 4, 4, 5, 6, 6, 7],
  1: [1, 2, 2, 2, 3, 3, 3],
};
const MILESTONE_DAYS = [182, 547, 912, 1278, 1643, 2008, 2374];

export interface PaidLeaveInfo {
  storeName: string;
  tenureDays: number;
  avgWeeklyDays: number;
  currentGrantDays: number;
  nextGrantDate: string | null;
  nextGrantAmount: number | null;
}

export function calcPaidLeave(shifts: WorkShift[]): PaidLeaveInfo[] {
  const byStore: Record<string, WorkShift[]> = {};
  for (const s of shifts) {
    (byStore[s.storeName] ||= []).push(s);
  }

  return Object.entries(byStore).map(([storeName, list]) => {
    const dates = [...new Set(list.map((s) => s.date))].sort();
    const firstDate = new Date(dates[0]);
    const today = new Date();
    const tenureDays = Math.max(Math.round((today.getTime() - firstDate.getTime()) / 86400000), 0);
    const weeks = Math.max(tenureDays / 7, 1);
    const avgWeeklyDays = Math.min(5, Math.max(1, Math.round(dates.length / weeks)));

    const table = avgWeeklyDays >= 5 ? STANDARD_GRANT : PRORATED_GRANT[avgWeeklyDays];

    let stageIndex = -1;
    for (let i = 0; i < MILESTONE_DAYS.length; i++) {
      if (tenureDays >= MILESTONE_DAYS[i]) stageIndex = i;
    }

    const currentGrantDays = stageIndex >= 0 ? table[stageIndex] : 0;
    const nextIndex = stageIndex + 1;
    const nextGrantDate =
      nextIndex < MILESTONE_DAYS.length
        ? new Date(firstDate.getTime() + MILESTONE_DAYS[nextIndex] * 86400000).toISOString().slice(0, 10)
        : null;
    const nextGrantAmount = nextIndex < table.length ? table[nextIndex] : null;

    return { storeName, tenureDays, avgWeeklyDays, currentGrantDays, nextGrantDate, nextGrantAmount };
  });
}
