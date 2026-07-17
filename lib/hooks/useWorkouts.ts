import { useFirestoreCollection } from "./useFirestoreCollection";
import { WorkoutEntry } from "@/lib/fitness/types";

export function useWorkouts() {
  return useFirestoreCollection<WorkoutEntry>("fitness_workouts");
}
