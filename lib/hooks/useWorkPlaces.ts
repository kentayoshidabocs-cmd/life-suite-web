import { useFirestoreCollection } from "./useFirestoreCollection";
import { WorkPlace } from "@/lib/work/types";

export function useWorkPlaces() {
  return useFirestoreCollection<WorkPlace>("work_places");
}
