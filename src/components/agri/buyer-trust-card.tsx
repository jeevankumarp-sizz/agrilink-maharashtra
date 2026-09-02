"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Clock, ShieldCheck, Star } from "lucide-react";

interface BuyerTrustCardProps {
  buyerName?: string;
  reliabilityScore?: number;
  paymentReliability?: number;
}

export function BuyerTrustCard({
  buyerName = "FreshFoods Maharashtra",
  reliabilityScore = 94,
  paymentReliability = 97,
}: BuyerTrustCardProps) {
  return (
    <Card className="border-2 border-emerald-300 bg-emerald-50/40">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Badge variant="verified" className="bg-emerald-700 text-white font-bold px-3 py-1">
            <ShieldCheck className="mr-1 h-3.5 w-3.5 text-emerald-200" /> VERIFIED BUYER ✓
          </Badge>
          <span className="text-[10px] font-semibold text-gray-500 bg-white px-2 py-0.5 rounded border">
            Demo Verification Record
          </span>
        </div>
        <CardTitle className="text-base font-bold text-gray-900 mt-2">
          {buyerName}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 pt-1 text-xs">
        {/* Verification Checkmarks Grid */}
        <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 text-gray-700 font-medium border-b border-emerald-200 pb-3">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" /> Business Identity
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" /> Verified Contact
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" /> GST/FSSAI Credentials
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" /> Verified Bank Account
          </div>
          <div className="flex items-center gap-1.5 col-span-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" /> Verified Transaction &amp; Escrow History
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-white p-2 rounded-xl border border-emerald-100">
            <span className="text-gray-500 block text-[10px]">Trust Score</span>
            <span className="font-extrabold text-emerald-800 text-sm">{reliabilityScore}/100</span>
          </div>
          <div className="bg-white p-2 rounded-xl border border-emerald-100">
            <span className="text-gray-500 block text-[10px]">Payment Reliability</span>
            <span className="font-extrabold text-emerald-800 text-sm">{paymentReliability}%</span>
          </div>
          <div className="bg-white p-2 rounded-xl border border-emerald-100">
            <span className="text-gray-500 block text-[10px]">Transactions</span>
            <span className="font-extrabold text-gray-900 text-sm">128</span>
          </div>
          <div className="bg-white p-2 rounded-xl border border-emerald-100">
            <span className="text-gray-500 block text-[10px]">Avg Payout</span>
            <span className="font-extrabold text-emerald-800 text-sm">2.1 days</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
