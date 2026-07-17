import { useFirestoreCollection } from "./useFirestoreCollection";
import { ProteinEntry } from "@/lib/fitness/types";

export function useProteinLog() {
  return useFirestoreCollection<ProteinEntry>("fitness_protein");
}
