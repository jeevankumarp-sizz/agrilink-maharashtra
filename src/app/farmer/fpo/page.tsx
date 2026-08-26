'use client'

import { AppShell, DemoBanner } from '@/components/layout/app-shell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { Users, Package, TrendingUp, Truck, CheckCircle2, ArrowRight } from 'lucide-react'

export default function FPOPage() {
  return (
    <AppShell role="farmer" userName="Ramesh Kumar">
      <DemoBanner />
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Kolar Tomato FPO</h1>
        <p className="text-gray-500">Farmer Producer Organisation - Aggregated Lot</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-emerald-600" />
              Member Contributions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Ramesh Kumar', qty: 2000, percent: 30.7 },
                { name: 'Suresh Reddy', qty: 1500, percent: 23.1 },
                { name: 'Lakshmi Devi', qty: 1200, percent: 18.5 },
                { name: 'Kumar Gowda', qty: 1800, percent: 27.7 },
              ].map((member) => (
                <div key={member.name}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium text-gray-700">{member.name}</span>
                    <span className="text-gray-500">{formatNumber(member.qty)} kg</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div 
                      className="h-full bg-emerald-500" 
                      style={{ width: `${member.percent}%` }}
                    />
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t border-gray-100 flex justify-between font-bold text-gray-900">
                <span>TOTAL AGGREGATED</span>
                <span>6,500 kg</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                Buyer Requirement Match
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-100">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium text-emerald-900">Karnataka Food Corp</span>
                  <Badge variant="verified">MATCH FOUND</Badge>
                </div>
                <p className="text-sm text-emerald-700 mb-2">Requires 6,000 kg Tomato</p>
                <p className="text-xs text-emerald-600 bg-white p-2 rounded-lg border border-emerald-100">
                  AI Match: FPO can fulfill 100% of buyer requirement (6,500 kg available vs 6,000 kg needed)
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
                Aggregation Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="rounded-full bg-green-100 p-1.5 mt-0.5">
                    <TrendingUp className="h-4 w-4 text-green-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Better negotiation power</p>
                    <p className="text-xs text-green-600">+₹1.20/kg premium rate</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="rounded-full bg-blue-100 p-1.5 mt-0.5">
                    <Truck className="h-4 w-4 text-blue-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Shared transport</p>
                    <p className="text-xs text-blue-600">-18% logistics cost</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="rounded-full bg-purple-100 p-1.5 mt-0.5">
                    <Package className="h-4 w-4 text-purple-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Bulk quality grading</p>
                    <p className="text-xs text-purple-600">Free (waived for FPO)</p>
                  </div>
                </li>
              </ul>
              
              <div className="mt-4 rounded-xl bg-gray-50 p-4 border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Combined lot value</p>
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(195000)}</p>
                </div>
                <Button onClick={() => alert("Creating aggregated lot...")} className="bg-emerald-600 hover:bg-emerald-700">
                  Create Aggregated Lot
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <p className="mt-8 text-center text-xs text-gray-400">
        Demo FPO data for demonstration purposes
      </p>
    </AppShell>
  )
}
