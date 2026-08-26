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

export default function MakeOfferPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [lot, setLot] = useState<Lot | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    pricePerKg: '',
    quantity: '',
    pickupDate: '',
    paymentTerms: 'Payment within 3 days',
    notes: ''
  });

  useEffect(() => {
    async function loadLot() {
      try {
        const details = await actionGetLotDetails(resolvedParams.id);
        setLot(details.lot ?? null);
        if (details.lot) {
          setFormData(prev => ({ ...prev, quantity: details.lot!.quantity.toString() }));
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
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const offerData = {
        lotId: lot.id,
        buyerId: 'b1',
        buyerName: 'FreshFoods Pvt Ltd',
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
        }, 1500);
      }
    } catch (error) {
      console.error('Failed to submit offer:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AppShell role="buyer" userName="FreshFoods Pvt Ltd">
        <LoadingSpinner />
      </AppShell>
    );
  }

  if (!lot) {
    return (
      <AppShell role="buyer" userName="FreshFoods Pvt Ltd">
        <EmptyState 
          title="Lot not found" 
          description="The lot you are looking for does not exist or has been removed."
        />
        <div className="mt-4 flex justify-center">
          <Link href="/buyer/lots">
            <Button variant="outline">Back to Lots</Button>
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell role="buyer" userName="FreshFoods Pvt Ltd">
      <DemoBanner />
      
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <Link href="/buyer/lots" className="inline-flex items-center text-sm text-emerald-600 hover:text-emerald-800 mb-4 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to available lots
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-emerald-900">Make an Offer</h1>
          <p className="text-emerald-700 mt-1">Review the lot details and submit your purchasing terms.</p>
        </div>

        {success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 mb-6 flex items-center justify-center font-medium shadow-sm">
            Offer submitted successfully! Redirecting to dashboard...
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="h-fit">
            <CardHeader className="bg-emerald-50 rounded-t-xl border-b border-emerald-100 p-5">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl text-emerald-900">{lot.crop}</CardTitle>
                  <CardDescription className="text-emerald-700 mt-1">Lot ID: {lot.id.slice(-8)}</CardDescription>
                </div>
                <Badge variant="success" className="text-sm">
                  {lot.qualityGrade}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-y-4">
                <div className="flex items-start gap-2">
                  <Scale className="h-5 w-5 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Quantity</p>
                    <p className="font-semibold">{formatNumber(lot.quantity)} {lot.unit}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-semibold">{lot.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold text-lg leading-none mt-1">₹</span>
                  <div>
                    <p className="text-sm text-gray-500">Expected Price</p>
                    <p className="font-semibold text-emerald-700">{lot.expectedPrice ? formatCurrencyPerKg(lot.expectedPrice) : 'Negotiable'}</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">Farmer</p>
                <p className="font-medium">{lot.farmerName}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Offer Details</CardTitle>
              <CardDescription>Specify your terms for purchasing this lot.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="pricePerKg" className="text-sm font-medium">Price per kg (₹)</label>
                  <input
                    id="pricePerKg"
                    name="pricePerKg"
                    type="number"
                    step="0.1"
                    min="1"
                    required
                    value={formData.pricePerKg}
                    onChange={handleChange}
                    className="flex h-11 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                    placeholder={lot.expectedPrice ? `e.g. ${lot.expectedPrice}` : '31.00'}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="quantity" className="text-sm font-medium">Quantity (kg)</label>
                  <input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="1"
                    max={lot.quantity}
                    required
                    value={formData.quantity}
                    onChange={handleChange}
                    className="flex h-11 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                  />
                  <p className="text-xs text-gray-500">Max available: {formatNumber(lot.quantity)} kg</p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="pickupDate" className="text-sm font-medium">Proposed Pickup Date</label>
                  <input
                    id="pickupDate"
                    name="pickupDate"
                    type="date"
                    required
                    value={formData.pickupDate}
                    onChange={handleChange}
                    className="flex h-11 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="paymentTerms" className="text-sm font-medium">Payment Terms</label>
                  <select
                    id="paymentTerms"
                    name="paymentTerms"
                    required
                    value={formData.paymentTerms}
                    onChange={handleChange}
                    className="flex h-11 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Payment within 3 days of delivery">Payment within 3 days of delivery</option>
                    <option value="Payment within 7 days of delivery">Payment within 7 days of delivery</option>
                    <option value="Payment on delivery">Payment on delivery</option>
                    <option value="Advance payment">Advance payment</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="notes" className="text-sm font-medium">Additional Notes (Optional)</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className="flex w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                    placeholder="E.g., Ready to pickup from farm gate"
                  />
                </div>

                <Button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800" disabled={submitting || success}>
                  {submitting ? 'Submitting Offer...' : 'Submit Offer'}
                </Button>
                
                {formData.pricePerKg && formData.quantity && !isNaN(Number(formData.pricePerKg)) && !isNaN(Number(formData.quantity)) && (
                  <div className="mt-4 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span>Total Offer Value:</span>
                      <span className="text-emerald-800 text-lg font-bold">{formatCurrency(Number(formData.pricePerKg) * Number(formData.quantity))}</span>
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
