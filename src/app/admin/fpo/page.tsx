"use client";

import { useEffect } from "react";
import { AppShell, DemoBanner } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { actionLogin } from "@/actions/agri-actions";
import { CheckCircle2, Scale, Users, Building2 } from "lucide-react";

export default function AdminFpoPage() {
  useEffect(() => {
    actionLogin("admin");
  }, []);

  const fpoData = {
    name: "Sahyadri Farmers Producer Co",
    location: "Nashik District, Maharashtra",
    membersCount: 4,
    totalVolume: 6500,
    matchedBuyer: "Maharashtra State Food Corp",
    matchedVolume: 6000,
    contractRate: 30.50,
    negotiationPremium: 1.20,
    logisticsSavingsPct: 18,
  };

  const matchedValue = fpoData.matchedVolume * fpoData.contractRate; // ₹1,83,000
  const totalValue = fpoData.totalVolume * fpoData.contractRate; // ₹1,98,250

  return (
    <AppShell role="admin" userName="Maharashtra Agri Admin">
      <DemoBanner />

      <div className="mx-auto max-w-6xl space-y-6 pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">State FPO Insights &amp; Aggregation Performance</h1>
            <p className="text-sm text-gray-500 mt-1">
              Monitoring Farmer Producer Organisation (FPO) bulk lot pooling &amp; commercial contract matching
            </p>
          </div>
          <Badge variant="verified" className="bg-purple-100 text-purple-900 border-purple-300 font-bold text-xs px-3 py-1 w-fit">
            <Scale className="h-3.5 w-3.5 mr-1" /> State FPO Monitoring
          </Badge>
        </div>

        {/* FPO Overview Card */}
        <Card className="border border-purple-100 shadow-sm">
          <CardHeader className="bg-purple-50/40 pb-3">
            <div className="flex justify-between items-start">
              <div>
                <Badge variant="verified" className="bg-purple-700 text-white font-bold text-[10px] mb-1">
                  PILOT FPO INSIGHTS
                </Badge>
                <CardTitle className="text-xl font-bold text-gray-900">{fpoData.name}</CardTitle>
                <CardDescription className="text-xs text-gray-500">{fpoData.location}</CardDescription>
              </div>
              <Badge variant="success" className="font-bold text-xs">
                100% Demand Match
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-5 space-y-6 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-xl border text-center">
              <div>
                <span className="text-gray-500 text-[10px] block font-bold uppercase">Member Farmers</span>
                <span className="text-lg font-extrabold text-gray-900">{fpoData.membersCount} Farmers</span>
              </div>
              <div>
                <span className="text-gray-500 text-[10px] block font-bold uppercase">Pooled Volume</span>
                <span className="text-lg font-extrabold text-emerald-800">{formatNumber(fpoData.totalVolume)} kg</span>
              </div>
              <div>
                <span className="text-gray-500 text-[10px] block font-bold uppercase">Negotiation Premium</span>
                <span className="text-lg font-extrabold text-emerald-800">+₹{fpoData.negotiationPremium.toFixed(2)}/kg</span>
              </div>
              <div>
                <span className="text-gray-500 text-[10px] block font-bold uppercase">Logistics Savings</span>
                <span className="text-lg font-extrabold text-purple-800">−{fpoData.logisticsSavingsPct}% Cost</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border space-y-2">
                <p className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-purple-700" />
                  Matched Commercial Buyer Contract
                </p>
                <p className="text-gray-600 font-semibold">{fpoData.matchedBuyer}</p>
                <div className="grid grid-cols-2 gap-2 pt-2 text-xs border-t">
                  <div>
                    <span className="text-gray-500 block text-[10px]">Buyer Needed:</span>
                    <span className="font-bold text-gray-900">{formatNumber(fpoData.matchedVolume)} kg</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Matched Payout Value:</span>
                    <span className="font-extrabold text-emerald-800">{formatCurrency(matchedValue)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-xl border border-purple-200 space-y-2">
                <p className="font-bold text-purple-950 text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-purple-700" />
                  State Aggregation Audit
                </p>
                <p className="text-purple-900 text-xs leading-relaxed">
                  Sahyadri FPO pooled produce completely satisfies commercial buyer requirements in a single dispatch from Nashik, providing <strong>+12.6% price realization</strong> for smallholder members.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
