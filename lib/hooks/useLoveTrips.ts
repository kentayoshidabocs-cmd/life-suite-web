import { useFirestoreCollection } from "./useFirestoreCollection";
import { LoveTrip } from "@/lib/love/types";

export function useLoveTrips() {
  return useFirestoreCollection<LoveTrip>("love_trips");
}
