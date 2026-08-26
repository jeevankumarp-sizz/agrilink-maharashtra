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

function getStore(): StoreState {
  if (!globalStore.__agrilinkStore) {
    globalStore.__agrilinkStore = {
      currentUser: null,
      lots: [],
      offers: [],
      transactions: [],
      grievances: [
        {
          id: "grv-1",
          transactionId: "txn-demo-01",
          raisedBy: "farmer-1",
          farmerName: "Ramesh Kumar",
          category: "Payment Delay",
          description: "Payment confirmation pending for 24 hours after delivery confirmation.",
          status: "IN_REVIEW",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        }
      ],
      demoMode: false,
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
  return getStore().lots.filter((l) => l.farmerId === farmerId);
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
    id: generateId("lot"),
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
  return getStore().offers.filter((o) => o.lotId === lotId);
}

export function getOffersForFarmer(farmerId: string): Offer[] {
  const lotIds = getLotsByFarmer(farmerId).map((l) => l.id);
  return getStore().offers.filter((o) => lotIds.includes(o.lotId));
}

export function getPendingOffersForFarmer(farmerId: string): Offer[] {
  return getOffersForFarmer(farmerId).filter((o) => o.status === "pending");
}

export function createOffer(data: Omit<Offer, "id" | "createdAt" | "status">): Offer {
  const offer: Offer = {
    ...data,
    id: generateId("offer"),
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  getStore().offers.push(offer);
  const lot = getLotById(data.lotId);
  if (lot && lot.status === "open") lot.status = "offer_received";
  return offer;
}

export function updateOfferStatus(id: string, status: Offer["status"]) {
  const offer = getStore().offers.find((o) => o.id === id);
  if (offer) offer.status = status;
}

export function getTransactionById(id: string): Transaction | undefined {
  return getStore().transactions.find((t) => t.id === id);
}

export function getTransactionByLot(lotId: string): Transaction | undefined {
  return getStore().transactions.find((t) => t.lotId === lotId);
}

export function getTransactionsForUser(userId: string, role: UserRole): Transaction[] {
  if (role === "farmer") return getStore().transactions.filter((t) => t.farmerId === userId);
  if (role === "buyer") return getStore().transactions.filter((t) => t.buyerId === userId);
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
  const offer = getStore().offers.find((o) => o.id === offerId);
  if (!offer || offer.status !== "pending") return null;

  offer.status = "accepted";
  getStore().offers
    .filter((o) => o.lotId === offer.lotId && o.id !== offerId)
    .forEach((o) => {
      o.status = "rejected";
    });

  const lot = getLotById(offer.lotId);
  if (!lot) return null;
  lot.status = "accepted";

  const buyer = DEMO_BUYERS.find((b) => b.id === offer.buyerId);
  const transaction: Transaction = {
    id: generateId("txn"),
    lotId: lot.id,
    offerId: offer.id,
    farmerId: lot.farmerId,
    buyerId: offer.buyerId,
    buyerName: offer.buyerName,
    crop: lot.crop,
    quantity: offer.quantity,
    totalAmount: Math.round(offer.pricePerKg * offer.quantity),
    status: "OFFER_ACCEPTED",
    paymentStatus: "PENDING",
    pickupLocation: lot.location,
    destination: buyer?.location ?? offer.buyerName,
    distanceKm: offer.distanceKm,
    transportCost: Math.round(offer.distanceKm * 2 * (offer.quantity / 100)),
    pickupDate: offer.pickupDate,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  getStore().transactions.push(transaction);
  return transaction;
}

export function advanceTransaction(id: string): Transaction | null {
  const txn = getStore().transactions.find((t) => t.id === id);
  if (!txn) return null;
  const idx = STATUS_FLOW.indexOf(txn.status);
  if (idx < STATUS_FLOW.length - 1) {
    txn.status = STATUS_FLOW[idx + 1];
    txn.updatedAt = new Date().toISOString();
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
  const lot = getLotById(lotId);
  if (!lot) return;

  const buyers = [
    { id: "b1", name: "FreshFoods Pvt Ltd", price: 31, qty: 2000, dist: 25, rel: 94 },
    { id: "b2", name: "ABC Agro Traders", price: 30.5, qty: 2000, dist: 42, rel: 89 },
    { id: "b6", name: "Sri Lakshmi FPO", price: 29.5, qty: 2000, dist: 12, rel: 90 },
  ];

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  buyers.forEach((b) => {
    createOffer({
      lotId,
      buyerId: b.id,
      buyerName: b.name,
      pricePerKg: b.price,
      quantity: b.qty,
      pickupDate: tomorrow.toISOString().split("T")[0],
      paymentTerms: "Payment within 3 days of delivery",
      notes: "Ready to pickup from farm gate",
      buyerReliability: b.rel,
      distanceKm: b.dist,
    });
  });
}

export function resetDemoData() {
  globalStore.__agrilinkStore = {
    currentUser: DEMO_USERS.find((u) => u.role === "farmer") ?? null,
    lots: [],
    offers: [],
    transactions: [],
    grievances: [
      {
        id: "grv-1",
        transactionId: "txn-demo-01",
        raisedBy: "farmer-1",
        farmerName: "Ramesh Kumar",
        category: "Payment Delay",
        description: "Payment confirmation pending for 24 hours after delivery confirmation.",
        status: "IN_REVIEW",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      }
    ],
    demoMode: true,
  };
}

export function getAdminStats() {
  const store = getStore();
  const completed = store.transactions.filter((t) => t.status === "PAID");
  const avgNet =
    completed.length > 0
      ? completed.reduce((s, t) => s + t.totalAmount, 0) / completed.length
      : 59000;

  const cropDemand: Record<string, number> = {};
  store.lots.forEach((l) => {
    cropDemand[l.crop] = (cropDemand[l.crop] ?? 0) + l.quantity;
  });

  return {
    totalFarmers: DEMO_USERS.filter((u) => u.role === "farmer").length,
    activeLots: store.lots.filter((l) => l.status === "open" || l.status === "offer_received").length,
    totalBuyers: DEMO_BUYERS.length,
    totalOffers: store.offers.length,
    completedTransactions: completed.length,
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
    id: generateId("grv"),
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
