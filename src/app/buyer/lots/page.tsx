'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  AppShell, 
  DemoBanner, 
  LoadingSpinner, 
  EmptyState 
} from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { LotCard } from '@/components/agri/recommendation-card';
import { actionGetBuyerDashboard } from '@/actions/agri-actions';
import type { Lot } from '@/lib/types';
import { Filter } from 'lucide-react';

export default function AvailableLotsPage() {
  const [loading, setLoading] = useState(true);
  const [lots, setLots] = useState<Lot[]>([]);
  const [filterCrop, setFilterCrop] = useState<string>('All');

  useEffect(() => {
    async function loadLots() {
      try {
        const dashboardData = await actionGetBuyerDashboard();
        setLots(dashboardData.lots.filter(l => l.status === 'open' || l.status === 'offer_received'));
      } catch (error) {
        console.error('Failed to load lots:', error);
      } finally {
        setLoading(false);
      }
    }

    loadLots();
  }, []);

  const crops = ['All', 'Tomato', 'Onion', 'Potato'];
  const filteredLots = filterCrop === 'All' ? lots : lots.filter(l => l.crop === filterCrop);

  if (loading) {
    return (
      <AppShell role="buyer" userName="FreshFoods Pvt Ltd">
        <LoadingSpinner />
      </AppShell>
    );
  }

  return (
    <AppShell role="buyer" userName="FreshFoods Pvt Ltd">
      <DemoBanner />
      
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-emerald-900">Available Lots</h1>
          <p className="text-emerald-700 mt-1">Browse and filter high-quality produce direct from verified farmers.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center bg-white p-4 rounded-xl shadow-sm border border-emerald-100">
          <div className="flex items-center gap-2 text-emerald-800 font-medium">
            <Filter className="h-4 w-4" />
            <span>Filter by Crop:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {crops.map(crop => (
              <Button 
                key={crop}
                variant={filterCrop === crop ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterCrop(crop)}
              >
                {crop}
              </Button>
            ))}
          </div>
        </div>

        {filteredLots.length === 0 ? (
          <EmptyState 
            title="No lots found" 
            description={`We couldn't find any available lots for ${filterCrop !== 'All' ? filterCrop : 'your criteria'}.`}
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredLots.map((lot) => (
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
