'use client'

import { AppShell, DemoBanner } from '@/components/layout/app-shell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { Package, CheckCircle2, Sparkles, MapPin } from 'lucide-react'

export default function BuyerAggregatePage() {
  return (
    <AppShell role="buyer" userName="FreshFoods Pvt Ltd">
      <DemoBanner />
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">AI Lot Aggregation</h1>
        <p className="text-gray-500">Combine multiple farmer lots to fulfill your requirement</p>
      </div>

      <Card className="mb-6 border-blue-100 bg-blue-50/30">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Your Requirement</p>
              <h3 className="text-xl font-bold text-gray-900 mt-1">6,000 kg Grade A/B Tomato</h3>
            </div>
            <Badge variant="info">FreshFoods Pvt Ltd</Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-7 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Package className="h-5 w-5 text-gray-400" />
            Available Lots
          </h2>
          
          {[
            { id: 'A', name: 'Ramesh Kumar', qty: 2000, grade: 'Grade A', loc: 'Kolar', price: 31 },
            { id: 'B', name: 'Suresh Reddy', qty: 1500, grade: 'Grade A', loc: 'Chintamani', price: 30 },
            { id: 'C', name: 'Kumar Gowda', qty: 2500, grade: 'Grade B', loc: 'Mulbagal', price: 28 },
          ].map((lot) => (
            <Card key={lot.id} className="border-emerald-100 bg-white">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-900">Lot {lot.id}</span>
                      <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100">
                        {lot.grade}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-gray-700">{lot.name}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <MapPin className="h-3 w-3" />
                      {lot.loc}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{formatNumber(lot.qty)} kg</p>
                    <p className="text-sm font-medium text-emerald-600">{formatCurrency(lot.price)}/kg</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="md:col-span-5">
          <Card className="sticky top-24 border-emerald-200 shadow-sm">
            <CardHeader className="bg-emerald-50/50 pb-4 border-b border-emerald-100">
              <CardTitle className="flex items-center gap-2 text-lg text-emerald-900">
                <Sparkles className="h-5 w-5 text-emerald-600" />
                AI Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-100">
                  <p className="text-sm font-medium text-emerald-900 mb-2">
                    Combine Lots A + B + C to fulfill 100% of buyer demand (6,000 kg)
                  </p>
                  <div className="space-y-2 mt-4">
                    <div className="flex items-center gap-2 text-sm text-emerald-700">
                      <CheckCircle2 className="h-4 w-4" /> Lot A (2,000 kg)
                    </div>
                    <div className="flex items-center gap-2 text-sm text-emerald-700">
                      <CheckCircle2 className="h-4 w-4" /> Lot B (1,500 kg)
                    </div>
                    <div className="flex items-center gap-2 text-sm text-emerald-700">
                      <CheckCircle2 className="h-4 w-4" /> Lot C (2,500 kg)
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Total Quantity</span>
                    <span className="font-medium text-gray-900">6,000 kg</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Average Price</span>
                    <span className="font-medium text-gray-900">{formatCurrency(29.83)}/kg</span>
                  </div>
                  <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                    <span className="font-medium text-gray-700">Total Cost</span>
                    <span className="text-xl font-bold text-gray-900">{formatCurrency(179000)}</span>
                  </div>
                </div>

                <Button className="w-full" size="lg" onClick={() => alert('Creating PO...')}>
                  Create Combined Purchase Order
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
