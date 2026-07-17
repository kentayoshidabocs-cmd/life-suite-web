import { useFirestoreCollection } from "./useFirestoreCollection";
import { CreditEntry } from "@/lib/campus/types";

export function useCredits() {
  return useFirestoreCollection<CreditEntry>("campus_credits");
}
