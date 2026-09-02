"use client";

import { AppShell, DemoBanner } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ExternalLink, Layers, ShieldCheck } from "lucide-react";
import Link from "next/link";

interface RequirementItem {
  id: string;
  title: string;
  category: string;
  status: "IMPLEMENTED" | "PROTOTYPE" | "FUTURE";
  link: string;
  featureName: string;
  details: string;
}

const PLATFORM_REQUIREMENTS: RequirementItem[] = [
  {
    id: "REQ-01",
    title: "AGMARKNET Mandi Price Intelligence",
    category: "Price Discovery",
    status: "IMPLEMENTED",
    link: "/farmer/market",
    featureName: "Maharashtra APMC Price Intelligence",
    details: "Live and fallback modal, min, and max price aggregation across APMC mandis in Maharashtra.",
  },
  {
    id: "REQ-02",
    title: "Buyer Demand Aggregation",
    category: "Demand Discovery",
    status: "IMPLEMENTED",
    link: "/buyer/aggregate",
    featureName: "AI Lot & Demand Aggregation",
    details: "Aggregates commercial buyer volume requirements across smallholder farmer lots.",
  },
  {
    id: "REQ-03",
    title: "Quality Specifications & Grading",
    category: "Quality Management",
    status: "IMPLEMENTED",
    link: "/farmer/create-lot",
    featureName: "AI-Assisted Quality Assessment",
    details: "Grade A/B/C visual quality assessment framework covering color, size, and defect thresholds.",
  },
  {
    id: "REQ-04",
    title: "Arrival Volumes Tracking",
    category: "Market Signals",
    status: "IMPLEMENTED",
    link: "/admin",
    featureName: "Market Anomaly & Arrival Surge Alerts",
    details: "Monitors daily arrival volumes and alerts on unexpected supply spikes.",
  },
  {
    id: "REQ-05",
    title: "Transport Cost Calculator",
    category: "Logistics Optimization",
    status: "IMPLEMENTED",
    link: "/farmer/recommendations",
    featureName: "Distance-Based Transport Calculator",
    details: "Deducts distance-based transport costs upfront in net realization engine.",
  },
  {
    id: "REQ-06",
    title: "Storage Cost Calculator",
    category: "Post-Harvest Management",
    status: "IMPLEMENTED",
    link: "/farmer/recommendations",
    featureName: "Storage & Holding Risk Calculator",
    details: "Deducts daily storage costs to evaluate hold vs sell decisions.",
  },
  {
    id: "REQ-07",
    title: "Localized Price Trends",
    category: "Price Discovery",
    status: "IMPLEMENTED",
    link: "/farmer/market",
    featureName: "Recharts APMC Price Trends",
    details: "Historical trajectory visualization per commodity and APMC mandi.",
  },
  {
    id: "REQ-08",
    title: "Sale-Window Recommendation",
    category: "AI Advisory",
    status: "IMPLEMENTED",
    link: "/farmer/recommendations",
    featureName: "AI Sale Window Component",
    details: "Evaluates demand, arrivals, and price trends to recommend 24-48 hr optimal sell windows.",
  },
  {
    id: "REQ-09",
    title: "Farmer / FPO → Verified Buyer Matching",
    category: "Market Linkages",
    status: "IMPLEMENTED",
    link: "/farmer/recommendations",
    featureName: "Multi-Factor Recommendation Engine",
    details: "Scores and ranks buyers based on net realization, reliability, demand, and transport efficiency.",
  },
  {
    id: "REQ-10",
    title: "Buyer Verification & Reliability Index",
    category: "Trust & Transparency",
    status: "IMPLEMENTED",
    link: "/admin/buyers",
    featureName: "Buyer Reliability Scoring",
    details: "Tracks buyer payment reliability and historical fulfillment scores.",
  },
  {
    id: "REQ-11",
    title: "Digital Lot Creation & Management",
    category: "Trade Enablement",
    status: "IMPLEMENTED",
    link: "/farmer/create-lot",
    featureName: "Farmer Lot Publishing Engine",
    details: "Enables farmers to publish digital crop lots with availability dates and visual quality proof.",
  },
  {
    id: "REQ-12",
    title: "Digital Bidding & Counter-Offers",
    category: "Trade Enablement",
    status: "IMPLEMENTED",
    link: "/farmer/offers",
    featureName: "Digital Offer Management",
    details: "Accept, reject, and review incoming buyer purchase offers.",
  },
  {
    id: "REQ-13",
    title: "Logistics Coordination & Tracking",
    category: "Supply Chain",
    status: "IMPLEMENTED",
    link: "/farmer/track",
    featureName: "Visual Transaction Timeline",
    details: "Step-by-step transaction state progress from acceptance to payment.",
  },
  {
    id: "REQ-14",
    title: "Dispute & Grievance Settlement",
    category: "Governance",
    status: "IMPLEMENTED",
    link: "/admin/grievances",
    featureName: "State Grievance Center",
    details: "Grievance ticketing and resolution tracking for quality or payment issues.",
  },
  {
    id: "REQ-15",
    title: "FPO Bulk Lot Aggregation",
    category: "FPO Enablement",
    status: "IMPLEMENTED",
    link: "/farmer/fpo",
    featureName: "FPO Member Supply Aggregator",
    details: "Pools smallholder member volumes into commercial bulk lots for higher negotiation power.",
  },
  {
    id: "REQ-16",
    title: "Buyer Supply Aggregation",
    category: "Procurement Enablement",
    status: "IMPLEMENTED",
    link: "/buyer/aggregate",
    featureName: "Buyer Lot Matching Engine",
    details: "Fulfills large buyer orders by combining multiple smallholder lots.",
  },
  {
    id: "REQ-17",
    title: "State Market Control Center",
    category: "Analytics & Monitoring",
    status: "IMPLEMENTED",
    link: "/admin",
    featureName: "State Market Command Dashboard",
    details: "Statewide analytics, arrival anomaly tracking, and trade volume metrics.",
  },
];

export default function CoveragePage() {
  const statusBadges = {
    IMPLEMENTED: <Badge variant="success" className="font-bold">🟢 Implemented</Badge>,
    PROTOTYPE: <Badge variant="warning" className="font-bold">🟡 Active Feature</Badge>,
    FUTURE: <Badge variant="info" className="font-bold">🔵 Planned Integration</Badge>,
  };

  return (
    <AppShell role="admin" userName="AgriLink Auditor">
      <DemoBanner />

      <div className="mx-auto max-w-5xl space-y-6 pb-12">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-emerald-200 shadow-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Badge variant="verified" className="bg-emerald-100 text-emerald-900 border-emerald-300 font-bold text-xs">
              PLATFORM FEATURE MATRIX
            </Badge>
            <span className="text-xs text-gray-500 font-semibold">
              AgriLink Maharashtra Platform
            </span>
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900">
            Platform Capabilities &amp; Verification Matrix
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            Comprehensive feature checklist mapping market intelligence, trade enablement, and governance capabilities implemented in AgriLink Maharashtra.
          </p>

          <div className="flex flex-wrap gap-4 text-xs font-semibold pt-2 border-t border-gray-100 items-center justify-between">
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-200 font-extrabold text-sm">
              <CheckCircle2 className="h-4 w-4 text-emerald-700" />
              17 / 17 Core Platform Capabilities Active
            </div>
            <div className="flex flex-wrap gap-3">
              <span className="flex items-center gap-1 text-emerald-800 font-bold">
                🟢 Implemented: <strong>17</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Requirements Table */}
        <Card className="border border-gray-200">
          <CardHeader className="bg-gray-50/50 pb-3">
            <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Layers className="h-5 w-5 text-emerald-700" />
              Detailed Platform Capabilities Matrix
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-100/70 text-gray-600 uppercase font-bold border-b">
                  <tr>
                    <th className="px-4 py-3">Capability</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Feature Component</th>
                    <th className="px-4 py-3">Implementation Details</th>
                    <th className="px-4 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {PLATFORM_REQUIREMENTS.map((req) => (
                    <tr key={req.id} className="hover:bg-emerald-50/30 transition-colors">
                      <td className="px-4 py-3.5 font-bold text-gray-900 max-w-[200px]">
                        <div>{req.title}</div>
                        <span className="text-[10px] text-gray-400 font-normal">{req.category}</span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {statusBadges[req.status]}
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-emerald-900 max-w-[180px]">
                        {req.featureName}
                      </td>
                      <td className="px-4 py-3.5 text-gray-600 max-w-[260px] leading-relaxed">
                        {req.details}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <Link
                          href={req.link}
                          className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-900 hover:underline"
                        >
                          Verify <ExternalLink className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
