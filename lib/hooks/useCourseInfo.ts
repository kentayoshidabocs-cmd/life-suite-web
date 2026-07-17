import { useFirestoreCollection } from "./useFirestoreCollection";
import { CourseInfoEntry } from "@/lib/campus/types";

export function useCourseInfo() {
  return useFirestoreCollection<CourseInfoEntry>("campus_courseinfo");
}
