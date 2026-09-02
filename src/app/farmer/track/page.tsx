"use client";

import { useEffect, useState } from "react";
import { AppShell, DemoBanner, LoadingSpinner, EmptyState } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { actionLogin, actionGetFarmerDashboard, actionAdvanceTransaction } from "@/actions/agri-actions";
import type { Transaction, Lot } from "@/lib/types";
import { CheckCircle2, Clock, MapPin, RefreshCw, ShieldCheck, Sparkles, Eye, Truck, Phone, UserCheck, Calendar } from "lucide-react";
import Link from "next/link";
import { TransactionTimeline } from "@/components/agri/transaction-timeline";
import { QualityVerificationModal } from "@/components/agri/quality-verification-modal";

export default function FarmerTrackSalePage() {
  const [loading, setLoading] = useState(true);
  const [advancing, setAdvancing] = useState(false);
  const [qualityModalOpen, setQualityModalOpen] = useState(false);
  const [data, setData] = useState<{
    lots: Lot[];
    transactions: Transaction[];
  }>({ lots: [], transactions: [] });

  const loadData = async () => {
    await actionLogin("farmer");
    const res = await actionGetFarmerDashboard();
    setData({
      lots: res.lots || [],
      transactions: res.transactions || [],
    });
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdvance = async (txId: string) => {
    setAdvancing(true);
    try {
      await actionAdvanceTransaction(txId);
      await loadData();
    } finally {
      setAdvancing(false);
    }
  };

  if (loading) {
    return (
      <AppShell role="farmer" userName="Registered Farmer Profile">
        <DemoBanner />
        <div className="mx-auto max-w-4xl space-y-6 pb-12">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Track My Sale &amp; Payout</h1>
            <p className="text-sm text-gray-500 mt-1">Loading delivery progress...</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-5 animate-pulse">
            <div className="flex justify-between">
              <div className="h-5 bg-gray-200 rounded w-1/3" />
              <div className="h-5 bg-emerald-100 rounded w-1/4" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="space-y-2 bg-gray-50 p-4 rounded-xl">
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                  <div className="h-5 bg-gray-200 rounded w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  const activeTxn = data.transactions[0];
  const lot = data.lots.find((l) => l.id === activeTxn?.lotId) ?? data.lots[0];
  const hasQuality = lot?.qualityAssessmentStatus === "AVAILABLE" || lot?.qualityScore;

  return (
    <AppShell role="farmer" userName="Registered Farmer Profile">
      <DemoBanner />

      <div className="mx-auto max-w-4xl space-y-6 pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Track My Sale &amp; Payout</h1>
            <p className="text-sm text-gray-600 mt-1">
              Real-time delivery progress, pickup schedule &amp; escrow payment clearance
            </p>
          </div>
          <Badge variant="verified" className="bg-emerald-100 text-emerald-900 border-emerald-300 font-bold text-xs px-3 py-1 w-fit">
            <Truck className="h-3.5 w-3.5 mr-1" /> Active Logistics Tracking
          </Badge>
        </div>

        {!activeTxn ? (
          <EmptyState
            title="No active sale transactions"
            description="You don't have any accepted offers currently undergoing pickup or payment clearance."
          />
        ) : (
          <div className="space-y-6">
            {/* Main Transaction Card */}
            <Card className="border-2 border-emerald-200">
              <CardHeader className="bg-emerald-50/50 pb-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      Transaction {activeTxn.id}
                    </CardTitle>
                    <CardDescription className="text-xs text-gray-600">
                      Lot ID: {lot?.id} · {activeTxn.crop} ({formatNumber(activeTxn.quantity)} kg)
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={activeTxn.status === "PAID" ? "success" : "warning"} className="font-bold">
                      {activeTxn.status.replace("_", " ")}
                    </Badge>
                    <Button
                      size="sm"
                      onClick={() => handleAdvance(activeTxn.id)}
                      disabled={advancing || activeTxn.status === "PAID"}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs"
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      {advancing ? "Advancing..." : activeTxn.status === "PAID" ? "PAID ✓" : "Update Delivery Status"}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Financial Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-xl text-center border">
                  <div>
                    <span className="text-[10px] text-gray-500 font-bold block uppercase">Agreed Total Payout</span>
                    <span className="text-lg font-extrabold text-emerald-800">{formatCurrency(activeTxn.totalAmount)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 font-bold block uppercase">Quantity</span>
                    <span className="text-lg font-bold text-gray-900">{formatNumber(activeTxn.quantity)} kg</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 font-bold block uppercase">Unit Rate</span>
                    <span className="text-lg font-bold text-gray-900">₹{(activeTxn.totalAmount / activeTxn.quantity).toFixed(2)}/kg</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 font-bold block uppercase">Buyer Name</span>
                    <span className="text-xs font-bold text-emerald-900 block truncate mt-1">{activeTxn.buyerName}</span>
                  </div>
                </div>

                {/* AI Visual Quality Attached Indicator */}
                {lot && (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-emerald-700" />
                      <div>
                        <span className="font-bold text-emerald-950">AI Visual Quality Assessment Attached: </span>
                        {hasQuality ? (
                          <span className="font-extrabold text-emerald-800">
                            {lot.qualityScore || 87}/100 ({lot.qualityGrade})
                          </span>
                        ) : (
                          <span className="text-gray-500 italic">Not provided</span>
                        )}
                      </div>
                    </div>
                    {hasQuality && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setQualityModalOpen(true)}
                        className="text-xs font-bold bg-white text-emerald-800 border-emerald-300"
                      >
                        <Eye className="h-3.5 w-3.5 mr-1" /> View Quality Evidence
                      </Button>
                    )}
                  </div>
                )}

                {/* PICKUP DETAILS SECTION */}
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
                      <Truck className="h-4 w-4 text-emerald-700" />
                      Where your crop will be collected (Pickup Details)
                    </h3>
                    {activeTxn.driverPhone && (
                      <a
                        href={`tel:${activeTxn.driverPhone}`}
                        className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-xs transition-colors"
                      >
                        <Phone className="h-3.5 w-3.5" /> Call Driver
                      </a>
                    )}
                  </div>

                  {activeTxn.driverName ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white p-3.5 rounded-xl border border-emerald-100">
                      <div>
                        <span className="text-gray-500 text-[10px] font-bold block uppercase">Assigned Driver</span>
                        <span className="font-extrabold text-gray-900 text-sm flex items-center gap-1">
                          <UserCheck className="h-4 w-4 text-emerald-600" />
                          {activeTxn.driverName}
                        </span>
                        <span className="text-gray-600 block text-[11px] mt-0.5">{activeTxn.driverPhone}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 text-[10px] font-bold block uppercase">Vehicle Details</span>
                        <span className="font-extrabold text-gray-900 text-sm">{activeTxn.vehicleNumber}</span>
                        <span className="text-gray-600 block text-[11px] mt-0.5">{activeTxn.vehicleType}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 text-[10px] font-bold block uppercase">Scheduled Pickup Window</span>
                        <span className="font-bold text-emerald-800 text-xs flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                          {activeTxn.pickupWindow || `${activeTxn.pickupDate} · 9:00 AM – 11:00 AM`}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 text-[10px] font-bold block uppercase">Transport Provider</span>
                        <span className="font-bold text-gray-800 text-xs">{activeTxn.transportProvider || "Maharashtra AgriTrans Hub"}</span>
                      </div>
                      <div className="col-span-1 sm:col-span-2 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-600">
                        <span><strong>From:</strong> {activeTxn.pickupLocation}</span>
                        <span><strong>To:</strong> {activeTxn.destination}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-white rounded-xl border border-dashed border-gray-300 text-xs text-gray-500 text-center">
                      Driver details will appear after pickup is assigned.
                    </div>
                  )}

                  {activeTxn.isIllustrativeLogistics && (
                    <p className="text-[10px] text-gray-500 italic">
                      * Illustrative logistics schedule for demonstration of farm-gate collection workflow.
                    </p>
                  )}
                </div>

                {/* Interactive Milestone Timeline */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-emerald-700" />
                    Delivery &amp; Payment Clearance Timeline
                  </h3>
                  <TransactionTimeline currentStatus={activeTxn.status} />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quality Verification Modal */}
        {qualityModalOpen && lot && (
          <QualityVerificationModal
            lot={lot}
            isOpen={qualityModalOpen}
            onClose={() => setQualityModalOpen(false)}
          />
        )}
      </div>
    </AppShell>
  );
}
