"use server";

import { generateRecommendations } from "@/lib/decision-engine";
import { DEMO_SCENARIO } from "@/lib/demo-data";
import {
  acceptOffer,
  advanceTransaction,
  createGrievance,
  createLot,
  createOffer,
  getAllGrievances,
  getAllLots,
  getAllOffers,
  getAllTransactions,
  getCurrentUser,
  getFarmer,
  getLotById,
  getOffersByLot,
  getPendingOffersForFarmer,
  getTransactionById,
  getTransactionsForUser,
  loginAsRole,
  resetDemoData,
  seedDemoOffers,
  setCurrentUser,
  setDemoMode,
  updateGrievanceStatus,
  updateOfferStatus,
} from "@/lib/store";
import type { Grievance, LotInput, UserRole } from "@/lib/types";

export async function actionLogin(role: UserRole) {
  const user = loginAsRole(role);
  return { success: true, user };
}

export async function actionLoadDemoScenario() {
  resetDemoData();
  setDemoMode(true);
  const farmer = getFarmer();
  setCurrentUser(farmer);

  const lotInput: LotInput = {
    crop: DEMO_SCENARIO.crop,
    quantity: DEMO_SCENARIO.quantity,
    unit: DEMO_SCENARIO.unit,
    location: DEMO_SCENARIO.location,
    lat: DEMO_SCENARIO.lat,
    lng: DEMO_SCENARIO.lng,
    qualityGrade: DEMO_SCENARIO.qualityGrade,
    harvestDate: DEMO_SCENARIO.harvestDate,
    sellingDeadlineDays: DEMO_SCENARIO.sellingDeadlineDays,
    storageAvailableDays: DEMO_SCENARIO.storageAvailableDays,
    notes: DEMO_SCENARIO.notes,
  };

  const recommendations = generateRecommendations(lotInput);
  const topPrice = recommendations.topRecommendation.pricePerKg;

  // Create lot
  const lot = createLot(lotInput, farmer.id, farmer.name, topPrice);
  
  // Seed direct offers
  seedDemoOffers(lot.id);

  return {
    success: true,
    lotId: lot.id,
    recommendation: recommendations,
    redirect: `/farmer/recommendations?lotId=${lot.id}&demo=1`,
  };
}

export async function actionAnalyzeLot(input: LotInput) {
  const recommendations = generateRecommendations(input);
  return { success: true, recommendations };
}

export async function actionCreateLot(input: LotInput, expectedPrice?: number) {
  const user = getCurrentUser() ?? getFarmer();
  const lot = createLot(input, user.id, user.name, expectedPrice);
  return { success: true, lot };
}

export async function actionPublishLot(lotId: string) {
  const lot = getLotById(lotId);
  if (!lot) return { success: false, error: "Lot not found" };
  lot.status = "open";
  return { success: true, lot };
}

export async function actionGetRecommendations(input: LotInput) {
  return generateRecommendations(input);
}

export async function actionSubmitOffer(data: {
  lotId: string;
  buyerId: string;
  buyerName: string;
  pricePerKg: number;
  quantity: number;
  pickupDate: string;
  paymentTerms: string;
  notes?: string;
  buyerReliability: number;
  distanceKm: number;
}) {
  const offer = createOffer(data);
  return { success: true, offer };
}

export async function actionAcceptOffer(offerId: string) {
  const txn = acceptOffer(offerId);
  if (!txn) return { success: false, error: "Could not accept offer" };
  return { success: true, transaction: txn };
}

export async function actionRejectOffer(offerId: string) {
  updateOfferStatus(offerId, "rejected");
  return { success: true };
}

export async function actionAdvanceTransaction(txnId: string) {
  const txn = advanceTransaction(txnId);
  return { success: !!txn, transaction: txn };
}

export async function actionGetFarmerDashboard() {
  const user = getCurrentUser() ?? getFarmer();
  const lots = getAllLots().filter((l) => l.farmerId === user.id);
  const lotIds = lots.map((l) => l.id);
  const allOffers = getAllOffers().filter((o) => lotIds.includes(o.lotId));
  const pendingOffers = allOffers.filter((o) => o.status === "pending");
  const transactions = getTransactionsForUser(user.id, "farmer");
  return { user, lots, pendingOffers, allOffers, transactions };
}

export async function actionGetBuyerDashboard() {
  const lots = getAllLots().filter((l) => l.status === "open" || l.status === "offer_received");
  const user = getCurrentUser();
  return { user, lots };
}

export async function actionGetAdminDashboard() {
  const { getAdminStats } = await import("@/lib/store");
  return {
    stats: getAdminStats(),
    lots: getAllLots(),
    offers: getAllOffers(),
    transactions: getAllTransactions(),
  };
}

export async function actionGetLotDetails(lotId: string) {
  const lot = getLotById(lotId);
  const offers = getOffersByLot(lotId);
  const transaction = getTransactionsForUser("", "admin").find((t) => t.lotId === lotId);
  return { lot, offers, transaction };
}

export async function actionGetTransaction(txnId: string) {
  return getTransactionById(txnId);
}

export async function actionSeedOffers(lotId: string) {
  seedDemoOffers(lotId);
  return { success: true, offers: getOffersByLot(lotId) };
}

export async function actionCreateGrievance(data: {
  transactionId?: string;
  lotId?: string;
  qualityAssessmentId?: string;
  raisedBy: string;
  farmerName: string;
  category: Grievance["category"];
  description: string;
}) {
  const grievance = createGrievance(data);
  return { success: true, grievance };
}

export async function actionGetGrievances() {
  return getAllGrievances();
}

export async function actionResolveGrievance(id: string) {
  updateGrievanceStatus(id, "RESOLVED");
  return { success: true };
}
