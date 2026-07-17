import { useFirestoreCollection } from "./useFirestoreCollection";
import { RakutanEntry } from "@/lib/campus/types";

export function useRakutan() {
  return useFirestoreCollection<RakutanEntry>("campus_rakutan");
}
