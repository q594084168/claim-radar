import { NextRequest, NextResponse } from "next/server";
import {
  collectEnhancedData,
  getClaimsByTag,
  getClaimsByCategory,
  getHighValueClaims,
  getExpiringSoonClaims,
  getNoReceiptClaims,
  getPayPalClaims,
  getClaimsStats,
} from "@/lib/enhanced-data-collector";

// Cache for enhanced data
let cachedData: any[] | null = null;
let cachedStats: any = null;
let lastFetchTime = 0;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tag = searchParams.get("tag");
    const category = searchParams.get("category");
    const highValue = searchParams.get("highValue");
    const expiringSoon = searchParams.get("expiringSoon");
    const noReceipt = searchParams.get("noReceipt");
    const paypal = searchParams.get("paypal");
    const stats = searchParams.get("stats");
    const forceRefresh = searchParams.get("refresh") === "true";

    // Check if we need to refresh data
    const now = Date.now();
    if (!cachedData || forceRefresh || (now - lastFetchTime) > CACHE_DURATION) {
      console.log("Collecting enhanced data...");
      cachedData = await collectEnhancedData();
      cachedStats = getClaimsStats(cachedData);
      lastFetchTime = now;
      console.log(`Enhanced data collected: ${cachedData.length} claims`);
    }

    // If stats requested, return stats
    if (stats === "true") {
      return NextResponse.json({
        success: true,
        stats: cachedStats,
        lastUpdated: new Date(lastFetchTime).toISOString(),
      });
    }

    let filteredClaims = [...cachedData];

    // Apply filters
    if (tag) {
      filteredClaims = getClaimsByTag(filteredClaims, tag);
    }

    if (category) {
      filteredClaims = getClaimsByCategory(filteredClaims, category);
    }

    if (highValue === "true") {
      const minScore = parseInt(searchParams.get("minScore") || "70");
      filteredClaims = getHighValueClaims(filteredClaims, minScore);
    }

    if (expiringSoon === "true") {
      const days = parseInt(searchParams.get("days") || "30");
      filteredClaims = getExpiringSoonClaims(filteredClaims, days);
    }

    if (noReceipt === "true") {
      filteredClaims = getNoReceiptClaims(filteredClaims);
    }

    if (paypal === "true") {
      filteredClaims = getPayPalClaims(filteredClaims);
    }

    // Apply pagination
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
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
        filters: {
          tag,
          category,
          highValue,
          expiringSoon,
          noReceipt,
          paypal,
        },
      },
    });
  } catch (error) {
    console.error("Error in enhanced-claims API:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
