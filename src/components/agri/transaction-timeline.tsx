"use client";

import { Badge } from "@/components/ui/badge";
import type { TransactionStatus } from "@/lib/types";
import { CheckCircle2, Circle, Clock } from "lucide-react";

const STEPS: { status: TransactionStatus; label: string }[] = [
  { status: "OFFER_ACCEPTED", label: "Offer Accepted" },
  { status: "LOGISTICS_SCHEDULED", label: "Logistics Scheduled" },
  { status: "PICKUP_CONFIRMED", label: "Pickup Confirmed" },
  { status: "DELIVERED", label: "Delivered" },
  { status: "PAYMENT_PENDING", label: "Payment Pending" },
  { status: "PAID", label: "Paid" },
];

export function TransactionTimeline({ currentStatus }: { currentStatus: TransactionStatus }) {
  const currentIdx = STEPS.findIndex((s) => s.status === currentStatus);

  return (
    <div className="space-y-0">
      {STEPS.map((step, idx) => {
        const done = idx <= currentIdx;
        const current = idx === currentIdx;
        return (
          <div key={step.status} className="flex gap-4">
            <div className="flex flex-col items-center">
              {done ? (
                <CheckCircle2
                  className={`h-6 w-6 ${current ? "text-emerald-600" : "text-emerald-400"}`}
                />
              ) : (
                <Circle className="h-6 w-6 text-gray-300" />
              )}
              {idx < STEPS.length - 1 && (
                <div className={`w-0.5 flex-1 min-h-[24px] ${done ? "bg-emerald-400" : "bg-gray-200"}`} />
              )}
            </div>
            <div className="pb-6">
              <p className={`font-medium ${done ? "text-gray-900" : "text-gray-400"}`}>
                {step.label}
              </p>
              {current && (
                <Badge variant="warning" className="mt-1">
                  <Clock className="mr-1 h-3 w-3" /> Current
                </Badge>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
