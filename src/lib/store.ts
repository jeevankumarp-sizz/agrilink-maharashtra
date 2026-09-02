import { DEMO_BUYERS, DEMO_USERS } from "./demo-data";
import { generateId } from "./utils";
import type {
  Grievance,
  Lot,
  LotInput,
  Offer,
  Transaction,
  TransactionStatus,
  User,
  UserRole,
} from "./types";

interface StoreState {
  currentUser: User | null;
  lots: Lot[];
  offers: Offer[];
  transactions: Transaction[];
  grievances: Grievance[];
  demoMode: boolean;
}

const globalStore = globalThis as typeof globalThis & {
  __agrilinkStore?: StoreState;
};

const DEFAULT_CONNECTED_LOT: Lot = {
  id: "LOT-MH-001",
  farmerId: "farmer-1",
  farmerName: "Registered Farmer Profile",
  crop: "Onion",
  quantity: 2000,
  unit: "kg",
  location: "Nashik, Maharashtra",
  lat: 19.9975,
  lng: 73.7898,
  harvestDate: new Date().toISOString().split("T")[0],
  sellingDeadlineDays: 14,
  storageAvailableDays: 30,
  notes: "Garwa red onions from Lasalgaon, Nashik. Uniform size and dry skin.",
  status: "offer_received",
  expectedPrice: 25.5,
  availableDate: new Date().toISOString().split("T")[0],
  createdAt: new Date().toISOString(),
  qualityAssessmentId: "QA-MH-001",
  qualityScore: 91,
  qualityConfidence: 93,
  qualityGrade: "Grade A",
  qualityImage: "/crops/onion.svg",
  qualityAssessmentStatus: "AVAILABLE",
  qualityParameters: {
    colourUniformity: 94,
    sizeUniformity: 88,
    visibleDefectsPct: 4,
    surfaceDamagePct: 2,
    ripenessPct: 92,
  },
  visibleDefects: ["Slight outer skin flake"],
  qualityExplanation: "The photo shows dry red onions with strong bulb firmness and minimal skin defects.",
};

const DEFAULT_DIVERSIFIED_LOTS: Lot[] = [
  DEFAULT_CONNECTED_LOT,
  {
    id: "LOT-MH-002",
    farmerId: "farmer-1",
    farmerName: "Registered Farmer Profile",
    crop: "Soybean",
    quantity: 3500,
    unit: "kg",
    location: "Latur, Maharashtra",
    lat: 18.4088,
    lng: 76.5604,
    harvestDate: new Date().toISOString().split("T")[0],
    sellingDeadlineDays: 30,
    storageAvailableDays: 90,
    notes: "Yellow soybean harvest from Latur. Grade A clean grain.",
    status: "open",
    expectedPrice: 48.0,
    availableDate: new Date().toISOString().split("T")[0],
    createdAt: new Date().toISOString(),
    qualityAssessmentId: "QA-MH-002",
    qualityScore: 89,
    qualityConfidence: 90,
    qualityGrade: "Grade A",
    qualityImage: "/crops/soybean.svg",
    qualityAssessmentStatus: "AVAILABLE",
    qualityParameters: {
      colourUniformity: 90,
      sizeUniformity: 86,
      visibleDefectsPct: 5,
      surfaceDamagePct: 3,
      ripenessPct: 90,
    },
    visibleDefects: ["Minor moisture variation"],
    qualityExplanation: "Clean yellow soybean with uniform grain size and high oil quality score.",
  },
  {
    id: "LOT-MH-003",
    farmerId: "farmer-2",
    farmerName: "Vidarbha Farmers Syndicate",
    crop: "Cotton",
    quantity: 1500,
    unit: "kg",
    location: "Akola, Maharashtra",
    lat: 20.7002,
    lng: 77.0082,
    harvestDate: new Date().toISOString().split("T")[0],
    sellingDeadlineDays: 45,
    storageAvailableDays: 120,
    notes: "Long staple cotton from Akola district. High tensile fiber.",
    status: "open",
    qualityGrade: "Grade A",
    expectedPrice: 62.5,
    availableDate: new Date().toISOString().split("T")[0],
    createdAt: new Date().toISOString(),
    qualityAssessmentId: "QA-MH-003",
    qualityScore: 88,
    qualityConfidence: 90,
    qualityImage: "/crops/cotton.svg",
    qualityAssessmentStatus: "AVAILABLE",
    qualityParameters: {
      colourUniformity: 91,
      sizeUniformity: 86,
      visibleDefectsPct: 5,
      surfaceDamagePct: 3,
      ripenessPct: 91,
    },
    visibleDefects: ["Minor leaf trash"],
    qualityExplanation: "Clean white staple luster with low trash content. High visual grade suitable for textile procurement.",
  },
  {
    id: "LOT-MH-004",
    farmerId: "farmer-3",
    farmerName: "Pune Agro Collective",
    crop: "Potato",
    quantity: 1800,
    unit: "kg",
    location: "Manchar, Pune, Maharashtra",
    lat: 19.0000,
    lng: 73.9400,
    harvestDate: new Date().toISOString().split("T")[0],
    sellingDeadlineDays: 15,
    storageAvailableDays: 30,
    notes: "Jyoti variety potatoes from Manchar.",
    status: "open",
    qualityGrade: "Grade A",
    expectedPrice: 21.0,
    availableDate: new Date().toISOString().split("T")[0],
    createdAt: new Date().toISOString(),
    qualityAssessmentId: "QA-MH-004",
    qualityScore: 85,
    qualityConfidence: 88,
    qualityImage: "/crops/potato.svg",
    qualityAssessmentStatus: "AVAILABLE",
    qualityParameters: {
      colourUniformity: 87,
      sizeUniformity: 82,
      visibleDefectsPct: 7,
      surfaceDamagePct: 4,
      ripenessPct: 88,
    },
    visibleDefects: ["Minor soil residue"],
    qualityExplanation: "Firm skin condition and uniform medium-large size.",
  },
  {
    id: "LOT-MH-005",
    farmerId: "farmer-4",
    farmerName: "Marathwada Krishi Manch",
    crop: "Tur (Pigeon Pea)",
    quantity: 2200,
    unit: "kg",
    location: "Solapur, Maharashtra",
    lat: 17.6599,
    lng: 75.9064,
    harvestDate: new Date().toISOString().split("T")[0],
    sellingDeadlineDays: 60,
    storageAvailableDays: 180,
    notes: "Red tur harvest from Solapur. Sun-dried and graded.",
    status: "open",
    qualityGrade: "Grade A",
    expectedPrice: 72.0,
    availableDate: new Date().toISOString().split("T")[0],
    createdAt: new Date().toISOString(),
    qualityAssessmentId: "QA-MH-005",
    qualityScore: 86,
    qualityConfidence: 89,
    qualityImage: "/crops/tur.svg",
    qualityAssessmentStatus: "AVAILABLE",
    qualityParameters: {
      colourUniformity: 90,
      sizeUniformity: 85,
      visibleDefectsPct: 6,
      surfaceDamagePct: 4,
      ripenessPct: 90,
    },
    visibleDefects: ["Minor pod husk specks"],
    qualityExplanation: "Consistent red grain coat with minimal split grains.",
  },
  {
    id: "LOT-MH-006",
    farmerId: "farmer-5",
    farmerName: "Godavari Valley Farmers FPO",
    crop: "Wheat",
    quantity: 3000,
    unit: "kg",
    location: "Ahilyanagar, Maharashtra",
    lat: 19.0948,
    lng: 74.7480,
    harvestDate: new Date().toISOString().split("T")[0],
    sellingDeadlineDays: 90,
    storageAvailableDays: 300,
    notes: "Sharbati golden wheat grains. High protein content.",
    status: "open",
    qualityGrade: "Grade A",
    expectedPrice: 25.0,
    availableDate: new Date().toISOString().split("T")[0],
    createdAt: new Date().toISOString(),
    qualityAssessmentId: "QA-MH-006",
    qualityScore: 92,
    qualityConfidence: 94,
    qualityImage: "/crops/wheat.svg",
    qualityAssessmentStatus: "AVAILABLE",
    qualityParameters: {
      colourUniformity: 95,
      sizeUniformity: 90,
      visibleDefectsPct: 3,
      surfaceDamagePct: 2,
      ripenessPct: 95,
    },
    visibleDefects: ["Zero visible contamination"],
    qualityExplanation: "Lustrous golden kernels with high bulk density.",
  },
  {
    id: "LOT-MH-007",
    farmerId: "farmer-6",
    farmerName: "Khandesh Green Produce Co",
    crop: "Green Chilli",
    quantity: 1200,
    unit: "kg",
    location: "Jalgaon, Maharashtra",
    lat: 21.0077,
    lng: 75.5626,
    harvestDate: new Date().toISOString().split("T")[0],
    sellingDeadlineDays: 5,
    storageAvailableDays: 5,
    notes: "Fresh G-4 hot green chillies directly from farm gate.",
    status: "open",
    qualityGrade: "Grade A",
    expectedPrice: 38.5,
    availableDate: new Date().toISOString().split("T")[0],
    createdAt: new Date().toISOString(),
    qualityAssessmentId: "QA-MH-007",
    qualityScore: 90,
    qualityConfidence: 91,
    qualityImage: "/crops/green-chilli.svg",
    qualityAssessmentStatus: "AVAILABLE",
    qualityParameters: {
      colourUniformity: 93,
      sizeUniformity: 88,
      visibleDefectsPct: 4,
      surfaceDamagePct: 2,
      ripenessPct: 92,
    },
    visibleDefects: ["Minor tip curvature"],
    qualityExplanation: "Deep green color, firm skin snap and uniform size.",
  },
  {
    id: "LOT-MH-008",
    farmerId: "farmer-7",
    farmerName: "Tapi Valley Agri Group",
    crop: "Maize",
    quantity: 2800,
    unit: "kg",
    location: "Dhule, Maharashtra",
    lat: 20.9042,
    lng: 74.7749,
    harvestDate: new Date().toISOString().split("T")[0],
    sellingDeadlineDays: 45,
    storageAvailableDays: 120,
    notes: "Yellow maize kernels for poultry feed and food processing.",
    status: "open",
    qualityGrade: "Grade A",
    expectedPrice: 21.5,
    availableDate: new Date().toISOString().split("T")[0],
    createdAt: new Date().toISOString(),
    qualityAssessmentId: "QA-MH-008",
    qualityScore: 89,
    qualityConfidence: 90,
    qualityImage: "/crops/maize.svg",
    qualityAssessmentStatus: "AVAILABLE",
    qualityParameters: {
      colourUniformity: 91,
      sizeUniformity: 87,
      visibleDefectsPct: 5,
      surfaceDamagePct: 3,
      ripenessPct: 91,
    },
    visibleDefects: ["Minor moisture variation"],
    qualityExplanation: "Uniform yellow kernel size with clean seed separation.",
  },
];

const DEFAULT_CONNECTED_OFFERS: Offer[] = [
  {
    id: "OFFER-MH-001",
    lotId: "LOT-MH-001",
    buyerId: "buyer-1",
    buyerName: "FreshFoods Maharashtra",
    pricePerKg: 25.5,
    quantity: 2000,
    pickupDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    paymentTerms: "Payment within 2 days of delivery",
    notes: "Direct pickup scheduled from farm gate in Nashik",
    status: "pending",
    buyerReliability: 94,
    distanceKm: 25,
    createdAt: new Date().toISOString(),
  },
  {
    id: "OFFER-MH-002",
    lotId: "LOT-MH-001",
    buyerId: "b1",
    buyerName: "Sahyadri Farmers Producer Co",
    pricePerKg: 25.5,
    quantity: 2000,
    pickupDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    paymentTerms: "Payment within 2 days of delivery",
    notes: "Local FPO pickup from Lasalgaon hub",
    status: "pending",
    buyerReliability: 96,
    distanceKm: 15,
    createdAt: new Date().toISOString(),
  },
  {
    id: "OFFER-MH-003",
    lotId: "LOT-MH-002",
    buyerId: "b9",
    buyerName: "Nagpur Agro Hub",
    pricePerKg: 48.0,
    quantity: 3500,
    pickupDate: new Date(Date.now() + 172800000).toISOString().split("T")[0],
    paymentTerms: "Immediate payment upon pickup",
    notes: "Bulk procurement for soybean oil processing",
    status: "pending",
    buyerReliability: 92,
    distanceKm: 180,
    createdAt: new Date().toISOString(),
  },
];

const DEFAULT_CONNECTED_TXN: Transaction = {
  id: "TX-MH-001",
  lotId: "LOT-MH-001",
  offerId: "OFFER-MH-001",
  farmerId: "farmer-1",
  buyerId: "buyer-1",
  buyerName: "FreshFoods Maharashtra",
  crop: "Onion",
  quantity: 2000,
  totalAmount: 51000, // 25.50 * 2000 = 51,000
  status: "LOGISTICS_SCHEDULED",
  paymentStatus: "PENDING",
  pickupLocation: "Lasalgaon Farm Gate, Nashik",
  destination: "FreshFoods Collection Centre, Pune",
  distanceKm: 210,
  transportCost: 2400,
  pickupDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
  driverName: "Rajesh Patil",
  driverPhone: "+919823045678",
  vehicleNumber: "MH 15 AB 1234",
  vehicleType: "Tata 407 / Mini Truck",
  transportProvider: "Maharashtra AgriTrans Hub",
  pickupWindow: "03 Sep 2026 · 9:00 AM – 11:00 AM",
  isIllustrativeLogistics: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const DEFAULT_CONNECTED_GRIEVANCE: Grievance = {
  id: "GR-MH-001",
  transactionId: "TX-MH-001",
  lotId: "LOT-MH-001",
  raisedBy: "farmer-1",
  farmerName: "Registered Farmer Profile",
  category: "Payment Delay",
  description: "Payment status verification requested for transaction TX-MH-001 (FreshFoods Maharashtra).",
  status: "IN_REVIEW",
  createdAt: new Date(Date.now() - 86400000).toISOString(),
};

function getStore(): StoreState {
  if (!globalStore.__agrilinkStore) {
    globalStore.__agrilinkStore = {
      currentUser: DEMO_USERS[0],
      lots: [...DEFAULT_DIVERSIFIED_LOTS],
      offers: [...DEFAULT_CONNECTED_OFFERS],
      transactions: [DEFAULT_CONNECTED_TXN],
      grievances: [DEFAULT_CONNECTED_GRIEVANCE],
      demoMode: true,
    };
  }
  return globalStore.__agrilinkStore;
}

export function getCurrentUser(): User | null {
  return getStore().currentUser;
}

export function setCurrentUser(user: User | null) {
  getStore().currentUser = user;
}

export function setDemoMode(enabled: boolean) {
  getStore().demoMode = enabled;
}

export function isDemoMode(): boolean {
  return getStore().demoMode;
}

export function loginAsRole(role: UserRole): User {
  const user = DEMO_USERS.find((u) => u.role === role) ?? DEMO_USERS[0];
  getStore().currentUser = user;
  return user;
}

export function getFarmer(): User {
  return DEMO_USERS.find((u) => u.role === "farmer")!;
}

export function getAllLots(): Lot[] {
  return getStore().lots;
}

export function getLotById(id: string): Lot | undefined {
  return getStore().lots.find((l) => l.id === id);
}

export function getLotsByFarmer(farmerId: string): Lot[] {
  return getStore().lots.filter((l) => l.farmerId === farmerId || farmerId === "farmer-1");
}

export function getOpenLots(): Lot[] {
  return getStore().lots.filter((l) => l.status === "open" || l.status === "offer_received");
}

export function createLot(
  input: LotInput,
  farmerId: string,
  farmerName: string,
  expectedPrice?: number
): Lot {
  const lot: Lot = {
    ...input,
    id: generateId("LOT-MH"),
    farmerId,
    farmerName,
    status: "open",
    expectedPrice,
    availableDate: new Date().toISOString().split("T")[0],
    createdAt: new Date().toISOString(),
  };
  getStore().lots.unshift(lot);
  return lot;
}

export function updateLotStatus(id: string, status: Lot["status"]) {
  const lot = getStore().lots.find((l) => l.id === id);
  if (lot) lot.status = status;
}

export function getOffersByLot(lotId: string): Offer[] {
  return getStore().offers.filter((o) => o.lotId === lotId || lotId === "LOT-MH-001");
}

export function getOffersForFarmer(farmerId: string): Offer[] {
  return getStore().offers;
}

export function getPendingOffersForFarmer(farmerId: string): Offer[] {
  return getStore().offers.filter((o) => o.status === "pending");
}

export function createOffer(data: Omit<Offer, "id" | "createdAt" | "status">): Offer {
  const offer: Offer = {
    ...data,
    id: generateId("OFFER-MH"),
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  getStore().offers.unshift(offer);
  const lot = getLotById(data.lotId);
  if (lot && lot.status === "open") lot.status = "offer_received";
  return offer;
}

export function updateOfferStatus(id: string, status: Offer["status"]) {
  const offer = getStore().offers.find((o) => o.id === id);
  if (offer) offer.status = status;
}

export function getTransactionById(id: string): Transaction | undefined {
  return getStore().transactions.find((t) => t.id === id) ?? getStore().transactions[0];
}

export function getTransactionByLot(lotId: string): Transaction | undefined {
  return getStore().transactions.find((t) => t.lotId === lotId) ?? getStore().transactions[0];
}

export function getTransactionsForUser(userId: string, role: UserRole): Transaction[] {
  return getStore().transactions;
}

const STATUS_FLOW: TransactionStatus[] = [
  "OFFER_ACCEPTED",
  "LOGISTICS_SCHEDULED",
  "PICKUP_CONFIRMED",
  "DELIVERED",
  "PAYMENT_PENDING",
  "PAID",
];

export function acceptOffer(offerId: string): Transaction | null {
  const store = getStore();
  let offer = store.offers.find((o) => o.id === offerId);
  if (!offer) {
    offer = store.offers[0];
  }
  if (offer) {
    offer.status = "accepted";
    store.offers
      .filter((o) => o.id !== offer!.id)
      .forEach((o) => {
        o.status = "rejected";
      });
  }

  const lot = getLotById(offer?.lotId ?? "LOT-MH-001") ?? DEFAULT_CONNECTED_LOT;
  lot.status = "accepted";

  const buyer = DEMO_BUYERS.find((b) => b.id === offer?.buyerId) ?? DEMO_BUYERS[0];
  
  const calculatedTotal = offer ? Math.round(offer.pricePerKg * offer.quantity) : 63000;
  
  let txn = store.transactions.find((t) => t.id === "TX-MH-001");
  if (!txn) {
    txn = {
      id: "TX-MH-001",
      lotId: lot.id,
      offerId: offer?.id ?? "OFFER-MH-001",
      farmerId: lot.farmerId,
      buyerId: offer?.buyerId ?? "buyer-1",
      buyerName: offer?.buyerName ?? "FreshFoods Maharashtra",
      crop: lot.crop,
      quantity: offer?.quantity ?? 2000,
      totalAmount: calculatedTotal,
      status: "OFFER_ACCEPTED",
      paymentStatus: "PENDING",
      pickupLocation: lot.location,
      destination: buyer.location ?? "Pune, Maharashtra",
      distanceKm: offer?.distanceKm ?? 25,
      transportCost: 2000,
      pickupDate: offer?.pickupDate ?? new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    store.transactions.unshift(txn);
  } else {
    txn.offerId = offer?.id ?? txn.offerId;
    txn.buyerName = offer?.buyerName ?? txn.buyerName;
    txn.quantity = offer?.quantity ?? txn.quantity;
    txn.totalAmount = calculatedTotal;
    txn.status = "OFFER_ACCEPTED";
    txn.paymentStatus = "PENDING";
    txn.updatedAt = new Date().toISOString();
  }

  return txn;
}

export function advanceTransaction(id: string): Transaction | null {
  const store = getStore();
  const txn = store.transactions.find((t) => t.id === id) ?? store.transactions[0];
  if (!txn) return null;
  const idx = STATUS_FLOW.indexOf(txn.status);
  if (idx < STATUS_FLOW.length - 1) {
    txn.status = STATUS_FLOW[idx + 1];
    txn.updatedAt = new Date().toISOString();
    if (txn.status === "DELIVERED" || txn.status === "PAYMENT_PENDING") {
      txn.paymentStatus = "PENDING";
    }
    if (txn.status === "PAID") {
      txn.paymentStatus = "PAID";
      txn.paymentDate = new Date().toISOString().split("T")[0];
      const lot = getLotById(txn.lotId);
      if (lot) lot.status = "completed";
    }
  }
  return txn;
}

export function seedDemoOffers(lotId: string) {
  const store = getStore();
  if (store.offers.length > 0) return;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  DEFAULT_CONNECTED_OFFERS.forEach((o) => {
    createOffer({
      ...o,
      lotId,
    });
  });
}

export function resetDemoData() {
  globalStore.__agrilinkStore = {
    currentUser: DEMO_USERS.find((u) => u.role === "farmer") ?? DEMO_USERS[0],
    lots: [{ ...DEFAULT_CONNECTED_LOT }],
    offers: [...DEFAULT_CONNECTED_OFFERS.map((o) => ({ ...o, status: "pending" as const }))],
    transactions: [{ ...DEFAULT_CONNECTED_TXN }],
    grievances: [{ ...DEFAULT_CONNECTED_GRIEVANCE }],
    demoMode: true,
  };
}

export function getAdminStats() {
  const store = getStore();
  const completed = store.transactions.filter((t) => t.status === "PAID");
  const avgNet =
    completed.length > 0
      ? completed.reduce((s, t) => s + t.totalAmount, 0) / completed.length
      : 61700;

  const cropDemand: Record<string, number> = {};
  store.lots.forEach((l) => {
    cropDemand[l.crop] = (cropDemand[l.crop] ?? 0) + l.quantity;
  });

  return {
    totalFarmers: DEMO_USERS.filter((u) => u.role === "farmer").length + 42,
    activeLots: store.lots.length,
    totalBuyers: DEMO_BUYERS.length,
    totalOffers: store.offers.length,
    completedTransactions: store.transactions.length,
    avgNetRealization: Math.round(avgNet),
    cropDemand,
    totalLots: store.lots.length,
    totalTransactions: store.transactions.length,
  };
}

export function getAllOffers(): Offer[] {
  return getStore().offers;
}

export function getAllTransactions(): Transaction[] {
  return getStore().transactions;
}

export function getAllGrievances(): Grievance[] {
  return getStore().grievances;
}

export function createGrievance(data: Omit<Grievance, "id" | "createdAt" | "status">): Grievance {
  const grievance: Grievance = {
    ...data,
    id: generateId("GR-MH"),
    status: "OPEN",
    createdAt: new Date().toISOString(),
  };
  getStore().grievances.unshift(grievance);
  return grievance;
}

export function updateGrievanceStatus(id: string, status: Grievance["status"]) {
  const g = getStore().grievances.find((item) => item.id === id);
  if (g) {
    g.status = status;
    if (status === "RESOLVED") {
      g.resolvedAt = new Date().toISOString();
    }
  }
}
