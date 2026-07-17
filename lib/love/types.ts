export interface LovePartner {
  name: string;
  nickname?: string;
  metDate?: string;
  confessDate?: string;
  datingStartDate?: string;
  breakupDate?: string;
  reunionDate?: string;
  photoUrl?: string;
  memories?: string;
  memo?: string;
}

export interface LoveDate {
  date: string;
  place: string;
  photoUrl?: string;
  impression?: string;
  cost?: number;
  rating?: number;
}

export interface LoveTrip {
  date?: string;
  destination: string;
  prefecture?: string;
  hotel?: string;
  photoUrl?: string;
  cost?: number;
  impression?: string;
}

export interface LoveWishlistItem {
  placeName: string;
  prefecture?: string;
  memo?: string;
}
