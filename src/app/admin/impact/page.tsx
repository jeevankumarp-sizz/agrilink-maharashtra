'use client'

import { AppShell } from '@/components/layout/app-shell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Truck, Clock, CheckCircle2, Leaf, Shield } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const chartData = [
  { name: 'Price Discovery', before: 40, after: 85 },
  { name: 'Buyer Matching', before: 30, after: 90 },
  { name: 'Cost Visibility', before: 20, after: 100 },
  { name: 'Logistics', before: 50, after: 85 },
]

export default function ImpactPage() {
  return (
    <AppShell role="admin" userName="AgriLink Admin">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">AgriLink Impact Dashboard</h1>
        <p className="text-gray-500">Estimated platform impact metrics</p>
      </div>

      <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 font-medium">
        Demo / estimated impact metrics — not validated real-world data
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Additional Farmer Realization</p>
                <h3 className="text-2xl font-bold text-emerald-700">₹8.4L</h3>
              </div>
              <div className="rounded-xl bg-emerald-100 p-2 text-emerald-600">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-[75%]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Price Realization</p>
                <h3 className="text-2xl font-bold text-emerald-700">+12.6%</h3>
              </div>
              <div className="rounded-xl bg-emerald-100 p-2 text-emerald-600">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-[60%]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Logistics Cost</p>
                <h3 className="text-2xl font-bold text-blue-700">−18%</h3>
              </div>
              <div className="rounded-xl bg-blue-100 p-2 text-blue-600">
                <Truck className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 w-[45%]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Discovery Time</p>
                <h3 className="text-2xl font-bold text-blue-700">−31%</h3>
              </div>
              <div className="rounded-xl bg-blue-100 p-2 text-blue-600">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 w-[80%]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Lots Matched</p>
                <h3 className="text-2xl font-bold text-emerald-700">86%</h3>
              </div>
              <div className="rounded-xl bg-emerald-100 p-2 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-[86%]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Post-harvest Loss</p>
                <h3 className="text-2xl font-bold text-amber-600">−14.2%</h3>
              </div>
              <div className="rounded-xl bg-amber-100 p-2 text-amber-600">
                <Leaf className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 w-[35%]" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card className="overflow-hidden">
          <CardHeader className="bg-gray-50/50 border-b border-gray-100">
            <CardTitle className="text-lg">Before vs After AgriLink</CardTitle>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 font-medium">Metric</th>
                  <th className="px-4 py-3 font-medium">Before</th>
                  <th className="px-4 py-3 font-medium">After</th>
                  <th className="px-4 py-3 font-medium">Improvement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-900">Price discovery</td>
                  <td className="px-4 py-3 text-gray-500">Manual mandi visit</td>
                  <td className="px-4 py-3 text-gray-900">AI-powered multi-channel</td>
                  <td className="px-4 py-3 text-emerald-600 font-medium">+12.6% realization</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-900">Buyer finding</td>
                  <td className="px-4 py-3 text-gray-500">Word of mouth</td>
                  <td className="px-4 py-3 text-gray-900">Verified buyer matching</td>
                  <td className="px-4 py-3 text-emerald-600 font-medium">-31% discovery time</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-900">Cost visibility</td>
                  <td className="px-4 py-3 text-gray-500">Unknown until sale</td>
                  <td className="px-4 py-3 text-gray-900">Upfront net realization</td>
                  <td className="px-4 py-3 text-emerald-600 font-medium">Full transparency</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-900">Transport</td>
                  <td className="px-4 py-3 text-gray-500">Unoptimized</td>
                  <td className="px-4 py-3 text-gray-900">Route + cost optimized</td>
                  <td className="px-4 py-3 text-emerald-600 font-medium">-18% logistics</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-900">Quality grading</td>
                  <td className="px-4 py-3 text-gray-500">Subjective</td>
                  <td className="px-4 py-3 text-gray-900">Standardized grades</td>
                  <td className="px-4 py-3 text-emerald-600 font-medium">Premium pricing</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-900">Dispute resolution</td>
                  <td className="px-4 py-3 text-gray-500">No recourse</td>
                  <td className="px-4 py-3 text-gray-900">Digital grievance system</td>
                  <td className="px-4 py-3 text-emerald-600 font-medium">Full tracking</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Efficiency Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{ fill: '#f9fafb' }}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="before" name="Before AgriLink" fill="#9ca3af" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="after" name="With AgriLink" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5 text-emerald-600" />
            Path to National Scale
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative border-l border-gray-200 ml-3 space-y-6 pb-2">
            <div className="relative pl-6">
              <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-emerald-50"></div>
              <h4 className="font-semibold text-gray-900 text-sm">Current pilot: Karnataka</h4>
              <p className="text-sm text-gray-500 mt-1">3 crops, 10 markets, 18 buyers actively trading on platform</p>
            </div>
            <div className="relative pl-6">
              <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-gray-300"></div>
              <h4 className="font-semibold text-gray-900 text-sm">Phase 2: South India</h4>
              <p className="text-sm text-gray-500 mt-1">Expansion to 10 states focusing on horticulture value chains</p>
            </div>
            <div className="relative pl-6">
              <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-gray-300"></div>
              <h4 className="font-semibold text-gray-900 text-sm">Phase 3: Pan-India</h4>
              <p className="text-sm text-gray-500 mt-1">Integration with eNAM, open protocols (ONDC) and national commodity boards</p>
            </div>
            <div className="relative pl-6">
              <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-gray-300"></div>
              <h4 className="font-semibold text-gray-900 text-sm">Phase 4: Full ecosystem</h4>
              <p className="text-sm text-gray-500 mt-1">Integrated credit matching, micro-insurance, and climate advisory</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  )
}
