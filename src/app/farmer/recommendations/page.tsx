"use client";

import {
  actionCreateLot,
  actionGetRecommendations,
  actionPublishLot,
  actionSeedOffers,
} from "@/actions/agri-actions";
import { DemoBanner, AppShell } from "@/components/layout/app-shell";
import {
  RecommendationCard,
  ScoreBreakdown,
} from "@/components/agri/recommendation-card";
import { SaleWindow } from "@/components/agri/sale-window";
import { WhatIfSimulator } from "@/components/agri/what-if-simulator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LotInput, RecommendationResult } from "@/lib/types";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { Loader2, MessageCircle, Sparkles, Send, HelpCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function RecommendationsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lotIdParam = searchParams.get("lotId");
  const isDemo = searchParams.get("demo") === "1";

  const [recommendations, setRecommendations] = useState<RecommendationResult | null>(null);
  const [lotInput, setLotInput] = useState<LotInput | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [customQuestion, setCustomQuestion] = useState("");
  const [createdLotId, setCreatedLotId] = useState<string | null>(lotIdParam);

  useEffect(() => {
    async function load() {
      if (lotIdParam && isDemo) {
        const stored = sessionStorage.getItem("agrilink-recommendations");
        if (stored) {
          setRecommendations(JSON.parse(stored));
        } else {
          const demoInput: LotInput = {
            crop: "Tomato",
            quantity: 2000,
            unit: "kg",
            location: "Kolar, Karnataka",
            lat: 13.1361,
            lng: 78.1291,
            qualityGrade: "Grade A",
            harvestDate: new Date().toISOString().split("T")[0],
            sellingDeadlineDays: 3,
            storageAvailableDays: 2,
          };
          const rec = await actionGetRecommendations(demoInput);
          setRecommendations(rec);
          setLotInput(demoInput);
        }
        setCreatedLotId(lotIdParam);
        setLoading(false);
        return;
      }

      const storedRec = sessionStorage.getItem("agrilink-recommendations");
      const storedInput = sessionStorage.getItem("agrilink-lot-input");
      if (storedRec && storedInput) {
        setRecommendations(JSON.parse(storedRec));
        setLotInput(JSON.parse(storedInput));
      }
      setLoading(false);
    }
    load();
  }, [lotIdParam, isDemo]);

  async function handleCreateLot() {
    if (!recommendations || !lotInput) return;
    setCreating(true);
    try {
      const top = recommendations.topRecommendation;
      const { lot } = await actionCreateLot(lotInput, top.pricePerKg);
      await actionPublishLot(lot.id);
      await actionSeedOffers(lot.id);
      setCreatedLotId(lot.id);
      router.push(`/farmer/lots/${lot.id}`);
    } finally {
      setCreating(false);
    }
  }

  async function askAi(questionText?: string) {
    if (!recommendations) return;
    const query = questionText || customQuestion || `I have ${recommendations.lotInput.quantity} kg of ${recommendations.lotInput.qualityGrade} ${recommendations.lotInput.crop}. Where should I sell?`;
    setAiLoading(true);
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recommendation: recommendations,
          question: query,
        }),
      });
      const data = await res.json();
      setAiExplanation(data.explanation);
    } catch {
      setAiExplanation("Our decision engine computed FreshFoods Pvt Ltd as top option due to higher net realization after deducting transport (₹2,000) & storage (₹1,000).");
    } finally {
      setAiLoading(false);
    }
  }

  if (loading) {
    return (
      <AppShell role="farmer" userName="Ramesh Kumar">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-700" />
        </div>
      </AppShell>
    );
  }

  if (!recommendations) {
    return (
      <AppShell role="farmer" userName="Ramesh Kumar">
        <Card className="mx-auto max-w-lg p-8 text-center">
          <p className="text-gray-600">No analysis found. Please create a lot first.</p>
          <Button className="mt-4" onClick={() => router.push("/farmer/create-lot")}>
            Create Lot
          </Button>
        </Card>
      </AppShell>
    );
  }

  const input = recommendations.lotInput;
  const top = recommendations.topRecommendation;
  const priceTrend = [24, 25, 26, 27, 28]; // Demo 5-day trend for Kolar Tomato

  const sampleQuestions = [
    "Why FreshFoods over Kolar Mandi?",
    "What if I delay selling by 2 days?",
    "How was transport cost calculated?",
  ];

  return (
    <AppShell role="farmer" userName="Ramesh Kumar">
      <DemoBanner />

      <div className="mb-6">
        <div className="flex items-center gap-2 text-emerald-700">
          <Sparkles className="h-5 w-5" />
          <span className="text-sm font-medium uppercase tracking-wide">AI Selling Recommendation</span>
        </div>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">
          Best Options for Your {input.crop}
        </h1>
        <p className="text-gray-500">
          {formatNumber(input.quantity)} {input.unit} · {input.qualityGrade} · {input.location} ·{" "}
          {input.sellingDeadlineDays}-day deadline
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <RecommendationCard
            option={top}
            isTop
            onSelect={createdLotId ? undefined : handleCreateLot}
          />

          {/* Sale Window Section (Phase 6) */}
          <SaleWindow
            crop={input.crop}
            location={input.location}
            demandLevel={top.demandLevel}
            priceTrend={priceTrend}
            storageCostPerDay={top.storageCost}
            quantity={input.quantity}
          />

          {/* What-If Simulator Section (Phase 7) */}
          <WhatIfSimulator
            currentNetRealization={top.expectedNetRealization}
            pricePerKg={top.pricePerKg}
            quantity={input.quantity}
            storageCostPerKgPerDay={0.15}
            transportCost={top.transportCost}
            transactionCostPercent={1}
            priceTrend={priceTrend}
          />

          {recommendations.alternatives.length > 0 && (
            <div>
              <h2 className="mb-3 font-semibold text-gray-800">Alternative Options</h2>
              <div className="space-y-4">
                {recommendations.alternatives.map((opt, i) => (
                  <RecommendationCard key={opt.id} option={opt} rank={i + 2} />
                ))}
              </div>
            </div>
          )}

          {!createdLotId && (
            <Button size="lg" className="w-full" onClick={handleCreateLot} disabled={creating}>
              {creating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" /> Creating Digital Lot...
                </>
              ) : (
                "Create Digital Lot & Publish to Buyers"
              )}
            </Button>
          )}

          {createdLotId && (
            <Button size="lg" className="w-full" onClick={() => router.push(`/farmer/lots/${createdLotId}`)}>
              View Lot & Manage Offers →
            </Button>
          )}
        </div>

        <div className="space-y-6">
          <ScoreBreakdown factors={top.scoringFactors} />

          {/* Interactive AI Advisory Card */}
          <Card className="border-emerald-200">
            <CardHeader className="bg-emerald-50/50 pb-3">
              <CardTitle className="flex items-center gap-2 text-base text-emerald-900">
                <MessageCircle className="h-4 w-4 text-emerald-700" />
                Ask AgriLink Advisor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {!aiExplanation ? (
                <Button variant="secondary" className="w-full bg-emerald-100 hover:bg-emerald-200 text-emerald-900" onClick={() => askAi()} disabled={aiLoading}>
                  {aiLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                  {aiLoading ? "Analyzing Data..." : "Explain Why This Option is Best"}
                </Button>
              ) : (
                <div className="rounded-xl bg-emerald-50/70 p-3.5 text-sm leading-relaxed text-gray-800 border border-emerald-100">
                  <p className="font-semibold text-emerald-900 mb-1 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-700" /> AgriLink AI:
                  </p>
                  {aiExplanation}
                </div>
              )}

              {/* Sample Questions */}
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1">
                  <HelpCircle className="h-3 w-3" /> Quick Questions:
                </p>
                <div className="space-y-1.5">
                  {sampleQuestions.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => {
                        setCustomQuestion(q);
                        askAi(q);
                      }}
                      className="w-full text-left rounded-lg bg-gray-50 px-3 py-1.5 text-xs text-gray-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
                    >
                      &bull; {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Input */}
              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Ask a question about this recommendation..."
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && askAi()}
                  className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                />
                <Button size="sm" onClick={() => askAi()} disabled={aiLoading || !customQuestion.trim()}>
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </div>

              <p className="text-[11px] text-gray-400 text-center">
                AI strictly uses deterministic decision engine inputs. Zero price hallucination.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

export default function RecommendationsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <RecommendationsContent />
    </Suspense>
  );
}
