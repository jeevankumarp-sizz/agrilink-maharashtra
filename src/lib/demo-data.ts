import type { Buyer, CropName, Market, User } from "./types";

export const DEMO_DATA_LABEL = "Demo Dataset — Karnataka Region";

export const KOLAR = { lat: 13.1361, lng: 78.1291, location: "Kolar, Karnataka" };

export const DEMO_USERS: User[] = [
  {
    id: "farmer-1",
    name: "Ramesh Kumar",
    email: "ramesh@demo.agrilink.in",
    role: "farmer",
    location: "Kolar, Karnataka",
    lat: KOLAR.lat,
    lng: KOLAR.lng,
    phone: "+91 98765 43210",
  },
  {
    id: "buyer-1",
    name: "FreshFoods Pvt Ltd",
    email: "procurement@freshfoods.in",
    role: "buyer",
    location: "Bengaluru, Karnataka",
    lat: 12.9716,
    lng: 77.5946,
  },
  {
    id: "buyer-2",
    name: "ABC Agro Traders",
    email: "buy@abcagro.in",
    role: "buyer",
    location: "Hoskote, Karnataka",
    lat: 13.0707,
    lng: 77.7983,
  },
  {
    id: "admin-1",
    name: "AgriLink Admin",
    email: "admin@agrilink.in",
    role: "admin",
    location: "Bengaluru, Karnataka",
    lat: 12.9716,
    lng: 77.5946,
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
  market("m1", "Kolar APMC", "Kolar", 13.1361, 78.1291, "Tomato", 28, 420, "HIGH", 8, [24, 25, 26, 27, 28]),
  market("m2", "Yeshwanthpur APMC", "Bengaluru", 13.0284, 77.5408, "Tomato", 32, 890, "HIGH", 72, [28, 29, 30, 31, 32]),
  market("m3", "Mysuru APMC", "Mysuru", 12.2958, 76.6394, "Tomato", 26, 310, "MEDIUM", 185, [22, 23, 24, 25, 26]),
  market("m4", "Hassan APMC", "Hassan", 13.0034, 76.1004, "Tomato", 24, 180, "LOW", 145, [20, 21, 22, 23, 24]),
  market("m5", "Tumakuru APMC", "Tumakuru", 13.3379, 77.1172, "Tomato", 27, 260, "MEDIUM", 95, [23, 24, 25, 26, 27]),
  market("m6", "Kolar APMC", "Kolar", 13.1361, 78.1291, "Onion", 22, 680, "MEDIUM", 8, [18, 19, 20, 21, 22]),
  market("m7", "Yeshwanthpur APMC", "Bengaluru", 13.0284, 77.5408, "Onion", 25, 1200, "HIGH", 72, [21, 22, 23, 24, 25]),
  market("m8", "Ramanagara APMC", "Ramanagara", 12.7239, 77.2814, "Onion", 21, 340, "LOW", 55, [17, 18, 19, 20, 21]),
  market("m9", "Kolar APMC", "Kolar", 13.1361, 78.1291, "Potato", 18, 520, "HIGH", 8, [14, 15, 16, 17, 18]),
  market("m10", "Chikkaballapur APMC", "Chikkaballapur", 13.4355, 77.7315, "Potato", 17, 290, "MEDIUM", 42, [13, 14, 15, 16, 17]),
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
  buyer("b1", "FreshFoods Pvt Ltd", "Processor", "Bengaluru", 12.9716, 77.5946, ["Tomato"], 5000, 29, 32, ["Grade A", "Grade B"], 25, 94, 96, "Within 3 days", "HIGH"),
  buyer("b2", "ABC Agro Traders", "Wholesaler", "Hoskote", 13.0707, 77.7983, ["Tomato", "Onion"], 8000, 28, 31, ["Grade A", "Grade B"], 42, 89, 91, "Within 5 days", "HIGH"),
  buyer("b3", "Karnataka Food Corp", "Institutional buyer", "Bengaluru", 12.9784, 77.5917, ["Tomato", "Potato", "Onion"], 10000, 27, 30, ["Grade A", "Grade B", "Grade C"], 68, 92, 95, "Within 7 days", "MEDIUM"),
  buyer("b4", "GreenHarvest Exports", "Exporter", "Bengaluru", 13.0358, 77.5970, ["Tomato"], 3000, 30, 34, ["Grade A"], 70, 88, 90, "Within 2 days", "HIGH"),
  buyer("b5", "Nandi Fresh Retail", "Retailer", "Chikkaballapur", 13.4355, 77.7315, ["Tomato", "Onion"], 2000, 26, 29, ["Grade A", "Grade B"], 35, 85, 88, "Within 4 days", "MEDIUM"),
  buyer("b6", "Sri Lakshmi FPO", "FPO", "Kolar", 13.1400, 78.1320, ["Tomato", "Onion", "Potato"], 6000, 27, 30, ["Grade A", "Grade B"], 12, 90, 93, "Within 5 days", "HIGH"),
  buyer("b7", "South India Processors", "Processor", "Tumakuru", 13.3379, 77.1172, ["Tomato", "Potato"], 4000, 28, 31, ["Grade A", "Grade B"], 88, 87, 89, "Within 6 days", "MEDIUM"),
  buyer("b8", "Metro Cash & Carry", "Retailer", "Bengaluru", 12.9698, 77.7499, ["Tomato", "Onion", "Potato"], 7000, 29, 33, ["Grade A"], 65, 93, 94, "Within 3 days", "HIGH"),
  buyer("b9", "Hassan Agro Hub", "Wholesaler", "Hassan", 13.0034, 76.1004, ["Onion", "Potato"], 5000, 20, 24, ["Grade A", "Grade B", "Grade C"], 140, 82, 85, "Within 7 days", "LOW"),
  buyer("b10", "Organic Valley FPO", "FPO", "Ramanagara", 12.7239, 77.2814, ["Tomato"], 2500, 30, 33, ["Grade A"], 52, 91, 92, "Within 4 days", "HIGH"),
  buyer("b11", "DailyMart Procurement", "Institutional buyer", "Bengaluru", 12.9352, 77.6245, ["Onion"], 6000, 23, 26, ["Grade A", "Grade B"], 74, 90, 92, "Within 5 days", "MEDIUM"),
  buyer("b12", "SpiceRoute Exports", "Exporter", "Bengaluru", 13.1986, 77.7066, ["Onion"], 4000, 24, 28, ["Grade A"], 78, 86, 88, "Within 3 days", "MEDIUM"),
  buyer("b13", "Kolar Mandi Traders", "Wholesaler", "Kolar", 13.1361, 78.1291, ["Tomato", "Onion", "Potato"], 3000, 26, 29, ["Grade A", "Grade B", "Grade C"], 5, 84, 86, "Same day", "HIGH"),
  buyer("b14", "FarmFresh Processors", "Processor", "Hoskote", 13.0707, 77.7983, ["Potato"], 5000, 17, 20, ["Grade A", "Grade B"], 38, 88, 90, "Within 4 days", "HIGH"),
  buyer("b15", "VeggieKing Retail Chain", "Retailer", "Bengaluru", 12.9141, 77.6101, ["Tomato", "Potato"], 3500, 28, 32, ["Grade A", "Grade B"], 60, 87, 89, "Within 3 days", "HIGH"),
  buyer("b16", "Rural Connect FPO", "FPO", "Tumakuru", 13.3379, 77.1172, ["Onion", "Potato"], 4500, 19, 22, ["Grade A", "Grade B"], 90, 86, 88, "Within 6 days", "MEDIUM"),
  buyer("b17", "Global Agri Exports", "Exporter", "Bengaluru", 13.0358, 77.5970, ["Potato"], 6000, 18, 22, ["Grade A"], 72, 85, 87, "Within 5 days", "MEDIUM"),
  buyer("b18", "Sunrise Wholesale", "Wholesaler", "Chikkaballapur", 13.4355, 77.7315, ["Tomato"], 4000, 27, 30, ["Grade A", "Grade B"], 33, 83, 85, "Within 4 days", "MEDIUM"),
];

export const DEMO_SCENARIO = {
  farmerName: "Ramesh Kumar",
  location: "Kolar, Karnataka",
  lat: KOLAR.lat,
  lng: KOLAR.lng,
  crop: "Tomato" as CropName,
  quantity: 2000,
  unit: "kg",
  qualityGrade: "Grade A" as const,
  sellingDeadlineDays: 3,
  storageAvailableDays: 2,
  harvestDate: today,
  notes: "Fresh harvest, ready for immediate dispatch",
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
