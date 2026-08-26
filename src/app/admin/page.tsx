"use client";

import React, { useEffect, useState } from 'react';
import { AppShell, DemoBanner, LoadingSpinner, EmptyState } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { actionLogin, actionGetAdminDashboard } from '@/actions/agri-actions';
import { DEMO_MARKETS, DEMO_BUYERS } from '@/lib/demo-data';
import { Users, Sprout, ShoppingCart, CheckCircle, FileText, IndianRupee } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      await actionLogin('admin');
      const res = await actionGetAdminDashboard();
      setData(res);
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

  const { stats, lots = [], offers = [], transactions = [] } = data || {};

  // Prepare market price trends data
  const trendsData = [0, 1, 2, 3, 4].map(dayIndex => {
    const dataPoint: any = { name: `Day ${dayIndex + 1}` };
    DEMO_MARKETS.slice(0, 3).forEach(market => {
      dataPoint[market.crop] = market.priceTrend[dayIndex];
    });
    return dataPoint;
  });

  // Prepare crop demand data
  const demandMap: Record<string, number> = {};
  DEMO_BUYERS.forEach(buyer => {
    buyer.cropsRequired.forEach(crop => {
      demandMap[crop] = (demandMap[crop] || 0) + buyer.quantityRequired;
    });
  });
  const demandData = Object.keys(demandMap).map(crop => ({
    name: crop,
    demand: demandMap[crop]
  }));

  return (
    <AppShell role="admin" userName="AgriLink Admin">
      <DemoBanner />
      <div className="p-4 md:p-8 space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-5 flex items-center space-x-3">
              <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Total Farmers</p>
                <h3 className="text-xl font-bold text-gray-900">{stats?.totalFarmers || 0}</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-center space-x-3">
              <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl">
                <Sprout className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Active Lots</p>
                <h3 className="text-xl font-bold text-gray-900">{stats?.activeLots || 0}</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-center space-x-3">
              <div className="p-2.5 bg-purple-100 text-purple-700 rounded-xl">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Total Buyers</p>
                <h3 className="text-xl font-bold text-gray-900">{stats?.totalBuyers || 0}</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-center space-x-3">
              <div className="p-2.5 bg-amber-100 text-amber-700 rounded-xl">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Total Offers</p>
                <h3 className="text-xl font-bold text-gray-900">{stats?.totalOffers || 0}</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-center space-x-3">
              <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Completed</p>
                <h3 className="text-xl font-bold text-gray-900">{stats?.completedTransactions || 0}</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-center space-x-3">
              <div className="p-2.5 bg-teal-100 text-teal-700 rounded-xl">
                <IndianRupee className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Avg Net Payout</p>
                <h3 className="text-xl font-bold text-gray-900">{formatCurrency(stats?.avgNetRealization || 0)}</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Market Price Trends</CardTitle>
              <CardDescription>Modal price trends over 5 days (₹/kg)</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendsData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Tomato" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="Onion" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="Potato" stroke="#eab308" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Aggregate Buyer Demand</CardTitle>
              <CardDescription>Total quantity required per crop (kg)</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={demandData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="demand" fill="#047857" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Lots</CardTitle>
            </CardHeader>
            <CardContent>
              {lots.length === 0 ? (
                <EmptyState title="No lots found" description="No active crop lots created yet" />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                      <tr>
                        <th className="px-4 py-3">Farmer</th>
                        <th className="px-4 py-3">Crop</th>
                        <th className="px-4 py-3">Quantity</th>
                        <th className="px-4 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {lots.slice(0, 5).map((lot: any) => (
                        <tr key={lot.id} className="hover:bg-gray-50/50">
                          <td className="px-4 py-3 font-medium text-gray-900">{lot.farmerName}</td>
                          <td className="px-4 py-3">{lot.crop}</td>
                          <td className="px-4 py-3">{formatNumber(lot.quantity)} kg</td>
                          <td className="px-4 py-3">
                            <Badge variant={lot.status === 'open' ? 'success' : 'default'}>{lot.status.replace('_', ' ')}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <EmptyState title="No transactions" description="No completed or active transactions yet" />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                      <tr>
                        <th className="px-4 py-3">Buyer</th>
                        <th className="px-4 py-3">Amount</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Payment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {transactions.slice(0, 5).map((tx: any) => (
                        <tr key={tx.id} className="hover:bg-gray-50/50">
                          <td className="px-4 py-3 font-medium text-gray-900">{tx.buyerName}</td>
                          <td className="px-4 py-3 font-semibold text-emerald-700">{formatCurrency(tx.totalAmount)}</td>
                          <td className="px-4 py-3">
                            <Badge variant={tx.status === 'PAID' ? 'success' : 'warning'}>{tx.status.replace('_', ' ')}</Badge>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant={tx.paymentStatus === 'PAID' ? 'success' : 'warning'}>{tx.paymentStatus}</Badge>
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
      </div>
    </AppShell>
  );
}
