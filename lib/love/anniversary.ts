function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function daysUntil(target: Date, today: Date): number {
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}

export interface AnniversaryInfo {
  daysTogether: number | null;
  next100: { date: string; daysUntil: number } | null;
  nextHalfYear: { date: string; daysUntil: number; label: string } | null;
  nextYear: { date: string; daysUntil: number; label: string } | null;
  message: string | null;
}

export function calcAnniversary(datingStartDate?: string): AnniversaryInfo {
  if (!datingStartDate) {
    return { daysTogether: null, next100: null, nextHalfYear: null, nextYear: null, message: null };
  }
  const start = new Date(datingStartDate);
  start.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysTogether = Math.round((today.getTime() - start.getTime()) / 86400000);

  const next100Multiple = (Math.floor(daysTogether / 100) + 1) * 100;
  const next100Date = addDays(start, next100Multiple);
  const next100 = { date: toISODate(next100Date), daysUntil: daysUntil(next100Date, today) };

  let halfYearCount = 1;
  let halfYearDate = addMonths(start, 6);
  while (halfYearDate.getTime() <= today.getTime()) {
    halfYearCount++;
    halfYearDate = addMonths(start, halfYearCount * 6);
  }
  const nextHalfYear = {
    date: toISODate(halfYearDate),
    daysUntil: daysUntil(halfYearDate, today),
    label: `${halfYearCount * 6}ヶ月記念日`,
  };

  let yearCount = 1;
  let yearDate = addMonths(start, 12);
  while (yearDate.getTime() <= today.getTime()) {
    yearCount++;
    yearDate = addMonths(start, yearCount * 12);
  }
  const nextYear = {
    date: toISODate(yearDate),
    daysUntil: daysUntil(yearDate, today),
    label: `${yearCount}周年記念日`,
  };

  const soonest = Math.min(next100.daysUntil, nextHalfYear.daysUntil, nextYear.daysUntil);
  let message: string | null = null;
  if (daysTogether === 0) message = "今日から記念日がスタート!おめでとうございます🎉";
  else if (soonest === 0) message = "今日は記念日です!おめでとうございます🎉";
  else if (soonest <= 7) message = `もうすぐ記念日です(あと${soonest}日)`;

  return { daysTogether, next100, nextHalfYear, nextYear, message };
}
