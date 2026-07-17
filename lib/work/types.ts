export interface WorkShift {
  date: string;
  storeName: string;
  hourlyWage: number;
  startTime: string;
  endTime: string;
  breakMinutes: number;
  transportFee: number;
  memo?: string;
}

export type WantAgain = "はい" | "いいえ" | "わからない";

export interface WorkPlace {
  storeName: string;
  hourlyWage: number;
  uniform?: string;
  humanRelations?: string;
  busyness?: number;
  ease?: number;
  rating?: number;
  wantAgain?: WantAgain;
}
