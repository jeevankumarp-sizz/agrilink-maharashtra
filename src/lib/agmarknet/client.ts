import type {
  AgmarknetRawFilterOptions,
  AgmarknetRawPriceItem,
  MarketApiResponse,
  MarketFilterParams,
  NormalizedMarketPrice,
} from "./types";
import { MAHARASHTRA_FALLBACK_MARKET_DATA, normalizeAgmarknetItem } from "./normalizer";

const AGMARKNET_BASE_URL = process.env.AGMARKNET_API_URL || "https://api.agmarknet.gov.in/v1";
const REQUEST_TIMEOUT_MS = 6000; // 6 sec timeout for serverless route handlers

/**
 * Fetch helper with strict timeout and custom AGMARKNET headers.
 */
async function fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
        Accept: "application/json, text/plain, */*",
        Origin: "https://agmarknet.gov.in",
        Referer: "https://agmarknet.gov.in/",
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      next: { revalidate: 300 }, // 5-minute Next.js fetch cache
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Fetches market prices from AGMARKNET 2.0 or safe reference dataset.
 */
export async function getMarketPrices(
  params: MarketFilterParams = {}
): Promise<MarketApiResponse<NormalizedMarketPrice[]>> {
  const targetState = params.state || "Maharashtra";
  const targetCommodity = params.commodity;
  const targetDistrict = params.district;
  const targetMarket = params.market;

  try {
    // Attempt AGMARKNET 2.0 daily report endpoint
    const endpoint = `${AGMARKNET_BASE_URL}/prices-and-arrivals/commodity-market/daily-report-state-marketwise`;
    const searchParams = new URLSearchParams();
    if (targetState) searchParams.set("state", targetState);
    if (targetCommodity) searchParams.set("commodity", targetCommodity);
    if (targetDistrict) searchParams.set("district", targetDistrict);

    const fullUrl = `${endpoint}?${searchParams.toString()}`;
    const res = await fetchWithTimeout(fullUrl);

    if (res.ok) {
      const rawData = await res.json();
      const rawItems: AgmarknetRawPriceItem[] = Array.isArray(rawData)
        ? rawData
        : rawData?.data || rawData?.records || [];

      if (rawItems && rawItems.length > 0) {
        const normalized = rawItems.map((item) => normalizeAgmarknetItem(item, "live"));
        
        // Apply secondary client-side filtering if parameters specified
        const filtered = filterPrices(normalized, params);
        
        return {
          success: true,
          source: "AGMARKNET",
          updatedAt: new Date().toISOString(),
          dataStatus: "live",
          count: filtered.length,
          data: filtered,
        };
      }
    }
  } catch (err: any) {
    console.warn("[AGMARKNET Client] Upstream API call failed or timed out:", err?.message || err);
  }

  // Graceful fallback to Maharashtra reference dataset
  const fallbackFiltered = filterPrices(MAHARASHTRA_FALLBACK_MARKET_DATA, params);

  return {
    success: true,
    source: "Reference Dataset",
    updatedAt: new Date().toISOString(),
    dataStatus: "reference",
    count: fallbackFiltered.length,
    data: fallbackFiltered,
    message: "Using state reference market dataset. Source AGMARKNET 2.0 temporarily unavailable.",
  };
}

/**
 * Fetches market filter dropdown options (states, districts, commodities).
 */
export async function getMarketFilters(): Promise<MarketApiResponse<{
  states: string[];
  districts: string[];
  commodities: string[];
  markets: string[];
}>> {
  const maharashtraDistricts = ["Nashik", "Pune", "Ahilyanagar", "Solapur", "Nagpur", "Sangli", "Kolhapur", "Chhatrapati Sambhajinagar"];
  const commodities = ["Tomato", "Onion", "Potato", "Soybean", "Cotton", "Wheat", "Maize"];
  const markets = [
    "Nashik APMC (Panchavati Hub)",
    "Lasalgaon APMC",
    "Pune APMC (Gultekdi Hub)",
    "Rahuri APMC",
    "Solapur APMC",
    "Manchar APMC",
    "Kalamna APMC (Nagpur)",
  ];

  try {
    const res = await fetchWithTimeout(`${AGMARKNET_BASE_URL}/daily-price-arrival/filters`);
    if (res.ok) {
      const json: AgmarknetRawFilterOptions = await res.json();
      if (json) {
        return {
          success: true,
          source: "AGMARKNET",
          updatedAt: new Date().toISOString(),
          dataStatus: "live",
          count: 1,
          data: {
            states: json.states?.map((s) => s.state_name) || ["Maharashtra"],
            districts: json.districts?.map((d) => d.district_name) || maharashtraDistricts,
            commodities: json.commodities?.map((c) => c.commodity_name) || commodities,
            markets: json.markets?.map((m) => m.market_name) || markets,
          },
        };
      }
    }
  } catch (err) {
    // Fallthrough to fallback options below
  }

  return {
    success: true,
    source: "Reference Dataset",
    updatedAt: new Date().toISOString(),
    dataStatus: "reference",
    count: 1,
    data: {
      states: ["Maharashtra"],
      districts: maharashtraDistricts,
      commodities,
      markets,
    },
    message: "Filters provided via reference dataset.",
  };
}

/**
 * Filter helper for localized dataset filtering.
 */
function filterPrices(items: NormalizedMarketPrice[], params: MarketFilterParams): NormalizedMarketPrice[] {
  return items.filter((item) => {
    if (params.state && item.state.toLowerCase() !== params.state.toLowerCase()) return false;
    if (params.commodity && !item.commodity.toLowerCase().includes(params.commodity.toLowerCase())) return false;
    if (params.district && !item.district.toLowerCase().includes(params.district.toLowerCase())) return false;
    if (params.market && !item.market.toLowerCase().includes(params.market.toLowerCase())) return false;
    return true;
  });
}
