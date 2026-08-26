import { NextRequest, NextResponse } from "next/server";
import type { RecommendationResult } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { recommendation, question } = body as {
      recommendation: RecommendationResult;
      question?: string;
    };

    const apiKey = process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY;
    const baseUrl = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
    const model = process.env.AI_MODEL || "gpt-4o-mini";

    if (!apiKey) {
      return NextResponse.json({
        explanation: buildFallbackExplanation(recommendation),
        source: "deterministic",
      });
    }

    const top = recommendation.topRecommendation;
    const alts = recommendation.alternatives
      .map(
        (a, i) =>
          `${i + 2}. ${a.name} — ₹${a.pricePerKg}/kg, net ₹${a.expectedNetRealization}, score ${a.totalScore}`
      )
      .join("\n");

    const systemPrompt = `You are AgriLink, a farmer-friendly agricultural advisor for India.
You MUST ONLY use the structured data provided. NEVER invent prices, buyers, distances, demand levels, or payment reliability scores.
If data is unavailable, say so clearly.
Use simple language suitable for smallholder farmers.
Keep responses under 150 words.`;

    const userPrompt = `Farmer question: ${question || "Where should I sell my crop?"}

Crop details:
- Crop: ${recommendation.lotInput.crop}
- Quantity: ${recommendation.lotInput.quantity} ${recommendation.lotInput.unit}
- Quality: ${recommendation.lotInput.qualityGrade}
- Location: ${recommendation.lotInput.location}
- Selling deadline: ${recommendation.lotInput.sellingDeadlineDays} days
- Storage available: ${recommendation.lotInput.storageAvailableDays} days

TOP RECOMMENDATION (from our decision engine — do not change these numbers):
- ${top.name} (${top.type})
- Price: ₹${top.pricePerKg}/kg
- Expected gross: ₹${top.expectedGross}
- Transport cost: ₹${top.transportCost}
- Storage cost: ₹${top.storageCost}
- Expected NET realization: ₹${top.expectedNetRealization}
- Demand: ${top.demandLevel}
- Distance: ${top.distanceKm} km
- Recommendation score: ${top.totalScore}/100
- Reasons: ${top.reasons.join("; ")}

ALTERNATIVES:
${alts}

Explain WHY the top recommendation is best for this farmer. Reference only the data above.`;

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 300,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({
        explanation: buildFallbackExplanation(recommendation),
        source: "fallback",
      });
    }

    const data = await response.json();
    const explanation =
      data.choices?.[0]?.message?.content ?? buildFallbackExplanation(recommendation);

    return NextResponse.json({ explanation, source: "ai" });
  } catch {
    return NextResponse.json({
      explanation: "Our recommendation engine has calculated the best options. Please review the scores and net realization figures shown above.",
      source: "error-fallback",
    });
  }
}

function buildFallbackExplanation(recommendation: RecommendationResult): string {
  const top = recommendation.topRecommendation;
  const input = recommendation.lotInput;
  return `Based on your ${input.quantity} kg of ${input.qualityGrade} ${input.crop} in ${input.location}, we recommend ${top.name}. At ₹${top.pricePerKg}/kg, after deducting transport (₹${top.transportCost}) and storage (₹${top.storageCost}), your expected net realization is ₹${top.expectedNetRealization}. ${top.reasons.slice(0, 3).join(". ")}. Recommendation score: ${top.totalScore}/100.`;
}
