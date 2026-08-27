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
import { Badge } from '@/components/ui/badge';
import { LotCard } from '@/components/agri/recommendation-card';
import { QualityVerificationModal } from '@/components/agri/quality-verification-modal';
import { actionGetBuyerDashboard } from '@/actions/agri-actions';
import type { Lot } from '@/lib/types';
import { Filter, Package } from 'lucide-react';

export default function AvailableLotsPage() {
  const [loading, setLoading] = useState(true);
  const [lots, setLots] = useState<Lot[]>([]);
  const [filterCrop, setFilterCrop] = useState<string>('All');
  const [selectedQualityLot, setSelectedQualityLot] = useState<Lot | null>(null);

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
      <AppShell role="buyer" userName="FreshFoods Maharashtra — Demo Buyer">
        <LoadingSpinner />
      </AppShell>
    );
  }

  return (
    <AppShell role="buyer" userName="FreshFoods Maharashtra — Demo Buyer">
      <DemoBanner />
      
      <div className="space-y-6 max-w-6xl mx-auto pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Available Agricultural Lots</h1>
            <p className="text-sm text-gray-600 mt-1">Browse farmer and FPO lots available for procurement across Maharashtra.</p>
          </div>
          <Badge variant="verified" className="bg-emerald-100 text-emerald-900 border-emerald-300 font-bold text-xs px-3 py-1 w-fit">
            <Package className="h-3.5 w-3.5 mr-1" /> Available Lots: {filteredLots.length}
          </Badge>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center bg-white p-4 rounded-xl shadow-xs border border-emerald-100">
          <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
            <Filter className="h-4 w-4 text-emerald-700" />
            <span>Filter by Crop:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {crops.map(crop => (
              <Button 
                key={crop}
                variant={filterCrop === crop ? 'default' : 'outline'}
                size="sm"
                className="font-bold text-xs"
                onClick={() => setFilterCrop(crop)}
              >
                {crop}
              </Button>
            ))}
          </div>
        </div>

        {filteredLots.length === 0 ? (
          <EmptyState 
            title="No open lots found" 
            description={`We couldn't find any available lots for ${filterCrop !== 'All' ? filterCrop : 'your criteria'}.`}
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredLots.map((lot) => (
              <div key={lot.id} className="relative group">
                <Link href={`/buyer/lots/${lot.id}`} className="block transition-transform hover:-translate-y-1">
                  <LotCard
                    lot={lot}
                    onViewQuality={(e) => {
                      e.preventDefault();
                      setSelectedQualityLot(lot);
                    }}
                  />
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Quality Verification Modal */}
        {selectedQualityLot && (
          <QualityVerificationModal
            lot={selectedQualityLot}
            isOpen={!!selectedQualityLot}
            onClose={() => setSelectedQualityLot(null)}
          />
        )}
      </div>
    </AppShell>
  );
}
