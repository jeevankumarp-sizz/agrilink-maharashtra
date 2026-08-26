"use client";

import { AppShell, DemoBanner } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { CheckCircle2, Layers, MapPin, Package, ShoppingCart } from "lucide-react";

export default function BuyerAggregatePage() {
  const availableLots = [
    { id: "LOT-MH-001", farmer: "Ramesh Kumar", qty: 2000, grade: "Grade A", location: "Nashik, Maharashtra", price: 31.5 },
    { id: "LOT-MH-002", farmer: "Suresh Patil", qty: 1500, grade: "Grade A", location: "Niphad, Maharashtra", price: 31.0 },
    { id: "LOT-MH-003", farmer: "Kumar Gaikwad", qty: 2500, grade: "Grade B", location: "Sinnar, Maharashtra", price: 29.5 },
  ];

  const totalQty = availableLots.reduce((acc, l) => acc + l.qty, 0);
  const totalCost = availableLots.reduce((acc, l) => acc + l.qty * l.price, 0);
  const avgPrice = totalCost / totalQty;

  return (
    <AppShell role="buyer" userName="FreshFoods Maharashtra — Demo Buyer">
      <DemoBanner />

      <div className="mx-auto max-w-5xl space-y-6 pb-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-blue-100 shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="verified" className="bg-blue-100 text-blue-900 border-blue-300 font-bold">
                BUYER AGGREGATION TOOL
              </Badge>
              <span className="text-xs text-gray-500">Demand Fulfillment Engine</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">AI Lot Aggregation</h1>
            <p className="text-sm text-gray-600 mt-1">
              Combine multiple smallholder lots to fulfill 100% of your commercial volume requirement
            </p>
          </div>
          <Button
            onClick={() => alert("Combined purchase order created for 6,000 kg Grade A/B Tomatoes from 3 Nashik farmers!")}
            size="lg"
            className="bg-blue-700 hover:bg-blue-800 text-white font-bold"
          >
            Create Combined Purchase Order
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Available Lots */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-700" />
              Available Open Lots in Nashik Zone
            </h2>
            <div className="space-y-3">
              {availableLots.map((lot) => (
                <Card key={lot.id} className="border border-gray-200">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-sm">{lot.farmer}</span>
                        <Badge variant="info">{lot.grade}</Badge>
                      </div>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin className="h-3.5 w-3.5 text-blue-600" /> {lot.location} · {formatNumber(lot.qty)} kg
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-700 text-base">₹{lot.price}/kg</p>
                      <p className="text-xs text-gray-500">{formatCurrency(lot.qty * lot.price)}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right: AI Aggregation Recommendation */}
          <Card className="border-2 border-blue-500 bg-blue-50/30">
            <CardHeader className="pb-2">
              <Badge variant="success" className="w-fit mb-1 font-bold">AI RECOMMENDATION</Badge>
              <CardTitle className="text-base font-bold text-blue-950">
                100% Demand Fulfillment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="bg-white p-3.5 rounded-xl border border-blue-200 space-y-2">
                <div className="flex justify-between items-center text-gray-700">
                  <span>Buyer Volume Needed:</span>
                  <span className="font-bold">6,000 kg</span>
                </div>
                <div className="flex justify-between items-center text-gray-700">
                  <span>Aggregated Lot Supply:</span>
                  <span className="font-bold text-emerald-700">6,000 kg (3 Lots)</span>
                </div>
                <div className="flex justify-between items-center text-gray-700 border-t pt-2">
                  <span>Weighted Avg Price:</span>
                  <span className="font-bold text-blue-800 text-sm">₹{avgPrice.toFixed(2)}/kg</span>
                </div>
                <div className="flex justify-between items-center text-gray-700">
                  <span>Total Purchase Cost:</span>
                  <span className="font-extrabold text-blue-900 text-sm">{formatCurrency(totalCost)}</span>
                </div>
              </div>

              <div className="bg-blue-100/70 p-3 rounded-xl text-blue-950 border border-blue-200 space-y-1.5">
                <p className="font-bold flex items-center gap-1 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-blue-700" />
                  Optimal Strategy:
                </p>
                <p className="leading-relaxed text-[11px]">
                  Combining Lots MH-001 + MH-002 + MH-003 fulfills 100% of demand in a single scheduled truck dispatch from Nashik to warehouse.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
