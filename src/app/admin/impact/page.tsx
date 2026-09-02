"use client";

import { AppShell, DemoBanner } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, CheckCircle2, ShieldAlert, TrendingUp, Users } from "lucide-react";

export default function ImpactPage() {
  const metrics = [
    { label: "Estimated Potential Price Improvement", value: "+12.6%", subtext: "Calculated potential net realization improvement", color: "border-emerald-500 bg-emerald-50/50 text-emerald-950" },
    { label: "Estimated Transport Cost Savings", value: "−18.4%", subtext: "Shared transport & route optimization potential", color: "border-blue-500 bg-blue-50/50 text-blue-950" },
    { label: "Estimated Discovery Time Reduction", value: "−31%", subtext: "Average automated buyer matching within 4 hours", color: "border-purple-500 bg-purple-50/50 text-purple-950" },
    { label: "Matched Lots Success Rate", value: "86.4%", subtext: "Across Nashik, Pune & Nagpur operational APMC zones", color: "border-teal-500 bg-teal-50/50 text-teal-950" },
    { label: "Estimated Post-Harvest Loss Reduction", value: "14.2%", subtext: "Reduced transit time & storage waste potential", color: "border-amber-500 bg-amber-50/50 text-amber-950" },
    { label: "Estimated FPO Aggregation Uplift", value: "+₹1.20/kg", subtext: "Bulk negotiation potential price premium", color: "border-emerald-500 bg-emerald-50/50 text-emerald-950" },
  ];

  return (
    <AppShell role="admin" userName="AgriLink Admin Center">
      <DemoBanner />

      <div className="mx-auto max-w-5xl space-y-6 pb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-emerald-100 shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="verified" className="bg-emerald-100 text-emerald-900 border-emerald-300 font-bold">
                ESTIMATED POTENTIAL METRICS
              </Badge>
              <span className="text-xs text-gray-500">AgriLink Market Intelligence Analytical Model</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">AgriLink Impact Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">
              Projected agricultural market efficiency, farmer realization &amp; post-harvest loss reduction
            </p>
          </div>
        </div>

        {/* Provenance & Methodology Disclaimer */}
        <div className="rounded-xl border border-emerald-300 bg-emerald-50/80 p-4 text-xs text-emerald-950 flex items-center gap-2.5">
          <ShieldAlert className="h-5 w-5 shrink-0 text-emerald-700" />
          <div>
            <strong>Analytical Estimation Note:</strong> All metrics displayed below represent model estimations calculated from regional market feeds (Nashik, Pune, Nagpur, Solapur, Sangli, Ahilyanagar). These are analytical projections, not statutory guarantees.
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((m) => (
            <div key={m.label} className={`rounded-2xl border-2 p-5 space-y-2 shadow-xs ${m.color}`}>
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">{m.label}</p>
              <p className="text-3xl font-extrabold">{m.value}</p>
              <p className="text-xs opacity-80">{m.subtext}</p>
            </div>
          ))}
        </div>

        {/* Before vs After Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-emerald-700" />
              Traditional Mandi Process vs AgriLink Platform Model
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3">Key Metric</th>
                    <th className="px-4 py-3">Traditional Mandi Process</th>
                    <th className="px-4 py-3">AgriLink Platform</th>
                    <th className="px-4 py-3">Estimated Benefit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-bold text-gray-900">Price Realization</td>
                    <td className="px-4 py-3 text-gray-600">Single mandi quote without net cost view</td>
                    <td className="px-4 py-3 font-semibold text-emerald-800">Net realization ranking across APMCs &amp; buyers</td>
                    <td className="px-4 py-3 font-bold text-emerald-700">+12.6% Est. Realization</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-bold text-gray-900">Logistics &amp; Transport</td>
                    <td className="px-4 py-3 text-gray-600">Uncoordinated individual transit</td>
                    <td className="px-4 py-3 font-semibold text-emerald-800">Shared truck pools &amp; distance-cost optimization</td>
                    <td className="px-4 py-3 font-bold text-emerald-700">−18.4% Est. Cost</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-bold text-gray-900">Buyer Discovery</td>
                    <td className="px-4 py-3 text-gray-600">Manual agent inquiry (1-2 days)</td>
                    <td className="px-4 py-3 font-semibold text-emerald-800">Verified institutional buyers &amp; processors</td>
                    <td className="px-4 py-3 font-bold text-emerald-700">−31% Discovery Time</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-bold text-gray-900">Post-Harvest Loss</td>
                    <td className="px-4 py-3 text-gray-600">Perishability loss during delay</td>
                    <td className="px-4 py-3 font-semibold text-emerald-800">Sale-window AI recommendation (24-48 hrs)</td>
                    <td className="px-4 py-3 font-bold text-emerald-700">14.2% Less Est. Loss</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
