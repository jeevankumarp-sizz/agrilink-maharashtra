import type { Buyer, CropName, Market, User } from "./types";

export const DEMO_DATA_LABEL = "Regional Market Intelligence — Maharashtra Region";

export const NASHIK = { lat: 19.9975, lng: 73.7898, location: "Nashik, Maharashtra" };

export const DEMO_USERS: User[] = [
  {
    id: "farmer-1",
    name: "Registered Farmer Profile",
    email: "farmer@agrilink.maharashtra.in",
    role: "farmer",
    location: "Nashik, Maharashtra",
    lat: NASHIK.lat,
    lng: NASHIK.lng,
    phone: "+91 98450 12345",
  },
  {
    id: "buyer-1",
    name: "Sahyadri Farmers Producer Co",
    email: "procurement@sahyadripcf.org",
    role: "buyer",
    location: "Nashik, Maharashtra",
    lat: 20.0050,
    lng: 73.7950,
  },
  {
    id: "buyer-2",
    name: "Mahafresh Logistics Pvt Ltd",
    email: "buy@mahafresh.in",
    role: "buyer",
    location: "Pune, Maharashtra",
    lat: 18.5204,
    lng: 73.8567,
  },
  {
    id: "admin-1",
    name: "AgriLink Admin Center",
    email: "admin@agrilink.maharashtra.in",
    role: "admin",
    location: "Mumbai, Maharashtra",
    lat: 18.9388,
    lng: 72.8353,
  },
];

const today = new Date().toISOString().split("T")[0];

function market(
  id: string,
  name: string,
  location: string,
  lat: number,
  lng: number,
  crop: CropName,
  modal: number,
  arrival: number,
  demand: Market["demandLevel"],
  distanceKm: number,
  trend: number[]
): Market {
  return {
    id,
    name,
    location,
    lat,
    lng,
    crop,
    minPrice: Math.round(modal * 0.85),
    modalPrice: modal,
    maxPrice: Math.round(modal * 1.12),
    arrivalVolume: arrival,
    demandLevel: demand,
    distanceKm,
    date: today,
    priceTrend: trend,
  };
}

export const DEMO_MARKETS: Market[] = [
  market("m1", "Nashik APMC (Panchavati)", "Nashik", 19.9975, 73.7898, "Tomato", 29, 450, "HIGH", 8, [25, 26, 27, 28, 29]),
  market("m2", "Pune APMC (Gultekdi)", "Pune", 18.5204, 73.8567, "Tomato", 34, 920, "HIGH", 210, [30, 31, 32, 33, 34]),
  market("m3", "Nagpur APMC (Kalamna)", "Nagpur", 21.1458, 79.0882, "Tomato", 27, 340, "MEDIUM", 680, [23, 24, 25, 26, 27]),
  market("m4", "Solapur APMC", "Solapur", 17.6599, 75.9064, "Tomato", 25, 210, "LOW", 320, [21, 22, 23, 24, 25]),
  market("m5", "Chhatrapati Sambhajinagar APMC", "Sambhajinagar", 19.8762, 75.3433, "Tomato", 28, 290, "MEDIUM", 175, [24, 25, 26, 27, 28]),
  market("m6", "Nashik APMC", "Nashik", 19.9975, 73.7898, "Onion", 24, 750, "HIGH", 8, [20, 21, 22, 23, 24]),
  market("m7", "Lasalgaon APMC (Asia's Largest)", "Lasalgaon", 20.1477, 74.2272, "Onion", 26, 1800, "HIGH", 55, [22, 23, 24, 25, 26]),
  market("m8", "Pune APMC", "Pune", 18.5204, 73.8567, "Onion", 27, 1100, "HIGH", 210, [23, 24, 25, 26, 27]),
  market("m9", "Nashik APMC", "Nashik", 19.9975, 73.7898, "Potato", 19, 580, "HIGH", 8, [15, 16, 17, 18, 19]),
  market("m10", "Ahilyanagar APMC", "Ahilyanagar", 19.0948, 74.7480, "Potato", 18, 320, "MEDIUM", 155, [14, 15, 16, 17, 18]),
  market("m11", "Latur APMC", "Latur", 18.4088, 76.5604, "Soybean", 48, 2400, "HIGH", 380, [44, 45, 46, 47, 48]),
  market("m12", "Akola APMC", "Akola", 20.7002, 77.0082, "Cotton", 62, 1950, "HIGH", 420, [58, 59, 60, 61, 62]),
  market("m13", "Nanded APMC", "Nanded", 19.1383, 77.3210, "Tur (Pigeon Pea)", 72, 1200, "HIGH", 340, [68, 69, 70, 71, 72]),
  market("m14", "Solapur APMC", "Solapur", 17.6599, 75.9064, "Chana (Chickpea)", 54, 890, "MEDIUM", 320, [50, 51, 52, 53, 54]),
  market("m15", "Jalgaon APMC", "Jalgaon", 21.0077, 75.5626, "Brinjal", 22, 380, "HIGH", 230, [18, 19, 20, 21, 22]),
  market("m16", "Pune APMC (Gultekdi)", "Pune", 18.5204, 73.8567, "Bhendi (Okra)", 31, 410, "HIGH", 210, [27, 28, 29, 30, 31]),
  market("m17", "Kolhapur APMC", "Kolhapur", 16.7050, 74.2433, "Green Chilli", 38, 520, "HIGH", 340, [34, 35, 36, 37, 38]),
  market("m18", "Nashik APMC", "Nashik", 19.9975, 73.7898, "Cabbage", 16, 610, "MEDIUM", 8, [12, 13, 14, 15, 16]),
  market("m19", "Sangli APMC", "Sangli", 16.8524, 74.5815, "Cauliflower", 18, 480, "HIGH", 280, [14, 15, 16, 17, 18]),
  market("m20", "Amravati APMC", "Amravati", 20.9374, 77.7796, "Groundnut", 58, 1350, "HIGH", 490, [54, 55, 56, 57, 58]),
  market("m21", "Ahilyanagar APMC", "Ahilyanagar", 19.0948, 74.7480, "Wheat", 25, 1620, "HIGH", 155, [21, 22, 23, 24, 25]),
  market("m22", "Dhule APMC", "Dhule", 20.9042, 74.7749, "Maize", 21, 2100, "HIGH", 260, [17, 18, 19, 20, 21]),
  market("m23", "Kolhapur APMC", "Kolhapur", 16.7050, 74.2433, "Sugarcane", 3.2, 8500, "HIGH", 340, [2.9, 3.0, 3.1, 3.1, 3.2]),
];

function buyer(
  id: string,
  name: string,
  buyerType: Buyer["buyerType"],
  location: string,
  lat: number,
  lng: number,
  crops: CropName[],
  qty: number,
  priceMin: number,
  priceMax: number,
  qualities: Buyer["qualityRequirements"],
  distanceKm: number,
  reliability: number,
  payment: number,
  window: string,
  demand: Buyer["demandLevel"]
): Buyer {
  return {
    id,
    name,
    buyerType,
    location,
    lat,
    lng,
    cropsRequired: crops,
    quantityRequired: qty,
    priceMin,
    priceMax,
    qualityRequirements: qualities,
    distanceKm,
    verified: true,
    reliabilityScore: reliability,
    paymentReliability: payment,
    preferredDeliveryWindow: window,
    demandLevel: demand,
  };
}

export const DEMO_BUYERS: Buyer[] = [
  buyer("b1", "Sahyadri Farmers Producer Co", "FPO", "Nashik", 19.9975, 73.7898, ["Tomato"], 5000, 30, 33, ["Grade A", "Grade B"], 15, 96, 98, "Within 2 days", "HIGH"),
  buyer("b2", "Mahafresh Logistics Pvt Ltd", "Wholesaler", "Pune", 18.5204, 73.8567, ["Tomato", "Onion"], 8000, 29, 32, ["Grade A", "Grade B"], 210, 91, 94, "Within 3 days", "HIGH"),
  buyer("b3", "Maharashtra State Food Corp", "Institutional buyer", "Mumbai", 18.9388, 72.8353, ["Tomato", "Potato", "Onion"], 12000, 28, 31, ["Grade A", "Grade B", "Grade C"], 160, 94, 97, "Within 5 days", "MEDIUM"),
  buyer("b4", "WestIndia Agro Exports", "Exporter", "Navi Mumbai", 19.0330, 73.0297, ["Tomato"], 4000, 31, 35, ["Grade A"], 175, 90, 92, "Within 2 days", "HIGH"),
  buyer("b5", "Sangli Tomato Processors", "Processor", "Sangli", 16.8524, 74.5815, ["Tomato", "Onion"], 3000, 27, 30, ["Grade A", "Grade B"], 280, 87, 90, "Within 4 days", "MEDIUM"),
  buyer("b6", "Solapur Kisan FPO", "FPO", "Solapur", 17.6599, 75.9064, ["Tomato", "Onion", "Potato"], 6000, 28, 31, ["Grade A", "Grade B"], 320, 92, 95, "Within 4 days", "HIGH"),
  buyer("b7", "MahaAgro Processors", "Processor", "Chhatrapati Sambhajinagar", 19.8762, 75.3433, ["Tomato", "Potato"], 4500, 28, 32, ["Grade A", "Grade B"], 175, 89, 91, "Within 5 days", "MEDIUM"),
  buyer("b8", "Reliance Retail Bhiwandi Hub", "Retailer", "Bhiwandi", 19.2812, 73.0483, ["Tomato", "Onion", "Potato"], 8000, 30, 34, ["Grade A"], 150, 95, 96, "Within 3 days", "HIGH"),
  buyer("b9", "Nagpur Agro Hub", "Wholesaler", "Nagpur", 21.1458, 79.0882, ["Onion", "Potato"], 5000, 21, 25, ["Grade A", "Grade B", "Grade C"], 680, 84, 87, "Within 6 days", "LOW"),
  buyer("b10", "Mahagrapes Producer Co", "FPO", "Pune", 18.5204, 73.8567, ["Tomato"], 3000, 31, 34, ["Grade A"], 210, 93, 94, "Within 3 days", "HIGH"),
  buyer("b11", "Star Bazaar Procurement", "Retailer", "Pune", 18.5204, 73.8567, ["Onion"], 6500, 24, 27, ["Grade A", "Grade B"], 210, 92, 94, "Within 4 days", "MEDIUM"),
  buyer("b12", "Western Agro Exports", "Exporter", "JNPT Navi Mumbai", 18.9500, 72.9500, ["Onion"], 4500, 25, 29, ["Grade A"], 180, 88, 90, "Within 3 days", "MEDIUM"),
  buyer("b13", "Nashik Mandi Traders", "Wholesaler", "Nashik", 19.9975, 73.7898, ["Tomato", "Onion", "Potato"], 3500, 27, 30, ["Grade A", "Grade B", "Grade C"], 8, 86, 88, "Same day", "HIGH"),
  buyer("b14", "Sahyadri Agro Processors", "Processor", "Dindori Nashik", 20.2000, 73.8300, ["Potato"], 5500, 18, 21, ["Grade A", "Grade B"], 22, 90, 92, "Within 4 days", "HIGH"),
  buyer("b15", "Kolhapur Fresh Retail Chain", "Retailer", "Kolhapur", 16.7050, 74.2433, ["Tomato", "Potato"], 3500, 29, 33, ["Grade A", "Grade B"], 340, 88, 90, "Within 3 days", "HIGH"),
  buyer("b16", "Orange City Farmers FPO", "FPO", "Nagpur", 21.1458, 79.0882, ["Onion", "Potato"], 4500, 20, 23, ["Grade A", "Grade B"], 680, 87, 89, "Within 5 days", "MEDIUM"),
  buyer("b17", "Global Agri Exports JNPT", "Exporter", "Navi Mumbai", 18.9500, 72.9500, ["Potato"], 6000, 19, 23, ["Grade A"], 180, 86, 88, "Within 5 days", "MEDIUM"),
  buyer("b18", "Ahilyanagar Wholesale Hub", "Wholesaler", "Ahilyanagar", 19.0948, 74.7480, ["Tomato"], 4000, 28, 31, ["Grade A", "Grade B"], 155, 85, 87, "Within 4 days", "MEDIUM"),
];

export const DEMO_SCENARIO = {
  farmerName: "Ramesh Kumar",
  location: "Nashik, Maharashtra",
  lat: NASHIK.lat,
  lng: NASHIK.lng,
  crop: "Tomato" as CropName,
  quantity: 2000,
  unit: "kg",
  qualityGrade: "Grade A" as const,
  sellingDeadlineDays: 3,
  storageAvailableDays: 2,
  harvestDate: today,
  notes: "Fresh harvest from Dindori, Nashik. Grade A red tomatoes.",
};

export const ENGINE_CONSTANTS = {
  transportCostPerKmPer100Kg: 2,
  storageCostPerKgPerDay: 0.15,
  transactionCostPercent: 0.01,
  weights: {
    netRealization: 0.3,
    buyerDemand: 0.2,
    priceTrend: 0.15,
    transportEfficiency: 0.15,
    buyerReliability: 0.1,
    storageTimeSuitability: 0.1,
  },
};
