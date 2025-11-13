export interface AllowedParams {
  query?: string;
  near?: string;
  ll?: string;
  radius?: number;
  minPrice?: number;
  maxPrice?: number;
  openNow?: boolean;
  openingAt?: number;
  sort?: string;
  limit?: number;
}

export interface FoursquarePlace {
  id: string;
  name: string;
  category?: string;
  address?: string;
  distance?: number;
  lat: number;
  lng: number;
}
