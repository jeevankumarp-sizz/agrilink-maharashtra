export type UserRole = "farmer" | "buyer" | "admin";

export type CropName = "Tomato" | "Onion" | "Potato";
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
