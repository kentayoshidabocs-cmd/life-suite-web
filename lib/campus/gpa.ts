import { CreditEntry, RequirementEntry } from "./types";

const GRADE_POINTS: Record<string, number> = { S: 4, A: 3, B: 2, C: 1, D: 0, F: 0 };

export interface CategorySummary {
  category: string;
  required: number;
  earned: number;
  remaining: number;
}

export interface GpaSummary {
  gpa: number;
  earnedCredits: number;
  totalRequired: number;
  remainingTotal: number;
  byCategory: CategorySummary[];
}

export function calcGpaSummary(
  credits: CreditEntry[],
  requirements: RequirementEntry[]
): GpaSummary {
  let gradePointSum = 0;
  let evaluatedCredits = 0;
  let earnedCredits = 0;
  const earnedByCategory: Record<string, number> = {};

  for (const c of credits) {
    const units = Number(c.units) || 0;
    const category = c.category || "未分類";

    if (c.status === "取得済み" || c.status === "不合格") {
      const point = GRADE_POINTS[c.grade];
      if (point !== undefined) {
        gradePointSum += point * units;
        evaluatedCredits += units;
      }
    }
    if (c.status === "取得済み") {
      earnedCredits += units;
      earnedByCategory[category] = (earnedByCategory[category] || 0) + units;
    }
  }

  const gpa = evaluatedCredits > 0 ? gradePointSum / evaluatedCredits : 0;
  const totalRequired = requirements.reduce((sum, r) => sum + (Number(r.requiredUnits) || 0), 0);

  const byCategory: CategorySummary[] = requirements.map((r) => {
    const required = Number(r.requiredUnits) || 0;
    const earned = earnedByCategory[r.category] || 0;
    return { category: r.category, required, earned, remaining: Math.max(required - earned, 0) };
  });

  return {
    gpa: Math.round(gpa * 100) / 100,
    earnedCredits,
    totalRequired,
    remainingTotal: Math.max(totalRequired - earnedCredits, 0),
    byCategory,
  };
}
