import { useFirestoreCollection } from "./useFirestoreCollection";
import { AssignmentEntry } from "@/lib/campus/types";

export function useAssignments() {
  return useFirestoreCollection<AssignmentEntry>("campus_assignments");
}
