import { useFirestoreCollection } from "./useFirestoreCollection";
import { WorkShift } from "@/lib/work/types";

export function useWorkShifts() {
  return useFirestoreCollection<WorkShift>("work_shifts");
}
