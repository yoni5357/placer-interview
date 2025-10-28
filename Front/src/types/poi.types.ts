export interface POI {
  id: number;
  entity_id: string;
  entity_type: string | null;
  name: string | null;
  foot_traffic: number;
  sales: number;
  avg_dwell_time_min: number | null;
  area_sqft: number | null;
  ft_per_sqft: number | null;
  geolocation: string | null;
  country: string | null;
  state_code: string | null;
  state_name: string | null;
  city: string | null;
  postal_code: string | null;
  formatted_city: string | null;
  street_address: string | null;
  sub_category: string | null;
  dma: string | null;
  cbsa: string | null;
  chain_id: string | null;
  chain_name: string | null;
  store_id: string | null;
  date_opened: string | null;
  date_closed: string | null;
}

export interface POIFilters {
  chain_name?: string;
  dma?: string;
  category?: string;
  is_open?: boolean;
  page: number;
  limit: number;
}

export interface POIResponse {
  data: POI[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  summary: {
    totalVenues: number;
    totalFootTraffic: number;
  };
}
