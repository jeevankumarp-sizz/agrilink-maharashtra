'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AppShell, LoadingSpinner, EmptyState, DemoBanner } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TransactionTimeline } from '@/components/agri/transaction-timeline';
import { 
  actionGetLotDetails, 
  actionAcceptOffer, 
  actionRejectOffer, 
  actionAdvanceTransaction, 
  actionSeedOffers 
} from '@/actions/agri-actions';
import { formatCurrency, formatCurrencyPerKg, formatNumber, cn } from '@/lib/utils';
import type { Lot, Offer, Transaction } from '@/lib/types';
import { Check, X, MapPin, Scale, Tag, User, Star, CreditCard, Truck, RefreshCw } from 'lucide-react';

export default function LotDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [lot, setLot] = useState<Lot | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await actionGetLotDetails(id);
      if (res) {
        setLot(res.lot ?? null);
        setOffers(res.offers || []);
        setTransaction(res.transaction || null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const handleAccept = async (offerId: string) => {
    setActionLoading(`accept-${offerId}`);
    try {
      const res = await actionAcceptOffer(offerId);
      if (res.success) {
        await loadData();
        router.refresh();
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (offerId: string) => {
    setActionLoading(`reject-${offerId}`);
    try {
      const res = await actionRejectOffer(offerId);
      if (res.success) {
        await loadData();
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleSeed = async () => {
    setActionLoading('seed');
    try {
      const res = await actionSeedOffers(id);
      if (res.success) {
        await loadData();
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleAdvance = async () => {
    if (!transaction) return;
    setActionLoading('advance');
    try {
      const res = await actionAdvanceTransaction(transaction.id);
      if (res.success) {
        await loadData();
      }
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <AppShell role="farmer" userName="Registered Farmer Profile">
        <LoadingSpinner />
      </AppShell>
    );
  }

  if (!lot) {
    return (
      <AppShell role="farmer" userName="Registered Farmer Profile">
        <EmptyState title="Lot Not Found" description="The requested lot could not be found." />
      </AppShell>
    );
  }

  const bestPrice = offers.length > 0 ? Math.max(...offers.map(o => o.pricePerKg)) : 0;

  return (
    <AppShell role="farmer" userName="Registered Farmer Profile">
      <DemoBanner />

      <div className="space-y-6 max-w-5xl mx-auto pb-10">
        
        {/* Lot Details Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{lot.crop}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-gray-600">
              <span className="flex items-center gap-1"><Scale className="h-4 w-4 text-emerald-600" /> {formatNumber(lot.quantity)} {lot.unit}</span>
              <span className="flex items-center gap-1"><Tag className="h-4 w-4 text-emerald-600" /> {lot.qualityGrade}</span>
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4 text-emerald-600" /> {lot.location}</span>
            </div>
          </div>
          <div className="flex flex-col items-start md:items-end">
            <div className="text-sm text-gray-500">Expected Price</div>
            <div className="text-xl font-semibold text-emerald-700">{lot.expectedPrice ? formatCurrencyPerKg(lot.expectedPrice) : 'Market rate'}</div>
            <Badge variant={lot.status === 'open' || lot.status === 'offer_received' ? 'success' : lot.status === 'accepted' ? 'info' : 'default'} className="mt-2">
              {lot.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Transaction Section (if accepted) */}
        {transaction && (
          <div className="space-y-6">
            <Card className="border-emerald-200 shadow-sm overflow-hidden">
              <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100 flex justify-between items-center flex-wrap gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-emerald-900">Active Transaction Tracking</h2>
                  <p className="text-sm text-emerald-700">Offer accepted — proceed through delivery & payment workflow</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleAdvance} 
                    disabled={actionLoading === 'advance' || transaction.status === 'PAID'}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    {actionLoading === 'advance' ? 'Advancing...' : transaction.status === 'PAID' ? 'PAID ✓' : 'Update Delivery Status'}
                  </Button>
                  <Button
                    onClick={async () => {
                      const reason = prompt("Describe your grievance or payment delay issue:", "Payment delayed past expected delivery date");
                      if (reason) {
                        const { actionCreateGrievance } = await import("@/actions/agri-actions");
                        await actionCreateGrievance({
                          transactionId: transaction.id,
                          lotId: lot.id,
                          raisedBy: lot.farmerId,
                          farmerName: lot.farmerName,
                          category: "Payment Delay",
                          description: reason,
                        });
                        alert("Grievance ticket created successfully! Admin team has been notified.");
                      }
                    }}
                    variant="outline"
                    className="text-amber-800 border-amber-300 hover:bg-amber-50"
                  >
                    Raise Grievance
                  </Button>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                      <User className="h-4 w-4 text-emerald-600"/> Buyer Details
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-xl space-y-1 text-sm">
                      <div className="font-semibold text-gray-900">{transaction.buyerName}</div>
                      <div className="text-gray-600">Pickup location: {transaction.pickupLocation}</div>
                      <div className="text-gray-600">Destination: {transaction.destination}</div>
                      <div className="text-gray-600">Distance: {transaction.distanceKm} km</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-emerald-600"/> Payment Summary
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-xl space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Payout:</span>
                        <span className="font-bold text-lg text-emerald-800">{formatCurrency(transaction.totalAmount)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Payment Status:</span>
                        <Badge variant={transaction.paymentStatus === 'PAID' ? 'success' : 'warning'}>
                          {transaction.paymentStatus}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
                  <Truck className="h-4 w-4 text-emerald-600"/> Delivery Timeline
                </h3>
                <div className="bg-white border border-gray-100 rounded-xl p-6">
                  <TransactionTimeline currentStatus={transaction.status} />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Offers Section (if not yet sold) */}
        {!transaction && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Received Offers ({offers.length})</h2>
              {offers.length === 0 && (
                <Button 
                  onClick={handleSeed} 
                  disabled={actionLoading === 'seed'}
                  variant="secondary"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Create Procurement Offers
                </Button>
              )}
            </div>

            {offers.length === 0 ? (
              <EmptyState 
                title="No offers yet" 
                description="No offers have been placed on this lot yet. Click the button above to populate matching procurement offers." 
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {offers.map(offer => {
                  const isBestPrice = offer.pricePerKg === bestPrice;
                  const isPending = offer.status === 'pending';
                  
                  return (
                    <Card key={offer.id} className={cn("relative overflow-hidden border-2 transition-all duration-200", isBestPrice ? "border-emerald-500 ring-2 ring-emerald-100" : "border-gray-200")}>
                      {isBestPrice && (
                        <div className="absolute top-0 right-0 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl z-10">
                          BEST PRICE
                        </div>
                      )}
                      <CardContent className="p-6 space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-bold text-gray-900">{offer.buyerName}</h3>
                              <Badge variant="verified">
                                <Star className="h-3 w-3 mr-1 fill-current" /> {offer.buyerReliability}%
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                              <MapPin className="h-3.5 w-3.5" /> {offer.distanceKm} km away
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-emerald-700">{formatCurrencyPerKg(offer.pricePerKg)}</div>
                            <div className="text-xs text-gray-500">For {formatNumber(offer.quantity)} kg</div>
                          </div>
                        </div>

                        <div className="bg-gray-50 p-3 rounded-xl flex justify-between items-center text-sm">
                          <span className="text-gray-600 flex items-center gap-1.5"><CreditCard className="h-4 w-4 text-emerald-600" /> {offer.paymentTerms}</span>
                          <span className="font-semibold text-gray-900">Total: {formatCurrency(offer.pricePerKg * offer.quantity)}</span>
                        </div>

                        {isPending ? (
                          <div className="flex gap-3 pt-2">
                            <Button 
                              onClick={() => handleAccept(offer.id)}
                              disabled={actionLoading !== null}
                              className="flex-1 bg-emerald-700 hover:bg-emerald-800"
                            >
                              <Check className="h-4 w-4 mr-1.5" />
                              Accept Offer
                            </Button>
                            <Button 
                              onClick={() => handleReject(offer.id)}
                              disabled={actionLoading !== null}
                              variant="outline"
                              className="text-red-600 hover:bg-red-50 hover:text-red-700"
                            >
                              <X className="h-4 w-4 mr-1.5" />
                              Reject
                            </Button>
                          </div>
                        ) : (
                          <div className="flex justify-center p-2 bg-gray-50 rounded-xl">
                            <Badge variant={offer.status === 'accepted' ? 'success' : 'danger'}>
                              {offer.status.toUpperCase()}
                            </Badge>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
