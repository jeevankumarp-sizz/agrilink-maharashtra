"use client";

import { AppShell, DemoBanner } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ExternalLink, Layers, ShoppingCart } from "lucide-react";
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

const BUYER_REQUIREMENTS: RequirementItem[] = [
  {
    id: "REQ-02",
    title: "Buyer Demand & Volume Aggregation",
    category: "Demand Discovery",
    status: "IMPLEMENTED",
    link: "/buyer/aggregate",
    featureName: "AI Lot Aggregation Engine",
    details: "Aggregates commercial buyer volume requirements (e.g. 6,000 kg Tomato) across smallholder lots.",
  },
  {
    id: "REQ-03",
    title: "Quality Specifications & Grading Inspection",
    category: "Quality Management",
    status: "PROTOTYPE",
    link: "/buyer/lots",
    featureName: "Grade A/B/C Procurement Filtering",
    details: "Allows buyers to filter available produce lots by standardized quality grades.",
  },
  {
    id: "REQ-11",
    title: "Digital Offer Creation",
    category: "Transaction Enablement",
    status: "IMPLEMENTED",
    link: "/buyer/lots",
    featureName: "Digital Bidding & Purchasing Terms",
    details: "Enables buyers to submit quotes with custom payment terms and pickup schedules.",
  },
  {
    id: "REQ-12",
    title: "Procurement Logistics Coordination",
    category: "Logistics",
    status: "PROTOTYPE",
    link: "/buyer/procurement",
    featureName: "Procurement Order Tracking",
    details: "Tracks pickup location, destination, vehicle type, and scheduled pickup timestamps.",
  },
  {
    id: "REQ-13",
    title: "Payment Payout Lifecycle",
    category: "Financial Settlement",
    status: "PROTOTYPE",
    link: "/buyer/transactions",
    featureName: "Buyer Purchases & Escrow View",
    details: "Tracks status from Offer Accepted -> Pickup -> Delivered -> Payment Processing -> Paid.",
  },
];

export default function BuyerCoveragePage() {
  const statusBadges = {
    IMPLEMENTED: <Badge variant="success" className="font-bold">🟢 Implemented</Badge>,
    PROTOTYPE: <Badge variant="warning" className="font-bold">🟡 Prototype / Demo</Badge>,
    FUTURE: <Badge variant="info" className="font-bold">🔵 Future Integration</Badge>,
  };

  return (
    <AppShell role="buyer" userName="FreshFoods Maharashtra — Demo Buyer">
      <DemoBanner />

      <div className="mx-auto max-w-5xl space-y-6 pb-12">
        <div className="bg-white p-6 rounded-2xl border border-blue-200 shadow-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Badge variant="verified" className="bg-blue-100 text-blue-900 border-blue-300 font-bold text-xs">
              BUYER SIH COVERAGE MATRIX
            </Badge>
            <span className="text-xs text-gray-500 font-semibold">
              SIH 2026 PS 26132 Prototype
            </span>
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900">
            Buyer Problem Statement Requirement Coverage
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            Verification matrix mapping buyer-facing procurement features to official SIH26132 problem statement requirements.
          </p>
        </div>

        <Card className="border border-gray-200">
          <CardHeader className="bg-blue-50/50 pb-3">
            <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-blue-700" />
              Buyer Procurement Workflows &amp; Feature Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-100/70 text-gray-600 uppercase font-bold border-b">
                  <tr>
                    <th className="px-4 py-3">PS Requirement</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Buyer Feature</th>
                    <th className="px-4 py-3">Implementation Details</th>
                    <th className="px-4 py-3 text-center">Verify</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {BUYER_REQUIREMENTS.map((req) => (
                    <tr key={req.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-4 py-3.5 font-bold text-gray-900 max-w-[200px]">
                        <div>{req.title}</div>
                        <span className="text-[10px] text-gray-400 font-normal">{req.category}</span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {statusBadges[req.status]}
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-blue-900 max-w-[180px]">
                        {req.featureName}
                      </td>
                      <td className="px-4 py-3.5 text-gray-600 max-w-[260px] leading-relaxed">
                        {req.details}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <Link
                          href={req.link}
                          className="inline-flex items-center gap-1 font-bold text-blue-700 hover:text-blue-900 hover:underline"
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
