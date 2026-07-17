import { useFirestoreCollection } from "./useFirestoreCollection";
import { GoalEntry } from "@/lib/fitness/types";

export function useGoals() {
  return useFirestoreCollection<GoalEntry>("fitness_goals");
}
