"use client";

import { AppShell, DemoBanner } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ExternalLink, Layers } from "lucide-react";
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

const FARMER_REQUIREMENTS: RequirementItem[] = [
  {
    id: "REQ-01",
    title: "AGMARKNET Mandi Price Intelligence",
    category: "Price Discovery",
    status: "IMPLEMENTED",
    link: "/farmer/market",
    featureName: "Maharashtra APMC Price Intelligence",
    details: "Modal, min, and max price aggregation across APMC mandis in Maharashtra.",
  },
  {
    id: "REQ-03",
    title: "Quality Specifications & AI Grading",
    category: "Quality Management",
    status: "IMPLEMENTED",
    link: "/farmer/create-lot",
    featureName: "AI-Assisted Visual Quality Assessment",
    details: "Grade A/B/C visual quality self-assessment covering size, appearance, and defect thresholds.",
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
    title: "Farmer → Verified Buyer Matching",
    category: "Market Linkages",
    status: "IMPLEMENTED",
    link: "/farmer/recommendations",
    featureName: "Multi-Factor Recommendation Engine",
    details: "Scores and ranks buyers based on net realization, reliability, demand, and transport efficiency.",
  },
  {
    id: "REQ-10",
    title: "Digital Lot Creation",
    category: "Transaction Enablement",
    status: "IMPLEMENTED",
    link: "/farmer/create-lot",
    featureName: "Farmer Lot Management",
    details: "Creates structured crop lots with location, harvest date, deadline, and visual quality proof.",
  },
  {
    id: "REQ-11",
    title: "Digital Offer Response System",
    category: "Transaction Enablement",
    status: "IMPLEMENTED",
    link: "/farmer/offers",
    featureName: "Direct Buyer Digital Offer System",
    details: "Enables farmers to view incoming buyer quotes and Accept or Reject with instant transaction creation.",
  },
  {
    id: "REQ-12",
    title: "Logistics & Sale Tracking",
    category: "Logistics",
    status: "IMPLEMENTED",
    link: "/farmer/track",
    featureName: "Visual Delivery & Sale Tracking",
    details: "Tracks pickup location, destination, vehicle type, and scheduled pickup timestamps.",
  },
  {
    id: "REQ-15",
    title: "FPO Aggregation",
    category: "FPO Enablement",
    status: "IMPLEMENTED",
    link: "/farmer/fpo",
    featureName: "FPO Bulk Lot Pooling Dashboard",
    details: "Pools smallholder lots for institutional buyer matching and negotiation premiums.",
  },
];

export default function FarmerCoveragePage() {
  const statusBadges = {
    IMPLEMENTED: <Badge variant="success" className="font-bold">🟢 Implemented</Badge>,
    PROTOTYPE: <Badge variant="warning" className="font-bold">🟡 Active Feature</Badge>,
    FUTURE: <Badge variant="info" className="font-bold">🔵 Future Integration</Badge>,
  };

  return (
    <AppShell role="farmer" userName="Registered Farmer Profile">
      <DemoBanner />

      <div className="mx-auto max-w-5xl space-y-6 pb-12">
        <div className="bg-white p-6 rounded-2xl border border-emerald-200 shadow-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Badge variant="verified" className="bg-emerald-100 text-emerald-900 border-emerald-300 font-bold text-xs">
              FARMER PLATFORM CAPABILITIES
            </Badge>
            <span className="text-xs text-gray-500 font-semibold">
              AgriLink Farmer Matrix
            </span>
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900">
            Farmer Capabilities &amp; Verification Matrix
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            Overview of farmer-facing market intelligence, decision advisory, and selling tools active on AgriLink Maharashtra.
          </p>
        </div>

        <Card className="border border-gray-200">
          <CardHeader className="bg-emerald-50/50 pb-3">
            <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Layers className="h-5 w-5 text-emerald-700" />
              Farmer Workflows &amp; Feature Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-100/70 text-gray-600 uppercase font-bold border-b">
                  <tr>
                    <th className="px-4 py-3">Capability</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Farmer Feature</th>
                    <th className="px-4 py-3">Implementation Details</th>
                    <th className="px-4 py-3 text-center">Verify</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {FARMER_REQUIREMENTS.map((req) => (
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
                          Open <ExternalLink className="h-3 w-3" />
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
