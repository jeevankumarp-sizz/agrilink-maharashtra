"use client";

import { useEffect, useState } from "react";
import { AppShell, DemoBanner, LoadingSpinner, EmptyState } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { actionLogin, actionGetFarmerDashboard } from "@/actions/agri-actions";
import type { Transaction } from "@/lib/types";
import { MapPin, ShieldCheck, ShoppingCart, Truck } from "lucide-react";
import Link from "next/link";

export default function BuyerProcurementPage() {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    async function loadData() {
      await actionLogin("buyer");
      const farmerData = await actionGetFarmerDashboard();
      setTransactions(farmerData.transactions || []);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <AppShell role="buyer" userName="FreshFoods Maharashtra">
        <LoadingSpinner />
      </AppShell>
    );
  }

  return (
    <AppShell role="buyer" userName="FreshFoods Maharashtra">
      <DemoBanner />

      <div className="mx-auto max-w-6xl space-y-6 pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Procurements &amp; Orders</h1>
            <p className="text-sm text-gray-600 mt-1">
              Accepted crop purchases, delivery status &amp; payout clearing history
            </p>
          </div>
          <Badge variant="verified" className="bg-emerald-100 text-emerald-900 border-emerald-300 font-bold text-xs px-3 py-1 w-fit">
            <ShoppingCart className="h-3.5 w-3.5 mr-1" /> Buyer Orders
          </Badge>
        </div>

        {transactions.length === 0 ? (
          <EmptyState
            title="No accepted procurements"
            description="You don't have any active accepted offers or completed order procurements."
          />
        ) : (
          <div className="space-y-4">
            {transactions.map((tx) => (
              <Card key={tx.id} className="border border-emerald-200 shadow-sm">
                <CardHeader className="bg-emerald-50/50 pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        {tx.crop} Procurement
                        <Badge variant="default" className="text-xs font-bold">{tx.id}</Badge>
                      </CardTitle>
                      <CardDescription className="text-xs text-gray-600 mt-0.5">
                        Farmer: {tx.farmerId === "farmer-1" ? "Registered Farmer Profile (Nashik)" : tx.farmerId}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <Badge variant={tx.status === "PAID" ? "success" : "warning"} className="font-bold">
                        {tx.status.replace("_", " ")}
                      </Badge>
                      <p className="text-sm font-extrabold text-emerald-800 mt-1">{formatCurrency(tx.totalAmount)}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-3 text-xs space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-3 rounded-xl border">
                    <div>
                      <span className="text-gray-500 block text-[10px]">Quantity</span>
                      <span className="font-bold text-gray-900">{formatNumber(tx.quantity)} kg</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[10px]">Purchase Rate</span>
                      <span className="font-bold text-emerald-800">₹{(tx.totalAmount / tx.quantity).toFixed(2)}/kg</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[10px]">Logistics Cost</span>
                      <span className="font-bold text-gray-900">{formatCurrency(tx.transportCost)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[10px]">Payment Status</span>
                      <span className="font-bold text-emerald-800">{tx.paymentStatus}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-gray-600 border-t pt-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-emerald-700" />
                      {tx.pickupLocation} → {tx.destination} ({tx.distanceKm} km)
                    </span>
                    <Link href="/buyer/transactions" className="font-bold text-emerald-700 hover:underline">
                      View My Transaction Details →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
