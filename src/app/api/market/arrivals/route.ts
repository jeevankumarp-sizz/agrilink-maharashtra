import { NextRequest, NextResponse } from "next/server";
import { getMarketPrices } from "@/lib/agmarknet";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const state = searchParams.get("state") || "Maharashtra";
    const commodity = searchParams.get("commodity") || undefined;
    const district = searchParams.get("district") || undefined;

    const result = await getMarketPrices({ state, commodity, district });
    
    // Transform data to emphasize arrivals volume
    const arrivalData = result.data.map((item) => ({
      market: item.market,
      district: item.district,
      commodity: item.commodity,
      arrivals: item.arrivals,
      unit: item.unit,
      date: item.date,
      dataStatus: item.dataStatus,
    }));

    return NextResponse.json(
      {
        ...result,
        data: arrivalData,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        source: "AGMARKNET",
        dataStatus: "error",
        error: error?.message || "Internal server error fetching market arrivals",
      },
      { status: 500 }
    );
  }
}
