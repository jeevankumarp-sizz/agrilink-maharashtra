"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell, DemoBanner } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { actionCreateLot } from "@/actions/agri-actions";
import { ArrowRight, CheckCircle2, Package, Scale, TrendingUp, Truck, Users } from "lucide-react";

export default function FPOPage() {
  const router = useRouter();
  const [created, setCreated] = useState(false);
  const [loading, setLoading] = useState(false);

  const members = [
    { name: "Ramesh Kumar (Dindori)", qty: 2000, percentage: 31 },
    { name: "Suresh Patil (Panchavati)", qty: 1500, percentage: 23 },
    { name: "Lakshmi Deshmukh (Niphad)", qty: 1200, percentage: 18 },
    { name: "Kumar Gaikwad (Sinnar)", qty: 1800, percentage: 28 },
  ];

  const totalQty = members.reduce((acc, m) => acc + m.qty, 0);

  const handleCreateFpoLot = async () => {
    setLoading(true);
    try {
      const res = await actionCreateLot(
        {
          crop: "Tomato",
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
        30.5
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
    <AppShell role="farmer" userName="Ramesh Kumar">
      <DemoBanner />

      <div className="mx-auto max-w-5xl space-y-6 pb-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-emerald-100 shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="verified" className="bg-emerald-100 text-emerald-900 border-emerald-300 font-bold">
                PRODUCER ORGANISATION
              </Badge>
              <span className="text-xs text-gray-500">Nashik District Pilot</span>
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
            <span>✓ Aggregated FPO Lot (6,500 kg Grade A Tomato) created and visible in Buyer Portal!</span>
            <Button size="sm" variant="outline" onClick={() => router.push("/buyer")} className="bg-white font-bold text-xs">
              View in Buyer Portal →
            </Button>
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
                  Smallholder Member Contributions
                </span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                  Total: {formatNumber(totalQty)} kg
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
              <Badge variant="success" className="w-fit mb-1 font-bold">100% MATCH FOUND</Badge>
              <CardTitle className="text-base font-bold text-emerald-950">
                Institutional Buyer Match
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-emerald-200 space-y-1">
                <p className="font-bold text-gray-900">Maharashtra State Food Corp</p>
                <p className="text-gray-600">Requirement: 6,000 kg Grade A Tomato</p>
                <p className="text-emerald-700 font-bold text-sm">Quote: ₹30.50/kg</p>
              </div>

              <div className="space-y-1.5 text-emerald-900 bg-emerald-100/60 p-3 rounded-xl border border-emerald-200">
                <p className="font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                  AI Aggregation Insight:
                </p>
                <p className="leading-relaxed text-[11px]">
                  FPO total (6,500 kg) completely satisfies institutional buyer requirement of 6,000 kg.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Scale className="h-5 w-5 text-emerald-700" />
              FPO Aggregation Financial Benefits
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-xl space-y-1">
              <p className="text-xs text-gray-500">Negotiation Premium</p>
              <p className="text-lg font-bold text-emerald-700">+₹1.20/kg</p>
              <p className="text-[11px] text-gray-400">Over individual mandi price</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl space-y-1">
              <p className="text-xs text-gray-500">Shared Transport</p>
              <p className="text-lg font-bold text-emerald-700">−18% Cost</p>
              <p className="text-[11px] text-gray-400">Bulk logistics optimization</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl space-y-1">
              <p className="text-xs text-gray-500">Quality Assured</p>
              <p className="text-lg font-bold text-emerald-700">Grade A</p>
              <p className="text-[11px] text-gray-400">Bulk self-assessment</p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 space-y-1">
              <p className="text-xs text-emerald-800 font-medium">Combined Lot Value</p>
              <p className="text-xl font-extrabold text-emerald-800">{formatCurrency(totalQty * 30.5)}</p>
              <p className="text-[11px] text-emerald-700">Net payout for FPO</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
