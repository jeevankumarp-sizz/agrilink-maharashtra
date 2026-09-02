"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell, DemoBanner } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { actionCreateLot } from "@/actions/agri-actions";
import { ArrowRight, CheckCircle2, Package, Scale, Sparkles, TrendingUp, Truck, Users } from "lucide-react";

export default function FPOPage() {
  const router = useRouter();
  const [created, setCreated] = useState(false);
  const [loading, setLoading] = useState(false);

  const members = [
    { name: "Farmer Member #01 (Dindori)", qty: 2000, percentage: 31 },
    { name: "Farmer Member #02 (Panchavati)", qty: 1500, percentage: 23 },
    { name: "Farmer Member #03 (Niphad)", qty: 1200, percentage: 18 },
    { name: "Farmer Member #04 (Sinnar)", qty: 1800, percentage: 28 },
  ];

  const totalQty = members.reduce((acc, m) => acc + m.qty, 0); // 6,500 kg
  const buyerReqQty = 6000;
  const matchedQty = 6000;
  const surplusQty = totalQty - matchedQty; // 500 kg
  const weightedPrice = 30.50;

  const totalAvailableValue = totalQty * weightedPrice; // ₹1,98,250
  const matchedPurchaseValue = matchedQty * weightedPrice; // ₹1,83,000

  const [selectedCrop, setSelectedCrop] = useState<"Soybean" | "Onion" | "Tur (Pigeon Pea)" | "Cotton" | "Tomato">("Soybean");

  const handleCreateFpoLot = async () => {
    setLoading(true);
    try {
      const res = await actionCreateLot(
        {
          crop: selectedCrop,
          quantity: totalQty,
          unit: "kg",
          location: "Nashik Region, Maharashtra",
          lat: 19.9975,
          lng: 73.7898,
          qualityGrade: "Grade A",
          harvestDate: new Date().toISOString().split("T")[0],
          sellingDeadlineDays: 3,
          storageAvailableDays: 2,
          notes: "Sahyadri Farmers Producer Co pooled lot from 4 smallholder farmers in Nashik district.",
        },
        weightedPrice
      );
      if (res.success) {
        setCreated(true);
        alert(`Aggregated FPO Lot ${res.lot.id} (${formatNumber(totalQty)} kg) created successfully! Sent to Buyer Portal.`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell role="farmer" userName="Sahyadri Farmers Producer Co">
      <DemoBanner />

      <div className="mx-auto max-w-5xl space-y-6 pb-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-emerald-100 shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="verified" className="bg-emerald-100 text-emerald-900 border-emerald-300 font-bold">
                PRODUCER ORGANISATION
              </Badge>
              <span className="text-xs text-gray-500">Nashik District FPO Hub</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Sahyadri Farmers Producer Co (FPO)</h1>
            <p className="text-sm text-gray-600 mt-1">
              Smallholder lot pooling for bulk negotiation and direct institutional buyer access
            </p>
          </div>
          <Button
            onClick={handleCreateFpoLot}
            disabled={loading || created}
            size="lg"
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
          >
            {loading ? "Creating Lot..." : created ? "✓ Aggregated Lot Created" : `Create Aggregated Lot (${formatNumber(totalQty)} kg)`}
          </Button>
        </div>

        {created && (
          <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-950 rounded-xl font-bold text-xs flex items-center justify-between">
            <span>✓ Aggregated FPO Lot (6,500 kg Grade A {selectedCrop}) created successfully! Market listing published.</span>
          </div>
        )}

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Member Contributions Card */}
          <Card className="md:col-span-2 border-emerald-200">
            <CardHeader className="bg-emerald-50/50 pb-3">
              <CardTitle className="text-base font-bold text-gray-900 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-emerald-700" />
                  Smallholder Member Contributions ({members.length} Farmers)
                </span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                  Total Available: {formatNumber(totalQty)} kg
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="space-y-3">
                {members.map((m) => (
                  <div key={m.name} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium text-gray-800">
                      <span>{m.name}</span>
                      <span className="font-bold">{formatNumber(m.qty)} kg ({m.percentage}%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-2 rounded-full bg-emerald-600 transition-all"
                        style={{ width: `${m.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Buyer Requirement Match */}
          <Card className="border-2 border-emerald-500 bg-emerald-50/30">
            <CardHeader className="pb-2">
              <Badge variant="success" className="w-fit mb-1 font-bold">100% DEMAND FULFILLMENT</Badge>
              <CardTitle className="text-base font-bold text-emerald-950">
                Institutional Buyer Match
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-emerald-200 space-y-1">
                <p className="font-bold text-gray-900">Maharashtra State Food Corp</p>
                <p className="text-gray-600">Contract Rate: ₹30.50/kg</p>
                <div className="grid grid-cols-2 gap-1 pt-1 text-[11px] border-t border-gray-100 mt-1">
                  <div>
                    <span className="text-gray-500 block">FPO Available:</span>
                    <span className="font-bold text-gray-900">{formatNumber(totalQty)} kg</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Buyer Needed:</span>
                    <span className="font-bold text-gray-900">{formatNumber(buyerReqQty)} kg</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Matched Contract:</span>
                    <span className="font-bold text-emerald-800">{formatNumber(matchedQty)} kg</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Unmatched Surplus:</span>
                    <span className="font-bold text-amber-800">{formatNumber(surplusQty)} kg</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1 text-emerald-900 bg-emerald-100/60 p-3 rounded-xl border border-emerald-200 text-[11px]">
                <p className="font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                  AI Aggregation Result:
                </p>
                <p className="leading-relaxed">
                  FPO lot ({formatNumber(totalQty)} kg) fulfills 100% of buyer requirement ({formatNumber(buyerReqQty)} kg), with {formatNumber(surplusQty)} kg remaining for local retail.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Financial Valuation Breakdown */}
        {/* Quality Distribution Breakdown */}
        <Card className="border border-emerald-100">
          <CardHeader className="bg-emerald-50/40 pb-3">
            <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-700" />
              FPO Pooled Lots AI Quality Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-center">
              <span className="text-gray-500 text-[10px] font-semibold block">AI Grade A Lots</span>
              <span className="text-lg font-extrabold text-emerald-800">4,800 kg (74%)</span>
            </div>
            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-center">
              <span className="text-gray-500 text-[10px] font-semibold block">AI Grade B Lots</span>
              <span className="text-lg font-extrabold text-emerald-800">1,700 kg (26%)</span>
            </div>
            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-center">
              <span className="text-gray-500 text-[10px] font-semibold block">Weighted Visual Score</span>
              <span className="text-lg font-extrabold text-emerald-800">85 / 100</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl border text-center">
              <span className="text-gray-500 text-[10px] font-semibold block">Unassessed Produce</span>
              <span className="text-lg font-extrabold text-gray-600">0 kg (0%)</span>
            </div>
          </CardContent>
        </Card>

        {/* Financial Valuation Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Scale className="h-5 w-5 text-emerald-700" />
              FPO Valuation &amp; Financial Payout Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-xl space-y-1 border">
              <p className="text-xs text-gray-500 font-medium">Negotiation Premium</p>
              <p className="text-lg font-extrabold text-emerald-700">+₹1.20/kg</p>
              <p className="text-[11px] text-gray-500">Over individual mandi price</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl space-y-1 border">
              <p className="text-xs text-gray-500 font-medium">Shared Transport Savings</p>
              <p className="text-lg font-extrabold text-emerald-700">−18% Logistics</p>
              <p className="text-[11px] text-gray-500">Bulk dispatch efficiency</p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 space-y-1">
              <p className="text-xs text-emerald-900 font-bold">Matched Contract Value</p>
              <p className="text-xl font-extrabold text-emerald-800">{formatCurrency(matchedPurchaseValue)}</p>
              <p className="text-[11px] text-emerald-700">6,000 kg × ₹30.50/kg</p>
            </div>
            <div className="bg-emerald-900 text-white p-4 rounded-xl shadow-sm space-y-1">
              <p className="text-xs text-emerald-200 font-bold">Total FPO Lot Value</p>
              <p className="text-xl font-extrabold text-amber-300">{formatCurrency(totalAvailableValue)}</p>
              <p className="text-[11px] text-emerald-200">6,500 kg total produce</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
