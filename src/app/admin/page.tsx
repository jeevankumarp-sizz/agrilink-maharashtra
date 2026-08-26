"use client";

import React, { useEffect, useState } from 'react';
import { AppShell, DemoBanner, LoadingSpinner, EmptyState } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { actionLogin, actionGetAdminDashboard } from '@/actions/agri-actions';
import { DEMO_MARKETS, DEMO_BUYERS } from '@/lib/demo-data';
import { MaharashtraMap } from '@/components/agri/maharashtra-map';
import { Users, Sprout, ShoppingCart, CheckCircle, FileText, IndianRupee, AlertTriangle, ShieldCheck, Layers } from 'lucide-react';
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

  // Prepare market price trends data (Maharashtra APMCs)
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
    <AppShell role="admin" userName="Maharashtra Agri Admin">
      <DemoBanner />
      <div className="p-4 md:p-6 space-y-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Maharashtra Agricultural Market Command Center</h1>
            <p className="text-sm text-gray-500 mt-1">
              State-level intelligence, market anomaly detection &amp; transaction monitoring system
            </p>
          </div>
          <Badge variant="verified" className="bg-amber-100 text-amber-900 border-amber-300 text-xs px-3 py-1 font-bold">
            SIH 2026 Prototype — Demonstration Dataset
          </Badge>
        </div>

        {/* Stats Grid */}
        <p className="text-[11px] text-amber-700 font-bold bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 w-fit">⚠ Demo / Prototype Metrics — derived from demonstration dataset</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center space-x-3">
              <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Farmers Active</p>
                <h3 className="text-xl font-bold text-gray-900">{stats?.totalFarmers || 0}</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center space-x-3">
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
            <CardContent className="p-4 flex items-center space-x-3">
              <div className="p-2.5 bg-purple-100 text-purple-700 rounded-xl">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Verified Buyers</p>
                <h3 className="text-xl font-bold text-gray-900">{stats?.totalBuyers || 0}</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center space-x-3">
              <div className="p-2.5 bg-amber-100 text-amber-700 rounded-xl">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Active Offers</p>
                <h3 className="text-xl font-bold text-gray-900">{stats?.totalOffers || 0}</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center space-x-3">
              <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Transactions</p>
                <h3 className="text-xl font-bold text-gray-900">{stats?.completedTransactions || 0}</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center space-x-3">
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

        {/* Market Anomaly Detection & Reference Price Layer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Anomaly Card */}
          <Card className="border-2 border-amber-300 bg-amber-50/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold text-amber-950 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-700" />
                AI-Assisted Market Anomaly Detection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="rounded-xl bg-white p-3.5 border border-amber-200 space-y-2">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-gray-900">Solapur APMC — Tomato Spike Alert</span>
                  <Badge variant="warning">Anomalous Dip (-14.2%)</Badge>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Modal price in Solapur dropped to ₹25/kg due to a sudden 28% arrival volume surge while local demand remains low.
                </p>
                <div className="bg-amber-100/60 p-2.5 rounded-lg text-amber-900 font-medium">
                  <strong>Suggested Command Action:</strong> Issue notification to Solapur FPOs to re-route Grade A lots to Pune APMC (Gultekdi) where buyer demand is HIGH (₹34/kg).
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reference Price / MSP Benchmark Layer */}
          <Card className="border-2 border-emerald-300 bg-emerald-50/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold text-emerald-950 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-700" />
                State Reference &amp; Benchmark Price Layer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="rounded-xl bg-white p-3.5 border border-emerald-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">Nashik APMC — Tomato Benchmark</span>
                  <Badge variant="success" className="font-bold">🟢 ABOVE REFERENCE (+31%)</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-gray-700 border-t border-gray-100 pt-2">
                  <div>
                    <span className="text-gray-500 block">Market Modal Price:</span>
                    <span className="font-bold text-emerald-800 text-sm">₹29.00/kg</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">State Reference Rate:</span>
                    <span className="font-bold text-gray-800 text-sm">₹22.00/kg</span>
                  </div>
                </div>
                <p className="text-gray-600 text-[11px] pt-1">
                  Data status: Demonstration benchmark dataset. Structured for authoritative MSP &amp; APMC reference data feed.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Maharashtra State Map Component */}
        <MaharashtraMap />

        {/* System Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Maharashtra APMC Price Trends</CardTitle>
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
              <CardTitle>Aggregate Buyer Demand by Commodity</CardTitle>
              <CardDescription>Total quantity required by verified Maharashtra buyers (kg)</CardDescription>
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

        {/* Ecosystem Positioning Section (Phase 30) */}
        <Card className="border border-emerald-200 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Layers className="h-5 w-5 text-emerald-700" />
              How AgriLink Fits Into Maharashtra&apos;s Ecosystem
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 text-xs text-gray-600 space-y-3">
            <p>
              AgriLink is designed as an <strong>intelligence and decision-support layer</strong> that integrates existing Maharashtra market ecosystems (APMC mandis, e-NAM, Sahyadri FPOs, MSAMB data) rather than replacing them.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-center font-semibold pt-2">
              <div className="bg-gray-50 p-2.5 rounded-xl border">Existing APMC / e-NAM</div>
              <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-emerald-900">AgriLink Data Layer</div>
              <div className="bg-emerald-700 text-white p-2.5 rounded-xl">AgriLink Decision Engine</div>
              <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-emerald-900">Verified Buyer Network</div>
              <div className="bg-gray-50 p-2.5 rounded-xl border">Higher Farmer Realization</div>
            </div>
          </CardContent>
        </Card>

        {/* Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Crop Lots</CardTitle>
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
