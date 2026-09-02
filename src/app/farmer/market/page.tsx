'use client';

import { useState, useMemo, useEffect } from 'react';
import { DEMO_MARKETS, DEMO_BUYERS, DEMO_DATA_LABEL } from '@/lib/demo-data';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { AppShell, DemoBanner, EmptyState } from '@/components/layout/app-shell';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn, formatCurrencyPerKg, formatNumber } from '@/lib/utils';
import { MapPin, TrendingUp, Users, ShieldCheck, RefreshCw, AlertCircle, Database } from 'lucide-react';
import type { CropName } from '@/lib/types';
import { MaharashtraMap } from '@/components/agri/maharashtra-map';
import type { NormalizedMarketPrice, DataStatus } from '@/lib/agmarknet';

const COLORS = ['#059669', '#0284c7', '#d97706', '#dc2626', '#7c3aed'];

export default function MarketIntelligencePage() {
  const [selectedCrop, setSelectedCrop] = useState<CropName>('Tomato');
  const [livePrices, setLivePrices] = useState<NormalizedMarketPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataStatus, setDataStatus] = useState<DataStatus>('live');
  const [dataSource, setDataSource] = useState<string>('AGMARKNET');
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const crops: CropName[] = ['Tomato', 'Onion', 'Potato'];

  useEffect(() => {
    async function fetchAgmarknetData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/market/prices?state=Maharashtra&commodity=${selectedCrop}`);
        const json = await res.json();
        if (json && json.data && json.data.length > 0) {
          setLivePrices(json.data);
          setDataStatus(json.dataStatus || 'live');
          setDataSource(json.source || 'AGMARKNET');
          setLastUpdated(json.updatedAt ? new Date(json.updatedAt).toLocaleTimeString() : new Date().toLocaleTimeString());
        } else {
          useFallback();
        }
      } catch (err) {
        useFallback();
      } finally {
        setLoading(false);
      }
    }

    function useFallback() {
      const staticMarkets = DEMO_MARKETS.filter(m => m.crop === selectedCrop);
      const converted: NormalizedMarketPrice[] = staticMarkets.map(m => ({
        id: m.id,
        source: 'Reference Dataset',
        state: 'Maharashtra',
        district: m.location.split(',')[0] || 'Nashik',
        market: m.name,
        commodity: m.crop,
        variety: 'Standard Variety',
        grade: 'Grade A',
        date: m.date,
        minPrice: m.minPrice,
        modalPrice: m.modalPrice,
        maxPrice: m.maxPrice,
        arrivals: m.arrivalVolume,
        unit: 'kg',
        sourceTimestamp: new Date().toISOString(),
        syncedAt: new Date().toISOString(),
        dataStatus: 'reference',
      }));
      setLivePrices(converted);
      setDataStatus('reference');
      setDataSource('Reference Dataset');
      setLastUpdated(new Date().toLocaleTimeString());
    }

    fetchAgmarknetData();
  }, [selectedCrop]);

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
    <AppShell role="farmer" userName="Registered Farmer Profile">
      <DemoBanner />
      
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Maharashtra Market Intelligence</h1>
          <p className="mt-1 text-sm text-gray-500">Live Daily APMC Prices &amp; Arrival Intelligence (AGMARKNET 2.0 Direct Feed)</p>
        </div>

        {/* Source & Transparency Badge */}
        <div className="flex flex-col items-end gap-1">
          <div className={cn(
            "flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border shadow-2xs",
            dataStatus === 'live' ? "bg-emerald-100/90 border-emerald-300 text-emerald-900" : "bg-amber-100/90 border-amber-300 text-amber-900"
          )}>
            <Database className="h-3.5 w-3.5" />
            <span>Source: {dataSource}</span>
            <span className="opacity-40">|</span>
            <span className="uppercase text-[10px] font-extrabold">{dataStatus === 'live' ? '🟢 LIVE' : '🟡 REFERENCE'}</span>
          </div>
          {lastUpdated && (
            <span className="text-[10px] text-gray-500 font-mono">Updated at: {lastUpdated}</span>
          )}
        </div>
      </div>

      {dataStatus === 'reference' && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-950 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
          <span>Using fallback market dataset. Primary AGMARKNET 2.0 API source is temporarily unavailable or rate-limited.</span>
        </div>
      )}

      {/* Maharashtra District Map Component */}
      <div className="mb-8">
        <MaharashtraMap />
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {crops.map((crop) => (
          <button
            key={crop}
            type="button"
            onClick={() => setSelectedCrop(crop)}
            className={cn(
              "whitespace-nowrap rounded-xl border px-5 py-2.5 text-sm font-semibold transition-colors",
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
        {/* AGMARKNET Live Prices Table */}
        <Card className="border-emerald-100 shadow-xs">
          <CardHeader className="bg-emerald-50/40 border-b border-emerald-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg text-emerald-950">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                  AGMARKNET 2.0 APMC Prices — {selectedCrop}
                </CardTitle>
                <CardDescription>
                  Modal price, min/max range, and arrival volumes across Maharashtra APMCs
                </CardDescription>
              </div>
              {loading && <RefreshCw className="h-4 w-4 animate-spin text-emerald-700" />}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {livePrices.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3 font-semibold">APMC Market</th>
                      <th className="px-4 py-3 font-semibold">District</th>
                      <th className="px-4 py-3 font-semibold">Variety / Grade</th>
                      <th className="px-4 py-3 text-right font-semibold">Min - Max (₹/kg)</th>
                      <th className="px-4 py-3 text-right font-semibold">Modal Price</th>
                      <th className="px-4 py-3 text-right font-semibold">Arrivals</th>
                      <th className="px-4 py-3 font-semibold">Source</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {livePrices.map((item) => (
                      <tr key={item.id} className="hover:bg-emerald-50/30 transition-colors">
                        <td className="px-4 py-3 font-bold text-gray-900">{item.market}</td>
                        <td className="px-4 py-3 text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                            {item.district}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500">
                          <span className="font-semibold text-gray-700">{item.variety}</span> ({item.grade})
                        </td>
                        <td className="px-4 py-3 text-right text-gray-600">
                          ₹{item.minPrice} - ₹{item.maxPrice}
                        </td>
                        <td className="px-4 py-3 text-right font-extrabold text-emerald-800 text-base">
                          {formatCurrencyPerKg(item.modalPrice)}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-700 font-medium">
                          {formatNumber(item.arrivals)} {item.unit}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={item.dataStatus === 'live' ? 'verified' : 'info'} className="text-[10px]">
                            {item.source}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6">
                <EmptyState title="No market data" description={`No market data available for ${selectedCrop}.`} />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Price Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>5-Day Market Price Trajectory (₹/kg)</CardTitle>
            <CardDescription>Historical price movements across Maharashtra APMC hubs</CardDescription>
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
              Active Verified Buyer Requirements — {selectedCrop}
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
                      {buyer.verified && <Badge variant="verified">Verified Buyer</Badge>}
                    </div>
                    
                    <div className="mt-3 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Target Price Range</span>
                        <span className="font-medium text-gray-900">₹{buyer.priceMin} - ₹{buyer.priceMax}/kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Qty Required</span>
                        <span className="font-medium text-gray-900">{formatNumber(buyer.quantityRequired)} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Reliability Score</span>
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
