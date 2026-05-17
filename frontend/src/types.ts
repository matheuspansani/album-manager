export interface Sticker {
  id: number;
  code: string;
  name: string;
  country: string;
  group: string;
  category: string;
  owned: boolean;
  quantity: number;
}

export interface AlbumStats {
  total: number;
  owned: number;
  missing: number;
  duplicates: number;
  completion_percentage: number;
}

export interface CountryProgress {
  country: string;
  group: string;
  total: number;
  owned: number;
  completion_percentage: number;
}
