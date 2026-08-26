"use client";

import React, { useEffect } from 'react';
import { AppShell, DemoBanner } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DEMO_BUYERS } from '@/lib/demo-data';
import { formatCurrencyPerKg, formatNumber } from '@/lib/utils';
import { actionLogin } from '@/actions/agri-actions';
import { MapPin, ShieldCheck, Star, Building2, CheckCircle2 } from 'lucide-react';

export default function AdminBuyers() {
  useEffect(() => {
    actionLogin('admin');
  }, []);

  return (
    <AppShell role="admin" userName="Maharashtra Agri Admin">
      <DemoBanner />
      <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Platform Verified Buyer Registry</h1>
            <p className="text-sm text-gray-500 mt-1">
              Registered institutional buyers, processors, exporters &amp; retail hubs active in Maharashtra
            </p>
          </div>
          <Badge variant="verified" className="bg-emerald-100 text-emerald-900 border-emerald-300 font-bold text-xs px-3 py-1 w-fit">
            <Building2 className="h-3.5 w-3.5 mr-1" /> Platform Verified — Demo
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEMO_BUYERS.map((buyer) => (
            <Card key={buyer.id} className="overflow-hidden flex flex-col border border-emerald-100 shadow-sm">
              <CardHeader className="bg-emerald-50/40 pb-3 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center space-x-1.5 text-base font-bold text-gray-900">
                      <span>{buyer.name}</span>
                    </CardTitle>
                    <CardDescription className="flex items-center mt-1 text-xs text-gray-500">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-emerald-700" />
                      {buyer.location} ({buyer.distanceKm} km away)
                    </CardDescription>
                  </div>
                  <Badge variant="verified" className="bg-emerald-700 text-white font-bold text-[10px]">
                    Platform Verified — Demo
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 flex-1 space-y-4 text-xs">
                {/* Verification Indicators */}
                <div className="grid grid-cols-2 gap-1 text-[11px] text-gray-700 font-semibold bg-white p-2.5 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Business Identity
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> GST / FSSAI
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Bank Payout Account
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Verified Escrow
                  </div>
                </div>

                <div>
                  <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">Demand Requirements</h4>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-1">
                    <div className="flex justify-between items-center font-bold text-gray-900 text-xs">
                      <span>{buyer.cropsRequired.join(', ')}</span>
                      <span className="text-emerald-800">{formatNumber(buyer.quantityRequired)} kg</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-gray-500">
                      <span>Offered Price Range:</span>
                      <span className="font-bold text-emerald-700">
                        {formatCurrencyPerKg(buyer.priceMin)} - {formatCurrencyPerKg(buyer.priceMax)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-gray-50 p-2 rounded-xl border">
                    <span className="text-gray-500 text-[10px] block font-bold">Reliability</span>
                    <span className="font-extrabold text-emerald-800 text-xs flex items-center justify-center gap-0.5 mt-0.5">
                      <Star className="w-3 h-3 text-amber-500 fill-current" />
                      {buyer.reliabilityScore}%
                    </span>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-xl border">
                    <span className="text-gray-500 text-[10px] block font-bold">Avg Payout</span>
                    <span className="font-bold text-gray-900 text-xs mt-0.5 block">2.1 days</span>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-xl border">
                    <span className="text-gray-500 text-[10px] block font-bold">Completed</span>
                    <span className="font-bold text-gray-900 text-xs mt-0.5 block">128 txns</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
