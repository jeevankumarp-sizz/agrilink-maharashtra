"use client";

import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { analyzeProduceImage } from "@/lib/quality-engine";
import type { CropName, QualityAssessment } from "@/lib/types";
import {
  Camera,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Trash2,
  Loader2,
  Check,
  Eye,
  ShieldAlert,
} from "lucide-react";

interface AiQualityAssessmentProps {
  crop: CropName;
  onApplyAssessment: (assessment: QualityAssessment) => void;
  initialAssessment?: QualityAssessment | null;
}

export function AiQualityAssessment({
  crop,
  onApplyAssessment,
  initialAssessment,
}: AiQualityAssessmentProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(
    initialAssessment?.originalImage || null
  );
  const [analyzing, setAnalyzing] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [assessment, setAssessment] = useState<QualityAssessment | null>(
    initialAssessment || null
  );
  const [applied, setApplied] = useState(!!initialAssessment);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImageSrc(result);
        setAssessment(null);
        setApplied(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageSrc(null);
    setAssessment(null);
    setApplied(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  const handleAnalyze = async () => {
    if (!imageSrc) return;
    setAnalyzing(true);
    setStepIndex(1);

    // Simulate multi-step analysis sequence for responsive visual feedback
    await new Promise((r) => setTimeout(r, 600));
    setStepIndex(2);

    await new Promise((r) => setTimeout(r, 700));
    setStepIndex(3);

    await new Promise((r) => setTimeout(r, 700));
    setStepIndex(4);

    await new Promise((r) => setTimeout(r, 500));

    const result = analyzeProduceImage(imageSrc, crop);
    setAssessment(result);
    setAnalyzing(false);
  };

  const handleApply = () => {
    if (assessment) {
      onApplyAssessment(assessment);
      setApplied(true);
    }
  };

  const steps = [
    { label: "Image uploaded", done: stepIndex >= 1, active: stepIndex === 1 },
    { label: "Product detected", done: stepIndex >= 2, active: stepIndex === 2 },
    { label: "Visual quality analysis", done: stepIndex >= 3, active: stepIndex === 3 },
    { label: "Grade estimation", done: stepIndex >= 4, active: stepIndex === 4 },
    { label: "Recommendation ready", done: stepIndex >= 4, active: false },
  ];

  return (
    <Card className="border-2 border-emerald-200 bg-emerald-50/20 shadow-xs">
      <CardHeader className="bg-emerald-100/50 pb-3 border-b border-emerald-200">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold text-emerald-950 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-700" />
            AI Visual Quality Assessment
          </CardTitle>
          <Badge variant="verified" className="bg-emerald-700 text-white font-bold text-[10px]">
            OPTIONAL — RECOMMENDED
          </Badge>
        </div>
        <p className="text-xs text-gray-600 mt-1">
          Upload or capture a photo of your produce. Our visual AI assesses color uniformity, size, defects, and surface damage to estimate visual grade.
        </p>
      </CardHeader>

      <CardContent className="p-4 space-y-4 text-xs">
        {/* Hidden inputs for camera capture & file upload */}
        <input
          type="file"
          ref={cameraInputRef}
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {!imageSrc && (
          <div className="border-2 border-dashed border-emerald-300 rounded-2xl p-6 bg-white text-center space-y-3">
            <div className="flex justify-center gap-3">
              <Button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Camera className="h-4 w-4" /> Take Photo
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="border-emerald-300 text-emerald-900 font-bold text-xs flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100"
              >
                <Upload className="h-4 w-4" /> Upload Image
              </Button>
            </div>
            <p className="text-[11px] text-gray-500">
              Supports mobile camera capture &amp; desktop file upload (JPG, PNG, WebP).
            </p>
          </div>
        )}

        {imageSrc && !assessment && !analyzing && (
          <div className="bg-white p-4 rounded-2xl border border-emerald-200 space-y-3">
            <div className="flex items-center gap-4">
              <div className="relative h-24 w-24 rounded-xl overflow-hidden border border-gray-200 shrink-0 bg-gray-50">
                <img
                  src={imageSrc}
                  alt="Uploaded Produce"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="space-y-1.5 flex-1">
                <p className="font-bold text-gray-900 text-sm">Produce Image Selected</p>
                <p className="text-gray-500 text-xs">Ready for visual AI quality analysis.</p>
                <div className="flex gap-2 pt-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-bold"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" /> Retake
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleRemoveImage}
                    className="text-xs font-bold text-red-600 hover:bg-red-50 border-red-200"
                  >
                    <Trash2 className="h-3 w-3 mr-1" /> Remove
                  </Button>
                </div>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleAnalyze}
              size="lg"
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm"
            >
              <Sparkles className="h-4 w-4 mr-1.5" /> Analyze Quality with AI
            </Button>
          </div>
        )}

        {/* Stepper view during analysis */}
        {analyzing && (
          <div className="bg-white p-5 rounded-2xl border border-emerald-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-bold text-emerald-950 text-sm flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-emerald-700" />
                Analyzing Produce Image...
              </span>
              <Badge variant="warning" className="animate-pulse">Processing</Badge>
            </div>
            <div className="space-y-2">
              {steps.map((s, idx) => (
                <div key={s.label} className="flex items-center gap-2 text-xs">
                  {s.done ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  ) : s.active ? (
                    <Loader2 className="h-4 w-4 text-amber-600 animate-spin shrink-0" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-gray-200 shrink-0" />
                  )}
                  <span className={s.done ? "font-bold text-emerald-900" : s.active ? "font-bold text-amber-900" : "text-gray-400"}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quality Assessment Results Card */}
        {assessment && !analyzing && (
          <div className="bg-white p-4 rounded-2xl border-2 border-emerald-500 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                  AI VISUAL QUALITY ASSESSMENT
                </span>
                <p className="font-extrabold text-gray-900 text-base">{crop} Produce Assessment</p>
              </div>
              <Badge variant="verified" className="bg-emerald-700 text-white font-bold text-xs px-2.5 py-1">
                {assessment.grade}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-center">
                <span className="text-gray-500 text-[10px] block font-semibold">Quality Score</span>
                <span className="text-2xl font-extrabold text-emerald-800">{assessment.qualityScore} / 100</span>
              </div>
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-center">
                <span className="text-gray-500 text-[10px] block font-semibold">Preliminary Grade</span>
                <span className="text-2xl font-extrabold text-emerald-800">{assessment.grade}</span>
              </div>
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-center">
                <span className="text-gray-500 text-[10px] block font-semibold">AI Confidence</span>
                <span className="text-2xl font-extrabold text-emerald-800">{assessment.confidence}%</span>
              </div>
            </div>

            {/* Visual Parameters Breakdown Bars */}
            <div className="space-y-2 pt-1">
              <p className="font-bold text-gray-900 text-xs">Visual Parameters:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className="bg-gray-50 p-2 rounded-lg border">
                  <div className="flex justify-between font-semibold text-gray-700 mb-1">
                    <span>Colour Uniformity</span>
                    <span className="font-bold">{assessment.visualParameters.colourUniformity}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${assessment.visualParameters.colourUniformity}%` }} />
                  </div>
                </div>

                <div className="bg-gray-50 p-2 rounded-lg border">
                  <div className="flex justify-between font-semibold text-gray-700 mb-1">
                    <span>Size Uniformity</span>
                    <span className="font-bold">{assessment.visualParameters.sizeUniformity}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${assessment.visualParameters.sizeUniformity}%` }} />
                  </div>
                </div>

                <div className="bg-gray-50 p-2 rounded-lg border">
                  <div className="flex justify-between font-semibold text-gray-700 mb-1">
                    <span>Visible Defects</span>
                    <span className="font-bold">{assessment.visualParameters.visibleDefectsPct}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${assessment.visualParameters.visibleDefectsPct}%` }} />
                  </div>
                </div>

                <div className="bg-gray-50 p-2 rounded-lg border">
                  <div className="flex justify-between font-semibold text-gray-700 mb-1">
                    <span>Surface Damage</span>
                    <span className="font-bold">{assessment.visualParameters.surfaceDamagePct}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${assessment.visualParameters.surfaceDamagePct}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Detected Issues */}
            <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200 space-y-1">
              <p className="font-bold text-amber-950 text-xs">Detected Visible Issues:</p>
              <ul className="list-disc list-inside text-[11px] text-amber-900 space-y-0.5">
                {assessment.visibleDefects.map((defect) => (
                  <li key={defect}>{defect}</li>
                ))}
              </ul>
            </div>

            {/* AI Explanation */}
            <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200 text-xs text-gray-800 leading-relaxed">
              <p className="font-bold text-emerald-950 mb-0.5 flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-emerald-700" /> AI Explanation:
              </p>
              {assessment.explanation}
            </div>

            {/* Disclaimer */}
            <div className="p-3 bg-gray-100 rounded-xl border border-gray-200 text-[10px] text-gray-600 leading-relaxed flex items-start gap-2">
              <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                ⚠️ AI Quality Assessment is a preliminary visual assessment based on the uploaded image. It is not a laboratory test, statutory quality certificate, or substitute for physical inspection/testing.
              </span>
            </div>

            {/* Apply Button */}
            <div className="pt-2">
              <Button
                type="button"
                onClick={handleApply}
                disabled={applied}
                size="lg"
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm"
              >
                {applied ? "✓ Assessment Applied to Crop Lot" : "Use Assessment in My Crop Lot"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
