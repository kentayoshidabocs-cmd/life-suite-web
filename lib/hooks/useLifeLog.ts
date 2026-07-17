import { useFirestoreCollection } from "./useFirestoreCollection";
import { LifeEntry } from "@/lib/fitness/types";

export function useLifeLog() {
  return useFirestoreCollection<LifeEntry>("fitness_life");
}
