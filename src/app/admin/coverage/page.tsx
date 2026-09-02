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
  status: "IMPLEMENTED" | "ACTIVE" | "FUTURE";
  link: string;
  featureName: string;
  details: string;
}

const ADMIN_REQUIREMENTS: RequirementItem[] = [
  {
    id: "REQ-01",
    title: "AGMARKNET Mandi Price Intelligence",
    category: "Price Discovery",
    status: "IMPLEMENTED",
    link: "/admin/markets",
    featureName: "State Market Intelligence Monitor",
    details: "Modal, min, and max price aggregation across APMC mandis in Maharashtra.",
  },
  {
    id: "REQ-04",
    title: "Arrival Volumes & Supply Alerts",
    category: "Market Signals",
    status: "IMPLEMENTED",
    link: "/admin",
    featureName: "State Market Command Map & Alerts",
    details: "Monitors daily arrival volumes and triggers anomaly alerts during supply spikes.",
  },
  {
    id: "REQ-09",
    title: "Verified Buyer Registry",
    category: "Market Linkages",
    status: "IMPLEMENTED",
    link: "/admin/buyers",
    featureName: "Platform Verified Buyer Registry",
    details: "Audit registry of commercial buyers, processors, and exporters with reliability scores.",
  },
  {
    id: "REQ-13",
    title: "Transparent Transaction Records",
    category: "Financial Settlement",
    status: "IMPLEMENTED",
    link: "/admin/transactions",
    featureName: "State Audit Ledger",
    details: "Complete audit trail of all accepted offers, buyer reliability scores, and net payouts.",
  },
  {
    id: "REQ-14",
    title: "Dispute / Grievance Resolution Workflow",
    category: "Governance & Trust",
    status: "IMPLEMENTED",
    link: "/admin/grievances",
    featureName: "Farmer Grievance Center",
    details: "Allows farmers to log payment delay disputes with category classification and resolution status.",
  },
  {
    id: "REQ-15",
    title: "FPO Aggregation Insights",
    category: "FPO Enablement",
    status: "IMPLEMENTED",
    link: "/admin/fpo",
    featureName: "State FPO Insights & Performance Dashboard",
    details: "Monitors smallholder aggregation performance and FPO commercial contract matching.",
  },
  {
    id: "REQ-16",
    title: "Impact Monitoring",
    category: "Ecosystem Impact",
    status: "IMPLEMENTED",
    link: "/admin/impact",
    featureName: "AgriLink State Impact Dashboard",
    details: "Estimated price realization improvement, post-harvest loss reduction, and logistics savings.",
  },
];

export default function AdminCoveragePage() {
  const statusBadges = {
    IMPLEMENTED: <Badge variant="success" className="font-bold">🟢 Implemented</Badge>,
    ACTIVE: <Badge variant="warning" className="font-bold">🟡 Active Feature</Badge>,
    FUTURE: <Badge variant="info" className="font-bold">🔵 Future Integration</Badge>,
  };

  return (
    <AppShell role="admin" userName="AgriLink Admin Center">
      <DemoBanner />

      <div className="mx-auto max-w-5xl space-y-6 pb-12">
        <div className="bg-white p-6 rounded-2xl border border-purple-200 shadow-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Badge variant="verified" className="bg-purple-100 text-purple-900 border-purple-300 font-bold text-xs">
              STATE COMMAND AUDIT MATRIX
            </Badge>
            <span className="text-xs text-gray-500 font-semibold">
              AgriLink State Governance Matrix
            </span>
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900">
            State Command Center Verification Matrix
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            Audit checklist mapping state monitoring capabilities, buyer registries, and grievance workflows to implemented AgriLink platform features.
          </p>
        </div>

        <Card className="border border-gray-200">
          <CardHeader className="bg-purple-50/50 pb-3">
            <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-purple-700" />
              State Governance Modules &amp; Feature Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-100/70 text-gray-600 uppercase font-bold border-b">
                  <tr>
                    <th className="px-4 py-3">Capability</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Government Module</th>
                    <th className="px-4 py-3">Implementation Details</th>
                    <th className="px-4 py-3 text-center">Verify</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {ADMIN_REQUIREMENTS.map((req) => (
                    <tr key={req.id} className="hover:bg-purple-50/30 transition-colors">
                      <td className="px-4 py-3.5 font-bold text-gray-900 max-w-[200px]">
                        <div>{req.title}</div>
                        <span className="text-[10px] text-gray-400 font-normal">{req.category}</span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {statusBadges[req.status]}
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-purple-900 max-w-[180px]">
                        {req.featureName}
                      </td>
                      <td className="px-4 py-3.5 text-gray-600 max-w-[260px] leading-relaxed">
                        {req.details}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <Link
                          href={req.link}
                          className="inline-flex items-center gap-1 font-bold text-purple-700 hover:text-purple-900 hover:underline"
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
