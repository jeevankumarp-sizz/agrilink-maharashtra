"use client";

import React, { useEffect, useState } from 'react';
import { AppShell, DemoBanner, LoadingSpinner, EmptyState } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { actionLogin, actionGetAdminDashboard } from '@/actions/agri-actions';
import type { Transaction } from '@/lib/types';

export default function AdminTransactions() {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    async function loadData() {
      await actionLogin('admin');
      const res = await actionGetAdminDashboard();
      if (res && res.transactions) {
        setTransactions(res.transactions);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <AppShell role="admin" userName="AgriLink Admin">
        <LoadingSpinner />
      </AppShell>
    );
  }

  return (
    <AppShell role="admin" userName="AgriLink Admin">
      <DemoBanner />
      <div className="p-4 md:p-8 space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">All Transactions</h1>

        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <EmptyState title="No transactions" description="There are no transactions recorded in the system yet." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                    <tr>
                      <th className="px-4 py-3">Tx ID</th>
                      <th className="px-4 py-3">Buyer</th>
                      <th className="px-4 py-3">Crop</th>
                      <th className="px-4 py-3">Quantity</th>
                      <th className="px-4 py-3">Total Payout</th>
                      <th className="px-4 py-3">Logistics Status</th>
                      <th className="px-4 py-3">Payment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {transactions.map((tx: Transaction) => (
                      <tr key={tx.id} className="hover:bg-gray-50/50">
                        <td className="px-4 py-3 font-medium text-gray-900">{tx.id.slice(-8)}</td>
                        <td className="px-4 py-3 font-medium text-gray-900">{tx.buyerName}</td>
                        <td className="px-4 py-3">
                          <Badge variant="default">{tx.crop}</Badge>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{formatNumber(tx.quantity)} kg</td>
                        <td className="px-4 py-3 font-bold text-emerald-800">{formatCurrency(tx.totalAmount)}</td>
                        <td className="px-4 py-3">
                          <Badge variant={tx.status === 'PAID' ? 'success' : 'warning'}>
                            {tx.status.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={tx.paymentStatus === 'PAID' ? 'success' : 'warning'}>
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
