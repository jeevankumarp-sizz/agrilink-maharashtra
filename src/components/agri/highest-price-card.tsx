"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatCurrencyPerKg } from "@/lib/utils";
import { AlertTriangle, ArrowRight, CheckCircle2, TrendingUp, Trophy } from "lucide-react";

interface HighestPriceCardProps {
  crop?: string;
  quantity?: number;
}

export function HighestPriceCard({ crop = "Tomato", quantity = 2000 }: HighestPriceCardProps) {
  // Market A: High nominal price, but distant & high storage cost -> lower net
  const marketA = {
    name: "Pune APMC (Gultekdi)",
    distanceKm: 210,
    pricePerKg: 34.0,
    gross: 34.0 * quantity,
    transport: 7000,
    storage: 1500,
    transaction: 680,
    net: 34.0 * quantity - 7000 - 1500 - 680, // 68000 - 9180 = 58,820
  };

  // Option B: Sahyadri FPO Nashik: Moderate price, minimal transport & storage -> HIGHER NET
  const optionB = {
    name: "Sahyadri Farmers Producer Co (Nashik)",
    distanceKm: 15,
    pricePerKg: 31.5,
    gross: 31.5 * quantity,
    transport: 1000,
    storage: 300,
    transaction: 630,
    net: 31.5 * quantity - 1000 - 300 - 630, // 63000 - 1930 = 61,070
  };

  const netDiff = optionB.net - marketA.net;

  return (
    <Card className="border-2 border-emerald-500 bg-gradient-to-br from-white via-emerald-50/30 to-amber-50/20 shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Badge variant="warning" className="bg-amber-100 text-amber-900 border-amber-300 font-bold">
            <TrendingUp className="mr-1 h-3.5 w-3.5 text-amber-700" />
            AGRILINK SIGNATURE INSIGHT
          </Badge>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
            +₹{formatCurrency(netDiff).replace("₹", "")} Extra Net Income
          </span>
        </div>
        <CardTitle className="text-lg font-bold text-gray-900 mt-2">
          Highest Price ≠ Highest Net Earnings
        </CardTitle>
        <p className="text-xs text-gray-600">
          Comparing nominal mandi market rate vs local verified buyer net realization for {quantity} kg {crop}:
        </p>
      </CardHeader>

      <CardContent className="space-y-4 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Market A - High Price, Lower Net */}
          <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-3.5 space-y-2 text-xs">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-gray-800">{marketA.name}</p>
                <p className="text-gray-500">{marketA.distanceKm} km away</p>
              </div>
              <span className="font-bold text-base text-gray-700">{formatCurrencyPerKg(marketA.pricePerKg)}</span>
            </div>
            <div className="space-y-1 text-gray-600 border-t border-gray-200 pt-2">
              <div className="flex justify-between">
                <span>Gross Revenue:</span>
                <span className="font-medium">{formatCurrency(marketA.gross)}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Transport Cost:</span>
                <span>−{formatCurrency(marketA.transport)}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Storage + Risk:</span>
                <span>−{formatCurrency(marketA.storage)}</span>
              </div>
            </div>
            <div className="border-t border-gray-300 pt-2 flex justify-between items-center text-sm">
              <span className="font-semibold text-gray-700">Net Realization:</span>
              <span className="font-bold text-gray-900">{formatCurrency(marketA.net)}</span>
            </div>
          </div>

          {/* Option B - Lower Price, HIGHER NET (Winner) */}
          <div className="rounded-xl border-2 border-emerald-500 bg-emerald-50/70 p-3.5 space-y-2 text-xs relative shadow-sm">
            <div className="absolute -top-2.5 right-3 bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Trophy className="h-3 w-3" /> BEST NET REALIZATION
            </div>
            <div className="flex justify-between items-start pt-1">
              <div>
                <p className="font-bold text-emerald-950">{optionB.name}</p>
                <p className="text-emerald-700 font-medium">{optionB.distanceKm} km away (Local)</p>
              </div>
              <span className="font-bold text-base text-emerald-800">{formatCurrencyPerKg(optionB.pricePerKg)}</span>
            </div>
            <div className="space-y-1 text-gray-700 border-t border-emerald-200 pt-2">
              <div className="flex justify-between">
                <span>Gross Revenue:</span>
                <span className="font-medium">{formatCurrency(optionB.gross)}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Transport Cost:</span>
                <span>−{formatCurrency(optionB.transport)}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Storage + Risk:</span>
                <span>−{formatCurrency(optionB.storage)}</span>
              </div>
            </div>
            <div className="border-t border-emerald-300 pt-2 flex justify-between items-center text-sm">
              <span className="font-bold text-emerald-900">Net Realization:</span>
              <span className="font-extrabold text-base text-emerald-800">{formatCurrency(optionB.net)}</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-emerald-100/70 p-3 border border-emerald-300 flex items-start gap-2.5 text-xs text-emerald-950">
          <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">AgriLink Decision Support:</p>
            <p>
              Selling to <strong>{optionB.name}</strong> yields <strong>{formatCurrency(netDiff)} MORE net profit</strong> for Ramesh despite a lower nominal quote, because transport and transit degradation costs are saved.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
