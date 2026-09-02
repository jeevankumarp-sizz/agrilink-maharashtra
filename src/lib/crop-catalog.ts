import type { CropName } from "./types";

export interface CropCatalogItem {
  id: string;
  name: CropName;
  category: "Vegetables" | "Pulses & Oilseeds" | "Cereals" | "Commercial Crops";
  marathiName: string;
  hindiName: string;
  icon: string;
  unit: string;
  typicalMarketUnit: string;
  districts: string[];
  exampleMarkets: string[];
  referencePriceMin: number;
  referencePriceModal: number;
  referencePriceMax: number;
  typicalArrivalQty: number;
  buyerDemandLevel: "HIGH" | "MEDIUM" | "LOW";
  storageSuitabilityDays: number;
  image: string;
}

export const MAHARASHTRA_CROP_CATALOG: CropCatalogItem[] = [
  // VEGETABLES
  {
    id: "crop-onion",
    name: "Onion",
    category: "Vegetables",
    marathiName: "कांदा",
    hindiName: "प्याज़",
    icon: "🧅",
    unit: "kg",
    typicalMarketUnit: "Quintal",
    districts: ["Nashik", "Ahilyanagar", "Solapur", "Pune"],
    exampleMarkets: ["Lasalgaon APMC", "Nashik APMC", "Rahuri APMC", "Solapur APMC"],
    referencePriceMin: 22.0,
    referencePriceModal: 25.5,
    referencePriceMax: 28.5,
    typicalArrivalQty: 12500,
    buyerDemandLevel: "HIGH",
    storageSuitabilityDays: 60,
    image: "/images/crops/onion.jpg",
  },
  {
    id: "crop-tomato",
    name: "Tomato",
    category: "Vegetables",
    marathiName: "टोमॅटो",
    hindiName: "टमाटर",
    icon: "🍅",
    unit: "kg",
    typicalMarketUnit: "Quintal",
    districts: ["Nashik", "Pune", "Solapur", "Nagpur", "Chhatrapati Sambhajinagar"],
    exampleMarkets: ["Nashik APMC (Panchavati)", "Pune APMC (Gultekdi)", "Kalamna APMC (Nagpur)"],
    referencePriceMin: 28.5,
    referencePriceModal: 31.5,
    referencePriceMax: 35.0,
    typicalArrivalQty: 4200,
    buyerDemandLevel: "HIGH",
    storageSuitabilityDays: 5,
    image: "/images/crops/tomato.jpg",
  },
  {
    id: "crop-potato",
    name: "Potato",
    category: "Vegetables",
    marathiName: "बटाटा",
    hindiName: "आलू",
    icon: "🥔",
    unit: "kg",
    typicalMarketUnit: "Quintal",
    districts: ["Pune", "Ahilyanagar", "Satara"],
    exampleMarkets: ["Manchar APMC", "Pune APMC", "Ahilyanagar APMC"],
    referencePriceMin: 18.0,
    referencePriceModal: 21.0,
    referencePriceMax: 24.0,
    typicalArrivalQty: 6400,
    buyerDemandLevel: "HIGH",
    storageSuitabilityDays: 45,
    image: "/images/crops/potato.jpg",
  },
  {
    id: "crop-brinjal",
    name: "Brinjal",
    category: "Vegetables",
    marathiName: "वांगी",
    hindiName: "बैंगन",
    icon: "🍆",
    unit: "kg",
    typicalMarketUnit: "Quintal",
    districts: ["Jalgaon", "Sangli", "Kolhapur"],
    exampleMarkets: ["Jalgaon APMC", "Sangli APMC", "Kolhapur APMC"],
    referencePriceMin: 19.0,
    referencePriceModal: 22.5,
    referencePriceMax: 26.0,
    typicalArrivalQty: 2800,
    buyerDemandLevel: "HIGH",
    storageSuitabilityDays: 4,
    image: "/images/crops/brinjal.jpg",
  },
  {
    id: "crop-bhendi",
    name: "Bhendi (Okra)",
    category: "Vegetables",
    marathiName: "भेंडी",
    hindiName: "भिंडी",
    icon: "🌿",
    unit: "kg",
    typicalMarketUnit: "Quintal",
    districts: ["Pune", "Nashik", "Thane"],
    exampleMarkets: ["Pune APMC (Gultekdi)", "Nashik APMC"],
    referencePriceMin: 27.0,
    referencePriceModal: 31.0,
    referencePriceMax: 35.0,
    typicalArrivalQty: 3100,
    buyerDemandLevel: "HIGH",
    storageSuitabilityDays: 3,
    image: "/images/crops/okra.jpg",
  },
  {
    id: "crop-greenchilli",
    name: "Green Chilli",
    category: "Vegetables",
    marathiName: "हिरवी मिरची",
    hindiName: "हरी मिर्च",
    icon: "🌶",
    unit: "kg",
    typicalMarketUnit: "Quintal",
    districts: ["Kolhapur", "Solapur", "Nanded"],
    exampleMarkets: ["Kolhapur APMC", "Solapur APMC", "Nanded APMC"],
    referencePriceMin: 34.0,
    referencePriceModal: 38.5,
    referencePriceMax: 44.0,
    typicalArrivalQty: 2500,
    buyerDemandLevel: "HIGH",
    storageSuitabilityDays: 5,
    image: "/images/crops/green-chilli.jpg",
  },
  {
    id: "crop-cabbage",
    name: "Cabbage",
    category: "Vegetables",
    marathiName: "कोबी",
    hindiName: "पत्ता गोभी",
    icon: "🥬",
    unit: "kg",
    typicalMarketUnit: "Quintal",
    districts: ["Nashik", "Pune", "Satara"],
    exampleMarkets: ["Nashik APMC", "Pune APMC"],
    referencePriceMin: 12.0,
    referencePriceModal: 15.5,
    referencePriceMax: 18.5,
    typicalArrivalQty: 4800,
    buyerDemandLevel: "MEDIUM",
    storageSuitabilityDays: 10,
    image: "/images/crops/cabbage.jpg",
  },
  {
    id: "crop-cauliflower",
    name: "Cauliflower",
    category: "Vegetables",
    marathiName: "फ्लॉवर",
    hindiName: "फूलगोभी",
    icon: "🥦",
    unit: "kg",
    typicalMarketUnit: "Quintal",
    districts: ["Sangli", "Nashik", "Kolhapur"],
    exampleMarkets: ["Sangli APMC", "Nashik APMC"],
    referencePriceMin: 14.0,
    referencePriceModal: 18.0,
    referencePriceMax: 21.0,
    typicalArrivalQty: 3900,
    buyerDemandLevel: "HIGH",
    storageSuitabilityDays: 7,
    image: "/images/crops/cauliflower.jpg",
  },

  // PULSES & OILSEEDS
  {
    id: "crop-soybean",
    name: "Soybean",
    category: "Pulses & Oilseeds",
    marathiName: "सोयाबीन",
    hindiName: "सोयाबीन",
    icon: "🌱",
    unit: "kg",
    typicalMarketUnit: "Quintal",
    districts: ["Latur", "Nanded", "Akola", "Amravati", "Hingoli"],
    exampleMarkets: ["Latur APMC", "Akola APMC", "Nanded APMC", "Amravati APMC"],
    referencePriceMin: 44.0,
    referencePriceModal: 48.0,
    referencePriceMax: 52.0,
    typicalArrivalQty: 24000,
    buyerDemandLevel: "HIGH",
    storageSuitabilityDays: 180,
    image: "/images/crops/soybean.jpg",
  },
  {
    id: "crop-tur",
    name: "Tur (Pigeon Pea)",
    category: "Pulses & Oilseeds",
    marathiName: "तूर",
    hindiName: "तुअर",
    icon: "🫘",
    unit: "kg",
    typicalMarketUnit: "Quintal",
    districts: ["Nanded", "Latur", "Solapur", "Chhatrapati Sambhajinagar"],
    exampleMarkets: ["Nanded APMC", "Latur APMC", "Solapur APMC"],
    referencePriceMin: 68.0,
    referencePriceModal: 72.0,
    referencePriceMax: 77.0,
    typicalArrivalQty: 12000,
    buyerDemandLevel: "HIGH",
    storageSuitabilityDays: 240,
    image: "/images/crops/tur.jpg",
  },
  {
    id: "crop-chana",
    name: "Chana (Chickpea)",
    category: "Pulses & Oilseeds",
    marathiName: "हरभरा",
    hindiName: "चना",
    icon: "🟡",
    unit: "kg",
    typicalMarketUnit: "Quintal",
    districts: ["Solapur", "Ahilyanagar", "Dharashiv"],
    exampleMarkets: ["Solapur APMC", "Ahilyanagar APMC"],
    referencePriceMin: 50.0,
    referencePriceModal: 54.0,
    referencePriceMax: 58.0,
    typicalArrivalQty: 8900,
    buyerDemandLevel: "MEDIUM",
    storageSuitabilityDays: 180,
    image: "/images/crops/chickpea.jpg",
  },
  {
    id: "crop-groundnut",
    name: "Groundnut",
    category: "Pulses & Oilseeds",
    marathiName: "भुईमूग",
    hindiName: "मूंगफली",
    icon: "🥜",
    unit: "kg",
    typicalMarketUnit: "Quintal",
    districts: ["Amravati", "Dhule", "Kolhapur"],
    exampleMarkets: ["Amravati APMC", "Dhule APMC"],
    referencePriceMin: 54.0,
    referencePriceModal: 58.5,
    referencePriceMax: 63.0,
    typicalArrivalQty: 7500,
    buyerDemandLevel: "HIGH",
    storageSuitabilityDays: 120,
    image: "/images/crops/groundnut.jpg",
  },

  // CEREALS
  {
    id: "crop-wheat",
    name: "Wheat",
    category: "Cereals",
    marathiName: "गहू",
    hindiName: "गेहूँ",
    icon: "🌾",
    unit: "kg",
    typicalMarketUnit: "Quintal",
    districts: ["Ahilyanagar", "Nashik", "Pune", "Chhatrapati Sambhajinagar"],
    exampleMarkets: ["Ahilyanagar APMC", "Nashik APMC"],
    referencePriceMin: 22.0,
    referencePriceModal: 25.0,
    referencePriceMax: 28.0,
    typicalArrivalQty: 16200,
    buyerDemandLevel: "HIGH",
    storageSuitabilityDays: 360,
    image: "/images/crops/wheat.jpg",
  },
  {
    id: "crop-maize",
    name: "Maize",
    category: "Cereals",
    marathiName: "मका",
    hindiName: "मक्का",
    icon: "🌽",
    unit: "kg",
    typicalMarketUnit: "Quintal",
    districts: ["Dhule", "Jalgaon", "Nashik"],
    exampleMarkets: ["Dhule APMC", "Jalgaon APMC"],
    referencePriceMin: 18.5,
    referencePriceModal: 21.5,
    referencePriceMax: 24.5,
    typicalArrivalQty: 21000,
    buyerDemandLevel: "HIGH",
    storageSuitabilityDays: 180,
    image: "/images/crops/maize.jpg",
  },
  {
    id: "crop-jowar",
    name: "Jowar (Sorghum)",
    category: "Cereals",
    marathiName: "ज्वारी",
    hindiName: "ज्वार",
    icon: "🥣",
    unit: "kg",
    typicalMarketUnit: "Quintal",
    districts: ["Solapur", "Ahilyanagar", "Sangli", "Satara"],
    exampleMarkets: ["Solapur APMC", "Sangli APMC"],
    referencePriceMin: 28.0,
    referencePriceModal: 32.0,
    referencePriceMax: 36.0,
    typicalArrivalQty: 9500,
    buyerDemandLevel: "HIGH",
    storageSuitabilityDays: 240,
    image: "/images/crops/jowar.jpg",
  },
  {
    id: "crop-bajra",
    name: "Bajra (Pearl Millet)",
    category: "Cereals",
    marathiName: "बाजरी",
    hindiName: "बाजरा",
    icon: "🌾",
    unit: "kg",
    typicalMarketUnit: "Quintal",
    districts: ["Ahilyanagar", "Dhule", "Nashik"],
    exampleMarkets: ["Ahilyanagar APMC", "Dhule APMC"],
    referencePriceMin: 21.0,
    referencePriceModal: 24.0,
    referencePriceMax: 27.5,
    typicalArrivalQty: 8200,
    buyerDemandLevel: "MEDIUM",
    storageSuitabilityDays: 180,
    image: "/images/crops/bajra.jpg",
  },

  // COMMERCIAL CROPS
  {
    id: "crop-cotton",
    name: "Cotton",
    category: "Commercial Crops",
    marathiName: "कापूस",
    hindiName: "कपास",
    icon: "☁️",
    unit: "kg",
    typicalMarketUnit: "Quintal",
    districts: ["Akola", "Yavatmal", "Amravati", "Jalgaon", "Nanded"],
    exampleMarkets: ["Akola APMC", "Yavatmal APMC", "Jalgaon APMC"],
    referencePriceMin: 58.0,
    referencePriceModal: 62.5,
    referencePriceMax: 67.0,
    typicalArrivalQty: 19500,
    buyerDemandLevel: "HIGH",
    storageSuitabilityDays: 300,
    image: "/images/crops/cotton.jpg",
  },
  {
    id: "crop-sugarcane",
    name: "Sugarcane",
    category: "Commercial Crops",
    marathiName: "ऊस",
    hindiName: "गन्ना",
    icon: "🎋",
    unit: "kg",
    typicalMarketUnit: "Ton",
    districts: ["Kolhapur", "Sangli", "Satara", "Pune"],
    exampleMarkets: ["Kolhapur APMC", "Sangli APMC"],
    referencePriceMin: 2.9,
    referencePriceModal: 3.2,
    referencePriceMax: 3.5,
    typicalArrivalQty: 85000,
    buyerDemandLevel: "HIGH",
    storageSuitabilityDays: 2,
    image: "/images/crops/sugarcane.jpg",
  },
];

export function getCropCatalogItem(cropName: string): CropCatalogItem | undefined {
  const normalized = (cropName || "").trim().toLowerCase();
  if (!normalized) return undefined;
  
  return MAHARASHTRA_CROP_CATALOG.find((c) => {
    const cName = c.name.toLowerCase();
    const mName = c.marathiName.toLowerCase();
    const hName = c.hindiName.toLowerCase();
    return (
      cName === normalized ||
      mName === normalized ||
      hName === normalized ||
      normalized.includes(cName) ||
      cName.includes(normalized)
    );
  });
}

export function getCropsByCategory(category: CropCatalogItem["category"]): CropCatalogItem[] {
  return MAHARASHTRA_CROP_CATALOG.filter((c) => c.category === category);
}

export function getCropImage(cropName: string): string {
  if (!cropName) return "/images/crops/onion.jpg";
  const s = cropName.toLowerCase().trim();

  // Normalized exact alias checks for all 18 crops
  if (s.includes("soy") || s.includes("सोयाबीन")) return "/images/crops/soybean.jpg";
  if (s.includes("cotton") || s.includes("कापूस") || s.includes("कपास")) return "/images/crops/cotton.jpg";
  if (s.includes("tur") || s.includes("pigeon") || s.includes("arhar") || s.includes("तूर") || s.includes("तुअर") || s.includes("अरहर")) return "/images/crops/tur.jpg";
  if (s.includes("potat") || s.includes("बटाटा") || s.includes("आलू") || s.includes("batata")) return "/images/crops/potato.jpg";
  if (s.includes("onion") || s.includes("कांदा") || s.includes("kanda") || s.includes("प्याज़")) return "/images/crops/onion.jpg";
  if (s.includes("tomat") || s.includes("टोमॅटो") || s.includes("टमाटर")) return "/images/crops/tomato.jpg";
  if (s.includes("wheat") || s.includes("गहू") || s.includes("gehun") || s.includes("गेहूँ")) return "/images/crops/wheat.jpg";
  if (s.includes("maize") || s.includes("corn") || s.includes("मका") || s.includes("मक्का")) return "/images/crops/maize.jpg";
  if (s.includes("chilli") || s.includes("chili") || s.includes("मिरची") || s.includes("मिर्च")) return "/images/crops/green-chilli.jpg";
  if (s.includes("brinjal") || s.includes("eggplant") || s.includes("वांगी") || s.includes("बैंगन") || s.includes("vangi")) return "/images/crops/brinjal.jpg";
  if (s.includes("bhendi") || s.includes("okra") || s.includes("भेंडी") || s.includes("भिंडी") || s.includes("ladyfinger")) return "/images/crops/okra.jpg";
  if (s.includes("chana") || s.includes("chickpea") || s.includes("gram") || s.includes("हरभरा") || s.includes("चना")) return "/images/crops/chickpea.jpg";
  if (s.includes("groundnut") || s.includes("peanut") || s.includes("भुईमूग") || s.includes("मूंगफली")) return "/images/crops/groundnut.jpg";
  if (s.includes("cabbage") || s.includes("कोबी") || s.includes("पत्ता गोभी")) return "/images/crops/cabbage.jpg";
  if (s.includes("cauliflower") || s.includes("फ्लॉवर") || s.includes("फूलगोभी")) return "/images/crops/cauliflower.jpg";
  if (s.includes("jowar") || s.includes("sorghum") || s.includes("ज्वारी") || s.includes("ज्वार")) return "/images/crops/jowar.jpg";
  if (s.includes("bajra") || s.includes("millet") || s.includes("बाजरी") || s.includes("बाजरा")) return "/images/crops/bajra.jpg";
  if (s.includes("sugar") || s.includes("cane") || s.includes("ऊस") || s.includes("गन्ना")) return "/images/crops/sugarcane.jpg";

  const item = getCropCatalogItem(cropName);
  return item ? item.image : "/images/crops/onion.jpg";
}

