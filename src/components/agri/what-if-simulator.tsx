'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, TrendingUp, CheckCircle2 } from 'lucide-react';
import { formatCurrency, formatCurrencyPerKg } from '@/lib/utils';

interface WhatIfSimulatorProps {
  currentNetRealization: number;
  pricePerKg: number;
  quantity: number;
  storageCostPerKgPerDay: number;
  transportCost: number;
  transactionCostPercent: number;
  priceTrend: number[]; // 5 data points to extrapolate
}

export function WhatIfSimulator({
  currentNetRealization,
  pricePerKg,
  quantity,
  storageCostPerKgPerDay,
  transportCost,
  transactionCostPercent,
  priceTrend,
}: WhatIfSimulatorProps) {
  // SELL TODAY
  const grossToday = pricePerKg * quantity;
  
  // WAIT 3 DAYS
  const firstPrice = priceTrend[0] || pricePerKg;
  const lastPrice = priceTrend[priceTrend.length - 1] || pricePerKg;
  const slope = priceTrend.length > 1 ? (lastPrice - firstPrice) / (priceTrend.length - 1) : 0;
  
  const expectedPrice = lastPrice + (slope * 3);
  const additionalStorageCost = 3 * storageCostPerKgPerDay * quantity;
  const grossWait = expectedPrice * quantity;
  const transactionWait = grossWait * (transactionCostPercent / 100);
  const netWait = grossWait - transportCost - additionalStorageCost - transactionWait;

  const sellTodayBetter = currentNetRealization >= netWait;
  const diff = Math.abs(currentNetRealization - netWait);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock className="h-4 w-4 text-emerald-700" />
          What if I wait?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* SELL TODAY */}
          <div className="border border-emerald-200 rounded-xl p-4 bg-emerald-50/40 relative overflow-hidden">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-bold text-sm text-gray-800">SELL TODAY</h4>
              <Badge variant="success">Now</Badge>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Price:</span>
                <span className="font-medium text-gray-800">{formatCurrencyPerKg(pricePerKg)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Gross:</span>
                <span className="font-medium text-gray-800">{formatCurrency(grossToday)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Transport:</span>
                <span className="text-red-600 font-medium">-{formatCurrency(transportCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Storage:</span>
                <span className="font-medium text-gray-800">{formatCurrency(0)}</span>
              </div>
              <div className="pt-2 border-t border-emerald-200 flex justify-between items-center mt-2">
                <span className="font-semibold text-gray-900">Net Realization:</span>
                <span className="text-lg font-bold text-emerald-800">{formatCurrency(currentNetRealization)}</span>
              </div>
            </div>
          </div>

          {/* WAIT 3 DAYS */}
          <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-bold text-sm text-gray-800">WAIT 3 DAYS</h4>
              <Badge variant="default">+3 Days</Badge>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Expected Price:</span>
                <span className="font-medium text-gray-800 flex items-center gap-1">
                  {formatCurrencyPerKg(expectedPrice)}
                  {slope > 0 && <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Gross:</span>
                <span className="font-medium text-gray-800">{formatCurrency(grossWait)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Transport:</span>
                <span className="text-red-600 font-medium">-{formatCurrency(transportCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Storage:</span>
                <span className="text-red-600 font-medium">-{formatCurrency(additionalStorageCost)}</span>
              </div>
              <div className="pt-2 border-t border-gray-200 flex justify-between items-center mt-2">
                <span className="font-semibold text-gray-900">Net Realization:</span>
                <span className="text-lg font-bold text-gray-800">{formatCurrency(netWait)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-emerald-100/60 p-3 rounded-xl border border-emerald-200 flex items-center justify-between">
          <div className="flex items-center font-semibold text-sm text-emerald-900">
            {sellTodayBetter ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-700 shrink-0" />
                Estimated advantage of selling now: <span className="ml-1 font-bold text-emerald-800">{formatCurrency(diff)}</span>
              </>
            ) : (
              <>
                <Clock className="h-4 w-4 mr-2 text-amber-700 shrink-0" />
                Estimated advantage of waiting: <span className="ml-1 font-bold text-emerald-800">{formatCurrency(diff)}</span>
              </>
            )}
          </div>
        </div>
        
        <div className="text-center space-y-0.5 mt-1">
          <p className="text-xs font-semibold text-gray-700">Highest price ≠ highest net realization</p>
          <p className="text-[11px] text-gray-400">Projections are estimates based on current market trends</p>
        </div>

      </CardContent>
    </Card>
  );
}
