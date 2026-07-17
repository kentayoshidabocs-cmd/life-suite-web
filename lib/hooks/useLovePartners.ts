import { useFirestoreCollection } from "./useFirestoreCollection";
import { LovePartner } from "@/lib/love/types";

export function useLovePartners() {
  return useFirestoreCollection<LovePartner>("love_partners");
}
