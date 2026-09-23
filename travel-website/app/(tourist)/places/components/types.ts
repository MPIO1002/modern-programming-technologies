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

export type AdminOption = {
  code: string;
  name: string;
  name_with_type: string;
  slug: string;
  type: string;
  parent_code?: string;
  path?: string;
  path_with_type?: string;
};

export type PlaceFiltersValue = {
  cityId: string;
  wardId: string;
  category: string;
};