"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Lot, VisualParameters } from "@/lib/types";
import { actionCreateGrievance } from "@/actions/agri-actions";
import {
  X,
  Eye,
  ShieldAlert,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Maximize2,
  FileText,
  AlertTriangle,
} from "lucide-react";

interface QualityVerificationModalProps {
  lot: Lot;
  isOpen: boolean;
  onClose: () => void;
  buyerId?: string;
  buyerName?: string;
}

export function QualityVerificationModal({
  lot,
  isOpen,
  onClose,
  buyerId = "buyer-1",
  buyerName = "FreshFoods Maharashtra",
}: QualityVerificationModalProps) {
  const [fullImageOpen, setFullImageOpen] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [concernReason, setConcernReason] = useState("Visible quality differs from description");
  const [concernNotes, setConcernNotes] = useState("");
  const [reporting, setReporting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  if (!isOpen) return null;

  const imageSrc =
    lot.qualityImage ||
    "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=800&auto=format&fit=crop";

  const params: VisualParameters = lot.qualityParameters || {
    colourUniformity: 92,
    sizeUniformity: 84,
    visibleDefectsPct: 6,
    surfaceDamagePct: 4,
    ripenessPct: 88,
  };

  const defects = lot.visibleDefects || ["Minor surface blemishes", "Slight size variation"];
  const explanation =
    lot.qualityExplanation ||
    "The image shows relatively uniform colour and limited visible surface damage. Minor blemishes and size variation slightly reduce the visual quality score.";

  const handleReportConcern = async (e: React.FormEvent) => {
    e.preventDefault();
    setReporting(true);
    try {
      await actionCreateGrievance({
        lotId: lot.id,
        qualityAssessmentId: lot.qualityAssessmentId || "QA-MH-001",
        raisedBy: buyerId,
        farmerName: lot.farmerName,
        category: "Quality Discrepancy",
        description: `Quality concern logged by ${buyerName}: ${concernReason}. Notes: ${concernNotes || 'Visual inspection requested.'}`,
      });
      setReportSuccess(true);
      setTimeout(() => {
        setReportSuccess(false);
        setShowReportForm(false);
      }, 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setReporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8 border border-emerald-100 animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="bg-emerald-900 text-white p-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="verified" className="bg-emerald-700 text-emerald-100 text-[10px]">
                QUALITY VERIFICATION EVIDENCE
              </Badge>
              <span className="text-xs text-emerald-200 font-mono">Lot #{lot.id}</span>
            </div>
            <h2 className="text-xl font-bold mt-1 text-white flex items-center gap-2">
              <span>{lot.crop} Quality Inspection</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="h-9 w-9 rounded-full bg-emerald-800 hover:bg-emerald-700 flex items-center justify-center text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto text-xs">
          {/* Section 1: Original Farmer-Uploaded Image */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                <Eye className="h-4 w-4 text-emerald-700" /> Original Farmer Produce Photo
              </p>

            </div>

            <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-200 bg-gray-900 group max-h-72 flex items-center justify-center">
              <img
                src={imageSrc}
                alt={`Original ${lot.crop} produce photo uploaded by ${lot.farmerName}`}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-between p-4">
                <span className="text-white text-xs font-semibold drop-shadow-md">
                  Photo uploaded by farmer: {lot.farmerName} ({lot.location})
                </span>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setFullImageOpen(true)}
                  className="bg-white/90 hover:bg-white text-gray-900 font-bold text-xs shadow-md"
                >
                  <Maximize2 className="h-3.5 w-3.5 mr-1" /> View Full Image
                </Button>
              </div>
            </div>
          </div>

          {/* Section 2: AI Visual Quality Assessment Summary */}
          <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200 space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
              <span className="font-extrabold text-emerald-950 text-sm flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-emerald-700" />
                AI Visual Quality Metrics
              </span>
              <Badge variant="verified" className="bg-emerald-700 text-white font-bold text-xs px-2.5 py-0.5">
                AI Grade: {lot.qualityGrade || "Grade A"}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-white p-3 rounded-xl border border-emerald-200 shadow-2xs">
                <span className="text-gray-500 text-[10px] block font-semibold">Visual Quality Score</span>
                <span className="text-2xl font-extrabold text-emerald-800">{lot.qualityScore || 87} / 100</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-emerald-200 shadow-2xs">
                <span className="text-gray-500 text-[10px] block font-semibold">Preliminary Grade</span>
                <span className="text-2xl font-extrabold text-emerald-800">{lot.qualityGrade || "Grade A"}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-emerald-200 shadow-2xs">
                <span className="text-gray-500 text-[10px] block font-semibold">AI Confidence</span>
                <span className="text-2xl font-extrabold text-emerald-800">{lot.qualityConfidence || 89}%</span>
              </div>
            </div>

            {/* Visual Parameters Bars */}
            <div className="space-y-2 pt-1">
              <p className="font-bold text-gray-900 text-xs">Visual Parameters:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                  <div className="flex justify-between font-semibold text-gray-700 mb-1">
                    <span>Colour Uniformity</span>
                    <span className="font-bold text-emerald-800">{params.colourUniformity}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${params.colourUniformity}%` }} />
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                  <div className="flex justify-between font-semibold text-gray-700 mb-1">
                    <span>Size Uniformity</span>
                    <span className="font-bold text-emerald-800">{params.sizeUniformity}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${params.sizeUniformity}%` }} />
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                  <div className="flex justify-between font-semibold text-gray-700 mb-1">
                    <span>Visible Defects</span>
                    <span className="font-bold text-amber-700">{params.visibleDefectsPct}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${params.visibleDefectsPct}%` }} />
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                  <div className="flex justify-between font-semibold text-gray-700 mb-1">
                    <span>Surface Damage</span>
                    <span className="font-bold text-amber-700">{params.surfaceDamagePct}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${params.surfaceDamagePct}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Detected Visible Issues */}
            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 space-y-1">
              <p className="font-bold text-amber-950 text-xs">Detected Visible Issues:</p>
              <ul className="list-disc list-inside text-[11px] text-amber-900 space-y-0.5">
                {defects.map((defect) => (
                  <li key={defect}>{defect}</li>
                ))}
              </ul>
            </div>

            {/* AI Explanation */}
            <div className="bg-white p-3 rounded-xl border border-emerald-200 text-xs text-gray-800 leading-relaxed">
              <p className="font-bold text-emerald-950 mb-0.5 flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-emerald-700" /> AI Explanation:
              </p>
              {explanation}
            </div>

            {/* Mandatory Disclaimer */}
            <div className="p-3 bg-amber-100/80 rounded-xl border border-amber-300 text-[10px] text-amber-950 leading-relaxed flex items-start gap-2">
              <ShieldAlert className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                ⚠️ AI Quality Assessment is a preliminary visual assessment based on the uploaded image. It is not a laboratory test, statutory quality certificate, or substitute for physical inspection/testing.
              </span>
            </div>
          </div>

          {/* Optional Quality Concern Form */}
          {showReportForm && (
            <form onSubmit={handleReportConcern} className="bg-red-50 p-4 rounded-2xl border border-red-200 space-y-3">
              <p className="font-bold text-red-950 text-xs flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-red-600" /> Report Quality Concern
              </p>

              {reportSuccess && (
                <div className="p-2.5 bg-emerald-100 text-emerald-900 rounded-lg text-xs font-bold">
                  ✓ Quality concern logged successfully with Grievance Center!
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">Reason for Concern</label>
                <select
                  value={concernReason}
                  onChange={(e) => setConcernReason(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white p-2 text-xs"
                >
                  <option>Visible quality differs from description</option>
                  <option>Image does not match lot specification</option>
                  <option>Excessive surface damage detected</option>
                  <option>Incorrect product grade category</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">Additional Notes</label>
                <textarea
                  value={concernNotes}
                  onChange={(e) => setConcernNotes(e.target.value)}
                  placeholder="Describe your quality concern..."
                  rows={2}
                  className="w-full rounded-xl border border-gray-200 bg-white p-2 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" size="sm" variant="outline" onClick={() => setShowReportForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-red-600 hover:bg-red-700 text-white font-bold" disabled={reporting}>
                  {reporting ? "Submitting..." : "Submit Quality Concern"}
                </Button>
              </div>
            </form>
          )}

          {/* Modal Footer Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowReportForm(!showReportForm)}
              className="text-xs font-bold text-red-700 border-red-200 hover:bg-red-50"
            >
              <AlertCircle className="h-3.5 w-3.5 mr-1" />
              Report Quality Concern
            </Button>

            <Button
              type="button"
              onClick={onClose}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs"
            >
              Close Quality Evidence
            </Button>
          </div>
        </div>
      </div>

      {/* Lightbox Modal for Full Image */}
      {fullImageOpen && (
        <div className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setFullImageOpen(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 font-bold text-sm bg-black/50 px-3 py-1 rounded-full"
            >
              Close ✕
            </button>
            <img
              src={imageSrc}
              alt="Full produce photo"
              className="max-h-[85vh] max-w-full object-contain rounded-2xl border-2 border-white/20"
            />
          </div>
        </div>
      )}
    </div>
  );
}
