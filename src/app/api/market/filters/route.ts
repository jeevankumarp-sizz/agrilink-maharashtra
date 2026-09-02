import { NextResponse } from "next/server";
import { getMarketFilters } from "@/lib/agmarknet";

export async function GET() {
  try {
    const result = await getMarketFilters();
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        source: "AGMARKNET",
        dataStatus: "error",
        error: error?.message || "Error fetching market filters",
      },
      { status: 500 }
    );
  }
}
