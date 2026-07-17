export type Weekday = "月" | "火" | "水" | "木" | "金" | "土" | "日";

export interface TimetableEntry {
  day: Weekday;
  period: number;
  courseName: string;
  room?: string;
  professor?: string;
  color?: string;
}

export type CreditStatus = "履修中" | "取得済み" | "不合格";
export type Grade = "S" | "A" | "B" | "C" | "D" | "F" | "";

export interface CreditEntry {
  courseName: string;
  units: number;
  category: string;
  status: CreditStatus;
  grade: Grade;
}

export interface RequirementEntry {
  category: string;
  requiredUnits: number;
}

export interface CourseInfoEntry {
  courseName: string;
  testFormat?: string;
  materialsAllowed?: "可" | "不可" | "一部可";
  attendanceMethod?: string;
  reportDueDate?: string;
  professorNotes?: string;
  memo?: string;
}

export interface RakutanEntry {
  courseName: string;
  difficulty: number;
  attendanceStrictness: number;
  testDifficulty: number;
  reportVolume: number;
  review?: string;
  postedAt?: string;
}

export interface AssignmentEntry {
  title: string;
  courseName?: string;
  dueDate: string;
  done: boolean;
}
