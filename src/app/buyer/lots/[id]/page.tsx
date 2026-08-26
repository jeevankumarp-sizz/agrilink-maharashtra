'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
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
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { actionGetLotDetails, actionSubmitOffer } from '@/actions/agri-actions';
import { formatCurrency, formatCurrencyPerKg, formatNumber } from '@/lib/utils';
import type { Lot } from '@/lib/types';
import { MapPin, Scale, Star, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { BuyerTrustCard } from '@/components/agri/buyer-trust-card';

export default function MakeOfferPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [lot, setLot] = useState<Lot | null>(null);
  const [success, setSuccess] = useState(false);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [formData, setFormData] = useState({
    pricePerKg: '31.50',
    quantity: '2000',
    pickupDate: tomorrow.toISOString().split('T')[0],
    paymentTerms: 'Payment within 2 days of delivery',
    notes: 'Direct pickup scheduled from farm gate in Nashik'
  });

  useEffect(() => {
    async function loadLot() {
      try {
        const details = await actionGetLotDetails(resolvedParams.id);
        setLot(details.lot ?? null);
        if (details.lot) {
          setFormData(prev => ({ 
            ...prev, 
            quantity: details.lot!.quantity.toString(),
            pricePerKg: details.lot!.expectedPrice ? details.lot!.expectedPrice.toString() : '31.50'
          }));
        }
      } catch (error) {
        console.error('Failed to load lot:', error);
      } finally {
        setLoading(false);
      }
    }

    loadLot();
  }, [resolvedParams.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lot) return;
    
    setSubmitting(true);
    try {
      const offerData = {
        lotId: lot.id,
        buyerId: 'buyer-1',
        buyerName: 'FreshFoods Maharashtra — Demo Buyer',
        buyerReliability: 94,
        pricePerKg: parseFloat(formData.pricePerKg),
        quantity: parseInt(formData.quantity, 10),
        pickupDate: formData.pickupDate || tomorrow.toISOString().split('T')[0],
        paymentTerms: formData.paymentTerms,
        notes: formData.notes,
        distanceKm: 25
      };
      
      const result = await actionSubmitOffer(offerData);
      
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/buyer');
        }, 1200);
      }
    } catch (error) {
      console.error('Failed to submit offer:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AppShell role="buyer" userName="FreshFoods Maharashtra">
        <LoadingSpinner />
      </AppShell>
    );
  }

  if (!lot) {
    return (
      <AppShell role="buyer" userName="FreshFoods Maharashtra">
        <EmptyState 
          title="Lot not found" 
          description="The lot you are looking for does not exist or has been removed."
        />
        <div className="mt-4 flex justify-center">
          <Link href="/buyer/lots">
            <Button variant="outline">Back to Available Lots</Button>
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell role="buyer" userName="FreshFoods Maharashtra">
      <DemoBanner />
      
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        <div>
          <Link href="/buyer/lots" className="inline-flex items-center text-sm text-emerald-700 font-semibold hover:underline mb-3">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to available lots
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Make an Offer on Lot #{lot.id.slice(-8)}</h1>
          <p className="text-gray-600 text-sm mt-1">Review lot details and submit your purchasing terms.</p>
        </div>

        {success && (
          <div className="bg-emerald-100 border border-emerald-300 text-emerald-950 rounded-xl p-4 flex items-center justify-center font-bold text-sm shadow-sm">
            ✓ Digital Offer OFFER-MH-001 created successfully! Redirecting to dashboard...
          </div>
        )}

        {/* Buyer Trust Profile Card */}
        <BuyerTrustCard buyerName="FreshFoods Maharashtra — Demo Buyer" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="h-fit">
            <CardHeader className="bg-emerald-50/70 rounded-t-xl border-b border-emerald-100 p-5">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl text-gray-900 font-bold">{lot.crop}</CardTitle>
                  <CardDescription className="text-gray-500 text-xs mt-0.5">Lot ID: {lot.id}</CardDescription>
                </div>
                <Badge variant="success" className="text-xs font-bold">
                  {lot.qualityGrade}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-y-4 text-xs">
                <div className="flex items-start gap-2">
                  <Scale className="h-4 w-4 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="text-gray-500">Quantity</p>
                    <p className="font-bold text-gray-900 text-sm">{formatNumber(lot.quantity)} {lot.unit}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="text-gray-500">Location</p>
                    <p className="font-bold text-gray-900 text-sm">{lot.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold text-base leading-none">₹</span>
                  <div>
                    <p className="text-gray-500">Expected Price</p>
                    <p className="font-bold text-emerald-800 text-sm">{lot.expectedPrice ? formatCurrencyPerKg(lot.expectedPrice) : 'Market rate'}</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100 text-xs">
                <p className="text-gray-500">Farmer</p>
                <p className="font-bold text-gray-900 text-sm">{lot.farmerName}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-gray-900">Create Digital Offer</CardTitle>
              <CardDescription className="text-xs">Specify offer price, quantity, and payment terms.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label htmlFor="pricePerKg" className="font-bold text-gray-700">Price per kg (₹)</label>
                  <input
                    id="pricePerKg"
                    name="pricePerKg"
                    type="number"
                    step="0.5"
                    min="1"
                    required
                    value={formData.pricePerKg}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                    placeholder="31.00"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label htmlFor="quantity" className="font-bold text-gray-700">Quantity (kg)</label>
                  <input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="1"
                    max={lot.quantity}
                    required
                    value={formData.quantity}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="pickupDate" className="font-bold text-gray-700">Proposed Pickup Date</label>
                  <input
                    id="pickupDate"
                    name="pickupDate"
                    type="date"
                    required
                    value={formData.pickupDate}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="paymentTerms" className="font-bold text-gray-700">Payment Terms</label>
                  <select
                    id="paymentTerms"
                    name="paymentTerms"
                    required
                    value={formData.paymentTerms}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Payment within 2 days of delivery">Payment within 2 days of delivery</option>
                    <option value="Payment within 3 days of delivery">Payment within 3 days of delivery</option>
                    <option value="Payment on delivery">Payment on delivery</option>
                    <option value="Advance payment">Advance payment</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="notes" className="font-bold text-gray-700">Notes (Optional)</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={2}
                    className="flex w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <Button type="submit" size="lg" className="w-full bg-emerald-700 hover:bg-emerald-800 font-bold text-sm" disabled={submitting || success}>
                  {submitting ? 'Submitting Digital Offer...' : `Submit Digital Offer (${formatCurrency(Number(formData.pricePerKg || 31.5) * Number(formData.quantity || 2000))})`}
                </Button>
                
                {formData.pricePerKg && formData.quantity && !isNaN(Number(formData.pricePerKg)) && !isNaN(Number(formData.quantity)) && (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                    <div className="flex justify-between items-center text-xs font-bold text-emerald-950">
                      <span>Total Offer Value:</span>
                      <span className="text-emerald-800 text-base font-extrabold">{formatCurrency(Number(formData.pricePerKg) * Number(formData.quantity))}</span>
                    </div>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
