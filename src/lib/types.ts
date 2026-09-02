export type UserRole = "farmer" | "buyer" | "admin";

export type CropCategory = "Vegetables" | "Field Crops" | "Pulses" | "Oilseeds" | "Commercial Crops";

export type CropName =
  | "Tomato"
  | "Onion"
  | "Potato"
  | "Brinjal"
  | "Bhendi (Okra)"
  | "Green Chilli"
  | "Cabbage"
  | "Cauliflower"
  | "Soybean"
  | "Cotton"
  | "Tur (Pigeon Pea)"
  | "Chana (Chickpea)"
  | "Groundnut"
  | "Wheat"
  | "Maize"
  | "Jowar (Sorghum)"
  | "Bajra (Pearl Millet)"
  | "Sugarcane";
export type QualityGrade = "Grade A" | "Grade B" | "Grade C";
export type DemandLevel = "LOW" | "MEDIUM" | "HIGH";
export type BuyerType =
  | "Processor"
  | "Institutional buyer"
  | "Retailer"
  | "Wholesaler"
  | "FPO"
  | "Exporter";

export type LotStatus =
  | "draft"
  | "open"
  | "offer_received"
  | "accepted"
  | "completed"
  | "cancelled";

export type OfferStatus = "pending" | "accepted" | "rejected" | "countered";

export type TransactionStatus =
  | "OFFER_ACCEPTED"
  | "LOGISTICS_SCHEDULED"
  | "PICKUP_CONFIRMED"
  | "DELIVERED"
  | "PAYMENT_PENDING"
  | "PAID";

export type PaymentStatus = "PENDING" | "PAID";

export type SellingOptionType = "buyer" | "market";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  location: string;
  lat: number;
  lng: number;
  phone?: string;
}

export interface Market {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  crop: CropName;
  minPrice: number;
  modalPrice: number;
  maxPrice: number;
  arrivalVolume: number;
  demandLevel: DemandLevel;
  distanceKm: number;
  date: string;
  priceTrend: number[];
}

export interface Buyer {
  id: string;
  name: string;
  buyerType: BuyerType;
  location: string;
  lat: number;
  lng: number;
  cropsRequired: CropName[];
  quantityRequired: number;
  priceMin: number;
  priceMax: number;
  qualityRequirements: QualityGrade[];
  distanceKm: number;
  verified: boolean;
  reliabilityScore: number;
  paymentReliability: number;
  preferredDeliveryWindow: string;
  demandLevel: DemandLevel;
}

export interface VisualParameters {
  colourUniformity: number; // e.g. 92%
  sizeUniformity: number;   // e.g. 84%
  visibleDefectsPct: number; // e.g. 6%
  surfaceDamagePct: number; // e.g. 4%
  ripenessPct: number;      // e.g. 88%
}

export interface QualityAssessment {
  id: string;
  lotId?: string;
  farmerId?: string;
  originalImage: string; // Base64 Data URL or HTTP Image URL
  product: CropName;
  qualityScore: number; // e.g. 87 / 100
  grade: QualityGrade; // e.g. "Grade A"
  confidence: number;   // e.g. 89%
  visualParameters: VisualParameters;
  visibleDefects: string[];
  explanation: string;
  assessmentTimestamp: string;
  assessmentStatus: "AVAILABLE" | "NOT_ASSESSED";
}

export interface LotInput {
  crop: CropName;
  quantity: number;
  unit: string;
  location: string;
  lat: number;
  lng: number;
  qualityGrade: QualityGrade;
  harvestDate: string;
  sellingDeadlineDays: number;
  storageAvailableDays: number;
  notes?: string;
  
  // Extended AI Quality Assessment fields
  qualityAssessmentId?: string | null;
  qualityScore?: number | null;
  qualityConfidence?: number | null;
  qualityImage?: string | null;
  qualityAssessmentStatus?: "AVAILABLE" | "NOT_ASSESSED";
  qualityParameters?: VisualParameters | null;
  visibleDefects?: string[] | null;
  qualityExplanation?: string | null;
}

export interface Lot extends LotInput {
  id: string;
  farmerId: string;
  farmerName: string;
  status: LotStatus;
  expectedPrice?: number;
  availableDate: string;
  createdAt: string;
}

export interface Offer {
  id: string;
  lotId: string;
  buyerId: string;
  buyerName: string;
  pricePerKg: number;
  quantity: number;
  pickupDate: string;
  paymentTerms: string;
  notes?: string;
  status: OfferStatus;
  buyerReliability: number;
  distanceKm: number;
  createdAt: string;
}

export interface Transaction {
  id: string;
  lotId: string;
  offerId: string;
  farmerId: string;
  buyerId: string;
  buyerName: string;
  crop: CropName;
  quantity: number;
  totalAmount: number;
  status: TransactionStatus;
  paymentStatus: PaymentStatus;
  pickupLocation: string;
  destination: string;
  distanceKm: number;
  transportCost: number;
  pickupDate: string;
  driverName?: string;
  driverPhone?: string;
  vehicleNumber?: string;
  vehicleType?: string;
  transportProvider?: string;
  pickupWindow?: string;
  isIllustrativeLogistics?: boolean;
  paymentDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScoringFactors {
  netRealization: number;
  buyerDemand: number;
  priceTrend: number;
  transportEfficiency: number;
  buyerReliability: number;
  storageTimeSuitability: number;
}

export interface SellingOption {
  id: string;
  type: SellingOptionType;
  name: string;
  location: string;
  distanceKm: number;
  pricePerKg: number;
  expectedGross: number;
  transportCost: number;
  storageCost: number;
  transactionCost: number;
  expectedNetRealization: number;
  demandLevel: DemandLevel;
  reliabilityScore: number;
  qualityMatch: boolean;
  totalScore: number;
  scoringFactors: ScoringFactors;
  reasons: string[];
  buyerType?: BuyerType;
  verified?: boolean;
  paymentReliability?: number;
}

export interface RecommendationResult {
  lotInput: LotInput;
  options: SellingOption[];
  topRecommendation: SellingOption;
  alternatives: SellingOption[];
  generatedAt: string;
}

export interface Grievance {
  id: string;
  transactionId?: string;
  lotId?: string;
  qualityAssessmentId?: string;
  raisedBy: string;
  farmerName: string;
  category: "Payment Delay" | "Quality Discrepancy" | "Logistics Delay" | "Price Dispute" | "Other";
  description: string;
  status: "OPEN" | "IN_REVIEW" | "RESOLVED";
  createdAt: string;
  resolvedAt?: string;
}

export interface DemoSession {
  userId: string;
  role: UserRole;
  demoMode: boolean;
}
