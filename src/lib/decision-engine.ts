import { DEMO_BUYERS, DEMO_MARKETS, ENGINE_CONSTANTS } from "./demo-data";
import type {
  Buyer,
  DemandLevel,
  LotInput,
  Market,
  RecommendationResult,
  ScoringFactors,
  SellingOption,
} from "./types";

const DEMAND_SCORE: Record<DemandLevel, number> = {
  HIGH: 95,
  MEDIUM: 65,
  LOW: 35,
};

function normalize(values: number[]): number[] {
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (max === min) return values.map(() => 100);
  return values.map((v) => ((v - min) / (max - min)) * 100);
}

function computeTransportCost(distanceKm: number, quantityKg: number): number {
  const factor = quantityKg / 100;
  return Math.round(distanceKm * ENGINE_CONSTANTS.transportCostPerKmPer100Kg * factor);
}

function computeStorageCost(storageDays: number, quantityKg: number): number {
  return Math.round(storageDays * ENGINE_CONSTANTS.storageCostPerKgPerDay * quantityKg);
}

function computeTransactionCost(gross: number): number {
  return Math.round(gross * ENGINE_CONSTANTS.transactionCostPercent);
}

function computePriceTrendScore(trend: number[]): number {
  if (trend.length < 2) return 50;
  const first = trend[0];
  const last = trend[trend.length - 1];
  const change = ((last - first) / first) * 100;
  if (change > 5) return 90;
  if (change > 2) return 75;
  if (change > 0) return 60;
  if (change > -2) return 45;
  return 25;
}

function computeStorageTimeScore(
  sellingDeadlineDays: number,
  storageAvailableDays: number,
  distanceKm: number
): number {
  const urgencyPenalty = sellingDeadlineDays <= 2 ? 0 : 10;
  const storageBonus = Math.min(storageAvailableDays * 15, 40);
  const distancePenalty = distanceKm > 100 ? 20 : distanceKm > 50 ? 10 : 0;
  return Math.max(0, Math.min(100, 60 + storageBonus - urgencyPenalty - distancePenalty));
}

function computeTransportEfficiency(distanceKm: number, quantityKg: number): number {
  const cost = computeTransportCost(distanceKm, quantityKg);
  const costPerKg = cost / quantityKg;
  if (costPerKg < 0.5) return 95;
  if (costPerKg < 1) return 80;
  if (costPerKg < 2) return 60;
  if (costPerKg < 3) return 40;
  return 20;
}

function buildReasons(
  option: Partial<SellingOption>,
  input: LotInput,
  factors: ScoringFactors
): string[] {
  const reasons: string[] = [];
  if (factors.buyerDemand >= 75) reasons.push("Strong current demand");
  if (factors.netRealization >= 70) reasons.push("Better net realization after costs");
  if (factors.transportEfficiency >= 70) reasons.push("Low transport cost");
  if (option.qualityMatch) reasons.push(`Accepts ${input.qualityGrade}`);
  if (option.paymentReliability && option.paymentReliability >= 90)
    reasons.push("Reliable payment history");
  if (option.verified) reasons.push("Verified buyer");
  if (factors.priceTrend >= 70) reasons.push("Positive price trend");
  if (factors.storageTimeSuitability >= 70) reasons.push("Fits your selling timeline");
  if (reasons.length === 0) reasons.push("Competitive option based on overall score");
  return reasons.slice(0, 5);
}

function optionFromBuyer(buyer: Buyer, input: LotInput): SellingOption {
  const pricePerKg = Math.min(buyer.priceMax, Math.max(buyer.priceMin, (buyer.priceMin + buyer.priceMax) / 2));
  const expectedGross = Math.round(pricePerKg * input.quantity);
  const transportCost = computeTransportCost(buyer.distanceKm, input.quantity);
  const storageDays = Math.max(0, input.sellingDeadlineDays - 1);
  const storageCost = computeStorageCost(Math.min(storageDays, input.storageAvailableDays), input.quantity);
  const transactionCost = computeTransactionCost(expectedGross);
  const expectedNetRealization = expectedGross - transportCost - storageCost - transactionCost;
  const qualityMatch = buyer.qualityRequirements.includes(input.qualityGrade);

  return {
    id: `buyer-${buyer.id}`,
    type: "buyer",
    name: buyer.name,
    location: buyer.location,
    distanceKm: buyer.distanceKm,
    pricePerKg: Math.round(pricePerKg * 100) / 100,
    expectedGross,
    transportCost,
    storageCost,
    transactionCost,
    expectedNetRealization,
    demandLevel: buyer.demandLevel,
    reliabilityScore: buyer.reliabilityScore,
    qualityMatch,
    totalScore: 0,
    scoringFactors: {
      netRealization: 0,
      buyerDemand: DEMAND_SCORE[buyer.demandLevel],
      priceTrend: 60,
      transportEfficiency: computeTransportEfficiency(buyer.distanceKm, input.quantity),
      buyerReliability: buyer.paymentReliability,
      storageTimeSuitability: computeStorageTimeScore(
        input.sellingDeadlineDays,
        input.storageAvailableDays,
        buyer.distanceKm
      ),
    },
    reasons: [],
    buyerType: buyer.buyerType,
    verified: buyer.verified,
    paymentReliability: buyer.paymentReliability,
  };
}

function optionFromMarket(market: Market, input: LotInput): SellingOption {
  const pricePerKg = market.modalPrice;
  const expectedGross = Math.round(pricePerKg * input.quantity);
  const transportCost = computeTransportCost(market.distanceKm, input.quantity);
  const storageDays = Math.max(0, input.sellingDeadlineDays - 1);
  const storageCost = computeStorageCost(Math.min(storageDays, input.storageAvailableDays), input.quantity);
  const transactionCost = computeTransactionCost(expectedGross);
  const expectedNetRealization = expectedGross - transportCost - storageCost - transactionCost;

  return {
    id: `market-${market.id}`,
    type: "market",
    name: market.name,
    location: market.location,
    distanceKm: market.distanceKm,
    pricePerKg,
    expectedGross,
    transportCost,
    storageCost,
    transactionCost,
    expectedNetRealization,
    demandLevel: market.demandLevel,
    reliabilityScore: 75,
    qualityMatch: true,
    totalScore: 0,
    scoringFactors: {
      netRealization: 0,
      buyerDemand: DEMAND_SCORE[market.demandLevel],
      priceTrend: computePriceTrendScore(market.priceTrend),
      transportEfficiency: computeTransportEfficiency(market.distanceKm, input.quantity),
      buyerReliability: 70,
      storageTimeSuitability: computeStorageTimeScore(
        input.sellingDeadlineDays,
        input.storageAvailableDays,
        market.distanceKm
      ),
    },
    reasons: [],
    verified: false,
  };
}

function scoreOptions(options: SellingOption[]): SellingOption[] {
  const netValues = options.map((o) => o.expectedNetRealization);
  const normalizedNet = normalize(netValues);

  return options
    .map((option, i) => {
      const factors: ScoringFactors = {
        ...option.scoringFactors,
        netRealization: normalizedNet[i],
      };
      const w = ENGINE_CONSTANTS.weights;
      const totalScore = Math.round(
        factors.netRealization * w.netRealization +
          factors.buyerDemand * w.buyerDemand +
          factors.priceTrend * w.priceTrend +
          factors.transportEfficiency * w.transportEfficiency +
          factors.buyerReliability * w.buyerReliability +
          factors.storageTimeSuitability * w.storageTimeSuitability
      );
      return {
        ...option,
        scoringFactors: factors,
        totalScore,
        reasons: buildReasons(option, { quantity: 0 } as LotInput, factors),
      };
    })
    .sort((a, b) => b.totalScore - a.totalScore);
}

export function generateRecommendations(input: LotInput): RecommendationResult {
  let matchingBuyers = DEMO_BUYERS.filter(
    (b) =>
      b.cropsRequired.includes(input.crop) &&
      b.qualityRequirements.includes(input.qualityGrade)
  );
  if (matchingBuyers.length === 0) {
    matchingBuyers = DEMO_BUYERS.filter((b) => b.cropsRequired.includes(input.crop));
  }
  if (matchingBuyers.length === 0) {
    matchingBuyers = DEMO_BUYERS.slice(0, 3);
  }

  let matchingMarkets = DEMO_MARKETS.filter((m) => m.crop === input.crop);
  if (matchingMarkets.length === 0) {
    matchingMarkets = DEMO_MARKETS.slice(0, 3);
  }

  const buyerOptions = matchingBuyers.map((b) => optionFromBuyer(b, input));
  const marketOptions = matchingMarkets.map((m) => optionFromMarket(m, input));
  const allOptions = scoreOptions([...buyerOptions, ...marketOptions]);

  const scoredWithReasons = allOptions.map((opt) => ({
    ...opt,
    reasons: buildReasons(opt, input, opt.scoringFactors),
  }));

  return {
    lotInput: input,
    options: scoredWithReasons,
    topRecommendation: scoredWithReasons[0],
    alternatives: scoredWithReasons.slice(1, 3),
    generatedAt: new Date().toISOString(),
  };
}

export function matchBuyers(input: LotInput) {
  return DEMO_BUYERS.filter(
    (b) =>
      b.cropsRequired.includes(input.crop) &&
      b.qualityRequirements.includes(input.qualityGrade)
  )
    .map((b) => optionFromBuyer(b, input))
    .sort((a, b) => b.expectedNetRealization - a.expectedNetRealization);
}

export function getMarketsForCrop(crop: string) {
  const found = DEMO_MARKETS.filter((m) => m.crop === crop);
  return found.length > 0 ? found : DEMO_MARKETS.slice(0, 5);
}

export function getBuyerById(id: string) {
  return DEMO_BUYERS.find((b) => b.id === id);
}

export function getMarketById(id: string) {
  return DEMO_MARKETS.find((m) => m.id === id);
}
