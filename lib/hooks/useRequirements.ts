import { useFirestoreCollection } from "./useFirestoreCollection";
import { RequirementEntry } from "@/lib/campus/types";

export function useRequirements() {
  return useFirestoreCollection<RequirementEntry>("campus_requirements");
}
