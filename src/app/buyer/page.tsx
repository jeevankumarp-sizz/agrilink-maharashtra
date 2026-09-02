'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  AppShell, 
  DemoBanner, 
  LoadingSpinner, 
  EmptyState 
} from '@/components/layout/app-shell';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LotCard } from '@/components/agri/recommendation-card';
import { actionLogin, actionGetBuyerDashboard, actionGetFarmerDashboard } from '@/actions/agri-actions';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { Package, TrendingUp, Search, MapPin, Truck, ShieldCheck, ArrowRight } from 'lucide-react';
import type { Lot, User, Transaction } from '@/lib/types';

export default function BuyerDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ user: User | null; lots: Lot[]; transactions?: Transaction[] } | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        await actionLogin('buyer');
        const dashboardData = await actionGetBuyerDashboard();
        const farmerData = await actionGetFarmerDashboard();
        setData({
          user: dashboardData.user,
          lots: dashboardData.lots,
          transactions: farmerData.transactions || [],
        });
      } catch (error) {
        console.error('Failed to load dashboard:', error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <AppShell role="buyer" userName="FreshFoods Maharashtra">
        <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-pulse">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-2">
              <div className="h-7 w-64 bg-gray-200 rounded"></div>
              <div className="h-4 w-96 bg-gray-200 rounded"></div>
            </div>
            <div className="h-6 w-32 bg-gray-200 rounded-full"></div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 bg-gray-200 rounded-xl border border-gray-100"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-100 rounded-xl border border-gray-200 flex flex-col items-center justify-center text-gray-500 font-medium space-y-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-700"></div>
            <p className="text-sm font-semibold">Loading procurement information...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!data) {
    return (
      <AppShell role="buyer" userName="FreshFoods Maharashtra">
        <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-xl border border-red-200 text-center shadow-xs space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 mx-auto">
            <Package className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Market Information Temporarily Unavailable</h3>
          <p className="text-xs text-gray-600">We couldn't connect to the procurement data service. Please try again.</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs"
          >
            Retry Loading
          </Button>
        </div>
      </AppShell>
    );
  }

  const { lots, transactions = [] } = data;
  const availableLots = lots.filter(l => l.status === 'open' || l.status === 'offer_received');

  // Dynamically extract unique regions from active lots
  const uniqueRegions = Array.from(
    new Set(
      availableLots
        .map((l) => l.location.split(',')[0].trim())
        .filter(Boolean)
    )
  );

  const activeRegionsText =
    uniqueRegions.length > 0
      ? uniqueRegions.join(' & ')
      : 'Nashik, Maharashtra';

  const cropStats = availableLots.reduce((acc, lot) => {
    acc[lot.crop] = (acc[lot.crop] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <AppShell role="buyer" userName="FreshFoods Maharashtra">
      <DemoBanner />
      
      <div className="space-y-6 max-w-6xl mx-auto pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Welcome, FreshFoods Maharashtra
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Procurement portal for Maharashtra agricultural commodity lots &amp; farmer offers
            </p>
          </div>
          <Badge variant="verified" className="bg-emerald-100 text-emerald-900 border-emerald-300 font-bold text-xs px-3 py-1 w-fit">
            <ShieldCheck className="h-3.5 w-3.5 mr-1" /> Registered Buyer Profile
          </Badge>
        </div>

        {/* Dynamic Summary Cards derived from shared lot store */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border border-emerald-100">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-bold text-gray-700">Available Lots</CardTitle>
              <Package className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-extrabold text-gray-900">{availableLots.length}</div>
              <p className="text-xs text-gray-500 mt-1 font-medium">Ready for procurement</p>
            </CardContent>
          </Card>
          
          <Card className="border border-emerald-100">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-bold text-gray-700">Market Demand</CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-extrabold text-emerald-800">
                {availableLots.length > 0 ? "High" : "Moderate"}
              </div>
              <p className="text-xs text-gray-500 mt-1 font-medium">
                {availableLots.length > 0 ? "Maharashtra & nearby APMCs" : "Statewide snapshot"}
              </p>
            </CardContent>
          </Card>

          <Card className="border border-emerald-100">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-bold text-gray-700">Active Regions</CardTitle>
              <MapPin className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-gray-900 truncate" title={activeRegionsText}>
                {activeRegionsText}
              </div>
              <p className="text-xs text-gray-500 mt-1 font-medium">Primary farm gates</p>
            </CardContent>
          </Card>

          <Card className="border border-emerald-100">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-bold text-gray-700">Crop Breakdown</CardTitle>
              <Search className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xs font-medium space-y-1">
                {Object.entries(cropStats).map(([crop, count]) => (
                  <div key={crop} className="flex justify-between items-center">
                    <span className="text-gray-600">{crop}</span>
                    <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border">{count}</span>
                  </div>
                ))}
                {Object.keys(cropStats).length === 0 && <span className="text-gray-400">No active lots</span>}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Purchases / Transactions Section */}
        {transactions.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
                <Truck className="h-5 w-5 text-emerald-700" />
                My Procurements &amp; Transactions ({transactions.length})
              </h2>
              <Link href="/buyer/transactions" className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1">
                View My Transaction Details <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <Card className="border border-emerald-200">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-emerald-50/70 text-gray-700 uppercase font-bold border-b border-emerald-100">
                      <tr>
                        <th className="px-4 py-3">Tx ID</th>
                        <th className="px-4 py-3">Crop &amp; Quantity</th>
                        <th className="px-4 py-3">Total Value</th>
                        <th className="px-4 py-3">Route</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Payment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-emerald-50/20">
                          <td className="px-4 py-3 font-bold text-gray-900">{tx.id}</td>
                          <td className="px-4 py-3 font-semibold text-emerald-950">
                            {tx.crop} • {formatNumber(tx.quantity)} kg
                          </td>
                          <td className="px-4 py-3 font-bold text-emerald-800">{formatCurrency(tx.totalAmount)}</td>
                          <td className="px-4 py-3 text-gray-600">
                            {tx.pickupLocation} → {tx.destination} ({tx.distanceKm} km)
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant={tx.status === 'PAID' ? 'success' : 'warning'} className="font-bold">
                              {tx.status.replace('_', ' ')}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant={tx.paymentStatus === 'PAID' ? 'success' : 'warning'} className="font-bold">
                              {tx.paymentStatus}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Available Lots Section */}
        <div className="flex items-center justify-between mt-8">
          <h2 className="text-xl font-bold tracking-tight text-gray-900">
            Available Agricultural Lots for Procurement
          </h2>
          <Link href="/buyer/lots">
            <Button variant="outline" className="font-bold text-xs">View All Lots ({availableLots.length})</Button>
          </Link>
        </div>

        {availableLots.length === 0 ? (
          <EmptyState 
            title="No lots available" 
            description="There are currently no open crop lots available for procurement."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {availableLots.map((lot) => (
              <Link href={`/buyer/lots/${lot.id}`} key={lot.id} className="block transition-transform hover:-translate-y-1">
                <LotCard lot={lot} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
