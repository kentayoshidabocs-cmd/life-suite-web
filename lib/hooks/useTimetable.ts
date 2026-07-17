import { useFirestoreCollection } from "./useFirestoreCollection";
import { TimetableEntry } from "@/lib/campus/types";

export function useTimetable() {
  return useFirestoreCollection<TimetableEntry>("campus_timetable");
}
