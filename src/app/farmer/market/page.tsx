'use client';

import { useState, useMemo } from 'react';
import { DEMO_MARKETS, DEMO_BUYERS } from '@/lib/demo-data';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { AppShell, DemoBanner, EmptyState } from '@/components/layout/app-shell';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn, formatCurrencyPerKg, formatNumber } from '@/lib/utils';
import { MapPin, TrendingUp, Users } from 'lucide-react';
import type { CropName } from '@/lib/types';

const COLORS = ['#059669', '#0284c7', '#d97706', '#dc2626', '#7c3aed'];

export default function MarketIntelligencePage() {
  const [selectedCrop, setSelectedCrop] = useState<CropName>('Tomato');

  const crops: CropName[] = ['Tomato', 'Onion', 'Potato'];

  const cropMarkets = useMemo(() => DEMO_MARKETS.filter(m => m.crop === selectedCrop), [selectedCrop]);
  const cropBuyers = useMemo(() => DEMO_BUYERS.filter(b => b.cropsRequired.includes(selectedCrop)), [selectedCrop]);

  const chartData = useMemo(() => {
    if (cropMarkets.length === 0) return [];
    return [1, 2, 3, 4, 5].map((dayIdx) => {
      const dataPoint: any = { day: `Day ${dayIdx}` };
      cropMarkets.forEach((market) => {
        dataPoint[market.name] = market.priceTrend[dayIdx - 1];
      });
      return dataPoint;
    });
  }, [cropMarkets]);

  return (
    <AppShell role="farmer" userName="Ramesh Kumar">
      <DemoBanner />
      
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Market Intelligence</h1>
          <p className="mt-1 text-gray-500">Real-time prices and demand across markets</p>
        </div>
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {crops.map((crop) => (
          <button
            key={crop}
            onClick={() => setSelectedCrop(crop)}
            className={cn(
              "whitespace-nowrap rounded-xl border px-5 py-2.5 text-sm font-medium transition-colors",
              selectedCrop === crop
                ? "border-emerald-700 bg-emerald-700 text-white shadow-sm"
                : "border-gray-200 bg-white text-gray-600 hover:bg-emerald-50"
            )}
          >
            {crop}
          </button>
        ))}
      </div>

      <div className="grid gap-6">
        {/* Prices Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              Current Market Prices - {selectedCrop}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cropMarkets.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500">
                    <tr>
                      <th className="px-4 py-3 font-medium">Market Name</th>
                      <th className="px-4 py-3 font-medium">Location</th>
                      <th className="px-4 py-3 text-right font-medium">Price Range (₹/kg)</th>
                      <th className="px-4 py-3 text-right font-medium">Modal Price</th>
                      <th className="px-4 py-3 text-right font-medium">Arrivals (Qtl)</th>
                      <th className="px-4 py-3 font-medium">Demand</th>
                      <th className="px-4 py-3 text-right font-medium">Distance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {cropMarkets.map((market) => (
                      <tr key={market.id} className="hover:bg-gray-50/50">
                        <td className="px-4 py-3 font-medium text-gray-900">{market.name}</td>
                        <td className="px-4 py-3 text-gray-500">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {market.location}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right text-gray-600">
                          {market.minPrice} - {market.maxPrice}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-emerald-700">
                          {formatCurrencyPerKg(market.modalPrice)}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-600">
                          {formatNumber(market.arrivalVolume)}
                        </td>
                        <td className="px-4 py-3">
                          <Badge 
                            variant={market.demandLevel === 'HIGH' ? 'success' : market.demandLevel === 'MEDIUM' ? 'warning' : 'danger'}
                          >
                            {market.demandLevel}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right text-gray-500">
                          {market.distanceKm} km
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState title="No market data" description={`No market data available for ${selectedCrop}.`} />
            )}
          </CardContent>
        </Card>

        {/* Price Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>5-Day Price Trend (₹/kg)</CardTitle>
            <CardDescription>Historical modal prices for {selectedCrop} across top markets</CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <div className="h-80 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dx={-10} domain={['auto', 'auto']} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    {cropMarkets.map((market, idx) => (
                      <Line 
                        key={market.id} 
                        type="monotone" 
                        dataKey={market.name} 
                        stroke={COLORS[idx % COLORS.length]} 
                        strokeWidth={2}
                        dot={{ r: 4, strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyState title="No trend data" description={`No historical data available for ${selectedCrop}.`} />
            )}
          </CardContent>
        </Card>

        {/* Buyer Demand */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-emerald-600" />
              Active Buyer Demand - {selectedCrop}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cropBuyers.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {cropBuyers.map((buyer) => (
                  <div key={buyer.id} className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 transition-colors hover:border-emerald-100 hover:bg-emerald-50/50">
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">{buyer.name}</h4>
                        <p className="text-xs text-gray-500">{buyer.buyerType} • {buyer.location}</p>
                      </div>
                      {buyer.verified && <Badge variant="verified">Verified</Badge>}
                    </div>
                    
                    <div className="mt-3 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Price Range</span>
                        <span className="font-medium text-gray-900">₹{buyer.priceMin} - ₹{buyer.priceMax}/kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Qty Needed</span>
                        <span className="font-medium text-gray-900">{formatNumber(buyer.quantityRequired)} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Reliability</span>
                        <span className="font-medium text-emerald-600">{buyer.reliabilityScore}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="No buyers" description={`No active buyers currently seeking ${selectedCrop}.`} />
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
