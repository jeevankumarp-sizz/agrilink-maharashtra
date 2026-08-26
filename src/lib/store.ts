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
  farmerName: "Ramesh Kumar",
  crop: "Tomato",
  quantity: 2000,
  unit: "kg",
  location: "Nashik, Maharashtra",
  lat: 19.9975,
  lng: 73.7898,
  qualityGrade: "Grade A",
  harvestDate: new Date().toISOString().split("T")[0],
  sellingDeadlineDays: 3,
  storageAvailableDays: 2,
  notes: "Fresh harvest from Dindori, Nashik. Grade A red tomatoes.",
  status: "offer_received",
  expectedPrice: 31.5,
  availableDate: new Date().toISOString().split("T")[0],
  createdAt: new Date().toISOString(),
};

const DEFAULT_CONNECTED_OFFERS: Offer[] = [
  {
    id: "OFFER-MH-001",
    lotId: "LOT-MH-001",
    buyerId: "buyer-1",
    buyerName: "FreshFoods Maharashtra — Demo Buyer",
    pricePerKg: 31.0,
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
    buyerName: "Sahyadri Farmers Producer Co — Demo FPO",
    pricePerKg: 31.5,
    quantity: 2000,
    pickupDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    paymentTerms: "Payment within 2 days of delivery",
    notes: "Local FPO pickup from Nashik hub",
    status: "pending",
    buyerReliability: 96,
    distanceKm: 15,
    createdAt: new Date().toISOString(),
  },
  {
    id: "OFFER-MH-003",
    lotId: "LOT-MH-001",
    buyerId: "b3",
    buyerName: "Maharashtra State Food Corp",
    pricePerKg: 30.0,
    quantity: 2000,
    pickupDate: new Date(Date.now() + 172800000).toISOString().split("T")[0],
    paymentTerms: "Payment within 5 days of delivery",
    notes: "Institutional bulk purchase for Mumbai region",
    status: "pending",
    buyerReliability: 94,
    distanceKm: 160,
    createdAt: new Date().toISOString(),
  },
];

const DEFAULT_CONNECTED_TXN: Transaction = {
  id: "TX-MH-001",
  lotId: "LOT-MH-001",
  offerId: "OFFER-MH-001",
  farmerId: "farmer-1",
  buyerId: "buyer-1",
  buyerName: "FreshFoods Maharashtra — Demo Buyer",
  crop: "Tomato",
  quantity: 2000,
  totalAmount: 62000,
  status: "LOGISTICS_SCHEDULED",
  paymentStatus: "PENDING",
  pickupLocation: "Nashik Farm, Dindori, Nashik",
  destination: "FreshFoods Warehouse, Pune, Maharashtra",
  distanceKm: 25,
  transportCost: 2000,
  pickupDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const DEFAULT_CONNECTED_GRIEVANCE: Grievance = {
  id: "GR-MH-001",
  transactionId: "TX-MH-001",
  lotId: "LOT-MH-001",
  raisedBy: "farmer-1",
  farmerName: "Ramesh Kumar",
  category: "Payment Delay",
  description: "Payment status verification requested for transaction TX-MH-001 (FreshFoods Maharashtra).",
  status: "IN_REVIEW",
  createdAt: new Date(Date.now() - 86400000).toISOString(),
};

function getStore(): StoreState {
  if (!globalStore.__agrilinkStore) {
    globalStore.__agrilinkStore = {
      currentUser: DEMO_USERS[0],
      lots: [DEFAULT_CONNECTED_LOT],
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
  
  let txn = store.transactions.find((t) => t.id === "TX-MH-001");
  if (!txn) {
    txn = {
      id: "TX-MH-001",
      lotId: lot.id,
      offerId: offer?.id ?? "OFFER-MH-001",
      farmerId: lot.farmerId,
      buyerId: offer?.buyerId ?? "buyer-1",
      buyerName: offer?.buyerName ?? "FreshFoods Maharashtra — Demo Buyer",
      crop: lot.crop,
      quantity: offer?.quantity ?? 2000,
      totalAmount: Math.round((offer?.pricePerKg ?? 31) * (offer?.quantity ?? 2000)),
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
