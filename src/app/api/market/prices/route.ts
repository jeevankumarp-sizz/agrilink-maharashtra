import { NextRequest, NextResponse } from "next/server";
import { getMarketPrices } from "@/lib/agmarknet";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const state = searchParams.get("state") || "Maharashtra";
    const commodity = searchParams.get("commodity") || undefined;
    const district = searchParams.get("district") || undefined;
    const market = searchParams.get("market") || undefined;
    const date = searchParams.get("date") || undefined;

    const result = await getMarketPrices({
      state,
      commodity,
      district,
      market,
      date,
    });

    return NextResponse.json(result, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        source: "AGMARKNET",
        dataStatus: "error",
        error: error?.message || "Internal server error fetching market prices",
      },
      { status: 500 }
    );
  }
}
