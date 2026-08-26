'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { actionGetFarmerDashboard, actionLogin, actionAcceptOffer, actionRejectOffer } from '@/actions/agri-actions';
import { AppShell, DemoBanner, LoadingSpinner, EmptyState } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn, formatCurrency, formatCurrencyPerKg, formatNumber } from '@/lib/utils';
import { MapPin, ShieldCheck, Check, X, ArrowRight } from 'lucide-react';
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
    const res = await actionAcceptOffer(offerId);
    if (res.success && res.transaction) {
      alert("Offer Accepted! Transaction TX-MH-001 created. Redirecting to transaction timeline...");
      router.push(`/farmer/lots/${res.transaction.lotId}`);
    } else {
      await fetchData();
      router.refresh();
    }
  };

  const handleReject = async (offerId: string) => {
    await actionRejectOffer(offerId);
    await fetchData();
    router.refresh();
  };

  if (loading) {
    return (
      <AppShell role="farmer" userName="Ramesh Kumar">
        <DemoBanner />
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Offers</h1>
            <p className="text-sm text-gray-500 mt-1">Loading incoming buyer offers...</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2].map(i => (
              <div key={i} className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-2/3" />
                <div className="h-4 bg-gray-100 rounded w-1/2" />
                <div className="space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-full" />
                  <div className="h-3 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
                <div className="flex gap-3 pt-2">
                  <div className="h-10 bg-emerald-100 rounded-xl flex-1" />
                  <div className="h-10 bg-gray-100 rounded-xl flex-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </AppShell>
    );
  }

  const pendingOffers = data.allOffers.filter(o => o.status === 'pending');
  const pastOffers = data.allOffers.filter(o => o.status !== 'pending');

  return (
    <AppShell role="farmer" userName={data.user?.name || "Ramesh Kumar"}>
      <DemoBanner />
      
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Offers Management</h1>
          <p className="mt-1 text-sm text-gray-500">Review and respond to buyer offers for your lots</p>
        </div>
      </div>

      <div className="space-y-8 max-w-5xl mx-auto pb-12">
        <section>
          <h2 className="mb-4 text-lg font-bold text-gray-900 flex items-center justify-between">
            <span>Pending Buyer Offers ({pendingOffers.length})</span>
            {pendingOffers.length > 0 && (
              <span className="text-xs font-normal text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                Connected SIH Demo Active
              </span>
            )}
          </h2>
          {pendingOffers.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {pendingOffers.map(offer => {
                const lot = data.lots.find(l => l.id === offer.lotId) ?? data.lots[0];
                return (
                  <Card key={offer.id} className="border-2 border-emerald-200 shadow-sm">
                    <CardHeader className="border-b border-gray-100 pb-3 bg-emerald-50/40">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base font-bold text-gray-900">{offer.buyerName}</CardTitle>
                          <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                            <MapPin className="h-3 w-3 text-emerald-600" />
                            {offer.distanceKm} km away
                            <span className="ml-1 flex items-center gap-1 font-semibold text-emerald-700">
                              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                              {offer.buyerReliability}% Reliability
                            </span>
                          </div>
                        </div>
                        <Badge variant="warning" className="font-bold">Pending</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="mb-4 space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Target Lot</span>
                          <Link href={`/farmer/lots/${offer.lotId}`} className="font-bold text-emerald-700 hover:underline">
                            {lot?.crop ?? "Tomato"} • {formatNumber(lot?.quantity || 2000)} {lot?.unit || "kg"}
                          </Link>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Offer Price</span>
                          <span className="font-bold text-emerald-800 text-sm">{formatCurrencyPerKg(offer.pricePerKg)}</span>
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
                          <div className="mt-2 rounded-lg bg-gray-50 p-2.5 text-xs text-gray-600 border">
                            {offer.notes}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-3 pt-2">
                        <Button 
                          className="flex-1 font-bold text-sm bg-emerald-700 hover:bg-emerald-800"
                          onClick={() => handleAccept(offer.id)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Accept Offer ({formatCurrency(offer.pricePerKg * offer.quantity)})
                        </Button>
                        <Button 
                          variant="outline" 
                          className="border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50 hover:text-red-700 text-xs"
                          onClick={() => handleReject(offer.id)}
                        >
                          <X className="h-4 w-4 mr-1" />
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
          <h2 className="mb-4 text-lg font-bold text-gray-900">Past Offers ({pastOffers.length})</h2>
          {pastOffers.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pastOffers.map(offer => {
                const lot = data.lots.find(l => l.id === offer.lotId) ?? data.lots[0];
                const isAccepted = offer.status === 'accepted';
                
                return (
                  <Card key={offer.id} className={cn(isAccepted ? 'border-emerald-300 bg-emerald-50/40' : 'opacity-75')}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base font-bold text-gray-900">{offer.buyerName}</CardTitle>
                          <Link href={`/farmer/lots/${offer.lotId}`} className="text-xs text-emerald-700 font-semibold hover:underline">
                            {lot?.crop} • {formatNumber(lot?.quantity || 2000)} {lot?.unit || "kg"}
                          </Link>
                        </div>
                        <Badge variant={isAccepted ? 'success' : 'danger'} className="capitalize font-bold">
                          {offer.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="text-xs">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Offered Price</span>
                        <span className="font-bold text-emerald-800">{formatCurrencyPerKg(offer.pricePerKg)}</span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-xs">
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
