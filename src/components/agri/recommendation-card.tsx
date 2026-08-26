"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatCurrencyPerKg, formatNumber } from "@/lib/utils";
import type { SellingOption } from "@/lib/types";
import { CheckCircle2, MapPin, ShieldCheck, TrendingUp, Truck } from "lucide-react";

export function RecommendationCard({
  option,
  rank,
  isTop = false,
  onSelect,
}: {
  option: SellingOption;
  rank?: number;
  isTop?: boolean;
  onSelect?: () => void;
}) {
  return (
    <Card
      className={
        isTop
          ? "border-2 border-emerald-500 ring-4 ring-emerald-100"
          : "border border-gray-200"
      }
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            {isTop && (
              <Badge variant="verified" className="mb-2">
                🏆 BEST OPTION
              </Badge>
            )}
            {rank && !isTop && (
              <Badge variant="info" className="mb-2">
                #{rank} Alternative
              </Badge>
            )}
            <CardTitle className="text-xl">{option.name}</CardTitle>
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
              <MapPin className="h-3.5 w-3.5" />
              {option.location} · {option.distanceKm} km
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-emerald-700">
              {formatCurrencyPerKg(option.pricePerKg)}
            </p>
            <Badge variant={option.demandLevel === "HIGH" ? "success" : "warning"}>
              Demand: {option.demandLevel}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Expected gross" value={formatCurrency(option.expectedGross)} />
          <Stat label="Transport" value={formatCurrency(option.transportCost)} icon={<Truck className="h-3.5 w-3.5" />} />
          <Stat label="Storage" value={formatCurrency(option.storageCost)} />
          <Stat
            label="Net realization"
            value={formatCurrency(option.expectedNetRealization)}
            highlight
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {option.verified && (
            <Badge variant="verified">
              <ShieldCheck className="mr-1 h-3 w-3" /> Verified Buyer
            </Badge>
          )}
          {option.paymentReliability && (
            <Badge variant="success">{option.paymentReliability}% payment reliability</Badge>
          )}
          <Badge variant="info">Score: {option.totalScore}/100</Badge>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-gray-700">Why this option?</p>
          <ul className="space-y-1">
            {option.reasons.map((r) => (
              <li key={r} className="flex items-start gap-2 text-sm text-gray-600">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                {r}
              </li>
            ))}
          </ul>
        </div>

        {onSelect && (
          <button
            onClick={onSelect}
            className="w-full rounded-xl bg-emerald-700 py-3 font-medium text-white hover:bg-emerald-800"
          >
            Create Lot with this Option
          </button>
        )}
      </CardContent>
    </Card>
  );
}

function Stat({
  label,
  value,
  highlight,
  icon,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className={`rounded-xl p-3 ${highlight ? "bg-emerald-50" : "bg-gray-50"}`}>
      <p className="text-xs text-gray-500 flex items-center gap-1">
        {icon}
        {label}
      </p>
      <p className={`font-semibold ${highlight ? "text-emerald-800 text-lg" : "text-gray-800"}`}>
        {value}
      </p>
    </div>
  );
}

export function LotCard({
  lot,
  onClick,
}: {
  lot: {
    id: string;
    crop: string;
    quantity: number;
    unit: string;
    qualityGrade: string;
    location: string;
    status: string;
    expectedPrice?: number;
  };
  onClick?: () => void;
}) {
  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-md"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-semibold text-gray-900">{lot.crop}</p>
            <p className="text-sm text-gray-500">
              {formatNumber(lot.quantity)} {lot.unit} · {lot.qualityGrade}
            </p>
            <p className="text-xs text-gray-400 mt-1">{lot.location}</p>
          </div>
          <div className="text-right">
            <Badge
              variant={
                lot.status === "open"
                  ? "success"
                  : lot.status === "completed"
                    ? "info"
                    : "warning"
              }
            >
              {lot.status.replace("_", " ")}
            </Badge>
            {lot.expectedPrice && (
              <p className="mt-2 text-sm font-medium text-emerald-700">
                ~{formatCurrencyPerKg(lot.expectedPrice)}
              </p>
            )}
          </div>
        </div>
        <p className="mt-2 text-xs text-gray-400">ID: {lot.id.slice(-8)}</p>
      </CardContent>
    </Card>
  );
}

export function ScoreBreakdown({ factors }: { factors: SellingOption["scoringFactors"] }) {
  const items = [
    { label: "Net Realization", value: factors.netRealization, weight: "30%" },
    { label: "Buyer Demand", value: factors.buyerDemand, weight: "20%" },
    { label: "Price Trend", value: factors.priceTrend, weight: "15%" },
    { label: "Transport Efficiency", value: factors.transportEfficiency, weight: "15%" },
    { label: "Buyer Reliability", value: factors.buyerReliability, weight: "10%" },
    { label: "Storage/Time Fit", value: factors.storageTimeSuitability, weight: "10%" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <TrendingUp className="h-4 w-4" /> Scoring Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <div key={item.label}>
            <div className="mb-1 flex justify-between text-sm">
              <span className="text-gray-600">
                {item.label} <span className="text-gray-400">({item.weight})</span>
              </span>
              <span className="font-medium">{Math.round(item.value)}</span>
            </div>
            <div className="h-2 rounded-full bg-gray-100">
              <div
                className="h-2 rounded-full bg-emerald-600 transition-all"
                style={{ width: `${Math.min(100, item.value)}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
