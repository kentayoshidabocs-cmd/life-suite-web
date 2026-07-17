import { useFirestoreCollection } from "./useFirestoreCollection";
import { LoveWishlistItem } from "@/lib/love/types";

export function useLoveWishlist() {
  return useFirestoreCollection<LoveWishlistItem>("love_wishlist");
}
