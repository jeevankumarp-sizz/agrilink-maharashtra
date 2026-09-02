export type DataStatus = "live" | "cached" | "fallback" | "error";

export interface AgmarknetRawPriceItem {
  state_name?: string;
  district_name?: string;
  market_name?: string;
  commodity_name?: string;
  variety_name?: string;
  grade_name?: string;
  min_price?: string | number;
  modal_price?: string | number;
  max_price?: string | number;
  arrival_quantity?: string | number;
  unit?: string;
  arrival_date?: string;
  price_date?: string;
  created_at?: string;
  [key: string]: any;
}

export interface AgmarknetRawFilterOptions {
  states?: Array<{ state_id: number | string; state_name: string }>;
  districts?: Array<{ district_id: number | string; district_name: string }>;
  commodities?: Array<{ commodity_id: number | string; commodity_name: string }>;
  markets?: Array<{ market_id: number | string; market_name: string }>;
}

export interface NormalizedMarketPrice {
  id: string;
  source: "AGMARKNET" | "Fallback Dataset";
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  grade: string;
  date: string;
  minPrice: number;
  modalPrice: number;
  maxPrice: number;
  arrivals: number;
  unit: string;
  sourceTimestamp: string;
  syncedAt: string;
  dataStatus: DataStatus;
}

export interface MarketApiResponse<T = NormalizedMarketPrice[]> {
  success: boolean;
  source: "AGMARKNET" | "Fallback Dataset";
  updatedAt: string;
  dataStatus: DataStatus;
  count: number;
  data: T;
  error?: string;
  message?: string;
}

export interface MarketFilterParams {
  state?: string;
  district?: string;
  market?: string;
  commodity?: string;
  variety?: string;
  grade?: string;
  date?: string;
  fromDate?: string;
  toDate?: string;
  limit?: number;
}
