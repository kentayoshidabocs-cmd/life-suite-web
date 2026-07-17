import { useFirestoreCollection } from "./useFirestoreCollection";
import { MealEntry } from "@/lib/fitness/types";

export function useMeals() {
  return useFirestoreCollection<MealEntry>("fitness_meals");
}
