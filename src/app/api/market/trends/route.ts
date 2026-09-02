import { NextRequest, NextResponse } from "next/server";
import { getMarketPrices } from "@/lib/agmarknet";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const commodity = searchParams.get("commodity") || "Tomato";
    const district = searchParams.get("district") || "Nashik";

    const pricesResult = await getMarketPrices({ commodity, district });
    const records = pricesResult.data;

    // Extract actual price observations per date if historical records exist
    const dateMap = new Map<string, number>();
    records.forEach((r) => {
      if (r.date && r.modalPrice) {
        dateMap.set(r.date, r.modalPrice);
      }
    });

    const hasHistoricalTrends = dateMap.size > 1;
    const actualObservations = Array.from(dateMap.entries()).map(([date, price]) => ({
      date,
      modalPrice: price,
    }));

    const currentModal = records[0]?.modalPrice || null;

    return NextResponse.json(
      {
        success: true,
        source: pricesResult.source,
        dataStatus: pricesResult.dataStatus,
        updatedAt: new Date().toISOString(),
        commodity,
        district,
        currentModalPrice: currentModal,
        historicalTrendAvailable: hasHistoricalTrends,
        observationsCount: actualObservations.length,
        observations: actualObservations,
        message: hasHistoricalTrends
          ? "Historical observations derived from actual AGMARKNET records."
          : "Single-day price observation available. Multi-day historical trend data unavailable for this selection.",
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        source: "AGMARKNET",
        dataStatus: "error",
        error: error?.message || "Error fetching price trends",
      },
      { status: 500 }
    );
  }
}
