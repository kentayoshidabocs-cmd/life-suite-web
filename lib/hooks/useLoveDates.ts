import { useFirestoreCollection } from "./useFirestoreCollection";
import { LoveDate } from "@/lib/love/types";

export function useLoveDates() {
  return useFirestoreCollection<LoveDate>("love_dates");
}
