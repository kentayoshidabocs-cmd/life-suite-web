import { useFirestoreCollection } from "./useFirestoreCollection";
import { BodyStatsEntry } from "@/lib/fitness/types";

export function useBodyStats() {
  return useFirestoreCollection<BodyStatsEntry>("fitness_bodystats");
}
