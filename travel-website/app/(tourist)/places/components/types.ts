export type Boundary = {
  type: number;
  id: number;
  name: string;
  prefix: string;
  full_name: string;
};

export type Suggestion = {
  ref_id: string;
  name: string;
  display: string;
  address: string;
  boundaries?: Boundary[];
  categories?: string[];
  distance?: number;
};

export type PlaceFiltersValue = {
  cityId: string;
  wardId: string;
  category: string;
};

export type Place = {
  id: string;
  slug: string;
  name: string;
  description: string;
  thumbnail: string;
  lat: number;
  lng: number;
  category: string;
  openTime: string;
  price: string;
  experience: string;
  province: number
};