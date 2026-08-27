import type { CropName, QualityAssessment, QualityGrade, VisualParameters } from "./types";
import { generateId } from "./utils";

export interface QualityAnalysisStep {
  label: string;
  completed: boolean;
  active: boolean;
}

export function analyzeProduceImage(
  imageSrc: string,
  crop: CropName = "Tomato"
): QualityAssessment {
  // Crop-tailored visual assessment defaults
  let qualityScore = 87;
  let grade: QualityGrade = "Grade A";
  let confidence = 89;
  let visualParameters: VisualParameters = {
    colourUniformity: 92,
    sizeUniformity: 84,
    visibleDefectsPct: 6,
    surfaceDamagePct: 4,
    ripenessPct: 88,
  };
  let visibleDefects = ["Minor surface blemishes", "Slight size variation"];
  let explanation = `The image of ${crop} shows relatively uniform color and limited visible surface damage. Minor blemishes and slight size variation slightly reduce the visual quality score.`;

  if (crop === "Onion") {
    qualityScore = 85;
    grade = "Grade A";
    confidence = 91;
    visualParameters = {
      colourUniformity: 89,
      sizeUniformity: 82,
      visibleDefectsPct: 7,
      surfaceDamagePct: 5,
      ripenessPct: 90,
    };
    visibleDefects = ["Dry skin peeling", "Minor neck thickness variation"];
    explanation = "The onion lot displays strong skin firmness and consistent copper-red color. Minor outer skin peeling observed on a few bulbs.";
  } else if (crop === "Potato") {
    qualityScore = 82;
    grade = "Grade B";
    confidence = 86;
    visualParameters = {
      colourUniformity: 85,
      sizeUniformity: 78,
      visibleDefectsPct: 10,
      surfaceDamagePct: 8,
      ripenessPct: 85,
    };
    visibleDefects = ["Minor soil residue", "Slight skin scarring"];
    explanation = "Good tuber firmness and shallow eye depth. Minor soil residue and skin scarring lower the score slightly to Grade B.";
  }

  return {
    id: generateId("QA-MH"),
    product: crop,
    qualityScore,
    grade,
    confidence,
    visualParameters,
    visibleDefects,
    explanation,
    originalImage: imageSrc,
    assessmentTimestamp: new Date().toISOString(),
    assessmentStatus: "AVAILABLE",
  };
}

export const DEMO_QUALITY_ASSESSMENT: QualityAssessment = {
  id: "QA-MH-001",
  lotId: "LOT-MH-001",
  farmerId: "farmer-1",
  product: "Tomato",
  qualityScore: 87,
  grade: "Grade A",
  confidence: 89,
  visualParameters: {
    colourUniformity: 92,
    sizeUniformity: 84,
    visibleDefectsPct: 6,
    surfaceDamagePct: 4,
    ripenessPct: 88,
  },
  visibleDefects: ["Minor surface blemishes", "Slight size variation"],
  explanation: "The image shows relatively uniform colour and limited visible surface damage. Minor blemishes and size variation slightly reduce the visual quality score.",
  originalImage: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=800&auto=format&fit=crop",
  assessmentTimestamp: new Date().toISOString(),
  assessmentStatus: "AVAILABLE",
};
