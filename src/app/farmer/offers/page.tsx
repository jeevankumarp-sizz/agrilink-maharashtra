'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { actionGetFarmerDashboard, actionLogin, actionAcceptOffer, actionRejectOffer } from '@/actions/agri-actions';
import { AppShell, DemoBanner, LoadingSpinner, EmptyState } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn, formatCurrencyPerKg, formatNumber } from '@/lib/utils';
import { MapPin, ShieldCheck, Check, X } from 'lucide-react';
import type { Lot, Offer, User } from '@/lib/types';
import Link from 'next/link';

export default function OffersManagementPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    user: User | null;
    lots: Lot[];
    allOffers: Offer[];
  }>({
    user: null,
    lots: [],
    allOffers: [],
  });

  const fetchData = async () => {
    setLoading(true);
    await actionLogin('farmer');
    const res = await actionGetFarmerDashboard();
    setData({
      user: res.user,
      lots: res.lots,
      allOffers: res.allOffers || [],
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAccept = async (offerId: string) => {
    await actionAcceptOffer(offerId);
    await fetchData();
    router.refresh();
  };

  const handleReject = async (offerId: string) => {
    await actionRejectOffer(offerId);
    await fetchData();
    router.refresh();
  };

  if (loading) {
    return (
      <AppShell role="farmer" userName="Loading...">
        <LoadingSpinner />
      </AppShell>
    );
  }

  const pendingOffers = data.allOffers.filter(o => o.status === 'pending');
  const pastOffers = data.allOffers.filter(o => o.status !== 'pending');

  return (
    <AppShell role="farmer" userName={data.user?.name || "Farmer"}>
      <DemoBanner />
      
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Offers Management</h1>
          <p className="mt-1 text-gray-500">Review and respond to buyer offers for your lots</p>
        </div>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Pending Offers ({pendingOffers.length})</h2>
          {pendingOffers.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {pendingOffers.map(offer => {
                const lot = data.lots.find(l => l.id === offer.lotId);
                return (
                  <Card key={offer.id}>
                    <CardHeader className="border-b border-gray-100 pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base">{offer.buyerName}</CardTitle>
                          <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                            <MapPin className="h-3 w-3" />
                            {offer.distanceKm} km away
                            <span className="ml-2 flex items-center gap-1 font-medium text-emerald-600">
                              <ShieldCheck className="h-3 w-3" />
                              {offer.buyerReliability}% Reliability
                            </span>
                          </div>
                        </div>
                        <Badge variant="warning">Pending</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="mb-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Lot Info</span>
                          <Link href={`/farmer/lots/${offer.lotId}`} className="font-medium text-emerald-700 hover:underline">
                            {lot?.crop} • {formatNumber(lot?.quantity || 0)} {lot?.unit}
                          </Link>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Offer Price</span>
                          <span className="font-semibold text-gray-900">{formatCurrencyPerKg(offer.pricePerKg)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Quantity</span>
                          <span className="font-medium text-gray-900">{formatNumber(offer.quantity)} kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Pickup Date</span>
                          <span className="font-medium text-gray-900">{offer.pickupDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Payment Terms</span>
                          <span className="font-medium text-gray-900">{offer.paymentTerms}</span>
                        </div>
                        {offer.notes && (
                          <div className="mt-2 rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
                            {offer.notes}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-3 pt-2">
                        <Button 
                          className="flex-1"
                          onClick={() => handleAccept(offer.id)}
                        >
                          <Check className="h-4 w-4" />
                          Accept Offer
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1 border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                          onClick={() => handleReject(offer.id)}
                        >
                          <X className="h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <EmptyState 
              title="No pending offers" 
              description="You don't have any pending offers at the moment."
            />
          )}
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Past Offers ({pastOffers.length})</h2>
          {pastOffers.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pastOffers.map(offer => {
                const lot = data.lots.find(l => l.id === offer.lotId);
                const isAccepted = offer.status === 'accepted';
                
                return (
                  <Card key={offer.id} className={cn(isAccepted ? 'border-emerald-200 bg-emerald-50/30' : 'opacity-75')}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base text-gray-800">{offer.buyerName}</CardTitle>
                          <Link href={`/farmer/lots/${offer.lotId}`} className="text-xs text-emerald-600 hover:underline">
                            {lot?.crop} • {formatNumber(lot?.quantity || 0)} {lot?.unit}
                          </Link>
                        </div>
                        <Badge variant={isAccepted ? 'success' : 'danger'} className="capitalize">
                          {offer.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Offered Price</span>
                        <span className="font-semibold text-gray-900">{formatCurrencyPerKg(offer.pricePerKg)}</span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-sm">
                        <span className="text-gray-500">Quantity</span>
                        <span className="font-medium text-gray-900">{formatNumber(offer.quantity)} kg</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
             <EmptyState 
              title="No past offers" 
              description="You don't have any accepted or rejected offers yet."
            />
          )}
        </section>
      </div>
    </AppShell>
  );
}
