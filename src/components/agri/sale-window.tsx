'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, TrendingUp, TrendingDown, Minus, AlertCircle } from 'lucide-react';
import { cn, formatCurrencyPerKg } from '@/lib/utils';

interface SaleWindowProps {
  crop: string;
  location: string;
  demandLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  priceTrend: number[];
  storageCostPerDay: number;
  quantity: number;
}

export function SaleWindow({
  crop,
  location,
  demandLevel,
  priceTrend,
  storageCostPerDay,
  quantity,
}: SaleWindowProps) {
  const firstPrice = priceTrend[0] || 0;
  const lastPrice = priceTrend[priceTrend.length - 1] || 0;
  const priceDiff = lastPrice - firstPrice;
  const isUpward = priceDiff > 0;
  const isDownward = priceDiff < 0;
  const isStable = priceDiff === 0;

  const expectedMovement = priceDiff / (priceTrend.length > 1 ? priceTrend.length - 1 : 1);
  const formattedMovement = `${expectedMovement > 0 ? '+' : ''}₹${expectedMovement.toFixed(2)}/kg`;

  let badgeColor = '';
  let badgeText = '';
  let recommendationText = '';

  if (demandLevel === 'HIGH' && isUpward) {
    badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-200';
    badgeText = '🟢 SELL WITHIN 24–48 HOURS';
    recommendationText = 'Sell within the next 48 hours because expected price improvement is lower than the additional storage and risk cost.';
  } else if (demandLevel === 'LOW') {
    badgeColor = 'bg-red-100 text-red-800 border-red-200';
    badgeText = '🔴 CONSIDER WAITING 5–7 DAYS';
    recommendationText = 'Market demand is currently low. If storage is available, consider waiting for better conditions.';
  } else {
    badgeColor = 'bg-amber-100 text-amber-800 border-amber-200';
    badgeText = '🟡 SELL WITHIN 3–5 DAYS';
    recommendationText = 'Current market conditions are moderate. Selling within 3-5 days is advisable to balance price and risk.';
  }

  const getDemandDot = (level: string) => {
    switch (level) {
      case 'HIGH': return 'bg-emerald-500';
      case 'MEDIUM': return 'bg-amber-500';
      case 'LOW': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock className="h-4 w-4 text-emerald-700" />
          AI Sale Window
        </CardTitle>
        <p className="text-xs text-gray-500">{crop} — {location}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <span className={cn('inline-flex items-center rounded-xl border px-3 py-1.5 text-sm font-bold', badgeColor)}>
            {badgeText}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm bg-gray-50 p-3 rounded-xl">
          <div className="space-y-0.5">
            <p className="text-xs text-gray-500">Demand</p>
            <div className="flex items-center font-medium text-gray-800">
              <span className={cn("h-2 w-2 rounded-full mr-1.5", getDemandDot(demandLevel))} />
              {demandLevel}
            </div>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-gray-500">Arrival Volume</p>
            <p className="font-medium text-gray-800">MODERATE</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-gray-500">Price Trend</p>
            <div className="flex items-center font-medium text-gray-800">
              {isUpward && <TrendingUp className="h-3.5 w-3.5 mr-1 text-emerald-600" />}
              {isDownward && <TrendingDown className="h-3.5 w-3.5 mr-1 text-red-500" />}
              {isStable && <Minus className="h-3.5 w-3.5 mr-1 text-gray-500" />}
              {isUpward ? 'UPWARD' : isDownward ? 'DOWNWARD' : 'STABLE'}
            </div>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-gray-500">Storage Cost</p>
            <p className="font-medium text-gray-800">₹{Math.round(storageCostPerDay)}/day</p>
          </div>
          <div className="col-span-2 space-y-0.5">
            <p className="text-xs text-gray-500">Expected Price Movement</p>
            <p className={cn("font-medium", expectedMovement > 0 ? "text-emerald-700" : "text-red-600")}>{formattedMovement}</p>
          </div>
        </div>

        <div className="bg-emerald-50/70 p-3 rounded-xl text-sm border border-emerald-100 text-gray-700">
          {recommendationText}
        </div>

        <div className="flex items-start gap-1.5 text-[11px] text-gray-400">
          <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
          <p>Estimates based on current market signals. Not guaranteed future prices.</p>
        </div>
      </CardContent>
    </Card>
  );
}
