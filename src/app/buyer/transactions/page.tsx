"use client";

import React, { useEffect, useState } from 'react';
import { AppShell, DemoBanner, LoadingSpinner, EmptyState } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { actionLogin, actionGetFarmerDashboard } from '@/actions/agri-actions';
import type { Transaction } from '@/lib/types';
import { MapPin, ShoppingCart, Truck, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function BuyerTransactionsPage() {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    async function loadData() {
      await actionLogin('buyer');
      const res = await actionGetFarmerDashboard();
      if (res && res.transactions) {
        setTransactions(res.transactions);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <AppShell role="buyer" userName="FreshFoods Maharashtra — Demo Buyer">
        <LoadingSpinner />
      </AppShell>
    );
  }

  return (
    <AppShell role="buyer" userName="FreshFoods Maharashtra — Demo Buyer">
      <DemoBanner />
      <div className="p-4 md:p-6 space-y-6 max-w-6xl mx-auto pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Procurements &amp; Transactions</h1>
            <p className="text-sm text-gray-600 mt-1">
              Accepted crop purchases, delivery tracking &amp; payout clearing history
            </p>
          </div>
          <Badge variant="verified" className="bg-blue-100 text-blue-900 border-blue-300 font-bold text-xs px-3 py-1 w-fit">
            <ShoppingCart className="h-3.5 w-3.5 mr-1" /> Buyer Orders
          </Badge>
        </div>

        <Card className="border border-emerald-100 shadow-sm">
          <CardHeader className="bg-blue-50/40 pb-3">
            <CardTitle className="text-lg font-bold text-gray-900 flex items-center justify-between">
              <span>Accepted Procurement Orders ({transactions.length})</span>
              <span className="text-xs font-semibold text-blue-800 bg-white px-3 py-1 rounded-full border">
                SIH Maharashtra Demo Connected
              </span>
            </CardTitle>
            <CardDescription className="text-xs">
              Transaction details for FreshFoods Maharashtra procurement lots.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {transactions.length === 0 ? (
              <div className="p-6">
                <EmptyState title="No transactions" description="You have not accepted or completed any crop procurement orders yet." />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="text-xs text-gray-600 uppercase bg-gray-100/70 border-b">
                    <tr>
                      <th className="px-4 py-3">Tx ID</th>
                      <th className="px-4 py-3">Crop &amp; Quantity</th>
                      <th className="px-4 py-3">Purchase Rate</th>
                      <th className="px-4 py-3">Total Value</th>
                      <th className="px-4 py-3">Logistics Route</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Payment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {transactions.map((tx: Transaction) => (
                      <tr key={tx.id} className="hover:bg-blue-50/20 transition-colors">
                        <td className="px-4 py-3.5 font-bold text-gray-900">{tx.id}</td>
                        <td className="px-4 py-3.5 font-bold text-gray-900">
                          {tx.crop} • {formatNumber(tx.quantity)} kg
                        </td>
                        <td className="px-4 py-3.5 font-semibold text-emerald-800">
                          ₹{(tx.totalAmount / tx.quantity).toFixed(2)}/kg
                        </td>
                        <td className="px-4 py-3.5 font-extrabold text-emerald-800 text-sm">{formatCurrency(tx.totalAmount)}</td>
                        <td className="px-4 py-3.5 text-gray-600">
                          <div className="font-semibold text-gray-800">{tx.pickupLocation} → {tx.destination}</div>
                          <div className="text-[11px] text-gray-400">{tx.distanceKm} km · Transport: {formatCurrency(tx.transportCost)}</div>
                        </td>
                        <td className="px-4 py-3.5">
                          <Badge variant={tx.status === 'PAID' ? 'success' : tx.status === 'DELIVERED' ? 'info' : 'warning'} className="font-bold">
                            {tx.status.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="px-4 py-3.5">
                          <Badge variant={tx.paymentStatus === 'PAID' ? 'success' : 'warning'} className="font-bold">
                            {tx.paymentStatus}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
