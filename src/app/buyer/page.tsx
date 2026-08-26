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
import { LotCard } from '@/components/agri/recommendation-card';
import { actionLogin, actionGetBuyerDashboard } from '@/actions/agri-actions';
import { Package, TrendingUp, Search, MapPin } from 'lucide-react';
import type { Lot, User } from '@/lib/types';

export default function BuyerDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ user: User | null; lots: Lot[] } | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        await actionLogin('buyer');
        const dashboardData = await actionGetBuyerDashboard();
        setData(dashboardData);
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
      <AppShell role="buyer" userName="FreshFoods Pvt Ltd">
        <LoadingSpinner />
      </AppShell>
    );
  }

  if (!data) {
    return (
      <AppShell role="buyer" userName="FreshFoods Pvt Ltd">
        <EmptyState 
          title="Error loading dashboard" 
          description="We couldn't load your dashboard data. Please try again later."
        />
      </AppShell>
    );
  }

  const { lots } = data;
  const availableLots = lots.filter(l => l.status === 'open' || l.status === 'offer_received');

  const cropStats = availableLots.reduce((acc, lot) => {
    acc[lot.crop] = (acc[lot.crop] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <AppShell role="buyer" userName="FreshFoods Pvt Ltd">
      <DemoBanner />
      
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-emerald-900">Welcome back, FreshFoods Pvt Ltd</h1>
          <p className="text-emerald-700 mt-1">Here is the latest overview of available agricultural lots.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Available Lots</CardTitle>
              <Package className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{availableLots.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Ready for offers</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Market Demand</CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">High</div>
              <p className="text-xs text-muted-foreground mt-1">Karnataka & nearby regions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Active Regions</CardTitle>
              <MapPin className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Kolar & Hoskote</div>
              <p className="text-xs text-muted-foreground mt-1">Primary farm gates</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Crop Breakdown</CardTitle>
              <Search className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">
                {Object.entries(cropStats).map(([crop, count]) => (
                  <div key={crop} className="flex justify-between items-center mt-1">
                    <span>{crop}</span>
                    <span className="font-bold">{count}</span>
                  </div>
                ))}
                {Object.keys(cropStats).length === 0 && <span className="text-muted-foreground">No active lots</span>}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-between mt-8">
          <h2 className="text-xl font-semibold tracking-tight">Available Lots for Procurement</h2>
          <Link href="/buyer/lots">
            <Button variant="outline">View All Lots</Button>
          </Link>
        </div>

        {availableLots.length === 0 ? (
          <EmptyState 
            title="No lots available" 
            description="There are currently no open crop lots available for procurement."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {availableLots.slice(0, 6).map((lot) => (
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
