export type BodyPart = "胸" | "背中" | "肩" | "腕" | "腹筋" | "お尻" | "脚";

export const BODY_PARTS: BodyPart[] = ["胸", "背中", "肩", "腕", "腹筋", "お尻", "脚"];

export interface WorkoutEntry {
  date: string;
  bodyPart: BodyPart;
  exercise: string;
  weight: number;
  reps: number;
  sets: number;
  rpe?: number;
  restSeconds?: number;
  memo?: string;
}

export interface ProteinEntry {
  date: string;
  time: string;
  productName: string;
  flavor?: string;
  proteinAmount: number;
  remainingAmount?: number;
}

export interface BodyStatsEntry {
  date: string;
  weight: number;
  heightCm?: number;
  bodyFatPercent?: number;
  muscleMass?: number;
  chest?: number;
  waist?: number;
  hip?: number;
  thigh?: number;
  arm?: number;
}

export interface GoalEntry {
  label: string;
  startWeight: number;
  targetWeight: number;
  startDate: string;
}

export type MealType = "朝" | "昼" | "夜";

export interface MealEntry {
  date: string;
  mealType: MealType;
  description: string;
  protein?: number;
  fat?: number;
  calories?: number;
}

export interface LifeEntry {
  date: string;
  sleepHours?: number;
  water?: number;
  steps?: number;
  period?: boolean;
  condition?: string;
}
