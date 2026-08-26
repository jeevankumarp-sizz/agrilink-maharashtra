"use client";

import React, { useEffect } from 'react';
import { AppShell, DemoBanner } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DEMO_MARKETS } from '@/lib/demo-data';
import { formatCurrencyPerKg, formatNumber } from '@/lib/utils';
import { actionLogin } from '@/actions/agri-actions';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function AdminMarkets() {
  useEffect(() => {
    actionLogin('admin');
  }, []);

  return (
    <AppShell role="admin" userName="AgriLink Admin">
      <DemoBanner />
      <div className="p-4 md:p-8 space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Markets Overview</h1>

        <Card>
          <CardHeader>
            <CardTitle>Mandi Market Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                  <tr>
                    <th className="px-4 py-3">Market Name</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Crop</th>
                    <th className="px-4 py-3">Prices (Min/Modal/Max)</th>
                    <th className="px-4 py-3">Arrivals</th>
                    <th className="px-4 py-3">Demand</th>
                    <th className="px-4 py-3">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {DEMO_MARKETS.map((market) => {
                    const latestTrend = market.priceTrend[market.priceTrend.length - 1];
                    const prevTrend = market.priceTrend[market.priceTrend.length - 2];
                    const diff = latestTrend - prevTrend;

                    let TrendIcon = Minus;
                    let trendColor = 'text-gray-500';
                    if (diff > 0) {
                      TrendIcon = TrendingUp;
                      trendColor = 'text-emerald-600';
                    } else if (diff < 0) {
                      TrendIcon = TrendingDown;
                      trendColor = 'text-red-500';
                    }

                    return (
                      <tr key={market.id} className="hover:bg-gray-50/50">
                        <td className="px-4 py-3 font-medium text-gray-900">{market.name}</td>
                        <td className="px-4 py-3 text-gray-500">{market.location} ({market.distanceKm} km)</td>
                        <td className="px-4 py-3">
                          <Badge variant="default">{market.crop}</Badge>
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          ₹{market.minPrice} / <strong className="text-emerald-700">₹{market.modalPrice}</strong> / ₹{market.maxPrice}
                        </td>
                        <td className="px-4 py-3 text-gray-600">{formatNumber(market.arrivalVolume)} quintals</td>
                        <td className="px-4 py-3">
                          <Badge 
                            variant={market.demandLevel === 'HIGH' ? 'success' : market.demandLevel === 'MEDIUM' ? 'warning' : 'danger'}
                          >
                            {market.demandLevel}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className={`flex items-center space-x-1 font-medium ${trendColor}`}>
                            <TrendIcon className="w-4 h-4" />
                            <span>{formatCurrencyPerKg(latestTrend)}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
