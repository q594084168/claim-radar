import { NextRequest, NextResponse } from "next/server";
import { collectRealData, getClaimsByCountry, getClaimsByCategory, getNoReceiptClaims, getPaypalClaims } from "@/lib/real-data-collector";

// Cache for real data (refresh every hour)
let cachedData: any[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const country = searchParams.get("country");
    const category = searchParams.get("category");
    const noReceipt = searchParams.get("noReceipt");
    const paypal = searchParams.get("paypal");
    const forceRefresh = searchParams.get("refresh") === "true";

    // Check if we need to refresh data
    const now = Date.now();
    if (!cachedData || forceRefresh || (now - lastFetchTime) > CACHE_DURATION) {
      console.log("Fetching real data from RSS feeds...");
      cachedData = await collectRealData();
      lastFetchTime = now;
      console.log(`Fetched ${cachedData.length} claims from real sources`);
    }

    let filteredClaims = [...cachedData];

    // Apply filters
    if (country) {
      filteredClaims = getClaimsByCountry(filteredClaims, country);
    }

    if (category) {
      filteredClaims = getClaimsByCategory(filteredClaims, category);
    }

    if (noReceipt === "true") {
      filteredClaims = getNoReceiptClaims(filteredClaims);
    }

    if (paypal === "true") {
      filteredClaims = getPaypalClaims(filteredClaims);
    }

    // Apply pagination
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    const total = filteredClaims.length;
    const paginatedClaims = filteredClaims.slice(offset, offset + limit);

    return NextResponse.json({
      claims: paginatedClaims,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
      meta: {
        sources: ["TopClassActions", "ClassAction.org"],
        lastUpdated: new Date(lastFetchTime).toISOString(),
        cacheExpiry: new Date(lastFetchTime + CACHE_DURATION).toISOString(),
      },
    });
  } catch (error) {
    console.error("Error in real-claims API:", error);
    return NextResponse.json(
      { error: "Failed to fetch real claims data" },
      { status: 500 }
    );
  }
}
