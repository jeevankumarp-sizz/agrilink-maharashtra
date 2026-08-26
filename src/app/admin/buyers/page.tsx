"use client";

import React, { useEffect } from 'react';
import { AppShell, DemoBanner } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DEMO_BUYERS } from '@/lib/demo-data';
import { formatCurrencyPerKg, formatNumber } from '@/lib/utils';
import { actionLogin } from '@/actions/agri-actions';
import { MapPin, ShieldCheck, Star } from 'lucide-react';

export default function AdminBuyers() {
  useEffect(() => {
    actionLogin('admin');
  }, []);

  return (
    <AppShell role="admin" userName="AgriLink Admin">
      <DemoBanner />
      <div className="p-4 md:p-8 space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Registered Buyers</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEMO_BUYERS.map((buyer) => (
            <Card key={buyer.id} className="overflow-hidden flex flex-col border border-emerald-100">
              <CardHeader className="bg-gray-50/50 pb-4 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center space-x-2 text-base font-bold">
                      <span>{buyer.name}</span>
                      {buyer.verified && <ShieldCheck className="w-4 h-4 text-emerald-600" />}
                    </CardTitle>
                    <CardDescription className="flex items-center mt-1 text-xs">
                      <MapPin className="w-3 h-3 mr-1" />
                      {buyer.location} ({buyer.distanceKm} km)
                    </CardDescription>
                  </div>
                  <Badge variant="default">{buyer.buyerType}</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 flex-1 space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Requirements</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm bg-gray-50 p-2.5 rounded-xl">
                      <span className="font-medium text-gray-900">{buyer.cropsRequired.join(', ')}</span>
                      <div className="text-right">
                        <div className="text-gray-900 font-semibold">{formatNumber(buyer.quantityRequired)} kg</div>
                        <div className="text-xs text-emerald-700">
                          {formatCurrencyPerKg(buyer.priceMin)} - {formatCurrencyPerKg(buyer.priceMax)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2 border-t flex justify-between text-sm">
                  <div>
                    <span className="text-gray-500 text-xs block">Reliability</span>
                    <div className="flex items-center font-medium text-gray-900">
                      <Star className="w-3.5 h-3.5 text-amber-400 mr-1 fill-current" />
                      {buyer.reliabilityScore}%
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs block">Quality Reqs</span>
                    <Badge variant="verified" className="mt-1">{buyer.qualityRequirements.join(', ')}</Badge>
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
