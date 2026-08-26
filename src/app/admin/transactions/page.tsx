"use client";

import React, { useEffect, useState } from 'react';
import { AppShell, DemoBanner, LoadingSpinner, EmptyState } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { actionLogin, actionGetAdminDashboard, actionAdvanceTransaction } from '@/actions/agri-actions';
import type { Transaction } from '@/lib/types';
import { RefreshCw, Truck, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function AdminTransactions() {
  const [loading, setLoading] = useState(true);
  const [advancing, setAdvancing] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const loadData = async () => {
    await actionLogin('admin');
    const res = await actionGetAdminDashboard();
    if (res && res.transactions) {
      setTransactions(res.transactions);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdvance = async (txId: string) => {
    setAdvancing(txId);
    try {
      await actionAdvanceTransaction(txId);
      await loadData();
    } finally {
      setAdvancing(null);
    }
  };

  if (loading) {
    return (
      <AppShell role="admin" userName="Maharashtra Agri Admin">
        <LoadingSpinner />
      </AppShell>
    );
  }

  return (
    <AppShell role="admin" userName="Maharashtra Agri Admin">
      <DemoBanner />
      <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Platform Transactions Ledger</h1>
            <p className="text-sm text-gray-500 mt-1">
              Transparent state transaction audit trail, delivery lifecycle &amp; escrow payment status
            </p>
          </div>
          <Badge variant="verified" className="bg-emerald-100 text-emerald-900 border-emerald-300 font-bold text-xs px-3 py-1 w-fit">
            <ShieldCheck className="h-3.5 w-3.5 mr-1" /> Transparent Ledger
          </Badge>
        </div>

        <Card className="border border-emerald-100 shadow-sm">
          <CardHeader className="bg-emerald-50/40 pb-3">
            <CardTitle className="text-lg font-bold text-gray-900 flex items-center justify-between">
              <span>Active State Transactions ({transactions.length})</span>
              <span className="text-xs font-semibold text-emerald-800 bg-white px-3 py-1 rounded-full border">
                SIH Maharashtra Demo Connected
              </span>
            </CardTitle>
            <CardDescription className="text-xs">
              Same transaction TX-MH-001 is synchronized across Farmer, Buyer, and Command Center views.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {transactions.length === 0 ? (
              <div className="p-6">
                <EmptyState title="No transactions" description="There are no transactions recorded in the system yet." />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="text-xs text-gray-600 uppercase bg-gray-100/70 border-b">
                    <tr>
                      <th className="px-4 py-3">Tx ID</th>
                      <th className="px-4 py-3">Buyer &amp; Route</th>
                      <th className="px-4 py-3">Crop</th>
                      <th className="px-4 py-3">Quantity</th>
                      <th className="px-4 py-3">Total Payout</th>
                      <th className="px-4 py-3">Lifecycle Status</th>
                      <th className="px-4 py-3">Payment</th>
                      <th className="px-4 py-3 text-center">Demo Lifecycle Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {transactions.map((tx: Transaction) => (
                      <tr key={tx.id} className="hover:bg-emerald-50/30 transition-colors">
                        <td className="px-4 py-3.5 font-bold text-gray-900">{tx.id}</td>
                        <td className="px-4 py-3.5">
                          <div className="font-bold text-gray-900">{tx.buyerName}</div>
                          <div className="text-[11px] text-gray-500">
                            {tx.pickupLocation} → {tx.destination} ({tx.distanceKm} km)
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <Badge variant="default" className="font-bold">{tx.crop}</Badge>
                        </td>
                        <td className="px-4 py-3.5 text-gray-800 font-semibold">{formatNumber(tx.quantity)} kg</td>
                        <td className="px-4 py-3.5 font-extrabold text-emerald-800 text-sm">{formatCurrency(tx.totalAmount)}</td>
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
                        <td className="px-4 py-3.5 text-center">
                          <Button
                            size="sm"
                            onClick={() => handleAdvance(tx.id)}
                            disabled={advancing === tx.id || tx.status === 'PAID'}
                            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] h-8 px-3"
                          >
                            <RefreshCw className="h-3 w-3 mr-1" />
                            {advancing === tx.id ? 'Advancing...' : tx.status === 'PAID' ? 'PAID ✓' : 'Advance Lifecycle →'}
                          </Button>
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
