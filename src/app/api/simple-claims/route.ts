import { NextRequest, NextResponse } from "next/server";
import { collectSimpleData, getDataStats, SimpleClaim } from "@/lib/simple-data-collector";

// Server-side cache
let cachedData: SimpleClaim[] | null = null;
let cachedStats: any = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const statsOnly = searchParams.get("stats") === "true";
    const forceRefresh = searchParams.get("refresh") === "true";
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Check cache
    const now = Date.now();
    if (!cachedData || forceRefresh || (now - lastFetchTime) > CACHE_DURATION) {
      console.log("Fetching fresh data...");
      cachedData = await collectSimpleData();
      cachedStats = getDataStats(cachedData);
      lastFetchTime = now;
      console.log(`Data cached: ${cachedData.length} claims`);
    }

    // Return stats only
    if (statsOnly) {
      return NextResponse.json({
        success: true,
        stats: cachedStats,
        lastUpdated: new Date(lastFetchTime).toISOString(),
      });
    }

    // Apply filters
    let filteredClaims = [...cachedData];

    const country = searchParams.get("country");
    const category = searchParams.get("category");
    const noReceipt = searchParams.get("noReceipt");
    const highValue = searchParams.get("highValue");
    const source = searchParams.get("source");
    const search = searchParams.get("search");

    if (country) {
      filteredClaims = filteredClaims.filter((c) => c.country === country);
    }

    if (category) {
      filteredClaims = filteredClaims.filter((c) => c.category === category);
    }

    if (noReceipt === "true") {
      filteredClaims = filteredClaims.filter((c) => !c.needReceipt);
    }

    if (highValue === "true") {
      filteredClaims = filteredClaims.filter((c) => (c.estimatedMax || 0) >= 500);
    }

    if (source) {
      filteredClaims = filteredClaims.filter((c) => c.sourceName === source);
    }

    if (search) {
      const query = search.toLowerCase();
      filteredClaims = filteredClaims.filter(
        (c) =>
          c.title.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query)
      );
    }

    // Apply pagination
    const total = filteredClaims.length;
    const paginatedClaims = filteredClaims.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      claims: paginatedClaims,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
      meta: {
        lastUpdated: new Date(lastFetchTime).toISOString(),
        cacheExpiry: new Date(lastFetchTime + CACHE_DURATION).toISOString(),
        sources: ["TopClassActions", "ClaimDepot"],
      },
    });
  } catch (error) {
    console.error("Error in simple-claims API:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
