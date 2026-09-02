"use client";

import React, { useEffect, useState } from 'react';
import { AppShell, DemoBanner } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrencyPerKg, formatNumber } from '@/lib/utils';
import { actionLogin } from '@/actions/agri-actions';
import { TrendingUp, TrendingDown, Minus, Database, RefreshCw } from 'lucide-react';
import type { NormalizedMarketPrice, DataStatus } from '@/lib/agmarknet';

export default function AdminMarkets() {
  const [livePrices, setLivePrices] = useState<NormalizedMarketPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataStatus, setDataStatus] = useState<DataStatus>('live');
  const [dataSource, setDataSource] = useState<string>('AGMARKNET');

  useEffect(() => {
    actionLogin('admin');
    
    async function loadPrices() {
      try {
        const res = await fetch('/api/market/prices?state=Maharashtra');
        const json = await res.json();
        if (json && json.data && json.data.length > 0) {
          setLivePrices(json.data);
          setDataStatus(json.dataStatus || 'live');
          setDataSource(json.source || 'AGMARKNET');
        }
      } catch (err) {
        console.error("Error fetching admin market prices:", err);
      } finally {
        setLoading(false);
      }
    }

    loadPrices();
  }, []);

  return (
    <AppShell role="admin" userName="AgriLink Admin Center">
      <DemoBanner />
      <div className="p-4 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Markets Intelligence Overview</h1>
            <p className="text-sm text-gray-500 mt-1">Statewide APMC Mandi Prices &amp; Arrival Tracking Feed</p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={dataStatus === 'live' ? 'verified' : 'info'} className="px-3 py-1 text-xs">
              <Database className="h-3.5 w-3.5 mr-1" />
              Source: {dataSource} ({dataStatus.toUpperCase()})
            </Badge>
            {loading && <RefreshCw className="h-4 w-4 animate-spin text-emerald-700" />}
          </div>
        </div>

        <Card className="border-emerald-100">
          <CardHeader className="bg-emerald-50/40">
            <CardTitle>AGMARKNET 2.0 State Mandi Data Feed</CardTitle>
            <CardDescription>Real-time and fallback daily arrival prices across Maharashtra APMC hubs</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3">Market APMC</th>
                    <th className="px-4 py-3">District</th>
                    <th className="px-4 py-3">Commodity</th>
                    <th className="px-4 py-3">Variety / Grade</th>
                    <th className="px-4 py-3 text-right">Prices (Min/Modal/Max)</th>
                    <th className="px-4 py-3 text-right">Arrivals</th>
                    <th className="px-4 py-3">Source Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {livePrices.map((item) => (
                    <tr key={item.id} className="hover:bg-emerald-50/20 transition-colors">
                      <td className="px-4 py-3 font-bold text-gray-900">{item.market}</td>
                      <td className="px-4 py-3 text-gray-600">{item.district}</td>
                      <td className="px-4 py-3 font-semibold text-emerald-800">
                        <Badge variant="default" className="border-emerald-300 bg-emerald-50">{item.commodity}</Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {item.variety} ({item.grade})
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600">
                        ₹{item.minPrice} / <strong className="text-emerald-700 text-base">₹{item.modalPrice}</strong> / ₹{item.maxPrice}
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
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
